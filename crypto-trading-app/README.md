# Crypto Setup Scanner

A client-side dashboard that scans major crypto pairs for **confluence-based
technical setups** with pre-defined, risk-managed trade plans — entry, stop-loss,
and three take-profit levels (1.5R / 2R / 3R) with a stated risk-to-reward ratio.

## What this is (and isn't)

No tool can reliably predict where crypto prices will go — treat anything that
claims otherwise with suspicion. What this app does instead:

- Pulls live OHLCV candles for 10 major pairs from Binance's public market-data
  API (no account or API key required).
- Computes standard technical indicators: EMA(20/50) trend structure, MACD
  histogram momentum, RSI(14), ATR(14) for volatility, and recent swing
  highs/lows for market structure.
- Scores how many of those signals agree. A trade setup (long or short) is only
  surfaced when confluence is strong (≥60%); otherwise the card explicitly says
  **"no setup"** rather than forcing a trade.
- When a setup exists, risk is defined *before* any entry: stop-loss is placed
  using ATR and recent structure, and take-profits are computed as fixed
  multiples of that risk (R), so risk-to-reward is known upfront.
- Includes a position-size calculator: enter your account size and risk % per
  trade, and it computes how much to actually risk in dollars and units.

This is a decision-support tool for people who already understand trading
risk, not a signal service and not investment advice. It does not place any
trades — it's read-only analysis.

## Running it

```bash
npm install
npm run dev
```

Then open the printed local URL. The dashboard auto-refreshes every 60
seconds and lets you switch between 1h / 4h / 1d timeframes.

To build a static production bundle:

```bash
npm run build
npm run preview
```

## Project structure

```
src/
  api/binance.ts       Fetches klines from Binance's public REST API
  lib/indicators.ts     EMA, RSI, MACD, ATR, swing high/low helpers
  lib/signals.ts         Confluence scoring + trade setup (entry/stop/targets)
  components/            Chart (lightweight-charts), CoinCard, RiskCalculator, Disclaimer
  App.tsx                 Dashboard: coin grid, timeframe switch, polling
```

## Extending it

- Add more pairs by editing `DEFAULT_COINS` in `src/api/binance.ts`.
- Tune signal strictness (the confluence threshold, indicator windows, stop
  sizing) in `src/lib/signals.ts`.
- Swap the data source for a different exchange by replacing `src/api/binance.ts`
  with an equivalent client that returns `Candle[]`.
- This intentionally does not execute trades. If you want to wire it to a
  broker/exchange for order placement, treat that as a separate, carefully
  reviewed addition — it moves this from an analysis tool to something that
  can lose real money on a bug.
