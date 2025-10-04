
import { Home, Users, FileText, Calendar, Settings, Activity, TestTube, Zap, Hospital, DollarSign, BarChart3, MessageSquare, Brain, User, Stethoscope, PlusCircle, ClipboardList, Shield } from "lucide-react"
import { NavLink, useLocation } from "react-router-dom"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar
} from "@/components/ui/sidebar"

// Primary clinical workflow items
const clinicalItems = [
  {
    title: "My Patients",
    url: "/my-patients",
    icon: User,
  },
  {
    title: "Emergency Dept",
    url: "/er-dashboard",
    icon: Activity,
  },
  {
    title: "CPOE System",
    url: "/cpoe",
    icon: PlusCircle,
  },
  {
    title: "All Patients",
    url: "/patients",
    icon: Users,
  },
]

// Secondary clinical tools
const clinicalToolsItems = [
  {
    title: "Laboratory",
    url: "/laboratory",
    icon: TestTube,
  },
  {
    title: "Radiology",
    url: "/radiology",
    icon: Zap,
  },
  {
    title: "Clinical Tools",
    url: "/clinical",
    icon: Stethoscope,
  },
  {
    title: "EMR Certification",
    url: "/certification",
    icon: Shield,
  },
]

// Administrative items
const adminItems = [
  {
    title: "Hospital Selection",
    url: "/hospital-selection",
    icon: Hospital,
  },
  {
    title: "Main Dashboard",
    url: "/dashboard",
    icon: Home,
  },
  {
    title: "Billing",
    url: "/billing",
    icon: DollarSign,
  },
  {
    title: "Quality Measures",
    url: "/quality",
    icon: BarChart3,
  },
  {
    title: "Medical Coding",
    url: "/coding",
    icon: FileText,
  },
]

// AI and communication tools
const toolsItems = [
  {
    title: "AI Dashboard",
    url: "/ai-dashboard",
    icon: Brain,
  },
{
  title: "Alis AI",
  url: "/ambient",
  icon: Zap,
  badge: "Voice",
},
  {
    title: "Virtualis Chat",
    url: "/virtualis-chat",
    icon: MessageSquare,
  },
]

// Settings and misc
const settingsItems = [
  {
    title: "Tasks",
    url: "/tasks",
    icon: Calendar,
  },
  {
    title: "Settings",
    url: "/settings",
    icon: Settings,
  },
]

export function AppSidebar() {
  const { state } = useSidebar()
  const location = useLocation()
  const currentPath = location.pathname

  const isActive = (path: string) => currentPath === path

  return (
    <Sidebar collapsible="icon">
      <SidebarContent className="bg-slate-900 border-slate-700">
        <SidebarGroup>
          <SidebarGroupLabel className="text-slate-300">Clinical Workflow</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {clinicalItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton 
                    asChild 
                    className={`${isActive(item.url) ? 'bg-blue-600 text-white' : 'text-slate-300 hover:bg-slate-800 hover:text-white'}`}
                  >
                    <NavLink to={item.url}>
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel className="text-slate-300">Clinical Tools</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {clinicalToolsItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton 
                    asChild 
                    className={`${isActive(item.url) ? 'bg-blue-600 text-white' : 'text-slate-300 hover:bg-slate-800 hover:text-white'}`}
                  >
                    <NavLink to={item.url}>
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel className="text-slate-300">Administration</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {adminItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton 
                    asChild 
                    className={`${isActive(item.url) ? 'bg-blue-600 text-white' : 'text-slate-300 hover:bg-slate-800 hover:text-white'}`}
                  >
                    <NavLink to={item.url}>
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel className="text-slate-300">AI & Communication</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {toolsItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton 
                    asChild 
                    className={`${isActive(item.url) ? 'bg-blue-600 text-white' : 'text-slate-300 hover:bg-slate-800 hover:text-white'}`}
                  >
                    <NavLink to={item.url}>
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                      {item.badge && (
                        <span className="ml-auto px-2 py-1 text-xs bg-amber-600/20 text-amber-300 border border-amber-400/30 rounded-full animate-pulse">
                          {item.badge}
                        </span>
                      )}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel className="text-slate-300">Settings</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {settingsItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton 
                    asChild 
                    className={`${isActive(item.url) ? 'bg-blue-600 text-white' : 'text-slate-300 hover:bg-slate-800 hover:text-white'}`}
                  >
                    <NavLink to={item.url}>
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}
