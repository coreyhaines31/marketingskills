export interface Candle {
  openTime: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export type Direction = "long" | "short" | "none";

export interface TradeSetup {
  direction: Direction;
  confidence: number; // 0-100
  price: number;
  entry: number;
  stopLoss: number;
  takeProfit1: number; // ~1.5R
  takeProfit2: number; // ~2R
  takeProfit3: number; // ~3R
  riskRewardAtTP2: number;
  reasons: string[];
  warnings: string[];
  atr: number;
}

export interface CoinSignal {
  symbol: string;
  label: string;
  candles: Candle[];
  setup: TradeSetup | null;
  error?: string;
}
