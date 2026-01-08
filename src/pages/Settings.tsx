
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Settings as SettingsIcon, User, Shield, Bell, Network } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import EMRIntegrationPanel from '@/components/dashboard/EMRIntegrationPanel';
import { supabase } from '@/integrations/supabase/client';

const Settings = () => {
  const navigate = useNavigate();
  const [showEMRPanel, setShowEMRPanel] = useState(false);
  const [hospital, setHospital] = useState<{ id: string; name: string; location: string; emr_type: string } | null>(null);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const loadUserAndHospital = async () => {
      const { data: { user: authUser } } = await supabase.auth.getUser();
      if (authUser) {
        setUser(authUser);
        const { data: profile } = await supabase
          .from('profiles')
          .select('hospital_id')
          .eq('id', authUser.id)
          .single();
        
        if (profile?.hospital_id) {
          const { data: hospitalData } = await supabase
            .from('hospitals')
            .select('id, name, city, state, emr_type')
            .eq('id', profile.hospital_id)
            .single();
          
          if (hospitalData) {
            setHospital({
              id: hospitalData.id,
              name: hospitalData.name,
              location: `${hospitalData.city}, ${hospitalData.state}`,
              emr_type: hospitalData.emr_type
            });
          }
        }
      }
    };
    loadUserAndHospital();
  }, []);

  if (showEMRPanel && hospital && user) {
    return (
      <EMRIntegrationPanel
        hospital={hospital}
        user={user}
        onBack={() => setShowEMRPanel(false)}
        onSave={() => setShowEMRPanel(false)}
      />
    );
  }

  return (
    <div className="min-h-screen p-6" style={{
      background: 'linear-gradient(135deg, hsl(225, 70%, 25%) 0%, hsl(220, 65%, 35%) 25%, hsl(215, 60%, 45%) 50%, hsl(210, 55%, 55%) 75%, hsl(205, 50%, 65%) 100%)'
    }}>
      <div className="max-w-4xl mx-auto space-y-6">
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
            <h1 className="text-3xl font-bold text-white">System Settings</h1>
            <p className="text-white/70">Configure your EMR preferences</p>
          </div>
        </div>

        {/* Settings Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* EMR Integration Card */}
          <Card className="backdrop-blur-xl bg-cyan-500/20 border border-cyan-300/30 md:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <Network className="h-5 w-5" />
                EMR Integration
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-white/70">
                Connect to Epic, Cerner, or other EMR systems using FHIR APIs
              </p>
              <div className="flex items-center gap-4">
                <Button 
                  onClick={() => setShowEMRPanel(true)}
                  className="bg-cyan-600 hover:bg-cyan-700 text-white"
                  disabled={!hospital}
                >
                  Configure EMR Connection
                </Button>
                {!hospital && (
                  <span className="text-white/50 text-sm">
                    Login required to configure EMR
                  </span>
                )}
              </div>
            </CardContent>
          </Card>

          <Card className="backdrop-blur-xl bg-blue-500/20 border border-blue-300/30">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <User className="h-5 w-5" />
                User Profile
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-white/70">Manage your personal information and preferences</p>
              <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                Edit Profile
              </Button>
            </CardContent>
          </Card>

          <Card className="backdrop-blur-xl bg-green-500/20 border border-green-300/30">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <Shield className="h-5 w-5" />
                Security
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-white/70">Configure security settings and access controls</p>
              <Button className="bg-green-600 hover:bg-green-700 text-white">
                Security Settings
              </Button>
            </CardContent>
          </Card>

          <Card className="backdrop-blur-xl bg-purple-500/20 border border-purple-300/30">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <Bell className="h-5 w-5" />
                Notifications
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-white/70">Manage alert preferences and notification settings</p>
              <Button className="bg-purple-600 hover:bg-purple-700 text-white">
                Notification Settings
              </Button>
            </CardContent>
          </Card>

          <Card className="backdrop-blur-xl bg-orange-500/20 border border-orange-300/30">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <SettingsIcon className="h-5 w-5" />
                System
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-white/70">System configuration and administrative tools</p>
              <Button className="bg-orange-600 hover:bg-orange-700 text-white">
                System Config
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Settings;
