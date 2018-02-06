import WebSocket from 'ws'
import zip from 'lodash.zipobject'

import httpMethods from 'http'

const BASE = 'wss://stream.binance.com:9443/ws'

const depth = (payload, cb) => {
  const cache = (Array.isArray(payload) ? payload : [payload]).forEach(symbol => {
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

  return () => cache.forEach(w => w.close())
}

const partialDepth = (payload, cb) => {
  const cache = (Array.isArray(payload) ? payload : [payload]).map(({ symbol, level }) => {
    const w = new WebSocket(`${BASE}/${symbol.toLowerCase()}@depth${level}`)
    w.on('message', msg => {
      const { lastUpdateId, bids, asks } = JSON.parse(msg)
      cb({
        symbol,
        level,
        lastUpdateId,
        bids: bids.map(b => zip(['price', 'quantity'], b)),
        asks: asks.map(a => zip(['price', 'quantity'], a)),
      })
    })

    return w
  })

  return () => cache.forEach(w => w.close())
}

const candles = (payload, interval, cb) => {
  if (!interval || !cb) {
    throw new Error('Please pass a symbol, interval and callback.')
  }

  const cache = (Array.isArray(payload) ? payload : [payload]).map(symbol => {
    const w = new WebSocket(`${BASE}/${symbol.toLowerCase()}@kline_${interval}`)
    w.on('message', msg => {
      const { e: eventType, E: eventTime, s: symbol, k: tick } = JSON.parse(msg)
      const {
        t: startTime,
        T: closeTime,
        f: firstTradeId,
        L: lastTradeId,
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
        startTime,
        closeTime,
        firstTradeId,
        lastTradeId,
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

    return w
  })

  return () => cache.forEach(w => w.close())
}

const tickerTransform = m => ({
  eventType: m.e,
  eventTime: m.E,
  symbol: m.s,
  priceChange: m.p,
  priceChangePercent: m.P,
  weightedAvg: m.w,
  prevDayClose: m.x,
  curDayClose: m.c,
  closeTradeQuantity: m.Q,
  bestBid: m.b,
  bestBidQnt: m.B,
  bestAsk: m.a,
  bestAskQnt: m.A,
  open: m.o,
  high: m.h,
  low: m.l,
  volume: m.v,
  volumeQuote: m.q,
  openTime: m.O,
  closeTime: m.C,
  firstTradeId: m.F,
  lastTradeId: m.L,
  totalTrades: m.n,
})

const ticker = (payload, cb) => {
  const cache = (Array.isArray(payload) ? payload : [payload]).map(symbol => {
    const w = new WebSocket(`${BASE}/${symbol.toLowerCase()}@ticker`)

    w.on('message', msg => {
      cb(tickerTransform(JSON.parse(msg)))
    })

    return w
  })

  return () => cache.forEach(w => w.close())
}

const allTickers = cb => {
  const w = new WebSocket(`${BASE}/!ticker@arr`)

  w.on('message', msg => {
    const arr = JSON.parse(msg)
    cb(arr.map(m => tickerTransform(m)))
  })

  return () => w.close()
}

const trades = (payload, cb) => {
  const cache = (Array.isArray(payload) ? payload : [payload]).map(symbol => {
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

    return w
  })

  return () => cache.forEach(w => w.close())
}

const userTransforms = {
  outboundAccountInfo: m => ({
    eventType: 'account',
    eventTime: m.E,
    makerCommissionRate: m.m,
    takerCommissionRate: m.t,
    buyerCommissionRate: m.b,
    sellerCommissionRate: m.s,
    canTrade: m.T,
    canWithdraw: m.W,
    canDeposit: m.D,
    lastAccountUpdate: m.u,
    balances: m.B.reduce((out, cur) => {
      out[cur.a] = { available: cur.f, locked: cur.l }
      return out
    }, {}),
  }),
  executionReport: m => ({
    eventType: 'executionReport',
    eventTime: m.E,
    symbol: m.s,
    newClientOrderId: m.c,
    originalClientOrderId: m.C,
    side: m.S,
    orderType: m.o,
    timeInForce: m.f,
    quantity: m.q,
    price: m.p,
    executionType: m.x,
    stopPrice: m.P,
    icebergQuantity: m.F,
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
    isOrderWorking: m.w,
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

    const int = setInterval(keepStreamAlive(keepDataStream, listenKey), 50e3)
    keepStreamAlive(keepDataStream, listenKey)()

    return () => {
      clearInterval(int)
      closeDataStream({ listenKey })
      w.close()
    }
  })
}

export default opts => ({
  depth,
  partialDepth,
  candles,
  trades,
  ticker,
  allTickers,
  user: user(opts),
})
