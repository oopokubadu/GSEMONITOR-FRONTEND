import { DashboardLayout } from "@/components/dashboard-layout"
import { PortfolioContent } from "@/components/portfolio-content"

export default function PortfolioPage() {
  return (
    <DashboardLayout>
      {/* <div className="flex flex-col space-y-4 p-4 lg:p-6">
        <h1 className="text-2xl font-bold">Portfolio</h1>
        <p className="text-muted-foreground">Coming Soon...</p>
      </div> */}
      <PortfolioContent />
    </DashboardLayout>
  )
}
