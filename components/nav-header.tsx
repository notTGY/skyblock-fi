import { BarChart3, BookOpen } from "lucide-react";
import Link from "next/link";

export function NavHeader() {
  return (
    <header className="border-b border-border bg-card">
      <div className="flex h-12 items-center gap-4 px-4">
        <div className="flex items-center gap-2">
          <BarChart3 className="h-4 w-4 text-primary" />
          <span className="text-sm font-semibold tracking-tight">
            SKYBLOCK.FIN
          </span>
        </div>
        <nav className="flex gap-1 text-xs">
          <Link
            href="/"
            className="px-3 py-1.5 rounded hover:bg-secondary transition-colors"
          >
            <BookOpen className="inline h-3 w-3 mr-1.5" />
            INFO
          </Link>
          <Link
            href="/dashboard"
            className="px-3 py-1.5 rounded hover:bg-secondary transition-colors"
          >
            <BarChart3 className="inline h-3 w-3 mr-1.5" />
            DASHBOARD
          </Link>
        </nav>
      </div>
    </header>
  );
}
