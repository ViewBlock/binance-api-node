// tslint:disable:interface-name
declare module 'binance-api-node' {
  export default function(options?: {
    apiKey?: string
    apiSecret?: string
    getTime?: () => number | Promise<number>
    httpBase?: string
    httpFutures?: string
    wsBase?: string
    wsFutures?: string
    proxy?: string
  }): Binance

  export type ErrorCodes_LT =
    | -1000
    | -1001
    | -1002
    | -1003
    | -1006
    | -1007
    | -1013
    | -1014
    | -1015
    | -1016
    | -1020
    | -1021
    | -1022
    | -1100
    | -1101
    | -1102
    | -1103
    | -1104
    | -1105
    | -1106
    | -1112
    | -1114
    | -1115
    | -1116
    | -1117
    | -1118
    | -1119
    | -1120
    | -1121
    | -1125
    | -1127
    | -1128
    | -1130
    | -2008
    | -2009
    | -2010
    | -2012
    | -2013
    | -2014
    | -2015

  export const enum ErrorCodes {
    UNKNOWN = -1000,
    DISCONNECTED = -1001,
    UNAUTHORIZED = -1002,
    TOO_MANY_REQUESTS = -1003,
    UNEXPECTED_RESP = -1006,
    TIMEOUT = -1007,
    INVALID_MESSAGE = -1013,
    UNKNOWN_ORDER_COMPOSITION = -1014,
    TOO_MANY_ORDERS = -1015,
    SERVICE_SHUTTING_DOWN = -1016,
    UNSUPPORTED_OPERATION = -1020,
    INVALID_TIMESTAMP = -1021,
    INVALID_SIGNATURE = -1022,
    ILLEGAL_CHARS = -1100,
    TOO_MANY_PARAMETERS = -1101,
    MANDATORY_PARAM_EMPTY_OR_MALFORMED = -1102,
    UNKNOWN_PARAM = -1103,
    UNREAD_PARAMETERS = -1104,
    PARAM_EMPTY = -1105,
    PARAM_NOT_REQUIRED = -1106,
    NO_DEPTH = -1112,
    TIF_NOT_REQUIRED = -1114,
    INVALID_TIF = -1115,
    INVALID_ORDER_TYPE = -1116,
    INVALID_SIDE = -1117,
    EMPTY_NEW_CL_ORD_ID = -1118,
    EMPTY_ORG_CL_ORD_ID = -1119,
    BAD_INTERVAL = -1120,
    BAD_SYMBOL = -1121,
    INVALID_LISTEN_KEY = -1125,
    MORE_THAN_XX_HOURS = -1127,
    OPTIONAL_PARAMS_BAD_COMBO = -1128,
    INVALID_PARAMETER = -1130,
    BAD_API_ID = -2008,
    DUPLICATE_API_KEY_DESC = -2009,
    INSUFFICIENT_BALANCE = -2010,
    CANCEL_ALL_FAIL = -2012,
    NO_SUCH_ORDER = -2013,
    BAD_API_KEY_FMT = -2014,
    REJECTED_MBX_KEY = -2015,
  }

  export enum HttpMethod {
    GET = 'GET',
    HEAD = 'HEAD',
    POST = 'POST',
    PUT = 'PUT',
    DELETE = 'DELETE',
    CONNECT = 'CONNECT',
    OPTIONS = 'OPTIONS',
    TRACE = 'TRACE',
    PATCH = 'PATCH',
  }

  export interface Account {
    accountType: TradingType.MARGIN | TradingType.SPOT
    balances: AssetBalance[]
    buyerCommission: number
    canDeposit: boolean
    canTrade: boolean
    canWithdraw: boolean
    makerCommission: number
    permissions: TradingType_LT[]
    sellerCommission: number
    takerCommission: number
    updateTime: number
  }
  export interface TradeFee {
    symbol: string
    makerCommission: number
    takerCommission: number
  }
  export interface AggregatedTrade {
    aggId: number
    symbol: string
    price: string
    quantity: string
    firstId: number
    lastId: number
    timestamp: number
    isBuyerMaker: boolean
    wasBestPrice: boolean
  }

  export interface AssetBalance {
    asset: string
    free: string
    locked: string
  }

  export type booleanString = 'true' | 'false'

  export interface positionAmount {
    amount: string
    amountInBTC: string
    amountInUSDT: string
    asset: string
  }

  export interface MultiAssetsMargin {
    multiAssetsMargin: boolean
  }

  export interface LendingAccount {
    positionAmountVos: positionAmount[]
    totalAmountInBTC: string
    totalAmountInUSDT: string
    totalFixedAmountInBTC: string
    totalFixedAmountInUSDT: string
    totalFlexibleInBTC: string
    totalFlexibleInUSDT: string
  }

  export interface FundingWallet {
    asset: string
    free: string // available balance
    locked: string // locked asset
    freeze: string // freeze asset
    withdrawing: string
    btcValuation: string
  }

  export interface NetworkInformation {
    addressRegex: string
    coin: string
    depositDesc: string
    depositEnable: boolean
    isDefault: boolean
    memoRegex: string
    minConfirm: number
    name: string
    network: string
    resetAddressStatus: boolean
    specialTips: string
    unLockConfirm: number
    withdrawDesc: string
    withdrawEnable: boolean
    withdrawFee: number
    withdrawIntegerMultiple: number
    withdrawMax: number
    withdrawMin: number
    sameAddress: string
  }

  export interface CoinInformation {
    coin: string
    depositAllEnable: boolean
    free: number
    freeze: number
    ipoable: number
    ipoing: number
    isLegalMoney: boolean
    locked: number
    name: string
    networkList: NetworkInformation[]
  }

  export interface DepositAddress {
    address: string
    tag: string
    coin: string
    url: string
  }

  export interface WithdrawResponse {
    id: string
  }

  export type DepositStatus_LT = 0 | 1

  export const enum DepositStatus {
    PENDING = 0,
    SUCCESS = 1,
  }

  export interface UserAssetDribbletDetails {
    transId: number
    serviceChargeAmount: string
    amount: string
    operateTime: number
    transferedAmount: string
    fromAsset: string
  }

  export interface UserAssetDribblets {
    operateTime: number
    totalTransferedAmount: string
    totalServiceChargeAmount: string
    transId: number
    userAssetDribbletDetails: UserAssetDribbletDetails[]
  }

  export interface DustLog {
    total: number
    userAssetDribblets: UserAssetDribblets[]
  }

  export interface DepositHistoryResponse {
    [index: number]: {
      insertTime: number
      amount: string
      coin: string
      network: string
      address: string
      txId: string
      status: DepositStatus_LT
      addressTag?: string
      transferType?: number
      confirmTimes?: string
    }
  }

  export type WithdrawStatus_LT = 0 | 1 | 2 | 3 | 4 | 5 | 6

  export const enum WithdrawStatus {
    EMAIL_SENT = 0,
    CANCELLED = 1,
    AWAITING_APPROVAL = 2,
    REJECTED = 3,
    PROCESSING = 4,
    FAILURE = 5,
    COMPLETED = 6,
  }

  export interface WithdrawHistoryResponse {
    [index: number]: {
      id: string
      amount: string
      transactionFee: string
      address: string
      coin: string
      txId: string
      applyTime: number
      status: WithdrawStatus_LT
      network: string
      transferType?: number
      withdrawOrderId?: string
    }
  }

  export interface AssetDetail {
    [asset: string]: {
      minWithdrawAmount: string
      depositStatus: boolean
      withdrawFee: string
      withdrawStatus: boolean
      depositTip?: string
    }
  }

  export interface BNBBurn {
    spotBNBBurn: boolean
    interestBNBBurn: boolean
  }

  export interface SetBNBBurnOptions {
    spotBNBBurn?: boolean | booleanString
    interestBNBBurn?: boolean | booleanString
    recvWindow?: number
  }

  export interface AccountSnapshot {
    code: number
    msg: string
    snapshotVos: {
      data: {
        balances: {
          asset: string
          free: number
          locked: number
        }[]
        totalAssetOfBtc: number
      }
      type: string
      updateTime: number
    }[]
  }

  export type GetOrderOptions =
    | { symbol: string; orderId: number; useServerTime?: boolean }
    | { symbol: string; origClientOrderId: string; useServerTime?: boolean }

  export type CancelOrderOptions =
    | { symbol: string; orderId: number; useServerTime?: boolean; newClientOrderId?: string }
    | {
        symbol: string
        origClientOrderId: string
        useServerTime?: boolean
        newClientOrderId?: string
      }

  export type GetOrderOcoOptions =
    | { orderListId: number; useServerTime?: boolean }
    | { listClientOrderId: string; useServerTime?: boolean }

  export type CancelOrderOcoOptions =
    | { symbol: string; orderListId: number; useServerTime?: boolean; newClientOrderId?: string }
    | {
        symbol: string
        listClientOrderId: string
        useServerTime?: boolean
        newClientOrderId?: string
      }

  export type cancelOpenOrdersOptions = {
    symbol: string
    useServerTime?: boolean
  }

  export interface GetInfo {
    spot: GetInfoDetails
    futures: GetInfoDetails
  }

  export type GetInfoDetails = {
    usedWeight1m?: string
    orderCount10s?: string
    orderCount1m?: string
    orderCount1h?: string
    orderCount1d?: string
    responseTime?: string
  }

  export type TransferType_LT =
    | 'MAIN_C2C'
    | 'MAIN_UMFUTURE'
    | 'MAIN_CMFUTURE'
    | 'MAIN_MARGIN'
    | 'MAIN_MINING'
    | 'C2C_MAIN'
    | 'C2C_UMFUTURE'
    | 'C2C_MINING'
    | 'UMFUTURE_MAIN'
    | 'UMFUTURE_C2C'
    | 'UMFUTURE_MARGIN'
    | 'CMFUTURE_MAIN'
    | 'MARGIN_MAIN'
    | 'MARGIN_UMFUTURE'
    | 'MINING_MAIN'
    | 'MINING_UMFUTURE'
    | 'MINING_C2C'

  export const enum TransferType {
    MAIN_C2C = 'MAIN_C2C',
    MAIN_UMFUTURE = 'MAIN_UMFUTURE',
    MAIN_CMFUTURE = 'MAIN_CMFUTURE',
    MAIN_MARGIN = 'MAIN_MARGIN',
    MAIN_MINING = 'MAIN_MINING',
    C2C_MAIN = 'C2C_MAIN',
    C2C_UMFUTURE = 'C2C_UMFUTURE',
    C2C_MINING = 'C2C_MINING',
    UMFUTURE_MAIN = 'UMFUTURE_MAIN',
    UMFUTURE_C2C = 'UMFUTURE_C2C',
    UMFUTURE_MARGIN = 'UMFUTURE_MARGIN',
    CMFUTURE_MAIN = 'CMFUTURE_MAIN',
    MARGIN_MAIN = 'MARGIN_MAIN',
    MARGIN_UMFUTURE = 'MARGIN_UMFUTURE',
    MINING_MAIN = 'MINING_MAIN',
    MINING_UMFUTURE = 'MINING_UMFUTURE',
    MINING_C2C = 'MINING_C2C',
  }

  export interface UniversalTransfer {
    type: TransferType_LT
    asset: string
    amount: string
    recvWindow?: number
  }

  export interface UniversalTransferHistory {
    type: TransferType_LT
    startTime?: number
    endTime?: number
    current?: number
    size?: number
    recvWindow?: number
  }

  export interface UniversalTransferHistoryResponse {
    total: string
    rows: {
      asset: string
      amount: string
      type: TransferType_LT
      status: string
      tranId: number
      timestamp: number
    }[]
  }

  export interface MarginBorrowParent {
    asset: string
    isIsolated?: 'TRUE' | 'FALSE'
    amount: string
    recvWindow?: number
  }

  export interface MarginBorrowCross extends MarginBorrowParent {
    isIsolated?: 'FALSE'
  }

  export interface MarginBorrowIsolated extends MarginBorrowParent {
    isIsolated: 'TRUE'
    symbol: string
  }

  export type MarginBorrowOptions = MarginBorrowCross | MarginBorrowIsolated

  export type MarginType_LT = 'ISOLATED' | 'CROSSED'

  export const enum MarginType {
    ISOLATED = 'ISOLATED',
    CROSSED = 'CROSSED',
  }

  export interface ApiPermission {
    ipRestrict: boolean
    createTime: number
    enableWithdrawals: boolean
    enableInternalTransfer: boolean
    permitsUniversalTransfer: boolean
    enableVanillaOptions: boolean
    enableReading: boolean
    enableFutures: boolean
    enableMargin: boolean
    enableSpotAndMarginTrading: boolean
    tradingAuthorityExpirationTime: number
  }

  export interface Binance {
    getInfo(): GetInfo
    accountInfo(options?: { useServerTime: boolean }): Promise<Account>
    tradeFee(options?: { useServerTime: boolean }): Promise<TradeFee[]>
    aggTrades(options?: {
      symbol: string
      fromId?: string
      startTime?: number
      endTime?: number
      limit?: number
    }): Promise<AggregatedTrade[]>
    allBookTickers(): Promise<{ [key: string]: Ticker }>
    book(options: { symbol: string; limit?: number }): Promise<OrderBook>
    exchangeInfo(options?: { symbol: string }): Promise<ExchangeInfo>
    lendingAccount(options?: { useServerTime: boolean }): Promise<LendingAccount>
    fundingWallet(options?: {
      asset?: string
      needBtcValuation?: booleanString
      useServerTime?: boolean
    }): Promise<FundingWallet[]>
    apiPermission(options?: { recvWindow?: number }): Promise<ApiPermission>
    order(options: NewOrderSpot): Promise<Order>
    orderTest(options: NewOrderSpot): Promise<Order>
    orderOco(options: NewOcoOrder): Promise<OcoOrder>
    ping(): Promise<boolean>
    prices(options?: { symbol?: string }): Promise<{ [index: string]: string }>
    avgPrice(options?: { symbol: string }): Promise<AvgPriceResult | AvgPriceResult[]>
    time(): Promise<number>
    trades(options: { symbol: string; limit?: number }): Promise<TradeResult[]>
    ws: WebSocket
    myTrades(options: {
      symbol: string
      orderId?: number
      startTime?: number
      endTime?: number
      fromId?: number
      limit?: number
      recvWindow?: number
      useServerTime?: boolean
    }): Promise<MyTrade[]>
    getOrder(options: GetOrderOptions): Promise<QueryOrderResult>
    getOrderOco(options: GetOrderOcoOptions): Promise<QueryOrderOcoResult>
    cancelOrder(options: CancelOrderOptions): Promise<CancelOrderResult>
    cancelOrderOco(options: CancelOrderOcoOptions): Promise<CancelOrderOcoResult>
    cancelOpenOrders(options: cancelOpenOrdersOptions): Promise<CancelOrderResult[]>
    openOrders(options: {
      symbol?: string
      recvWindow?: number
      useServerTime?: boolean
    }): Promise<QueryOrderResult[]>
    allOrders(options: {
      symbol?: string
      orderId?: number
      startTime?: number
      endTime?: number
      limit?: number
      recvWindow?: number
      timestamp?: number
      useServerTime?: boolean
    }): Promise<QueryOrderResult[]>
    allOrdersOCO(options: {
      timestamp: number
      fromId?: number
      startTime?: number
      endTime?: number
      limit?: number
      recvWindow: number
    }): Promise<QueryOrderResult[]>
    dailyStats(options?: { symbol: string }): Promise<DailyStatsResult | DailyStatsResult[]>
    candles(options: CandlesOptions): Promise<CandleChartResult[]>
    tradesHistory(options: {
      symbol: string
      limit?: number
      fromId?: number
    }): Promise<TradeResult[]>
    capitalConfigs(options?: { recvWindow?: number }): Promise<CoinInformation[]>
    depositAddress(options: {
      coin: string
      network?: string
      recvWindow?: number
    }): Promise<DepositAddress>
    withdraw(options: {
      coin: string
      network?: string
      address: string
      amount: number
      name?: string
      transactionFeeFlag?: boolean
    }): Promise<WithdrawResponse>
    assetDetail(): Promise<AssetDetail>
    getBnbBurn(): Promise<BNBBurn>
    setBnbBurn(opts: SetBNBBurnOptions): Promise<BNBBurn>
    accountSnapshot(options: {
      type: string
      startTime?: number
      endTime?: number
      limit?: number
    }): Promise<AccountSnapshot>
    withdrawHistory(options: {
      coin: string
      status?: number
      startTime?: number
      endTime?: number
      offset?: number
      limit?: number
    }): Promise<WithdrawHistoryResponse>
    depositHistory(options: {
      coin?: string
      status?: number
      startTime?: number
      endTime?: number
      offset?: number
      limit?: number
      recvWindow?: number
    }): Promise<DepositHistoryResponse>
    dustLog(options: {
        startTime?: number
        endTime?: number
        recvWindow?: number
        timestamp: number
    }): DustLog
    universalTransfer(options: UniversalTransfer): Promise<{ tranId: number }>
    universalTransferHistory(
      options: UniversalTransferHistory,
    ): Promise<UniversalTransferHistoryResponse>
    futuresPing(): Promise<boolean>
    futuresTime(): Promise<number>
    futuresExchangeInfo(): Promise<ExchangeInfo<FuturesOrderType_LT>>
    futuresBook(options: { symbol: string; limit?: number }): Promise<OrderBook>
    futuresCandles(options: CandlesOptions): Promise<CandleChartResult[]>
    futuresMarkPriceCandles(options: CandlesOptions): Promise<CandleChartResult[]>
    futuresIndexPriceCandles(options: IndexPriceCandlesOptions): Promise<CandleChartResult[]>
    futuresAggTrades(options?: {
      symbol: string
      fromId?: string
      startTime?: number
      endTime?: number
      limit?: number
    }): Promise<AggregatedTrade[]>
    futuresTrades(options: { symbol: string; limit?: number }): Promise<TradeResult[]>
    futuresUserTrades(options: {
      symbol?: string
      startTime?: number
      endTime?: number
      fromId?: number
      limit?: number
    }): Promise<FuturesUserTradeResult[]>
    futuresDailyStats(options?: { symbol: string }): Promise<DailyStatsResult | DailyStatsResult[]>
    futuresPrices(options?: { symbol: string }): Promise<{ [index: string]: string }>
    futuresAllBookTickers(): Promise<{ [key: string]: Ticker }>
    futuresMarkPrice(): Promise<MarkPriceResult[]>
    futuresAllForceOrders(options?: {
      symbol?: string
      startTime?: number
      endTime?: number
      limit?: number
    }): Promise<AllForceOrdersResult[]>
    futuresFundingRate(options: {
      symbol: string
      startTime?: number
      endTime?: number
      limit?: number
    }): Promise<FundingRateResult[]>
    futuresOrder(options: NewFuturesOrder): Promise<FuturesOrder>
    futuresBatchOrders(options: {
      batchOrders: NewFuturesOrder[]
      recvWindow?: number
      timestamp?: number
    }): Promise<FuturesOrder[]>
    getMultiAssetsMargin(): Promise<MultiAssetsMargin>
    setMultiAssetsMargin(options: MultiAssetsMargin): Promise<MultiAssetsMargin>

    futuresCancelOrder(options: {
      symbol: string
      orderId: number
      useServerTime?: boolean
    }): Promise<CancelOrderResult>
    futuresCancelAllOpenOrders(options: {
      symbol: string
    }): Promise<FuturesCancelAllOpenOrdersResult>
    futuresCancelBatchOrders(options: {
      symbol: string
      orderIdList?: string
      origClientOrderIdList?: string
      recvWindow?: number
      timestamp?: number
    })
    futuresGetOrder(options: {
      symbol: string
      orderId?: number
      origClientOrderId?: string
      recvWindow?: number
      timestamp?: number
    }): Promise<QueryFuturesOrderResult>
    futuresOpenOrders(options: {
      symbol?: string
      useServerTime?: boolean
    }): Promise<QueryFuturesOrderResult[]>
    futuresAllOrders(options: {
      symbol: string
      orderId?: number
      startTime?: number
      endTime?: number
      limit?: number
      recvWindow?: number
    }): Promise<QueryFuturesOrderResult>
    futuresPositionRisk(options?: {
      symbol?: string
      recvWindow?: number
    }): Promise<PositionRiskResult[]>
    futuresLeverageBracket(options?: {
      symbol?: string
      recvWindow: number
    }): Promise<LeverageBracketResult[]>
    futuresAccountBalance(options?: { recvWindow: number }): Promise<FuturesBalanceResult[]>
    futuresAccountInfo(options?: { recvWindow: number }): Promise<FuturesAccountInfoResult>
    futuresPositionMode(options?: { recvWindow: number }): Promise<PositionModeResult>
    futuresPositionModeChange(options: {
      dualSidePosition: string
      recvWindow: number
    }): Promise<ChangePositionModeResult>
    futuresLeverage(options: {
      symbol: string
      leverage: number
      recvWindow?: number
    }): Promise<FuturesLeverageResult>
    futuresMarginType(options: {
      symbol: string
      marginType: MarginType_LT
      recvWindow?: number
    }): Promise<FuturesMarginTypeResult>
    futuresIncome(options: {
      symbol?: string
      incomeType?: FuturesIncomeType_LT
      startTime?: number
      endTime?: number
      limit?: number
      recvWindow?: number
    }): Promise<FuturesIncomeResult[]>
    marginOrder(options: NewOrderMargin): Promise<Order>
    marginOrderOco(options: NewOcoOrderMargin): Promise<MarginOcoOrder>
    marginGetOrder(options: {
      symbol: string
      isIsolated?: string | boolean
      orderId?: string
      origClientOrderId?: string
      recvWindow?: number
    }): Promise<Order>
    marginAllOrders(options: {
      symbol: string
      useServerTime?: boolean
    }): Promise<QueryOrderResult[]>
    marginCancelOrder(options: {
      symbol: string
      orderId?: number
      useServerTime?: boolean
    }): Promise<CancelOrderResult>
    marginOpenOrders(options: {
      symbol?: string
      useServerTime?: boolean
    }): Promise<QueryOrderResult[]>
    marginRepay(options: MarginBorrowOptions): Promise<{ tranId: number }>
    marginLoan(options: MarginBorrowOptions): Promise<{ tranId: number }>
    marginAccountInfo(options?: { recvWindow?: number }): Promise<IsolatedCrossAccount>
    marginIsolatedAccount(options?: {
      symbols?: string
      recvWindow?: number
    }): Promise<IsolatedMarginAccount>
    marginMaxBorrow(options: {
      asset: string
      isolatedSymbol?: string
      recvWindow?: number
    }): Promise<{ amount: string; borrowLimit: string }>
    marginCreateIsolated(options: {
      base: string
      quote: string
      recvWindow?: number
    }): Promise<{ success: boolean; symbol: string }>
    marginIsolatedTransfer(options: marginIsolatedTransfer): Promise<{ tranId: string }>
    marginIsolatedTransferHistory(
      options: marginIsolatedTransferHistory,
    ): Promise<marginIsolatedTransferHistoryResponse>
    marginMyTrades(options: {
      symbol: string
      isIsolated?: string | boolean
      startTime?: number
      endTime?: number
      limit?: number
      fromId?: number
    }): Promise<MyTrade[]>
    publicRequest(method: HttpMethod, url: string, payload: object): Promise<unknown>
    privateRequest(method: HttpMethod, url: string, payload: object): Promise<unknown>
    disableMarginAccount(options: { symbol: string }): Promise<{ success: boolean; symbol: string }>
    enableMarginAccount(options: { symbol: string }): Promise<{ success: boolean; symbol: string }>
    getPortfolioMarginAccountInfo(): Promise<{
      uniMMR: string
      accountEquity: string
      accountMaintMargin: string
      accountStatus: string
    }>
  }

  export interface HttpError extends Error {
    code: number
    url: string
  }

  export type MarkPrice = {
    eventType: string
    eventTime: number
    symbol: string
    markPrice: string
    indexPrice: string
    settlePrice: string
    fundingRate: string
    nextFundingRate: number
  }

  export type UserDataStreamEvent =
    | OutboundAccountInfo
    | ListStatus
    | ExecutionReport
    | BalanceUpdate
    | OutboundAccountPosition
    | MarginCall

  export interface WebSocket {
    customSubStream: (
      pair: string | string[],
      callback: (data: any) => void,
    ) => ReconnectingWebSocketHandler
    futuresAllMarkPrices: (
      payload: { updateSpeed: '1s' | '3s' },
      callback: (data: MarkPrice[]) => void,
    ) => ReconnectingWebSocketHandler
    futuresCustomSubStream: (
      pair: string | string[],
      callback: (data: any) => void,
    ) => ReconnectingWebSocketHandler
    depth: (
      pair: string | string[],
      callback: (depth: Depth) => void,
      transform?: boolean,
    ) => ReconnectingWebSocketHandler
    futuresDepth: (
      pair: string | string[],
      callback: (depth: Depth) => void,
      transform?: boolean,
    ) => ReconnectingWebSocketHandler
    partialDepth: (
      options: { symbol: string; level: number } | { symbol: string; level: number }[],
      callback: (depth: PartialDepth) => void,
      transform?: boolean,
    ) => ReconnectingWebSocketHandler
    futuresPartialDepth: (
      options: { symbol: string; level: number } | { symbol: string; level: number }[],
      callback: (depth: PartialDepth) => void,
      transform?: boolean,
    ) => ReconnectingWebSocketHandler
    ticker: (
      pair: string | string[],
      callback: (ticker: Ticker) => void,
    ) => ReconnectingWebSocketHandler
    miniTicker: (
      pair: string | string[],
      callback: (ticker: MiniTicker) => void,
    ) => ReconnectingWebSocketHandler
    allMiniTickers: (callback: (ticker: MiniTicker[]) => void) => ReconnectingWebSocketHandler
    futuresTicker: (
      pair: string | string[],
      callback: (ticker: Ticker) => void,
    ) => ReconnectingWebSocketHandler
    allTickers: (callback: (tickers: Ticker[]) => void) => ReconnectingWebSocketHandler
    futuresAllTickers: (callback: (tickers: Ticker[]) => void) => ReconnectingWebSocketHandler
    candles: (
      pair: string | string[],
      period: string,
      callback: (ticker: Candle) => void,
    ) => ReconnectingWebSocketHandler
    trades: (
      pairs: string | string[],
      callback: (trade: WSTrade) => void,
    ) => ReconnectingWebSocketHandler
    aggTrades: (
      pairs: string | string[],
      callback: (trade: AggregatedTrade) => void,
    ) => ReconnectingWebSocketHandler
    futuresLiquidations: (
      symbol: string | string[],
      callback: (forecOrder: ForceOrder) => void,
    ) => ReconnectingWebSocketHandler
    futuresAllLiquidations: (
      callback: (forecOrder: ForceOrder) => void,
    ) => ReconnectingWebSocketHandler
    futuresAggTrades: (
      pairs: string | string[],
      callback: (trade: AggregatedTrade) => void,
    ) => ReconnectingWebSocketHandler
    futuresCandles: (
      pair: string | string[],
      period: string,
      callback: (ticker: Candle) => void,
    ) => ReconnectingWebSocketHandler

    user: (callback: (msg: UserDataStreamEvent) => void) => Promise<ReconnectingWebSocketHandler>
    marginUser: (
      callback: (msg: OutboundAccountInfo | ExecutionReport) => void,
    ) => Promise<ReconnectingWebSocketHandler>
    futuresUser: (
      callback: (
        msg:
          | OutboundAccountInfo
          | ExecutionReport
          | AccountUpdate
          | OrderUpdate
          | AccountConfigUpdate
          | MarginCall,
      ) => void,
    ) => Promise<ReconnectingWebSocketHandler>
  }

  export type WebSocketCloseOptions = {
    delay: number
    fastClose: boolean
    keepClosed: boolean
  }

  export type ReconnectingWebSocketHandler = (options?: WebSocketCloseOptions) => void

  export type CandleChartInterval_LT =
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
    | '1M'

  export const enum CandleChartInterval {
    ONE_MINUTE = '1m',
    THREE_MINUTES = '3m',
    FIVE_MINUTES = '5m',
    FIFTEEN_MINUTES = '15m',
    THIRTY_MINUTES = '30m',
    ONE_HOUR = '1h',
    TWO_HOURS = '2h',
    FOUR_HOURS = '4h',
    SIX_HOURS = '6h',
    EIGHT_HOURS = '8h',
    TWELVE_HOURS = '12h',
    ONE_DAY = '1d',
    THREE_DAYS = '3d',
    ONE_WEEK = '1w',
    ONE_MONTH = '1M',
  }

  export type RateLimitType_LT = 'REQUEST_WEIGHT' | 'ORDERS'

  export const enum RateLimitType {
    REQUEST_WEIGHT = 'REQUEST_WEIGHT',
    ORDERS = 'ORDERS',
  }

  export type TradingType_LT = 'MARGIN' | 'SPOT'

  export const enum TradingType {
    MARGIN = 'MARGIN',
    SPOT = 'SPOT',
  }

  export type RateLimitInterval_LT = 'SECOND' | 'MINUTE' | 'DAY'

  export const enum RateLimitInterval {
    SECOND = 'SECOND',
    MINUTE = 'MINUTE',
    DAY = 'DAY',
  }

  export interface ExchangeInfoRateLimit {
    rateLimitType: RateLimitType_LT
    interval: RateLimitInterval_LT
    intervalNum: number
    limit: number
  }

  export type ExchangeFilterType_LT = 'EXCHANGE_MAX_NUM_ORDERS' | 'EXCHANGE_MAX_ALGO_ORDERS'

  export const enum ExchangeFilterType {
    EXCHANGE_MAX_NUM_ORDERS = 'EXCHANGE_MAX_NUM_ORDERS',
    EXCHANGE_MAX_ALGO_ORDERS = 'EXCHANGE_MAX_ALGO_ORDERS',
  }

  export interface ExchangeFilter {
    filterType: ExchangeFilterType_LT
    limit: number
  }

  export type SymbolFilterType_LT =
    | 'PRICE_FILTER'
    | 'PERCENT_PRICE'
    | 'LOT_SIZE'
    | 'MIN_NOTIONAL'
    | 'MAX_NUM_ORDERS'
    | 'MAX_ALGO_ORDERS'

  export const enum SymbolFilterType {
    PRICE_FILTER = 'PRICE_FILTER',
    PERCENT_PRICE = 'PERCENT_PRICE',
    LOT_SIZE = 'LOT_SIZE',
    MARKET_LOT_SIZE = 'MARKET_LOT_SIZE',
    MIN_NOTIONAL = 'MIN_NOTIONAL',
    MAX_NUM_ORDERS = 'MAX_NUM_ORDERS',
    MAX_ALGO_ORDERS = 'MAX_ALGO_ORDERS',
  }

  export interface SymbolPriceFilter {
    filterType: SymbolFilterType.PRICE_FILTER
    minPrice: string
    maxPrice: string
    tickSize: string
  }

  export interface SymbolPercentPriceFilter {
    filterType: SymbolFilterType.PERCENT_PRICE
    multiplierDown: string
    multiplierUp: string
    multiplierDecimal: number
  }

  export interface SymbolLotSizeFilter {
    filterType: SymbolFilterType.LOT_SIZE
    minQty: string
    maxQty: string
    stepSize: string
  }

  export interface SymbolMarketLotSizeFilter {
    filterType: SymbolFilterType.MARKET_LOT_SIZE
    minQty: string
    maxQty: string
    stepSize: string
  }

  export interface SymbolMinNotionalFilter {
    filterType: SymbolFilterType.MIN_NOTIONAL
    notional: string
  }

  export interface SymbolMaxNumOrdersFilter {
    filterType: SymbolFilterType.MAX_NUM_ORDERS
    maxNumOrders: number
  }

  export interface SymbolMaxAlgoOrdersFilter {
    filterType: SymbolFilterType.MAX_ALGO_ORDERS
    maxNumAlgoOrders: number
  }

  export type SymbolFilter =
    | SymbolPriceFilter
    | SymbolPercentPriceFilter
    | SymbolLotSizeFilter
    | SymbolMarketLotSizeFilter
    | SymbolMinNotionalFilter
    | SymbolMaxNumOrdersFilter
    | SymbolMaxAlgoOrdersFilter

  export interface Symbol<T = OrderType_LT> {
    baseAsset: string
    baseAssetPrecision: number
    baseCommissionPrecision: number
    filters: SymbolFilter[]
    icebergAllowed: boolean
    isMarginTradingAllowed: boolean
    isSpotTradingAllowed: boolean
    ocoAllowed: boolean
    orderTypes: T[]
    permissions: TradingType_LT[]
    pricePrecision:number,
    quantityPrecision:number
    quoteAsset: string
    quoteAssetPrecision: number
    quoteCommissionPrecision: number
    quoteOrderQtyMarketAllowed: boolean
    quotePrecision: number
    status: string
    symbol: string
  }

  export interface ExchangeInfo<T = OrderType_LT> {
    timezone: string
    serverTime: number
    rateLimits: ExchangeInfoRateLimit[]
    exchangeFilters: ExchangeFilter[]
    symbols: Symbol<T>[]
  }

  export interface OrderBook {
    lastUpdateId: number
    asks: Bid[]
    bids: Bid[]
  }

  interface NewFuturesOrderBase {
    symbol: string
    side: OrderSide_LT
    // Default BOTH for One-way Mode ; LONG or SHORT for Hedge Mode. It must be sent in Hedge Mode.
    positionSide?: PositionSide_LT
    type: FuturesOrderType_LT
    timeInForce?: TimeInForce_LT
    // "true" or "false". default "false". Cannot be sent in Hedge Mode; cannot be sent with closePosition=true
    reduceOnly?: 'true' | 'false'
    // A unique id among open orders. Automatically generated if not sent. Can only be string following the rule: ^[\.A-Z\:/a-z0-9_-]{1,36}$
    newClientOrderId?: string
    // stopPrice triggered by: "MARK_PRICE", "CONTRACT_PRICE". Default "CONTRACT_PRICE"
    workingType?: WorkingType_LT
    // "ACK", "RESULT", default "ACK"
    newOrderRespType?: NewOrderRespType_LT
    recvWindow?: number
    timestamp?: number
  }

  export interface LimitNewFuturesOrder extends NewFuturesOrderBase {
    type: 'LIMIT'
    timeInForce: TimeInForce_LT
    quantity: string
    price: string
  }

  export interface MarketNewFuturesOrder extends NewFuturesOrderBase {
    type: 'MARKET'
    quantity: string
  }

  export interface StopNewFuturesOrder extends NewFuturesOrderBase {
    type: 'STOP'
    quantity: string
    price: string
    stopPrice: string
    // "TRUE" or "FALSE", default "FALSE". Used with STOP/STOP_MARKET or TAKE_PROFIT/TAKE_PROFIT_MARKET orders.
    priceProtect?: 'TRUE' | 'FALSE'
  }

  export interface TakeProfitNewFuturesOrder extends NewFuturesOrderBase {
    type: 'TAKE_PROFIT'
    quantity: string
    price: string
    stopPrice: string
  }

  export interface StopMarketNewFuturesOrder extends NewFuturesOrderBase {
    type: 'STOP_MARKET'
    stopPrice: string
    // true, false；Close-All，used with STOP_MARKET or TAKE_PROFIT_MARKET.
    closePosition?: 'true' | 'false'
    // "TRUE" or "FALSE", default "FALSE". Used with STOP/STOP_MARKET or TAKE_PROFIT/TAKE_PROFIT_MARKET orders.
    priceProtect?: 'TRUE' | 'FALSE'
    quantity?: string
  }

  export interface TakeProfitMarketNewFuturesOrder extends NewFuturesOrderBase {
    type: 'TAKE_PROFIT_MARKET'
    stopPrice: string
    // true, false；Close-All，used with STOP_MARKET or TAKE_PROFIT_MARKET.
    closePosition?: 'true' | 'false'
    // "TRUE" or "FALSE", default "FALSE". Used with STOP/STOP_MARKET or TAKE_PROFIT/TAKE_PROFIT_MARKET orders.
    priceProtect?: 'TRUE' | 'FALSE'
    quantity?: string
  }

  export interface TrailingStopMarketNewFuturesOrder extends NewFuturesOrderBase {
    type: 'TRAILING_STOP_MARKET'
    // default as the latest price(supporting different workingType)
    activationPrice?: string
    // min 0.1, max 5 where 1 for 1%
    callbackRate?: string
  }

  export type NewFuturesOrder =
    | LimitNewFuturesOrder
    | MarketNewFuturesOrder
    | StopNewFuturesOrder
    | TakeProfitNewFuturesOrder
    | TrailingStopMarketNewFuturesOrder
    | StopMarketNewFuturesOrder
    | TakeProfitMarketNewFuturesOrder

  export interface NewOcoOrder {
    symbol: string
    listClientOrderId?: string
    side: OrderSide_LT
    quantity: string
    limitClientOrderId?: string
    price: string
    limitIcebergQty?: string
    stopClientOrderId?: string
    stopPrice: string
    stopLimitPrice?: string
    stopIcebergQty?: string
    stopLimitTimeInForce?: TimeInForce_LT
    newOrderRespType?: NewOrderRespType_LT
    recvWindow?: number
    useServerTime?: boolean
  }

  export interface NewOrderParent {
    symbol: string
    side: OrderSide_LT
    type: OrderType_LT
    newClientOrderId?: string
    newOrderRespType?: NewOrderRespType_LT
    recvWindow?: number
    timeInForce?: TimeInForce_LT
    useServerTime?: boolean
  }

  export interface NewOrderMarketBase extends NewOrderParent {
    type: OrderType.MARKET
    quantity: string
  }

  export interface NewOrderMarketQuote extends NewOrderParent {
    type: OrderType.MARKET
    quoteOrderQty: string
  }

  export interface NewOrderLimit extends NewOrderParent {
    type: OrderType.LIMIT
    quantity: string
    price: string
    icebergQty?: string
  }

  export interface NewOrderSL extends NewOrderParent {
    type: OrderType.STOP_LOSS_LIMIT | OrderType.TAKE_PROFIT_LIMIT
    quantity: string
    price: string
    stopPrice: string
    icebertQty?: string
  }

  export interface NewMarginOrderParent {
    isIsolated?: 'TRUE' | 'FALSE' | boolean
    sideEffectType?: SideEffectType_LT
  }

  export type NewOrderSpot = NewOrderMarketBase | NewOrderMarketQuote | NewOrderLimit | NewOrderSL

  export type NewOrderMargin = NewOrderSpot & NewMarginOrderParent

  export type NewOcoOrderMargin = NewOrderSpot & NewOcoOrder & NewMarginOrderParent & {}

  export type MarginOcoOrder = OcoOrder & { isIsolated?: 'TRUE' | 'FALSE' | boolean }

  export type SideEffectType_LT = 'NO_SIDE_EFFECT' | 'MARGIN_BUY' | 'AUTO_REPAY'

  export const enum SideEffectType {
    NO_SIDE_EFFECT = 'NO_SIDE_EFFECT',
    MARGIN_BUY = 'MARGIN_BUY',
    AUTO_REPAY = 'AUTO_REPAY',
  }

  export interface OrderFill {
    tradeId: number
    price: string
    qty: string
    commission: string
    commissionAsset: string
  }

  export interface Order {
    clientOrderId: string
    cummulativeQuoteQty: string
    executedQty: string
    fills?: OrderFill[]
    icebergQty?: string
    isIsolated?: boolean
    isWorking: boolean
    orderId: number
    orderListId: number
    origQty: string
    price: string
    side: OrderSide_LT
    status: OrderStatus_LT
    stopPrice?: string
    symbol: string
    time: number
    timeInForce: TimeInForce_LT
    transactTime?: number
    type: OrderType_LT
    updateTime: number
  }

  export interface FuturesOrder {
    clientOrderId: string
    cumQty: string
    cumQuote: string
    executedQty: string
    orderId: number
    avgPrice: string
    origQty: string
    price: string
    reduceOnly: boolean
    side: OrderSide_LT
    positionSide: PositionSide_LT
    status: OrderStatus_LT
    stopPrice: string
    closePosition: boolean
    symbol: string
    timeInForce: TimeInForce_LT
    type: FuturesOrderType_LT
    origType: FuturesOrderType_LT
    activatePrice: string
    priceRate: string
    updateTime: number
    workingType: WorkingType_LT
  }

  export type ListOrderStatus_LT = 'EXECUTING' | 'ALL_DONE' | 'REJECT'

  export const enum ListOrderStatus {
    EXECUTING = 'EXECUTING',
    ALL_DONE = 'ALL_DONE',
    REJECT = 'REJECT',
  }

  export type ListStatusType_LT = 'RESPONSE' | 'EXEC_STARTED' | 'ALL_DONE'

  export const enum ListStatusType {
    RESPONSE = 'RESPONSE',
    EXEC_STARTED = 'EXEC_STARTED',
    ALL_DONE = 'ALL_DONE',
  }

  export type OcoOrderType_LT = 'OCO'

  export const enum OcoOrderType {
    CONTINGENCY_TYPE = 'OCO',
  }

  export interface OcoOrder {
    orderListId: number
    contingencyType: OcoOrderType.CONTINGENCY_TYPE
    listStatusType: ListStatusType_LT
    listOrderStatus: ListOrderStatus_LT
    listClientOrderId: string
    transactionTime: number
    symbol: string
    orders: Order[]
    orderReports: Order[]
  }

  export type OrderSide_LT = 'BUY' | 'SELL'

  export const enum OrderSide {
    BUY = 'BUY',
    SELL = 'SELL',
  }

  export type OrderStatus_LT =
    | 'CANCELED'
    | 'EXPIRED'
    | 'FILLED'
    | 'NEW'
    | 'PARTIALLY_FILLED'
    | 'PENDING_CANCEL'
    | 'REJECTED'

  export const enum OrderStatus {
    CANCELED = 'CANCELED',
    EXPIRED = 'EXPIRED',
    FILLED = 'FILLED',
    NEW = 'NEW',
    PARTIALLY_FILLED = 'PARTIALLY_FILLED',
    PENDING_CANCEL = 'PENDING_CANCEL',
    REJECTED = 'REJECTED',
  }

  export type OrderType_LT =
    | 'LIMIT'
    | 'LIMIT_MAKER'
    | 'MARKET'
    | 'STOP'
    | 'STOP_MARKET'
    | 'STOP_LOSS_LIMIT'
    | 'TAKE_PROFIT_LIMIT'
    | 'TAKE_PROFIT_MARKET'
    | 'TRAILING_STOP_MARKET'

  export type FuturesOrderType_LT =
    | 'LIMIT'
    | 'MARKET'
    | 'STOP'
    | 'TAKE_PROFIT'
    | 'STOP_MARKET'
    | 'TAKE_PROFIT_MARKET'
    | 'TRAILING_STOP_MARKET'

  export const enum OrderType {
    LIMIT = 'LIMIT',
    LIMIT_MAKER = 'LIMIT_MAKER',
    MARKET = 'MARKET',
    STOP = 'STOP',
    STOP_MARKET = 'STOP_MARKET',
    STOP_LOSS_LIMIT = 'STOP_LOSS_LIMIT',
    TAKE_PROFIT_LIMIT = 'TAKE_PROFIT_LIMIT',
    TAKE_PROFIT_MARKET = 'TAKE_PROFIT_MARKET',
    TRAILING_STOP_MARKET = 'TRAILING_STOP_MARKET',
  }

  export type NewOrderRespType_LT = 'ACK' | 'RESULT' | 'FULL'

  export const enum NewOrderRespType {
    ACK = 'ACK',
    RESULT = 'RESULT',
    FULL = 'FULL',
  }

  export type TimeInForce_LT = 'GTC' | 'IOC' | 'FOK' | 'GTE_GTC'

  export const enum TimeInForce {
    GTC = 'GTC',
    IOC = 'IOC',
    FOK = 'FOK',
    GTE_GTC = 'GTE_GTC'
  }

  export type OrderRejectReason_LT =
    | 'ACCOUNT_CANNOT_SETTLE'
    | 'ACCOUNT_INACTIVE'
    | 'DUPLICATE_ORDER'
    | 'INSUFFICIENT_BALANCE'
    | 'MARKET_CLOSED'
    | 'NONE'
    | 'ORDER_WOULD_TRIGGER_IMMEDIATELY'
    | 'PRICE_QTY_EXCEED_HARD_LIMITS'
    | 'UNKNOWN_ACCOUNT'
    | 'UNKNOWN_INSTRUMENT'
    | 'UNKNOWN_ORDER'

  export const enum OrderRejectReason {
    ACCOUNT_CANNOT_SETTLE = 'ACCOUNT_CANNOT_SETTLE',
    ACCOUNT_INACTIVE = 'ACCOUNT_INACTIVE',
    DUPLICATE_ORDER = 'DUPLICATE_ORDER',
    INSUFFICIENT_BALANCE = 'INSUFFICIENT_BALANCE',
    MARKET_CLOSED = 'MARKET_CLOSED',
    NONE = 'NONE',
    ORDER_WOULD_TRIGGER_IMMEDIATELY = 'ORDER_WOULD_TRIGGER_IMMEDIATELY',
    PRICE_QTY_EXCEED_HARD_LIMITS = 'PRICE_QTY_EXCEED_HARD_LIMITS',
    UNKNOWN_ACCOUNT = 'UNKNOWN_ACCOUNT',
    UNKNOWN_INSTRUMENT = 'UNKNOWN_INSTRUMENT',
    UNKNOWN_ORDER = 'UNKNOWN_ORDER',
  }

  export type ExecutionType_LT = 'NEW' | 'CANCELED' | 'REPLACED' | 'REJECTED' | 'TRADE' | 'EXPIRED'

  export const enum ExecutionType {
    NEW = 'NEW',
    CANCELED = 'CANCELED',
    REPLACED = 'REPLACED',
    REJECTED = 'REJECTED',
    TRADE = 'TRADE',
    EXPIRED = 'EXPIRED',
  }

  export interface Depth {
    eventType: string
    eventTime: number
    symbol: string
    firstUpdateId: number
    finalUpdateId: number
    bidDepth: BidDepth[]
    askDepth: BidDepth[]
  }

  export interface BidDepth {
    price: string
    quantity: string
  }

  export interface PartialDepth {
    symbol: string
    level: number
    bids: Bid[]
    asks: Bid[]
  }

  export interface Bid {
    price: string
    quantity: string
  }

  export interface Ticker {
    eventType: string
    eventTime: number
    symbol: string
    priceChange: string
    priceChangePercent: string
    weightedAvg: string
    prevDayClose: string
    curDayClose: string
    closeTradeQuantity: string
    bestBid: string
    bestBidQnt: string
    bestAsk: string
    bestAskQnt: string
    open: string
    high: string
    low: string
    volume: string
    volumeQuote: string
    openTime: number
    closeTime: number
    firstTradeId: number
    lastTradeId: number
    totalTrades: number
  }

  export interface MiniTicker {
    eventType: string
    eventTime: number
    symbol: string
    curDayClose: string
    open: string
    high: string
    low: string
    volume: string
    volumeQuote: string
  }

  export interface Candle {
    eventType: string
    eventTime: number
    symbol: string
    startTime: number
    closeTime: number
    firstTradeId: number
    lastTradeId: number
    open: string
    high: string
    low: string
    close: string
    volume: string
    trades: number
    interval: string
    isFinal: boolean
    quoteVolume: string
    buyVolume: string
    quoteBuyVolume: string
  }

  export interface Trade {
    eventType: string
    eventTime: number
    symbol: string
    price: string
    quantity: string
    maker: boolean
    isBuyerMaker: boolean
    tradeId: number
  }

  export interface WSTrade extends Trade {
    tradeTime: number
    buyerOrderId: number
    sellerOrderId: number
  }

  export interface Balances {
    [key: string]: {
      available: string
      locked: string
    }
  }

  export type EventType_LT =
    | 'account'
    | 'balanceUpdate'
    | 'outboundAccountPosition'
    | 'executionReport'
    | 'ACCOUNT_UPDATE'
    | 'ORDER_TRADE_UPDATE'
    | 'MARGIN_CALL'
    | 'ACCOUNT_CONFIG_UPDATE'

  export interface MarginCall {
    eventType: 'MARGIN_CALL'
    eventTime: number
    crossWalletBalance: string

    positions: {
      symbol: string
      positionSide: PositionSide_LT
      positionAmount: string
      marginType: MarginType_LT
      isolatedWallet: string
      markPrice: string
      unrealizedPnL: string
      maintenanceMarginRequired: string
    }[]
  }

  export interface OutboundAccountInfo {
    balances: Balances
    makerCommissionRate: number
    takerCommissionRate: number
    buyerCommissionRate: number
    sellerCommissionRate: number
    canTrade: boolean
    canWithdraw: boolean
    canDeposit: boolean
    lastAccountUpdate: number
    eventType: 'account'
    eventTime: number
  }

  export interface BalanceUpdate {
    asset: string
    balanceDelta: string
    clearTime: number
    eventTime: number
    eventType: 'balanceUpdate'
  }

  export interface OutboundAccountPosition {
    balances: AssetBalance[]
    eventTime: number
    eventType: 'outboundAccountPosition'
    lastAccountUpdate: number
  }

  export interface ListStatus {
    eventType: 'listStatus'
    eventTime: number
    symbol: string
    orderListId: number
    contingencyType: 'OCO' | string
    listStatusType: ListStatusType_LT
    listOrderStatus: ListOrderStatus_LT
    listRejectReason: 'NONE' | string
    listClientOrderId: string
    transactionTime: number
    orders: Array<{
        symbol: string
        orderId: number
        clientOrderId: string
    }>
  }

  export interface ExecutionReport {
    commission: string // Commission amount
    commissionAsset: string | null // Commission asset
    creationTime: number // Order creation time
    eventTime: number
    eventType: 'executionReport'
    executionType: ExecutionType_LT // Current execution type
    icebergQuantity: string // Iceberg quantity
    isBuyerMaker: boolean // Is this trade the maker side?
    isOrderWorking: boolean // Is the order on the book?
    lastQuoteTransacted: string // Last quote asset transacted quantity (i.e. lastPrice * lastQty);
    lastTradeQuantity: string // Last executed quantity
    newClientOrderId: string // Client order ID
    orderId: number // Order ID
    orderListId: number // OrderListId
    orderRejectReason: OrderRejectReason // Order reject reason; will be an error code.
    orderStatus: OrderStatus_LT // Current order status
    orderTime: number // Transaction time
    orderType: FuturesOrderType_LT // Order type
    originalClientOrderId: string | null // Original client order ID; This is the ID of the order being canceled
    price: string // Order price
    priceLastTrade: string // Last executed price
    quantity: string // Order quantity
    quoteOrderQuantity: string // Quote Order Qty
    side: OrderSide_LT // Side
    stopPrice: string // Stop price
    symbol: string // Symbol
    timeInForce: TimeInForce_LT // Time in force
    totalQuoteTradeQuantity: string // Cumulative quote asset transacted quantity
    totalTradeQuantity: string // Cumulative filled quantity
    tradeId: number // Trade ID
  }

  export interface Balance {
    asset: string
    walletBalance: string
    crossWalletBalance: string
    balanceChange: string
  }

  export interface Position {
    symbol: string
    positionAmount: string
    entryPrice: string
    accumulatedRealized: string
    unrealizedPnL: string
    marginType: 'isolated' | 'cross'
    isolatedWallet: string
    positionSide: PositionSide_LT
  }

  export type EventReasonType =
    | 'DEPOSIT'
    | 'WITHDRAW'
    | 'ORDER'
    | 'FUNDING_FEE'
    | 'WITHDRAW_REJECT'
    | 'ADJUSTMENT'
    | 'INSURANCE_CLEAR'
    | 'ADMIN_DEPOSIT'
    | 'ADMIN_WITHDRAW'
    | 'MARGIN_TRANSFER'
    | 'MARGIN_TYPE_CHANGE'
    | 'ASSET_TRANSFER'
    | 'OPTIONS_PREMIUM_FEE'
    | 'OPTIONS_SETTLE_PROFIT'
    | 'AUTO_EXCHANGE'

  export interface AccountUpdate {
    eventTime: number
    eventType: 'ACCOUNT_UPDATE'
    transactionTime: number
    eventReasonType: EventReasonType
    balances: Balance[]
    positions: Position[]
  }

  export interface AccountConfigUpdateBase {
    eventTime: number
    eventType: 'ACCOUNT_CONFIG_UPDATE'
    transactionTime: number
    type: 'ACCOUNT_CONFIG' | 'MULTI_ASSETS'
  }

  export interface AccountConfigUpdateConfig extends AccountConfigUpdateBase {
    type: 'ACCOUNT_CONFIG'
    symbol: string
    leverage: number
  }

  export interface AccountConfigUpdateMultiAssets extends AccountConfigUpdateBase {
    type: 'MULTI_ASSETS'
    multiAssets: boolean
  }

  export type AccountConfigUpdate = AccountConfigUpdateConfig | AccountConfigUpdateMultiAssets

  export interface OrderUpdate {
    eventType: 'ORDER_TRADE_UPDATE'
    eventTime: number
    transactionTime: number
    symbol: string
    clientOrderId: string
    side: OrderSide
    orderType: FuturesOrderType_LT
    timeInForce: TimeInForce
    quantity: string
    price: string
    averagePrice: string
    stopPrice: string
    executionType: ExecutionType
    orderStatus: OrderStatus
    orderId: number
    lastTradeQuantity: string
    totalTradeQuantity: string
    priceLastTrade: string
    commissionAsset: string | null
    commission: string
    orderTime: number
    tradeId: number
    bidsNotional: string
    asksNotional: string
    isMaker: boolean
    isReduceOnly: boolean
    workingType: WorkingType
    originalOrderType: FuturesOrderType_LT
    positionSide: PositionSide
    closePosition: boolean
    activationPrice: string
    callbackRate: string
    realizedProfit: string
  }

  export interface TradeResult {
    id: number
    price: string
    qty: string
    quoteQty: string
    time: number
    isBuyerMaker: boolean
    isBestMatch: boolean
  }

  export interface FuturesUserTradeResult {
    buyer: boolean
    commission: string
    commissionAsset: string
    id: number
    maker: boolean
    orderId: number
    price: string
    qty: string
    quoteQty: string
    realizedPnl: string
    side: OrderSide_LT
    positionSide: PositionSide_LT
    symbol: string
    time: number
  }

  export interface MyTrade {
    id: number
    symbol: string
    orderId: number
    orderListId: number
    price: string
    qty: string
    quoteQty: string
    commission: string
    commissionAsset: string
    time: number
    isBuyer: boolean
    isMaker: boolean
    isBestMatch: boolean
  }

  export interface QueryOrderResult {
    clientOrderId: string
    cummulativeQuoteQty: string
    executedQty: string
    icebergQty: string
    isWorking: boolean
    orderId: number
    orderListId: number
    origQty: string
    origQuoteOrderQty: string
    price: string
    side: OrderSide_LT
    status: OrderStatus_LT
    stopPrice: string
    symbol: string
    time: number
    timeInForce: TimeInForce_LT
    type: OrderType_LT
    updateTime: number
  }

  export interface QueryFuturesOrderResultBase {
    avgPrice: string
    clientOrderId: string
    cumQuote: string
    executedQty: string
    orderId: string
    origQty: string
    origType: FuturesOrderType_LT
    price: string
    side: OrderSide_LT
    positionSide: PositionSide_LT
    status: OrderStatus_LT
    reduceOnly: boolean
    closePosition: boolean
    symbol: string
    time: number
    timeInForce: TimeInForce_LT
    type: FuturesOrderType_LT
    priceRate: string
    updateTime: number
    stopPrice: string
    workingType: WorkingType_LT
  }

  export interface QueryFuturesOrderResultOthers extends QueryFuturesOrderResultBase {
    type: Exclude<FuturesOrderType_LT, 'TRAILING_STOP_MARKET'>
  }

  export interface QueryFuturesOrderResultTrailingStop extends QueryFuturesOrderResultBase {
    type: 'TRAILING_STOP_MARKET'
    activatePrice: string
    priceRate: string
  }

  export type QueryFuturesOrderResult =
    | QueryFuturesOrderResultOthers
    | QueryFuturesOrderResultTrailingStop

  export interface QueryOrderOcoResult {
    orderListId: number
    contingencyType: OcoOrderType.CONTINGENCY_TYPE
    listStatusType: ListStatusType_LT
    listOrderStatus: ListOrderStatus_LT
    listClientOrderId: string
    transactionTime: number
    symbol: string
    orders: Order[]
  }

  export interface CancelOrderResult {
    symbol: string
    origClientOrderId: string
    orderId: number
    orderListId: number
    clientOrderId: string
    price: string
    origQty: string
    executedQty: string
    cummulativeQuoteQty: string
    status: string
    timeInForce: string
    type: OrderType_LT
    side: OrderSide_LT
  }

  export interface FuturesCancelAllOpenOrdersResult {
    code: number
    msg: string
  }

  export interface CancelOrderOcoResult {
    orderListId: number
    contingencyType: OcoOrderType.CONTINGENCY_TYPE
    listStatusType: ListStatusType_LT
    listOrderStatus: ListOrderStatus_LT
    listClientOrderId: string
    transactionTime: number
    symbol: string
    orders: Order[]
    orderReports: Order[]
  }

  export interface AvgPriceResult {
    mins: number
    price: string
  }

  export interface DailyStatsResult {
    symbol: string
    priceChange: string
    priceChangePercent: string
    weightedAvgPrice: string
    prevClosePrice: string
    lastPrice: string
    lastQty: string
    bidPrice: string
    bidQty: string
    askPrice: string
    askQty: string
    openPrice: string
    highPrice: string
    lowPrice: string
    volume: string
    quoteVolume: string
    openTime: number
    closeTime: number
    firstId: number // First tradeId
    lastId: number // Last tradeId
    count: number // Trade count
  }

  export interface CandlesOptions {
    symbol: string
    interval: CandleChartInterval_LT
    limit?: number
    startTime?: number
    endTime?: number
  }

  export type IndexPriceCandlesOptions = Omit<CandlesOptions, 'symbol'> & { pair: string }

  export interface CandleChartResult {
    openTime: number
    open: string
    high: string
    low: string
    close: string
    volume: string
    closeTime: number
    quoteVolume: string
    trades: number
    baseAssetVolume: string
    quoteAssetVolume: string
  }

  export interface MarkPriceResult {
    symbol: string
    markPrice: string
    lastFundingRate: string
    nextFundingTime: number
    time: number
  }

  export interface AllForceOrdersResult {
    symbol: string
    price: string
    origQty: string
    executedQty: string
    averagePrice: string
    status: string
    timeInForce: string
    type: OrderType_LT
    side: OrderSide_LT
    time: number
  }

  export interface FundingRateResult {
    symbol: string
    fundingRate: string
    fundingTime: number
    time: number
  }

  export interface PositionRiskResult {
    entryPrice: string
    marginType: 'isolated' | 'cross'
    isAutoAddMargin: string
    isolatedMargin: string
    leverage: string
    liquidationPrice: string
    markPrice: string
    maxNotionalValue: string
    positionAmt: string
    symbol: string
    unRealizedProfit: string
    positionSide: PositionSide_LT
    notional: string
    isolatedWallet: string
    updateTime: number
  }

  export interface LeverageBracketResult {
    symbol: string
    brackets: Bracket[]
  }

  export interface Bracket {
    bracket: number // Notional bracket
    initialLeverage: number // Max initial leverage for this bracket
    notionalCap: number // Cap notional of this bracket
    notionalFloor: number // Notional threshold of this bracket
    maintMarginRatio: number // Maintenance ratio for this bracket
    cum: 0 // Auxiliary number for quick calculation
  }

  export interface FuturesBalanceResult {
    accountAlias: string
    asset: string
    balance: string
    crossWalletBalance: string
    crossUnPnl: string
    availableBalance: string
    maxWithdrawAmount: string
  }

  export type FuturesAssetType =
    | 'DOT'
    | 'BTC'
    | 'SOL'
    | 'BNB'
    | 'ETH'
    | 'ADA'
    | 'USDT'
    | 'XRP'
    | 'BUSD'

  export type FuturesAsset = {
    asset: FuturesAssetType

    walletBalance: string

    unrealizedProfit: string

    marginBalance: string

    maintMargin: string

    initialMargin: string

    positionInitialMargin: string

    openOrderInitialMargin: string

    maxWithdrawAmount: string

    crossWalletBalance: string

    crossUnPnl: string

    availableBalance: string

    marginAvailable: boolean

    updateTime: number
  }

  export interface FuturesAccountInfoResult {
    feeTier: number
    canTrade: boolean
    canDeposit: boolean
    canWithdraw: boolean
    updateTime: number
    totalInitialMargin: string
    totalMaintMargin: string
    totalWalletBalance: string
    totalUnrealizedProfit: string
    totalMarginBalance: string
    totalPositionInitialMargin: string
    totalOpenOrderInitialMargin: string
    totalCrossWalletBalance: string
    totalCrossUnPnl: string
    availableBalance: string
    maxWithdrawAmount: string
    assets: FuturesAsset[]
    positions: FuturesAccountPosition[]
  }

  export interface FuturesAccountPosition {
    symbol: string
    initialMargin: string
    maintMargin: string
    unrealizedProfit: string
    positionInitialMargin: string
    openOrderInitialMargin: string
    leverage: string
    isolated: boolean
    entryPrice: string
    maxNotional: string
    positionSide: PositionSide_LT
    positionAmt: string
    notional: string
    isolatedWallet: string
    updateTime: number
    bidNotional: string
    askNotional: string
  }

  export interface FuturesLeverageResult {
    leverage: number
    maxNotionalValue: number
    symbol: string
  }

  export interface FuturesMarginTypeResult {
    code: number
    msg: string
  }

  export type FuturesIncomeType_LT =
    | 'TRANSFER'
    | 'WELCOME_BONUS'
    | 'REALIZED_PNL'
    | 'FUNDING_FEE'
    | 'COMMISSION'
    | 'INSURANCE_CLEAR'

  export const enum FuturesIncomeType {
    TRANSFER = 'TRANSFER',
    WELCOME_BONUS = 'WELCOME_BONUS',
    REALIZED_PNL = 'REALIZED_PNL',
    FUNDING_FEE = 'FUNDING_FEE',
    COMMISSION = 'COMMISSION',
    INSURANCE_CLEAR = 'INSURANCE_CLEAR',
  }

  export interface FuturesIncomeResult {
    symbol: string
    incomeType: FuturesIncomeType_LT
    income: string
    asset: string
    info: string
    time: number
    tranId: string
    tradeId: string
  }

  export interface ChangePositionModeResult {
    code: number
    msg: string
  }

  export interface PositionModeResult {
    dualSidePosition: boolean
  }

  export interface IsolatedCrossAccount {
    borrowEnabled: boolean
    marginLevel: string
    totalAssetOfBtc: string
    totalLiabilityOfBtc: string
    totalNetAssetOfBtc: string
    tradeEnabled: boolean
    transferEnabled: boolean
    userAssets: CrossAsset[]
  }

  export interface CrossAsset {
    asset: string
    borrowed: string
    free: string
    interest: string
    locked: string
    netAsset: string
  }

  export interface IsolatedMarginAccount {
    assets: IsolatedAsset[]
    totalAssetOfBtc: string
    totalLiabilityOfBtc: string
    totalNetAssetOfBtc: string
  }

  export type MarginLevelStatus_LT =
    | 'EXCESSIVE'
    | 'NORMAL'
    | 'MARGIN_CALL'
    | 'PRE_LIQUIDATION'
    | 'FORCE_LIQUIDATION'

  export const enum MarginLevelStatus {
    EXCESSIVE = 'EXCESSIVE',
    NORMAL = 'NORMAL',
    MARGIN_CALL = 'MARGIN_CALL',
    PRE_LIQUIDATION = 'PRE_LIQUIDATION',
    FORCE_LIQUIDATION = 'FORCE_LIQUIDATION',
  }

  export interface IsolatedAsset {
    baseAsset: IsolatedAssetSingle
    quoteAsset: IsolatedAssetSingle
    symbol: string
    isolatedCreated: boolean
    marginLevel: string
    marginLevelStatus: MarginLevelStatus_LT
    marginRatio: string
    indexPrice: string
    liquidatePrice: string
    liquidateRate: string
    tradeEnabled: boolean
  }

  export interface IsolatedAssetSingle {
    asset: string
    borrowEnabled: boolean
    borrowed: string
    free: string
    interest: string
    locked: string
    netAsset: string
    netAssetOfBtc: string
    repayEnabled: boolean
    totalAsset: string
  }

  export type WalletType_LT = 'SPOT' | 'ISOLATED_MARGIN'

  export const enum WalletType {
    SPOT = 'SPOT',
    ISOLATED_MARGIN = 'ISOLATED_MARGIN',
  }

  export interface marginIsolatedTransfer {
    asset: string
    symbol: string
    transFrom: WalletType_LT
    transTo: WalletType_LT
    amount: number
    recvWindow?: number
  }

  export interface marginIsolatedTransferHistory {
    asset?: string
    symbol: string
    transFrom?: WalletType_LT
    transTo?: WalletType_LT
    startTime?: number
    endTime?: number
    current?: number
    size?: number
    recvWindow?: number
  }

  export interface marginIsolatedTransferHistoryResponse {
    rows: {
      amount: string
      asset: string
      status: string
      timestamp: number
      txId: number
      transFrom: WalletType_LT
      transTo: WalletType_LT
    }[]
    total: number
  }

  export interface ForceOrder {
    symbol: string
    price: string
    origQty: string
    lastFilledQty: string
    accumulatedQty: string
    averagePrice: string
    status: string
    timeInForce: string
    type: OrderType_LT
    side: OrderSide_LT
    time: number
  }

  export interface GetFuturesOrder {
    avgPrice: string
    clientOrderId: string
    cumQuote: string
    executedQty: string
    orderId: number
    origQty: string
    origType: FuturesOrderType_LT
    price: string
    reduceOnly: boolean
    side: OrderSide_LT
    positionSide: PositionSide_LT
    status: OrderStatus_LT
    stopPrice: string
    closePosition: boolean
    symbol: string
    time: number
    timeInForce: TimeInForce_LT
    type: OrderType_LT
    activatePrice: string
    priceRate: string
    updateTime: number
    workingType: WorkingType_LT
    priceProtect: boolean
  }

  export type PositionSide_LT = 'BOTH' | 'SHORT' | 'LONG'

  export const enum PositionSide {
    BOTH = 'BOTH',
    SHORT = 'SHORT',
    LONG = 'LONG',
  }

  export type WorkingType_LT = 'MARK_PRICE' | 'CONTRACT_PRICE'

  export const enum WorkingType {
    MARK_PRICE = 'MARK_PRICE',
    CONTRACT_PRICE = 'CONTRACT_PRICE',
  }
}
