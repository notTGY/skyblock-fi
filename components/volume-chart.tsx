"use client";

import { useMemo } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
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

interface VolumeTooltipProps {
  active?: boolean;
  payload?: Array<{
    value: number;
    payload: {
      time: string;
      buyVol: number;
      sellVol: number;
    };
  }>;
}

export function VolumeChart({ data, title }: VolumeChartProps) {
  const chartData = useMemo(() => {
    return data.map((d) => ({
      time: new Date(d.timestamp).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
      buyVol: d.buy_volume,
      sellVol: d.sell_volume,
    }));
  }, [data]);

  const CustomTooltip = ({ active, payload }: VolumeTooltipProps) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-card border border-border p-2 text-[10px] font-mono">
          <div className="text-muted-foreground mb-1">
            {payload[0].payload.time}
          </div>
          <div className="text-chart-3">
            Buy Vol: {payload[0].value.toLocaleString()}
          </div>
          <div className="text-chart-5">
            Sell Vol: {payload[1].value.toLocaleString()}
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <Card className="p-3">
      <h3 className="text-xs font-semibold mb-2">{title}</h3>
      <ResponsiveContainer width="100%" height={150}>
        <BarChart
          data={chartData}
          margin={{ top: 5, right: 5, left: 0, bottom: 0 }}
        >
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="hsl(var(--border))"
            opacity={0.3}
          />
          <XAxis
            dataKey="time"
            tick={{ fontSize: 9, fill: "hsl(var(--muted-foreground))" }}
            tickLine={false}
          />
          <YAxis
            tick={{ fontSize: 9, fill: "hsl(var(--muted-foreground))" }}
            tickLine={false}
            width={40}
          />
          <Tooltip content={<CustomTooltip />} />
          <Bar
            dataKey="buyVol"
            fill="hsl(var(--chart-3))"
            radius={[2, 2, 0, 0]}
          />
          <Bar
            dataKey="sellVol"
            fill="hsl(var(--chart-5))"
            radius={[2, 2, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
      <div className="flex gap-4 mt-2 text-[10px]">
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-full bg-chart-3" />
          <span className="text-muted-foreground">Buy Volume</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-full bg-chart-5" />
          <span className="text-muted-foreground">Sell Volume</span>
        </div>
      </div>
    </Card>
  );
}
