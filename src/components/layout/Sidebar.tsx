
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
  DollarSign
} from "lucide-react";

interface SidebarProps {
  user: any;
  onLogout: () => void;
  isOpen: boolean;
  onToggle: () => void;
}

const Sidebar = ({ user, onLogout, isOpen, onToggle }: SidebarProps) => {
  const menuItems = [
    { icon: Home, label: "Dashboard", path: "/", roles: ["physician", "nurse", "admin", "biller"] },
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
    <div className={`fixed inset-y-0 left-0 z-50 bg-slate-900/95 backdrop-blur-sm border-r border-slate-700 shadow-xl transition-all duration-300 ${
      isOpen ? 'w-64' : 'w-16'
    }`}>
      <div className="flex h-full flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-700">
          {isOpen && (
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-virtualis-gold rounded-lg flex items-center justify-center">
                <Hospital className="h-4 w-4 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-white">Virtualis One™</h1>
                <p className="text-xs text-virtualis-gold">EMR Command Center</p>
              </div>
            </div>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={onToggle}
            className="p-2 text-white hover:bg-slate-800"
          >
            <Menu className="h-4 w-4" />
          </Button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto p-4">
          <ul className="space-y-2">
            {filteredMenuItems.map((item) => (
              <li key={item.path}>
                <NavLink
                  to={item.path}
                  className={({ isActive }) =>
                    `flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all duration-200 hover:bg-virtualis-gold/10 hover:text-virtualis-gold ${
                      isActive 
                        ? 'bg-virtualis-gold/20 text-virtualis-gold border border-virtualis-gold/30' 
                        : 'text-slate-300 hover:text-white'
                    }`
                  }
                >
                  <item.icon className="h-4 w-4 flex-shrink-0" />
                  {isOpen && <span className="font-medium">{item.label}</span>}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        {/* User Info */}
        <div className="border-t border-slate-700 p-4">
          <div className={`flex items-center gap-3 mb-3 ${!isOpen && 'justify-center'}`}>
            <div className="h-8 w-8 rounded-full bg-virtualis-gold flex items-center justify-center">
              <User className="h-4 w-4 text-white" />
            </div>
            {isOpen && (
              <div>
                <p className="text-sm font-semibold text-white">{user.name}</p>
                <p className="text-xs text-virtualis-gold capitalize">{user.role}</p>
              </div>
            )}
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onLogout}
            className={`w-full justify-start text-red-400 hover:text-red-300 hover:bg-red-900/20 ${
              !isOpen && 'px-0 justify-center'
            }`}
          >
            <LogOut className="h-4 w-4" />
            {isOpen && <span className="ml-2">Logout</span>}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
