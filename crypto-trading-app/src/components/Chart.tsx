import { useEffect, useRef } from "react";
import {
  createChart,
  ColorType,
  CrosshairMode,
  type IChartApi,
} from "lightweight-charts";
import type { Candle, TradeSetup } from "../types";

interface Props {
  candles: Candle[];
  setup: TradeSetup | null;
}

export default function Chart({ candles, setup }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const chart = createChart(containerRef.current, {
      width: containerRef.current.clientWidth,
      height: 260,
      layout: {
        background: { type: ColorType.Solid, color: "#0f1420" },
        textColor: "#c7d0e0",
      },
      grid: {
        vertLines: { color: "#1b2235" },
        horzLines: { color: "#1b2235" },
      },
      crosshair: { mode: CrosshairMode.Normal },
      timeScale: { timeVisible: true, secondsVisible: false },
    });
    chartRef.current = chart;

    const series = chart.addCandlestickSeries({
      upColor: "#22c55e",
      downColor: "#ef4444",
      borderVisible: false,
      wickUpColor: "#22c55e",
      wickDownColor: "#ef4444",
    });

    series.setData(
      candles.map((c) => ({
        time: Math.floor(c.openTime / 1000) as any,
        open: c.open,
        high: c.high,
        low: c.low,
        close: c.close,
      })),
    );

    if (setup && setup.direction !== "none") {
      const lines = [
        { price: setup.entry, color: "#e5e7eb", title: "Entry" },
        { price: setup.stopLoss, color: "#ef4444", title: "Stop" },
        { price: setup.takeProfit1, color: "#22c55e", title: "TP1" },
        { price: setup.takeProfit2, color: "#22c55e", title: "TP2" },
        { price: setup.takeProfit3, color: "#22c55e", title: "TP3" },
      ];
      lines.forEach((l) => {
        series.createPriceLine({
          price: l.price,
          color: l.color,
          lineWidth: 1,
          lineStyle: 2,
          axisLabelVisible: true,
          title: l.title,
        });
      });
    }

    chart.timeScale().fitContent();

    const handleResize = () => {
      if (containerRef.current) {
        chart.applyOptions({ width: containerRef.current.clientWidth });
      }
    };
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      chart.remove();
      chartRef.current = null;
    };
  }, [candles, setup]);

  return <div ref={containerRef} className="chart-container" />;
}
