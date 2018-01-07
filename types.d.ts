declare module 'binance-api-node' {
  export default function(options?: { apiKey: string; apiSecret: string }): Binance

  export interface Account {
    balances: Array<AssetBalance>
    buyerCommission: number
    canDeposit: boolean
    canTrade: boolean
    canWithdraw: boolean
    makerCommission: number
    sellerCommission: number
    takerCommission: number
    updateTime: number
  }

  export interface AssetBalance {
    asset: string
    free: string
    locked: string
  }

  export interface Binance {
    accountInfo(): Promise<Account>
    order(options: NewOrder): Promise<Order>
    prices(): Promise<{ [index: string]: string }>
    time(): Promise<number>
  }

  export interface NewOrder {
    icebergQty?: string
    newClientOrderId?: string
    price?: string
    quantity: string
    recvWindow?: number
    side: OrderSide
    stopPrice?: string
    symbol: string
    timeInForce?: TimeInForce
    type: OrderType
  }

  interface Order {
    clientOrderId: string
    executedQty: string
    icebergQty?: string
    orderId: number
    origQty: string
    price: string
    side: OrderSide
    status: OrderStatus
    stopPrice?: string
    symbol: string
    timeInForce: TimeInForce
    transactTime: number
    type: OrderType
  }

  export type OrderSide = 'BUY' | 'SELL'

  export type OrderStatus =
    | 'CANCELED'
    | 'EXPIRED'
    | 'FILLED'
    | 'NEW'
    | 'PARTIALLY_FILLED'
    | 'PENDING_CANCEL'
    | 'REJECTED'

  export type OrderType =
    | 'LIMIT'
    | 'LIMIT_MAKER'
    | 'MARKET'
    | 'STOP_LOSS'
    | 'STOP_LOSS_LIMIT'
    | 'TAKE_PROFIT'
    | 'TAKE_PROFIT_LIMIT'

  export type TimeInForce = 'GTC' | 'IOC'
}
