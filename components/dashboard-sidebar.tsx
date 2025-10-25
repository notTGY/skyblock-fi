"use client";

import { BarChart3 } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Kbd } from "@/components/ui/kbd";
import { cn } from "@/lib/utils";

const instruments = [
  { name: "Bazaar", icon: BarChart3, href: "/dashboard", hotkey: "1" },
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
              <span className="flex-1">{item.name}</span>
              <Kbd className="text-[8px] h-4 px-1">{item.hotkey}</Kbd>
            </Link>
          );
        })}
      </nav>
      <div className="p-2 border-t border-sidebar-border text-[9px] text-muted-foreground">
        <div>v1.0.0</div>
        <div className="mt-0.5">Data: Live</div>
        <div className="mt-0.5 flex items-center gap-1">
          Cmd: <Kbd className="text-[8px] h-4 px-1">k</Kbd>
        </div>
      </div>
    </aside>
  );
}
