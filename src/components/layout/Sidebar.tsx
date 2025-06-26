
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { 
  LayoutDashboard, 
  Users, 
  FileText, 
  UserPlus, 
  DollarSign,
  Code,
  TestTube,
  Brain,
  BarChart3,
  ChevronLeft,
  ChevronRight,
  Hospital,
  Stethoscope,
  Activity,
  Shield,
  Settings,
  Bot,
  Zap,
  ArrowLeft
} from "lucide-react";

interface SidebarProps {
  selectedHospitalId?: string | null;
}

const Sidebar = ({ selectedHospitalId }: SidebarProps) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const location = useLocation();

  const baseMenuItems = [
    {
      title: "Dashboard",
      icon: LayoutDashboard,
      href: "/dashboard",
      badge: null
    },
    {
      title: "EMR System",
      icon: Stethoscope,
      href: "/emr",
      badge: selectedHospitalId ? "Connected" : "Smart"
    }
  ];

  const hospitalMenuItems = selectedHospitalId ? [
    {
      title: "Patient Management",
      icon: Users,
      href: "/patients",
      badge: null
    },
    {
      title: "Patient Admission",
      icon: UserPlus,
      href: "/admission",
      badge: null
    },
    {
      title: "AI Clinical Assistant",
      icon: Brain,
      href: "/ai-assistant",
      badge: "Smart"
    },
    {
      title: "Revenue Cycle",
      icon: DollarSign,
      href: "/billing",
      badge: "RCM"
    },
    {
      title: "3M Coding & CDI",
      icon: Code,
      href: "/coding",
      badge: "CAC"
    },
    {
      title: "Enhanced LIS",
      icon: TestTube,
      href: "/laboratory",
      badge: "AI Lab"
    },
    {
      title: "LiveRad AI",
      icon: Brain,
      href: "/liverad",
      badge: "Smart"
    },
    {
      title: "CMS Reporting",
      icon: BarChart3,
      href: "/reporting",
      badge: "State"
    }
  ] : [];

  const menuItems = [...baseMenuItems, ...hospitalMenuItems];

  const isActive = (href: string) => {
    if (href === "/liverad") {
      return location.pathname === "/liverad" || location.pathname === "/pacs" || location.pathname === "/radiology";
    }
    return location.pathname === href;
  };

  return (
    <div className={cn(
      "h-full bg-gradient-to-b from-virtualis-dark via-black to-virtualis-dark border-r border-virtualis-gold/20 transition-all duration-300 flex flex-col",
      isCollapsed ? "w-16" : "w-64"
    )}>
      {/* Header */}
      <div className="p-4 border-b border-virtualis-gold/20">
        <div className="flex items-center justify-between">
          {!isCollapsed && (
            <div>
              <h1 className="text-xl font-bold text-white brand-font gradient-text flex items-center gap-2">
                <Hospital className="h-6 w-6 text-virtualis-gold" />
                Virtualis EMR
              </h1>
              <p className="text-xs text-virtualis-gold/60 tech-font mt-1">
                {selectedHospitalId ? "Hospital Connected" : "Healthcare AI Platform"}
              </p>
            </div>
          )}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="glass-button p-2 hover:bg-white/10 transition-colors"
          >
            {isCollapsed ? (
              <ChevronRight className="h-4 w-4 text-white" />
            ) : (
              <ChevronLeft className="h-4 w-4 text-white" />
            )}
          </button>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.href);
          
          return (
            <Link
              key={item.href}
              to={item.href}
              className={cn(
                "flex items-center px-3 py-2 rounded-lg transition-all duration-200 group relative",
                active 
                  ? "bg-virtualis-gold/20 text-virtualis-gold border border-virtualis-gold/30" 
                  : "text-white/70 hover:text-white hover:bg-white/5 border border-transparent hover:border-white/10"
              )}
            >
              <Icon className={cn(
                "h-5 w-5 transition-colors",
                active ? "text-virtualis-gold" : "text-white/70 group-hover:text-white"
              )} />
              
              {!isCollapsed && (
                <>
                  <span className="ml-3 tech-font font-medium">{item.title}</span>
                  {item.badge && (
                    <span className={cn(
                      "ml-auto px-2 py-1 text-xs rounded-full font-medium",
                      active 
                        ? "bg-virtualis-gold/30 text-virtualis-gold" 
                        : "bg-white/10 text-white/60"
                    )}>
                      {item.badge}
                    </span>
                  )}
                </>
              )}
              
              {/* Tooltip for collapsed state */}
              {isCollapsed && (
                <div className="absolute left-full ml-2 px-2 py-1 bg-black/90 text-white text-sm rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
                  {item.title}
                  {item.badge && (
                    <span className="ml-2 px-1.5 py-0.5 bg-virtualis-gold/20 text-virtualis-gold text-xs rounded">
                      {item.badge}
                    </span>
                  )}
                </div>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-virtualis-gold/20">
        {!isCollapsed ? (
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-white/60 text-sm">
              <Activity className="h-4 w-4 text-green-400" />
              <span className="tech-font">
                {selectedHospitalId ? "Hospital Online" : "System Online"}
              </span>
            </div>
            <div className="flex items-center gap-2 text-white/60 text-sm">
              <Shield className="h-4 w-4 text-blue-400" />
              <span className="tech-font">HIPAA Compliant</span>
            </div>
            <div className="flex items-center gap-2 text-white/60 text-sm">
              <Bot className="h-4 w-4 text-virtualis-gold" />
              <span className="tech-font">AI Enhanced</span>
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-2 items-center">
            <Activity className="h-4 w-4 text-green-400" />
            <Shield className="h-4 w-4 text-blue-400" />
            <Bot className="h-4 w-4 text-virtualis-gold" />
          </div>
        )}
      </div>
    </div>
  );
};

export default Sidebar;
