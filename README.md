# binance-api-node [![Build](https://img.shields.io/travis/HyperCubeProject/binance-api-node.svg?style=flat-square)](https://travis-ci.org/HyperCubeProject/binance-api-node) [![Coverage](https://img.shields.io/coveralls/HyperCubeProject/binance-api-node.svg?style=flat-square)](https://coveralls.io/github/HyperCubeProject/binance-api-node)

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

client.time()
  .then(time => console.log(time))
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
- [Websockets](#websockets)
    - [depth](#depth)
    - [candles](#candles)
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
  symbol: 'ETHBTC',
  side: 'BUY',
  quantity: 1,
  price: 1,
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
```

</details>

#### accountInfo

Get current account information.

```js
console.log(await client.openOrders())
```

|Param|Type|Required|
|--- |--- |--- |
|recvWindow|Number|false|

<details>
<summary>Output</summary>

```js
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
```

</details>

### WebSockets

#### depth

Live depth market data feed for a given symbol.

```js
client.ws.depth('ETHBTC', depth => {
  console.log(depth)
})
```

#### candles

Live candle data feed for a given symbol and interval.

```js
client.ws.candles('ETHBTC', '1m', candle => {
  console.log(candle)
})
```

#### trades

Live trade data feed for a given symbol.

```js
client.ws.trades('ETHBTC', trade => {
  console.log(trade)
})
```

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
