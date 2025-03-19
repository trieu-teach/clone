"use client"
import Link from "next/link"
import { redirect, usePathname } from "next/navigation"
import { BarChart3, Users, CreditCard, Settings, HelpCircle, LayoutDashboard, LogOut, UserCircle } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { AdminSidebarProps } from "@next-server-actions/types"
import { signOut } from "next-auth/react"


export function AdminSidebar({ adminSidebarProps, userName, role }: { adminSidebarProps: AdminSidebarProps[], userName: string, role: string }) {
  const pathname = usePathname()

  const routes = adminSidebarProps

  return (
    <Sidebar>
      <SidebarHeader className="border-b">
        <div className="flex items-center gap-2 px-4 py-2">
          <Avatar className="h-8 w-8">
            <AvatarImage src="/placeholder.svg?height=32&width=32" alt="Avatar" />
            <AvatarFallback>AC</AvatarFallback>
          </Avatar>
          <div className="grid gap-0.5">
            <div className="font-medium">{userName}</div>
            <div className="text-xs text-muted-foreground">{role}</div>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent className="p-2">
        <SidebarMenu>
          {routes.map((route) => (
            <SidebarMenuItem key={route.href}>
              <SidebarMenuButton asChild isActive={pathname === route.href}>
                <Link href={route.href}>
                  <route.icon className="h-5 w-5" />
                  <span>{route.title}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter className="border-t p-2">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <Link href="/dashboard/help">
                <HelpCircle className="h-5 w-5" />
                <span>Help & Support</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <Link href={"#"} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              onClick={() => {
                signOut({ redirect: false }).then(() => {
                  redirect("/staff/login")
                });
              }}
            >
              <SidebarMenuButton>
                <LogOut className="h-5 w-5" />
                <span>Đăng xuất</span>
              </SidebarMenuButton>
            </Link>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <div className="absolute right-4 top-4 md:hidden">
        <SidebarTrigger />
      </div>
    </Sidebar>
  )
}

