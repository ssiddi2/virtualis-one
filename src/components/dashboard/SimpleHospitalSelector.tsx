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
  Eye,
  Shield,
  Cpu,
  Signal,
  TrendingUp
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

  const renderSimpleCard = (hospital: EnhancedHospital, index: number) => {
    const isExpanded = expandedCards.has(hospital.id);
    const isOnline = hospital.status === 'online';
    
    return (
      <div 
        key={hospital.id} 
        className="group relative animate-fade-in"
        style={{ animationDelay: `${index * 0.1}s` }}
      >
        {/* Glow effect behind card */}
        <div className={`absolute -inset-0.5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl ${
          isOnline ? 'bg-gradient-to-r from-primary/40 via-virtualis-purple/30 to-primary/40' : 'bg-muted/20'
        }`} />
        
        <Card className={`relative backdrop-blur-xl border-2 rounded-2xl transition-all duration-500 overflow-hidden ${
          isOnline 
            ? 'border-primary/30 hover:border-primary/60 bg-card/80 hover:bg-card/90' 
            : 'border-border/30 bg-card/50'
        } hover:shadow-2xl hover:shadow-primary/10 hover:-translate-y-2`}>
          
          {/* Animated gradient border overlay */}
          {isOnline && (
            <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500">
              <div className="absolute inset-[1px] rounded-2xl bg-card/95" />
            </div>
          )}
          
          {/* Status indicator bar */}
          <div className={`absolute top-0 left-0 right-0 h-1 ${
            hospital.status === 'online' ? 'bg-gradient-to-r from-green-400 via-emerald-500 to-green-400' :
            hospital.status === 'degraded' ? 'bg-gradient-to-r from-amber-400 via-yellow-500 to-amber-400' :
            'bg-gradient-to-r from-red-400 via-red-500 to-red-400'
          }`}>
            {isOnline && <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent animate-pulse" />}
          </div>
          
          <CardHeader className="pb-4 pt-6 relative z-10">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                {/* Hospital icon with glow */}
                <div className={`relative w-14 h-14 rounded-xl flex items-center justify-center transition-all duration-300 ${
                  isOnline 
                    ? 'bg-gradient-to-br from-primary via-primary/80 to-virtualis-purple shadow-lg shadow-primary/30 group-hover:shadow-primary/50 group-hover:scale-110' 
                    : 'bg-muted/50'
                }`}>
                  <Hospital className={`h-7 w-7 ${isOnline ? 'text-primary-foreground' : 'text-muted-foreground'}`} />
                  {isOnline && (
                    <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-card animate-pulse">
                      <div className="absolute inset-0 bg-green-400 rounded-full animate-ping opacity-75" />
                    </div>
                  )}
                </div>
                <div>
                  <CardTitle className="text-foreground text-xl font-bold tracking-tight group-hover:text-primary transition-colors">
                    {hospital.name}
                  </CardTitle>
                  <p className="text-muted-foreground text-sm flex items-center gap-1">
                    <Signal className="h-3 w-3" />
                    {hospital.location}
                  </p>
                </div>
              </div>
              <div className="flex flex-col items-end gap-2">
                {getStatusBadge(hospital.status)}
                <Badge variant="outline" className="text-xs bg-card/50 border-border/50">
                  <Cpu className="h-3 w-3 mr-1" />
                  {hospital.emrType}
                </Badge>
              </div>
            </div>
          </CardHeader>
          
          <CardContent className="space-y-4 relative z-10">
            {/* Essential info always visible */}
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-4">
                <span className="flex items-center gap-2 text-muted-foreground bg-muted/20 px-3 py-1.5 rounded-lg">
                  <Users className="h-4 w-4 text-primary" />
                  <span className="font-semibold text-foreground">{hospital.activePatients}</span> active
                </span>
                {hospital.virtualisEnabled && (
                  <span className="flex items-center gap-2 bg-gradient-to-r from-blue-500/20 to-purple-500/20 px-3 py-1.5 rounded-lg border border-blue-500/30">
                    <Brain className="h-4 w-4 text-blue-400" />
                    <span className="text-blue-300 font-medium">AI Ready</span>
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2">
                {viewMode === 'simple' && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => toggleCardExpansion(hospital.id)}
                    className="text-muted-foreground hover:text-foreground hover:bg-muted/30"
                  >
                    {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                  </Button>
                )}
              </div>
            </div>

            {/* Expandable details for simple mode */}
            {(viewMode === 'advanced' || isExpanded) && (
              <div className="space-y-4 border-t border-border/30 pt-4 animate-fade-in">
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center gap-3 bg-muted/20 p-3 rounded-xl">
                    <Activity className="h-5 w-5 text-amber-400" />
                    <div>
                      <p className="text-xs text-muted-foreground">System Load</p>
                      <p className="font-bold text-foreground">{hospital.systemLoad}%</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 bg-muted/20 p-3 rounded-xl">
                    <TrendingUp className="h-5 w-5 text-green-400" />
                    <div>
                      <p className="text-xs text-muted-foreground">Performance</p>
                      <p className="font-bold text-foreground">{hospital.overallScore}%</p>
                    </div>
                  </div>
                </div>
                
                {hospital.virtualisEnabled && (
                  <div className="relative overflow-hidden bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-blue-500/10 rounded-xl p-4 border border-blue-500/20">
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent animate-pulse" />
                    <div className="flex items-center gap-3 mb-2 relative z-10">
                      <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-lg shadow-amber-500/30">
                        <Zap className="h-4 w-4 text-white" />
                      </div>
                      <span className="font-semibold text-foreground">Ambient EMR Ready</span>
                      <Badge className="bg-gradient-to-r from-purple-500 to-blue-500 text-white border-0 text-xs">
                        Voice AI
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground relative z-10">
                      Advanced AI features enabled with voice recognition & clinical copilot
                    </p>
                  </div>
                )}
                
                {userRole === 'admin' && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowHospitalDetails(hospital.id)}
                    className="w-full border-border/50 hover:bg-muted/30 hover:border-primary/50"
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
              className={`w-full relative overflow-hidden group/btn ${
                isOnline 
                  ? 'bg-gradient-to-r from-primary via-primary to-virtualis-purple hover:from-primary/90 hover:to-virtualis-purple/90 shadow-lg shadow-primary/25 hover:shadow-primary/40' 
                  : ''
              }`}
              disabled={hospital.status === 'maintenance' || hospital.status === 'offline'}
              size="lg"
            >
              <span className="relative z-10 flex items-center justify-center gap-2 font-semibold">
                {hospital.status === 'maintenance' ? 'Under Maintenance' : 
                 hospital.status === 'offline' ? 'Offline' : (
                  <>
                    <Shield className="h-4 w-4" />
                    Enter EMR System
                  </>
                )}
              </span>
              {isOnline && (
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover/btn:translate-x-[100%] transition-transform duration-700" />
              )}
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  };

  const stats = [
    {
      value: filteredHospitals.filter(h => h.status === 'online').length,
      label: 'Online',
      icon: Signal,
      color: 'from-green-400 to-emerald-500',
      glow: 'shadow-green-500/30'
    },
    {
      value: filteredHospitals.filter(h => h.virtualisEnabled).length,
      label: 'AI Enabled',
      icon: Brain,
      color: 'from-blue-400 to-purple-500',
      glow: 'shadow-blue-500/30'
    },
    {
      value: filteredHospitals.reduce((acc, h) => acc + h.activePatients, 0),
      label: 'Active Patients',
      icon: Users,
      color: 'from-primary to-virtualis-purple',
      glow: 'shadow-primary/30'
    },
    {
      value: `${Math.round(filteredHospitals.reduce((acc, h) => acc + h.overallScore, 0) / Math.max(filteredHospitals.length, 1))}%`,
      label: 'Avg. Performance',
      icon: TrendingUp,
      color: 'from-amber-400 to-orange-500',
      glow: 'shadow-amber-500/30'
    }
  ];

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-virtualis-purple/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-radial from-primary/5 to-transparent rounded-full" />
      </div>
      
      <div className="container mx-auto p-6 space-y-8 relative z-10">
        {/* Hero Header */}
        <div className="text-center space-y-4 py-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/30 mb-4">
            <Zap className="h-4 w-4 text-primary animate-pulse" />
            <span className="text-sm font-medium text-primary">Virtualis EMR Network</span>
          </div>
          <h1 className="text-5xl md:text-6xl font-black tracking-tight">
            <span className="bg-gradient-to-r from-foreground via-primary to-virtualis-purple bg-clip-text text-transparent">
              {emergencyMode ? 'Emergency Access' : 'Command Center'}
            </span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            {emergencyMode 
              ? 'Rapid access to critical healthcare systems' 
              : 'Select a hospital to access their integrated EMR system with AI-powered clinical workflows'}
          </p>
        </div>

        {/* Search & Controls */}
        <Card className="border-2 border-border/50 bg-card/50 backdrop-blur-xl">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
              {/* Search */}
              <div className="relative flex-1 group">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                <Input
                  placeholder="Search hospitals, locations, or EMR systems..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-12 h-12 text-lg bg-muted/20 border-border/50 focus:border-primary/50 focus:ring-primary/20"
                />
              </div>
              
              {/* Status filter */}
              {!emergencyMode && (
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-36 h-12 bg-muted/20 border-border/50">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-card border-border">
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="online">Online</SelectItem>
                    <SelectItem value="degraded">Degraded</SelectItem>
                  </SelectContent>
                </Select>
              )}
              
              {/* View mode toggle */}
              <div className="flex items-center space-x-3 bg-muted/20 px-4 py-2 rounded-lg border border-border/30">
                <Switch
                  id="view-mode"
                  checked={viewMode === 'advanced'}
                  onCheckedChange={(checked) => setViewMode(checked ? 'advanced' : 'simple')}
                />
                <Label htmlFor="view-mode" className="text-sm font-medium cursor-pointer">
                  Advanced
                </Label>
              </div>
              
              {/* Role selector for admins */}
              {!emergencyMode && (
                <Select value={userRole} onValueChange={(value: UserRole) => setUserRole(value)}>
                  <SelectTrigger className="w-36 h-12 bg-muted/20 border-border/50">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-card border-border">
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
          {stats.map((stat, index) => (
            <div 
              key={stat.label}
              className="group relative animate-fade-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {/* Glow effect */}
              <div className={`absolute -inset-1 rounded-2xl bg-gradient-to-r ${stat.color} opacity-0 group-hover:opacity-30 blur-xl transition-opacity duration-500`} />
              
              <Card className={`relative border-2 border-border/30 bg-card/50 backdrop-blur-xl hover:border-primary/40 transition-all duration-300 hover:-translate-y-1 ${stat.glow} hover:shadow-lg`}>
                <CardContent className="p-6 flex items-center gap-4">
                  <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center shadow-lg ${stat.glow} group-hover:scale-110 transition-transform duration-300`}>
                    <stat.icon className="h-7 w-7 text-white" />
                  </div>
                  <div>
                    <div className="text-3xl font-black text-foreground">{stat.value}</div>
                    <div className="text-sm text-muted-foreground font-medium">{stat.label}</div>
                  </div>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>

        {/* Hospital Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredHospitals.map((hospital, index) => renderSimpleCard(hospital, index))}
        </div>

        {/* No results */}
        {filteredHospitals.length === 0 && (
          <Card className="text-center py-16 border-2 border-dashed border-border/50 bg-card/30">
            <CardContent>
              <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-muted/30 flex items-center justify-center">
                <Hospital className="h-10 w-10 text-muted-foreground" />
              </div>
              <h3 className="text-2xl font-bold mb-2">No hospitals found</h3>
              <p className="text-muted-foreground max-w-md mx-auto">
                Try adjusting your search terms or filters to find available healthcare systems
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
