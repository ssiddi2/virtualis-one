
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  ArrowLeft, 
  Activity, 
  Users, 
  Stethoscope, 
  FileText, 
  Clipboard,
  Monitor,
  Heart,
  Brain
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Clinical = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen p-6" style={{
      background: 'linear-gradient(135deg, hsl(225, 70%, 25%) 0%, hsl(220, 65%, 35%) 25%, hsl(215, 60%, 45%) 50%, hsl(210, 55%, 55%) 75%, hsl(205, 50%, 65%) 100%)'
    }}>
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button 
            onClick={() => navigate('/dashboard')}
            variant="outline"
            className="border-white/30 text-white hover:bg-white/10"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-white">Clinical Workflows</h1>
            <p className="text-white/70">Access clinical tools and patient management systems</p>
          </div>
        </div>

        {/* Clinical Tools Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Physician Tools */}
          <Card 
            className="backdrop-blur-xl bg-blue-500/20 border border-blue-300/30 cursor-pointer hover:bg-blue-500/30 transition-colors"
            onClick={() => navigate('/physician-rounding')}
          >
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <Stethoscope className="h-6 w-6" />
                Physician Rounding
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-white/70 mb-4">Patient census and rounding workflow management</p>
              <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                Access Rounding List
              </Button>
            </CardContent>
          </Card>

          {/* Nursing Tools */}
          <Card 
            className="backdrop-blur-xl bg-green-500/20 border border-green-300/30 cursor-pointer hover:bg-green-500/30 transition-colors"
            onClick={() => navigate('/nursing-workstation')}
          >
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <Heart className="h-6 w-6" />
                Nursing Workstation
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-white/70 mb-4">Nursing assessments, medication administration, and care plans</p>
              <Button className="w-full bg-green-600 hover:bg-green-700 text-white">
                Open Workstation
              </Button>
            </CardContent>
          </Card>

          {/* ER Patient Tracker */}
          <Card 
            className="backdrop-blur-xl bg-red-500/20 border border-red-300/30 cursor-pointer hover:bg-red-500/30 transition-colors"
            onClick={() => navigate('/er-patient-tracker')}
          >
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <Activity className="h-6 w-6" />
                ER Patient Tracker
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-white/70 mb-4">Emergency department patient tracking and triage</p>
              <Button className="w-full bg-red-600 hover:bg-red-700 text-white">
                View ER Board
              </Button>
            </CardContent>
          </Card>

          {/* Team Messaging */}
          <Card 
            className="backdrop-blur-xl bg-purple-500/20 border border-purple-300/30 cursor-pointer hover:bg-purple-500/30 transition-colors"
            onClick={() => navigate('/team-messaging')}
          >
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <Users className="h-6 w-6" />
                Team Messaging
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-white/70 mb-4">Secure clinical communication and consultation</p>
              <Button className="w-full bg-purple-600 hover:bg-purple-700 text-white">
                Open Messages
              </Button>
            </CardContent>
          </Card>

          {/* CPOE System */}
          <Card 
            className="backdrop-blur-xl bg-orange-500/20 border border-orange-300/30 cursor-pointer hover:bg-orange-500/30 transition-colors"
          >
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <Clipboard className="h-6 w-6" />
                CPOE System
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-white/70 mb-4">Computerized Provider Order Entry system</p>
              <Button 
                className="w-full bg-orange-600 hover:bg-orange-700 text-white"
                onClick={() => navigate('/cpoe/demo-patient')}
              >
                Access CPOE
              </Button>
            </CardContent>
          </Card>

          {/* Command Center */}
          <Card 
            className="backdrop-blur-xl bg-cyan-500/20 border border-cyan-300/30 cursor-pointer hover:bg-cyan-500/30 transition-colors"
          >
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <Monitor className="h-6 w-6" />
                Command Center
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-white/70 mb-4">Hospital operations and real-time monitoring</p>
              <Button className="w-full bg-cyan-600 hover:bg-cyan-700 text-white">
                View Dashboard
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card className="backdrop-blur-xl bg-blue-500/10 border border-blue-300/30">
          <CardHeader>
            <CardTitle className="text-white">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Button 
                onClick={() => navigate('/consult-request')}
                className="bg-blue-600 hover:bg-blue-700 text-white h-16 flex-col"
              >
                <Brain className="h-5 w-5 mb-1" />
                Request Consult
              </Button>
              
              <Button 
                onClick={() => navigate('/patients')}
                className="bg-green-600 hover:bg-green-700 text-white h-16 flex-col"
              >
                <Users className="h-5 w-5 mb-1" />
                Patient List
              </Button>
              
              <Button className="bg-purple-600 hover:bg-purple-700 text-white h-16 flex-col">
                <FileText className="h-5 w-5 mb-1" />
                New Note
              </Button>
              
              <Button className="bg-orange-600 hover:bg-orange-700 text-white h-16 flex-col">
                <Activity className="h-5 w-5 mb-1" />
                Lab Orders
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Clinical;
