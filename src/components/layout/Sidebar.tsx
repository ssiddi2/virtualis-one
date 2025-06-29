
import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Home, 
  Users, 
  FileText, 
  Calendar, 
  Settings, 
  ChevronLeft, 
  ChevronRight,
  MessageSquare,
  Brain,
  BarChart3,
  Activity,
  TestTube,
  Pill,
  Stethoscope,
  Building2,
  Zap
} from "lucide-react";
import { useAuth } from "@/components/auth/AuthProvider";

interface SidebarProps {
  selectedHospitalId: string;
  expanded: boolean;
  onExpandedChange: (expanded: boolean) => void;
}

const Sidebar = ({ selectedHospitalId, expanded, onExpandedChange }: SidebarProps) => {
  const location = useLocation();
  const { profile } = useAuth();
  const [isAnimating, setIsAnimating] = useState(false);

  // Auto-expand when hospital is selected
  useEffect(() => {
    if (selectedHospitalId && !expanded) {
      setIsAnimating(true);
      onExpandedChange(true);
      setTimeout(() => setIsAnimating(false), 300);
    }
  }, [selectedHospitalId, expanded, onExpandedChange]);

  const toggleSidebar = () => {
    if (selectedHospitalId) {
      setIsAnimating(true);
      onExpandedChange(!expanded);
      setTimeout(() => setIsAnimating(false), 300);
    }
  };

  const navigationItems = [
    { icon: Home, label: "Dashboard", path: "/dashboard", color: "text-blue-400" },
    { icon: Users, label: "Patients", path: "/patients", color: "text-green-400" },
    { icon: FileText, label: "Medical Records", path: "/records", color: "text-purple-400" },
    { icon: TestTube, label: "Laboratory", path: "/laboratory", color: "text-yellow-400" },
    { icon: Stethoscope, label: "Radiology", path: "/radiology", color: "text-red-400" },
    { icon: Pill, label: "Pharmacy", path: "/pharmacy", color: "text-orange-400" },
    { icon: Activity, label: "Vital Signs", path: "/vitals", color: "text-cyan-400" },
    { icon: MessageSquare, label: "Virtualis Chat", path: "/virtualis-chat", color: "text-indigo-400" },
  ];

  const aiAssistantItems = [
    { 
      icon: Brain, 
      label: "V1 Drift", 
      path: "/v1-drift", 
      color: "text-blue-400",
      badge: "AI",
      gradient: true
    },
    { 
      icon: BarChart3, 
      label: "V1 Analytics", 
      path: "/v1-drift/analytics", 
      color: "text-cyan-400",
      adminOnly: true
    },
  ];

  const isActive = (path: string) => location.pathname === path;
  const isAdmin = profile?.role === 'admin' || profile?.role === 'administrator';

  return (
    <div 
      className={cn(
        "fixed left-0 top-0 h-full bg-slate-900/95 backdrop-blur-xl border-r border-white/10 transition-all duration-300 z-50",
        expanded ? "w-64" : "w-16"
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-white/10">
        {expanded && (
          <div className="flex items-center gap-2">
            <Building2 className="h-6 w-6 text-blue-400" />
            <span className="text-lg font-bold text-white">Virtualis One™</span>
          </div>
        )}
        
        {selectedHospitalId && (
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleSidebar}
            className="text-white/70 hover:text-white hover:bg-white/10"
          >
            {expanded ? <ChevronLeft className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
          </Button>
        )}
      </div>

      {/* Navigation */}
      <div className="flex flex-col p-4 space-y-2">
        {/* Hospital Selection Required Message */}
        {!selectedHospitalId && expanded && (
          <div className="mb-4 p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
            <p className="text-yellow-300 text-sm">
              Select a hospital to access clinical modules
            </p>
          </div>
        )}

        {/* Main Navigation */}
        {selectedHospitalId && (
          <>
            <div className="space-y-1">
              {expanded && (
                <p className="text-xs font-semibold text-white/50 uppercase tracking-wider px-2 py-1">
                  Clinical Modules
                </p>
              )}
              
              {navigationItems.map((item) => (
                <Link key={item.path} to={item.path}>
                  <Button
                    variant={isActive(item.path) ? "secondary" : "ghost"}
                    className={cn(
                      "w-full justify-start text-white/70 hover:text-white hover:bg-white/10",
                      isActive(item.path) && "bg-white/10 text-white",
                      !expanded && "px-2"
                    )}
                  >
                    <item.icon className={cn("h-4 w-4", item.color)} />
                    {expanded && (
                      <span className="ml-3 truncate">{item.label}</span>
                    )}
                  </Button>
                </Link>
              ))}
            </div>

            {/* AI Assistant Section */}
            <div className="space-y-1 pt-4 border-t border-white/10">
              {expanded && (
                <div className="flex items-center gap-2 px-2 py-1">
                  <p className="text-xs font-semibold text-white/50 uppercase tracking-wider">
                    AI Assistant
                  </p>
                  <Zap className="h-3 w-3 text-cyan-400 animate-pulse" />
                </div>
              )}
              
              {aiAssistantItems.map((item) => {
                if (item.adminOnly && !isAdmin) return null;
                
                return (
                  <Link key={item.path} to={item.path}>
                    <Button
                      variant={isActive(item.path) ? "secondary" : "ghost"}
                      className={cn(
                        "w-full justify-start text-white/70 hover:text-white",
                        isActive(item.path) && "bg-white/10 text-white",
                        !expanded && "px-2",
                        item.gradient && "hover:bg-gradient-to-r hover:from-blue-500/10 hover:to-cyan-500/10"
                      )}
                    >
                      <item.icon className={cn("h-4 w-4", item.color)} />
                      {expanded && (
                        <div className="flex items-center justify-between w-full ml-3">
                          <span className="truncate">{item.label}</span>
                          {item.badge && (
                            <Badge className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white text-xs">
                              {item.badge}
                            </Badge>
                          )}
                        </div>
                      )}
                    </Button>
                  </Link>
                );
              })}
            </div>
          </>
        )}

        {/* Settings at bottom */}
        <div className="flex-1" />
        <Link to="/settings">
          <Button
            variant="ghost"
            className={cn(
              "w-full justify-start text-white/70 hover:text-white hover:bg-white/10",
              !expanded && "px-2"
            )}
          >
            <Settings className="h-4 w-4" />
            {expanded && <span className="ml-3">Settings</span>}
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default Sidebar;
