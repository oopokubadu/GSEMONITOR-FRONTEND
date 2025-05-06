import { DashboardLayout } from "@/components/dashboard-layout"

export default function ProfilePage() {
  return (
    <DashboardLayout>
      <div className="flex flex-col space-y-4 p-4 lg:p-6">
        <h1 className="text-2xl font-bold">Profile</h1>
        <p className="text-muted-foreground">Your profile page is under construction.</p>
      </div>
    </DashboardLayout>
  )
}
