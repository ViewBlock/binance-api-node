import test from 'ava'

import Binance from 'index'

import { checkFields } from './utils'

const client = Binance({
  apiKey: process.env.API_KEY,
  apiSecret: process.env.API_SECRET,
})

test('[REST] order', async t => {
  await client.orderTest({
    symbol: 'ETHBTC',
    side: 'BUY',
    quantity: 1,
    price: 1,
  })

  await client.orderTest({
    symbol: 'ETHBTC',
    side: 'BUY',
    quantity: 1,
    type: 'MARKET',
  })

  t.pass()
})

test('[REST] allOrders / getOrder', async t => {
  try {
    await client.getOrder({ symbol: 'ETHBTC' })
  } catch (e) {
    t.is(
      e.message,
      "Param 'origClientOrderId' or 'orderId' must be sent, but both were empty/null!",
    )
  }

  try {
    await client.getOrder({ symbol: 'ETHBTC', orderId: 1 })
  } catch (e) {
    t.is(e.message, 'Order does not exist.')
  }

  // Note that this test will fail if you don't have any AST order in your account
  const orders = await client.allOrders({
    symbol: 'ASTETH',
  })

  t.true(Array.isArray(orders))
  t.truthy(orders.length)

  const [order] = orders

  checkFields(t, order, ['orderId', 'symbol', 'price', 'type', 'side'])

  const res = await client.getOrder({
    symbol: 'ASTETH',
    orderId: order.orderId,
  })

  t.truthy(res)
  checkFields(t, res, ['orderId', 'symbol', 'price', 'type', 'side'])
})

test('[REST] getOrder with useServerTime', async t => {
  const orders = await client.allOrders({
    symbol: 'ASTETH',
    useServerTime: true,
  })

  t.true(Array.isArray(orders))
  t.truthy(orders.length)
})

test('[REST] openOrders', async t => {
  const orders = await client.openOrders({
    symbol: 'ETHBTC',
  })

  t.true(Array.isArray(orders))
})

test('[REST] cancelOrder', async t => {
  try {
    await client.cancelOrder({ symbol: 'ETHBTC', orderId: 1 })
  } catch (e) {
    t.is(e.message, 'UNKNOWN_ORDER')
  }
})

test('[REST] accountInfo', async t => {
  const account = await client.accountInfo()
  t.truthy(account)
  checkFields(t, account, ['makerCommission', 'takerCommission', 'balances'])
  t.truthy(account.balances.length)
})

test('[REST] depositHistory', async t => {
  const history = await client.depositHistory()
  t.true(history.success)
  t.truthy(history.depositList.length)
})

test('[REST] withdrawHistory', async t => {
  const history = await client.withdrawHistory()
  t.true(history.success)
  t.is(typeof history.withdrawList.length, 'number')
})

test('[REST] depositAddress', async t => {
  const out = await client.depositAddress({ asset: 'NEO' })
  t.true(out.success)
  t.is(out.asset, 'NEO')
  t.truthy(out.address)
})

test('[REST] myTrades', async t => {
  const trades = await client.myTrades({ symbol: 'ASTETH' })
  t.true(Array.isArray(trades))
  const [trade] = trades
  checkFields(t, trade, ['id', 'orderId', 'qty', 'commission', 'time'])
})

test('[REST] tradesHistory', async t => {
  const trades = await client.tradesHistory({ symbol: 'ETHBTC', fromId: 28457 })
  t.is(trades.length, 500)
})

test('[REST] error code', async t => {
  try {
    await client.orderTest({
      symbol: 'TRXETH',
      side: 'SELL',
      type: 'LIMIT',
      quantity: '-1337.00000000',
      price: '1.00000000',
    })
  } catch (e) {
    t.is(e.code, -1100)
  }
})

test('[WS] user', async t => {
  const clean = await client.ws.user()
  t.truthy(clean)
  t.true(typeof clean === 'function')
})
