import { BarChart3, BookOpen } from "lucide-react";
import Link from "next/link";
import { Kbd } from "@/components/ui/kbd";

export function NavHeader() {
  return (
    <header className="border-b border-border bg-card">
      <div className="flex h-10 items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <BarChart3 className="h-4 w-4 text-primary" />
          <span className="text-sm font-semibold tracking-tight">
            SKYBLOCK.FIN
          </span>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-[10px]">
            <div className="w-2 h-2 bg-chart-2 rounded-full animate-pulse"></div>
            <span className="text-muted-foreground">MARKET LIVE</span>
          </div>
          <nav className="flex gap-1 text-xs">
            <Link
              href="/"
              className="px-2 py-1 rounded hover:bg-secondary transition-colors flex items-center gap-1"
            >
              <BookOpen className="inline h-3 w-3" />
              INFO
              <Kbd className="text-[8px] h-4 px-1">i</Kbd>
            </Link>
            <Link
              href="/dashboard"
              className="px-2 py-1 rounded hover:bg-secondary transition-colors flex items-center gap-1"
            >
              <BarChart3 className="inline h-3 w-3" />
              DASHBOARD
              <Kbd className="text-[8px] h-4 px-1">d</Kbd>
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}
