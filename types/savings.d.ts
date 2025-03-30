import { BinanceRestClient } from './base';

export interface SavingsEndpoints extends BinanceRestClient {
  savingsProducts(payload: { type: 'ACTIVITY' | 'CUSTOMIZED_FIXED' }): Promise<Array<{
    asset: string;
    productId: string;
    type: string;
    status: string;
    isSoldOut: boolean;
    isStopped: boolean;
    isPurchasePaused: boolean;
    isRedeemPaused: boolean;
    isActivated: boolean;
    createdAt: number;
    updatedAt: number;
    minPurchaseAmount: string;
    maxPurchaseAmount: string;
    purchaseAmount: string;
    redeemAmount: string;
    term: number;
    interestRate: string;
    lotSize: string;
    nextInterestPay: number;
    nextInterestPayDate: number;
    purchaseInterestRate: string;
    redeemInterestRate: string;
    totalInterest: string;
    totalInterestRate: string;
    canTransfer: boolean;
    purchaseMinAmount: string;
    purchaseMaxAmount: string;
    redeemMinAmount: string;
    redeemMaxAmount: string;
    redeemPeriod: number;
    redeemInterest: string;
    redeemPrincipal: string;
    canRedeemEarly: boolean;
    status: string;
    tierAnnualPercentageRate: Array<{
      tier: number;
      annualPercentageRate: string;
    }>;
  }>>;
  savingsPurchase(payload: { productId: string; amount: string }): Promise<{
    purchaseId: number;
  }>;
  savingsRedeem(payload: { productId: string; amount: string; type: 'FAST' | 'NORMAL' }): Promise<{
    redeemId: number;
  }>;
  savingsRedemptionQuota(payload: { productId: string; type: 'FAST' | 'NORMAL' }): Promise<{
    asset: string;
    productId: string;
    leftQuota: string;
    minAmount: string;
    maxAmount: string;
    leftAmount: string;
    redeemAmount: string;
    apy: string;
  }>;
  savingsProjectPosition(payload: { asset: string }): Promise<Array<{
    asset: string;
    canTransfer: boolean;
    createTimestamp: number;
    duration: number;
    endTime: number;
    projectId: string;
    projectName: string;
    purchaseAmount: string;
    redeemAmount: string;
    startTime: number;
    status: string;
    type: string;
  }>>;
  savingsAccount(): Promise<{
    totalAssetInBtc: string;
    totalAssetInUsdt: string;
    totalFixedAmountAssetInBtc: string;
    totalFixedAmountAssetInUsdt: string;
    totalLendingAmountInBtc: string;
    totalLendingAmountInUsdt: string;
    totalAvailableAssetInBtc: string;
    totalAvailableAssetInUsdt: string;
    totalAmountInBtc: string;
    totalAmountInUsdt: string;
    totalFlexibleAmountInBtc: string;
    totalFlexibleAmountInUsdt: string;
  }>;
  savingsTransfer(payload: { projectId: string; asset: string; amount: number; type: 'IN' | 'OUT' }): Promise<{
    transferId: number;
  }>;
  savingsTransferQuota(payload: { projectId: string; asset: string }): Promise<{
    asset: string;
    projectId: string;
    leftQuota: string;
    minAmount: string;
    maxAmount: string;
    leftAmount: string;
    transferAmount: string;
    apy: string;
  }>;
  savingsInterestHistory(payload: { asset: string; startTime?: number; endTime?: number; limit?: number }): Promise<Array<{
    asset: string;
    projectId: string;
    interest: string;
    interestAccrualTime: number;
    interestRate: string;
    principal: string;
    type: string;
    time: number;
  }>>;
  savingsPosition(payload: { asset: string }): Promise<Array<{
    asset: string;
    projectId: string;
    amount: string;
    purchaseTime: number;
    duration: number;
    accrualDays: number;
    assetPrice: string;
    averageAnnualInterestRate: string;
    canRedeemEarly: boolean;
    type: string;
    status: string;
  }>>;
} 