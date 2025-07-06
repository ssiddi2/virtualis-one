
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Hospital, Wifi, Clock, Search, Users, Activity, Brain, Database } from "lucide-react";
import { EnhancedHospital } from "@/types/hospital";
import { mockHospitals } from "@/data/mockHospitals";
import { getStatusBadge, getConnectionHealthBadge, getApiHealthBadge } from "@/utils/hospitalHelpers";

const HospitalSelector = ({ onSelectHospital }: { onSelectHospital: (hospitalId: string) => void }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [emrFilter, setEmrFilter] = useState("all");
  const [sortBy, setSortBy] = useState("name");

  const filteredHospitals = mockHospitals
    .filter(hospital => {
      const matchesSearch = hospital.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           hospital.emrType.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === "all" || hospital.status === statusFilter;
      const matchesEmr = emrFilter === "all" || hospital.emrType === emrFilter;
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
        default:
          return 0;
      }
    });

  return (
    <div className="p-6 space-y-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">
          Hospital EMR Command Center
        </h1>
        <p className="text-virtualis-gold">
          Select a hospital to access its EMR system
        </p>
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
          <Input
            placeholder="Search hospitals or EMR..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9 bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-400"
          />
        </div>
        
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="bg-slate-700/50 border-slate-600 text-white">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent className="bg-slate-800 border-slate-600">
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="online">Online</SelectItem>
            <SelectItem value="degraded">Degraded</SelectItem>
            <SelectItem value="maintenance">Maintenance</SelectItem>
          </SelectContent>
        </Select>

        <Select value={emrFilter} onValueChange={setEmrFilter}>
          <SelectTrigger className="bg-slate-700/50 border-slate-600 text-white">
            <SelectValue placeholder="EMR System" />
          </SelectTrigger>
          <SelectContent className="bg-slate-800 border-slate-600">
            <SelectItem value="all">All EMRs</SelectItem>
            <SelectItem value="Epic">Epic</SelectItem>
            <SelectItem value="Cerner">Cerner</SelectItem>
            <SelectItem value="Allscripts">Allscripts</SelectItem>
          </SelectContent>
        </Select>

        <Select value={sortBy} onValueChange={setSortBy}>
          <SelectTrigger className="bg-slate-700/50 border-slate-600 text-white">
            <SelectValue placeholder="Sort By" />
          </SelectTrigger>
          <SelectContent className="bg-slate-800 border-slate-600">
            <SelectItem value="name">Name</SelectItem>
            <SelectItem value="status">Status</SelectItem>
            <SelectItem value="emr">EMR Type</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Hospital Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredHospitals.map((hospital) => (
          <Card key={hospital.id} className="virtualis-card hover:scale-105 transition-transform">
            <CardHeader className="pb-4">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 bg-virtualis-gold rounded-lg flex items-center justify-center">
                  <Hospital className="h-5 w-5 text-white" />
                </div>
                <div>
                  <CardTitle className="text-white text-lg">{hospital.name}</CardTitle>
                  <p className="text-slate-400 text-sm">{hospital.location}</p>
                </div>
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

              {/* Health Status Row */}
              <div className="grid grid-cols-2 gap-2">
                {getConnectionHealthBadge(hospital.connectionHealth)}
                {getApiHealthBadge(hospital.apiHealth)}
              </div>

              {/* Virtualis Features */}
              {hospital.virtualisEnabled && (
                <div className="flex items-center gap-2">
                  <Brain className="h-4 w-4 text-blue-400" />
                  <span className="text-sm text-blue-300">
                    Virtualis AI ({hospital.virtualisFeatures.filter(f => f.enabled).length}/{hospital.virtualisFeatures.length})
                  </span>
                  <Badge className="bg-blue-600/20 text-blue-300 border-blue-400/30 text-xs">
                    Score: {hospital.overallScore}
                  </Badge>
                </div>
              )}

              {/* Alerts */}
              {hospital.criticalAlerts > 0 && (
                <div className="bg-red-900/20 border border-red-400/30 rounded p-2">
                  <span className="text-red-300 text-xs">
                    {hospital.criticalAlerts} Critical Alert{hospital.criticalAlerts > 1 ? 's' : ''}
                  </span>
                </div>
              )}
              
              <Button 
                onClick={() => onSelectHospital(hospital.id)}
                className="w-full virtualis-button"
                disabled={hospital.status === 'maintenance' || hospital.status === 'offline'}
              >
                {hospital.status === 'maintenance' ? 'Under Maintenance' : 
                 hospital.status === 'offline' ? 'System Offline' : 'Enter Session'}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredHospitals.length === 0 && (
        <div className="text-center py-12">
          <Hospital className="h-16 w-16 text-slate-600 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-slate-400 mb-2">No hospitals found</h3>
          <p className="text-slate-500">Try adjusting your search or filter criteria</p>
        </div>
      )}
    </div>
  );
};

export default HospitalSelector;
