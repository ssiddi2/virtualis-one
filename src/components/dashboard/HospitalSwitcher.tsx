import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Hospital, LogOut, Search, Wifi, AlertTriangle, CheckCircle, RefreshCw, ArrowRight } from 'lucide-react';
import { useMultiHospital } from '@/contexts/MultiHospitalContext';
import { useAuth } from '@/contexts/EnterpriseAuthContext';
import { cn } from '@/lib/utils';

export default function HospitalSwitcher() {
  const { activeConnection, authorizedHospitals, isConnecting, connectionSteps, connect, disconnect, switchHospital } = useMultiHospital();
  const { profile } = useAuth();
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [showSwitch, setShowSwitch] = useState(false);
  const [showDisconnect, setShowDisconnect] = useState(false);
  const [pendingHospitalId, setPendingHospitalId] = useState<string | null>(null);

  const filtered = authorizedHospitals.filter(h => 
    h.name.toLowerCase().includes(search.toLowerCase()) || 
    h.emrType.toLowerCase().includes(search.toLowerCase())
  );
  const pendingHospital = authorizedHospitals.find(h => h.id === pendingHospitalId);

  const handleClick = async (hospitalId: string) => {
    if (activeConnection?.hospitalId === hospitalId) { 
      navigate('/my-patients'); 
      return; 
    }
    if (activeConnection) { 
      setPendingHospitalId(hospitalId); 
      setShowSwitch(true); 
    } else { 
      const success = await connect(hospitalId); 
      if (success) navigate('/my-patients'); 
    }
  };

  const handleSwitch = async () => {
    if (!pendingHospitalId) return;
    setShowSwitch(false);
    const success = await switchHospital(pendingHospitalId);
    setPendingHospitalId(null);
    if (success) navigate('/my-patients');
  };

  return (
    <div className="min-h-screen p-6" style={{ background: 'linear-gradient(135deg, hsl(225, 70%, 25%) 0%, hsl(220, 65%, 35%) 50%, hsl(215, 60%, 45%) 100%)' }}>
      <div className="max-w-5xl mx-auto space-y-6">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Hospital Access</h1>
          <p className="text-white/60">Welcome, Dr. {profile?.last_name || 'User'}. Select a hospital to connect.</p>
        </div>

        {activeConnection && (
          <Card className="bg-green-500/10 border-green-500/30">
            <CardContent className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center">
                  <Wifi className="h-6 w-6 text-green-400" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-white font-semibold">{activeConnection.hospitalName}</h3>
                    <Badge className="bg-green-500/20 text-green-300">Connected</Badge>
                  </div>
                  <p className="text-white/60 text-sm">{activeConnection.emrType}</p>
                </div>
              </div>
              <div className="flex gap-2">
                <Button onClick={() => navigate('/my-patients')} className="bg-green-600 hover:bg-green-700">
                  Continue <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
                <Button variant="outline" onClick={() => setShowDisconnect(true)} className="border-red-400/50 text-red-300 hover:bg-red-500/20">
                  <LogOut className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {isConnecting && (
          <Card className="bg-blue-500/10 border-blue-500/30">
            <CardContent className="p-6 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-white font-semibold">Establishing Connection...</h3>
                <RefreshCw className="h-5 w-5 text-blue-400 animate-spin" />
              </div>
              <div className="space-y-2">
                {connectionSteps.map(step => (
                  <div key={step.id} className={cn(
                    "flex items-center gap-3 p-3 rounded-lg",
                    step.status === 'active' && "bg-blue-500/20",
                    step.status === 'complete' && "bg-green-500/10"
                  )}>
                    {step.status === 'complete' && <CheckCircle className="h-5 w-5 text-green-400" />}
                    {step.status === 'active' && <RefreshCw className="h-4 w-4 text-blue-400 animate-spin" />}
                    {step.status === 'pending' && <div className="w-2 h-2 rounded-full bg-white/30" />}
                    <span className={cn(
                      "text-sm",
                      step.status === 'active' && "text-white",
                      step.status === 'complete' && "text-green-300",
                      step.status === 'pending' && "text-white/50"
                    )}>{step.label}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        <div className="relative max-w-md mx-auto">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/40" />
          <Input 
            placeholder="Search hospitals..." 
            value={search} 
            onChange={(e) => setSearch(e.target.value)} 
            className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-white/40" 
          />
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filtered.map(hospital => {
            const isActive = activeConnection?.hospitalId === hospital.id;
            return (
              <Card 
                key={hospital.id} 
                onClick={() => !isConnecting && handleClick(hospital.id)} 
                className={cn(
                  "cursor-pointer transition-all hover:scale-[1.02]",
                  isActive ? "bg-green-500/20 border-green-500/50" : "bg-white/10 border-white/20",
                  isConnecting && "opacity-50 pointer-events-none"
                )}
              >
                <CardContent className="p-4 flex items-start gap-3">
                  <div className={cn(
                    "w-10 h-10 rounded-lg flex items-center justify-center",
                    isActive ? "bg-green-500/30" : "bg-blue-500/20"
                  )}>
                    <Hospital className={cn("h-5 w-5", isActive ? "text-green-400" : "text-blue-400")} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="text-white font-medium truncate">{hospital.name}</h3>
                      {isActive && <Wifi className="h-4 w-4 text-green-400" />}
                    </div>
                    <p className="text-white/60 text-sm">{hospital.location}</p>
                    <Badge variant="outline" className="mt-2 text-white/70 border-white/30 text-xs">
                      {hospital.emrType}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      <Dialog open={showSwitch} onOpenChange={setShowSwitch}>
        <DialogContent className="bg-slate-900 border-slate-700">
          <DialogHeader>
            <DialogTitle className="text-white">
              <RefreshCw className="h-5 w-5 text-blue-400 inline mr-2" />
              Switch Hospital?
            </DialogTitle>
          </DialogHeader>
          <div className="py-4 text-slate-400">
            <p>Switch from <span className="text-white">{activeConnection?.hospitalName}</span> to <span className="text-white">{pendingHospital?.name}</span>?</p>
            <div className="mt-3 p-3 bg-yellow-500/10 border border-yellow-500/30 rounded-lg text-yellow-300 text-sm flex gap-2">
              <AlertTriangle className="h-4 w-4 mt-0.5 flex-shrink-0" /> 
              This will disconnect from current hospital.
            </div>
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setShowSwitch(false)}>Cancel</Button>
            <Button onClick={handleSwitch} className="bg-blue-600">Switch</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={showDisconnect} onOpenChange={setShowDisconnect}>
        <DialogContent className="bg-slate-900 border-slate-700">
          <DialogHeader>
            <DialogTitle className="text-white">
              <LogOut className="h-5 w-5 text-red-400 inline mr-2" />
              Disconnect?
            </DialogTitle>
          </DialogHeader>
          <p className="py-4 text-slate-400">End session with {activeConnection?.hospitalName}?</p>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setShowDisconnect(false)}>Cancel</Button>
            <Button variant="destructive" onClick={() => { disconnect(); setShowDisconnect(false); }}>Disconnect</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
