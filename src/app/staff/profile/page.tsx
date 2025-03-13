import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { DashboardHeader } from "@/components/staff/dashboard-header"
import { ProfileForm } from "@/components/staff/profile-form"

export default function ProfilePage() {
  return (
    <div className="flex-1">
      {/* Full-width background that spans the entire screen */}
      <div className="w-full bg-muted/30 min-h-screen pb-12">
        <div className="p-4 md:p-8 pt-6 max-w-5xl mx-auto">
          <DashboardHeader heading="Personal Information" text="Update your personal details and profile settings" />

          <div className="mt-8">
            <Card className="border-none shadow-sm">
              <CardHeader>
                <CardTitle>Profile Details</CardTitle>
                <CardDescription>Update your profile information and manage your account settings</CardDescription>
              </CardHeader>
              <CardContent>
                <ProfileForm />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

