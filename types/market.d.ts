import { BinanceRestClient } from './base';

export interface Trade {
  eventType: string;
  eventTime: number;
  symbol: string;
  price: string;
  quantity: string;
  maker: boolean;
  isBuyerMaker: boolean;
  tradeId: number;
}

export interface Ticker {
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

export interface BookTicker {
  symbol: string;
  bidPrice: string;
  bidQty: string;
  askPrice: string;
  askQty: string;
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

export interface AggregatedTrade {
  aggId: number;
  symbol: string;
  price: string;
  quantity: string;
  firstId: number;
  lastId: number;
  timestamp: number;
  isBuyerMaker: boolean;
  wasBestPrice: boolean;
}

export interface MarketEndpoints extends BinanceRestClient {
  book(payload: { symbol: string; limit?: number }): Promise<{
    lastUpdateId: number;
    asks: [string, string][];
    bids: [string, string][];
  }>;
  aggTrades(payload: {
    symbol: string;
    fromId?: number;
    startTime?: number;
    endTime?: number;
    limit?: number;
  }): Promise<AggregatedTrade[]>;
  candles(payload: {
    symbol: string;
    interval: string;
    startTime?: number;
    endTime?: number;
    limit?: number;
  }): Promise<CandleChartResult[]>;
  trades(payload: { symbol: string; limit?: number }): Promise<Trade[]>;
  tradesHistory(payload: { symbol: string; limit?: number }): Promise<Trade[]>;
  dailyStats(payload: { symbol: string }): Promise<Ticker>;
  prices(): Promise<Array<{ symbol: string; price: string }>>;
  avgPrice(payload: { symbol: string }): Promise<{
    mins: number;
    price: string;
  }>;
  allBookTickers(): Promise<BookTicker[]>;
  ticker24hr(payload: { symbol: string }): Promise<Ticker>;
  tickerPrice(payload: { symbol: string }): Promise<{
    symbol: string;
    price: string;
  }>;
  bookTicker(payload: { symbol: string }): Promise<BookTicker>;
} 