import { useState, useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/EnterpriseAuthContext";
import { 
  Hospital, 
  Search,
  Users,
  Brain,
  ChevronRight,
  ArrowRight
} from "lucide-react";

import { HospitalSelectorProps, EnhancedHospital } from '@/types/hospital';
import { mockHospitals } from '@/data/demoHospitals';
import { useToast } from '@/hooks/use-toast';
import { HospitalDetailModal } from './HospitalDetailsModal';
import EMRConnectionModal from '@/components/emr/EMRConnectionModal';

const SimpleHospitalSelector: React.FC<HospitalSelectorProps> = ({ 
  onSelectHospital, 
  emergencyMode = false
}) => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("online");
  const [showHospitalDetails, setShowHospitalDetails] = useState<string | null>(null);
  const [showConnectionModal, setShowConnectionModal] = useState(false);
  const [selectedHospitalForConnection, setSelectedHospitalForConnection] = useState<EnhancedHospital | null>(null);
  const [rememberHospital, setRememberHospital] = useState(false);
  const { user } = useAuth();

  const filteredHospitals = useMemo(() => {
    return mockHospitals
      .filter(hospital => {
        const matchesSearch = hospital.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                             hospital.location.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter === "all" || hospital.status === statusFilter;
        
        if (emergencyMode) {
          return matchesSearch && hospital.status === 'online' && hospital.connectionHealth !== 'critical';
        }
        
        return matchesSearch && matchesStatus;
      })
      .sort((a, b) => {
        if (a.status === 'online' && b.status !== 'online') return -1;
        if (b.status === 'online' && a.status !== 'online') return 1;
        return b.overallScore - a.overallScore;
      });
  }, [searchTerm, statusFilter, emergencyMode]);

  const handleHospitalSelect = (hospital: EnhancedHospital) => {
    setSelectedHospitalForConnection(hospital);
    setShowConnectionModal(true);
  };

  const handleConnectionComplete = async () => {
    if (selectedHospitalForConnection) {
      if (rememberHospital && user) {
        try {
          await supabase
            .from('profiles')
            .update({ hospital_id: selectedHospitalForConnection.id })
            .eq('id', user.id);
          
          toast({
            title: "Hospital Saved",
            description: `${selectedHospitalForConnection.name} will be your default hospital`,
          });
        } catch (error) {
          console.error('Failed to save hospital preference:', error);
        }
      }
      
      onSelectHospital(selectedHospitalForConnection.id);
      setSelectedHospitalForConnection(null);
      setRememberHospital(false);
    }
  };

  const onlineCount = filteredHospitals.filter(h => h.status === 'online').length;
  const aiCount = filteredHospitals.filter(h => h.virtualisEnabled).length;
  const totalPatients = filteredHospitals.reduce((acc, h) => acc + h.activePatients, 0);

  return (
    <div className="min-h-screen bg-background">
      {/* Single subtle background glow */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-3xl" />
      </div>
      
      <div className="container mx-auto px-6 py-16 max-w-6xl relative z-10">
        {/* Hero - Clean & Bold */}
        <header className="text-center mb-16">
          <h1 className="text-5xl md:text-7xl font-black tracking-tight text-foreground mb-4">
            {emergencyMode ? 'Emergency Access' : 'Select Hospital'}
          </h1>
          <p className="text-lg text-muted-foreground">
            {emergencyMode 
              ? 'Quick access to critical systems' 
              : 'Access your integrated EMR system'}
          </p>
        </header>

        {/* Stats Bar - Minimal */}
        <div className="flex items-center justify-center gap-8 md:gap-16 mb-12 text-sm">
          <div className="text-center">
            <span className="text-3xl font-bold text-foreground">{onlineCount}</span>
            <p className="text-muted-foreground">Online</p>
          </div>
          <div className="w-px h-8 bg-border" />
          <div className="text-center">
            <span className="text-3xl font-bold text-foreground">{aiCount}</span>
            <p className="text-muted-foreground">AI Enabled</p>
          </div>
          <div className="w-px h-8 bg-border" />
          <div className="text-center">
            <span className="text-3xl font-bold text-foreground">{totalPatients.toLocaleString()}</span>
            <p className="text-muted-foreground">Patients</p>
          </div>
        </div>

        {/* Search Bar - Clean */}
        <div className="flex flex-col sm:flex-row gap-3 mb-12 max-w-2xl mx-auto">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search hospitals..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-11 h-12 bg-card border-border/50 focus:border-primary"
            />
          </div>
          {!emergencyMode && (
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-36 h-12 bg-card border-border/50">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="online">Online</SelectItem>
                <SelectItem value="degraded">Degraded</SelectItem>
                <SelectItem value="maintenance">Maintenance</SelectItem>
              </SelectContent>
            </Select>
          )}
        </div>

        {/* Hospital Cards Grid */}
        <div className="grid gap-4 md:grid-cols-2">
          {filteredHospitals.map((hospital, index) => {
            const isOnline = hospital.status === 'online';
            const isDisabled = hospital.status === 'maintenance' || hospital.status === 'offline';
            
            return (
              <Card 
                key={hospital.id}
                className={`group relative border bg-card transition-all duration-300 hover:shadow-lg hover:shadow-primary/5 ${
                  isOnline ? 'border-border hover:border-primary/40' : 'border-border/50 opacity-75'
                }`}
                style={{ animationDelay: `${index * 50}ms` }}
              >
                {/* Status accent line */}
                <div className={`absolute left-0 top-0 bottom-0 w-1 rounded-l-lg ${
                  hospital.status === 'online' ? 'bg-green-500' :
                  hospital.status === 'degraded' ? 'bg-amber-500' :
                  'bg-muted'
                }`} />
                
                <CardContent className="p-6 pl-8">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      {/* Hospital Name */}
                      <h3 className="text-xl font-bold text-foreground truncate mb-1 group-hover:text-primary transition-colors">
                        {hospital.name}
                      </h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        {hospital.location}
                      </p>
                      
                      {/* Info Row */}
                      <div className="flex items-center gap-4 text-sm">
                        <span className="flex items-center gap-1.5 text-muted-foreground">
                          <Users className="h-4 w-4" />
                          {hospital.activePatients}
                        </span>
                        <span className="text-muted-foreground/50">•</span>
                        <span className="text-muted-foreground">{hospital.emrType}</span>
                        {hospital.virtualisEnabled && (
                          <>
                            <span className="text-muted-foreground/50">•</span>
                            <span className="flex items-center gap-1.5 text-primary">
                              <Brain className="h-4 w-4" />
                              AI
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                    
                    {/* Status & Action */}
                    <div className="flex flex-col items-end gap-3 ml-4">
                      <div className={`flex items-center gap-2 text-xs font-medium ${
                        hospital.status === 'online' ? 'text-green-500' :
                        hospital.status === 'degraded' ? 'text-amber-500' :
                        'text-muted-foreground'
                      }`}>
                        <span className={`w-2 h-2 rounded-full ${
                          hospital.status === 'online' ? 'bg-green-500' :
                          hospital.status === 'degraded' ? 'bg-amber-500' :
                          'bg-muted'
                        }`} />
                        {hospital.status.charAt(0).toUpperCase() + hospital.status.slice(1)}
                      </div>
                      
                      <Button
                        onClick={() => handleHospitalSelect(hospital)}
                        disabled={isDisabled}
                        size="sm"
                        className={`${
                          isOnline 
                            ? 'bg-primary hover:bg-primary/90 text-primary-foreground' 
                            : 'bg-muted text-muted-foreground'
                        }`}
                      >
                        Connect
                        <ArrowRight className="h-4 w-4 ml-1 group-hover:translate-x-0.5 transition-transform" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Empty State */}
        {filteredHospitals.length === 0 && (
          <div className="text-center py-16">
            <Hospital className="h-12 w-12 text-muted-foreground/50 mx-auto mb-4" />
            <p className="text-muted-foreground">No hospitals found</p>
          </div>
        )}

        {/* Remember Hospital Option */}
        {selectedHospitalForConnection && (
          <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50">
            <div className="flex items-center gap-3 bg-card border border-border px-4 py-3 rounded-lg shadow-xl">
              <Checkbox 
                id="remember" 
                checked={rememberHospital}
                onCheckedChange={(checked) => setRememberHospital(checked as boolean)}
              />
              <label htmlFor="remember" className="text-sm text-muted-foreground cursor-pointer">
                Remember my selection
              </label>
            </div>
          </div>
        )}
      </div>

      {/* Modals */}
      {filteredHospitals.map(hospital => (
        <HospitalDetailModal
          key={hospital.id}
          hospital={hospital}
          showHospitalDetails={showHospitalDetails}
          setShowHospitalDetails={setShowHospitalDetails}
        />
      ))}

      <EMRConnectionModal
        isOpen={showConnectionModal}
        onClose={() => {
          setShowConnectionModal(false);
          setSelectedHospitalForConnection(null);
        }}
        hospital={selectedHospitalForConnection}
        onConnectionComplete={handleConnectionComplete}
      />
    </div>
  );
};

export default SimpleHospitalSelector;
