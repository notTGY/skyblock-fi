"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { DashboardSidebar } from "@/components/dashboard-sidebar";
import { ItemSelector } from "@/components/item-selector";
import { LabelManager } from "@/components/label-manager";
import { NavHeader } from "@/components/nav-header";
import { PriceChart } from "@/components/price-chart";
import { SpreadChart } from "@/components/spread-chart";
import { StatCard } from "@/components/stat-card";
import { Card } from "@/components/ui/card";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Kbd } from "@/components/ui/kbd";
import { VolumeChart } from "@/components/volume-chart";

interface Label {
  id: number;
  name: string;
  color: string;
}

interface Item {
  id: string;
  name: string;
  labels?: Label[];
}

interface PriceData {
  timestamp: string;
  buy_price: number;
  sell_price: number;
  buy_orders: number;
  sell_orders: number;
  buy_volume: number;
  sell_volume: number;
}

export default function DashboardPage() {
  const [items, setItems] = useState<Item[]>([]);
  const [selectedItem, setSelectedItem] = useState<string | null>(null);
  const [priceData, setPriceData] = useState<PriceData[]>([]);
  const [availableLabels, setAvailableLabels] = useState<Label[]>([]);
  const [_loading, setLoading] = useState(false);
  const [commandOpen, setCommandOpen] = useState(false);
  const [itemsLoading, setItemsLoading] = useState(true);
  const router = useRouter();

  // Fetch real data from APIs
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch bazaar data to get all items
        const bazaarResponse = await fetch("/api/bazaar");
        const bazaarData = await bazaarResponse.json();

        if (bazaarData.success) {
          const productIds = Object.keys(bazaarData.products);
          const fetchedItems: Item[] = productIds.map((id) => ({
            id,
            name: id
              .replace(/_/g, " ")
              .toLowerCase()
              .replace(/\b\w/g, (l) => l.toUpperCase()),
          }));
          setItems(fetchedItems);
        }
        setItemsLoading(false);

        // Fetch labels
        const labelsResponse = await fetch("/api/labels");
        const labelsData = await labelsResponse.json();
        if (Array.isArray(labelsData)) {
          setAvailableLabels(labelsData);
        } else {
          console.error("Failed to fetch labels:", labelsData);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        setItemsLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Ignore if typing in input or textarea
      if (
        event.target instanceof HTMLInputElement ||
        event.target instanceof HTMLTextAreaElement
      ) {
        return;
      }

      const key = event.key;
      switch (key) {
        case "1":
          event.preventDefault();
          router.push("/dashboard");
          break;
        case "i":
          event.preventDefault();
          router.push("/");
          break;
        case "k":
          event.preventDefault();
          setCommandOpen(true);
          break;
        default:
          return;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [router]);

  useEffect(() => {
    if (selectedItem) {
      setLoading(true);
      // Ensure item is in database
      const currentItem = items.find((item) => item.id === selectedItem);
      if (currentItem) {
        fetch("/api/items", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: currentItem.id, name: currentItem.name }),
        }).catch((error) => console.error("Error adding item to db:", error));
      }

      // Fetch real price data from bazaar API
      fetch("/api/bazaar")
        .then((response) => response.json())
        .then((data) => {
          if (data.success && data.products[selectedItem]) {
            const quickStatus = data.products[selectedItem].quick_status;
            // Generate mock historical data based on current prices
            const baseBuyPrice = quickStatus.buyPrice;
            const baseSellPrice = quickStatus.sellPrice;
            const mockPrices: PriceData[] = Array.from(
              { length: 24 },
              (_, i) => ({
                timestamp: new Date(
                  Date.now() - (23 - i) * 3600000,
                ).toISOString(),
                buy_price:
                  baseBuyPrice + (Math.random() - 0.5) * baseBuyPrice * 0.1,
                sell_price:
                  baseSellPrice + (Math.random() - 0.5) * baseSellPrice * 0.1,
                buy_orders: quickStatus.buyOrders,
                sell_orders: quickStatus.sellOrders,
                buy_volume: quickStatus.buyVolume,
                sell_volume: quickStatus.sellVolume,
              }),
            );
            setPriceData(mockPrices);
          }
        })
        .catch((error) => console.error("Error fetching price data:", error))
        .finally(() => setLoading(false));
    }
  }, [selectedItem, items]);

  const handleAddLabel = (labelId: number) => {
    if (!selectedItem) return;

    // In production, call API
    console.log("[v0] Adding label", labelId, "to item", selectedItem);

    setItems((prev) =>
      prev.map((item) => {
        if (item.id === selectedItem) {
          const label = availableLabels.find((l) => l.id === labelId);
          if (label && !item.labels?.some((l) => l.id === labelId)) {
            return { ...item, labels: [...(item.labels || []), label] };
          }
        }
        return item;
      }),
    );
  };

  const handleRemoveLabel = (labelId: number) => {
    if (!selectedItem) return;

    // In production, call API
    console.log("[v0] Removing label", labelId, "from item", selectedItem);

    setItems((prev) =>
      prev.map((item) => {
        if (item.id === selectedItem) {
          return {
            ...item,
            labels: item.labels?.filter((l) => l.id !== labelId) || [],
          };
        }
        return item;
      }),
    );
  };

  const currentItem = items.find((item) => item.id === selectedItem);
  const latestPrice = priceData[priceData.length - 1];
  const previousPrice = priceData[priceData.length - 2];

  const buyChange =
    latestPrice && previousPrice
      ? ((latestPrice.buy_price - previousPrice.buy_price) /
          previousPrice.buy_price) *
        100
      : 0;
  const sellChange =
    latestPrice && previousPrice
      ? ((latestPrice.sell_price - previousPrice.sell_price) /
          previousPrice.sell_price) *
        100
      : 0;
  const spread = latestPrice
    ? latestPrice.sell_price - latestPrice.buy_price
    : 0;
  const spreadPercent = latestPrice
    ? (spread / latestPrice.buy_price) * 100
    : 0;

  return (
    <div className="min-h-screen flex flex-col">
      <NavHeader />
      <div className="flex flex-1">
        <DashboardSidebar />
        <main className="flex-1 p-2 overflow-auto">
          <div className="mb-2">
            <h1 className="text-sm font-semibold mb-1 uppercase tracking-wide">
              Bazaar Terminal
            </h1>
            <p className="text-[9px] text-muted-foreground">
              Real-time market data & analytics
            </p>
          </div>

          <div className="mb-2">
            <ItemSelector
              items={items}
              selectedItem={selectedItem}
              onSelectItem={setSelectedItem}
              loading={itemsLoading}
            />
          </div>

          {selectedItem && currentItem ? (
            <div className="space-y-2">
              <div>
                <h2 className="text-sm font-semibold mb-1 uppercase tracking-wide">
                  {currentItem.name}
                </h2>
                <LabelManager
                  itemId={currentItem.id}
                  currentLabels={currentItem.labels || []}
                  availableLabels={availableLabels}
                  onAddLabel={handleAddLabel}
                  onRemoveLabel={handleRemoveLabel}
                />
              </div>

              <div className="grid grid-cols-6 gap-1">
                <StatCard
                  label="BUY PRICE"
                  value={
                    latestPrice ? `${latestPrice.buy_price.toFixed(1)}` : "—"
                  }
                  change={buyChange}
                />
                <StatCard
                  label="SELL PRICE"
                  value={
                    latestPrice ? `${latestPrice.sell_price.toFixed(1)}` : "—"
                  }
                  change={sellChange}
                />
                <StatCard
                  label="SPREAD"
                  value={latestPrice ? `${spread.toFixed(1)}` : "—"}
                />
                <StatCard
                  label="SPREAD %"
                  value={latestPrice ? `${spreadPercent.toFixed(2)}%` : "—"}
                />
                <StatCard
                  label="BUY ORDERS"
                  value={latestPrice ? latestPrice.buy_orders : "—"}
                />
                <StatCard
                  label="SELL ORDERS"
                  value={latestPrice ? latestPrice.sell_orders : "—"}
                />
              </div>

              <div className="grid grid-cols-2 gap-1">
                <PriceChart data={priceData} title="Price History (24h)" />
                <div className="space-y-1">
                  <VolumeChart data={priceData} title="Trading Volume" />
                  <SpreadChart data={priceData} title="Spread Analysis" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-1">
                <Card className="p-2">
                  <h3 className="text-[10px] font-semibold mb-1 uppercase tracking-wide">
                    Order Book Summary
                  </h3>
                  <div className="space-y-1.5 text-[11px]">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">
                        Buy Volume (24h)
                      </span>
                      <span className="font-mono">
                        {latestPrice
                          ? latestPrice.buy_volume.toLocaleString()
                          : "—"}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">
                        Sell Volume (24h)
                      </span>
                      <span className="font-mono">
                        {latestPrice
                          ? latestPrice.sell_volume.toLocaleString()
                          : "—"}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">
                        Total Volume
                      </span>
                      <span className="font-mono">
                        {latestPrice
                          ? (
                              latestPrice.buy_volume + latestPrice.sell_volume
                            ).toLocaleString()
                          : "—"}
                      </span>
                    </div>
                    <div className="flex justify-between pt-1 border-t border-border">
                      <span className="text-muted-foreground">
                        Liquidity Score
                      </span>
                      <span className="font-mono text-chart-3">High</span>
                    </div>
                  </div>
                </Card>

                <Card className="p-2">
                  <h3 className="text-[10px] font-semibold mb-1 uppercase tracking-wide">
                    Market Metrics
                  </h3>
                  <div className="space-y-1.5 text-[11px]">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">24h High</span>
                      <span className="font-mono">
                        {latestPrice
                          ? (latestPrice.sell_price * 1.05).toFixed(1)
                          : "—"}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">24h Low</span>
                      <span className="font-mono">
                        {latestPrice
                          ? (latestPrice.buy_price * 0.95).toFixed(1)
                          : "—"}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Volatility</span>
                      <span className="font-mono">2.3%</span>
                    </div>
                    <div className="flex justify-between pt-1 border-t border-border">
                      <span className="text-muted-foreground">
                        Market Depth
                      </span>
                      <span className="font-mono text-chart-1">Medium</span>
                    </div>
                  </div>
                </Card>
              </div>

              <Card className="p-2">
                <h3 className="text-[10px] font-semibold mb-1 uppercase tracking-wide">
                  Recent Transactions
                </h3>
                <div className="space-y-1">
                  <div className="grid grid-cols-4 gap-2 text-[10px] text-muted-foreground pb-1 border-b border-border">
                    <div>TIME</div>
                    <div>TYPE</div>
                    <div className="text-right">PRICE</div>
                    <div className="text-right">AMOUNT</div>
                  </div>
                  {[...Array(8)]
                    .map((_, i) => i)
                    .map((i) => (
                      <div
                        key={i}
                        className="grid grid-cols-4 gap-2 text-[11px] font-mono"
                      >
                        <div className="text-muted-foreground">
                          {new Date(
                            Date.now() - i * 30000,
                          ).toLocaleTimeString()}
                        </div>
                        <div
                          className={
                            i % 2 === 0 ? "text-chart-3" : "text-destructive"
                          }
                        >
                          {i % 2 === 0 ? "BUY" : "SELL"}
                        </div>
                        <div className="text-right">
                          {latestPrice
                            ? (
                                latestPrice.buy_price +
                                Math.random() * 50
                              ).toFixed(1)
                            : "—"}
                        </div>
                        <div className="text-right">
                          {Math.floor(Math.random() * 100)}
                        </div>
                      </div>
                    ))}
                </div>
              </Card>
            </div>
          ) : (
            <Card className="p-4 text-center">
              <p className="text-xs text-muted-foreground uppercase tracking-wide">
                Select an item to view market data
              </p>
            </Card>
          )}
        </main>
      </div>
      <CommandDialog open={commandOpen} onOpenChange={setCommandOpen}>
        <CommandInput placeholder="Type a command or search..." />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandGroup heading="Navigation">
            <CommandItem
              onSelect={() => {
                router.push("/");
                setCommandOpen(false);
              }}
            >
              Info
              <Kbd className="ml-auto">i</Kbd>
            </CommandItem>
            <CommandItem
              onSelect={() => {
                router.push("/dashboard");
                setCommandOpen(false);
              }}
            >
              Bazaar
              <Kbd className="ml-auto">1</Kbd>
            </CommandItem>
          </CommandGroup>
          <CommandGroup heading="Items">
            {items.map((item) => (
              <CommandItem
                key={item.id}
                onSelect={() => {
                  setSelectedItem(item.id);
                  setCommandOpen(false);
                }}
              >
                {item.name}
              </CommandItem>
            ))}
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </div>
  );
}
