
import { 
  Building2, 
  Users, 
  Stethoscope, 
  DollarSign, 
  BarChart3, 
  Brain, 
  FileText, 
  Activity, 
  Beaker, 
  Zap, 
  Settings, 
  Home,
  TrendingUp,
  Shield
} from "lucide-react";
import { NavLink, useLocation } from "react-router-dom";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";

const mainNavItems = [
  { title: "Dashboard", url: "/dashboard", icon: Home },
  { title: "Patient Management", url: "/patients", icon: Users },
  { title: "Clinical Workflows", url: "/clinical", icon: Stethoscope },
];

const financialItems = [
  { title: "CFO Dashboard", url: "/cfo-dashboard", icon: TrendingUp },
  { title: "Revenue Cycle", url: "/billing", icon: DollarSign },
  { title: "AI Coding", url: "/coding", icon: Brain },
  { title: "Quality Measures", url: "/quality", icon: Shield },
];

const systemItems = [
  { title: "Laboratory", url: "/laboratory", icon: Beaker },
  { title: "Radiology", url: "/radiology", icon: Activity },
  { title: "AI Insights", url: "/ai-dashboard", icon: Zap },
  { title: "Settings", url: "/settings", icon: Settings },
];

export function AppSidebar() {
  const { collapsed } = useSidebar();
  const location = useLocation();
  const currentPath = location.pathname;

  const isActive = (path: string) => currentPath === path;
  const getNavCls = ({ isActive }: { isActive: boolean }) =>
    isActive ? "bg-blue-600/30 text-white font-medium border-l-2 border-yellow-400" : "text-white/80 hover:bg-blue-500/20 hover:text-white";

  return (
    <Sidebar className={collapsed ? "w-14" : "w-64"} collapsible>
      <SidebarContent className="bg-blue-900/20 backdrop-blur-xl border-r border-blue-400/30">
        
        {/* Main Navigation */}
        <SidebarGroup>
          <SidebarGroupLabel className="text-white/90 font-semibold">
            {!collapsed && "Main Navigation"}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {mainNavItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink 
                      to={item.url} 
                      end 
                      className={({ isActive }) => `flex items-center gap-3 p-3 rounded-lg transition-all ${getNavCls({ isActive })}`}
                    >
                      <item.icon className="h-5 w-5 flex-shrink-0" />
                      {!collapsed && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Financial & Executive */}
        <SidebarGroup>
          <SidebarGroupLabel className="text-white/90 font-semibold">
            {!collapsed && "Financial & Executive"}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {financialItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink 
                      to={item.url} 
                      end 
                      className={({ isActive }) => `flex items-center gap-3 p-3 rounded-lg transition-all ${getNavCls({ isActive })}`}
                    >
                      <item.icon className="h-5 w-5 flex-shrink-0" />
                      {!collapsed && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* System Tools */}
        <SidebarGroup>
          <SidebarGroupLabel className="text-white/90 font-semibold">
            {!collapsed && "System Tools"}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {systemItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink 
                      to={item.url} 
                      end 
                      className={({ isActive }) => `flex items-center gap-3 p-3 rounded-lg transition-all ${getNavCls({ isActive })}`}
                    >
                      <item.icon className="h-5 w-5 flex-shrink-0" />
                      {!collapsed && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

      </SidebarContent>
    </Sidebar>
  );
}
