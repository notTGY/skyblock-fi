"use client"

import { useState, useEffect } from "react"
import { NavHeader } from "@/components/nav-header"
import { DashboardSidebar } from "@/components/dashboard-sidebar"
import { ItemSelector } from "@/components/item-selector"
import { StatCard } from "@/components/stat-card"
import { PriceChart } from "@/components/price-chart"
import { VolumeChart } from "@/components/volume-chart"
import { SpreadChart } from "@/components/spread-chart"
import { LabelManager } from "@/components/label-manager"
import { Card } from "@/components/ui/card"

interface Label {
  id: number
  name: string
  color: string
}

interface Item {
  id: string
  name: string
  labels?: Label[]
}

interface PriceData {
  timestamp: string
  buy_price: number
  sell_price: number
  buy_orders: number
  sell_orders: number
  buy_volume: number
  sell_volume: number
}

export default function DashboardPage() {
  const [items, setItems] = useState<Item[]>([])
  const [selectedItem, setSelectedItem] = useState<string | null>(null)
  const [priceData, setPriceData] = useState<PriceData[]>([])
  const [availableLabels, setAvailableLabels] = useState<Label[]>([])
  const [loading, setLoading] = useState(false)

  // Mock data for demonstration
  useEffect(() => {
    // In production, fetch from API
    const mockLabels: Label[] = [
      { id: 1, name: "Commodities", color: "#10b981" },
      { id: 2, name: "Goods", color: "#3b82f6" },
      { id: 3, name: "Materials", color: "#f59e0b" },
      { id: 4, name: "Consumables", color: "#ef4444" },
      { id: 5, name: "Rare", color: "#8b5cf6" },
      { id: 6, name: "Volatile", color: "#ec4899" },
    ]
    setAvailableLabels(mockLabels)

    const mockItems: Item[] = [
      {
        id: "ENCHANTED_DIAMOND",
        name: "Enchanted Diamond",
        labels: [{ id: 1, name: "Commodities", color: "#10b981" }],
      },
      { id: "ENCHANTED_GOLD", name: "Enchanted Gold", labels: [{ id: 1, name: "Commodities", color: "#10b981" }] },
      { id: "ENCHANTED_IRON", name: "Enchanted Iron", labels: [{ id: 2, name: "Goods", color: "#3b82f6" }] },
      { id: "WHEAT", name: "Wheat", labels: [{ id: 3, name: "Materials", color: "#f59e0b" }] },
      { id: "CARROT", name: "Carrot", labels: [{ id: 3, name: "Materials", color: "#f59e0b" }] },
    ]
    setItems(mockItems)
  }, [])

  useEffect(() => {
    if (selectedItem) {
      setLoading(true)
      // Mock price data
      const mockPrices: PriceData[] = Array.from({ length: 24 }, (_, i) => ({
        timestamp: new Date(Date.now() - (23 - i) * 3600000).toISOString(),
        buy_price: 1000 + Math.random() * 200,
        sell_price: 1100 + Math.random() * 200,
        buy_orders: Math.floor(Math.random() * 100),
        sell_orders: Math.floor(Math.random() * 100),
        buy_volume: Math.floor(Math.random() * 10000),
        sell_volume: Math.floor(Math.random() * 10000),
      }))
      setPriceData(mockPrices)
      setLoading(false)
    }
  }, [selectedItem])

  const handleAddLabel = (labelId: number) => {
    if (!selectedItem) return

    // In production, call API
    console.log("[v0] Adding label", labelId, "to item", selectedItem)

    setItems((prev) =>
      prev.map((item) => {
        if (item.id === selectedItem) {
          const label = availableLabels.find((l) => l.id === labelId)
          if (label && !item.labels?.some((l) => l.id === labelId)) {
            return { ...item, labels: [...(item.labels || []), label] }
          }
        }
        return item
      }),
    )
  }

  const handleRemoveLabel = (labelId: number) => {
    if (!selectedItem) return

    // In production, call API
    console.log("[v0] Removing label", labelId, "from item", selectedItem)

    setItems((prev) =>
      prev.map((item) => {
        if (item.id === selectedItem) {
          return { ...item, labels: item.labels?.filter((l) => l.id !== labelId) || [] }
        }
        return item
      }),
    )
  }

  const currentItem = items.find((item) => item.id === selectedItem)
  const latestPrice = priceData[priceData.length - 1]
  const previousPrice = priceData[priceData.length - 2]

  const buyChange =
    latestPrice && previousPrice
      ? ((latestPrice.buy_price - previousPrice.buy_price) / previousPrice.buy_price) * 100
      : 0
  const sellChange =
    latestPrice && previousPrice
      ? ((latestPrice.sell_price - previousPrice.sell_price) / previousPrice.sell_price) * 100
      : 0
  const spread = latestPrice ? latestPrice.sell_price - latestPrice.buy_price : 0
  const spreadPercent = latestPrice ? (spread / latestPrice.buy_price) * 100 : 0

  return (
    <div className="min-h-screen flex flex-col">
      <NavHeader />
      <div className="flex flex-1">
        <DashboardSidebar />
        <main className="flex-1 p-3 overflow-auto">
          <div className="mb-3">
            <h1 className="text-lg font-bold mb-1">Bazaar Terminal</h1>
            <p className="text-[10px] text-muted-foreground">Real-time market data and order book analytics</p>
          </div>

          <div className="mb-3">
            <ItemSelector items={items} selectedItem={selectedItem} onSelectItem={setSelectedItem} />
          </div>

          {selectedItem && currentItem ? (
            <div className="space-y-3">
              <div>
                <h2 className="text-base font-semibold mb-2">{currentItem.name}</h2>
                <LabelManager
                  itemId={currentItem.id}
                  currentLabels={currentItem.labels || []}
                  availableLabels={availableLabels}
                  onAddLabel={handleAddLabel}
                  onRemoveLabel={handleRemoveLabel}
                />
              </div>

              <div className="grid grid-cols-6 gap-2">
                <StatCard
                  label="BUY PRICE"
                  value={latestPrice ? `${latestPrice.buy_price.toFixed(1)}` : "—"}
                  change={buyChange}
                />
                <StatCard
                  label="SELL PRICE"
                  value={latestPrice ? `${latestPrice.sell_price.toFixed(1)}` : "—"}
                  change={sellChange}
                />
                <StatCard label="SPREAD" value={latestPrice ? `${spread.toFixed(1)}` : "—"} />
                <StatCard label="SPREAD %" value={latestPrice ? `${spreadPercent.toFixed(2)}%` : "—"} />
                <StatCard label="BUY ORDERS" value={latestPrice ? latestPrice.buy_orders : "—"} />
                <StatCard label="SELL ORDERS" value={latestPrice ? latestPrice.sell_orders : "—"} />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <PriceChart data={priceData} title="Price History (24h)" />
                <div className="space-y-2">
                  <VolumeChart data={priceData} title="Trading Volume" />
                  <SpreadChart data={priceData} title="Spread Analysis" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <Card className="p-3">
                  <h3 className="text-xs font-semibold mb-2">Order Book Summary</h3>
                  <div className="space-y-1.5 text-[11px]">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Buy Volume (24h)</span>
                      <span className="font-mono">{latestPrice ? latestPrice.buy_volume.toLocaleString() : "—"}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Sell Volume (24h)</span>
                      <span className="font-mono">{latestPrice ? latestPrice.sell_volume.toLocaleString() : "—"}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Total Volume</span>
                      <span className="font-mono">
                        {latestPrice ? (latestPrice.buy_volume + latestPrice.sell_volume).toLocaleString() : "—"}
                      </span>
                    </div>
                    <div className="flex justify-between pt-1 border-t border-border">
                      <span className="text-muted-foreground">Liquidity Score</span>
                      <span className="font-mono text-chart-3">High</span>
                    </div>
                  </div>
                </Card>

                <Card className="p-3">
                  <h3 className="text-xs font-semibold mb-2">Market Metrics</h3>
                  <div className="space-y-1.5 text-[11px]">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">24h High</span>
                      <span className="font-mono">
                        {latestPrice ? (latestPrice.sell_price * 1.05).toFixed(1) : "—"}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">24h Low</span>
                      <span className="font-mono">{latestPrice ? (latestPrice.buy_price * 0.95).toFixed(1) : "—"}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Volatility</span>
                      <span className="font-mono">2.3%</span>
                    </div>
                    <div className="flex justify-between pt-1 border-t border-border">
                      <span className="text-muted-foreground">Market Depth</span>
                      <span className="font-mono text-chart-1">Medium</span>
                    </div>
                  </div>
                </Card>
              </div>

              <Card className="p-3">
                <h3 className="text-xs font-semibold mb-2">Recent Transactions</h3>
                <div className="space-y-1">
                  <div className="grid grid-cols-4 gap-2 text-[10px] text-muted-foreground pb-1 border-b border-border">
                    <div>TIME</div>
                    <div>TYPE</div>
                    <div className="text-right">PRICE</div>
                    <div className="text-right">AMOUNT</div>
                  </div>
                  {[...Array(8)].map((_, i) => (
                    <div key={i} className="grid grid-cols-4 gap-2 text-[11px] font-mono">
                      <div className="text-muted-foreground">
                        {new Date(Date.now() - i * 30000).toLocaleTimeString()}
                      </div>
                      <div className={i % 2 === 0 ? "text-chart-3" : "text-destructive"}>
                        {i % 2 === 0 ? "BUY" : "SELL"}
                      </div>
                      <div className="text-right">
                        {latestPrice ? (latestPrice.buy_price + Math.random() * 50).toFixed(1) : "—"}
                      </div>
                      <div className="text-right">{Math.floor(Math.random() * 100)}</div>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          ) : (
            <Card className="p-8 text-center">
              <p className="text-sm text-muted-foreground">Select an item to view market data</p>
            </Card>
          )}
        </main>
      </div>
    </div>
  )
}
