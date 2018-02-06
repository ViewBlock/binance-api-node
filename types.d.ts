// tslint:disable:interface-name
import {OrderFill} from "binance-api-node";

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
        user: ( callback: (msg: OutboundAccountInfo|ExecutionReport) => void) => Function;
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

    interface OrderFill {
        price: string;
        qty: string;
        commission: string;
        commissionAsset: string;
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
        fills?: OrderFill[];
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

    export type TimeInForce = 'GTC' | 'IOC' | 'FOK';

    export type ExecutionType =
        | 'NEW'
        | 'CANCELED'
        | 'REPLACED'
        | 'REJECTED'
        | 'TRADE'
        | 'EXPIRED';

    export type EventType =
        | 'executionReport'
        | 'account';

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
        eventType: EventType;
        eventTime: number;
    }

    interface Balances {
        [key: string]: {
            available: string;
            locked: string;
        };
    }

    interface OutboundAccountInfo extends Message {
        balances: Balances;
        makerCommissionRate: number;
        takerCommissionRate: number;
        buyerCommissionRate: number;
        sellerCommissionRate: number;
        canTrade: boolean;
        canWithdraw: boolean;
        canDeposit: boolean;
        lastAccountUpdate: number;
    }

    interface ExecutionReport extends Message {
        symbol: string;
        newClientOrderId: string;
        originalClientOrderId: string;
        side: OrderSide;
        orderType: OrderType;
        timeInForce: TimeInForce;
        quantity: string;
        price: string;
        executionType: ExecutionType;
        stopPrice: string;
        icebergQuantity: string;
        orderStatus: OrderStatus;
        orderRejectReason: string;
        orderId: number;
        orderTime: number;
        lastTradeQuantity: string;
        totalTradeQuantity: string;
        priceLastTrade: string;
        commission: string;
        commissionAsset: string;
        tradeId: number;
        isOrderWorking: boolean;
        isBuyerMaker: boolean;
    }
}
