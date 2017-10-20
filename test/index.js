import test from 'ava'

import Binance from 'index'
import { candleFields } from 'http'

const client = Binance()

const checkFields = (t, object, fields) => {
  fields.forEach(field => {
    t.truthy(object[field])
  })
}

test.serial('[REST] ping', async t => {
  t.truthy(await client.ping(), 'A simple ping should work')
})

test.serial('[REST] time', async t => {
  const ts = await client.time()
  t.truthy(new Date(ts).getTime() > 0, 'The returned timestamp should be valid')
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
    client.aggTrades({})
  } catch (e) {
    t.is(e.message, 'Method aggTrades requires symbol parameter.')
  }

  const trades = await client.aggTrades({ symbol: 'ETHBTC' })
  t.truthy(trades.length)

  const [trade] = trades
  t.truthy(trade.aggId)
})

test.serial('[REST] dailyStats', async t => {
  try {
    client.dailyStats({})
  } catch (e) {
    t.is(e.message, 'Method dailyStats requires symbol parameter.')
  }

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

test.serial('[REST] Signed call without creds', t => {
  const client = Binance()

  try {
    client.order({ symbol: 'ETHBTC', side: 'BUY', quantity: 1 })
  } catch (e) {
    t.is(e.message, 'You need to pass an API key and secret to make authenticated calls.')
  }
})

if (process.env.API_KEY) {
  require('./authenticated')
}
