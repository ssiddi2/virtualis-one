
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { Users, UserPlus, FileText, Calendar, Plus } from "lucide-react";
import PatientTracker from "./PatientTracker";

interface DashboardProps {
  user: any;
}

const Dashboard = ({ user }: DashboardProps) => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalPatients: 0,
    inProgress: 0,
    waitingRoom: 0,
    dischargeReady: 0
  });

  useEffect(() => {
    // Simulate fetching dashboard stats
    setStats({
      totalPatients: 24,
      inProgress: 8,
      waitingRoom: 6,
      dischargeReady: 3
    });
  }, []);

  const quickActions = [
    {
      title: "Admit New Patient",
      description: "Start admission process",
      icon: UserPlus,
      action: () => navigate("/admit"),
      color: "bg-blue-600",
      roles: ["physician", "nurse"]
    },
    {
      title: "View Schedule",
      description: "Today's appointments",
      icon: Calendar,
      action: () => navigate("/schedule"),
      color: "bg-green-600",
      roles: ["physician", "nurse"]
    },
    {
      title: "Write Note",
      description: "Create documentation",
      icon: FileText,
      action: () => navigate("/notes"),
      color: "bg-purple-600",
      roles: ["physician", "nurse"]
    }
  ];

  const filteredActions = quickActions.filter(action => 
    action.roles.includes(user.role)
  );

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome back, Dr. {user.name}
          </h1>
          <p className="text-gray-600">
            {new Date().toLocaleDateString('en-US', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </p>
        </div>
        <Button 
          onClick={() => navigate("/admit")}
          className="bg-blue-600 hover:bg-blue-700"
        >
          <Plus className="h-4 w-4 mr-2" />
          Admit Patient
        </Button>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Patients</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalPatients}</div>
            <p className="text-xs text-muted-foreground">Currently in system</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">In Progress</CardTitle>
            <div className="h-4 w-4 bg-yellow-500 rounded-full"></div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.inProgress}</div>
            <p className="text-xs text-muted-foreground">Active cases</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Waiting Room</CardTitle>
            <div className="h-4 w-4 bg-blue-500 rounded-full"></div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.waitingRoom}</div>
            <p className="text-xs text-muted-foreground">Awaiting care</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Discharge Ready</CardTitle>
            <div className="h-4 w-4 bg-green-500 rounded-full"></div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.dischargeReady}</div>
            <p className="text-xs text-muted-foreground">Ready to go</p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Common tasks for your role</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {filteredActions.map((action, index) => (
              <Button
                key={index}
                onClick={action.action}
                className={`h-24 flex flex-col items-center justify-center space-y-2 ${action.color} hover:opacity-90`}
              >
                <action.icon className="h-6 w-6" />
                <div className="text-center">
                  <div className="font-medium">{action.title}</div>
                  <div className="text-xs opacity-90">{action.description}</div>
                </div>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Patient Tracker */}
      <PatientTracker />
    </div>
  );
};

export default Dashboard;
