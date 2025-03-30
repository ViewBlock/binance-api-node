import { BinanceRestClient, RateLimitType, RateLimitInterval } from './base';

export interface GenericEndpoints extends BinanceRestClient {
  getInfo(): Promise<{
    timezone: string;
    serverTime: number;
    rateLimits: Array<{
      rateLimitType: RateLimitType;
      interval: RateLimitInterval;
      intervalNum: number;
      limit: number;
    }>;
    exchangeFilters: any[];
    symbols: Array<{
      symbol: string;
      status: string;
      baseAsset: string;
      quoteAsset: string;
      orderTypes: string[];
      icebergAllowed: boolean;
      ocoAllowed: boolean;
      isSpotTradingAllowed: boolean;
      isMarginTradingAllowed: boolean;
      filters: any[];
      permissions: string[];
    }>;
  }>;
  ping(): Promise<boolean>;
  time(): Promise<{ serverTime: number }>;
  exchangeInfo(): Promise<any>;
  privateRequest(method: string, url: string, payload: any): Promise<any>;
  publicRequest(method: string, url: string, payload: any): Promise<any>;
} 