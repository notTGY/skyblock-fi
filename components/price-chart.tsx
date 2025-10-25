"use client";

import { useMemo } from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
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

interface PriceTooltipProps {
  active?: boolean;
  payload?: Array<{
    value: number;
    payload: {
      time: string;
      buy: number;
      sell: number;
      spread: number;
    };
  }>;
}

export function PriceChart({ data, title }: PriceChartProps) {
  const chartData = useMemo(() => {
    return data.map((d) => ({
      time: new Date(d.timestamp).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
      buy: d.buy_price,
      sell: d.sell_price,
      spread: d.sell_price - d.buy_price,
    }));
  }, [data]);

  const CustomTooltip = ({ active, payload }: PriceTooltipProps) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-card border border-border p-2 text-[10px] font-mono">
          <div className="text-muted-foreground mb-1">
            {payload[0].payload.time}
          </div>
          <div className="text-chart-1">Buy: {payload[0].value.toFixed(2)}</div>
          <div className="text-chart-2">
            Sell: {payload[1].value.toFixed(2)}
          </div>
          <div className="text-muted-foreground">
            Spread: {payload[0].payload.spread.toFixed(2)}
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <Card className="p-3">
      <h3 className="text-xs font-semibold mb-2">{title}</h3>
      <ResponsiveContainer width="100%" height={200}>
        <AreaChart
          data={chartData}
          margin={{ top: 5, right: 5, left: 0, bottom: 0 }}
        >
          <defs>
            <linearGradient id="colorBuy" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#4A9EFF" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#4A9EFF" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="colorSell" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#00BFAE" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#00BFAE" stopOpacity={0} />
            </linearGradient>
          </defs>
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
          <Area
            type="monotone"
            dataKey="buy"
            stroke="#4A9EFF"
            fillOpacity={1}
            fill="url(#colorBuy)"
            strokeWidth={1.5}
          />
          <Area
            type="monotone"
            dataKey="sell"
            stroke="#00BFAE"
            fillOpacity={1}
            fill="url(#colorSell)"
            strokeWidth={1.5}
          />
        </AreaChart>
      </ResponsiveContainer>
      <div className="flex gap-4 mt-2 text-[10px]">
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-full bg-chart-1" />
          <span className="text-muted-foreground">Buy Price</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-full bg-chart-2" />
          <span className="text-muted-foreground">Sell Price</span>
        </div>
      </div>
    </Card>
  );
}
