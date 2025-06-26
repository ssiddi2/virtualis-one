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
      name: "AI Dashboard", 
      href: "/ai-dashboard", 
      icon: Brain,
      description: "Artificial intelligence insights",
      badge: "AI"
    },
    { 
      name: "EMR Systems", 
      href: "/emr", 
      icon: Building2,
      description: "Electronic medical records"
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
    <div className={`${isCollapsed ? 'w-16' : 'w-64'} bg-[#0a1628] border-r border-[#1a2332] flex flex-col transition-all duration-300`}>
      {/* Header */}
      <div className="p-4 border-b border-[#1a2332]">
        <div className="flex items-center justify-between">
          {!isCollapsed && (
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <Zap className="h-5 w-5 text-white" />
              </div>
              <div>
                <h1 className="text-white font-bold text-lg">Virtualis</h1>
                <p className="text-xs text-white/60">Healthcare AI Platform</p>
              </div>
            </div>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="text-white hover:bg-white/10 p-1 h-8 w-8"
          >
            {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </Button>
        </div>
      </div>

      {/* Hospital Selection Status */}
      {!isCollapsed && selectedHospitalId && (
        <div className="p-3 border-b border-[#1a2332]">
          <Card className="bg-blue-900/30 border-blue-600/30">
            <CardContent className="p-3">
              <div className="flex items-center gap-2 mb-2">
                <Building className="h-4 w-4 text-blue-400" />
                <span className="text-xs text-blue-300 font-medium">Connected Hospital</span>
              </div>
              <Badge className="bg-blue-600 text-white text-xs">
                EMR System Active
              </Badge>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto p-2 space-y-1">
        {menuItems.map((item) => (
          <Button
            key={item.href}
            variant={isActive(item.href) ? "secondary" : "ghost"}
            className={`w-full ${isCollapsed ? 'justify-center px-2' : 'justify-start'} text-white hover:bg-white/10 ${
              isActive(item.href) ? 'bg-white/20 text-white' : ''
            }`}
            onClick={() => navigate(item.href)}
          >
            <item.icon className={`h-5 w-5 ${isCollapsed ? '' : 'mr-3'}`} />
            {!isCollapsed && <span>{item.name}</span>}
          </Button>
        ))}
      </nav>

      {/* User Info */}
      <div className="p-4 border-t border-[#1a2332] space-y-2">
        {!isCollapsed && (
          <div className="text-white">
            <p className="font-medium">{profile?.first_name} {profile?.last_name}</p>
            <p className="text-sm text-white/60">{profile?.role || 'Healthcare Professional'}</p>
            <p className="text-xs text-white/50">{profile?.email}</p>
          </div>
        )}
        
        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="sm"
            className="text-white hover:bg-white/10 flex-1"
            onClick={() => navigate('/settings')}
          >
            <Settings className="h-4 w-4" />
            {!isCollapsed && <span className="ml-2">Settings</span>}
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={handleSignOut}
            className="text-red-400 hover:bg-red-500/20 flex-1"
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
