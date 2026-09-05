import type { Candle } from "../types";

const BASE_URL = "https://api.binance.com/api/v3/klines";

export interface CoinDef {
  symbol: string; // Binance symbol, e.g. BTCUSDT
  label: string; // display name, e.g. BTC
}

export const DEFAULT_COINS: CoinDef[] = [
  { symbol: "BTCUSDT", label: "BTC" },
  { symbol: "ETHUSDT", label: "ETH" },
  { symbol: "SOLUSDT", label: "SOL" },
  { symbol: "BNBUSDT", label: "BNB" },
  { symbol: "XRPUSDT", label: "XRP" },
  { symbol: "ADAUSDT", label: "ADA" },
  { symbol: "DOGEUSDT", label: "DOGE" },
  { symbol: "AVAXUSDT", label: "AVAX" },
  { symbol: "LINKUSDT", label: "LINK" },
  { symbol: "SUIUSDT", label: "SUI" },
];

export type Timeframe = "1h" | "4h" | "1d";

export async function fetchCandles(
  symbol: string,
  interval: Timeframe = "4h",
  limit = 200,
): Promise<Candle[]> {
  const url = `${BASE_URL}?symbol=${encodeURIComponent(symbol)}&interval=${interval}&limit=${limit}`;
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`Binance API error ${res.status} for ${symbol}`);
  }
  const raw = (await res.json()) as unknown[][];
  return raw.map((k) => ({
    openTime: k[0] as number,
    open: parseFloat(k[1] as string),
    high: parseFloat(k[2] as string),
    low: parseFloat(k[3] as string),
    close: parseFloat(k[4] as string),
    volume: parseFloat(k[5] as string),
  }));
}
