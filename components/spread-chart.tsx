"use client";

import {
  createChart,
  type IChartApi,
  type ISeriesApi,
  LineSeries,
  type UTCTimestamp,
} from "lightweight-charts";
import { useEffect, useMemo, useRef } from "react";
import { Card } from "@/components/ui/card";

interface SpreadData {
  timestamp: string;
  buy_price: number;
  sell_price: number;
}

interface SpreadChartProps {
  data: SpreadData[];
  title: string;
}

export function SpreadChart({ data, title }: SpreadChartProps) {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const spreadSeriesRef = useRef<ISeriesApi<"Line"> | null>(null);

  const chartData = useMemo(() => {
    return data.map((d) => ({
      time: Math.floor(new Date(d.timestamp).getTime() / 1000) as UTCTimestamp,
      spread: d.sell_price - d.buy_price,
      spreadPercent: ((d.sell_price - d.buy_price) / d.buy_price) * 100,
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
      height: 120,
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

    const spreadSeries = chart.addSeries(LineSeries, {
      color: "#8A2BE2",
      lineWidth: 2,
      priceFormat: {
        type: "price",
        precision: 2,
        minMove: 0.01,
      },
    });

    chartRef.current = chart;
    spreadSeriesRef.current = spreadSeries;

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
    if (spreadSeriesRef.current && chartData.length > 0) {
      const spreadData = chartData.map((d) => ({
        time: d.time,
        value: d.spread,
      }));
      spreadSeriesRef.current.setData(spreadData);

      // Fit content
      if (chartRef.current) {
        chartRef.current.timeScale().fitContent();
      }
    }
  }, [chartData]);

  return (
    <Card className="p-3">
      <h3 className="text-xs font-semibold mb-2">{title}</h3>
      <div ref={chartContainerRef} className="w-full h-[120px]" />
      <div className="flex gap-4 mt-2 text-[10px]">
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-full bg-[#8A2BE2]" />
          <span className="text-muted-foreground">Bid-Ask Spread</span>
        </div>
      </div>
    </Card>
  );
}
