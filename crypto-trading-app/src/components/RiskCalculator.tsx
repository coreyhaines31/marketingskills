import { useMemo, useState } from "react";
import type { TradeSetup } from "../types";

interface Props {
  setup: TradeSetup | null;
  label: string;
}

export default function RiskCalculator({ setup, label }: Props) {
  const [accountSize, setAccountSize] = useState(1000);
  const [riskPct, setRiskPct] = useState(1);

  const calc = useMemo(() => {
    if (!setup || setup.direction === "none") return null;
    const riskAmount = accountSize * (riskPct / 100);
    const perUnitRisk = Math.abs(setup.entry - setup.stopLoss);
    if (perUnitRisk <= 0) return null;
    const positionSize = riskAmount / perUnitRisk; // units of coin
    const positionValue = positionSize * setup.entry;
    return { riskAmount, positionSize, positionValue };
  }, [setup, accountSize, riskPct]);

  if (!setup || setup.direction === "none") return null;

  return (
    <div className="risk-calc">
      <div className="risk-calc-inputs">
        <label>
          Account size (USD)
          <input
            type="number"
            min={0}
            value={accountSize}
            onChange={(e) => setAccountSize(Number(e.target.value) || 0)}
          />
        </label>
        <label>
          Risk per trade (%)
          <input
            type="number"
            min={0}
            max={100}
            step={0.25}
            value={riskPct}
            onChange={(e) => setRiskPct(Number(e.target.value) || 0)}
          />
        </label>
      </div>
      {calc && (
        <div className="risk-calc-output">
          <div>
            Risking <strong>${calc.riskAmount.toFixed(2)}</strong> on this{" "}
            {label} {setup.direction} setup
          </div>
          <div>
            Position size ≈{" "}
            <strong>{calc.positionSize.toFixed(5)} {label}</strong> (~$
            {calc.positionValue.toFixed(2)})
          </div>
        </div>
      )}
    </div>
  );
}
