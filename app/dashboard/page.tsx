"use client";

import { useQuery } from "@tanstack/react-query";
import Fuse from "fuse.js";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";

import { DashboardSidebar } from "@/components/dashboard-sidebar";
import { NavHeader } from "@/components/nav-header";
import { Card } from "@/components/ui/card";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyTitle,
} from "@/components/ui/empty";
import { Input } from "@/components/ui/input";
import { Kbd } from "@/components/ui/kbd";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface Item {
  id: string;
  name: string;
}

export default function DashboardPage() {
  const [items, setItems] = useState<Item[]>([]);
  const [commandOpen, setCommandOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const router = useRouter();
  const tableRef = useRef<HTMLTableElement>(null);

  const fuse = useMemo(() => new Fuse(items, { keys: ["name"], threshold: 0.3 }), [items]);

  // Fetch bazaar data
  const { data: bazaarData } = useQuery({
    queryKey: ["bazaar"],
    queryFn: async () => {
      const response = await fetch("/api/bazaar");
      return response.json();
    },
    refetchInterval: 5 * 60 * 1000, // 5 minutes for items
  });

  // Process items and labels
  useEffect(() => {
    if (bazaarData?.success) {
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
  }, [bazaarData]);

  const filteredItems = search ? fuse.search(search).map(result => result.item) : items;

  // Reset selected index when search changes
  useEffect(() => {
    setSelectedIndex(-1);
  }, [search]);

  // Scroll selected row into view
  useEffect(() => {
    if (selectedIndex >= 0 && tableRef.current) {
      const rows = tableRef.current.querySelectorAll("tbody tr");
      if (rows[selectedIndex]) {
        rows[selectedIndex].scrollIntoView({
          behavior: "smooth",
          block: "nearest",
        });
      }
    }
  }, [selectedIndex]);

  const isLoading = !bazaarData || items.length === 0;

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
            <Input
              type="text"
              placeholder="Search items..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => {
                if (filteredItems.length === 0) return;

                if (e.key === "ArrowDown") {
                  e.preventDefault();
                  setSelectedIndex((prev) => Math.min(prev + 1, filteredItems.length - 1));
                } else if (e.key === "ArrowUp") {
                  e.preventDefault();
                  setSelectedIndex((prev) => prev > 0 ? prev - 1 : -1);
                } else if (e.key === "Enter") {
                  e.preventDefault();
                  const index = selectedIndex >= 0 ? selectedIndex : 0;
                  if (filteredItems[index]) {
                    router.push(`/dashboard/${filteredItems[index].id}`);
                  }
                }
              }}
              className="h-8 text-xs"
              autoFocus
            />
          </div>

          <Card className="p-2">
            {isLoading ? (
              <Empty>
                <EmptyHeader>
                  <EmptyTitle>Loading market data...</EmptyTitle>
                  <EmptyDescription>
                    Fetching the latest bazaar prices and items.
                  </EmptyDescription>
                </EmptyHeader>
              </Empty>
            ) : filteredItems.length === 0 ? (
              <Empty>
                <EmptyHeader>
                  <EmptyTitle>No items found</EmptyTitle>
                  <EmptyDescription>
                    Try adjusting your search query.
                  </EmptyDescription>
                </EmptyHeader>
              </Empty>
            ) : (
              <Table ref={tableRef}>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-left">Item</TableHead>
                    <TableHead className="text-right">Buy Price</TableHead>
                    <TableHead className="text-right">Sell Price</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredItems.map((item, index) => {
                    const product = bazaarData?.products[item.id];
                    if (!product) return null;
                    const quickStatus = product.quick_status;
                    const buyPrice = quickStatus.buyPrice;
                    const sellPrice = quickStatus.sellPrice;
                    const isSelected = index === selectedIndex;
                    return (
                      <TableRow
                        key={item.id}
                        onClick={() => router.push(`/dashboard/${item.id}`)}
                        className={`cursor-pointer ${isSelected ? "bg-accent" : ""}`}
                      >
                        <TableCell>{item.name}</TableCell>
                        <TableCell className="text-right font-mono">
                          {buyPrice.toFixed(1)}
                        </TableCell>
                        <TableCell className="text-right font-mono">
                          {sellPrice.toFixed(1)}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            )}
          </Card>
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
                  router.push(`/dashboard/${item.id}`);
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
