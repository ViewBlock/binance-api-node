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
    
    export interface AggregatedTrade {
        aggId: number;
        price: string;
        quantity: string;
        firstId: number;
        lastId: number;
        timestamp: number;
        isBuyerMaker: boolean;
        wasBestPrice: boolean;
    }

    export interface AssetBalance {
        asset: string;
        free: string;
        locked: string;
    }

    export interface Binance {
        accountInfo(options?: { useServerTime: boolean }): Promise<Account>;
        aggTrades(options?: { symbol: string, fromId?: string, startTime?: number, endTime?: number, limit?: number }): Promise<AggregatedTrade>;
        allBookTickers(): { [key: string]: Ticker };
        book(options: { symbol: string, limit?: number }): Promise<OrderBook>;
        exchangeInfo(): Promise<ExchangeInfo>;
        order(options: NewOrder): Promise<Order>;
        orderTest(options: NewOrder): Promise<Order>;
        prices(): Promise<{ [index: string]: string }>;
        time(): Promise<number>;
        trades(options: { symbol: string, limit?: number }): Promise<TradeResult[]>;
        ws: WebSocket;
        myTrades(options: { symbol: string, limit?: number, fromId?: number, useServerTime?: boolean }): Promise<MyTrade[]>;
        getOrder(options: { symbol: string; orderId: number, useServerTime?: boolean }): Promise<QueryOrderResult>;
        cancelOrder(options: { symbol: string; orderId: number, useServerTime?: boolean }): Promise<CancelOrderResult>;
        openOrders(options: { symbol: string, useServerTime?: boolean }): Promise<QueryOrderResult[]>;
        dailyStats(options?: { symbol: string }): Promise<DailyStatsResult | DailyStatsResult[]>;
        candles(options: CandlesOptions): Promise<CandleChartResult[]>;
    }

    export interface HttpError extends Error {
        code: number | string;
        message: string;
    }

    export interface WebSocket {
        depth: (pair: string | string[], callback: (depth: Depth) => void) => Function;
        partialDepth: (options: { symbol: string, level: number }, callback: (depth: PartialDepth) => void) => Function;
        ticker: (pair: string, callback: (ticker: Ticker) => void) => Function;
        allTickers: (callback: (tickers: Ticker[]) => void) => Function;
        candles: (pair: string, period: string, callback: (ticker: Candle) => void) => Function;
        trades: (pairs: string[], callback: (trade: Trade) => void) => Function;
        user: ( callback: (msg: OutboundAccountInfo|ExecutionReport) => void) => Function;
    }

    export type CandleChartInterval =
        | '1m'
        | '3m'
        | '5m'
        | '15m'
        | '30m'
        | '1h'
        | '2h'
        | '4h'
        | '6h'
        | '8h'
        | '12h'
        | '1d'
        | '3d'
        | '1w'
        | '1M';

    export type RateLimitType =
        | 'REQUESTS'
        | 'ORDERS';

    export type RateLimitInterval =
        | 'SECOND'
        | 'MINUTE'
        | 'DAY';

    export interface ExchangeInfoRateLimit {
        rateLimitType: RateLimitType;
        interval: RateLimitInterval;
        limit: number;
    }

    export type ExchangeFilterType =
        | 'EXCHANGE_MAX_NUM_ORDERS'
        | 'EXCHANGE_MAX_ALGO_ORDERS';

    export interface ExchangeFilter {
        filterType: ExchangeFilterType;
        limit: number;
    }

    export type SymbolFilterType =
        | 'PRICE_FILTER'
        | 'LOT_SIZE'
        | 'MIN_NOTIONAL'
        | 'MAX_NUM_ORDERS'
        | 'MAX_ALGO_ORDERS';

    export interface SymbolPriceFilter {
        filterType: SymbolFilterType,
        minPrice: string;
        maxPrice: string;
        tickSize: string;
    }

    export interface SymbolLotSizeFilter {
        filterType: SymbolFilterType,
        minQty: string;
        maxQty: string;
        stepSize: string;
    }

    export interface SymbolMinNotionalFilter {
        filterType: SymbolFilterType;
        minNotional: string;
    }

    export interface SymbolMaxNumOrdersFilter {
        filterType: SymbolFilterType;
        limit: number;
    }

    export interface SymbolMaxAlgoOrdersFilter {
        filterType: SymbolFilterType;
        limit: number;
    }

    export type SymbolFilter =
        | SymbolPriceFilter
        | SymbolLotSizeFilter
        | SymbolMinNotionalFilter
        | SymbolMaxNumOrdersFilter
        | SymbolMaxAlgoOrdersFilter;

    export interface Symbol {
        symbol: string;
        status: string;
        baseAsset: string;
        baseAssetPrecision: number;
        quoteAsset: string;
        quotePrecision: number;
        orderTypes: OrderType[];
        icebergAllowed: boolean;
        filters: SymbolFilter[];
    }

    export interface ExchangeInfo {
        timezone: string;
        serverTime: number;
        rateLimits: ExchangeInfoRateLimit[];
        exchangeFilters: ExchangeFilter[];
        symbols: Symbol[];
    }

    export interface OrderBook {
        lastUpdateId: number;
        asks: Bid[];
        bids: Bid[];
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
        useServerTime?: boolean;
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
        firstUpdateId: number;
        finalUpdateId: number;
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
        isBuyerMaker: boolean;
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

    export interface TradeResult {
        id: number;
        price: string;
        qty: string;
        time: number;
        isBuyerMaker: boolean;
        isBestMatch: boolean;
    }

    interface MyTrade {
        id: number;
        orderId: number;
        price: string;
        qty: string;
        commission: string;
        commissionAsset: string;
        time: number;
        isBuyer: boolean;
        isMaker: boolean;
        isBestMatch: boolean;
    }

    interface QueryOrderResult {
        symbol: string;
        orderId: number;
        clientOrderId: string;
        price: string;
        origQty: string;
        executedQty: string;
        status: OrderStatus;
        timeInForce: string;
        type: string;
        side: OrderSide;
        stopPrice: string;
        icebergQty: string;
        time: number;
        isWorking: boolean;
    }

    interface CancelOrderResult {
        symbol: string;
        origClientOrderId: string;
        orderId: number;
        clientOrderId: string;
    }

    export interface DailyStatsResult {
        symbol: string;
        priceChange: string;
        priceChangePercent: string;
        weightedAvgPrice: string;
        prevClosePrice: string;
        lastPrice: string;
        lastQty: string;
        bidPrice: string;
        bidQty: string;
        askPrice: string;
        askQty: string;
        openPrice: string;
        highPrice: string;
        lowPrice: string;
        volume: string;
        quoteVolume: string;
        openTime: number;
        closeTime: number;
        firstId: number; // First tradeId
        lastId: number; // Last tradeId
        count: number; // Trade count
    }

    export interface CandlesOptions {
        symbol: string;
        interval: CandleChartInterval;
        limit?: number;
        startTime?: number;
        endTime?: number;
    }

    export interface CandleChartResult {
        openTime: number;
        open: string;
        high: string;
        low: string;
        close: string;
        volume: string;
        closeTime: number;
        quoteVolume: string;
        trades: number;
        baseAssetVolume: string;
        quoteAssetVolume: string;
    }
}
