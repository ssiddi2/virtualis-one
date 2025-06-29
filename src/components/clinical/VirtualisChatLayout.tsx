import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  MessageCircle, 
  Phone, 
  Video, 
  Search, 
  Filter,
  Clock,
  UserCheck,
  AlertCircle,
  ChevronRight,
  Plus,
  Stethoscope,
  Users,
  Settings,
  Bell
} from 'lucide-react';
import { usePhysicians } from '@/hooks/usePhysicians';

interface VirtualisChatLayoutProps {
  children?: React.ReactNode;
  hospitalId?: string;
}

const VirtualisChatLayout = ({ children, hospitalId }: VirtualisChatLayoutProps) => {
  const [selectedSpecialty, setSelectedSpecialty] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('available');
  const { data: physicians } = usePhysicians();

  // Sample specialties data
  const specialties = [
    { id: '1', name: 'Cardiology', description: 'Heart and cardiovascular system' },
    { id: '2', name: 'Emergency Medicine', description: 'Emergency and urgent care' },
    { id: '3', name: 'Internal Medicine', description: 'General internal medicine' },
    { id: '4', name: 'Radiology', description: 'Medical imaging' },
    { id: '5', name: 'Orthopedics', description: 'Bones and joints' },
    { id: '6', name: 'Neurology', description: 'Brain and nervous system' }
  ];

  // Mock on-call data
  const onCallSchedule = [
    { specialty: 'Cardiology', physician: 'Dr. Sarah Chen', status: 'Available', until: '23:00' },
    { specialty: 'Emergency Medicine', physician: 'Dr. Michael Rodriguez', status: 'Busy', until: '08:00' },
    { specialty: 'Radiology', physician: 'Dr. Jennifer Kim', status: 'Available', until: '06:00' },
    { specialty: 'Neurology', physician: 'Dr. David Wilson', status: 'On Call', until: '07:00' }
  ];

  // Mock recent consultations
  const recentConsultations = [
    {
      id: 1,
      patient: 'John Smith',
      specialty: 'Cardiology',
      physician: 'Dr. Sarah Chen',
      timestamp: '2 hours ago',
      status: 'Completed',
      priority: 'Urgent'
    },
    {
      id: 2,
      patient: 'Mary Johnson',
      specialty: 'Neurology',
      physician: 'Dr. David Wilson',
      timestamp: '4 hours ago',
      status: 'In Progress',
      priority: 'Routine'
    },
    {
      id: 3,
      patient: 'Robert Davis',
      specialty: 'Emergency Medicine',
      physician: 'Dr. Michael Rodriguez',
      timestamp: '6 hours ago',
      status: 'Completed',
      priority: 'STAT'
    }
  ];

  // Filter physicians based on search and specialty
  const filteredPhysicians = physicians?.filter(physician => {
    const matchesSearch = physician.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         physician.last_name.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesSpecialty = !selectedSpecialty || 
      (physician.specialty && 
       typeof physician.specialty === 'object' && 
       'name' in physician.specialty && 
       typeof physician.specialty.name === 'string' &&
       physician.specialty.name.toLowerCase().includes(selectedSpecialty.toLowerCase()));
    
    // Filter by hospital if hospitalId is provided
    const matchesHospital = !hospitalId || physician.hospital_id === hospitalId;
    
    return matchesSearch && matchesSpecialty && matchesHospital;
  }) || [];

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'available': return 'bg-green-500/20 text-green-300 border-green-500/30';
      case 'busy': return 'bg-red-500/20 text-red-300 border-red-500/30';
      case 'on call': return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30';
      default: return 'bg-gray-500/20 text-gray-300 border-gray-500/30';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority?.toLowerCase()) {
      case 'stat': return 'bg-red-500/20 text-red-300 border-red-500/30';
      case 'urgent': return 'bg-orange-500/20 text-orange-300 border-orange-500/30';
      case 'routine': return 'bg-blue-500/20 text-blue-300 border-blue-500/30';
      default: return 'bg-gray-500/20 text-gray-300 border-gray-500/30';
    }
  };

  return (
    <div className="flex h-screen bg-[#0a1628]">
      {/* Left Sidebar - Navigation & Specialties */}
      <div className="w-80 border-r border-slate-700 bg-slate-800/50 flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-slate-700">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-blue-600/20 rounded-lg">
              <Stethoscope className="h-6 w-6 text-blue-400" />
            </div>
            <div>
              <h1 className="text-lg font-semibold text-white">Virtualis Clinical Chat</h1>
              <p className="text-sm text-slate-400">Intelligent consultation platform</p>
            </div>
          </div>
          
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input
              placeholder="Search physicians..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-slate-700/50 border-slate-600 text-white placeholder-slate-400"
            />
          </div>
        </div>

        {/* Specialty Filter */}
        <div className="p-4 border-b border-slate-700">
          <Select value={selectedSpecialty} onValueChange={setSelectedSpecialty}>
            <SelectTrigger className="bg-slate-700/50 border-slate-600 text-white">
              <SelectValue placeholder="Filter by specialty" />
            </SelectTrigger>
            <SelectContent className="bg-slate-800 border-slate-700">
              <SelectItem value="">All Specialties</SelectItem>
              {specialties.map((specialty) => (
                <SelectItem key={specialty.id} value={specialty.name}>
                  {specialty.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Content Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
          <TabsList className="grid w-full grid-cols-3 mx-4 mb-4 bg-slate-700/50">
            <TabsTrigger value="available" className="data-[state=active]:bg-slate-600 text-white">
              Available
            </TabsTrigger>
            <TabsTrigger value="oncall" className="data-[state=active]:bg-slate-600 text-white">
              On-Call
            </TabsTrigger>
            <TabsTrigger value="recent" className="data-[state=active]:bg-slate-600 text-white">
              Recent
            </TabsTrigger>
          </TabsList>

          <div className="flex-1 overflow-hidden">
            <TabsContent value="available" className="h-full m-0">
              <ScrollArea className="h-full px-4">
                <div className="space-y-3">
                  {filteredPhysicians.length > 0 ? (
                    filteredPhysicians.map((physician) => (
                      <Card key={physician.id} className="bg-slate-700/30 border-slate-600 hover:bg-slate-700/50 transition-colors cursor-pointer">
                        <CardContent className="p-4">
                          <div className="flex items-center gap-3">
                            <Avatar className="h-10 w-10">
                              <AvatarFallback className="bg-blue-600/20 text-blue-300">
                                {physician.first_name.charAt(0)}{physician.last_name.charAt(0)}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between">
                                <h3 className="font-medium text-white truncate">
                                  Dr. {physician.first_name} {physician.last_name}
                                </h3>
                                <Badge className="bg-green-500/20 text-green-300 border-green-500/30 text-xs">
                                  Available
                                </Badge>
                              </div>
                              <p className="text-sm text-slate-400 truncate">
                                {physician.specialty && typeof physician.specialty === 'object' && 'name' in physician.specialty 
                                  ? physician.specialty.name as string
                                  : 'General Medicine'}
                              </p>
                              <div className="flex items-center gap-2 mt-2">
                                <Button size="sm" className="h-7 px-2 bg-blue-600/20 hover:bg-blue-600/30 border border-blue-500/30">
                                  <MessageCircle className="h-3 w-3 mr-1" />
                                  Chat
                                </Button>
                                <Button size="sm" variant="outline" className="h-7 px-2 border-slate-600 text-slate-300 hover:bg-slate-700">
                                  <Phone className="h-3 w-3 mr-1" />
                                  Call
                                </Button>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))
                  ) : (
                    <div className="text-center py-8">
                      <Users className="h-12 w-12 text-slate-500 mx-auto mb-3" />
                      <p className="text-slate-400">No physicians found</p>
                      <p className="text-sm text-slate-500 mt-1">Try adjusting your search or filters</p>
                    </div>
                  )}
                </div>
              </ScrollArea>
            </TabsContent>

            <TabsContent value="oncall" className="h-full m-0">
              <ScrollArea className="h-full px-4">
                <div className="space-y-3">
                  {onCallSchedule.map((schedule, index) => (
                    <Card key={index} className="bg-slate-700/30 border-slate-600">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="font-medium text-white">{schedule.specialty}</h3>
                          <Badge className={getStatusColor(schedule.status)}>
                            {schedule.status}
                          </Badge>
                        </div>
                        <p className="text-sm text-slate-300 mb-1">{schedule.physician}</p>
                        <div className="flex items-center gap-2 text-xs text-slate-400">
                          <Clock className="h-3 w-3" />
                          Until {schedule.until}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </ScrollArea>
            </TabsContent>

            <TabsContent value="recent" className="h-full m-0">
              <ScrollArea className="h-full px-4">
                <div className="space-y-3">
                  {recentConsultations.map((consultation) => (
                    <Card key={consultation.id} className="bg-slate-700/30 border-slate-600 hover:bg-slate-700/50 transition-colors cursor-pointer">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="font-medium text-white">{consultation.patient}</h3>
                          <Badge className={getPriorityColor(consultation.priority)}>
                            {consultation.priority}
                          </Badge>
                        </div>
                        <p className="text-sm text-slate-300 mb-1">{consultation.specialty}</p>
                        <p className="text-sm text-slate-400 mb-2">{consultation.physician}</p>
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-slate-500">{consultation.timestamp}</span>
                          <Badge variant="outline" className={
                            consultation.status === 'Completed' 
                              ? 'border-green-500/30 text-green-300' 
                              : 'border-yellow-500/30 text-yellow-300'
                          }>
                            {consultation.status}
                          </Badge>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </ScrollArea>
            </TabsContent>
          </div>
        </Tabs>

        {/* Quick Actions */}
        <div className="p-4 border-t border-slate-700">
          <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white mb-2">
            <Plus className="h-4 w-4 mr-2" />
            New Consultation
          </Button>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="flex-1 border-slate-600 text-slate-300 hover:bg-slate-700">
              <Settings className="h-4 w-4 mr-1" />
              Settings
            </Button>
            <Button variant="outline" size="sm" className="flex-1 border-slate-600 text-slate-300 hover:bg-slate-700">
              <Bell className="h-4 w-4 mr-1" />
              Alerts
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col">
        {children}
      </div>
    </div>
  );
};

export default VirtualisChatLayout;
