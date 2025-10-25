"use client";

import {
  AreaSeries,
  createChart,
  type IChartApi,
  type ISeriesApi,
  type UTCTimestamp,
} from "lightweight-charts";
import { useEffect, useMemo, useRef } from "react";
import { Card } from "@/components/ui/card";

interface PriceData {
  timestamp: string;
  buy_price: number;
  sell_price: number;
}

interface PriceChartProps {
  data: PriceData[];
  title: string;
}

export function PriceChart({ data, title }: PriceChartProps) {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const buySeriesRef = useRef<ISeriesApi<"Area"> | null>(null);
  const sellSeriesRef = useRef<ISeriesApi<"Area"> | null>(null);

  const chartData = useMemo(() => {
    return data.map((d) => ({
      time: Math.floor(new Date(d.timestamp).getTime() / 1000) as UTCTimestamp,
      buy: d.buy_price,
      sell: d.sell_price,
      spread: d.sell_price - d.buy_price,
    }));
  }, [data]);

  useEffect(() => {
    if (!chartContainerRef.current) return;

    const chart = createChart(chartContainerRef.current, {
      layout: {
        background: { color: "transparent" },
        textColor: "#9CA3AF",
        attributionLogo: false,
      },
      grid: {
        vertLines: { color: "#3F3F46", style: 1 },
        horzLines: { color: "#3F3F46", style: 1 },
      },
      width: chartContainerRef.current.clientWidth,
      height: 200,
      timeScale: {
        timeVisible: true,
        secondsVisible: false,
      },
      rightPriceScale: {
        borderColor: "#3F3F46",
      },
      crosshair: {
        mode: 1,
      },
    });

    const buySeries = chart.addSeries(AreaSeries, {
      topColor: "rgba(74, 158, 255, 0.56)",
      bottomColor: "rgba(74, 158, 255, 0.04)",
      lineColor: "#4A9EFF",
      lineWidth: 2,
    });

    const sellSeries = chart.addSeries(AreaSeries, {
      topColor: "rgba(0, 191, 174, 0.56)",
      bottomColor: "rgba(0, 191, 174, 0.04)",
      lineColor: "#00BFAE",
      lineWidth: 2,
    });

    chartRef.current = chart;
    buySeriesRef.current = buySeries;
    sellSeriesRef.current = sellSeries;

    const handleResize = () => {
      if (chartContainerRef.current) {
        chart.applyOptions({ width: chartContainerRef.current.clientWidth });
      }
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      chart.remove();
    };
  }, []);

  useEffect(() => {
    if (buySeriesRef.current && sellSeriesRef.current && chartData.length > 0) {
      const buyData = chartData.map((d) => ({ time: d.time, value: d.buy }));
      const sellData = chartData.map((d) => ({ time: d.time, value: d.sell }));

      buySeriesRef.current.setData(buyData);
      sellSeriesRef.current.setData(sellData);

      // Fit content
      if (chartRef.current) {
        chartRef.current.timeScale().fitContent();
      }
    }
  }, [chartData]);

  return (
    <Card className="p-3">
      <h3 className="text-xs font-semibold mb-2">{title}</h3>
      <div ref={chartContainerRef} className="w-full h-[200px]" />
      <div className="flex gap-4 mt-2 text-[10px]">
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-full bg-[#4A9EFF]" />
          <span className="text-muted-foreground">Buy Price</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-full bg-[#00BFAE]" />
          <span className="text-muted-foreground">Sell Price</span>
        </div>
      </div>
    </Card>
  );
}
