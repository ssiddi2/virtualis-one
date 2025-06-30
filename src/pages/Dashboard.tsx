
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Activity, Users, Calendar, FileText, AlertTriangle, TrendingUp } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  if (!user) {
    navigate('/login');
    return null;
  }

  return (
    <div className="min-h-screen p-6" style={{
      background: 'linear-gradient(135deg, hsl(225, 70%, 25%) 0%, hsl(220, 65%, 35%) 25%, hsl(215, 60%, 45%) 50%, hsl(210, 55%, 55%) 75%, hsl(205, 50%, 65%) 100%)'
    }}>
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-white">Livemed EMR Dashboard</h1>
            <p className="text-white/70">Welcome back, {user.email}</p>
          </div>
          <div className="flex gap-3">
            <Button 
              onClick={() => navigate('/clinical')}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              <Activity className="h-4 w-4 mr-2" />
              Clinical
            </Button>
            <Button 
              onClick={logout}
              variant="outline"
              className="border-white/30 text-white hover:bg-white/10"
            >
              Logout
            </Button>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="backdrop-blur-xl bg-blue-500/20 border border-blue-300/30">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-white">
                <Users className="h-5 w-5" />
                Active Patients
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">142</div>
              <p className="text-white/70 text-sm">+12 from yesterday</p>
            </CardContent>
          </Card>

          <Card className="backdrop-blur-xl bg-green-500/20 border border-green-300/30">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-white">
                <Calendar className="h-5 w-5" />
                Appointments
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">28</div>
              <p className="text-white/70 text-sm">Today's schedule</p>
            </CardContent>
          </Card>

          <Card className="backdrop-blur-xl bg-yellow-500/20 border border-yellow-300/30">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-white">
                <AlertTriangle className="h-5 w-5" />
                Critical Alerts
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">3</div>
              <p className="text-white/70 text-sm">Requires attention</p>
            </CardContent>
          </Card>

          <Card className="backdrop-blur-xl bg-purple-500/20 border border-purple-300/30">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-white">
                <FileText className="h-5 w-5" />
                Pending Tasks
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">15</div>
              <p className="text-white/70 text-sm">Documentation needed</p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Button 
            onClick={() => navigate('/patients')}
            className="h-20 bg-blue-600 hover:bg-blue-700 text-white flex-col"
          >
            <Users className="h-6 w-6 mb-2" />
            Patient Management
          </Button>
          
          <Button 
            onClick={() => navigate('/physician-rounding')}
            className="h-20 bg-green-600 hover:bg-green-700 text-white flex-col"
          >
            <Activity className="h-6 w-6 mb-2" />
            Physician Rounding
          </Button>
          
          <Button 
            onClick={() => navigate('/nursing-workstation')}
            className="h-20 bg-purple-600 hover:bg-purple-700 text-white flex-col"
          >
            <FileText className="h-6 w-6 mb-2" />
            Nursing Workstation
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
