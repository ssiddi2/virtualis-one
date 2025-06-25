
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { Users, UserPlus, FileText, Calendar, Plus, Brain, Zap, Activity, Cpu, Network, Bot } from "lucide-react";
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
    dischargeReady: 0,
    aiInsights: 0
  });

  const [aiStatus, setAiStatus] = useState({
    copilotActive: true,
    neuralLoad: 73,
    predictions: 12,
    alerts: 3
  });

  useEffect(() => {
    // Simulate fetching dashboard stats
    setStats({
      totalPatients: 24,
      inProgress: 8,
      waitingRoom: 6,
      dischargeReady: 3,
      aiInsights: 15
    });
  }, []);

  const quickActions = [
    {
      title: "AI Patient Admit",
      description: "Neural-guided admission",
      icon: UserPlus,
      action: () => navigate("/admit"),
      color: "ai-button",
      roles: ["physician", "nurse"]
    },
    {
      title: "Quantum Schedule",
      description: "AI-optimized calendar",
      icon: Calendar,
      action: () => navigate("/schedule"),
      color: "bg-gradient-to-r from-green-600 to-emerald-500 hover:from-green-500 hover:to-emerald-400",
      roles: ["physician", "nurse"]
    },
    {
      title: "Neural Copilot",
      description: "AI documentation assist",
      icon: Brain,
      action: () => navigate("/copilot"),
      color: "bg-gradient-to-r from-purple-600 to-violet-500 hover:from-purple-500 hover:to-violet-400",
      roles: ["physician", "nurse"]
    }
  ];

  const filteredActions = quickActions.filter(action => 
    action.roles.includes(user.role)
  );

  return (
    <div className="p-6 space-y-6 min-h-screen">
      {/* AI Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold text-white tech-font ai-text-glow">
            NEURAL COMMAND CENTER
          </h1>
          <p className="text-virtualis-gold font-semibold tech-font">
            Welcome, {user.role.toUpperCase()} {user.name?.toUpperCase()}
          </p>
          <p className="text-slate-400 text-sm flex items-center gap-2 mt-1">
            <Activity className="h-4 w-4 text-green-400" />
            {new Date().toLocaleDateString('en-US', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
            <span className="text-virtualis-gold">• AI SYSTEMS ACTIVE</span>
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right">
            <div className="text-sm text-slate-400 tech-font">NEURAL LOAD</div>
            <div className="text-2xl font-bold text-virtualis-gold tech-font">{aiStatus.neuralLoad}%</div>
          </div>
          <Button 
            onClick={() => navigate("/admit")}
            className="ai-button ai-float"
          >
            <Plus className="h-4 w-4 mr-2" />
            <span className="tech-font">NEURAL ADMIT</span>
          </Button>
        </div>
      </div>

      {/* AI Status Bar */}
      <Card className="ai-card border-virtualis-gold/30">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-400 rounded-full ai-pulse"></div>
                <span className="text-sm font-medium text-white tech-font">AI COPILOT</span>
              </div>
              <div className="flex items-center gap-2">
                <Cpu className="h-4 w-4 text-blue-400" />
                <span className="text-sm text-slate-300 tech-font">QUANTUM CORE: ONLINE</span>
              </div>
              <div className="flex items-center gap-2">
                <Network className="h-4 w-4 text-purple-400" />
                <span className="text-sm text-slate-300 tech-font">NEURAL MESH: SYNCED</span>
              </div>
              <div className="flex items-center gap-2">
                <Bot className="h-4 w-4 text-virtualis-gold" />
                <span className="text-sm text-slate-300 tech-font">{aiStatus.predictions} PREDICTIONS</span>
              </div>
            </div>
            <Badge className="bg-virtualis-gold/20 text-virtualis-gold border-virtualis-gold/50 tech-font">
              {aiStatus.alerts} AI ALERTS
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Enhanced Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card className="ai-card hover:ai-glow transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-white tech-font">TOTAL PATIENTS</CardTitle>
            <Users className="h-4 w-4 text-virtualis-gold" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-white tech-font">{stats.totalPatients}</div>
            <p className="text-xs text-slate-400 tech-font">Neural network active</p>
          </CardContent>
        </Card>

        <Card className="ai-card hover:ai-glow transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-white tech-font">IN PROGRESS</CardTitle>
            <div className="h-4 w-4 bg-yellow-500 rounded-full ai-pulse"></div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-yellow-400 tech-font">{stats.inProgress}</div>
            <p className="text-xs text-slate-400 tech-font">AI monitoring</p>
          </CardContent>
        </Card>

        <Card className="ai-card hover:ai-glow transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-white tech-font">WAITING ROOM</CardTitle>
            <div className="h-4 w-4 bg-blue-500 rounded-full"></div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-400 tech-font">{stats.waitingRoom}</div>
            <p className="text-xs text-slate-400 tech-font">Queue optimized</p>
          </CardContent>
        </Card>

        <Card className="ai-card hover:ai-glow transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-white tech-font">DISCHARGE</CardTitle>
            <div className="h-4 w-4 bg-green-500 rounded-full"></div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-400 tech-font">{stats.dischargeReady}</div>
            <p className="text-xs text-slate-400 tech-font">AI verified</p>
          </CardContent>
        </Card>

        <Card className="ai-card hover:ai-glow transition-all duration-300 border-virtualis-gold/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-white tech-font">AI INSIGHTS</CardTitle>
            <Brain className="h-4 w-4 text-virtualis-gold ai-pulse" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-virtualis-gold tech-font">{stats.aiInsights}</div>
            <p className="text-xs text-virtualis-gold tech-font">Neural analysis</p>
          </CardContent>
        </Card>
      </div>

      {/* Enhanced Quick Actions */}
      <Card className="ai-card">
        <CardHeader>
          <CardTitle className="text-white tech-font flex items-center gap-2">
            <Zap className="h-5 w-5 text-virtualis-gold" />
            QUANTUM ACTIONS
          </CardTitle>
          <CardDescription className="text-slate-400 tech-font">
            AI-powered workflows for {user.role} operations
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {filteredActions.map((action, index) => (
              <Button
                key={index}
                onClick={action.action}
                className={`h-28 flex flex-col items-center justify-center space-y-3 ${action.color} hover:scale-105 transition-all duration-300 ai-scan-line`}
              >
                <action.icon className="h-8 w-8" />
                <div className="text-center">
                  <div className="font-bold tech-font">{action.title}</div>
                  <div className="text-xs opacity-90 tech-font">{action.description}</div>
                </div>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Enhanced Patient Tracker */}
      <PatientTracker />
    </div>
  );
};

export default Dashboard;
