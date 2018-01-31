// tslint:disable:interface-name
declare module 'binance-api-node' {
    export default function (options?: { apiKey: string; apiSecret: string }): Binance;

    export interface Account {
        balances: AssetBalance[];
        buyerCommission: number;
        canDeposit: boolean;
        canTrade: boolean;
        canWithdraw: boolean;
        makerCommission: number;
        sellerCommission: number;
        takerCommission: number;
        updateTime: number;
    }

    export interface AssetBalance {
        asset: string;
        free: string;
        locked: string;
    }

    export interface Binance {
        accountInfo(): Promise<Account>;
        order(options: NewOrder): Promise<Order>;
        prices(): Promise<{ [index: string]: string }>;
        time(): Promise<number>;
        ws: WebSocket;
    }

    export interface WebSocket {
        depth: (pair: string, callback: (depth: Depth) => void) => Function;
        partialDepth: (options: { symbol: string, level: number }, callback: (depth: PartialDepth) => void) => Function;
        ticker: (pair: string, callback: (ticker: Ticker) => void) => Function;
        allTickers: (callback: (tickers: Ticker[]) => void) => Function;
        candles: (pair: string, period: string, callback: (ticker: Candle) => void) => Function;
        trades: (pairs: string[], callback: (trade: Trade) => void) => Function;
        user: ( callback: (msg: Message) => void) => Function;
    }

    export interface NewOrder {
        icebergQty?: string;
        newClientOrderId?: string;
        price?: string;
        quantity: string;
        recvWindow?: number;
        side: OrderSide;
        stopPrice?: string;
        symbol: string;
        timeInForce?: TimeInForce;
        type: OrderType;
    }

    interface Order {
        clientOrderId: string;
        executedQty: string;
        icebergQty?: string;
        orderId: number;
        origQty: string;
        price: string;
        side: OrderSide;
        status: OrderStatus;
        stopPrice?: string;
        symbol: string;
        timeInForce: TimeInForce;
        transactTime: number;
        type: OrderType;
    }

    export type OrderSide = 'BUY' | 'SELL';

    export type OrderStatus =
        | 'CANCELED'
        | 'EXPIRED'
        | 'FILLED'
        | 'NEW'
        | 'PARTIALLY_FILLED'
        | 'PENDING_CANCEL'
        | 'REJECTED';

    export type OrderType =
        | 'LIMIT'
        | 'LIMIT_MAKER'
        | 'MARKET'
        | 'STOP_LOSS'
        | 'STOP_LOSS_LIMIT'
        | 'TAKE_PROFIT'
        | 'TAKE_PROFIT_LIMIT';

    export type TimeInForce = 'GTC' | 'IOC';

    interface Depth {
        eventType: string;
        eventTime: number;
        symbol: string;
        updateId: number;
        bidDepth: BidDepth[];
        askDepth: BidDepth[];
    }

    interface BidDepth {
        price: string;
        quantity: string;
    }

    interface PartialDepth {
        symbol: string;
        level: number;
        bids: Bid[];
        asks: Bid[];
    }

    interface Bid {
        price: string;
        quantity: string;
    }

    interface Ticker {
        eventType: string;
        eventTime: number;
        symbol: string;
        priceChange: string;
        priceChangePercent: string;
        weightedAvg: string;
        prevDayClose: string;
        curDayClose: string;
        closeTradeQuantity: string;
        bestBid: string;
        bestBidQnt: string;
        bestAsk: string;
        bestAskQnt: string;
        open: string;
        high: string;
        low: string;
        volume: string;
        volumeQuote: string;
        openTime: number;
        closeTime: number;
        firstTradeId: number;
        lastTradeId: number;
        totalTrades: number;
    }

    interface Candle {
        eventType: string;
        eventTime: number;
        symbol: string;
        startTime: number;
        closeTime: number;
        firstTradeId: number;
        lastTradeId: number;
        open: string;
        high: string;
        low: string;
        close: string;
        volume: string;
        trades: number;
        interval: string;
        isFinal: boolean;
        quoteVolume: string;
        buyVolume: string;
        quoteBuyVolume: string;
    }

    interface Trade {
        eventType: string;
        eventTime: number;
        symbol: string;
        price: string;
        quantity: string;
        maker: boolean;
        tradeId: number;
    }

    interface Message {
        eventType: string;
        eventTime: number;
        balances: Balances;
    }

    interface Balances {
        [key: string]: {
            available: string;
            locked: string;
        };
    }
}
