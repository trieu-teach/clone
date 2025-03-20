"use client"
import { AdminSidebarProps, SessionStaff, } from "@next-server-actions/types"
import { LayoutDashboard, Users, BarChart3, CreditCard, UserCircle, Settings, HandPlatter } from "lucide-react"
import { useSession } from "next-auth/react"
import { AdminSidebar } from "./admin-sidebar"
import { useMemo } from "react";

const staffSidebarProps: AdminSidebarProps[] = [
    {
        title: "Profile",
        href: "/staff/profile",
        icon: UserCircle,
    },
    {
        title: "Customer Management",
        href: "/staff/customer-management",
        icon: Users,
    },
    {
        title: "Product Management",
        href: "/staff/product-management",
        icon: LayoutDashboard,
    },
    {
        title: "Promotion Management",
        href: "/staff/promotion-management",
        icon: CreditCard,
    },
    {
        title: "Skincare Routine Management",
        href: "/staff/skincare-routine-management",
        icon: Settings,
    },
    {
        title: "Order Management",
        href: "/staff/order-management",
        icon: BarChart3,
    },
]

const adminSidebarProps: AdminSidebarProps[] = [
    {
        title: "Dashboard",
        href: "/staff/dashboard",
        icon: LayoutDashboard,
    },
    {
        title: "Staff Management",
        href: "/staff/staff-management",
        icon: HandPlatter,
    },
    {
        title: "Revenue",
        href: "/staff/revenue",
        icon: BarChart3,
    },
    {
        title: "Billing",
        href: "/staff/billing",
        icon: CreditCard,
    },
    {
        title: "Settings",
        href: "/staff/settings",
        icon: Settings,
    },
    ...staffSidebarProps
]
export default function AdminSidebarRoute() {
    const { status, data: session } = useSession();

    const sidebar = useMemo(() => {
        if (status === "authenticated") {
            if ((session?.user as SessionStaff).role === "admin") {
                return <AdminSidebar adminSidebarProps={adminSidebarProps} userName={(session?.user as SessionStaff).name} role={(session?.user as SessionStaff).role} />;
            }
            if ((session?.user as SessionStaff).role === "staff") {
                return <AdminSidebar adminSidebarProps={staffSidebarProps} userName={(session?.user as SessionStaff).name} role={(session?.user as SessionStaff).role} />;
            }
        }
        return null; // Or some default/loading state if not authenticated
    }, [status, session]);

    return sidebar;
}
