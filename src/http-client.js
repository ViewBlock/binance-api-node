import crypto from 'crypto'
import zip from 'lodash.zipobject'

import 'isomorphic-fetch'

const BASE = 'https://api.binance.com'
const FUTURES = 'https://fapi.binance.com'

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
    // If response is ok, we can safely assume it is valid JSON
    if (res.ok) {
      return res.json()
    }

    // Errors might come from the API itself or the proxy Binance is using.
    // For API errors the response will be valid JSON,but for proxy errors
    // it will be HTML
    return res.text().then(text => {
      let error
      try {
        const json = JSON.parse(text)
        // The body was JSON parseable, assume it is an API response error
        error = new Error(json.msg || `${res.status} ${res.statusText}`)
        error.code = json.code
        error.url = res.url
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
const publicCall = ({ endpoints }) => (path, data, method = 'GET', headers = {}) =>
  sendResult(
    fetch(
      `${!path.includes('/fapi') ? endpoints.base : endpoints.futures}${path}${makeQueryString(
        data,
      )}`,
      {
        method,
        json: true,
        headers,
      },
    ),
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
const privateCall = ({ apiKey, apiSecret, endpoints, getTime = defaultGetTime, pubCall }) => (
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
    ? pubCall('/api/v3/time').then(r => r.serverTime)
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
        `${!path.includes('/fapi') ? endpoints.base : endpoints.futures}${path}${
          noData ? '' : makeQueryString(newData)
        }`,
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
const candles = (pubCall, payload, endpoint = '/api/v3/klines') =>
  checkParams('candles', payload, ['symbol']) &&
  pubCall(endpoint, { interval: '5m', ...payload }).then(candles =>
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

  const requires = ['symbol', 'side']

  if (!(newPayload.type === 'MARKET' && newPayload.quoteOrderQty)) {
    requires.push('quantity')
  }

  return (
    checkParams('order', newPayload, requires) &&
    privCall(url, { type: 'LIMIT', ...newPayload }, 'POST')
  )
}

const orderOco = (privCall, payload = {}, url) => {
  const newPayload =
    payload.stopLimitPrice && !payload.stopLimitTimeInForce
      ? { stopLimitTimeInForce: 'GTC', ...payload }
      : payload

  return (
    checkParams('order', newPayload, ['symbol', 'side', 'quantity', 'price', 'stopPrice']) &&
    privCall(url, newPayload, 'POST')
  )
}

/**
 * Zip asks and bids reponse from order book
 */
const book = (pubCall, payload, endpoint = '/api/v3/depth') =>
  checkParams('book', payload, ['symbol']) &&
  pubCall(endpoint, payload).then(({ lastUpdateId, asks, bids }) => ({
    lastUpdateId,
    asks: asks.map(a => zip(['price', 'quantity'], a)),
    bids: bids.map(b => zip(['price', 'quantity'], b)),
  }))

const aggTrades = (pubCall, payload, endpoint = '/api/v3/aggTrades') =>
  checkParams('aggTrades', payload, ['symbol']) &&
  pubCall(endpoint, payload).then(trades =>
    trades.map(trade => ({
      aggId: trade.a,
      symbol: payload.symbol,
      price: trade.p,
      quantity: trade.q,
      firstId: trade.f,
      lastId: trade.l,
      timestamp: trade.T,
      isBuyerMaker: trade.m,
      wasBestPrice: trade.M,
    })),
  )

export default opts => {
  const endpoints = {
    base: (opts && opts.httpBase) || BASE,
    futures: (opts && opts.httpFutures) || FUTURES,
  }

  const pubCall = publicCall({ ...opts, endpoints })
  const privCall = privateCall({ ...opts, endpoints, pubCall })
  const kCall = keyCall({ ...opts, pubCall })

  return {
    ping: () => pubCall('/api/v3/ping').then(() => true),
    time: () => pubCall('/api/v3/time').then(r => r.serverTime),
    exchangeInfo: () => pubCall('/api/v3/exchangeInfo'),

    book: payload => book(pubCall, payload),
    aggTrades: payload => aggTrades(pubCall, payload),
    candles: payload => candles(pubCall, payload),

    trades: payload =>
      checkParams('trades', payload, ['symbol']) && pubCall('/api/v3/trades', payload),
    tradesHistory: payload =>
      checkParams('tradesHitory', payload, ['symbol']) &&
      kCall('/api/v3/historicalTrades', payload),

    dailyStats: payload => pubCall('/api/v3/ticker/24hr', payload),
    prices: payload =>
      pubCall('/api/v3/ticker/price', payload).then(r =>
        (Array.isArray(r) ? r : [r]).reduce((out, cur) => ((out[cur.symbol] = cur.price), out), {}),
      ),

    avgPrice: payload => pubCall('/api/v3/avgPrice', payload),

    allBookTickers: () =>
      pubCall('/api/v3/ticker/bookTicker').then(r =>
        (Array.isArray(r) ? r : [r]).reduce((out, cur) => ((out[cur.symbol] = cur), out), {}),
      ),

    /**
     * Call unmanaged private call to Binance api; you need a key and secret
     */
    privateRequest: (method, url, payload) => privCall(url, payload, method),

    /**
     * Call unmanaged public call to Binance api
     */
    publicRequest: (method, url, payload) => pubCall(url, payload, method),

    order: payload => order(privCall, payload, '/api/v3/order'),
    orderOco: payload => orderOco(privCall, payload, '/api/v3/order/oco'),
    orderTest: payload => order(privCall, payload, '/api/v3/order/test'),
    getOrder: payload => privCall('/api/v3/order', payload),
    cancelOrder: payload => privCall('/api/v3/order', payload, 'DELETE'),

    cancelOpenOrders: payload => privCall('/api/v3/openOrders', payload, 'DELETE'),
    openOrders: payload => privCall('/api/v3/openOrders', payload),
    allOrders: payload => privCall('/api/v3/allOrders', payload),

    allOrdersOCO: payload => privCall('/api/v3/allOrderList', payload),

    accountInfo: payload => privCall('/api/v3/account', payload),
    myTrades: payload => privCall('/api/v3/myTrades', payload),

    withdraw: payload => privCall('/wapi/v3/withdraw.html', payload, 'POST'),
    withdrawHistory: payload => privCall('/wapi/v3/withdrawHistory.html', payload),
    depositHistory: payload => privCall('/wapi/v3/depositHistory.html', payload),
    depositAddress: payload => privCall('/wapi/v3/depositAddress.html', payload),
    tradeFee: payload => privCall('/wapi/v3/tradeFee.html', payload),
    assetDetail: payload => privCall('/wapi/v3/assetDetail.html', payload),

    capitalConfigs: () => privCall('/sapi/v1/capital/config/getall'),
    capitalDepositAddress: payload => privCall('/sapi/v1/capital/deposit/address', payload),

    getDataStream: () => privCall('/api/v3/userDataStream', null, 'POST', true),
    keepDataStream: payload => privCall('/api/v3/userDataStream', payload, 'PUT', false, true),
    closeDataStream: payload => privCall('/api/v3/userDataStream', payload, 'DELETE', false, true),

    marginGetDataStream: () => privCall('/sapi/v1/userDataStream', null, 'POST', true),
    marginKeepDataStream: payload =>
      privCall('/sapi/v1/userDataStream', payload, 'PUT', false, true),
    marginCloseDataStream: payload =>
      privCall('/sapi/v1/userDataStream', payload, 'DELETE', false, true),

    futuresGetDataStream: () => privCall('/fapi/v1/listenKey', null, 'POST', true),
    futuresKeepDataStream: payload => privCall('/fapi/v1/listenKey', payload, 'PUT', false, true),
    futuresCloseDataStream: payload =>
      privCall('/fapi/v1/listenKey', payload, 'DELETE', false, true),

    marginAllOrders: payload => privCall('/sapi/v1/margin/allOrders', payload),
    marginOrder: payload => order(privCall, payload, '/sapi/v1/margin/order'),
    marginCancelOrder: payload => privCall('/sapi/v1/margin/order', payload, 'DELETE'),
    marginOpenOrders: payload => privCall('/sapi/v1/margin/openOrders', payload),
    marginAccountInfo: payload => privCall('/sapi/v1/margin/account', payload),
    marginMyTrades: payload => privCall('/sapi/v1/margin/myTrades', payload),

    futuresPing: () => pubCall('/fapi/v1/ping').then(() => true),
    futuresTime: () => pubCall('/fapi/v1/time').then(r => r.serverTime),
    futuresExchangeInfo: () => pubCall('/fapi/v1/exchangeInfo'),
    futuresBook: payload => book(pubCall, payload, '/fapi/v1/depth'),
    futuresAggTrades: payload => aggTrades(pubCall, payload, '/fapi/v1/aggTrades'),
    futuresMarkPrice: payload => pubCall('/fapi/v1/premiumIndex', payload),
    futuresAllForceOrders: payload => pubCall('/fapi/v1/allForceOrders', payload),
    futuresCandles: payload => candles(pubCall, payload, '/fapi/v1/klines'),
    futuresTrades: payload =>
      checkParams('trades', payload, ['symbol']) && pubCall('/fapi/v1/trades', payload),
    futuresDailyStats: payload => pubCall('/fapi/v1/ticker/24hr', payload),
    futuresPrices: () =>
      pubCall('/fapi/v1/ticker/price').then(r =>
        (Array.isArray(r) ? r : [r]).reduce((out, cur) => ((out[cur.symbol] = cur.price), out), {}),
      ),
    futuresAllBookTickers: () =>
      pubCall('/fapi/v1/ticker/bookTicker').then(r =>
        (Array.isArray(r) ? r : [r]).reduce((out, cur) => ((out[cur.symbol] = cur), out), {}),
      ),
    futuresFundingRate: payload =>
      checkParams('fundingRate', payload, ['symbol']) && pubCall('/fapi/v1/fundingRate', payload),

    futuresOrder: payload => order(privCall, payload, '/fapi/v1/order'),
    futuresGetOrder: payload => privCall('/fapi/v1/order', payload),
    futuresCancelOrder: payload => privCall('/fapi/v1/order', payload, 'DELETE'),
    futuresOpenOrders: payload => privCall('/fapi/v1/openOrders', payload),
    futuresPositionRisk: payload => privCall('/fapi/v2/positionRisk', payload),
    futuresAccountBalance: payload => privCall('/fapi/v2/balance', payload),
    futuresPositionMode: payload => privCall('/fapi/v1/positionSide/dual', payload, 'GET'),
    futuresPositionModeChange: payload => privCall('/fapi/v1/positionSide/dual', payload, 'POST'),
    futuresLeverage: payload => privCall('/fapi/v1/leverage', payload, 'POST'),
  }
}
