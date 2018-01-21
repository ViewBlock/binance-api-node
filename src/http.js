import crypto from 'crypto'
import zip from 'lodash.zipobject'

import 'isomorphic-fetch'

const BASE = 'https://api.binance.com'

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
 * Finalize APi response
 */
const sendResult = call =>
  call.then(res => Promise.all([res, res.json()])).then(([res, json]) => {
    if (!res.ok) {
      throw new Error(json.msg || `${res.status} ${res.statusText}`)
    }

    return json
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
 * Make public call against api
 *
 * @param {string} path Endpoint path
 * @param {object} data The payload to be sent
 * @param {string} method HTTB VERB, GET by default
 * @param {object} headers
 * @returns {object} The api response
 */
const publicCall = (path, data, method = 'GET') =>
  sendResult(
    fetch(`${BASE}/api${path}${makeQueryString(data)}`, {
      method,
      json: true,
    }),
  )

/**
 * Factory method for private calls against api
 *
 * @param {string} path Endpoint path
 * @param {object} data The payload to be sent
 * @param {string} method HTTB VERB, GET by default
 * @param {object} headers
 * @returns {object} The api response
 */
const privateCall = ({ apiKey, apiSecret }) => async (
  path,
  data = {},
  method = 'GET',
  noData,
  noExtra,
) => {
  if (!apiKey || !apiSecret) {
    throw new Error('You need to pass an API key and secret to make authenticated calls.')
  }

  const timestamp = data.useServerTime
    ? await publicCall('/v1/time').then(r => r.serverTime)
    : Date.now()

  delete data.useServerTime

  const signature = crypto
    .createHmac('sha256', apiSecret)
    .update(makeQueryString({ ...data, timestamp }).substr(1))
    .digest('hex')

  const newData = noExtra ? data : { ...data, timestamp, signature }

  return sendResult(
    fetch(
      `${BASE}${path.includes('/wapi') ? '' : '/api'}${path}${noData
        ? ''
        : makeQueryString(newData)}`,
      {
        method,
        headers: { 'X-MBX-APIKEY': apiKey },
        json: true,
      },
    ),
  )
}

export const candleFields = [
  'openTime',
  'open',
  'high',
  'low',
  'close',
  'volume',
  'closeTime',
  'quoteAssetVolume',
  'trades',
  'baseAssetVolume',
  'quoteAssetVolume',
]

/**
 * Get candles for a specific pair and interval and convert response
 * to a user friendly collection.
 */
const candles = payload =>
  checkParams('candles', payload, ['symbol']) &&
  publicCall('/v1/klines', { interval: '5m', ...payload }).then(candles =>
    candles.map(candle => zip(candleFields, candle)),
  )

/**
 * Create a new order wrapper for market order simplicity
 */
const order = (pCall, payload = {}, url) => {
  return (
    checkParams('order', payload, ['symbol', 'side', 'quantity']) &&
    pCall(url, { type: 'LIMIT', ...payload }, 'POST')
  )
}

/**
 * Zip asks and bids reponse from order book
 */
const book = payload =>
  checkParams('book', payload, ['symbol']) &&
  publicCall('/v1/depth', payload).then(({ lastUpdateId, asks, bids }) => ({
    lastUpdateId,
    asks: asks.map(a => zip(['price', 'quantity'], a)),
    bids: bids.map(b => zip(['price', 'quantity'], b)),
  }))

const aggTrades = payload =>
  checkParams('aggTrades', payload, ['symbol']) &&
  publicCall('/v1/aggTrades', payload).then(trades =>
    trades.map(trade => ({
      aggId: trade.a,
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
  const pCall = privateCall(opts)

  return {
    ping: () => publicCall('/v1/ping').then(() => true),
    time: () => publicCall('/v1/time').then(r => r.serverTime),
    exchangeInfo: () => publicCall('/v1/exchangeInfo'),

    book,
    aggTrades,
    candles,

    dailyStats: payload =>
      checkParams('dailyStats', payload, ['symbol']) && publicCall('/v1/ticker/24hr', payload),
    prices: () =>
      publicCall('/v1/ticker/allPrices').then(r =>
        r.reduce((out, cur) => ((out[cur.symbol] = cur.price), out), {}),
      ),
    allBookTickers: () =>
      publicCall('/v1/ticker/allBookTickers').then(r =>
        r.reduce((out, cur) => ((out[cur.symbol] = cur), out), {}),
      ),

    order: payload => order(pCall, payload, '/v3/order'),
    orderTest: payload => order(pCall, payload, '/v3/order/test'),
    getOrder: payload => pCall('/v3/order', payload),
    cancelOrder: payload => pCall('/v3/order', payload, 'DELETE'),

    openOrders: payload => pCall('/v3/openOrders', payload),
    allOrders: payload => pCall('/v3/allOrders', payload),

    accountInfo: payload => pCall('/v3/account', payload),
    myTrades: payload => pCall('/v3/myTrades', payload),

    withdraw: payload => pCall('/wapi/v3/withdraw.html', payload, 'POST'),
    withdrawHistory: payload => pCall('/wapi/v3/withdrawHistory.html', payload),
    depositHistory: payload => pCall('/wapi/v3/depositHistory.html', payload),
    depositAddress: payload => pCall('/wapi/v3/depositAddress.html', payload),

    getDataStream: () => pCall('/v1/userDataStream', null, 'POST', true),
    keepDataStream: payload => pCall('/v1/userDataStream', payload, 'PUT', false, true),
    closeDataStream: payload => pCall('/v1/userDataStream', payload, 'DELETE', false, true),
  }
}
