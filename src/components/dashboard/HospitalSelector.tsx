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
import { mockHospitals } from '@/data/mockHospitals';
import { getStatusBadge, getConnectionHealthBadge, getApiHealthBadge } from '@/utils/hospitalHelpers';
import { useToast } from '@/hooks/use-toast';

const HospitalSelector: React.FC<HospitalSelectorProps> = ({ 
  onSelectHospital, 
  allowMultipleSelection = false,
  showAdvancedMetrics = true,
  filterByRole = true,
  emergencyMode = false
}) => {
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
      onSelectHospital(hospitalId);
    }
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

        {/* Virtualis Features */}
        {hospital.virtualisEnabled ? (
          <div className="flex items-center gap-2">
            <Brain className="h-4 w-4 text-blue-400" />
            <span className="text-sm text-blue-300">
              Virtualis AI ({hospital.virtualisFeatures.filter(f => f.enabled).length}/{hospital.virtualisFeatures.length})
            </span>
            <Badge className="bg-blue-600/20 text-blue-300 border-blue-400/30 text-xs">
              Score: {hospital.overallScore}
            </Badge>
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
          
          <Dialog>
            <DialogTrigger asChild>
              <Button 
                variant="outline"
                size="sm"
                className="flex-1 bg-slate-700/50 border-slate-600 text-white hover:bg-slate-600"
              >
                <Eye className="h-4 w-4 mr-2" />
                Details
              </Button>
            </DialogTrigger>
            <DialogContent className="virtualis-modal max-w-4xl max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="text-white">{hospital.name} - Detailed Information</DialogTitle>
                <DialogDescription className="text-slate-300">
                  Comprehensive hospital system status and metrics
                </DialogDescription>
              </DialogHeader>
              
              <Tabs defaultValue="overview" className="w-full">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="performance">Performance</TabsTrigger>
                  <TabsTrigger value="ai">AI Features</TabsTrigger>
                  <TabsTrigger value="security">Security</TabsTrigger>
                </TabsList>
                
                <TabsContent value="overview" className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <h4 className="text-white font-medium">Basic Information</h4>
                      <div className="space-y-1 text-sm text-slate-300">
                        <p><span className="text-slate-400">Location:</span> {hospital.address}</p>
                        <p><span className="text-slate-400">Phone:</span> {hospital.phone}</p>
                        <p><span className="text-slate-400">Email:</span> {hospital.email}</p>
                        <p><span className="text-slate-400">EMR Version:</span> {hospital.emrType} {hospital.emrVersion}</p>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <h4 className="text-white font-medium">System Status</h4>
                      <div className="space-y-2">
                        {getStatusBadge(hospital.status)}
                        {getConnectionHealthBadge(hospital.connectionHealth)}
                        {getApiHealthBadge(hospital.apiHealth)}
                      </div>
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="performance" className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    {hospital.performanceMetrics.map((metric, index) => (
                      <div key={index} className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-slate-300">{metric.metric}</span>
                          <span className="text-white">{metric.value}{metric.unit}</span>
                        </div>
                        <Progress 
                          value={metric.status === 'good' ? 80 : metric.status === 'warning' ? 60 : 30} 
                          className="h-2" 
                        />
                      </div>
                    ))}
                  </div>
                </TabsContent>
                
                <TabsContent value="ai" className="space-y-4">
                  <div className="space-y-4">
                    <h4 className="text-white font-medium">Virtualis AI Features</h4>
                    {hospital.virtualisFeatures.map((feature, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg">
                        <div>
                          <p className="text-white text-sm font-medium">{feature.name}</p>
                          <p className="text-slate-400 text-xs">v{feature.version} - Usage: {feature.usage}%</p>
                        </div>
                        <Badge className={feature.enabled ? "bg-green-600/20 text-green-300" : "bg-gray-600/20 text-gray-400"}>
                          {feature.enabled ? 'Active' : 'Inactive'}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </TabsContent>
                
                <TabsContent value="security" className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <h4 className="text-white font-medium">Security Level</h4>
                      <div className="flex items-center gap-2">
                        <Shield className="h-4 w-4 text-virtualis-gold" />
                        <span className="text-slate-300 capitalize">{hospital.securityLevel}</span>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <h4 className="text-white font-medium">Compliance</h4>
                      <div className="space-y-1">
                        {hospital.certifications.map((cert, index) => (
                          <div key={index} className="flex justify-between text-sm">
                            <span className="text-slate-300">{cert.name}</span>
                            <Badge className={cert.status === 'active' ? "bg-green-600/20 text-green-300" : "bg-red-600/20 text-red-300"}>
                              {cert.status}
                            </Badge>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </DialogContent>
          </Dialog>
          
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
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">
          {emergencyMode ? 'Emergency EMR Access' : 'Hospital EMR Command Center'}
        </h1>
        <p className="text-virtualis-gold">
          {emergencyMode ? 'Emergency access to available EMR systems' : 'Select a hospital to access its EMR system'}
        </p>
      </div>

      {/* Emergency Mode Alert */}
      {emergencyMode && (
        <Alert className="bg-red-900/20 border-red-400/30 mb-6">
          <AlertTriangle className="h-4 w-4 text-red-400" />
          <AlertTitle className="text-red-300">Emergency Mode Active</AlertTitle>
          <AlertDescription className="text-red-300">
            Only showing online hospitals with stable connections for emergency access.
          </AlertDescription>
        </Alert>
      )}

      {/* Controls Bar */}
      <div className="flex flex-wrap gap-4 items-center justify-between mb-6">
        <div className="flex flex-wrap gap-4 items-center">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
            <Input
              placeholder="Search hospitals or EMR..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 w-64 bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-400"
            />
          </div>
          
          {/* Filters */}
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-40 bg-slate-700/50 border-slate-600 text-white">
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
            <SelectTrigger className="w-40 bg-slate-700/50 border-slate-600 text-white">
              <SelectValue placeholder="EMR System" />
            </SelectTrigger>
            <SelectContent className="bg-slate-800 border-slate-600">
              <SelectItem value="all">All EMRs</SelectItem>
              <SelectItem value="Epic">Epic</SelectItem>
              <SelectItem value="Cerner">Cerner</SelectItem>
              <SelectItem value="Allscripts">Allscripts</SelectItem>
              <SelectItem value="AI-Native">AI-Native</SelectItem>
            </SelectContent>
          </Select>

          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-40 bg-slate-700/50 border-slate-600 text-white">
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
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setAutoRefresh(!autoRefresh)}
            className="bg-slate-700/50 border-slate-600 text-white"
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${autoRefresh ? 'animate-spin' : ''}`} />
            {autoRefresh ? 'Auto' : 'Manual'}
          </Button>
          
          {allowMultipleSelection && selectedHospitals.size > 0 && (
            <Button
              onClick={() => {
                selectedHospitals.forEach(id => onSelectHospital(id));
                setSelectedHospitals(new Set());
              }}
              className="virtualis-button"
            >
              Connect to {selectedHospitals.size} Hospital{selectedHospitals.size > 1 ? 's' : ''}
            </Button>
          )}
        </div>
      </div>

      {/* Hospital Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredHospitals.map(renderHospitalCard)}
      </div>

      {/* No Results */}
      {filteredHospitals.length === 0 && (
        <div className="text-center py-12">
          <Hospital className="h-16 w-16 text-slate-600 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-slate-400 mb-2">No hospitals found</h3>
          <p className="text-slate-500">
            {emergencyMode 
              ? "No hospitals available for emergency access with current criteria"
              : "Try adjusting your search or filter criteria"
            }
          </p>
        </div>
      )}
    </div>
  );
};

export default HospitalSelector;