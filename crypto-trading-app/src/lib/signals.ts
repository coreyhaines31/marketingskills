import type { Candle, Direction, TradeSetup } from "../types";
import { atr, ema, macd, rsi, swingLevels } from "./indicators";

const MIN_CANDLES = 60;
const CONFIDENCE_THRESHOLD = 60; // below this, we report "no setup" rather than force a trade

/**
 * Confluence-based trend-following setup generator.
 *
 * This is NOT a prediction of future price. It scores how well current
 * trend, momentum, and volatility indicators agree, and only proposes a
 * setup when enough of them line up. Stops/targets are derived from
 * volatility (ATR) and recent market structure (swing highs/lows), so
 * risk is defined before any entry is suggested.
 */
export function generateSetup(candles: Candle[]): TradeSetup | null {
  if (candles.length < MIN_CANDLES) return null;

  const closes = candles.map((c) => c.close);
  const price = closes[closes.length - 1];

  const ema20 = ema(closes, 20);
  const ema50 = ema(closes, 50);
  const { histogram } = macd(closes);
  const rsiSeries = rsi(closes, 14);
  const atrSeries = atr(candles, 14);

  const lastEma20 = ema20[ema20.length - 1];
  const lastEma50 = ema50[ema50.length - 1];
  const lastHist = histogram[histogram.length - 1];
  const prevHist = histogram[histogram.length - 2];
  const lastRsi = rsiSeries[rsiSeries.length - 1];
  const lastAtr = atrSeries[atrSeries.length - 1];

  const { swingHigh, swingLow } = swingLevels(candles, 30, 2);

  const bullSignals: string[] = [];
  const bearSignals: string[] = [];
  const warnings: string[] = [];

  // Trend: EMA structure
  if (lastEma20 > lastEma50 && price > lastEma20) {
    bullSignals.push("Price above rising 20/50 EMA (uptrend structure)");
  } else if (lastEma20 < lastEma50 && price < lastEma20) {
    bearSignals.push("Price below falling 20/50 EMA (downtrend structure)");
  }

  // Momentum: MACD histogram direction
  if (lastHist > 0 && lastHist > prevHist) {
    bullSignals.push("MACD histogram positive and expanding");
  } else if (lastHist < 0 && lastHist < prevHist) {
    bearSignals.push("MACD histogram negative and expanding");
  }

  // RSI filter: trending but not exhausted
  if (lastRsi >= 45 && lastRsi <= 68) {
    bullSignals.push(`RSI ${lastRsi.toFixed(0)} supports upside without being overbought`);
  } else if (lastRsi >= 32 && lastRsi <= 55) {
    bearSignals.push(`RSI ${lastRsi.toFixed(0)} supports downside without being oversold`);
  }
  if (lastRsi > 75) warnings.push(`RSI ${lastRsi.toFixed(0)} is overbought — pullback risk`);
  if (lastRsi < 25) warnings.push(`RSI ${lastRsi.toFixed(0)} is oversold — bounce risk`);

  // Market structure: room to run before next swing level
  const upside = swingHigh - price;
  const downside = price - swingLow;
  if (upside > lastAtr) bullSignals.push("Room to next swing high before resistance");
  if (downside > lastAtr) bearSignals.push("Room to next swing low before support");

  const bullScore = bullSignals.length;
  const bearScore = bearSignals.length;
  const totalFactors = 4; // trend, momentum, rsi, structure

  let direction: Direction = "none";
  let confidence = 0;
  let reasons: string[] = [];

  if (bullScore > bearScore) {
    direction = "long";
    confidence = Math.round((bullScore / totalFactors) * 100);
    reasons = bullSignals;
  } else if (bearScore > bullScore) {
    direction = "short";
    confidence = Math.round((bearScore / totalFactors) * 100);
    reasons = bearSignals;
  } else {
    direction = "none";
    confidence = 50;
    reasons = ["Bullish and bearish factors are balanced — no edge either way"];
  }

  if (confidence < CONFIDENCE_THRESHOLD || direction === "none") {
    return {
      direction: "none",
      confidence,
      price,
      entry: price,
      stopLoss: price,
      takeProfit1: price,
      takeProfit2: price,
      takeProfit3: price,
      riskRewardAtTP2: 0,
      reasons: reasons.length ? reasons : ["Indicators are not in agreement"],
      warnings: [...warnings, "Confidence below threshold — sitting this one out preserves capital"],
      atr: lastAtr,
    };
  }

  const entry = price;
  let stopLoss: number;
  let risk: number;

  if (direction === "long") {
    const structuralStop = swingLow - lastAtr * 0.25;
    const volStop = entry - lastAtr * 1.5;
    stopLoss = Math.min(structuralStop, volStop); // wider of the two, but never absurdly tight
    stopLoss = Math.max(stopLoss, entry - lastAtr * 3); // sanity cap so risk isn't huge
    risk = entry - stopLoss;
  } else {
    const structuralStop = swingHigh + lastAtr * 0.25;
    const volStop = entry + lastAtr * 1.5;
    stopLoss = Math.max(structuralStop, volStop);
    stopLoss = Math.min(stopLoss, entry + lastAtr * 3);
    risk = stopLoss - entry;
  }

  if (risk <= 0 || !isFinite(risk)) {
    return {
      direction: "none",
      confidence,
      price,
      entry: price,
      stopLoss: price,
      takeProfit1: price,
      takeProfit2: price,
      takeProfit3: price,
      riskRewardAtTP2: 0,
      reasons,
      warnings: [...warnings, "Could not derive a sane stop distance — no setup"],
      atr: lastAtr,
    };
  }

  const takeProfit1 = direction === "long" ? entry + risk * 1.5 : entry - risk * 1.5;
  const takeProfit2 = direction === "long" ? entry + risk * 2 : entry - risk * 2;
  const takeProfit3 = direction === "long" ? entry + risk * 3 : entry - risk * 3;

  if (lastRsi > 70 && direction === "long") {
    warnings.push("Entering long while RSI is stretched — consider waiting for a pullback to EMA20");
  }
  if (lastRsi < 30 && direction === "short") {
    warnings.push("Entering short while RSI is stretched — consider waiting for a bounce to EMA20");
  }

  return {
    direction,
    confidence: Math.min(confidence, 95), // never claim near-certainty
    price,
    entry,
    stopLoss,
    takeProfit1,
    takeProfit2,
    takeProfit3,
    riskRewardAtTP2: 2, // by construction (risk * 2)
    reasons,
    warnings,
    atr: lastAtr,
  };
}
