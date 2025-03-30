import { BinanceRestClient } from './base';

export interface Account {
  accountType: TradingType.MARGIN | TradingType.SPOT;
  balances: AssetBalance[];
  buyerCommission: number;
  canDeposit: boolean;
  canTrade: boolean;
  canWithdraw: boolean;
  makerCommission: number;
  permissions: TradingType_LT[];
  sellerCommission: number;
  takerCommission: number;
  updateTime: number;
}

export interface AssetBalance {
  asset: string;
  free: string;
  locked: string;
}

export interface TradeFee {
  symbol: string;
  makerCommission: number;
  takerCommission: number;
}

export interface DepositAddress {
  address: string;
  tag: string;
  coin: string;
  url: string;
}

export interface WithdrawResponse {
  id: string;
}

export type DepositStatus_LT = 0 | 1;

export const enum DepositStatus {
  PENDING = 0,
  SUCCESS = 1,
}

export interface UserAssetDribbletDetails {
  transId: number;
  serviceChargeAmount: string;
  amount: string;
  operateTime: number;
  transferedAmount: string;
  fromAsset: string;
}

export interface UserAssetDribblets {
  operateTime: number;
  totalTransferedAmount: string;
  totalServiceChargeAmount: string;
  transId: number;
  userAssetDribbletDetails: UserAssetDribbletDetails[];
}

export interface DustLog {
  total: number;
  userAssetDribblets: UserAssetDribblets[];
}

export interface DustTransferResult {
  amount: string;
  fromAsset: string;
  operateTime: number;
  serviceChargeAmount: string;
  tranId: number;
  transferedAmount: string;
}

export interface DustTransfer {
  totalServiceCharge: string;
  totalTransfered: string;
  transferResult: DustTransferResult[];
}

export interface DepositHistoryResponse {
  [index: number]: {
    insertTime: number;
    amount: string;
    coin: string;
    network: string;
    address: string;
    txId: string;
    status: DepositStatus_LT;
    addressTag?: string;
    transferType?: number;
    confirmTimes?: string;
  };
}

export type WithdrawStatus_LT = 0 | 1 | 2 | 3 | 4 | 5 | 6;

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
    id: string;
    amount: string;
    transactionFee: string;
    address: string;
    coin: string;
    txId: string;
    applyTime: number;
    status: WithdrawStatus_LT;
    network: string;
    transferType?: number;
    withdrawOrderId?: string;
  };
}

export interface AccountEndpoints extends BinanceRestClient {
  accountInfo(): Promise<Account>;
  myTrades(payload: { symbol: string; startTime?: number; endTime?: number; fromId?: number; limit?: number }): Promise<Trade[]>;
  withdraw(payload: { coin: string; address: string; amount: string; network?: string; addressTag?: string; name?: string }): Promise<{
    id: string;
    msg: string;
    amount: string;
    address: string;
    network: string;
    addressTag: string;
    transactionFee: string;
    transactionId: string;
    applyTime: string;
    status: number;
  }>;
  withdrawHistory(payload?: { coin?: string; status?: number; startTime?: number; endTime?: number; offset?: number; limit?: number }): Promise<WithdrawHistoryResponse>;
  depositHistory(payload?: { coin?: string; status?: number; startTime?: number; endTime?: number; offset?: number; limit?: number }): Promise<DepositHistoryResponse>;
  depositAddress(payload: { coin: string; network?: string }): Promise<DepositAddress>;
  tradeFee(payload?: { symbol?: string }): Promise<TradeFee[]>;
  assetDetail(payload?: { asset?: string }): Promise<{
    [key: string]: {
      minWithdrawAmount: string;
      depositStatus: boolean;
      withdrawFee: number;
      withdrawStatus: boolean;
      depositTip?: string;
    };
  }>;
  accountSnapshot(payload: { type: string; startTime?: number; endTime?: number; limit?: number }): Promise<{
    code: number;
    msg: string;
    snapshotVos: Array<{
      data: {
        totalAssetOfBtc: string;
        balances: Array<{
          asset: string;
          free: string;
          locked: string;
        }>;
      };
      type: string;
      updateTime: number;
    }>;
  }>;
  universalTransfer(payload: { type: string; asset: string; amount: string; fromSymbol?: string; toSymbol?: string }): Promise<{
    tranId: number;
    status: string;
    type: string;
    asset: string;
    amount: string;
    timestamp: number;
  }>;
  universalTransferHistory(payload: { type: string; startTime?: number; endTime?: number; current?: number; size?: number; fromSymbol?: string; toSymbol?: string }): Promise<{
    total: number;
    rows: Array<{
      asset: string;
      amount: string;
      type: string;
      status: string;
      timestamp: number;
      tranId: number;
      fromSymbol: string;
      toSymbol: string;
    }>;
  }>;
  dustLog(payload?: { startTime?: number; endTime?: number }): Promise<DustLog>;
  dustTransfer(payload: { asset: string[] }): Promise<DustTransfer>;
  accountCoins(): Promise<Array<{
    coin: string;
    depositAllEnable: boolean;
    free: string;
    freeze: string;
    ipoable: string;
    ipoing: string;
    isLegalMoney: boolean;
    locked: string;
    name: string;
    networkList: Array<{
      addressRegex: string;
      coin: string;
      depositDesc: string;
      depositEnable: boolean;
      isDefault: boolean;
      memoRegex: string;
      minConfirm: number;
      name: string;
      network: string;
      resetAddressStatus: boolean;
      specialTips: string;
      unLockConfirm: number;
      withdrawDesc: string;
      withdrawEnable: boolean;
      withdrawFee: string;
      withdrawMin: string;
    }>;
    storage: string;
    trading: boolean;
    withdrawAllEnable: boolean;
    withdrawing: string;
  }>>;
  getBnbBurn(): Promise<{
    msg: string;
    code: number;
    data: {
      spotBNBBurn: boolean;
      interestBNBBurn: boolean;
    };
  }>;
  setBnbBurn(payload: { spotBNBBurn?: boolean; interestBNBBurn?: boolean }): Promise<{
    msg: string;
    code: number;
    data: {
      spotBNBBurn: boolean;
      interestBNBBurn: boolean;
    };
  }>;
} 