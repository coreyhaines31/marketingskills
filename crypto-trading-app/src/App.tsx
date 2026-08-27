import { useCallback, useEffect, useState } from "react";
import { DEFAULT_COINS, fetchCandles, type Timeframe } from "./api/binance";
import { generateSetup } from "./lib/signals";
import type { CoinSignal } from "./types";
import CoinCard from "./components/CoinCard";
import Disclaimer from "./components/Disclaimer";

const TIMEFRAMES: { value: Timeframe; label: string }[] = [
  { value: "1h", label: "1 hour" },
  { value: "4h", label: "4 hour" },
  { value: "1d", label: "1 day" },
];

const REFRESH_MS = 60_000;

export default function App() {
  const [timeframe, setTimeframe] = useState<Timeframe>("4h");
  const [signals, setSignals] = useState<CoinSignal[]>(
    DEFAULT_COINS.map((c) => ({ symbol: c.symbol, label: c.label, candles: [], setup: null })),
  );
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [onlySetups, setOnlySetups] = useState(false);

  const loadAll = useCallback(async () => {
    setLoading(true);
    const results = await Promise.all(
      DEFAULT_COINS.map(async (coin): Promise<CoinSignal> => {
        try {
          const candles = await fetchCandles(coin.symbol, timeframe, 200);
          const setup = generateSetup(candles);
          return { symbol: coin.symbol, label: coin.label, candles, setup };
        } catch (err) {
          return {
            symbol: coin.symbol,
            label: coin.label,
            candles: [],
            setup: null,
            error: err instanceof Error ? err.message : String(err),
          };
        }
      }),
    );
    setSignals(results);
    setLastUpdated(new Date());
    setLoading(false);
  }, [timeframe]);

  useEffect(() => {
    loadAll();
    const id = setInterval(loadAll, REFRESH_MS);
    return () => clearInterval(id);
  }, [loadAll]);

  const activeSetups = signals.filter((s) => s.setup && s.setup.direction !== "none").length;
  const visibleSignals = onlySetups
    ? signals.filter((s) => s.setup && s.setup.direction !== "none")
    : signals;

  return (
    <div className="app">
      <header className="app-header">
        <div>
          <h1>Crypto Setup Scanner</h1>
          <p className="subtitle">
            Confluence-based technical signals with defined risk-to-reward. Data from Binance public market data.
          </p>
        </div>
        <div className="controls">
          <div className="timeframe-select">
            {TIMEFRAMES.map((tf) => (
              <button
                key={tf.value}
                className={tf.value === timeframe ? "active" : ""}
                onClick={() => setTimeframe(tf.value)}
              >
                {tf.label}
              </button>
            ))}
          </div>
          <label className="toggle">
            <input
              type="checkbox"
              checked={onlySetups}
              onChange={(e) => setOnlySetups(e.target.checked)}
            />
            Only show active setups ({activeSetups})
          </label>
          <button className="refresh-btn" onClick={loadAll} disabled={loading}>
            {loading ? "Scanning…" : "Refresh now"}
          </button>
        </div>
      </header>

      <Disclaimer />

      {lastUpdated && (
        <div className="last-updated">Last updated {lastUpdated.toLocaleTimeString()}</div>
      )}

      <div className="grid">
        {visibleSignals.map((s) => (
          <CoinCard key={s.symbol} signal={s} />
        ))}
      </div>

      {visibleSignals.length === 0 && (
        <div className="empty-state">No coins currently have a qualifying setup on this timeframe.</div>
      )}
    </div>
  );
}
