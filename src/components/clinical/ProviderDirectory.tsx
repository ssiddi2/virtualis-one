
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Search, 
  User, 
  Stethoscope, 
  Phone, 
  Clock,
  AlertCircle,
  CheckCircle
} from "lucide-react";

export interface Provider {
  id: string;
  name: string;
  specialty: string;
  role: 'doctor' | 'nurse' | 'resident' | 'attending';
  department: string;
  isOnCall: boolean;
  status: 'available' | 'busy' | 'off-duty';
  phone?: string;
  pager?: string;
  responseTime: string;
  rating: number;
}

interface ProviderDirectoryProps {
  onSelectProvider: (provider: Provider) => void;
  selectedSpecialty?: string;
}

const ProviderDirectory = ({ onSelectProvider, selectedSpecialty }: ProviderDirectoryProps) => {
  const [providers, setProviders] = useState<Provider[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterSpecialty, setFilterSpecialty] = useState(selectedSpecialty || 'all');
  const [filterRole, setFilterRole] = useState('all');
  const [showOnCallOnly, setShowOnCallOnly] = useState(false);

  // Mock data - in real implementation, this would come from your database
  useEffect(() => {
    const mockProviders: Provider[] = [
      {
        id: '1',
        name: 'Dr. Sarah Johnson',
        specialty: 'Cardiology',
        role: 'attending',
        department: 'Cardiac Unit',
        isOnCall: true,
        status: 'available',
        phone: '(555) 123-4567',
        pager: '1234',
        responseTime: '< 5 min',
        rating: 4.8
      },
      {
        id: '2',
        name: 'Dr. Michael Chen',
        specialty: 'Emergency Medicine',
        role: 'attending',
        department: 'Emergency Department',
        isOnCall: true,
        status: 'busy',
        phone: '(555) 234-5678',
        pager: '2345',
        responseTime: '< 10 min',
        rating: 4.9
      },
      {
        id: '3',
        name: 'Dr. Emily Rodriguez',
        specialty: 'Pulmonology',
        role: 'attending',
        department: 'Respiratory Unit',
        isOnCall: false,
        status: 'available',
        phone: '(555) 345-6789',
        responseTime: '< 15 min',
        rating: 4.7
      },
      {
        id: '4',
        name: 'Nurse Patricia Williams',
        specialty: 'Critical Care',
        role: 'nurse',
        department: 'ICU',
        isOnCall: true,
        status: 'available',
        phone: '(555) 456-7890',
        responseTime: '< 3 min',
        rating: 4.6
      },
      {
        id: '5',
        name: 'Dr. David Kim',
        specialty: 'Neurology',
        role: 'resident',
        department: 'Neurology',
        isOnCall: true,
        status: 'available',
        phone: '(555) 567-8901',
        responseTime: '< 8 min',
        rating: 4.4
      }
    ];
    setProviders(mockProviders);
  }, []);

  const filteredProviders = providers.filter(provider => {
    const matchesSearch = provider.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         provider.specialty.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSpecialty = filterSpecialty === 'all' || provider.specialty === filterSpecialty;
    const matchesRole = filterRole === 'all' || provider.role === filterRole;
    const matchesOnCall = !showOnCallOnly || provider.isOnCall;
    
    return matchesSearch && matchesSpecialty && matchesRole && matchesOnCall;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available': return 'bg-green-600 text-white';
      case 'busy': return 'bg-yellow-600 text-white';
      case 'off-duty': return 'bg-gray-600 text-white';
      default: return 'bg-gray-600 text-white';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'available': return <CheckCircle className="h-3 w-3" />;
      case 'busy': return <Clock className="h-3 w-3" />;
      case 'off-duty': return <AlertCircle className="h-3 w-3" />;
      default: return <AlertCircle className="h-3 w-3" />;
    }
  };

  const specialties = [...new Set(providers.map(p => p.specialty))];

  return (
    <Card className="bg-[#1a2332] border-[#2a3441] text-white">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <User className="h-5 w-5" />
          Provider Directory
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Search and Filters */}
        <div className="space-y-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-white/60" />
            <Input
              placeholder="Search providers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-[#0f1922] border-[#2a3441] text-white"
            />
          </div>
          
          <div className="grid grid-cols-2 gap-2">
            <Select value={filterSpecialty} onValueChange={setFilterSpecialty}>
              <SelectTrigger className="bg-[#0f1922] border-[#2a3441] text-white">
                <SelectValue placeholder="Specialty" />
              </SelectTrigger>
              <SelectContent className="bg-[#1a2332] border-[#2a3441] text-white">
                <SelectItem value="all">All Specialties</SelectItem>
                {specialties.map(specialty => (
                  <SelectItem key={specialty} value={specialty}>{specialty}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Select value={filterRole} onValueChange={setFilterRole}>
              <SelectTrigger className="bg-[#0f1922] border-[#2a3441] text-white">
                <SelectValue placeholder="Role" />
              </SelectTrigger>
              <SelectContent className="bg-[#1a2332] border-[#2a3441] text-white">
                <SelectItem value="all">All Roles</SelectItem>
                <SelectItem value="doctor">Doctors</SelectItem>
                <SelectItem value="nurse">Nurses</SelectItem>
                <SelectItem value="resident">Residents</SelectItem>
                <SelectItem value="attending">Attendings</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <Button
            variant={showOnCallOnly ? "default" : "outline"}
            onClick={() => setShowOnCallOnly(!showOnCallOnly)}
            className={showOnCallOnly 
              ? "bg-blue-600 hover:bg-blue-700 w-full" 
              : "bg-transparent border-[#2a3441] text-white hover:bg-[#2a3441] w-full"
            }
          >
            {showOnCallOnly ? "Showing On-Call Only" : "Show On-Call Only"}
          </Button>
        </div>

        {/* Provider List */}
        <div className="space-y-2 max-h-60 overflow-y-auto">
          {filteredProviders.map((provider) => (
            <div
              key={provider.id}
              className="p-3 bg-[#0f1922] rounded-lg border border-[#2a3441] hover:bg-[#1a2332] transition-colors cursor-pointer"
              onClick={() => onSelectProvider(provider)}
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-blue-400" />
                  <div>
                    <p className="font-medium text-white">{provider.name}</p>
                    <p className="text-xs text-white/60">{provider.department}</p>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  {provider.isOnCall && (
                    <Badge className="bg-red-600 text-white text-xs">ON CALL</Badge>
                  )}
                  <Badge className={`text-xs ${getStatusColor(provider.status)}`}>
                    {getStatusIcon(provider.status)}
                    <span className="ml-1">{provider.status.toUpperCase()}</span>
                  </Badge>
                </div>
              </div>
              
              <div className="flex items-center justify-between text-xs text-white/70">
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1">
                    <Stethoscope className="h-3 w-3" />
                    <span>{provider.specialty}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    <span>{provider.responseTime}</span>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <span>★ {provider.rating}</span>
                </div>
              </div>
              
              {provider.phone && (
                <div className="flex items-center gap-1 mt-1 text-xs text-white/60">
                  <Phone className="h-3 w-3" />
                  <span>{provider.phone}</span>
                  {provider.pager && <span>• Pager: {provider.pager}</span>}
                </div>
              )}
            </div>
          ))}
        </div>
        
        {filteredProviders.length === 0 && (
          <div className="text-center py-4 text-white/60">
            No providers found matching your criteria
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ProviderDirectory;
