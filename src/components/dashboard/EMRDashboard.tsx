
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Building2, MapPin, Database, Users, Activity, Settings, CheckCircle, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useHospitals } from "@/hooks/useHospitals";
import EMRConnectionDialog from "./EMRConnectionDialog";
import HospitalSelector from "./HospitalSelector";

interface EMRDashboardProps {
  user: any;
  onSelectHospital: (hospitalId: string) => void;
}

const EMRDashboard = ({ user, onSelectHospital }: EMRDashboardProps) => {
  const { toast } = useToast();
  const { data: hospitals, isLoading } = useHospitals();
  const [showConnectionDialog, setShowConnectionDialog] = useState(false);
  const [selectedHospital, setSelectedHospital] = useState<any>(null);

  const handleConnectEMR = (hospital: any) => {
    setSelectedHospital(hospital);
    setShowConnectionDialog(true);
  };

  const handleConnectionComplete = () => {
    setShowConnectionDialog(false);
    toast({
      title: "EMR Integration Successful",
      description: "Healthcare system connection established",
    });
  };

  if (isLoading) {
    return (
      <div className="p-6 space-y-8 min-h-screen" style={{
        background: 'linear-gradient(135deg, hsl(225, 70%, 25%) 0%, hsl(220, 65%, 35%) 25%, hsl(215, 60%, 45%) 50%, hsl(210, 55%, 55%) 75%, hsl(205, 50%, 65%) 100%)'
      }}>
        <div className="text-center text-white">Loading hospitals...</div>
      </div>
    );
  }

  return (
    <>
      <div className="p-4 space-y-4 min-h-screen" style={{
        background: 'linear-gradient(135deg, hsl(225, 70%, 25%) 0%, hsl(220, 65%, 35%) 25%, hsl(215, 60%, 45%) 50%, hsl(210, 55%, 55%) 75%, hsl(205, 50%, 65%) 100%)'
      }}>
        <div className="text-center space-y-2">
          <h1 className="text-2xl font-bold text-white">
            Hospital Network Dashboard
          </h1>
          <p className="text-white/70 text-sm">
            Manage EMR integrations and clinical workflows across your healthcare network
          </p>
        </div>

        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {hospitals?.map((hospital) => (
              <Card key={hospital.id} className="backdrop-blur-xl bg-white/10 border border-white/30 shadow-xl rounded-lg hover:bg-white/15 transition-all duration-300 group">
                <CardHeader className="pb-2 px-3 pt-3">
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <CardTitle className="text-white text-sm font-semibold flex items-center gap-2">
                        <Building2 className="h-3 w-3 text-white" />
                        {hospital.name}
                      </CardTitle>
                      <div className="flex items-center gap-1 text-white/70 text-xs">
                        <MapPin className="h-2 w-2" />
                        {hospital.city}, {hospital.state}
                      </div>
                    </div>
                    {hospital.emr_type ? (
                      <Badge className="bg-green-500/30 text-green-300 border-green-400/40 text-xs px-1 py-0">
                        <CheckCircle className="h-2 w-2 mr-1" />
                        Active
                      </Badge>
                    ) : (
                      <Badge className="bg-orange-500/30 text-orange-300 border-orange-400/40 text-xs px-1 py-0">
                        <AlertCircle className="h-2 w-2 mr-1" />
                        Pending
                      </Badge>
                    )}
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-2 pt-0 px-3 pb-3">
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="flex items-center gap-1 text-white/70">
                      <Database className="h-2 w-2" />
                      <span className="text-xs">{hospital.emr_type || 'Not Set'}</span>
                    </div>
                    <div className="flex items-center gap-1 text-white/70">
                      <Users className="h-2 w-2" />
                      <span className="text-xs">{hospital.phone || 'No phone'}</span>
                    </div>
                  </div>
                  
                  <div className="flex gap-1 pt-1">
                    <Button
                      onClick={() => onSelectHospital(hospital.id)}
                      size="sm"
                      className="flex-1 bg-white/20 hover:bg-white/30 border border-white/30 text-white text-xs h-6"
                    >
                      <Activity className="h-2 w-2 mr-1" />
                      Access
                    </Button>
                    
                    <Button
                      onClick={() => handleConnectEMR(hospital)}
                      size="sm"
                      variant="outline"
                      className="bg-white/10 hover:bg-white/20 border-white/30 text-white text-xs h-6 px-2"
                    >
                      <Settings className="h-2 w-2" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
            
            <Card className="backdrop-blur-xl bg-white/10 border border-white/30 shadow-xl rounded-lg hover:bg-white/15 transition-all duration-300 group border-dashed">
              <CardContent className="flex flex-col items-center justify-center p-4 text-center space-y-2">
                <Plus className="h-6 w-6 text-white/70" />
                <div>
                  <h3 className="text-white font-medium text-sm">Add Hospital</h3>
                  <p className="text-white/70 text-xs">Connect new healthcare facility</p>
                </div>
                <Button
                  size="sm"
                  className="bg-white/20 hover:bg-white/30 border border-white/30 text-white text-xs h-6 px-3"
                >
                  <Plus className="h-2 w-2 mr-1" />
                  Add
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>

        <HospitalSelector onSelectHospital={onSelectHospital} />
      </div>

      {showConnectionDialog && selectedHospital && (
        <EMRConnectionDialog
          isOpen={showConnectionDialog}
          hospitalName={selectedHospital.name}
          emrType={selectedHospital.emr_type}
          onComplete={handleConnectionComplete}
        />
      )}
    </>
  );
};

export default EMRDashboard;
