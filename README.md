# binance-api-node [![build](https://img.shields.io/travis/HyperCubeProject/binance-api-node.svg?style=flat-square)](https://travis-ci.org/HyperCubeProject/binance-api-node) [![cover](https://img.shields.io/coveralls/HyperCubeProject/binance-api-node.svg?style=flat-square)](https://coveralls.io/github/HyperCubeProject/binance-api-node) [![bnb](https://img.shields.io/badge/binance-winner-yellow.svg?style=flat-square)](https://github.com/binance-exchange/binance-api-node)

> A complete API wrapper for the [Binance](https://binance.com) API.

Note: This wrapper uses Promises, if they are not supported in your environment, you might
want to add [a polyfill](https://github.com/stefanpenner/es6-promise) for them.

### Installation

    yarn add binance-api-node

### Getting started

Import the module and create a new client. Passing api keys is optional only if
you don't plan on doing authenticated calls. You can create an api key
[here](https://www.binance.com/userCenter/createApi.html).

```js
import Binance from 'binance-api-node'

const client = Binance()

// Authenticated client, can make signed calls
const client2 = Binance({
  apiKey: 'xxx',
  apiSecret: 'xxx',
})

client.time().then(time => console.log(time))
```

Every REST method returns a Promise, making this library [async await](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/async_function) ready.
Following examples will use the `await` form, but that's totally up to you.

### Table of Content

- [Public REST Endpoints](#public-rest-endpoints)
    - [ping](#ping)
    - [time](#time)
    - [book](#book)
    - [candles](#candles)
    - [aggTrades](#aggtrades)
    - [dailyStats](#dailystats)
    - [prices](#prices)
    - [allBookTickers](#allbooktickers)
- [Authenticated REST Endpoints](#authenticated-rest-endpoints)
    - [order](#order)
    - [orderTest](#ordertest)
    - [getOrder](#getorder)
    - [cancelOrder](#cancelorder)
    - [openOrders](#openorders)
    - [allOrders](#allorders)
    - [accountInfo](#accountinfo)
    - [myTrades](#mytrades)
    - [depositHistory](#deposithistory)
    - [withdrawHistory](#withdrawhistory)
    - [widthdraw](#withdraw)
    - [depositAddress](#depositaddress)
- [Websockets](#websockets)
    - [depth](#depth)
    - [partialDepth](#partialdepth)
    - [ticker](#ticker)
    - [allTickers](#alltickers)
    - [candles](#candles-1)
    - [trades](#trades)
    - [user](#user)

### Public REST Endpoints

#### ping

Test connectivity to the API.

```js
console.log(await client.ping())
```

#### time

Test connectivity to the Rest API and get the current server time.

```js
console.log(await client.time())
```

<details>
<summary>Output</summary>

```js
1508478457643
```

</details>

#### book

Get the order book for a symbol.

```js
console.log(await client.book({ symbol: 'ETHBTC' }))
```

|Param|Type|Required|Default|
|--- |--- |--- |--- |
|symbol|String|true|
|limit|Number|false|`100`|

<details>
<summary>Output</summary>

```js
{
  lastUpdateId: 17647759,
  asks:
   [
     { price: '0.05411500', quantity: '5.55000000' },
     { price: '0.05416700', quantity: '11.80100000' }
   ],
  bids:
   [
     { price: '0.05395500', quantity: '2.70000000' },
     { price: '0.05395100', quantity: '11.84100000' }
   ]
}
```

</details>

#### candles

Retrieves Candlestick for a symbol. Candlesticks are uniquely identified by their open time.

```js
console.log(await client.candles({ symbol: 'ETHBTC' }))
```

|Param|Type|Required|Default|Description|
|--- |--- |--- |--- |--- |
|symbol|String|true|
|interval|String|false|`5m`|`1m`, `3m`, `5m`, `15m`, `30m`, `1h`, `2h`,<br>`4h`, `6h`, `8h`, `12h`, `1d`, `3d`, `1w`, `1M`|
|limit|Number|false|`500`|Max `500`|
|startTime|Number|false|
|endTime|Number|false|

<details>
<summary>Output</summary>

```js
[{
  openTime: 1508328900000,
  open: '0.05655000',
  high: '0.05656500',
  low: '0.05613200',
  close: '0.05632400',
  volume: '68.88800000',
  closeTime: 1508329199999,
  quoteAssetVolume: '2.29500857',
  trades: 85,
  baseAssetVolume: '40.61900000'
}]
```

</details>

#### aggTrades

Get compressed, aggregate trades. Trades that fill at the time, from the same order, with the same price will have the quantity aggregated.

```js
console.log(await client.aggTrades({ symbol: 'ETHBTC' }))
```

|Param|Type|Required|Default|Description|
|--- |--- |--- |--- |--- |
|symbol|String|true|
|fromId|String|false||ID to get aggregate trades from INCLUSIVE.|
|startTime|Number|false||Timestamp in ms to get aggregate trades from INCLUSIVE.
|endTime|Number|false||Timestamp in ms to get aggregate trades until INCLUSIVE.|
|limit|Number|false|`500`|Max `500`|

Note: If both `startTime` and `endTime` are sent, `limit` should not be sent AND the distance between `startTime` and `endTime` must be less than 24 hours.

Note: If `frondId`, `startTime`, and `endTime` are not sent, the most recent aggregate trades will be returned.

<details>
<summary>Output</summary>

```js
[{
  aggId: 2107132,
  price: '0.05390400',
  quantity: '1.31000000',
  firstId: 2215345,
  lastId: 2215345,
  timestamp: 1508478599481,
  isBuyerMaker: true,
  wasBestPrice: true
}]
```

</details>

#### dailyStats

24 hour price change statistics.

```js
console.log(await client.dailyStats({ symbol: 'ETHBTC' }))
```
|Param|Type|Required|
|--- |--- |--- |
|symbol|String|true|

<details>
<summary>Output</summary>

```js
{
  priceChange: '-0.00076000',
  priceChangePercent: '-1.385',
  weightedAvgPrice: '0.05419050',
  prevClosePrice: '0.05487700',
  lastPrice: '0.05411800',
  lastQty: '0.02000000',
  bidPrice: '0.05387600',
  bidQty: '20.04700000',
  askPrice: '0.05411700',
  askQty: '19.29100000',
  openPrice: '0.05487800',
  highPrice: '0.05527800',
  lowPrice: '0.05320000',
  volume: '25577.41900000',
  quoteVolume: '1386.05320965',
  openTime: 1508394436102,
  closeTime: 1508480836102,
  firstId: 2192355,
  lastId: 2215941,
  count: 23584
}
```

</details>

#### prices

Latest price for all symbols.

```js
console.log(await client.prices())
```

<details>
<summary>Output</summary>

```js
{
  ETHBTC: '0.05392500',
  LTCBTC: '0.01041100',
  ...
}
```

</details>

#### allBookTickers

Best price/qty on the order book for all symbols.

```js
console.log(await client.allBookTickers())
```

<details>
<summary>Output</summary>

```js
{
  DASHBTC: {
    symbol: 'DASHBTC',
    bidPrice: '0.04890400',
    bidQty: '0.74100000',
    askPrice: '0.05230000',
    askQty: '0.79900000'
  },
  DASHETH: {
    symbol: 'DASHETH',
    bidPrice: '0.89582000',
    bidQty: '0.63300000',
    askPrice: '1.02328000',
    askQty: '0.99900000'
  }
  ...
}
```

</details>

### Authenticated REST Endpoints

#### order

Creates a new order.

```js
console.log(await client.order({
  symbol: 'XLMETH',
  side: 'BUY',
  quantity: 100,
  price: 0.0002,
}))
```

|Param|Type|Required|Default|Description|
|--- |--- |--- |--- |--- |
|symbol|String|true|
|side|String|true||`BUY`,`SELL`|
|type|String|false|`LIMIT`|`LIMIT`, `MARKET`|
|quantity|Number|true|
|price|Number|true||Optional for `MARKET` orders|
|timeInForce|String|false|`GTC`|`GTC`, `IOC`|
|newClientOrderId|String|false||A unique id for the order. Automatically generated if not sent.|
|stopPrice|Number|false||Used with stop orders|
|icebergQty|Number|false||Used with iceberg orders|
|recvWindow|Number|false|

<details>
<summary>Output</summary>

```js
{
  symbol: 'XLMETH',
  orderId: 1740797,
  clientOrderId: '1XZTVBTGS4K1e',
  transactTime: 1514418413947,
  price: '0.00020000',
  origQty: '100.00000000',
  executedQty: '0.00000000',
  status: 'NEW',
  timeInForce: 'GTC',
  type: 'LIMIT',
  side: 'BUY'
}
```

</details>

#### orderTest

Test new order creation and signature/recvWindow. Creates and validates a new order but does not send it into the matching engine.

Same API as above.

#### getOrder

Check an order's status.

```js
console.log(await client.getOrder({
  symbol: 'ETHBTC',
  orderId: 1,
}))
```

|Param|Type|Required|Description|
|--- |--- |--- |--- |
|symbol|String|true|
|orderId|Number|true|Not required if `origClientOrderId` is used|
|origClientOrderId|String|false|
|recvWindow|Number|false|

<details>
<summary>Output</summary>

```js
{
  symbol: 'ENGETH',
  orderId: 191938,
  clientOrderId: '1XZTVBTGS4K1e',
  price: '0.00138000',
  origQty: '1.00000000',
  executedQty: '1.00000000',
  status: 'FILLED',
  timeInForce: 'GTC',
  type: 'LIMIT',
  side: 'SELL',
  stopPrice: '0.00000000',
  icebergQty: '0.00000000',
  time: 1508611114735
}
```

</details>

#### cancelOrder

Cancels an active order.

```js
console.log(await client.cancelOrder({
  symbol: 'ETHBTC',
  orderId: 1,
}))
```

|Param|Type|Required|Description|
|--- |--- |--- |--- |
|symbol|String|true|
|orderId|Number|true|Not required if `origClientOrderId` is used|
|origClientOrderId|String|false|
|newClientOrderId|String|false|Used to uniquely identify this cancel. Automatically generated by default.|
|recvWindow|Number|false|

<details>
<summary>Output</summary>

```js
```

</details>

#### openOrders

Get all open orders on a symbol.

```js
console.log(await client.openOrders({
  symbol: 'ETHBTC',
}))
```

|Param|Type|Required|
|--- |--- |--- |
|symbol|String|true|
|recvWindow|Number|false|

<details>
<summary>Output</summary>

```js
```

</details>

#### allOrders

Get all account orders on a symbol; active, canceled, or filled.

```js
console.log(await client.allOrders({
  symbol: 'ETHBTC',
}))
```

|Param|Type|Required|Default|Description|
|--- |--- |--- |--- |--- |
|symbol|String|true|
|orderId|Number|false||If set, it will get orders >= that orderId. Otherwise most recent orders are returned.|
|limit|Number|false|`500`|Max `500`|
|recvWindow|Number|false|

<details>
<summary>Output</summary>

```js
[{
  symbol: 'ENGETH',
  orderId: 191938,
  clientOrderId: '1XZTVBTGS4K1e',
  price: '0.00138000',
  origQty: '1.00000000',
  executedQty: '1.00000000',
  status: 'FILLED',
  timeInForce: 'GTC',
  type: 'LIMIT',
  side: 'SELL',
  stopPrice: '0.00000000',
  icebergQty: '0.00000000',
  time: 1508611114735
}]
```

</details>

#### accountInfo

Get current account information.

```js
console.log(await client.accountInfo())
```

|Param|Type|Required|
|--- |--- |--- |
|recvWindow|Number|false|

<details>
<summary>Output</summary>

```js
{
  makerCommission: 10,
  takerCommission: 10,
  buyerCommission: 0,
  sellerCommission: 0,
  canTrade: true,
  canWithdraw: true,
  canDeposit: true,
  balances: [
    { asset: 'BTC', free: '0.00000000', locked: '0.00000000' },
    { asset: 'LTC', free: '0.00000000', locked: '0.00000000' },
  ]
}
```

</details>

#### myTrades

Get trades for the current authenticated account and symbol.

```js
console.log(await client.myTrades({
  symbol: 'ETHBTC',
}))
```

|Param|Type|Required|Default|Description|
|--- |--- |--- |--- |--- |
|symbol|String|true|
|limit|Number|false|`500`|Max `500`|
|fromId|Number|false||TradeId to fetch from. Default gets most recent trades.|
|recvWindow|Number|false|

<details>
<summary>Output</summary>

```js
[{
  id: 9960,
  orderId: 191939,
  price: '0.00138000',
  qty: '10.00000000',
  commission: '0.00001380',
  commissionAsset: 'ETH',
  time: 1508611114735,
  isBuyer: false,
  isMaker: false,
  isBestMatch: true
}]
```

</details>

#### depositHistory

Get the account deposit history.

```js
console.log(await client.depositHistory())
```

|Param|Type|Required|Description|
|--- |--- |--- |--- |
|asset|String|false|
|status|Number|false|0 (0: pending, 1: success)|
|startTime|Number|false|
|endTime|Number|false|
|recvWindow|Number|false|

<details>
<summary>Output</summary>

```js
{
  "depositList": [
    {
      "insertTime": 1508198532000,
      "amount": 0.04670582,
      "asset": "ETH",
      "status": 1
    }
  ],
  "success": true
}
```

</details>

#### withdrawHistory

Get the account withdraw history.

```js
console.log(await client.withdrawHistory())
```

|Param|Type|Required|Description|
|--- |--- |--- |--- |
|asset|String|false|
|status|Number|false|0 (0: Email Sent, 1: Cancelled 2: Awaiting Approval, 3: Rejected, 4: Processing, 5: Failure, 6: Completed)|
|startTime|Number|false|
|endTime|Number|false|
|recvWindow|Number|false|

<details>
<summary>Output</summary>

```js
{
  "withdrawList": [
    {
      "amount": 1,
      "address": "0x6915f16f8791d0a1cc2bf47c13a6b2a92000504b",
      "asset": "ETH",
      "applyTime": 1508198532000
      "status": 4
    },
  ],
  "success": true
}
```

</details>

#### widthdraw

Triggers the withdraw process (*untested for now*).

```js
console.log(await client.withdraw({
  asset: 'ETH',
  address: '0xfa97c22a03d8522988c709c24283c0918a59c795',
  amount: 100,
}))
```

|Param|Type|Required|Description|
|--- |--- |--- |--- |
|asset|String|true|
|address|String|true|
|amount|Number|true|
|name|String|false|Description of the address|
|recvWindow|Number|false|

<details>
<summary>Output</summary>

```js
{
  "msg": "success",
  "success": true
}
```

</details>

#### depositAddress

Retrieve the account deposit address for a specific asset.

```js
console.log(await client.depositAddress({ asset: 'NEO' }))
```

|Param|Type|Required|Description|
|--- |--- |--- |--- |
|asset|String|true|The asset name|

<details>
<summary>Output</summary>

```js
{
  address: 'AM6ytPW78KYxQCmU2pHYGcee7GypZ7Yhhc',
  addressTag: '',
  asset: 'NEO',
  success: true,
}
```

</details>

### WebSockets

Every websocket utility returns a function you can call to close the opened
connection and avoid memory issues.

```js
const clean = client.ws.depth('ETHBTC', depth => {
  console.log(depth)
})

// After you're done
clean()
```

#### depth

Live depth market data feed. The first parameter can either
be a single symbol string or an array of symbols.

```js
client.ws.depth('ETHBTC', depth => {
  console.log(depth)
})
```

<details>
<summary>Output</summary>

```js
{
  eventType: 'depthUpdate',
  eventTime: 1508612956950,
  symbol: 'ETHBTC',
  updateId: 18331140,
  bidDepth: [
    { price: '0.04896500', quantity: '0.00000000' },
    { price: '0.04891100', quantity: '15.00000000' },
    { price: '0.04891000', quantity: '0.00000000' } ],
  askDepth: [
    { price: '0.04910600', quantity: '0.00000000' },
    { price: '0.04910700', quantity: '11.24900000' }
  ]
}
```

</details>

#### partialDepth

Top levels bids and asks, pushed every second. Valid levels are 5, 10, or 20.
Accepts an array of objects for multiple depths.

```js
client.ws.partialDepth({ symbol: 'ETHBTC', level: 10 }, depth => {
  console.log(depth)
})
```

<details>
<summary>Output</summary>

```js
{
  symbol: 'ETHBTC',
  level: 10,
  bids: [
    { price: '0.04896500', quantity: '0.00000000' },
    { price: '0.04891100', quantity: '15.00000000' },
    { price: '0.04891000', quantity: '0.00000000' }
  ],
  asks: [
    { price: '0.04910600', quantity: '0.00000000' },
    { price: '0.04910700', quantity: '11.24900000' }
  ]
}
```

</details>

#### ticker

24hr Ticker statistics for a symbol pushed every second. Accepts an array of symbols.

```js
client.ws.ticker('HSRETH', ticker => {
  console.log(ticker)
})
```

<details>
<summary>Output</summary>

```js
{
  eventType: '24hrTicker',
  eventTime: 1514670820924,
  symbol: 'HSRETH',
  priceChange: '-0.00409700',
  priceChangePercent: '-11.307',
  weightedAvg: '0.03394946',
  prevDayClose: '0.03623500',
  curDayClose: '0.03213800',
  closeTradeQuantity: '7.02000000',
  bestBid: '0.03204200',
  bestBidQnt: '78.00000000',
  bestAsk: '0.03239800',
  bestAskQnt: '7.00000000',
  open: '0.03623500',
  high: '0.03659900',
  low: '0.03126000',
  volume: '100605.15000000',
  volumeQuote: '3415.49097353',
  openTime: 1514584420922,
  closeTime: 1514670820922,
  firstTradeId: 344803,
  lastTradeId: 351380,
  totalTrades: 6578
}
```

</details>

#### allTickers

Retrieves all the tickers.

```js
client.ws.allTickers(tickers => {
  console.log(tickers)
})
```

#### candles

Live candle data feed for a given interval. You can pass either a symbol string
or a symbol array.

```js
client.ws.candles('ETHBTC', '1m', candle => {
  console.log(candle)
})
```

<details>
<summary>Output</summary>

```js
{
  eventType: 'kline',
  eventTime: 1508613366276,
  symbol: 'ETHBTC',
  open: '0.04898000',
  high: '0.04902700',
  low: '0.04898000',
  close: '0.04901900',
  volume: '37.89600000',
  trades: 30,
  interval: '5m',
  isFinal: false,
  quoteVolume: '1.85728874',
  buyVolume: '21.79900000',
  quoteBuyVolume: '1.06838790'
}
```

</details>

#### trades

Live trade data feed. Pass either a single symbol string or an array of symbols.

```js
client.ws.trades(['ETHBTC', 'BNBBTC'], trade => {
  console.log(trade)
})
```

<details>
<summary>Output</summary>

```js
{
  eventType: 'aggTrade',
  eventTime: 1508614495052,
  symbol: 'ETHBTC',
  price: '0.04923600',
  quantity: '3.43500000',
  maker: false,
  tradeId: 2148226
}
```

</details>

#### user

Live user messages data feed.

**Requires authentication**

```js
const clean = await client.ws.user(msg => {
  console.log(msg)
})
```

Note that this method returns a promise returning a `clean` callback, that will clear
the keep-alive interval and close the data stream.

<details>
<summary>Output</summary>

```js
{
  eventType: 'account',
  eventTime: 1508614885818,
  balances: {
    '123': { available: '0.00000000', locked: '0.00000000' },
    '456': { available: '0.00000000', locked: '0.00000000' },
    BTC: { available: '0.00000000', locked: '0.00000000' },
  ]
}
```

</details>
