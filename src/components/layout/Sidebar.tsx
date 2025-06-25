
import { NavLink } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { 
  User, 
  Calendar, 
  FileText, 
  Users, 
  Settings, 
  LogOut,
  Menu,
  Home,
  Plus,
  Hospital,
  Brain,
  TestTube,
  Pill,
  DollarSign,
  Database,
  ArrowLeft
} from "lucide-react";

interface SidebarProps {
  user: any;
  onLogout: () => void;
  isOpen: boolean;
  onToggle: () => void;
}

const Sidebar = ({ user, onLogout, isOpen, onToggle }: SidebarProps) => {
  const handleBackToEMR = () => {
    // Reset to EMR selection
    window.location.href = '/';
  };

  const menuItems = [
    { icon: Home, label: "Dashboard", path: "/", roles: ["physician", "nurse", "admin", "biller"] },
    { icon: ArrowLeft, label: "Back to EMR Center", action: handleBackToEMR, roles: ["physician", "nurse", "admin", "biller"] },
    { icon: Database, label: "EMR Systems", path: "/emr", roles: ["admin"] },
    { icon: Plus, label: "Admit Patient", path: "/admit", roles: ["physician", "nurse"] },
    { icon: Users, label: "Patient Tracker", path: "/tracker", roles: ["physician", "nurse", "admin"] },
    { icon: Brain, label: "AI Copilot", path: "/copilot", roles: ["physician", "nurse"] },
    { icon: FileText, label: "Notes", path: "/notes", roles: ["physician", "nurse"] },
    { icon: TestTube, label: "Orders & Results", path: "/orders", roles: ["physician", "nurse"] },
    { icon: Pill, label: "MAR", path: "/mar", roles: ["nurse"] },
    { icon: DollarSign, label: "RCM & Charges", path: "/rcm", roles: ["biller", "admin"] },
    { icon: Calendar, label: "Schedule", path: "/schedule", roles: ["physician", "nurse"] },
    { icon: Settings, label: "Admin Panel", path: "/admin", roles: ["admin"] },
  ];

  const filteredMenuItems = menuItems.filter(item => 
    item.roles.includes(user.role)
  );

  return (
    <div className={`fixed inset-y-0 left-0 z-50 glass-sidebar transition-all duration-300 ${
      isOpen ? 'w-64' : 'w-16'
    }`}>
      <div className="flex h-full flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-white/10">
          {isOpen && (
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-virtualis-gold rounded-xl flex items-center justify-center pulse-glow">
                <Hospital className="h-5 w-5 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-white brand-font gradient-text">Virtualis One™</h1>
                <p className="text-xs text-virtualis-gold tech-font">Clinical OS</p>
              </div>
            </div>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={onToggle}
            className="p-2 text-white hover:bg-white/10 glass-nav-item"
          >
            <Menu className="h-4 w-4" />
          </Button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto p-4">
          <ul className="space-y-2">
            {filteredMenuItems.map((item, index) => (
              <li key={item.path || index}>
                {item.action ? (
                  <button
                    onClick={item.action}
                    className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm transition-all duration-300 tech-font glass-nav-item text-white/80 hover:text-white w-full text-left"
                  >
                    <item.icon className="h-4 w-4 flex-shrink-0" />
                    {isOpen && <span className="font-medium">{item.label}</span>}
                  </button>
                ) : (
                  <NavLink
                    to={item.path}
                    className={({ isActive }) =>
                      `flex items-center gap-3 rounded-xl px-3 py-3 text-sm transition-all duration-300 tech-font ${
                        isActive 
                          ? 'glass-nav-item active text-virtualis-gold' 
                          : 'glass-nav-item text-white/80 hover:text-white'
                      }`
                    }
                  >
                    <item.icon className="h-4 w-4 flex-shrink-0" />
                    {isOpen && <span className="font-medium">{item.label}</span>}
                  </NavLink>
                )}
              </li>
            ))}
          </ul>
        </nav>

        {/* User Info */}
        <div className="border-t border-white/10 p-4">
          <div className={`flex items-center gap-3 mb-4 ${!isOpen && 'justify-center'}`}>
            <div className="h-10 w-10 rounded-full bg-virtualis-gold flex items-center justify-center pulse-glow">
              <User className="h-5 w-5 text-white" />
            </div>
            {isOpen && (
              <div>
                <p className="text-sm font-semibold text-white tech-font">{user.name}</p>
                <p className="text-xs text-virtualis-gold capitalize tech-font">{user.role}</p>
              </div>
            )}
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onLogout}
            className={`w-full justify-start text-red-400 hover:text-red-300 hover:bg-red-900/20 glass-nav-item tech-font ${
              !isOpen && 'px-0 justify-center'
            }`}
          >
            <LogOut className="h-4 w-4" />
            {isOpen && <span className="ml-2">Sign Out</span>}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
