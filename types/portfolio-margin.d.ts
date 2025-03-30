import { BinanceRestClient } from './base';

export interface PortfolioMarginEndpoints extends BinanceRestClient {
  portfolioMarginAccountInfo(): Promise<{
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
    assets: Array<{
      asset: string;
      walletBalance: string;
      unrealizedProfit: string;
      marginBalance: string;
      initialMargin: string;
      positionInitialMargin: string;
      openOrderInitialMargin: string;
      maxWithdrawAmount: string;
      crossWalletBalance: string;
      crossUnPnl: string;
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
  }>;
  portfolioMarginCollateralRate(): Promise<Array<{
    asset: string;
    collateralRate: string;
  }>>;
  portfolioMarginLoan(payload: { asset: string; amount: string }): Promise<any>;
  portfolioMarginLoanRepay(payload: { asset: string; amount: string }): Promise<any>;
  portfolioMarginInterestHistory(payload: { asset: string }): Promise<any>;
} 