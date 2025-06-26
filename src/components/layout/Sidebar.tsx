
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/components/auth/AuthProvider";
import {
  LayoutDashboard,
  Hospital,
  Users,
  FileText,
  DollarSign,
  Code,
  TestTube,
  Zap,
  FileSpreadsheet,
  Brain,
  ChevronLeft,
  ChevronRight,
  LogOut,
  User,
  Activity
} from "lucide-react";

interface SidebarProps {
  selectedHospitalId?: string | null;
}

const Sidebar = ({ selectedHospitalId }: SidebarProps) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { signOut, profile, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    {
      icon: LayoutDashboard,
      label: "Dashboard",
      path: "/dashboard",
      badge: null,
      showAlways: true
    },
    {
      icon: Hospital,
      label: "EMR Systems",
      path: "/emr",
      badge: selectedHospitalId ? "CONNECTED" : null,
      showAlways: true
    },
    {
      icon: Activity,
      label: "ER Patient Tracker",
      path: "/patient-tracker",
      badge: selectedHospitalId ? "LIVE" : null,
      showAlways: false,
      hospitalOnly: true
    },
    {
      icon: Users,
      label: "Patients",
      path: "/patients",
      badge: null,
      showAlways: true
    },
    {
      icon: FileText,
      label: "Admissions",
      path: "/admission",
      badge: null,
      showAlways: true
    },
    {
      icon: DollarSign,
      label: "Billing",
      path: "/billing",
      badge: null,
      showAlways: true
    },
    {
      icon: Code,
      label: "Coding",
      path: "/coding",
      badge: null,
      showAlways: true
    },
    {
      icon: TestTube,
      label: "Laboratory",
      path: "/laboratory",
      badge: null,
      showAlways: true
    },
    {
      icon: Zap,
      label: "Radiology",
      path: "/radiology",
      badge: null,
      showAlways: true
    },
    {
      icon: FileSpreadsheet,
      label: "Reporting",
      path: "/reporting",
      badge: null,
      showAlways: true
    },
    {
      icon: Brain,
      label: "AI Assistant",
      path: "/ai-assistant",
      badge: "AI",
      showAlways: true
    }
  ];

  const handleSignOut = async () => {
    await signOut();
  };

  // Filter menu items based on hospital connection
  const visibleMenuItems = menuItems.filter(item => 
    item.showAlways || (item.hospitalOnly && selectedHospitalId)
  );

  return (
    <div className={`${isCollapsed ? 'w-16' : 'w-64'} transition-all duration-300 glass-sidebar border-r border-white/10 flex flex-col`}>
      {/* Header */}
      <div className="p-4 border-b border-white/10">
        <div className="flex items-center justify-between">
          {!isCollapsed && (
            <div className="flex items-center gap-3">
              <img 
                src="/lovable-uploads/c61057eb-57cd-4ce6-89ca-b6ee43ac66a4.png" 
                alt="Virtualis One™" 
                className="h-8 w-auto"
              />
              <div className="text-white">
                <div className="text-sm font-bold tech-font">VIRTUALIS ONE™</div>
                <div className="text-xs text-white/60 tech-font">Healthcare AI</div>
              </div>
            </div>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="text-white/60 hover:text-white hover:bg-white/10"
          >
            {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </Button>
        </div>
      </div>

      {/* User Profile */}
      {!isCollapsed && (
        <div className="p-4 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-virtualis-gold to-orange-500 rounded-full flex items-center justify-center">
              <User className="h-4 w-4 text-white" />
            </div>
            <div className="flex-1">
              <div className="text-white text-sm font-medium tech-font">
                {profile?.first_name || user?.email} {profile?.last_name}
              </div>
              <div className="text-white/60 text-xs tech-font capitalize">
                {profile?.role || 'Healthcare Provider'}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Hospital Connection Status */}
      {!isCollapsed && selectedHospitalId && (
        <div className="p-4 border-b border-white/10">
          <div className="bg-virtualis-gold/20 border border-virtualis-gold/30 rounded-lg p-3">
            <div className="flex items-center gap-2 text-virtualis-gold text-sm font-medium">
              <Hospital className="h-4 w-4" />
              <span>Connected to EMR</span>
            </div>
            <div className="text-white/80 text-xs mt-1">
              Real-time hospital data access active
            </div>
          </div>
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {visibleMenuItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          
          return (
            <Button
              key={item.path}
              variant="ghost"
              className={`w-full justify-start glass-nav-item ${
                isActive ? 'bg-virtualis-gold/20 text-virtualis-gold border-virtualis-gold/30' : 'text-white/80 hover:text-white'
              } ${isCollapsed ? 'px-2' : 'px-4'} tech-font`}
              onClick={() => navigate(item.path)}
            >
              <Icon className="h-4 w-4" />
              {!isCollapsed && (
                <>
                  <span className="ml-3">{item.label}</span>
                  {item.badge && (
                    <Badge className="ml-auto glass-badge primary">
                      {item.badge}
                    </Badge>
                  )}
                </>
              )}
            </Button>
          );
        })}
      </nav>

      {/* Sign Out */}
      <div className="p-4 border-t border-white/10">
        <Button
          variant="ghost"
          onClick={handleSignOut}
          className={`w-full justify-start text-white/60 hover:text-white hover:bg-red-500/20 ${
            isCollapsed ? 'px-2' : 'px-4'
          } tech-font`}
        >
          <LogOut className="h-4 w-4" />
          {!isCollapsed && <span className="ml-3">Sign Out</span>}
        </Button>
      </div>
    </div>
  );
};

export default Sidebar;
