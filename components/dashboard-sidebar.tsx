"use client"

import { BarChart3, TrendingUp, Package, Coins } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"

const instruments = [
  { name: "Bazaar", icon: BarChart3, href: "/dashboard" },
  { name: "Futures", icon: TrendingUp, href: "/dashboard/futures" },
  { name: "Inventory", icon: Package, href: "/dashboard/inventory" },
  { name: "Portfolio", icon: Coins, href: "/dashboard/portfolio" },
]

export function DashboardSidebar() {
  const pathname = usePathname()

  return (
    <aside className="w-48 border-r border-border bg-sidebar flex flex-col">
      <div className="p-3 border-b border-sidebar-border">
        <h2 className="text-xs font-semibold text-sidebar-foreground">INSTRUMENTS</h2>
      </div>
      <nav className="flex-1 p-2">
        {instruments.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center gap-2 px-3 py-2 text-xs rounded transition-colors mb-1",
                isActive
                  ? "bg-sidebar-accent text-sidebar-accent-foreground font-semibold"
                  : "text-sidebar-foreground hover:bg-sidebar-accent/50",
              )}
            >
              <Icon className="h-3.5 w-3.5" />
              {item.name}
            </Link>
          )
        })}
      </nav>
      <div className="p-3 border-t border-sidebar-border text-[10px] text-muted-foreground">
        <div>v1.0.0</div>
        <div className="mt-1">Market Data: Live</div>
      </div>
    </aside>
  )
}
