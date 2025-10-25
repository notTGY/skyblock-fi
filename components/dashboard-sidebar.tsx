"use client";

import { BarChart3, Coins, Package, TrendingUp } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const instruments = [
  { name: "Bazaar", icon: BarChart3, href: "/dashboard" },
  { name: "Futures", icon: TrendingUp, href: "/dashboard/futures" },
  { name: "Inventory", icon: Package, href: "/dashboard/inventory" },
  { name: "Portfolio", icon: Coins, href: "/dashboard/portfolio" },
];

export function DashboardSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-40 border-r border-border bg-sidebar flex flex-col">
      <div className="p-2 border-b border-sidebar-border">
        <h2 className="text-[10px] font-semibold text-sidebar-foreground uppercase tracking-wide">
          Instruments
        </h2>
      </div>
      <nav className="flex-1 p-1">
        {instruments.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center gap-2 px-2 py-1.5 text-[10px] rounded transition-colors mb-0.5",
                isActive
                  ? "bg-sidebar-accent text-sidebar-accent-foreground font-semibold"
                  : "text-sidebar-foreground hover:bg-sidebar-accent/50",
              )}
            >
              <Icon className="h-3 w-3" />
              {item.name}
            </Link>
          );
        })}
      </nav>
      <div className="p-2 border-t border-sidebar-border text-[9px] text-muted-foreground">
        <div>v1.0.0</div>
        <div className="mt-0.5">Data: Live</div>
      </div>
    </aside>
  );
}
