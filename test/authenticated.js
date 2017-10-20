import test from 'ava'
import dotenv from 'dotenv'

import Binance from 'index'

dotenv.load()

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
