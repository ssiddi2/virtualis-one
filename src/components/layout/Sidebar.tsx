
import { useState } from "react";
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
  Search
} from "lucide-react";

interface SidebarProps {
  user: any;
  onLogout: () => void;
  isOpen: boolean;
  onToggle: () => void;
}

const Sidebar = ({ user, onLogout, isOpen, onToggle }: SidebarProps) => {
  const menuItems = [
    { icon: Home, label: "Dashboard", path: "/", roles: ["physician", "nurse", "admin"] },
    { icon: Plus, label: "Admit Patient", path: "/admit", roles: ["physician", "nurse"] },
    { icon: Users, label: "Patients", path: "/patients", roles: ["physician", "nurse", "admin"] },
    { icon: FileText, label: "Notes", path: "/notes", roles: ["physician", "nurse"] },
    { icon: Calendar, label: "Schedule", path: "/schedule", roles: ["physician", "nurse"] },
    { icon: Settings, label: "Settings", path: "/settings", roles: ["admin"] },
  ];

  const filteredMenuItems = menuItems.filter(item => 
    item.roles.includes(user.role)
  );

  return (
    <>
      <div className={`fixed inset-y-0 left-0 z-50 bg-white shadow-lg transition-all duration-300 ${
        isOpen ? 'w-64' : 'w-16'
      }`}>
        <div className="flex h-full flex-col">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b">
            {isOpen && (
              <h1 className="text-xl font-bold text-blue-900">VIRTUALIS ONE™</h1>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={onToggle}
              className="p-2"
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
                      `flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors hover:bg-blue-50 hover:text-blue-900 ${
                        isActive ? 'bg-blue-100 text-blue-900' : 'text-gray-700'
                      }`
                    }
                  >
                    <item.icon className="h-4 w-4" />
                    {isOpen && <span>{item.label}</span>}
                  </NavLink>
                </li>
              ))}
            </ul>
          </nav>

          {/* User Info */}
          <div className="border-t p-4">
            <div className={`flex items-center gap-3 mb-3 ${!isOpen && 'justify-center'}`}>
              <div className="h-8 w-8 rounded-full bg-blue-600 flex items-center justify-center">
                <User className="h-4 w-4 text-white" />
              </div>
              {isOpen && (
                <div>
                  <p className="text-sm font-medium text-gray-900">{user.name}</p>
                  <p className="text-xs text-gray-500 capitalize">{user.role}</p>
                </div>
              )}
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onLogout}
              className={`w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50 ${
                !isOpen && 'px-0 justify-center'
              }`}
            >
              <LogOut className="h-4 w-4" />
              {isOpen && <span className="ml-2">Logout</span>}
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
