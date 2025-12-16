import { useState, useMemo, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/EnterpriseAuthContext";
import { 
  Hospital, 
  Search,
  Activity,
  Users,
  Brain,
  Zap,
  ChevronDown,
  ChevronUp,
  Settings,
  Eye
} from "lucide-react";

import { HospitalSelectorProps, EnhancedHospital } from '@/types/hospital';
import { mockHospitals } from '@/data/demoHospitals';
import { getStatusBadge } from '@/utils/hospitalHelpers';
import { useToast } from '@/hooks/use-toast';
import { HospitalDetailModal } from './HospitalDetailsModal';
import EMRConnectionModal from '@/components/emr/EMRConnectionModal';

type ViewMode = 'simple' | 'advanced';
type UserRole = 'clinician' | 'admin' | 'emergency';

const SimpleHospitalSelector: React.FC<HospitalSelectorProps> = ({ 
  onSelectHospital, 
  emergencyMode = false
}) => {
  const { toast } = useToast();
  
  // Core state
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("online");
  const [viewMode, setViewMode] = useState<ViewMode>('simple');
  const [userRole, setUserRole] = useState<UserRole>(emergencyMode ? 'emergency' : 'clinician');
  const [expandedCards, setExpandedCards] = useState<Set<string>>(new Set());
  const [showHospitalDetails, setShowHospitalDetails] = useState<string | null>(null);
  const [showConnectionModal, setShowConnectionModal] = useState(false);
  const [selectedHospitalForConnection, setSelectedHospitalForConnection] = useState<EnhancedHospital | null>(null);
  const [rememberHospital, setRememberHospital] = useState(false);
  const { user } = useAuth();

  // Filtered hospitals based on role and filters
  const filteredHospitals = useMemo(() => {
    return mockHospitals
      .filter(hospital => {
        const matchesSearch = hospital.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                             hospital.location.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter === "all" || hospital.status === statusFilter;
        
        // Role-based filtering
        if (userRole === 'emergency') {
          return matchesSearch && hospital.status === 'online' && hospital.connectionHealth !== 'critical';
        }
        
        return matchesSearch && matchesStatus;
      })
      .sort((a, b) => {
        // Priority sorting: online first, then by performance
        if (a.status === 'online' && b.status !== 'online') return -1;
        if (b.status === 'online' && a.status !== 'online') return 1;
        return b.overallScore - a.overallScore;
      });
  }, [searchTerm, statusFilter, userRole]);

  const handleHospitalSelect = (hospital: EnhancedHospital) => {
    setSelectedHospitalForConnection(hospital);
    setShowConnectionModal(true);
  };

  const handleConnectionComplete = async () => {
    if (selectedHospitalForConnection) {
      // Save hospital preference if remember is checked
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

  const toggleCardExpansion = (hospitalId: string) => {
    setExpandedCards(prev => {
      const newSet = new Set(prev);
      if (newSet.has(hospitalId)) {
        newSet.delete(hospitalId);
      } else {
        newSet.add(hospitalId);
      }
      return newSet;
    });
  };

  const renderSimpleCard = (hospital: EnhancedHospital) => {
    const isExpanded = expandedCards.has(hospital.id);
    
    return (
      <Card key={hospital.id} className="group hover:shadow-lg transition-all duration-200 border-border/50 hover:border-border">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-primary to-primary/70 rounded-lg flex items-center justify-center">
                <Hospital className="h-5 w-5 text-primary-foreground" />
              </div>
              <div>
                <CardTitle className="text-foreground text-lg">{hospital.name}</CardTitle>
                <p className="text-muted-foreground text-sm">{hospital.location}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {getStatusBadge(hospital.status)}
              <Badge variant="outline" className="text-xs">
                {hospital.emrType}
              </Badge>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-4">
          {/* Essential info always visible */}
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1 text-muted-foreground">
                <Users className="h-4 w-4" />
                {hospital.activePatients} active
              </span>
              {hospital.virtualisEnabled && (
                <span className="flex items-center gap-1 text-blue-600">
                  <Brain className="h-4 w-4" />
                  AI Ready
                </span>
              )}
            </div>
            <div className="flex items-center gap-2">
              {viewMode === 'simple' && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => toggleCardExpansion(hospital.id)}
                  className="text-muted-foreground hover:text-foreground"
                >
                  {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                </Button>
              )}
            </div>
          </div>

          {/* Expandable details for simple mode */}
          {(viewMode === 'advanced' || isExpanded) && (
            <div className="space-y-3 border-t border-border/50 pt-3">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <Activity className="h-4 w-4 text-muted-foreground" />
                  <span>{hospital.systemLoad}% Load</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-muted-foreground">Score:</span>
                  <span className="font-medium">{hospital.overallScore}%</span>
                </div>
              </div>
              
              {hospital.virtualisEnabled && (
                <div className="bg-muted/30 rounded-lg p-3">
                  <div className="flex items-center gap-2 mb-2">
                    <Zap className="h-4 w-4 text-amber-500" />
                    <span className="text-sm font-medium">Ambient EMR Ready</span>
                    <Badge variant="secondary" className="text-xs">Voice AI</Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Advanced AI features enabled with voice recognition
                  </p>
                </div>
              )}
              
              {userRole === 'admin' && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowHospitalDetails(hospital.id)}
                  className="w-full"
                >
                  <Eye className="h-4 w-4 mr-2" />
                  View Details
                </Button>
              )}
            </div>
          )}

          {/* Action button */}
          <Button 
            onClick={() => handleHospitalSelect(hospital)}
            className="w-full"
            disabled={hospital.status === 'maintenance' || hospital.status === 'offline'}
            size="lg"
          >
            {hospital.status === 'maintenance' ? 'Under Maintenance' : 
             hospital.status === 'offline' ? 'Offline' : 
             'Enter EMR System'}
          </Button>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold text-foreground">
            {emergencyMode ? 'Emergency EMR Access' : 'Select Hospital'}
          </h1>
          <p className="text-muted-foreground">
            {emergencyMode ? 'Quick access to available systems' : 'Choose a hospital to access their EMR system'}
          </p>
        </div>

        {/* Controls */}
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
              {/* Search */}
              <div className="relative flex-1">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search hospitals or locations..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              
              {/* Status filter */}
              {!emergencyMode && (
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="online">Online</SelectItem>
                    <SelectItem value="degraded">Degraded</SelectItem>
                  </SelectContent>
                </Select>
              )}
              
              {/* View mode toggle */}
              <div className="flex items-center space-x-2">
                <Switch
                  id="view-mode"
                  checked={viewMode === 'advanced'}
                  onCheckedChange={(checked) => setViewMode(checked ? 'advanced' : 'simple')}
                />
                <Label htmlFor="view-mode" className="text-sm">
                  Advanced View
                </Label>
              </div>
              
              {/* Role selector for admins */}
              {!emergencyMode && (
                <Select value={userRole} onValueChange={(value: UserRole) => setUserRole(value)}>
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="clinician">Clinician</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                  </SelectContent>
                </Select>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Quick stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-green-600">
                {filteredHospitals.filter(h => h.status === 'online').length}
              </div>
              <div className="text-sm text-muted-foreground">Online</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-blue-600">
                {filteredHospitals.filter(h => h.virtualisEnabled).length}
              </div>
              <div className="text-sm text-muted-foreground">AI Enabled</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-foreground">
                {filteredHospitals.reduce((acc, h) => acc + h.activePatients, 0)}
              </div>
              <div className="text-sm text-muted-foreground">Active Patients</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-foreground">
                {Math.round(filteredHospitals.reduce((acc, h) => acc + h.overallScore, 0) / filteredHospitals.length)}%
              </div>
              <div className="text-sm text-muted-foreground">Avg. Performance</div>
            </CardContent>
          </Card>
        </div>

        {/* Hospital Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredHospitals.map(renderSimpleCard)}
        </div>

        {/* No results */}
        {filteredHospitals.length === 0 && (
          <Card className="text-center py-12">
            <CardContent>
              <Hospital className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">No hospitals found</h3>
              <p className="text-muted-foreground">
                Try adjusting your search terms or filters
              </p>
            </CardContent>
          </Card>
        )}

        {/* Modals */}
        {showHospitalDetails && (
          <HospitalDetailModal
            hospital={mockHospitals.find(h => h.id === showHospitalDetails)!}
            showHospitalDetails={showHospitalDetails}
            setShowHospitalDetails={setShowHospitalDetails}
          />
        )}

        {showConnectionModal && selectedHospitalForConnection && (
          <div>
            <div className="mb-4 flex items-center space-x-2 justify-center">
              <Checkbox 
                id="remember-hospital" 
                checked={rememberHospital}
                onCheckedChange={(checked) => setRememberHospital(checked as boolean)}
              />
              <Label 
                htmlFor="remember-hospital" 
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Remember this hospital for next time
              </Label>
            </div>
            <EMRConnectionModal
              hospital={selectedHospitalForConnection}
              isOpen={showConnectionModal}
              onClose={() => {
                setShowConnectionModal(false);
                setSelectedHospitalForConnection(null);
                setRememberHospital(false);
              }}
              onConnectionComplete={handleConnectionComplete}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default SimpleHospitalSelector;