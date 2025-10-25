"use client";

import {
  createChart,
  HistogramSeries,
  type IChartApi,
  type ISeriesApi,
  type UTCTimestamp,
} from "lightweight-charts";
import { useEffect, useMemo, useRef } from "react";
import { Card } from "@/components/ui/card";

interface VolumeData {
  timestamp: string;
  buy_volume: number;
  sell_volume: number;
}

interface VolumeChartProps {
  data: VolumeData[];
  title: string;
}

export function VolumeChart({ data, title }: VolumeChartProps) {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const buySeriesRef = useRef<ISeriesApi<"Histogram"> | null>(null);
  const sellSeriesRef = useRef<ISeriesApi<"Histogram"> | null>(null);

  const chartData = useMemo(() => {
    return data.map((d) => ({
      time: Math.floor(new Date(d.timestamp).getTime() / 1000) as UTCTimestamp,
      buyVol: d.buy_volume,
      sellVol: d.sell_volume,
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
      height: 150,
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

    const buySeries = chart.addSeries(HistogramSeries, {
      color: "#FFD700",
      priceFormat: {
        type: "volume",
      },
    });

    const sellSeries = chart.addSeries(HistogramSeries, {
      color: "#FF69B4",
      priceFormat: {
        type: "volume",
      },
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
      const buyData = chartData.map((d) => ({ time: d.time, value: d.buyVol }));
      const sellData = chartData.map((d) => ({
        time: d.time,
        value: d.sellVol,
      }));

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
      <div ref={chartContainerRef} className="w-full h-[150px]" />
      <div className="flex gap-4 mt-2 text-[10px]">
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-full bg-[#FFD700]" />
          <span className="text-muted-foreground">Buy Volume</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-full bg-[#FF69B4]" />
          <span className="text-muted-foreground">Sell Volume</span>
        </div>
      </div>
    </Card>
  );
}
