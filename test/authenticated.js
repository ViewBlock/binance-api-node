import test from 'ava'

import Binance from 'index'

import { checkFields } from './utils'

const client = Binance({
  apiKey: process.env.API_KEY,
  apiSecret: process.env.API_SECRET,
})

test.serial('[REST] order', async t => {
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

test.serial('[REST] allOrders / getOrder', async t => {
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

  // Note that this test will fail if you don't have any ENG order in your account ;)
  const orders = await client.allOrders({
    symbol: 'ENGETH',
  })

  t.true(Array.isArray(orders))
  t.truthy(orders.length)

  const [order] = orders

  checkFields(t, order, ['orderId', 'symbol', 'price', 'type', 'side'])

  const res = await client.getOrder({
    symbol: 'ENGETH',
    orderId: order.orderId,
  })

  t.truthy(res)
  checkFields(t, res, ['orderId', 'symbol', 'price', 'type', 'side'])
})

test.serial('[REST] getOrder with useServerTime', async t => {
  const orders = await client.allOrders({
    symbol: 'ENGETH',
    useServerTime: true,
  })

  t.true(Array.isArray(orders))
  t.truthy(orders.length)
})

test.serial('[REST] openOrders', async t => {
  const orders = await client.openOrders({
    symbol: 'ETHBTC',
  })

  t.true(Array.isArray(orders))
})

test.serial('[REST] cancelOrder', async t => {
  try {
    await client.cancelOrder({ symbol: 'ETHBTC', orderId: 1 })
  } catch (e) {
    t.is(e.message, 'UNKNOWN_ORDER')
  }
})

test.serial('[REST] accountInfo', async t => {
  const account = await client.accountInfo()
  t.truthy(account)
  checkFields(t, account, ['makerCommission', 'takerCommission', 'balances'])
  t.truthy(account.balances.length)
})

test.serial('[REST] depositHistory', async t => {
  const history = await client.depositHistory()
  t.true(history.success)
  t.truthy(history.depositList.length)
})

test.serial('[REST] withdrawHistory', async t => {
  const history = await client.withdrawHistory()
  t.true(history.success)
  t.is(typeof history.withdrawList.length, 'number')
})

test.serial('[REST] depositAddress', async t => {
  const out = await client.depositAddress({ asset: 'NEO' })
  t.true(out.success)
  t.is(out.asset, 'NEO')
  t.truthy(out.address)
})

test.serial('[REST] myTrades', async t => {
  const trades = await client.myTrades({ symbol: 'ENGETH' })
  t.true(Array.isArray(trades))
  const [trade] = trades
  checkFields(t, trade, ['id', 'orderId', 'qty', 'commission', 'time'])
})

test.serial('[REST] tradesHistory', async t => {
  const trades = await client.tradesHistory({ symbol: 'ETHBTC', fromId: 28457 })
  t.is(trades.length, 500)
})

test.serial('[WS] user', async t => {
  const clean = await client.ws.user()
  t.truthy(clean)
  t.true(typeof clean === 'function')
})
