import test from 'ava'
import dotenv from 'dotenv'

import Binance from 'index'
import { candleFields } from 'http'
import { userEventHandler } from 'websocket'

import { checkFields } from './utils'

dotenv.load()

const client = Binance()

test.serial('[REST] ping', async t => {
  t.truthy(await client.ping(), 'A simple ping should work')
})

test.serial('[REST] time', async t => {
  const ts = await client.time()
  t.truthy(new Date(ts).getTime() > 0, 'The returned timestamp should be valid')
})

test.serial('[REST] exchangeInfo', async t => {
  const res = await client.exchangeInfo()
  checkFields(t, res, ['timezone', 'serverTime', 'rateLimits', 'symbols'])
})

test.serial('[REST] book', async t => {
  try {
    await client.book()
  } catch (e) {
    t.is(e.message, 'You need to pass a payload object.')
  }

  try {
    await client.book({})
  } catch (e) {
    t.is(e.message, 'Method book requires symbol parameter.')
  }

  const book = await client.book({ symbol: 'ETHBTC' })
  t.truthy(book.lastUpdateId)
  t.truthy(book.asks.length)
  t.truthy(book.bids.length)

  const [bid] = book.bids
  t.truthy(typeof bid.price === 'string')
  t.truthy(typeof bid.quantity === 'string')
})

test.serial('[REST] candles', async t => {
  try {
    await client.candles({})
  } catch (e) {
    t.is(e.message, 'Method candles requires symbol parameter.')
  }

  const candles = await client.candles({ symbol: 'ETHBTC' })

  t.truthy(candles.length)

  const [candle] = candles
  checkFields(t, candle, candleFields)
})

test.serial('[REST] aggTrades', async t => {
  try {
    await client.aggTrades({})
  } catch (e) {
    t.is(e.message, 'Method aggTrades requires symbol parameter.')
  }

  const trades = await client.aggTrades({ symbol: 'ETHBTC' })
  t.truthy(trades.length)

  const [trade] = trades
  t.truthy(trade.aggId)
})

test.serial('[REST] trades', async t => {
  const trades = await client.trades({ symbol: 'ETHBTC' })
  t.is(trades.length, 500)
})

test.serial('[REST] dailyStats', async t => {
  const res = await client.dailyStats({ symbol: 'ETHBTC' })
  t.truthy(res)
  checkFields(t, res, ['highPrice', 'lowPrice', 'volume', 'priceChange'])
})

test.serial('[REST] prices', async t => {
  const prices = await client.prices()
  t.truthy(prices)
  t.truthy(prices.ETHBTC)
})

test.serial('[REST] allBookTickers', async t => {
  const tickers = await client.allBookTickers()
  t.truthy(tickers)
  t.truthy(tickers.ETHBTC)
})

test.serial('[REST] Signed call without creds', async t => {
  try {
    await client.order({ symbol: 'ETHBTC', side: 'BUY', quantity: 1 })
  } catch (e) {
    t.is(e.message, 'You need to pass an API key and secret to make authenticated calls.')
  }
})

test.serial('[WS] depth', t => {
  return new Promise(resolve => {
    client.ws.depth('ETHBTC', depth => {
      checkFields(t, depth, [
        'eventType',
        'eventTime',
        'updateId',
        'symbol',
        'bidDepth',
        'askDepth',
      ])
      resolve()
    })
  })
})

test.serial('[WS] partial depth', t => {
  return new Promise(resolve => {
    client.ws.partialDepth({ symbol: 'ETHBTC', level: 10 }, depth => {
      checkFields(t, depth, ['lastUpdateId', 'bids', 'asks'])
      resolve()
    })
  })
})

test.serial('[WS] ticker', t => {
  return new Promise(resolve => {
    client.ws.ticker('ETHBTC', ticker => {
      checkFields(t, ticker, ['open', 'high', 'low', 'eventTime', 'symbol', 'volume'])
      resolve()
    })
  })
})

test.serial('[WS] allTicker', t => {
  return new Promise(resolve => {
    client.ws.allTickers(tickers => {
      t.truthy(Array.isArray(tickers))
      t.is(tickers[0].eventType, '24hrTicker')
      checkFields(t, tickers[0], ['symbol', 'priceChange', 'priceChangePercent'])
      resolve()
    })
  })
})

test.serial('[WS] candles', t => {
  try {
    client.ws.candles('ETHBTC', d => d)
  } catch (e) {
    t.is(e.message, 'Please pass a symbol, interval and callback.')
  }

  return new Promise(resolve => {
    client.ws.candles(['ETHBTC', 'BNBBTC', 'BNTBTC'], '5m', candle => {
      checkFields(t, candle, ['open', 'high', 'low', 'close', 'volume', 'trades', 'quoteVolume'])
      resolve()
    })
  })
})

test.serial('[WS] trades', t => {
  return new Promise(resolve => {
    client.ws.trades(['BNBBTC', 'ETHBTC', 'BNTBTC'], trade => {
      checkFields(t, trade, ['eventType', 'tradeId', 'quantity', 'price', 'symbol'])
      resolve()
    })
  })
})

test.serial('[WS] userEvents', t => {
  const accountPayload = {
    e: 'outboundAccountInfo',
    E: 1499405658849,
    m: 0,
    t: 0,
    b: 0,
    s: 0,
    T: true,
    W: true,
    D: true,
    u: 1499405658849,
    B: [
      {
        a: 'LTC',
        f: '17366.18538083',
        l: '0.00000000',
      },
      {
        a: 'BTC',
        f: '10537.85314051',
        l: '2.19464093',
      },
      {
        a: 'ETH',
        f: '17902.35190619',
        l: '0.00000000',
      },
      {
        a: 'BNC',
        f: '1114503.29769312',
        l: '0.00000000',
      },
      {
        a: 'NEO',
        f: '0.00000000',
        l: '0.00000000',
      },
    ],
  }

  userEventHandler(res => {
    t.deepEqual(res, {
      eventType: 'account',
      eventTime: 1499405658849,
      makerCommissionRate: 0,
      takerCommissionRate: 0,
      buyerCommissionRate: 0,
      sellerCommissionRate: 0,
      canTrade: true,
      canWithdraw: true,
      canDeposit: true,
      lastAccountUpdate: 1499405658849,
      balances: {
        LTC: { available: '17366.18538083', locked: '0.00000000' },
        BTC: { available: '10537.85314051', locked: '2.19464093' },
        ETH: { available: '17902.35190619', locked: '0.00000000' },
        BNC: { available: '1114503.29769312', locked: '0.00000000' },
        NEO: { available: '0.00000000', locked: '0.00000000' },
      },
    })
  })(JSON.stringify(accountPayload))

  const orderPayload = {
    e: 'executionReport',
    E: 1499405658658,
    s: 'ETHBTC',
    c: 'mUvoqJxFIILMdfAW5iGSOW',
    S: 'BUY',
    o: 'LIMIT',
    f: 'GTC',
    q: '1.00000000',
    p: '0.10264410',
    P: '0.10285410',
    F: '0.00000000',
    g: -1,
    C: 'null',
    x: 'NEW',
    X: 'NEW',
    r: 'NONE',
    i: 4293153,
    l: '0.00000000',
    z: '0.00000000',
    L: '0.00000000',
    n: '0',
    N: null,
    T: 1499405658657,
    t: -1,
    I: 8641984,
    w: true,
    m: false,
    M: false,
  }

  userEventHandler(res => {
    t.deepEqual(res, {
      eventType: 'executionReport',
      eventTime: 1499405658658,
      symbol: 'ETHBTC',
      newClientOrderId: 'mUvoqJxFIILMdfAW5iGSOW',
      originalClientOrderId: 'null',
      side: 'BUY',
      orderType: 'LIMIT',
      timeInForce: 'GTC',
      quantity: '1.00000000',
      price: '0.10264410',
      stopPrice: '0.10285410',
      executionType: 'NEW',
      icebergQuantity: '0.00000000',
      orderStatus: 'NEW',
      orderRejectReason: 'NONE',
      orderId: 4293153,
      orderTime: 1499405658657,
      lastTradeQuantity: '0.00000000',
      totalTradeQuantity: '0.00000000',
      priceLastTrade: '0.00000000',
      commission: '0',
      commissionAsset: null,
      tradeId: -1,
      isOrderWorking: true,
      isBuyerMaker: false,
    })
  })(JSON.stringify(orderPayload))

  const tradePayload = {
    e: 'executionReport',
    E: 1499406026404,
    s: 'ETHBTC',
    c: '1hRLKJhTRsXy2ilYdSzhkk',
    S: 'BUY',
    o: 'LIMIT',
    f: 'GTC',
    q: '22.42906458',
    p: '0.10279999',
    P: '0.10280001',
    F: '0.00000000',
    g: -1,
    C: 'null',
    x: 'TRADE',
    X: 'FILLED',
    r: 'NONE',
    i: 4294220,
    l: '17.42906458',
    z: '22.42906458',
    L: '0.10279999',
    n: '0.00000001',
    N: 'BNC',
    T: 1499406026402,
    t: 77517,
    I: 8644124,
    w: false,
    m: false,
    M: true,
  }

  userEventHandler(res => {
    t.deepEqual(res, {
      eventType: 'executionReport',
      eventTime: 1499406026404,
      symbol: 'ETHBTC',
      newClientOrderId: '1hRLKJhTRsXy2ilYdSzhkk',
      originalClientOrderId: 'null',
      side: 'BUY',
      orderType: 'LIMIT',
      timeInForce: 'GTC',
      quantity: '22.42906458',
      price: '0.10279999',
      stopPrice: '0.10280001',
      executionType: 'TRADE',
      icebergQuantity: '0.00000000',
      orderStatus: 'FILLED',
      orderRejectReason: 'NONE',
      orderId: 4294220,
      orderTime: 1499406026402,
      lastTradeQuantity: '17.42906458',
      totalTradeQuantity: '22.42906458',
      priceLastTrade: '0.10279999',
      commission: '0.00000001',
      commissionAsset: 'BNC',
      tradeId: 77517,
      isOrderWorking: false,
      isBuyerMaker: false,
    })
  })(JSON.stringify(tradePayload))

  const newEvent = { e: 'totallyNewEvent', yolo: 42 }

  userEventHandler(res => {
    t.deepEqual(res, { type: 'totallyNewEvent', yolo: 42 })
  })(JSON.stringify(newEvent))
})

if (process.env.API_KEY) {
  require('./authenticated')
}
