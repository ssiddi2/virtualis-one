
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Hospital, Settings, Wifi, WifiOff, AlertTriangle, Clock, Search, Filter, Database } from "lucide-react";
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
        return <Badge className={`${baseClasses} bg-virtualis-alert-green/20 text-virtualis-alert-green border-virtualis-alert-green`}>
          <Wifi className="h-3 w-3 mr-1" />
          CONNECTED
        </Badge>;
      case 'syncing':
        return <Badge className={`${baseClasses} bg-blue-500/20 text-blue-400 border-blue-500 ai-pulse`}>
          <Database className="h-3 w-3 mr-1" />
          SYNCING
        </Badge>;
      case 'disconnected':
        return <Badge className={`${baseClasses} bg-slate-500/20 text-slate-400 border-slate-500`}>
          <WifiOff className="h-3 w-3 mr-1" />
          OFFLINE
        </Badge>;
      case 'error':
        return <Badge className={`${baseClasses} bg-virtualis-alert-red/20 text-virtualis-alert-red border-virtualis-alert-red ai-pulse`}>
          <AlertTriangle className="h-3 w-3 mr-1" />
          ERROR
        </Badge>;
      default:
        return <Badge variant="outline">UNKNOWN</Badge>;
    }
  };

  const getEmrBadge = (emrType: string) => {
    const colors = {
      'Epic': 'bg-purple-500/20 text-purple-400 border-purple-500',
      'Cerner': 'bg-green-500/20 text-green-400 border-green-500',
      'Meditech': 'bg-orange-500/20 text-orange-400 border-orange-500',
      'Allscripts': 'bg-blue-500/20 text-blue-400 border-blue-500',
      'VistA': 'bg-red-500/20 text-red-400 border-red-500',
      'FHIR API': 'bg-virtualis-gold/20 text-virtualis-gold border-virtualis-gold'
    };
    
    return <Badge className={`tech-font ${colors[emrType as keyof typeof colors] || 'bg-slate-500/20 text-slate-400 border-slate-500'}`}>
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
    <div className="p-6 space-y-6 min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold text-white tech-font ai-text-glow">
            UNIVERSAL EMR COMMAND CENTER
          </h1>
          <p className="text-virtualis-gold font-semibold tech-font">
            Multi-Hospital Integration Dashboard
          </p>
          <div className="flex items-center gap-4 mt-2 text-sm">
            <span className="text-slate-400 flex items-center gap-2">
              <Database className="h-4 w-4 text-virtualis-gold" />
              {connectedCount}/{hospitals.length} Systems Online
            </span>
            {totalAlerts > 0 && (
              <Badge className="bg-virtualis-alert-red/20 text-virtualis-alert-red border-virtualis-alert-red ai-pulse">
                {totalAlerts} Alerts
              </Badge>
            )}
          </div>
        </div>
      </div>

      {/* Filters */}
      <Card className="ai-card">
        <CardHeader>
          <CardTitle className="text-white tech-font flex items-center gap-2">
            <Filter className="h-5 w-5 text-virtualis-gold" />
            NEURAL FILTERS
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
              <Input
                placeholder="Search hospitals, locations, EMRs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 ai-input tech-font"
              />
            </div>
            
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="ai-input tech-font">
                <SelectValue placeholder="Connection Status" />
              </SelectTrigger>
              <SelectContent className="bg-slate-800 border-slate-600">
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="connected">Connected</SelectItem>
                <SelectItem value="syncing">Syncing</SelectItem>
                <SelectItem value="disconnected">Disconnected</SelectItem>
                <SelectItem value="error">Error</SelectItem>
              </SelectContent>
            </Select>

            <Select value={emrFilter} onValueChange={setEmrFilter}>
              <SelectTrigger className="ai-input tech-font">
                <SelectValue placeholder="EMR System" />
              </SelectTrigger>
              <SelectContent className="bg-slate-800 border-slate-600">
                <SelectItem value="all">All EMR Systems</SelectItem>
                <SelectItem value="Epic">Epic</SelectItem>
                <SelectItem value="Cerner">Cerner</SelectItem>
                <SelectItem value="Meditech">Meditech</SelectItem>
                <SelectItem value="Allscripts">Allscripts</SelectItem>
                <SelectItem value="VistA">VistA</SelectItem>
                <SelectItem value="FHIR API">FHIR API</SelectItem>
              </SelectContent>
            </Select>

            <div className="text-right">
              <div className="text-sm text-slate-400 tech-font">QUANTUM SYNC</div>
              <div className="text-2xl font-bold text-virtualis-gold tech-font">ACTIVE</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Hospital Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredHospitals.map((hospital) => (
          <Card key={hospital.id} className="ai-card hover:scale-105 transition-all duration-300 ai-scan-line">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-virtualis-gold rounded-lg flex items-center justify-center">
                    <Hospital className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-white text-lg tech-font">{hospital.name}</CardTitle>
                    <p className="text-slate-400 text-sm tech-font">{hospital.location}</p>
                  </div>
                </div>
                {hospital.alerts_count > 0 && (
                  <Badge className="bg-virtualis-alert-red/20 text-virtualis-alert-red border-virtualis-alert-red ai-pulse">
                    {hospital.alerts_count}
                  </Badge>
                )}
              </div>
              <div className="flex justify-between items-center">
                {getStatusBadge(hospital.status, hospital.alerts_count)}
                {getEmrBadge(hospital.emr_type)}
              </div>
            </CardHeader>
            
            <CardContent className="space-y-4">
              <div className="flex items-center gap-2 text-sm">
                <Clock className="h-4 w-4 text-virtualis-gold" />
                <span className="text-slate-300 tech-font">Last Sync: {hospital.last_sync}</span>
              </div>
              
              <div className="grid grid-cols-1 gap-2">
                <Button 
                  onClick={() => onSelectHospital(hospital.id)}
                  className="ai-button tech-font"
                  disabled={!hospital.is_connected}
                >
                  {hospital.is_connected ? 'ENTER SESSION' : 'CONNECTION REQUIRED'}
                </Button>
                
                {user.role === 'admin' && (
                  <Button 
                    onClick={() => {
                      setSelectedHospital(hospital);
                      setShowIntegrationPanel(true);
                    }}
                    variant="outline"
                    className="ai-button-secondary tech-font"
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
        <div className="text-center py-12">
          <Hospital className="h-16 w-16 text-slate-600 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-slate-400 mb-2 tech-font">NO HOSPITALS FOUND</h3>
          <p className="text-slate-500 tech-font">Adjust your neural filters to expand search parameters</p>
        </div>
      )}
    </div>
  );
};

export default EMRDashboard;
