
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  MessageSquare, 
  Plus, 
  Search, 
  AlertTriangle, 
  Clock, 
  Users,
  User
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
  messages: any[];
  priorityScore?: number;
}

interface ChatListSidebarProps {
  activeThreadId: string;
  onThreadSelect: (threadId: string) => void;
  onNewChat: () => void;
  chatThreads: ChatThread[];
}

const ChatListSidebar = ({ activeThreadId, onThreadSelect, onNewChat, chatThreads }: ChatListSidebarProps) => {
  const [searchQuery, setSearchQuery] = useState('');

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

  const filteredThreads = chatThreads.filter(thread => {
    if (!searchQuery.trim()) return true;
    
    const query = searchQuery.toLowerCase();
    const participantsMatch = thread.participants.some(p => 
      p && typeof p === 'string' && p.toLowerCase().includes(query)
    );
    const patientMatch = thread.patientName && 
      typeof thread.patientName === 'string' && 
      thread.patientName.toLowerCase().includes(query);
    const specialtyMatch = thread.specialty && 
      typeof thread.specialty === 'string' && 
      thread.specialty.toLowerCase().includes(query);
    
    return participantsMatch || patientMatch || specialtyMatch;
  }).sort((a, b) => {
    // Sort by priority score first, then by timestamp
    if (a.priorityScore !== b.priorityScore) {
      return (b.priorityScore || 0) - (a.priorityScore || 0);
    }
    return b.timestamp.getTime() - a.timestamp.getTime();
  });

  return (
    <div className="w-80 h-full backdrop-blur-xl bg-blue-500/20 border-r border-blue-300/30 flex flex-col">
      <div className="p-4 border-b border-blue-300/30">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-white">Clinical Chats</h2>
          <Button
            onClick={onNewChat}
            size="sm"
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-white/60" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search conversations..."
            className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-white/60"
          />
        </div>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-2 space-y-2">
          {filteredThreads.map((thread) => (
            <div
              key={thread.id}
              onClick={() => onThreadSelect(thread.id)}
              className={`p-3 rounded-lg cursor-pointer transition-colors ${
                activeThreadId === thread.id
                  ? 'bg-blue-600/30 border border-blue-400/50'
                  : 'hover:bg-blue-600/20 border border-transparent hover:border-blue-400/30'
              }`}
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2 min-w-0 flex-1">
                  {thread.isGroup ? (
                    <Users className="h-4 w-4 text-blue-300 flex-shrink-0" />
                  ) : (
                    <User className="h-4 w-4 text-blue-300 flex-shrink-0" />
                  )}
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-white truncate">
                      {thread.participants.join(', ')}
                    </p>
                    {thread.patientName && (
                      <p className="text-xs text-blue-300">
                        Patient: {thread.patientName}
                      </p>
                    )}
                  </div>
                </div>
                
                <div className="flex items-center gap-1 flex-shrink-0">
                  <Badge className={`${getAcuityColor(thread.acuity)} text-xs border`}>
                    {getAcuityIcon(thread.acuity)}
                  </Badge>
                  {thread.priorityScore && (
                    <Badge className="bg-purple-500/20 text-purple-200 text-xs">
                      P{thread.priorityScore}
                    </Badge>
                  )}
                </div>
              </div>
              
              <p className="text-xs text-white/70 mb-2 line-clamp-2">
                {thread.lastMessage}
              </p>
              
              <div className="flex items-center justify-between">
                <span className="text-xs text-white/60">
                  {thread.timestamp.toLocaleTimeString([], { 
                    hour: '2-digit', 
                    minute: '2-digit' 
                  })}
                </span>
                {thread.unreadCount > 0 && (
                  <Badge className="bg-red-500 text-white text-xs">
                    {thread.unreadCount}
                  </Badge>
                )}
              </div>
              
              {thread.specialty && (
                <Badge className="bg-purple-500/20 text-purple-200 border border-purple-400/30 text-xs mt-1">
                  {thread.specialty}
                </Badge>
              )}
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};

export default ChatListSidebar;
