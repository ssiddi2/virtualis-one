import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { usePatients } from '@/hooks/usePatients';
import { 
  User, 
  Search, 
  MessageSquare, 
  AlertTriangle, 
  Clock,
  Stethoscope,
  Plus,
  Filter
} from 'lucide-react';

interface PatientThread {
  id: string;
  patientId: string;
  patientName: string;
  mrn: string;
  roomNumber?: string;
  lastMessage: string;
  lastMessageTime: Date;
  unreadCount: number;
  acuity: 'critical' | 'urgent' | 'routine';
  participants: string[];
  messageCount: number;
  isActive: boolean;
}

interface PatientThreadManagerProps {
  hospitalId: string;
  onThreadSelect: (thread: PatientThread) => void;
  activeThreadId?: string;
}

const PatientThreadManager = ({ hospitalId, onThreadSelect, activeThreadId }: PatientThreadManagerProps) => {
  const { data: patients } = usePatients(hospitalId);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterBy, setFilterBy] = useState<'all' | 'critical' | 'urgent' | 'unread'>('all');
  const [patientThreads, setPatientThreads] = useState<PatientThread[]>([]);

  // Initialize patient threads from existing patients
  useEffect(() => {
    if (!patients) return;

    const mockThreads: PatientThread[] = patients.map((patient, index) => ({
      id: `thread-${patient.id}`,
      patientId: patient.id,
      patientName: `${patient.first_name} ${patient.last_name}`,
      mrn: patient.mrn,
      roomNumber: patient.room_number,
      lastMessage: index === 0 ? 'Patient experiencing chest pain, vitals stable' :
                   index === 1 ? 'Post-op recovery progressing well' :
                   index === 2 ? 'Lab results pending review' :
                   'Patient thread created',
      lastMessageTime: new Date(Date.now() - (index * 30 * 60000)), // Stagger times
      unreadCount: index === 0 ? 2 : index === 1 ? 1 : 0,
      acuity: (index === 0 ? 'critical' : index === 1 ? 'urgent' : 'routine') as 'critical' | 'urgent' | 'routine',
      participants: [
        'Dr. Johnson',
        'Nurse Smith',
        ...(index === 0 ? ['Dr. Cardiology'] : []),
        ...(index === 1 ? ['Dr. Surgery'] : [])
      ],
      messageCount: Math.floor(Math.random() * 10) + 1,
      isActive: index < 3 // First 3 threads are active
    })).filter(thread => thread.isActive);

    setPatientThreads(mockThreads);
  }, [patients]);

  const filteredThreads = patientThreads.filter(thread => {
    const matchesSearch = thread.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         thread.mrn.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         (thread.roomNumber && thread.roomNumber.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesFilter = filterBy === 'all' || 
                         (filterBy === 'critical' && thread.acuity === 'critical') ||
                         (filterBy === 'urgent' && thread.acuity === 'urgent') ||
                         (filterBy === 'unread' && thread.unreadCount > 0);
    
    return matchesSearch && matchesFilter;
  });

  const sortedThreads = filteredThreads.sort((a, b) => {
    // Sort by acuity first (critical > urgent > routine)
    const acuityOrder = { critical: 3, urgent: 2, routine: 1 };
    if (acuityOrder[a.acuity] !== acuityOrder[b.acuity]) {
      return acuityOrder[b.acuity] - acuityOrder[a.acuity];
    }
    // Then by last message time
    return b.lastMessageTime.getTime() - a.lastMessageTime.getTime();
  });

  const getAcuityColor = (acuity: string) => {
    switch (acuity) {
      case 'critical': return 'text-red-300 bg-red-500/20 border-red-400/30';
      case 'urgent': return 'text-orange-300 bg-orange-500/20 border-orange-400/30';
      case 'routine': return 'text-green-300 bg-green-500/20 border-green-400/30';
      default: return 'text-gray-300 bg-gray-500/20 border-gray-400/30';
    }
  };

  const getAcuityIcon = (acuity: string) => {
    switch (acuity) {
      case 'critical': return <AlertTriangle className="h-3 w-3" />;
      case 'urgent': return <Clock className="h-3 w-3" />;
      case 'routine': return <MessageSquare className="h-3 w-3" />;
      default: return <MessageSquare className="h-3 w-3" />;
    }
  };

  const createNewPatientThread = (patientId: string) => {
    const patient = patients?.find(p => p.id === patientId);
    if (!patient) return;

    const newThread: PatientThread = {
      id: `thread-${patientId}-${Date.now()}`,
      patientId,
      patientName: `${patient.first_name} ${patient.last_name}`,
      mrn: patient.mrn,
      roomNumber: patient.room_number,
      lastMessage: 'New patient conversation started',
      lastMessageTime: new Date(),
      unreadCount: 0,
      acuity: 'routine',
      participants: ['Current User'],
      messageCount: 0,
      isActive: true
    };

    setPatientThreads(prev => [newThread, ...prev]);
    onThreadSelect(newThread);
  };

  return (
    <div className="w-80 backdrop-blur-xl bg-blue-500/20 border-r border-blue-300/30 flex flex-col h-full">
      <CardHeader className="pb-4">
        <CardTitle className="text-white flex items-center gap-2">
          <User className="h-5 w-5 text-blue-300" />
          Patient Threads
        </CardTitle>
        
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-white/60" />
          <Input
            placeholder="Search patients..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-white/60"
          />
        </div>

        {/* Filters */}
        <div className="flex gap-1 flex-wrap">
          {['all', 'critical', 'urgent', 'unread'].map((filter) => (
            <Button
              key={filter}
              size="sm"
              variant={filterBy === filter ? "default" : "outline"}
              onClick={() => setFilterBy(filter as any)}
              className={`text-xs ${filterBy === filter 
                ? "bg-blue-600 hover:bg-blue-700 text-white" 
                : "bg-transparent border-blue-400/30 text-white hover:bg-blue-500/20"
              }`}
            >
              {filter.charAt(0).toUpperCase() + filter.slice(1)}
              {filter === 'unread' && (
                <Badge className="ml-1 bg-red-500/20 text-red-300 text-xs">
                  {patientThreads.reduce((sum, t) => sum + t.unreadCount, 0)}
                </Badge>
              )}
            </Button>
          ))}
        </div>
      </CardHeader>

      <ScrollArea className="flex-1 px-4">
        <div className="space-y-2 pb-4">
          {sortedThreads.map((thread) => (
            <Card
              key={thread.id}
              className={`cursor-pointer transition-all duration-200 ${
                activeThreadId === thread.id
                  ? 'bg-blue-600/30 border-blue-400/50 shadow-lg'
                  : 'bg-blue-600/10 border-blue-400/20 hover:bg-blue-600/20'
              }`}
              onClick={() => onThreadSelect(thread)}
            >
              <CardContent className="p-3">
                <div className="flex items-start gap-3">
                  <div className="relative">
                    <Avatar className="h-10 w-10">
                      <AvatarFallback className="bg-blue-600/50 text-white text-xs">
                        {thread.patientName.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div className="absolute -bottom-1 -right-1">
                      <Badge className={`${getAcuityColor(thread.acuity)} text-xs p-1`}>
                        {getAcuityIcon(thread.acuity)}
                      </Badge>
                    </div>
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-white text-sm truncate">
                          {thread.patientName}
                        </span>
                        {thread.unreadCount > 0 && (
                          <Badge className="bg-red-500/20 text-red-300 text-xs">
                            {thread.unreadCount}
                          </Badge>
                        )}
                      </div>
                      <span className="text-xs text-white/60">
                        {thread.lastMessageTime.toLocaleTimeString([], { 
                          hour: '2-digit', 
                          minute: '2-digit' 
                        })}
                      </span>
                    </div>
                    
                    <div className="flex items-center gap-2 mb-2">
                      <Badge className="bg-blue-500/20 text-blue-200 text-xs">
                        MRN: {thread.mrn}
                      </Badge>
                      {thread.roomNumber && (
                        <Badge className="bg-green-500/20 text-green-200 text-xs">
                          Room {thread.roomNumber}
                        </Badge>
                      )}
                    </div>
                    
                    <p className="text-white/80 text-xs truncate mb-2">
                      {thread.lastMessage}
                    </p>
                    
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-1 text-white/60">
                        <MessageSquare className="h-3 w-3" />
                        <span>{thread.messageCount} messages</span>
                      </div>
                      <div className="flex items-center gap-1 text-white/60">
                        <Stethoscope className="h-3 w-3" />
                        <span>{thread.participants.length} participants</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
          
          {sortedThreads.length === 0 && (
            <div className="text-center py-8 text-white/60">
              <MessageSquare className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p className="text-sm">No patient threads found</p>
              <p className="text-xs mt-1">Try adjusting your search or filters</p>
            </div>
          )}
        </div>
      </ScrollArea>

      {/* Create New Thread Button */}
      <div className="p-4 border-t border-blue-300/30">
        <Button
          className="w-full bg-blue-600 hover:bg-blue-700 text-white"
          onClick={() => {
            // This would normally open a patient selection dialog
            if (patients && patients.length > 0) {
              const randomPatient = patients[Math.floor(Math.random() * patients.length)];
              createNewPatientThread(randomPatient.id);
            }
          }}
        >
          <Plus className="h-4 w-4 mr-2" />
          New Patient Thread
        </Button>
      </div>
    </div>
  );
};

export default PatientThreadManager;
