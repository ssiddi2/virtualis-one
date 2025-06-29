
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  Search,
  MessageSquare,
  Clock,
  AlertTriangle,
  ChevronRight,
  Users
} from 'lucide-react';

interface ChatThread {
  id: string;
  participants: string[];
  lastMessage: string;
  timestamp: Date;
  acuity: 'critical' | 'urgent' | 'routine';
  unreadCount: number;
  patientName?: string;
  specialty?: string;
  isGroup: boolean;
}

interface ChatListSidebarProps {
  activeThreadId?: string;
  onThreadSelect: (threadId: string) => void;
  onNewChat: () => void;
}

const ChatListSidebar = ({ activeThreadId, onThreadSelect, onNewChat }: ChatListSidebarProps) => {
  const [searchTerm, setSearchTerm] = useState('');

  // Mock chat threads data
  const chatThreads: ChatThread[] = [
    {
      id: '1',
      participants: ['Frank Jones', 'Dr. Infectious Disease'],
      lastMessage: 'Patient showing signs of respiratory distress...',
      timestamp: new Date(Date.now() - 5 * 60000),
      acuity: 'critical',
      unreadCount: 2,
      patientName: 'Frank Jones',
      specialty: 'Infectious Disease',
      isGroup: false
    },
    {
      id: '2',
      participants: ['Dr. Hana', 'Frank', '+2 more'],
      lastMessage: 'Lol',
      timestamp: new Date(Date.now() - 10 * 60000),
      acuity: 'routine',
      unreadCount: 0,
      isGroup: true
    },
    {
      id: '3',
      participants: ['Dr. Hana Khan'],
      lastMessage: 'Hello 👋',
      timestamp: new Date(Date.now() - 15 * 60000),
      acuity: 'routine',
      unreadCount: 1,
      isGroup: false
    },
    {
      id: '4',
      participants: ['Frank', 'Dr. Sam', '+6 more'],
      lastMessage: 'So sickkkkk Alh!',
      timestamp: new Date(Date.now() - 20 * 60000),
      acuity: 'urgent',
      unreadCount: 0,
      isGroup: true
    },
    {
      id: '5',
      participants: ['Dr. Sohail D.O.C'],
      lastMessage: "There's re some critical bugs we are working thru...",
      timestamp: new Date(Date.now() - 25 * 60000),
      acuity: 'critical',
      unreadCount: 1,
      isGroup: false
    }
  ];

  const getAcuityColor = (acuity: string) => {
    switch (acuity) {
      case 'critical': return 'border-l-red-500 bg-red-500/5';
      case 'urgent': return 'border-l-yellow-500 bg-yellow-500/5';
      case 'routine': return 'border-l-green-500 bg-green-500/5';
      default: return 'border-l-gray-500 bg-gray-500/5';
    }
  };

  const getAcuityHaloColor = (acuity: string) => {
    switch (acuity) {
      case 'critical': return 'ring-2 ring-red-500/50';
      case 'urgent': return 'ring-2 ring-yellow-500/50';
      case 'routine': return 'ring-2 ring-green-500/50';
      default: return 'ring-2 ring-gray-500/50';
    }
  };

  const filteredThreads = chatThreads.filter(thread => 
    thread.participants.some(p => p.toLowerCase().includes(searchTerm.toLowerCase())) ||
    thread.lastMessage.toLowerCase().includes(searchTerm.toLowerCase()) ||
    thread.patientName?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatTime = (date: Date) => {
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);
    
    if (diffInHours < 24) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else {
      return date.toLocaleDateString();
    }
  };

  return (
    <div className="w-80 h-full backdrop-blur-xl bg-blue-500/10 border-r border-blue-300/30">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-white text-lg">CHAT</CardTitle>
          <Button
            size="sm"
            onClick={onNewChat}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            <MessageSquare className="h-4 w-4" />
          </Button>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-white/60" />
          <Input
            placeholder="Search"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-white/60"
          />
        </div>
      </CardHeader>
      
      <CardContent className="p-0 h-[calc(100%-140px)] overflow-y-auto">
        <div className="space-y-1">
          {filteredThreads.map((thread) => (
            <div
              key={thread.id}
              onClick={() => onThreadSelect(thread.id)}
              className={`
                p-4 cursor-pointer transition-all border-l-4 hover:bg-blue-500/20
                ${getAcuityColor(thread.acuity)}
                ${activeThreadId === thread.id ? 'bg-blue-500/30' : ''}
              `}
            >
              <div className="flex items-start gap-3">
                <div className="relative">
                  <Avatar className={`h-12 w-12 ${getAcuityHaloColor(thread.acuity)}`}>
                    <AvatarImage src={`/api/placeholder/48/48`} />
                    <AvatarFallback className="bg-blue-600/50 text-white text-sm">
                      {thread.isGroup ? (
                        <Users className="h-5 w-5" />
                      ) : (
                        thread.participants[0]?.charAt(0) || 'U'
                      )}
                    </AvatarFallback>
                  </Avatar>
                  {thread.acuity === 'critical' && (
                    <div className="absolute -top-1 -right-1">
                      <AlertTriangle className="h-4 w-4 text-red-500 fill-red-500" />
                    </div>
                  )}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="text-white font-semibold text-sm truncate">
                      {thread.participants.join(', ')}
                    </h3>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-white/60">
                        {formatTime(thread.timestamp)}
                      </span>
                      <ChevronRight className="h-4 w-4 text-white/40" />
                    </div>
                  </div>
                  
                  {thread.specialty && (
                    <div className="mb-1">
                      <Badge className="bg-purple-500/20 text-purple-200 border-purple-400/30 text-xs">
                        {thread.specialty}
                      </Badge>
                    </div>
                  )}
                  
                  {thread.patientName && (
                    <div className="text-xs text-blue-300 mb-1">
                      Room: 405 / {thread.patientName}
                    </div>
                  )}
                  
                  <p className="text-white/70 text-sm truncate mb-2">
                    {thread.lastMessage}
                  </p>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1">
                      {thread.lastMessage.includes('delivered') && (
                        <span className="text-green-400 text-xs">delivered ✓</span>
                      )}
                      {thread.lastMessage.includes('read') && (
                        <span className="text-blue-400 text-xs">read ✓</span>
                      )}
                    </div>
                    
                    {thread.unreadCount > 0 && (
                      <Badge className="bg-red-500 text-white text-xs min-w-[20px] h-5 flex items-center justify-center rounded-full">
                        {thread.unreadCount}
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </div>
  );
};

export default ChatListSidebar;
