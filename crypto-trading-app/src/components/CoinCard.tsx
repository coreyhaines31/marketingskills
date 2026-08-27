import type { CoinSignal } from "../types";
import Chart from "./Chart";
import RiskCalculator from "./RiskCalculator";

interface Props {
  signal: CoinSignal;
}

function fmt(n: number) {
  if (n >= 1000) return n.toLocaleString(undefined, { maximumFractionDigits: 2 });
  if (n >= 1) return n.toFixed(3);
  return n.toPrecision(4);
}

export default function CoinCard({ signal }: Props) {
  const { label, candles, setup, error } = signal;

  if (error) {
    return (
      <div className="coin-card">
        <div className="coin-card-header">
          <h3>{label}</h3>
        </div>
        <div className="coin-card-error">Failed to load: {error}</div>
      </div>
    );
  }

  if (!setup) {
    return (
      <div className="coin-card">
        <div className="coin-card-header">
          <h3>{label}</h3>
        </div>
        <div className="coin-card-error">Not enough data yet.</div>
      </div>
    );
  }

  const directionClass =
    setup.direction === "long"
      ? "badge-long"
      : setup.direction === "short"
        ? "badge-short"
        : "badge-none";

  const directionLabel =
    setup.direction === "long"
      ? "LONG SETUP"
      : setup.direction === "short"
        ? "SHORT SETUP"
        : "NO SETUP";

  return (
    <div className="coin-card">
      <div className="coin-card-header">
        <h3>{label}</h3>
        <span className={`badge ${directionClass}`}>{directionLabel}</span>
        <span className="confidence">{setup.confidence}% confluence</span>
      </div>

      <Chart candles={candles} setup={setup} />

      {setup.direction !== "none" ? (
        <>
          <div className="setup-grid">
            <div>
              <span className="k">Entry</span>
              <span className="v">{fmt(setup.entry)}</span>
            </div>
            <div>
              <span className="k">Stop</span>
              <span className="v v-stop">{fmt(setup.stopLoss)}</span>
            </div>
            <div>
              <span className="k">TP1 (1.5R)</span>
              <span className="v v-tp">{fmt(setup.takeProfit1)}</span>
            </div>
            <div>
              <span className="k">TP2 (2R)</span>
              <span className="v v-tp">{fmt(setup.takeProfit2)}</span>
            </div>
            <div>
              <span className="k">TP3 (3R)</span>
              <span className="v v-tp">{fmt(setup.takeProfit3)}</span>
            </div>
            <div>
              <span className="k">Risk:Reward (TP2)</span>
              <span className="v">1 : {setup.riskRewardAtTP2}</span>
            </div>
          </div>

          <ul className="reasons">
            {setup.reasons.map((r, i) => (
              <li key={i}>{r}</li>
            ))}
          </ul>

          <RiskCalculator setup={setup} label={label} />
        </>
      ) : (
        <div className="no-setup-reasons">
          <p>Signals don't agree strongly enough for a defined setup right now.</p>
          <ul className="reasons">
            {setup.reasons.map((r, i) => (
              <li key={i}>{r}</li>
            ))}
          </ul>
        </div>
      )}

      {setup.warnings.length > 0 && (
        <ul className="warnings">
          {setup.warnings.map((w, i) => (
            <li key={i}>{w}</li>
          ))}
        </ul>
      )}
    </div>
  );
}
