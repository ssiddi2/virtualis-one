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
      {/* Enhanced Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold text-white brand-font gradient-text tech-glow">
            Clinical Command Center
          </h1>
          <p className="text-virtualis-gold font-semibold tech-font text-lg">
            Welcome, {user.role.charAt(0).toUpperCase() + user.role.slice(1)} {user.name}
          </p>
          <p className="text-white/60 text-sm flex items-center gap-2 mt-2 tech-font">
            <div className="w-2 h-2 bg-green-400 rounded-full pulse-glow"></div>
            {new Date().toLocaleDateString('en-US', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
            <span className="text-virtualis-gold">• All Systems Online</span>
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right">
            <div className="text-sm text-white/60 tech-font">System Load</div>
            <div className="text-2xl font-bold text-virtualis-gold tech-font">{aiStatus.neuralLoad}%</div>
          </div>
          <Button 
            onClick={() => navigate("/admit")}
            className="glass-button tech-font"
          >
            <Plus className="h-4 w-4 mr-2" />
            Quick Admit
          </Button>
        </div>
      </div>

      {/* AI Status Bar */}
      <div className="glass-card p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-8">
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 bg-green-400 rounded-full pulse-glow"></div>
              <span className="text-white font-medium tech-font">AI COPILOT ACTIVE</span>
            </div>
            <div className="flex items-center gap-3">
              <Cpu className="h-5 w-5 text-blue-400" />
              <span className="text-white/80 tech-font">Neural Core Online</span>
            </div>
            <div className="flex items-center gap-3">
              <Network className="h-5 w-5 text-purple-400" />
              <span className="text-white/80 tech-font">Multi-Hospital Sync</span>
            </div>
            <div className="flex items-center gap-3">
              <Brain className="h-5 w-5 text-virtualis-gold" />
              <span className="text-white/80 tech-font">{aiStatus.predictions} AI Insights</span>
            </div>
          </div>
          <div className="glass-badge primary tech-font">
            {aiStatus.alerts} Active Alerts
          </div>
        </div>
      </div>

      {/* Enhanced Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
        <div className="glass-card p-6 hover:scale-105 transition-all duration-300">
          <div className="flex items-center justify-between mb-4">
            <div className="text-white/80 font-medium tech-font">Total Patients</div>
            <Users className="h-5 w-5 text-virtualis-gold" />
          </div>
          <div className="text-3xl font-bold text-white tech-font mb-2">{stats.totalPatients}</div>
          <p className="text-xs text-white/60 tech-font">Across all facilities</p>
        </div>

        <div className="glass-card p-6 hover:scale-105 transition-all duration-300">
          <div className="flex items-center justify-between mb-4">
            <div className="text-white/80 font-medium tech-font">In Progress</div>
            <div className="w-5 h-5 bg-yellow-400 rounded-full pulse-glow"></div>
          </div>
          <div className="text-3xl font-bold text-yellow-400 tech-font mb-2">{stats.inProgress}</div>
          <p className="text-xs text-white/60 tech-font">Active treatments</p>
        </div>

        <div className="glass-card p-6 hover:scale-105 transition-all duration-300">
          <div className="flex items-center justify-between mb-4">
            <div className="text-white/80 font-medium tech-font">Waiting</div>
            <div className="w-5 h-5 bg-blue-400 rounded-full"></div>
          </div>
          <div className="text-3xl font-bold text-blue-400 tech-font mb-2">{stats.waitingRoom}</div>
          <p className="text-xs text-white/60 tech-font">Queue optimized</p>
        </div>

        <div className="glass-card p-6 hover:scale-105 transition-all duration-300">
          <div className="flex items-center justify-between mb-4">
            <div className="text-white/80 font-medium tech-font">Ready</div>
            <div className="w-5 h-5 bg-green-400 rounded-full"></div>
          </div>
          <div className="text-3xl font-bold text-green-400 tech-font mb-2">{stats.dischargeReady}</div>
          <p className="text-xs text-white/60 tech-font">For discharge</p>
        </div>

        <div className="glass-card p-6 hover:scale-105 transition-all duration-300 border-virtualis-gold/30">
          <div className="flex items-center justify-between mb-4">
            <div className="text-white/80 font-medium tech-font">AI Insights</div>
            <Brain className="h-5 w-5 text-virtualis-gold pulse-glow" />
          </div>
          <div className="text-3xl font-bold text-virtualis-gold tech-font mb-2">{stats.aiInsights}</div>
          <p className="text-xs text-virtualis-gold tech-font">Generated today</p>
        </div>
      </div>

      {/* Enhanced Quick Actions */}
      <div className="glass-card p-6">
        <div className="flex items-center gap-3 mb-6">
          <Zap className="h-6 w-6 text-virtualis-gold" />
          <h2 className="text-xl font-bold text-white tech-font">Quick Actions</h2>
          <div className="text-sm text-white/60 tech-font">Powered by AI workflows</div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {filteredActions.map((action, index) => (
            <button
              key={index}
              onClick={action.action}
              className="glass-card p-6 hover:scale-105 transition-all duration-300 text-left group scan-line"
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="p-3 glass-badge primary">
                  <action.icon className="h-6 w-6" />
                </div>
                <div>
                  <div className="font-bold text-white tech-font group-hover:text-virtualis-gold transition-colors">
                    {action.title}
                  </div>
                  <div className="text-sm text-white/60 tech-font">
                    {action.description}
                  </div>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Enhanced Patient Tracker */}
      <PatientTracker />
    </div>
  );
};

export default Dashboard;
