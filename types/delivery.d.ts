import { BinanceRestClient, OrderSide, OrderStatus, OrderType, TimeInForce } from './base';

export interface DeliveryEndpoints extends BinanceRestClient {
  deliveryPing(): Promise<boolean>;
  deliveryTime(): Promise<{ serverTime: number }>;
  deliveryExchangeInfo(): Promise<any>;
  deliveryBook(payload: { symbol: string; limit?: number }): Promise<{
    lastUpdateId: number;
    asks: Array<[string, string]>;
    bids: Array<[string, string]>;
  }>;
  deliveryAggTrades(payload: { symbol: string; fromId?: number; startTime?: number; endTime?: number; limit?: number }): Promise<Array<{
    aggId: number;
    symbol: string;
    price: string;
    quantity: string;
    firstId: number;
    lastId: number;
    timestamp: number;
    isBuyerMaker: boolean;
  }>>;
  deliveryMarkPrice(payload: { symbol: string }): Promise<{
    symbol: string;
    markPrice: string;
    lastFundingRate: string;
    nextFundingTime: number;
    time: number;
  }>;
  deliveryAllForceOrders(payload?: { symbol?: string; startTime?: number; endTime?: number; limit?: number }): Promise<Array<{
    symbol: string;
    price: string;
    origQty: string;
    executedQty: string;
    avragePrice: string;
    status: OrderStatus;
    timeInForce: TimeInForce;
    type: OrderType;
    side: OrderSide;
    time: number;
  }>>;
  deliveryLongShortRatio(payload: { symbol: string; period?: string; limit?: number; startTime?: number; endTime?: number }): Promise<Array<{
    symbol: string;
    longShortRatio: string;
    longAccount: string;
    shortAccount: string;
    timestamp: number;
  }>>;
  deliveryCandles(payload: { symbol: string; interval: string; startTime?: number; endTime?: number; limit?: number }): Promise<Array<{
    openTime: number;
    open: string;
    high: string;
    low: string;
    close: string;
    volume: string;
    closeTime: number;
    baseVolume: string;
    trades: number;
    quoteAssetVolume: string;
    baseAssetVolume: string;
  }>>;
  deliveryMarkPriceCandles(payload: { symbol: string; interval: string; startTime?: number; endTime?: number; limit?: number }): Promise<Array<{
    openTime: number;
    open: string;
    high: string;
    low: string;
    close: string;
    volume: string;
    closeTime: number;
    baseVolume: string;
    trades: number;
    quoteAssetVolume: string;
    baseAssetVolume: string;
  }>>;
  deliveryIndexPriceCandles(payload: { pair: string; interval: string; startTime?: number; endTime?: number; limit?: number }): Promise<Array<{
    openTime: number;
    open: string;
    high: string;
    low: string;
    close: string;
    volume: string;
    closeTime: number;
    baseVolume: string;
    trades: number;
    quoteAssetVolume: string;
    baseAssetVolume: string;
  }>>;
  deliveryTrades(payload: { symbol: string; limit?: number }): Promise<Array<{
    id: number;
    price: string;
    qty: string;
    baseQty: string;
    time: number;
    isBuyerMaker: boolean;
  }>>;
  deliveryDailyStats(payload?: { symbol?: string }): Promise<Array<{
    symbol: string;
    pair: string;
    priceChange: string;
    priceChangePercent: string;
    weightedAvgPrice: string;
    lastPrice: string;
    lastQty: string;
    openPrice: string;
    highPrice: string;
    lowPrice: string;
    volume: string;
    baseVolume: string;
    openTime: number;
    closeTime: number;
    firstId: number;
    lastId: number;
    count: number;
  }>>;
  deliveryPrices(): Promise<{
    [key: string]: string;
  }>;
  deliveryAllBookTickers(): Promise<{
    [key: string]: {
      symbol: string;
      pair: string;
      bidPrice: string;
      bidQty: string;
      askPrice: string;
      askQty: string;
      time: number;
    };
  }>;
  deliveryFundingRate(payload: { symbol: string }): Promise<{
    symbol: string;
    fundingRate: string;
    fundingTime: number;
  }>;
  deliveryOrder(payload: {
    symbol: string;
    side: OrderSide;
    type: OrderType;
    quantity?: string;
    quoteOrderQty?: string;
    price?: string;
    newClientOrderId?: string;
    stopPrice?: string;
    trailingDelta?: number;
    trailingTime?: number;
    icebergQty?: string;
    newOrderRespType?: string;
    timeInForce?: TimeInForce;
  }): Promise<{
    symbol: string;
    orderId: number;
    orderListId: number;
    clientOrderId: string;
    transactTime: number;
    price: string;
    origQty: string;
    executedQty: string;
    cumQuote: string;
    status: OrderStatus;
    timeInForce: TimeInForce;
    type: OrderType;
    side: OrderSide;
    marginBuyBorrowAmount: string;
    marginBuyBorrowAsset: string;
    fills: Array<{
      price: string;
      qty: string;
      commission: string;
      commissionAsset: string;
    }>;
  }>;
  deliveryBatchOrders(payload: { batchOrders: Array<{
    symbol: string;
    side: OrderSide;
    type: OrderType;
    quantity?: string;
    quoteOrderQty?: string;
    price?: string;
    newClientOrderId?: string;
    stopPrice?: string;
    trailingDelta?: number;
    trailingTime?: number;
    icebergQty?: string;
    newOrderRespType?: string;
    timeInForce?: TimeInForce;
  }> }): Promise<Array<{
    code: number;
    msg: string;
    symbol: string;
    orderId: number;
    orderListId: number;
    clientOrderId: string;
    transactTime: number;
    price: string;
    origQty: string;
    executedQty: string;
    cumQuote: string;
    status: OrderStatus;
    timeInForce: TimeInForce;
    type: OrderType;
    side: OrderSide;
    marginBuyBorrowAmount: string;
    marginBuyBorrowAsset: string;
    fills: Array<{
      price: string;
      qty: string;
      commission: string;
      commissionAsset: string;
    }>;
  }>>;
  deliveryGetOrder(payload: { symbol: string; orderId?: number; origClientOrderId?: string }): Promise<{
    symbol: string;
    orderId: number;
    clientOrderId: string;
    transactTime: number;
    price: string;
    origQty: string;
    executedQty: string;
    cumQuote: string;
    status: OrderStatus;
    timeInForce: TimeInForce;
    type: OrderType;
    side: OrderSide;
    marginBuyBorrowAmount: string;
    marginBuyBorrowAsset: string;
    fills: Array<{
      price: string;
      qty: string;
      commission: string;
      commissionAsset: string;
    }>;
  }>;
  deliveryCancelOrder(payload: { symbol: string; orderId?: number; origClientOrderId?: string }): Promise<{
    symbol: string;
    origClientOrderId: string;
    orderId: number;
    orderListId: number;
    clientOrderId: string;
    transactTime: number;
    price: string;
    origQty: string;
    executedQty: string;
    cumQuote: string;
    status: OrderStatus;
    timeInForce: TimeInForce;
    type: OrderType;
    side: OrderSide;
  }>;
  deliveryCancelAllOpenOrders(payload: { symbol: string }): Promise<Array<{
    symbol: string;
    origClientOrderId: string;
    orderId: number;
    orderListId: number;
    clientOrderId: string;
    transactTime: number;
    price: string;
    origQty: string;
    executedQty: string;
    cumQuote: string;
    status: OrderStatus;
    timeInForce: TimeInForce;
    type: OrderType;
    side: OrderSide;
  }>>;
  deliveryCancelBatchOrders(payload: { symbol: string; orderIdList: number[] }): Promise<Array<{
    code: number;
    msg: string;
    symbol: string;
    orderId: number;
    orderListId: number;
    clientOrderId: string;
    transactTime: number;
    price: string;
    origQty: string;
    executedQty: string;
    cumQuote: string;
    status: OrderStatus;
    timeInForce: TimeInForce;
    type: OrderType;
    side: OrderSide;
  }>>;
  deliveryOpenOrders(payload?: { symbol?: string }): Promise<Array<{
    symbol: string;
    orderId: number;
    orderListId: number;
    clientOrderId: string;
    transactTime: number;
    price: string;
    origQty: string;
    executedQty: string;
    cumQuote: string;
    status: OrderStatus;
    timeInForce: TimeInForce;
    type: OrderType;
    side: OrderSide;
    marginBuyBorrowAmount: string;
    marginBuyBorrowAsset: string;
    fills: Array<{
      price: string;
      qty: string;
      commission: string;
      commissionAsset: string;
    }>;
  }>>;
  deliveryAllOrders(payload: { symbol: string; orderId?: number; startTime?: number; endTime?: number; limit?: number }): Promise<Array<{
    symbol: string;
    orderId: number;
    orderListId: number;
    clientOrderId: string;
    transactTime: number;
    price: string;
    origQty: string;
    executedQty: string;
    cumQuote: string;
    status: OrderStatus;
    timeInForce: TimeInForce;
    type: OrderType;
    side: OrderSide;
    marginBuyBorrowAmount: string;
    marginBuyBorrowAsset: string;
    fills: Array<{
      price: string;
      qty: string;
      commission: string;
      commissionAsset: string;
    }>;
  }>>;
  deliveryPositionRisk(payload?: { symbol?: string }): Promise<Array<{
    entryPrice: string;
    leverage: string;
    liquidationPrice: string;
    markPrice: string;
    maxNotionalValue: string;
    positionAmt: string;
    symbol: string;
    unRealizedProfit: string;
    isolatedMargin: string;
    isolatedWallet: string;
    isolatedUnrealizedProfit: string;
    isolatedMarginLevel: string;
    isolatedMaintMargin: string;
    isolatedMaxNotionalValue: string;
    notional: string;
    unrealizedPnl: string;
    marginLevel: string;
  }>>;
  deliveryLeverageBracket(payload: { symbol: string }): Promise<Array<{
    symbol: string;
    brackets: Array<{
      bracket: number;
      initialLeverage: number;
      notionalCap: number;
      notionalFloor: number;
      maintMarginRatio: number;
      cum: number;
    }>;
  }>>;
  deliveryAccountBalance(): Promise<Array<{
    accountAlias: string;
    asset: string;
    balance: string;
    withdrawAvailable: string;
    crossWalletBalance: string;
    crossUnPnl: string;
    availableBalance: string;
    updateTime: number;
  }>>;
  deliveryAccountInfo(): Promise<{
    assets: Array<{
      asset: string;
      walletBalance: string;
      unrealizedProfit: string;
      marginBalance: string;
      initialMargin: string;
      positionInitialMargin: string;
      openOrderInitialMargin: string;
      maxWithdrawAmount: string;
      crossUnPnl: string;
      crossWalletBalance: string;
      crossMarginBalance: string;
      availableBalance: string;
      marginAvailable: boolean;
      updateTime: number;
    }>;
    positions: Array<{
      symbol: string;
      positionAmt: string;
      entryPrice: string;
      markPrice: string;
      unRealizedProfit: string;
      liquidationPrice: string;
      leverage: string;
      maxNotionalValue: string;
      marginType: string;
      isolatedMargin: string;
      isolatedWallet: string;
      isolatedUnrealizedProfit: string;
      isolatedMarginLevel: string;
      isolatedMaintMargin: string;
      isolatedMaxNotionalValue: string;
      notional: string;
      unrealizedPnl: string;
      marginLevel: string;
    }>;
    canDeposit: boolean;
    canTrade: boolean;
    canWithdraw: boolean;
    feeTier: number;
    updateTime: number;
    totalInitialMargin: string;
    totalMaintMargin: string;
    totalWalletBalance: string;
    totalUnrealizedProfit: string;
    totalMarginBalance: string;
    totalPositionInitialMargin: string;
    totalOpenOrderInitialMargin: string;
    totalCrossWalletBalance: string;
    totalCrossUnPnl: string;
    availableBalance: string;
    maxWithdrawAmount: string;
  }>;
  deliveryUserTrades(payload: { symbol: string; startTime?: number; endTime?: number; fromId?: number; limit?: number }): Promise<Array<{
    symbol: string;
    id: number;
    orderId: number;
    side: OrderSide;
    price: string;
    qty: string;
    realizedPnl: string;
    marginAsset: string;
    baseQty: string;
    commission: string;
    commissionAsset: string;
    time: number;
    positionSide: string;
    buyer: boolean;
    maker: boolean;
  }>>;
  deliveryPositionMode(payload: { dualSidePosition: boolean }): Promise<{
    code: number;
    msg: string;
  }>;
  deliveryPositionModeChange(payload: { dualSidePosition: boolean }): Promise<{
    code: number;
    msg: string;
  }>;
  deliveryLeverage(payload: { symbol: string; leverage: number }): Promise<{
    leverage: number;
    maxNotionalValue: string;
    symbol: string;
  }>;
  deliveryMarginType(payload: { symbol: string; marginType: string }): Promise<{
    code: number;
    msg: string;
  }>;
  deliveryPositionMargin(payload: { symbol: string; positionSide: string; amount: string; type: number }): Promise<{
    code: number;
    msg: string;
  }>;
  deliveryMarginHistory(payload: { symbol: string }): Promise<Array<{
    symbol: string;
    positionSide: string;
    marginType: string;
    amount: string;
    asset: string;
    time: number;
  }>>;
  deliveryIncome(payload?: { symbol?: string; incomeType?: string; startTime?: number; endTime?: number; limit?: number }): Promise<Array<{
    symbol: string;
    incomeType: string;
    income: string;
    asset: string;
    info: string;
    time: number;
    tradeId: string;
    infoDetail: string;
  }>>;
} 