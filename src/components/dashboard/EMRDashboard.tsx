import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Hospital, Settings, Wifi, WifiOff, AlertTriangle, Clock, Search, Database, Zap, Shield } from "lucide-react";
import EMRIntegrationPanel from "./EMRIntegrationPanel";

interface Hospital {
  id: string;
  name: string;
  location: string;
  emr_type: string;
  is_connected: boolean;
  last_sync: string;
  logo_url?: string;
  status: 'connected' | 'disconnected' | 'error' | 'syncing';
  alerts_count?: number;
}

const mockHospitals: Hospital[] = [
  {
    id: '1',
    name: 'St. Mary\'s General Hospital',
    location: 'San Francisco, CA',
    emr_type: 'Epic',
    is_connected: true,
    last_sync: '2 minutes ago',
    status: 'connected',
    alerts_count: 0
  },
  {
    id: '2',
    name: 'Regional Medical Center',
    location: 'Los Angeles, CA',
    emr_type: 'Cerner',
    is_connected: true,
    last_sync: '15 minutes ago',
    status: 'syncing',
    alerts_count: 2
  },
  {
    id: '3',
    name: 'Children\'s Hospital Network',
    location: 'San Diego, CA',
    emr_type: 'Meditech',
    is_connected: false,
    last_sync: '2 hours ago',
    status: 'disconnected',
    alerts_count: 5
  },
  {
    id: '4',
    name: 'University Medical',
    location: 'Sacramento, CA',
    emr_type: 'Allscripts',
    is_connected: false,
    last_sync: 'Never',
    status: 'error',
    alerts_count: 1
  },
  {
    id: '5',
    name: 'Veterans Affairs Medical',
    location: 'Oakland, CA',
    emr_type: 'VistA',
    is_connected: true,
    last_sync: '5 minutes ago',
    status: 'connected',
    alerts_count: 0
  },
  {
    id: '6',
    name: 'Community Health Network',
    location: 'Fresno, CA',
    emr_type: 'FHIR API',
    is_connected: true,
    last_sync: '1 minute ago',
    status: 'connected',
    alerts_count: 0
  }
];

interface EMRDashboardProps {
  user: any;
  onSelectHospital: (hospitalId: string) => void;
}

const EMRDashboard = ({ user, onSelectHospital }: EMRDashboardProps) => {
  const [hospitals, setHospitals] = useState<Hospital[]>(mockHospitals);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [emrFilter, setEmrFilter] = useState("all");
  const [showIntegrationPanel, setShowIntegrationPanel] = useState(false);
  const [selectedHospital, setSelectedHospital] = useState<Hospital | null>(null);

  const getStatusBadge = (status: string, alertsCount?: number) => {
    const baseClasses = "font-semibold tech-font";
    switch (status) {
      case 'connected':
        return <Badge className={`${baseClasses} glass-badge success`}>
          <Wifi className="h-3 w-3 mr-1" />
          ACTIVE
        </Badge>;
      case 'syncing':
        return <Badge className={`${baseClasses} glass-badge primary pulse-glow`}>
          <Database className="h-3 w-3 mr-1" />
          SYNCING
        </Badge>;
      case 'disconnected':
        return <Badge className={`${baseClasses} glass-badge`}>
          <WifiOff className="h-3 w-3 mr-1" />
          OFFLINE
        </Badge>;
      case 'error':
        return <Badge className={`${baseClasses} glass-badge error pulse-glow`}>
          <AlertTriangle className="h-3 w-3 mr-1" />
          ERROR
        </Badge>;
      default:
        return <Badge variant="outline">UNKNOWN</Badge>;
    }
  };

  const getEmrBadge = (emrType: string) => {
    const colors = {
      'Epic': 'bg-purple-500/20 text-purple-300 border-purple-400/30',
      'Cerner': 'bg-green-500/20 text-green-300 border-green-400/30',
      'Meditech': 'bg-orange-500/20 text-orange-300 border-orange-400/30',
      'Allscripts': 'bg-blue-500/20 text-blue-300 border-blue-400/30',
      'VistA': 'bg-red-500/20 text-red-300 border-red-400/30',
      'FHIR API': 'bg-virtualis-gold/20 text-virtualis-gold border-virtualis-gold/30'
    };
    
    return <Badge className={`tech-font glass-badge ${colors[emrType as keyof typeof colors] || 'glass-badge'}`}>
      {emrType}
    </Badge>;
  };

  const filteredHospitals = hospitals.filter(hospital => {
    const matchesSearch = hospital.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         hospital.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         hospital.emr_type.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || hospital.status === statusFilter;
    const matchesEmr = emrFilter === "all" || hospital.emr_type === emrFilter;
    return matchesSearch && matchesStatus && matchesEmr;
  });

  const connectedCount = hospitals.filter(h => h.is_connected).length;
  const totalAlerts = hospitals.reduce((sum, h) => sum + (h.alerts_count || 0), 0);

  if (showIntegrationPanel && selectedHospital) {
    return (
      <EMRIntegrationPanel
        hospital={selectedHospital}
        user={user}
        onBack={() => {
          setShowIntegrationPanel(false);
          setSelectedHospital(null);
        }}
        onSave={(integrationData) => {
          console.log('Saving integration:', integrationData);
          setShowIntegrationPanel(false);
          setSelectedHospital(null);
        }}
      />
    );
  }

  return (
    <div className="p-8 space-y-8 min-h-screen">
      {/* Header Section with New Logo */}
      <div className="text-center space-y-6">
        <div className="flex items-center justify-center mb-8">
          <img 
            src="/lovable-uploads/c61057eb-57cd-4ce6-89ca-b6ee43ac66a4.png" 
            alt="Virtualis One™" 
            className="h-20 w-auto"
          />
        </div>
        
        <div className="space-y-4">
          <h1 className="text-4xl font-bold gradient-text tech-font">
            UNIVERSAL EMR COMMAND CENTER
          </h1>
          <p className="text-white/80 text-lg tech-font">
            Healthcare Network Management Platform
          </p>
          <div className="flex items-center justify-center gap-6 mt-6">
            <div className="glass-badge primary flex items-center gap-2">
              <Shield className="h-4 w-4" />
              <span className="tech-font">SECURE</span>
            </div>
            <div className="glass-badge success flex items-center gap-2">
              <Database className="h-4 w-4" />
              <span className="tech-font">{connectedCount}/{hospitals.length} CONNECTED</span>
            </div>
            {totalAlerts > 0 && (
              <div className="glass-badge error flex items-center gap-2">
                <AlertTriangle className="h-4 w-4" />
                <span className="tech-font">{totalAlerts} ALERTS</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Simplified Search and Filters */}
      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="text-white tech-font flex items-center gap-3">
            <Search className="h-5 w-5 text-virtualis-gold" />
            Search Healthcare Facilities
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-virtualis-gold/60" />
              <Input
                placeholder="Search facilities..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 glass-input tech-font"
              />
            </div>
            
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="glass-input tech-font">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent className="glass-card border-white/20">
                <SelectItem value="all" className="text-white tech-font">All Status</SelectItem>
                <SelectItem value="connected" className="text-white tech-font">Connected</SelectItem>
                <SelectItem value="syncing" className="text-white tech-font">Syncing</SelectItem>
                <SelectItem value="disconnected" className="text-white tech-font">Disconnected</SelectItem>
                <SelectItem value="error" className="text-white tech-font">Error</SelectItem>
              </SelectContent>
            </Select>

            <Select value={emrFilter} onValueChange={setEmrFilter}>
              <SelectTrigger className="glass-input tech-font">
                <SelectValue placeholder="EMR Type" />
              </SelectTrigger>
              <SelectContent className="glass-card border-white/20">
                <SelectItem value="all" className="text-white tech-font">All Types</SelectItem>
                <SelectItem value="Epic" className="text-white tech-font">Epic</SelectItem>
                <SelectItem value="Cerner" className="text-white tech-font">Cerner</SelectItem>
                <SelectItem value="Meditech" className="text-white tech-font">Meditech</SelectItem>
                <SelectItem value="Allscripts" className="text-white tech-font">Allscripts</SelectItem>
                <SelectItem value="VistA" className="text-white tech-font">VistA</SelectItem>
                <SelectItem value="FHIR API" className="text-white tech-font">FHIR API</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Simplified Hospital Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredHospitals.map((hospital) => (
          <Card key={hospital.id} className="glass-card hover:scale-105 transition-all duration-300">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-virtualis-gold to-orange-500 rounded-xl flex items-center justify-center">
                    <Hospital className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-white text-lg tech-font">{hospital.name}</CardTitle>
                    <p className="text-white/60 text-sm tech-font">{hospital.location}</p>
                  </div>
                </div>
                {hospital.alerts_count > 0 && (
                  <Badge className="glass-badge error">
                    {hospital.alerts_count}
                  </Badge>
                )}
              </div>
              <div className="flex justify-between items-center gap-3">
                {getStatusBadge(hospital.status, hospital.alerts_count)}
                {getEmrBadge(hospital.emr_type)}
              </div>
            </CardHeader>
            
            <CardContent className="space-y-4">
              <div className="flex items-center gap-2 text-sm glass-nav-item p-2">
                <Clock className="h-4 w-4 text-virtualis-gold" />
                <span className="text-white tech-font">Last Sync: {hospital.last_sync}</span>
              </div>
              
              <div className="space-y-2">
                <Button 
                  onClick={() => onSelectHospital(hospital.id)}
                  className="w-full glass-button tech-font flex items-center gap-2"
                  disabled={!hospital.is_connected}
                >
                  <Zap className="h-4 w-4" />
                  {hospital.is_connected ? 'CONNECT' : 'OFFLINE'}
                </Button>
                
                {user.role === 'admin' && (
                  <Button 
                    onClick={() => {
                      setSelectedHospital(hospital);
                      setShowIntegrationPanel(true);
                    }}
                    variant="outline"
                    className="w-full glass-nav-item border-white/20 hover:border-virtualis-gold/50 text-white hover:text-virtualis-gold transition-all duration-300 tech-font"
                  >
                    <Settings className="h-4 w-4 mr-2" />
                    CONFIGURE
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredHospitals.length === 0 && (
        <div className="text-center py-16">
          <div className="glass-card p-12 max-w-md mx-auto">
            <Hospital className="h-16 w-16 text-virtualis-gold/60 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2 tech-font">NO FACILITIES FOUND</h3>
            <p className="text-white/60 tech-font">Adjust search parameters</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default EMRDashboard;
