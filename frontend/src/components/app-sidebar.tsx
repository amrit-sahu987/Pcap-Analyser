import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

import { CloudUpload, ChartNoAxesCombined, SearchCode, Brain, ClipboardList } from "lucide-react"
import Link from "next/link"

const items = [
    {
        title: "Upload & View",
        url: "/",
        icon: CloudUpload,
    },
    {
        title: "Analytics",
        url: "/analytics",
        icon: ChartNoAxesCombined,
    }, 
    // {
    //     title: "ML Analysis",
    //     url: "/ml",
    //     icon: Brain,
    // },
    {
        title: "OpenLI",
        url: "/open-li",
        icon: ClipboardList,
    },
    {
        title: "ML Anomaly Detection",
        url: "/anomaly-detection",
        icon: SearchCode,
    }
]

export function AppSidebar() {
  return (
    <Sidebar variant="floating" collapsible="offcanvas">
      <SidebarHeader className="text-xl font-semibold text-center py-4">Menu</SidebarHeader>
      <SidebarContent>
        <SidebarGroup />
        <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <Link href={item.url} className="flex items-center gap-3 text-base font-medium px-3 py-2 rounded hover:bg-blue-100 dark:hover:bg-slate-700 transition">
                      <item.icon className="w-6 h-6" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        <SidebarGroup />
      </SidebarContent>
      <SidebarFooter />
    </Sidebar>
  )
}
