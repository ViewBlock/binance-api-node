import { BinanceRestClient } from './base';

export interface MiningEndpoints extends BinanceRestClient {
  miningAlgorithms(): Promise<Array<{
    algoName: string;
    algoId: number;
    poolIndex: number;
    unit: string;
  }>>;
  miningCoinName(): Promise<Array<{
    coinName: string;
    coinId: number;
    poolIndex: number;
    algoId: number;
    algoName: string;
    isMinimumPoolSize: boolean;
    poolDailyShare: string;
    poolCoefficient: string;
    poolFee: string;
    isTransparentMiningFee: boolean;
  }>>;
  miningDetails(payload: { algo: string; userName: string; coinName: string; startDate: number; endDate: number }): Promise<Array<{
    poolUsername: string;
    type: number;
    hashRate: string;
    submitDate: number;
    date: number;
    validShares: number;
    invalidShares: number;
    profitAmount: number;
    profitUSDT: number;
    coinName: string;
    coinType: string;
    algorithm: string;
    timeUnit: number;
    day: number;
    status: number;
  }>>;
  miningEarnings(payload: { algo: string; userName: string; coinName: string; startDate: number; endDate: number }): Promise<Array<{
    poolUsername: string;
    type: number;
    hashRate: string;
    originalHashRate: string;
    validShares: number;
    invalidShares: number;
    totalHashrate: string;
    totalHashrate24h: string;
    totalHashrateUnit: string;
    totalHashrate24hUnit: string;
    totalReject: number;
    date: number;
    coinName: string;
    coinType: string;
    algorithm: string;
    timeUnit: number;
    day: number;
    status: number;
    name: string;
    profitAmount: number;
    profitUSDT: number;
    status: number;
  }>>;
  miningExtraBonusList(payload: { algo: string; userName: string; coinName: string; startDate: number; endDate: number }): Promise<Array<{
    poolUsername: string;
    type: number;
    hashRate: string;
    validShares: number;
    invalidShares: number;
    totalHashrate: string;
    totalHashrate24h: string;
    totalHashrateUnit: string;
    totalHashrate24hUnit: string;
    totalReject: number;
    date: number;
    coinName: string;
    coinType: string;
    algorithm: string;
    timeUnit: number;
    day: number;
    status: number;
    name: string;
    profitAmount: number;
    profitUSDT: number;
    status: number;
  }>>;
  miningHashrateResaleRequest(payload: { userName: string; coinName: string; algo: string; startDate: number; endDate: number; pageIndex: number; pageSize: number }): Promise<{
    code: number;
    msg: string;
    data: {
      totalNum: number;
      pageSize: number;
      pageNum: number;
      totalPageNum: number;
      configDetails: Array<{
        poolUsername: string;
        toPoolUsername: string;
        algoName: string;
        hashRate: string;
        startDay: number;
        endDay: number;
        status: number;
        configName: string;
        configId: number;
      }>;
    };
  }>;
  miningHashrateResaleDetails(payload: { configId: number; pageIndex: number; pageSize: number }): Promise<{
    code: number;
    msg: string;
    data: {
      totalNum: number;
      pageSize: number;
      pageNum: number;
      totalPageNum: number;
      profitTransferDetails: Array<{
        poolUsername: string;
        toPoolUsername: string;
        algoName: string;
        hashRate: string;
        day: number;
        amount: number;
        coinName: string;
      }>;
    };
  }>;
  miningHashrateResaleList(payload: { pageIndex: number; pageSize: number }): Promise<{
    code: number;
    msg: string;
    data: {
      totalNum: number;
      pageSize: number;
      pageNum: number;
      totalPageNum: number;
      configDetails: Array<{
        poolUsername: string;
        toPoolUsername: string;
        algoName: string;
        hashRate: string;
        startDay: number;
        endDay: number;
        status: number;
        configName: string;
        configId: number;
      }>;
    };
  }>;
  miningHashrateResaleRequest(payload: { userName: string; coinName: string; algo: string; startDate: number; endDate: number; toPoolUsername: string; hashRate: string }): Promise<{
    code: number;
    msg: string;
    data: number;
  }>;
  miningHashrateResaleCancel(payload: { configId: number; userName: string }): Promise<{
    code: number;
    msg: string;
    data: boolean;
  }>;
  miningStatistics(payload: { algo: string; userName: string }): Promise<Array<{
    fifteenMinHashRate: string;
    dayHashRate: string;
    validNum: number;
    invalidNum: number;
    profitToday: string;
    profitUSDT: string;
    coinName: string;
    type: number;
    time: number;
  }>>;
  miningAccountList(payload: { algo: string; userName: string }): Promise<Array<{
    type: number;
    userName: string;
    list: Array<{
      time: number;
      hashrate: string;
      reject: number;
    }>;
  }>>;
  miningWorkerList(payload: { algo: string; userName: string }): Promise<Array<{
    workerId: string;
    workerName: string;
    type: number;
    hashRate: string;
    dayHashRate: string;
    validNum: number;
    invalidNum: number;
    acceptShares: number;
    rejectShares: number;
    profitToday: string;
    profitUSDT: string;
    userCount: number;
    coinName: string;
    unit: string;
    algo: string;
    time: number;
  }>>;
  miningPaymentList(payload: { algo: string; userName: string; coinName: string; startDate: number; endDate: number }): Promise<Array<{
    poolUsername: string;
    type: number;
    hashRate: string;
    validShares: number;
    invalidShares: number;
    totalHashrate: string;
    totalHashrate24h: string;
    totalHashrateUnit: string;
    totalHashrate24hUnit: string;
    totalReject: number;
    date: number;
    coinName: string;
    coinType: string;
    algorithm: string;
    timeUnit: number;
    day: number;
    status: number;
    name: string;
    profitAmount: number;
    profitUSDT: number;
    status: number;
  }>>;
  miningHashrateTransfer(payload: { algo: string; userName: string; coinName: string; startDate: number; endDate: number }): Promise<Array<{
    poolUsername: string;
    type: number;
    hashRate: string;
    validShares: number;
    invalidShares: number;
    totalHashrate: string;
    totalHashrate24h: string;
    totalHashrateUnit: string;
    totalHashrate24hUnit: string;
    totalReject: number;
    date: number;
    coinName: string;
    coinType: string;
    algorithm: string;
    timeUnit: number;
    day: number;
    status: number;
    name: string;
    profitAmount: number;
    profitUSDT: number;
    status: number;
  }>>;
  miningHashrateTransferDetails(payload: { configId: number; pageIndex: number; pageSize: number }): Promise<{
    code: number;
    msg: string;
    data: {
      totalNum: number;
      pageSize: number;
      pageNum: number;
      totalPageNum: number;
      profitTransferDetails: Array<{
        poolUsername: string;
        toPoolUsername: string;
        algoName: string;
        hashRate: string;
        day: number;
        amount: number;
        coinName: string;
      }>;
    };
  }>;
  miningHashrateTransferList(payload: { pageIndex: number; pageSize: number }): Promise<{
    code: number;
    msg: string;
    data: {
      totalNum: number;
      pageSize: number;
      pageNum: number;
      totalPageNum: number;
      configDetails: Array<{
        poolUsername: string;
        toPoolUsername: string;
        algoName: string;
        hashRate: string;
        startDay: number;
        endDay: number;
        status: number;
        configName: string;
        configId: number;
      }>;
    };
  }>;
  miningHashrateTransferRequest(payload: { userName: string; coinName: string; algo: string; startDate: number; endDate: number; toPoolUsername: string; hashRate: string }): Promise<{
    code: number;
    msg: string;
    data: number;
  }>;
  miningHashrateTransferCancel(payload: { configId: number; userName: string }): Promise<{
    code: number;
    msg: string;
    data: boolean;
  }>;
} 