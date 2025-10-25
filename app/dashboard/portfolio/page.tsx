import { NavHeader } from "@/components/nav-header"
import { DashboardSidebar } from "@/components/dashboard-sidebar"
import { Card } from "@/components/ui/card"

export default function PortfolioPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <NavHeader />
      <div className="flex flex-1">
        <DashboardSidebar />
        <main className="flex-1 p-3">
          <div className="mb-3">
            <h1 className="text-lg font-bold mb-1">Portfolio Analytics</h1>
            <p className="text-[10px] text-muted-foreground">Performance metrics and risk analysis</p>
          </div>
          <Card className="p-8 text-center">
            <p className="text-sm text-muted-foreground">Portfolio analytics coming soon</p>
          </Card>
        </main>
      </div>
    </div>
  )
}
