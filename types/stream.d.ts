import { BinanceRestClient } from './base';

export interface StreamEndpoints extends BinanceRestClient {
  getDataStream(): Promise<{
    listenKey: string;
  }>;
  keepDataStream(payload: { listenKey: string }): Promise<{
    listenKey: string;
    code: number;
    msg: string;
  }>;
  closeDataStream(payload: { listenKey: string }): Promise<{
    listenKey: string;
    code: number;
    msg: string;
  }>;
  marginGetDataStream(): Promise<{
    listenKey: string;
  }>;
  marginKeepDataStream(payload: { listenKey: string }): Promise<{
    listenKey: string;
    code: number;
    msg: string;
  }>;
  marginCloseDataStream(payload: { listenKey: string }): Promise<{
    listenKey: string;
    code: number;
    msg: string;
  }>;
  futuresGetDataStream(): Promise<{
    listenKey: string;
  }>;
  futuresKeepDataStream(payload: { listenKey: string }): Promise<{
    listenKey: string;
    code: number;
    msg: string;
  }>;
  futuresCloseDataStream(payload: { listenKey: string }): Promise<{
    listenKey: string;
    code: number;
    msg: string;
  }>;
  deliveryGetDataStream(): Promise<{
    listenKey: string;
  }>;
  deliveryKeepDataStream(payload: { listenKey: string }): Promise<{
    listenKey: string;
    code: number;
    msg: string;
  }>;
  deliveryCloseDataStream(payload: { listenKey: string }): Promise<{
    listenKey: string;
    code: number;
    msg: string;
  }>;
} 