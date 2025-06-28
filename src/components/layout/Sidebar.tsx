
import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/components/auth/AuthProvider";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Home, 
  Users, 
  FileText, 
  Calendar, 
  Settings, 
  LogOut, 
  Activity,
  Brain,
  Stethoscope,
  Building,
  UserPlus,
  DollarSign,
  Code,
  TestTube,
  Scan,
  BarChart,
  Bot,
  ChevronLeft,
  ChevronRight,
  Zap,
  Presentation,
  BarChart3,
  Building2,
  CreditCard,
  Monitor,
  MessageSquare
} from "lucide-react";

interface SidebarProps {
  selectedHospitalId?: string | null;
}

const Sidebar = ({ selectedHospitalId }: SidebarProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, profile, signOut } = useAuth();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const menuItems = [
    { 
      name: "Dashboard", 
      href: "/dashboard", 
      icon: BarChart3,
      description: "System overview and analytics"
    },
    { 
      name: "EMR Systems", 
      href: "/emr", 
      icon: Building2,
      description: "Electronic medical records management",
      badge: "CORE"
    },
    { 
      name: "AI Dashboard", 
      href: "/ai-dashboard", 
      icon: Brain,
      description: "Artificial intelligence insights",
      badge: "AI"
    },
    { 
      name: "Patient Tracker", 
      href: "/patient-tracker", 
      icon: Activity,
      description: "Emergency department tracking"
    },
    { 
      name: "Laboratory", 
      href: "/laboratory", 
      icon: TestTube,
      description: "Lab information system"
    },
    { 
      name: "Radiology", 
      href: "/radiology", 
      icon: Scan,
      description: "Medical imaging and PACS"
    },
    { 
      name: "Billing", 
      href: "/billing", 
      icon: CreditCard,
      description: "Revenue cycle management"
    },
    { 
      name: "Coding", 
      href: "/coding", 
      icon: Code,
      description: "Medical coding assistance"
    },
    { 
      name: "AI Assistant", 
      href: "/ai-assistant", 
      icon: Stethoscope,
      description: "Clinical AI copilot",
      badge: "AI"
    },
    { 
      name: "Virtualis Chat", 
      href: "/virtualis-chat", 
      icon: MessageSquare,
      description: "AI-powered clinical communication",
      badge: "NEW"
    },
    { 
      name: "Reporting", 
      href: "/reporting", 
      icon: FileText,
      description: "CMS and compliance reports"
    },
    { 
      name: "Demo & Integration", 
      href: "/demo", 
      icon: Monitor,
      description: "Technical documentation"
    }
  ];

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <div className={`${isCollapsed ? 'w-16' : 'w-64'} virtualis-sidebar flex flex-col transition-all duration-300 border-r border-sky-200/30`}>
      {/* Header */}
      <div className="p-4 border-b border-sky-200/20">
        <div className="flex items-center justify-between">
          {!isCollapsed && (
            <div className="flex items-center gap-2">
              <img 
                src="/lovable-uploads/d05aa5d2-561a-436f-ae8c-de68ab1b3e88.png" 
                alt="Virtualis" 
                className="w-8 h-8 rounded-lg"
              />
              <div>
                <h1 className="text-white font-bold text-lg">Virtualis</h1>
                <p className="text-xs text-sky-200">Healthcare AI Platform</p>
              </div>
            </div>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="text-white hover:bg-sky-200/10 p-1 h-8 w-8 border-0 rounded-xl"
          >
            {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </Button>
        </div>
      </div>

      {/* Hospital Selection Status */}
      {!isCollapsed && selectedHospitalId && (
        <div className="p-3 border-b border-sky-200/20">
          <Card className="virtualis-card">
            <CardContent className="p-3">
              <div className="flex items-center gap-2 mb-2">
                <Building className="h-4 w-4 text-blue-500" />
                <span className="text-xs text-gray-700 font-medium">Connected Hospital</span>
              </div>
              <Badge className="virtualis-badge primary">
                EMR System Active
              </Badge>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto p-2 space-y-1">
        {menuItems.map((item) => (
          <div key={item.href} className="relative group">
            <Button
              variant="ghost"
              className={`w-full ${isCollapsed ? 'justify-center px-2' : 'justify-start'} virtualis-nav-item transition-all duration-300 ${
                isActive(item.href) 
                  ? 'virtualis-nav-item active bg-orange-400/20 border-orange-400/40 text-white' 
                  : 'text-sky-100 hover:bg-sky-200/10 border-sky-200/20'
              }`}
              onClick={() => navigate(item.href)}
            >
              <item.icon className={`h-5 w-5 ${isCollapsed ? '' : 'mr-3'} ${isActive(item.href) ? 'text-orange-400' : 'text-sky-200'}`} />
              {!isCollapsed && (
                <div className="flex-1 flex items-center justify-between">
                  <span className={isActive(item.href) ? 'text-white font-medium' : 'text-sky-100'}>{item.name}</span>
                  {item.badge && (
                    <Badge 
                      className={`ml-2 text-xs ${
                        item.badge === 'AI' 
                          ? 'virtualis-badge text-purple-700 bg-purple-100/30 border-purple-300/40' 
                          : item.badge === 'CORE'
                          ? 'virtualis-badge text-blue-700 bg-blue-100/30 border-blue-300/40'
                          : 'virtualis-badge text-green-700 bg-green-100/30 border-green-300/40'
                      }`}
                    >
                      {item.badge}
                    </Badge>
                  )}
                </div>
              )}
            </Button>
            
            {/* Tooltip for collapsed state */}
            {isCollapsed && (
              <div className="absolute left-full ml-2 px-3 py-1 virtualis-card text-gray-800 text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none whitespace-nowrap z-50">
                {item.name}
                {item.badge && (
                  <Badge className="ml-2 text-xs virtualis-badge primary">
                    {item.badge}
                  </Badge>
                )}
              </div>
            )}
          </div>
        ))}
      </nav>

      {/* User Info */}
      <div className="p-4 border-t border-sky-200/20 space-y-2">
        {!isCollapsed && (
          <div className="virtualis-card p-3">
            <div className="text-gray-800">
              <p className="font-medium">{profile?.first_name} {profile?.last_name}</p>
              <p className="text-sm text-gray-600">{profile?.role || 'Healthcare Professional'}</p>
              <p className="text-xs text-gray-500">{profile?.email}</p>
            </div>
          </div>
        )}
        
        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="sm"
            className="text-sky-100 hover:bg-sky-200/10 flex-1 border-sky-200/20 rounded-xl"
            onClick={() => navigate('/settings')}
          >
            <Settings className="h-4 w-4" />
            {!isCollapsed && <span className="ml-2">Settings</span>}
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={handleSignOut}
            className="text-red-200 hover:bg-red-500/20 border-red-300/30 flex-1 rounded-xl"
          >
            <LogOut className="h-4 w-4" />
            {!isCollapsed && <span className="ml-2">Sign Out</span>}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
