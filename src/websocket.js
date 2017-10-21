import WebSocket from 'ws'
import zip from 'lodash.zipobject'

import httpMethods from 'http'

const BASE = 'wss://stream.binance.com:9443/ws'

const depth = (payload, cb) =>
  (Array.isArray(payload) ? payload : [payload]).forEach(symbol => {
    const w = new WebSocket(`${BASE}/${symbol.toLowerCase()}@depth`)
    w.on('message', msg => {
      const {
        e: eventType,
        E: eventTime,
        s: symbol,
        u: updateId,
        b: bidDepth,
        a: askDepth,
      } = JSON.parse(msg)

      cb({
        eventType,
        eventTime,
        symbol,
        updateId,
        bidDepth: bidDepth.map(b => zip(['price', 'quantity'], b)),
        askDepth: askDepth.map(a => zip(['price', 'quantity'], a)),
      })
    })
  })

const candles = (payload, interval, cb) => {
  if (!interval || !cb) {
    throw new Error('Please pass a symbol, interval and callback.')
  }

  ;(Array.isArray(payload) ? payload : [payload]).forEach(symbol => {
    const w = new WebSocket(`${BASE}/${symbol.toLowerCase()}@kline_${interval}`)
    w.on('message', msg => {
      const { e: eventType, E: eventTime, s: symbol, k: tick } = JSON.parse(msg)
      const {
        o: open,
        h: high,
        l: low,
        c: close,
        v: volume,
        n: trades,
        i: interval,
        x: isFinal,
        q: quoteVolume,
        V: buyVolume,
        Q: quoteBuyVolume,
      } = tick

      cb({
        eventType,
        eventTime,
        symbol,
        open,
        high,
        low,
        close,
        volume,
        trades,
        interval,
        isFinal,
        quoteVolume,
        buyVolume,
        quoteBuyVolume,
      })
    })
  })
}

const trades = (payload, cb) =>
  (Array.isArray(payload) ? payload : [payload]).forEach(symbol => {
    const w = new WebSocket(`${BASE}/${symbol.toLowerCase()}@aggTrade`)
    w.on('message', msg => {
      const {
        e: eventType,
        E: eventTime,
        s: symbol,
        p: price,
        q: quantity,
        m: maker,
        a: tradeId,
      } = JSON.parse(msg)

      cb({
        eventType,
        eventTime,
        symbol,
        price,
        quantity,
        maker,
        tradeId,
      })
    })
  })

const userTransforms = {
  outboundAccountInfo: m => ({
    eventType: 'account',
    eventTime: m.E,
    balances: m.B.reduce((out, cur) => {
      out[cur.a] = { available: cur.f, locked: cur.l }
      return out
    }, {}),
  }),
  executionReport: m => ({
    type: 'executionReport',
    eventTime: m.E,
    symbol: m.s,
    newClientOrderId: m.c,
    side: m.S,
    orderType: m.o,
    timeInForce: m.f,
    quantity: m.q,
    price: m.p,
    executionType: m.x,
    orderStatus: m.X,
    orderRejectReason: m.r,
    orderId: m.i,
    orderTime: m.T,
    lastTradeQuantity: m.l,
    totalTradeQuantity: m.z,
    priceLastTrade: m.L,
    commission: m.n,
    commissionAsset: m.N,
    tradeId: m.t,
    isBuyerMaker: m.m,
  }),
}

export const userEventHandler = cb => msg => {
  const { e: type, ...rest } = JSON.parse(msg)
  cb(userTransforms[type] ? userTransforms[type](rest) : { type, ...rest })
}

export const keepStreamAlive = (method, listenKey) => () => method({ listenKey })

const user = opts => cb => {
  const { getDataStream, keepDataStream, closeDataStream } = httpMethods(opts)

  return getDataStream().then(({ listenKey }) => {
    const w = new WebSocket(`${BASE}/${listenKey}`)
    w.on('message', userEventHandler(cb))

    const int = setInterval(keepStreamAlive(keepDataStream, listenKey), 42e3)
    keepStreamAlive(keepDataStream, listenKey)()

    return () => {
      clearInterval(int)
      closeDataStream({ listenKey })
    }
  })
}

export default opts => ({
  depth,
  candles,
  trades,
  user: user(opts),
})
