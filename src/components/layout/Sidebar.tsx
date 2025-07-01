
import { Home, Users, Activity, MessageSquare, Settings, Calculator, TestTube, Scan, Award, Code, Brain, Building2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

const navigation = [
  { name: "Hospital Selection", href: "/hospital-selection", icon: Building2 },
  { name: "Dashboard", href: "/dashboard", icon: Home },
  { name: "Patients", href: "/patients", icon: Users },
  { name: "Clinical", href: "/clinical", icon: Activity },
  { name: "VirtualisChat", href: "/virtualis-chat", icon: MessageSquare },
  { name: "Billing", href: "/billing", icon: Calculator },
  { name: "Laboratory", href: "/laboratory", icon: TestTube },
  { name: "Radiology", href: "/radiology", icon: Scan },
  { name: "Quality", href: "/quality", icon: Award },
  { name: "Coding", href: "/coding", icon: Code },
  { name: "AI Dashboard", href: "/ai-dashboard", icon: Brain },
  { name: "Settings", href: "/settings", icon: Settings },
];

interface SidebarProps {
  className?: string;
}

export function Sidebar({ className }: SidebarProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout, profile } = useAuth();

  const handleNavigation = (href: string) => {
    navigate(href);
  };

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <div className={cn("pb-12 min-h-screen", className)}>
      <div className="space-y-4 py-4">
        <div className="px-3 py-2">
          <div className="flex items-center gap-2 px-4 mb-8">
            <img 
              src="/lovable-uploads/9ce8bfbd-79fd-4ea8-9589-5e4a4307b294.png" 
              alt="Virtualis Logo" 
              className="h-10 w-10"
            />
            <div>
              <h2 className="text-xl font-bold text-white">VirtualisOne</h2>
              <p className="text-xs text-white/60">Healthcare Intelligence</p>
            </div>
          </div>

          {profile && (
            <div className="px-4 mb-6">
              <div className="bg-blue-600/20 rounded-lg p-3 border border-blue-400/30">
                <p className="text-white font-medium">{profile.first_name} {profile.last_name}</p>
                <p className="text-white/70 text-sm capitalize">{profile.role}</p>
                <p className="text-white/60 text-xs">{profile.department}</p>
              </div>
            </div>
          )}

          <div className="space-y-1">
            {navigation.map((item) => (
              <Button
                key={item.name}
                variant={location.pathname === item.href ? "secondary" : "ghost"}
                className={cn(
                  "w-full justify-start",
                  location.pathname === item.href
                    ? "bg-blue-600 text-white"
                    : "text-white/70 hover:text-white hover:bg-blue-600/50"
                )}
                onClick={() => handleNavigation(item.href)}
              >
                <item.icon className="mr-2 h-4 w-4" />
                {item.name}
              </Button>
            ))}
          </div>

          <div className="mt-8 px-4">
            <Button
              variant="outline"
              className="w-full border-red-500/50 text-red-400 hover:bg-red-500/10"
              onClick={handleLogout}
            >
              Sign Out
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
