import crypto from 'crypto'
import zip from 'lodash.zipobject'

import 'isomorphic-fetch'

const BASE = 'https://api.binance.com'

const defaultGetTime = () => Date.now()

/**
 * Build query string for uri encoded url based on json object
 */
const makeQueryString = q =>
  q
    ? `?${Object.keys(q)
        .map(k => `${encodeURIComponent(k)}=${encodeURIComponent(q[k])}`)
        .join('&')}`
    : ''

/**
 * Finalize API response
 */
const sendResult = call =>
  call.then(res => {
    // If response is ok, we can safely asume it is valid JSON
    if (res.ok) {
      return res.json()
    }

    // Errors might come from the API itself or the proxy Binance is using.
    // For API errors the response will be valid JSON,but for proxy errors
    // it will be HTML
    return res.text().then(text => {
      let error;
      try {
        const json = JSON.parse(text)
        // The body was JSON parseable, assume it is an API response error
        error = new Error(json.msg || `${res.status} ${res.statusText}`)
        error.code = json.code
      } catch (e) {
        // The body was not JSON parseable, assume it is proxy error
        error = new Error(`${res.status} ${res.statusText} ${text}`)
        error.response = res
        error.responseText = text
      }
      throw error
    })
  })

/**
 * Util to validate existence of required parameter(s)
 */
const checkParams = (name, payload, requires = []) => {
  if (!payload) {
    throw new Error('You need to pass a payload object.')
  }

  requires.forEach(r => {
    if (!payload[r] && isNaN(payload[r])) {
      throw new Error(`Method ${name} requires ${r} parameter.`)
    }
  })

  return true
}

/**
 * Make public calls against the api
 *
 * @param {string} path Endpoint path
 * @param {object} data The payload to be sent
 * @param {string} method HTTB VERB, GET by default
 * @param {object} headers
 * @returns {object} The api response
 */
const publicCall = ({ base }) => (path, data, method = 'GET', headers = {}) =>
  sendResult(
    fetch(`${base}/api${path}${makeQueryString(data)}`, {
      method,
      json: true,
      headers,
    }),
  )

/**
 * Factory method for partial private calls against the api
 *
 * @param {string} path Endpoint path
 * @param {object} data The payload to be sent
 * @param {string} method HTTB VERB, GET by default
 * @returns {object} The api response
 */
const keyCall = ({ apiKey, pubCall }) => (path, data, method = 'GET') => {
  if (!apiKey) {
    throw new Error('You need to pass an API key to make this call.')
  }

  return pubCall(path, data, method, {
    'X-MBX-APIKEY': apiKey,
  })
}

/**
 * Factory method for private calls against the api
 *
 * @param {string} path Endpoint path
 * @param {object} data The payload to be sent
 * @param {string} method HTTB VERB, GET by default
 * @param {object} headers
 * @returns {object} The api response
 */
const privateCall = ({ apiKey, apiSecret, base, getTime = defaultGetTime, pubCall }) => (
  path,
  data = {},
  method = 'GET',
  noData,
  noExtra,
) => {
  if (!apiKey || !apiSecret) {
    throw new Error('You need to pass an API key and secret to make authenticated calls.')
  }

  return (data && data.useServerTime
    ? pubCall('/v1/time').then(r => r.serverTime)
    : Promise.resolve(getTime())
  ).then(timestamp => {
    if (data) {
      delete data.useServerTime
    }

    const signature = crypto
      .createHmac('sha256', apiSecret)
      .update(makeQueryString({ ...data, timestamp }).substr(1))
      .digest('hex')

    const newData = noExtra ? data : { ...data, timestamp, signature }

    return sendResult(
      fetch(
        `${base}${path.includes('/wapi') ? '' : '/api'}${path}${noData
          ? ''
          : makeQueryString(newData)}`,
        {
          method,
          headers: { 'X-MBX-APIKEY': apiKey },
          json: true,
        },
      ),
    )
  })
}

export const candleFields = [
  'openTime',
  'open',
  'high',
  'low',
  'close',
  'volume',
  'closeTime',
  'quoteVolume',
  'trades',
  'baseAssetVolume',
  'quoteAssetVolume',
]

/**
 * Get candles for a specific pair and interval and convert response
 * to a user friendly collection.
 */
const candles = (pubCall, payload) =>
  checkParams('candles', payload, ['symbol']) &&
  pubCall('/v1/klines', { interval: '5m', ...payload }).then(candles =>
    candles.map(candle => zip(candleFields, candle)),
  )

/**
 * Create a new order wrapper for market order simplicity
 */
const order = (privCall, payload = {}, url) => {
  const newPayload =
    ['LIMIT', 'STOP_LOSS_LIMIT', 'TAKE_PROFIT_LIMIT'].includes(payload.type) || !payload.type
      ? { timeInForce: 'GTC', ...payload }
      : payload

  return (
    checkParams('order', newPayload, ['symbol', 'side', 'quantity']) &&
    privCall(url, { type: 'LIMIT', ...newPayload }, 'POST')
  )
}

/**
 * Zip asks and bids reponse from order book
 */
const book = (pubCall, payload) =>
  checkParams('book', payload, ['symbol']) &&
  pubCall('/v1/depth', payload).then(({ lastUpdateId, asks, bids }) => ({
    lastUpdateId,
    asks: asks.map(a => zip(['price', 'quantity'], a)),
    bids: bids.map(b => zip(['price', 'quantity'], b)),
  }))

const aggTrades = (pubCall, payload) =>
  checkParams('aggTrades', payload, ['symbol']) &&
  pubCall('/v1/aggTrades', payload).then(trades =>
    trades.map(trade => ({
      aggId: trade.a,
      price: trade.p,
      quantity: trade.q,
      firstId: trade.f,
      lastId: trade.l,
      time: trade.T,
      isBuyerMaker: trade.m,
      isBestMatch: trade.M,
    })),
  )

export default opts => {
  const base = opts && opts.httpBase || BASE;
  const pubCall = publicCall({ ...opts, base })
  const privCall = privateCall({ ...opts, base, pubCall })
  const kCall = keyCall({ ...opts, pubCall })

  return {
    ping: () => pubCall('/v1/ping').then(() => true),
    time: () => pubCall('/v1/time').then(r => r.serverTime),
    exchangeInfo: () => pubCall('/v1/exchangeInfo'),

    book: payload => book(pubCall, payload),
    aggTrades: payload => aggTrades(pubCall, payload),
    candles: payload => candles(pubCall, payload),

    trades: payload =>
      checkParams('trades', payload, ['symbol']) && pubCall('/v1/trades', payload),
    tradesHistory: payload =>
      checkParams('tradesHitory', payload, ['symbol']) && kCall('/v1/historicalTrades', payload),

    dailyStats: payload => pubCall('/v1/ticker/24hr', payload),
    prices: () =>
      pubCall('/v1/ticker/allPrices').then(r =>
        r.reduce((out, cur) => ((out[cur.symbol] = cur.price), out), {}),
      ),
    
    avgPrice: payload => pubCall('/v3/avgPrice', payload),

    allBookTickers: () =>
      pubCall('/v1/ticker/allBookTickers').then(r =>
        r.reduce((out, cur) => ((out[cur.symbol] = cur), out), {}),
      ),

    order: payload => order(privCall, payload, '/v3/order'),
    orderTest: payload => order(privCall, payload, '/v3/order/test'),
    getOrder: payload => privCall('/v3/order', payload),
    cancelOrder: payload => privCall('/v3/order', payload, 'DELETE'),

    openOrders: payload => privCall('/v3/openOrders', payload),
    allOrders: payload => privCall('/v3/allOrders', payload),

    accountInfo: payload => privCall('/v3/account', payload),
    myTrades: payload => privCall('/v3/myTrades', payload),

    withdraw: payload => privCall('/wapi/v3/withdraw.html', payload, 'POST'),
    withdrawHistory: payload => privCall('/wapi/v3/withdrawHistory.html', payload),
    depositHistory: payload => privCall('/wapi/v3/depositHistory.html', payload),
    depositAddress: payload => privCall('/wapi/v3/depositAddress.html', payload),
    tradeFee: payload => privCall('/wapi/v3/tradeFee.html', payload).then(res => res.tradeFee),
    assetDetail: payload => privCall('/wapi/v3/assetDetail.html', payload),

    getDataStream: () => privCall('/v1/userDataStream', null, 'POST', true),
    keepDataStream: payload => privCall('/v1/userDataStream', payload, 'PUT', false, true),
    closeDataStream: payload => privCall('/v1/userDataStream', payload, 'DELETE', false, true),
  }
}
