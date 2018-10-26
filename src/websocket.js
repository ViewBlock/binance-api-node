import zip from 'lodash.zipobject'

import httpMethods from 'http'
import openWebSocket from 'open-websocket'

const BASE = 'wss://stream.binance.com:9443/ws'

const depth = (payload, cb) => {
  const cache = (Array.isArray(payload) ? payload : [payload]).map(symbol => {
    const w = openWebSocket(`${BASE}/${symbol.toLowerCase()}@depth`)
    w.onmessage = msg => {
      const {
        e: eventType,
        E: eventTime,
        s: symbol,
        U: firstUpdateId,
        u: finalUpdateId,
        b: bidDepth,
        a: askDepth,
      } = JSON.parse(msg.data)

      cb({
        eventType,
        eventTime,
        symbol,
        firstUpdateId,
        finalUpdateId,
        bidDepth: bidDepth.map(b => zip(['price', 'quantity'], b)),
        askDepth: askDepth.map(a => zip(['price', 'quantity'], a)),
      })
    }

    return w
  })

  return (options) => cache.forEach(w => w.close(1000, 'Close handle was called', { keepClosed: true, ...options }))
}

const partialDepth = (payload, cb) => {
  const cache = (Array.isArray(payload) ? payload : [payload]).map(({ symbol, level }) => {
    const w = openWebSocket(`${BASE}/${symbol.toLowerCase()}@depth${level}`)
    w.onmessage = msg => {
      const { lastUpdateId, bids, asks } = JSON.parse(msg.data)
      cb({
        symbol,
        level,
        lastUpdateId,
        bids: bids.map(b => zip(['price', 'quantity'], b)),
        asks: asks.map(a => zip(['price', 'quantity'], a)),
      })
    }

    return w
  })

  return (options) => cache.forEach(w => w.close(1000, 'Close handle was called', { keepClosed: true, ...options }))
}

const candles = (payload, interval, cb) => {
  if (!interval || !cb) {
    throw new Error('Please pass a symbol, interval and callback.')
  }

  const cache = (Array.isArray(payload) ? payload : [payload]).map(symbol => {
    const w = openWebSocket(`${BASE}/${symbol.toLowerCase()}@kline_${interval}`)
    w.onmessage = msg => {
      const { e: eventType, E: eventTime, s: symbol, k: tick } = JSON.parse(msg.data)
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
    }

    return w
  })

  return (options) => cache.forEach(w => w.close(1000, 'Close handle was called', { keepClosed: true, ...options }))
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
    const w = openWebSocket(`${BASE}/${symbol.toLowerCase()}@ticker`)

    w.onmessage = msg => {
      cb(tickerTransform(JSON.parse(msg.data)))
    }

    return w
  })

  return (options) => cache.forEach(w => w.close(1000, 'Close handle was called', { keepClosed: true, ...options }))
}

const allTickers = cb => {
  const w = new openWebSocket(`${BASE}/!ticker@arr`)

  w.onmessage = msg => {
    const arr = JSON.parse(msg.data)
    cb(arr.map(m => tickerTransform(m)))
  }

  return (options) => w.close(1000, 'Close handle was called', { keepClosed: true, ...options })
}

const tradesInternal = (payload, streamName, cb) => {
  const cache = (Array.isArray(payload) ? payload : [payload]).map(symbol => {
    const w = openWebSocket(`${BASE}/${symbol.toLowerCase()}@${streamName}`)
    w.onmessage = msg => {
      const {
        e: eventType,
        E: eventTime,
        s: symbol,
        p: price,
        q: quantity,
        m: maker,
        M: isBuyerMaker,
        a: tradeId,
      } = JSON.parse(msg.data)

      cb({
        eventType,
        eventTime,
        symbol,
        price,
        quantity,
        maker,
        isBuyerMaker,
        tradeId,
      })
    }

    return w
  })

  return (options) => cache.forEach(w => w.close(1000, 'Close handle was called', { keepClosed: true, ...options }))
}

const aggTrades = (payload, cb) => tradesInternal(payload, 'aggTrade', cb)

const trades = (payload, cb) => tradesInternal(payload, 'trade', cb)

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
    creationTime: m.O,
    totalQuoteTradeQuantity: m.Z,
  }),
}

export const userEventHandler = cb => msg => {
  const { e: type, ...rest } = JSON.parse(msg.data)
  cb(userTransforms[type] ? userTransforms[type](rest) : { type, ...rest })
}

export const keepStreamAlive = (method, listenKey) => () => method({ listenKey })

const user = opts => cb => {
  const { getDataStream, keepDataStream, closeDataStream } = httpMethods(opts)
  let currentListenKey = null, int = null, w = null
  
  const keep_alive = (is_reconnecting) => {
    if (currentListenKey) {
      keepStreamAlive(keepDataStream, currentListenKey)()
        .catch((err) => {          
          close_stream({}, true)
                
          if (is_reconnecting) {
            setTimeout(() => make_stream(true), 30e3)
          } else {
            make_stream(true)
          }
        })      
    }
  }
  
  const close_stream = (options, catch_errors) => {
     if (currentListenKey) {
       clearInterval(int)
       
       const p = closeDataStream({ listenKey: currentListenKey })
       
       if (catch_errors) {
         p.catch((err) => (0))
       }
       
       w.close(1000, 'Close handle was called', { keepClosed: true, ...options })
       currentListenKey = null
     }
  }
  
  const make_stream = (is_reconnecting) => {
    return getDataStream().then(({ listenKey }) => {
       w = openWebSocket(`${BASE}/${listenKey}`)
       w.onmessage = (msg) => (userEventHandler(cb)(msg))

       currentListenKey = listenKey; 

       int = setInterval(() => keep_alive(false), 50e3)
     
       keep_alive(true)

       return (options) => close_stream(options)
     }).catch ((err) => {       
       if (is_reconnecting) {
         setTimeout(() => make_stream(true), 30e3)
       } else {
         throw err
       }
     })
  }

  return make_stream(false)
}

export default opts => ({
  depth,
  partialDepth,
  candles,
  trades,
  aggTrades,
  ticker,
  allTickers,
  user: user(opts),
})
