import { NavHeader } from "@/components/nav-header"
import { DashboardSidebar } from "@/components/dashboard-sidebar"
import { Card } from "@/components/ui/card"

export default function FuturesPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <NavHeader />
      <div className="flex flex-1">
        <DashboardSidebar />
        <main className="flex-1 p-3">
          <div className="mb-3">
            <h1 className="text-lg font-bold mb-1">Futures Trading</h1>
            <p className="text-[10px] text-muted-foreground">Derivative contracts and forward pricing</p>
          </div>
          <Card className="p-8 text-center">
            <p className="text-sm text-muted-foreground">Futures trading coming soon</p>
          </Card>
        </main>
      </div>
    </div>
  )
}
