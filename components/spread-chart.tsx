"use client"

import { useMemo } from "react"
import { Line, LineChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"
import { Card } from "@/components/ui/card"

interface SpreadData {
  timestamp: string
  buy_price: number
  sell_price: number
}

interface SpreadChartProps {
  data: SpreadData[]
  title: string
}

export function SpreadChart({ data, title }: SpreadChartProps) {
  const chartData = useMemo(() => {
    return data.map((d) => ({
      time: new Date(d.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      spread: d.sell_price - d.buy_price,
      spreadPercent: ((d.sell_price - d.buy_price) / d.buy_price) * 100,
    }))
  }, [data])

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-card border border-border p-2 text-[10px] font-mono">
          <div className="text-muted-foreground mb-1">{payload[0].payload.time}</div>
          <div className="text-chart-4">Spread: {payload[0].value.toFixed(2)}</div>
          <div className="text-muted-foreground">{payload[0].payload.spreadPercent.toFixed(2)}%</div>
        </div>
      )
    }
    return null
  }

  return (
    <Card className="p-3">
      <h3 className="text-xs font-semibold mb-2">{title}</h3>
      <ResponsiveContainer width="100%" height={120}>
        <LineChart data={chartData} margin={{ top: 5, right: 5, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
          <XAxis dataKey="time" tick={{ fontSize: 9, fill: "hsl(var(--muted-foreground))" }} tickLine={false} />
          <YAxis tick={{ fontSize: 9, fill: "hsl(var(--muted-foreground))" }} tickLine={false} width={40} />
          <Tooltip content={<CustomTooltip />} />
          <Line type="monotone" dataKey="spread" stroke="hsl(var(--chart-4))" strokeWidth={2} dot={false} />
        </LineChart>
      </ResponsiveContainer>
      <div className="flex gap-4 mt-2 text-[10px]">
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-full bg-chart-4" />
          <span className="text-muted-foreground">Bid-Ask Spread</span>
        </div>
      </div>
    </Card>
  )
}
