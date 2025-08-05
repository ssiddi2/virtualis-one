import { useState, useEffect, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { 
  Hospital, 
  Wifi, 
  Clock, 
  Search,
  Shield,
  Activity,
  Database,
  Users,
  AlertTriangle,
  CheckCircle,
  Settings,
  Monitor,
  Brain,
  MessageSquare,
  Zap,
  Globe,
  Star,
  TrendingUp,
  TrendingDown,
  MapPin,
  Phone,
  Mail,
  Calendar,
  BarChart3,
  PieChart,
  LineChart,
  RefreshCw,
  ExternalLink,
  Info,
  Sparkles,
  Target,
  Workflow,
  FileText,
  HelpCircle,
  X,
  Plus,
  Eye,
  Edit,
  Trash2,
  Copy,
  Download,
  Upload,
  Share,
  Bookmark,
  Cpu,
  HardDrive,
  MemoryStick,
  Network,
  Lock,
  Unlock,
  UserX,
  UserCheck
} from "lucide-react";

import { HospitalSelectorProps, EnhancedHospital } from '@/types/hospital';
import { mockHospitals } from '@/data/demoHospitals';
import { getStatusBadge, getConnectionHealthBadge, getApiHealthBadge } from '@/utils/hospitalHelpers';
import { useToast } from '@/hooks/use-toast';
import { HospitalDetailModal } from './HospitalDetailsModal';
import EMRConnectionModal from '@/components/emr/EMRConnectionModal';
import SimpleHospitalSelector from './SimpleHospitalSelector';

const HospitalSelector: React.FC<HospitalSelectorProps> = ({ 
  onSelectHospital, 
  allowMultipleSelection = false,
  showAdvancedMetrics = true,
  filterByRole = true,
  emergencyMode = false
}) => {
  const [useSimpleMode, setUseSimpleMode] = useState(!showAdvancedMetrics);

  // If simple mode is enabled, use the SimpleHospitalSelector
  if (useSimpleMode) {
    return (
      <div>
        <div className="fixed top-4 right-4 z-50">
          <Button
            onClick={() => setUseSimpleMode(false)}
            variant="outline"
            size="sm"
            className="bg-background/80 backdrop-blur-sm"
          >
            <Settings className="h-4 w-4 mr-2" />
            Advanced View
          </Button>
        </div>
        <SimpleHospitalSelector 
          onSelectHospital={onSelectHospital}
          emergencyMode={emergencyMode}
        />
      </div>
    );
  }

  const { toast } = useToast();

  // State Management
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [emrFilter, setEmrFilter] = useState("all");
  const [sortBy, setSortBy] = useState("name");
  const [viewMode, setViewMode] = useState<'cards' | 'table' | 'map'>('cards');
  const [selectedHospitals, setSelectedHospitals] = useState<Set<string>>(new Set());
  const [showConnectionTest, setShowConnectionTest] = useState<Record<string, boolean>>({});
  const [connectionResults, setConnectionResults] = useState<Record<string, any>>({});
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [refreshInterval, setRefreshInterval] = useState(30);
  const [showHospitalDetails, setShowHospitalDetails] = useState<string | null>(null);
  const [showConnectionModal, setShowConnectionModal] = useState(false);
  const [selectedHospitalForConnection, setSelectedHospitalForConnection] = useState<EnhancedHospital | null>(null);

  // Enhanced mock hospitals
  const enhancedHospitals: EnhancedHospital[] = mockHospitals;

  // Filter and sort hospitals
  const filteredHospitals = useMemo(() => {
    return enhancedHospitals
      .filter(hospital => {
        const matchesSearch = hospital.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                             hospital.emrType.toLowerCase().includes(searchTerm.toLowerCase()) ||
                             hospital.location.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter === "all" || hospital.status === statusFilter;
        const matchesEmr = emrFilter === "all" || hospital.emrType === emrFilter;

        // Emergency mode filter
        if (emergencyMode) {
          return matchesSearch && hospital.status === 'online' && hospital.connectionHealth !== 'critical';
        }

        return matchesSearch && matchesStatus && matchesEmr;
      })
      .sort((a, b) => {
        switch (sortBy) {
          case 'name':
            return a.name.localeCompare(b.name);
          case 'status':
            return a.status.localeCompare(b.status);
          case 'emr':
            return a.emrType.localeCompare(b.emrType);
          case 'performance':
            return b.overallScore - a.overallScore;
          case 'patients':
            return b.activePatients - a.activePatients;
          default:
            return 0;
        }
      });
  }, [enhancedHospitals, searchTerm, statusFilter, emrFilter, sortBy, emergencyMode]);

  const handleHospitalSelect = (hospitalId: string) => {
    if (allowMultipleSelection) {
      setSelectedHospitals(prev => {
        const newSet = new Set(prev);
        if (newSet.has(hospitalId)) {
          newSet.delete(hospitalId);
        } else {
          newSet.add(hospitalId);
        }
        return newSet;
      });
    } else {
      // Find the selected hospital and show connection modal
      const hospital = enhancedHospitals.find(h => h.id === hospitalId);
      if (hospital) {
        setSelectedHospitalForConnection(hospital);
        setShowConnectionModal(true);
      }
    }
  };

  const handleConnectionComplete = () => {
    if (selectedHospitalForConnection) {
      onSelectHospital(selectedHospitalForConnection.id);
      setSelectedHospitalForConnection(null);
    }
  };

  const handleConnectionModalClose = () => {
    setShowConnectionModal(false);
    setSelectedHospitalForConnection(null);
  };

  const handleConnectionTest = async (hospitalId: string) => {
    setShowConnectionTest(prev => ({ ...prev, [hospitalId]: true }));
    
    try {
      // Simulate connection test
      await new Promise(resolve => setTimeout(resolve, 2000));
      const result = { success: true, message: "Connection successful" };
      setConnectionResults(prev => ({ ...prev, [hospitalId]: result }));
      
      toast({
        title: "Connection Successful",
        description: "EMR system is responding normally",
      });
    } catch (error) {
      setConnectionResults(prev => ({ ...prev, [hospitalId]: { success: false, error: "Connection failed" } }));
      toast({
        title: "Connection Test Failed",
        description: "Unable to test connection to EMR system",
        variant: "destructive",
      });
    } finally {
      setTimeout(() => {
        setShowConnectionTest(prev => ({ ...prev, [hospitalId]: false }));
      }, 3000);
    }
  };

  // Auto-refresh effect
  useEffect(() => {
    if (autoRefresh && refreshInterval > 0) {
      const interval = setInterval(() => {
        // Simulate data refresh
        console.log('Auto-refreshing hospital data...');
      }, refreshInterval * 1000);

      return () => clearInterval(interval);
    }
  }, [autoRefresh, refreshInterval]);

  const renderHospitalCard = (hospital: EnhancedHospital) => (
    <Card 
      key={hospital.id} 
      className={`virtualis-card hover:scale-105 transition-transform ${
        selectedHospitals.has(hospital.id) ? 'ring-2 ring-primary' : ''
      }`}
    >
      <CardHeader className="pb-4">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 bg-virtualis-gold rounded-lg flex items-center justify-center">
            <Hospital className="h-5 w-5 text-white" />
          </div>
          <div className="flex-1">
            <CardTitle className="text-white text-lg">{hospital.name}</CardTitle>
            <p className="text-slate-400 text-sm">{hospital.location}</p>
          </div>
          {allowMultipleSelection && (
            <Button
              variant="outline"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                handleHospitalSelect(hospital.id);
              }}
              className="ml-2"
            >
              {selectedHospitals.has(hospital.id) ? <CheckCircle className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
            </Button>
          )}
        </div>
        <div className="flex justify-between items-center">
          {getStatusBadge(hospital.status)}
          <span className="text-sm text-slate-300 font-medium">{hospital.emrType}</span>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Basic Metrics Row */}
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4 text-virtualis-gold" />
            <span className="text-slate-300">{hospital.activePatients}/{hospital.totalPatients}</span>
          </div>
          <div className="flex items-center gap-2">
            <Activity className="h-4 w-4 text-virtualis-gold" />
            <span className="text-slate-300">{hospital.systemLoad}% Load</span>
          </div>
        </div>

        {/* Advanced Metrics */}
        {showAdvancedMetrics && (
          <>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-virtualis-gold" />
                <span className="text-slate-300">Token: {hospital.tokenExpiry}</span>
              </div>
              <div className="flex items-center gap-2">
                <Database className="h-4 w-4 text-virtualis-gold" />
                <span className="text-slate-300">{hospital.uptime}% Uptime</span>
              </div>
            </div>

            {/* Performance Score */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-slate-300">Overall Score</span>
                <span className="text-white font-medium">{hospital.overallScore}%</span>
              </div>
              <Progress value={hospital.overallScore} className="h-2" />
            </div>
          </>
        )}

        {/* Health Status Row */}
        <div className="grid grid-cols-2 gap-2">
          {getConnectionHealthBadge(hospital.connectionHealth)}
          {getApiHealthBadge(hospital.apiHealth)}
        </div>

        {/* Virtualis Features with Ambient Mode */}
        {hospital.virtualisEnabled ? (
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Brain className="h-4 w-4 text-blue-400" />
              <span className="text-sm text-blue-300">
                Virtualis AI ({hospital.virtualisFeatures.filter(f => f.enabled).length}/{hospital.virtualisFeatures.length})
              </span>
              <Badge className="bg-blue-600/20 text-blue-300 border-blue-400/30 text-xs">
                Score: {hospital.overallScore}
              </Badge>
            </div>
            <div className="flex items-center gap-2">
              <Zap className="h-4 w-4 text-amber-400" />
              <span className="text-sm text-amber-300">Ambient EMR Ready</span>
              <Badge className="bg-amber-600/20 text-amber-300 border-amber-400/30 text-xs animate-pulse">
                Voice AI
              </Badge>
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <Brain className="h-4 w-4 text-gray-500" />
            <span className="text-sm text-gray-400">
              Virtualis AI Disabled
            </span>
            <Badge className="bg-gray-600/20 text-gray-400 border-gray-500/30 text-xs">
              Score: {hospital.overallScore}
            </Badge>
          </div>
        )}

        {/* Critical Alerts */}
        {hospital.criticalAlerts > 0 && (
          <Alert variant="destructive" className="bg-red-900/20 border border-red-400/30">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription className="text-red-300 text-xs">
              {hospital.criticalAlerts} Critical Alert{hospital.criticalAlerts > 1 ? 's' : ''}
            </AlertDescription>
          </Alert>
        )}
        
        {/* Action Buttons */}
        <div className="flex gap-2">
          <Button 
            onClick={() => handleConnectionTest(hospital.id)}
            variant="outline"
            size="sm"
            className="flex-1 bg-slate-700/50 border-slate-600 text-white hover:bg-slate-600"
            disabled={showConnectionTest[hospital.id]}
          >
            {showConnectionTest[hospital.id] ? (
              <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Wifi className="h-4 w-4 mr-2" />
            )}
            {showConnectionTest[hospital.id] ? 'Testing...' : 'Test'}
          </Button>
          
          <Button 
            onClick={() => setShowHospitalDetails(hospital.id)}
            variant="outline"
            size="sm"
            className="flex-1 bg-slate-700/50 border-slate-600 text-white hover:bg-slate-600"
          >
            <Eye className="h-4 w-4 mr-2" />
            Details
          </Button>
          
          <Button 
            onClick={() => handleHospitalSelect(hospital.id)}
            className="flex-1 virtualis-button"
            disabled={hospital.status === 'maintenance' || hospital.status === 'offline'}
          >
            {hospital.status === 'maintenance' ? 'Maintenance' : 
             hospital.status === 'offline' ? 'Offline' : 
             allowMultipleSelection ? 'Select' : 'Enter'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-purple-900">
      <div className="p-6 space-y-6">
        {/* Simple Mode Toggle */}
        <div className="fixed top-4 right-4 z-50">
          <Button
            onClick={() => setUseSimpleMode(true)}
            variant="outline"
            size="sm"
            className="bg-background/80 backdrop-blur-sm"
          >
            Simple View
          </Button>
        </div>

        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-3 bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
            {emergencyMode ? 'Emergency EMR Access' : 'Hospital EMR Command Center'}
          </h1>
          <p className="text-white/80 text-lg">
            {emergencyMode ? 'Emergency access to available EMR systems' : 'Select a hospital to access its EMR system'}
          </p>
        </div>

        {/* Summary Dashboard */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card className="bg-green-600/20 border-green-400/30">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-green-200">
                {filteredHospitals.filter(h => h.status === 'online').length}
              </div>
              <div className="text-green-300/80 text-sm">Online Hospitals</div>
            </CardContent>
          </Card>
          <Card className="bg-yellow-600/20 border-yellow-400/30">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-yellow-200">
                {filteredHospitals.filter(h => h.status === 'degraded').length}
              </div>
              <div className="text-yellow-300/80 text-sm">Degraded Systems</div>
            </CardContent>
          </Card>
          <Card className="bg-purple-600/20 border-purple-400/30">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-purple-200">
                {filteredHospitals.filter(h => h.virtualisEnabled).length}
              </div>
              <div className="text-purple-300/80 text-sm">Virtualis Enabled</div>
            </CardContent>
          </Card>
          <Card className="bg-blue-600/20 border-blue-400/30">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-blue-200">
                {filteredHospitals.reduce((acc, h) => acc + h.activePatients, 0)}
              </div>
              <div className="text-blue-300/80 text-sm">Total Active Patients</div>
            </CardContent>
          </Card>
        </div>

        {/* Filters and Controls */}
        <Card className="bg-white/10 border-white/20">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-6 gap-4 mb-4">
              <div className="relative md:col-span-2">
                <Search className="absolute left-3 top-3 h-4 w-4 text-white/60" />
                <Input
                  placeholder="Search hospitals, EMR systems, or locations..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-white/50"
                />
              </div>
              
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="bg-white/10 border-white/20 text-white">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 border-slate-600">
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="online">Online</SelectItem>
                  <SelectItem value="degraded">Degraded</SelectItem>
                  <SelectItem value="maintenance">Maintenance</SelectItem>
                  <SelectItem value="offline">Offline</SelectItem>
                </SelectContent>
              </Select>

              <Select value={emrFilter} onValueChange={setEmrFilter}>
                <SelectTrigger className="bg-white/10 border-white/20 text-white">
                  <SelectValue placeholder="EMR System" />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 border-slate-600">
                  <SelectItem value="all">All EMRs</SelectItem>
                  <SelectItem value="Epic">Epic</SelectItem>
                  <SelectItem value="Cerner">Cerner</SelectItem>
                  <SelectItem value="MEDITECH">MEDITECH</SelectItem>
                  <SelectItem value="AI-Native">AI-Native</SelectItem>
                  <SelectItem value="Allscripts">Allscripts</SelectItem>
                </SelectContent>
              </Select>

              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="bg-white/10 border-white/20 text-white">
                  <SelectValue placeholder="Sort By" />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 border-slate-600">
                  <SelectItem value="name">Name</SelectItem>
                  <SelectItem value="status">Status</SelectItem>
                  <SelectItem value="emr">EMR Type</SelectItem>
                  <SelectItem value="performance">Performance</SelectItem>
                  <SelectItem value="patients">Patient Count</SelectItem>
                </SelectContent>
              </Select>

              <div className="flex items-center gap-2">
                <Button
                  onClick={() => setViewMode(viewMode === 'cards' ? 'table' : 'cards')}
                  variant="outline"
                  size="sm"
                  className="border-white/20 text-white hover:bg-white/10"
                >
                  {viewMode === 'cards' ? <BarChart3 className="h-4 w-4" /> : <PieChart className="h-4 w-4" />}
                </Button>
                <Button
                  onClick={() => setAutoRefresh(!autoRefresh)}
                  variant="outline"
                  size="sm"
                  className={`border-white/20 text-white hover:bg-white/10 ${autoRefresh ? 'bg-green-600/20' : ''}`}
                >
                  <RefreshCw className={`h-4 w-4 ${autoRefresh ? 'animate-spin' : ''}`} />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Hospital Cards */}
        {viewMode === 'cards' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredHospitals.map((hospital) => (
              <Card key={hospital.id} className="bg-white/10 border-white/20 hover:bg-white/15 transition-all duration-200 hover:scale-105 cursor-pointer">
                <CardHeader className="pb-4">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-12 h-12 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-lg flex items-center justify-center">
                      <Hospital className="h-6 w-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <CardTitle className="text-white text-lg leading-tight">{hospital.name}</CardTitle>
                      <p className="text-white/60 text-sm">{hospital.location}</p>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      {getStatusBadge(hospital.status)}
                      {hospital.virtualisEnabled && (
                        <Badge className="bg-purple-600/20 text-purple-300 border-purple-400/30">
                          <Brain className="w-3 h-3 mr-1" />
                          Virtualis
                        </Badge>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-white/80 font-medium text-lg">{hospital.emrType}</span>
                      <span className="text-white/60 text-sm">v{hospital.emrVersion}</span>
                    </div>
                    <div className="text-right">
                      <div className="text-white font-bold text-lg">{hospital.overallScore}/100</div>
                      <div className="text-white/60 text-xs">Overall Score</div>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  {/* Key Metrics */}
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-blue-400" />
                      <div>
                        <div className="text-white font-medium">{hospital.activePatients}</div>
                        <div className="text-white/60 text-xs">Active Patients</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Activity className="h-4 w-4 text-green-400" />
                      <div>
                        <div className="text-white font-medium">{hospital.uptime}%</div>
                        <div className="text-white/60 text-xs">Uptime</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-yellow-400" />
                      <div>
                        <div className="text-white font-medium">{hospital.responseTime}ms</div>
                        <div className="text-white/60 text-xs">Response</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Wifi className="h-4 w-4 text-purple-400" />
                      <div>
                        <div className="text-white font-medium">{hospital.networkLatency}ms</div>
                        <div className="text-white/60 text-xs">Latency</div>
                      </div>
                    </div>
                  </div>

                  {/* Connection Health and API Status */}
                  <div className="flex items-center justify-between">
                    {getConnectionHealthBadge(hospital.connectionHealth)}
                    {getApiHealthBadge(hospital.apiHealth)}
                  </div>

                  {/* Token Expiry */}
                  <div className="flex items-center gap-2 text-sm">
                    <Clock className="h-4 w-4 text-white/60" />
                    <span className="text-white/80">Token expires: {hospital.tokenExpiry}</span>
                  </div>

                  {/* Alerts */}
                  {hospital.criticalAlerts > 0 && (
                    <Alert className="bg-red-900/20 border-red-400/30">
                      <AlertTriangle className="h-4 w-4 text-red-400" />
                      <AlertDescription className="text-red-200">
                        {hospital.criticalAlerts} critical alert{hospital.criticalAlerts > 1 ? 's' : ''} requiring attention
                      </AlertDescription>
                    </Alert>
                  )}

                  {/* Virtualis Features Preview */}
                  {hospital.virtualisEnabled && hospital.virtualisFeatures.length > 0 && (
                    <div className="bg-purple-900/20 border border-purple-400/30 rounded-lg p-3">
                      <div className="text-purple-200 font-medium text-sm mb-2 flex items-center gap-2">
                        <Brain className="h-4 w-4" />
                        Virtualis AI Features
                      </div>
                      <div className="space-y-1">
                        {hospital.virtualisFeatures.slice(0, 2).map((feature, idx) => (
                          <div key={idx} className="flex items-center justify-between text-xs">
                            <span className="text-purple-100">{feature.name}</span>
                            <span className="text-purple-300">{feature.usage}%</span>
                          </div>
                        ))}
                        {hospital.virtualisFeatures.length > 2 && (
                          <div className="text-purple-300/80 text-xs">
                            +{hospital.virtualisFeatures.length - 2} more features
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="flex items-center gap-2 pt-2">
                    <Button 
                      onClick={() => handleHospitalSelect(hospital.id)}
                      className="flex-1 bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white font-medium"
                      disabled={hospital.status === 'maintenance' || hospital.status === 'offline'}
                    >
                      {hospital.status === 'maintenance' ? (
                        <>
                          <Settings className="h-4 w-4 mr-2" />
                          Under Maintenance
                        </>
                      ) : hospital.status === 'offline' ? (
                        <>
                          <X className="h-4 w-4 mr-2" />
                          Offline
                        </>
                      ) : (
                        <>
                          <Database className="h-4 w-4 mr-2" />
                          Enter Session
                        </>
                      )}
                    </Button>
                    
                    <Button
                      onClick={() => setShowHospitalDetails(hospital.id)}
                      variant="outline"
                      size="sm"
                      className="border-white/20 text-white hover:bg-white/10"
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    
                    <Button
                      onClick={() => handleConnectionTest(hospital.id)}
                      variant="outline"
                      size="sm"
                      className="border-white/20 text-white hover:bg-white/10"
                      disabled={showConnectionTest[hospital.id]}
                    >
                      {showConnectionTest[hospital.id] ? (
                        <RefreshCw className="h-4 w-4 animate-spin" />
                      ) : (
                        <Wifi className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          /* Table View would go here - simplified for space */
          <Card className="bg-white/10 border-white/20">
            <CardContent className="p-4">
              <div className="text-center text-white/60 py-8">
                <BarChart3 className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Table view implementation</p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* No Results */}
        {filteredHospitals.length === 0 && (
          <div className="text-center py-12">
            <Hospital className="h-16 w-16 text-white/30 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">No hospitals found</h3>
            <p className="text-white/60 mb-4">Try adjusting your search or filter criteria</p>
            <Button
              onClick={() => {
                setSearchTerm('');
                setStatusFilter('all');
                setEmrFilter('all');
              }}
              className="bg-blue-600/80 hover:bg-blue-600"
            >
              Clear Filters
            </Button>
          </div>
        )}

        {/* Emergency Mode Alert */}
        {emergencyMode && (
          <Alert className="fixed top-6 left-1/2 transform -translate-x-1/2 bg-red-900/90 border-red-400/50 backdrop-blur-sm max-w-md">
            <AlertTriangle className="h-4 w-4 text-red-400 animate-pulse" />
            <AlertTitle className="text-red-200">Emergency Access Mode</AlertTitle>
            <AlertDescription className="text-red-100">
              Only online hospitals with healthy connections are shown for emergency access.
            </AlertDescription>
          </Alert>
        )}

        {/* Hospital Detail Modals */}
        {filteredHospitals.map(hospital => (
          <HospitalDetailModal 
            key={hospital.id} 
            hospital={hospital} 
            showHospitalDetails={showHospitalDetails}
            setShowHospitalDetails={setShowHospitalDetails}
          />
        ))}

        {/* EMR Connection Modal */}
        <EMRConnectionModal
          isOpen={showConnectionModal}
          onClose={handleConnectionModalClose}
          hospital={selectedHospitalForConnection}
          onConnectionComplete={handleConnectionComplete}
        />
      </div>
    </div>
  );
};

export default HospitalSelector;