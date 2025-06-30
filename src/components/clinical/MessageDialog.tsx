
import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Search, MessageSquare, User, Phone, Video, CheckCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface MessageDialogProps {
  open: boolean;
  onClose: () => void;
  hospitalId?: string;
}

// Mock user data for demonstration
const mockUsers = [
  {
    id: '1',
    name: 'Dr. Sarah Johnson',
    role: 'Emergency Medicine',
    status: 'online',
    avatar: 'SJ',
    lastSeen: 'Online now'
  },
  {
    id: '2',
    name: 'Dr. Michael Chen',
    role: 'Cardiology',
    status: 'online',
    avatar: 'MC',
    lastSeen: 'Online now'
  },
  {
    id: '3',
    name: 'Nurse Martinez',
    role: 'ICU Nurse',
    status: 'away',
    avatar: 'NM',
    lastSeen: '5 min ago'
  },
  {
    id: '4',
    name: 'Dr. Emily Rodriguez',
    role: 'Pulmonology',
    status: 'offline',
    avatar: 'ER',
    lastSeen: '1 hour ago'
  },
  {
    id: '5',
    name: 'Dr. James Wilson',
    role: 'Surgery',
    status: 'busy',
    avatar: 'JW',
    lastSeen: 'In surgery'
  },
  {
    id: '6',
    name: 'Lisa Thompson',
    role: 'Case Manager',
    status: 'online',
    avatar: 'LT',
    lastSeen: 'Online now'
  }
];

const MessageDialog = ({ open, onClose, hospitalId }: MessageDialogProps) => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);

  const filteredUsers = mockUsers.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online': return 'bg-green-500';
      case 'away': return 'bg-yellow-500';
      case 'busy': return 'bg-red-500';
      case 'offline': return 'bg-gray-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'online': return 'bg-green-500/20 text-green-200 border-green-400/30';
      case 'away': return 'bg-yellow-500/20 text-yellow-200 border-yellow-400/30';
      case 'busy': return 'bg-red-500/20 text-red-200 border-red-400/30';
      case 'offline': return 'bg-gray-500/20 text-gray-200 border-gray-400/30';
      default: return 'bg-gray-500/20 text-gray-200 border-gray-400/30';
    }
  };

  const toggleUserSelection = (userId: string) => {
    setSelectedUsers(prev =>
      prev.includes(userId)
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    );
  };

  const handleStartConversation = () => {
    if (selectedUsers.length === 0) {
      toast({
        title: "Select Users",
        description: "Please select at least one user to start a conversation",
        variant: "destructive"
      });
      return;
    }

    const selectedUserNames = mockUsers
      .filter(user => selectedUsers.includes(user.id))
      .map(user => user.name)
      .join(', ');

    toast({
      title: "Conversation Started",
      description: `New conversation with ${selectedUserNames}`,
    });

    setSelectedUsers([]);
    setSearchTerm('');
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl backdrop-blur-xl bg-gradient-to-br from-blue-500/20 to-cyan-500/10 border border-blue-300/40 text-white shadow-2xl rounded-2xl">
        <DialogHeader className="border-b border-white/20 pb-4">
          <DialogTitle className="flex items-center gap-2 text-xl font-bold bg-gradient-to-r from-blue-200 to-cyan-200 bg-clip-text text-transparent">
            <MessageSquare className="h-5 w-5 text-blue-400" />
            Select Team Members
          </DialogTitle>
          <DialogDescription className="text-white/70">
            Choose healthcare professionals to start a conversation
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 max-h-[70vh] overflow-y-auto">
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-white/60" />
            <Input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by name or role..."
              className="bg-white/10 border border-white/30 text-white placeholder:text-white/60 pl-10 backdrop-blur-sm rounded-lg"
            />
          </div>

          {/* Selected Users Summary */}
          {selectedUsers.length > 0 && (
            <div className="p-3 bg-white/5 backdrop-blur-sm border border-white/20 rounded-xl">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle className="h-4 w-4 text-green-400" />
                <span className="text-sm font-medium text-white">Selected ({selectedUsers.length})</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {selectedUsers.map(userId => {
                  const user = mockUsers.find(u => u.id === userId);
                  return user ? (
                    <Badge key={userId} className="bg-blue-600/30 text-blue-200 border border-blue-400/30">
                      {user.name}
                    </Badge>
                  ) : null;
                })}
              </div>
            </div>
          )}

          {/* User List */}
          <div className="max-h-96 overflow-y-auto space-y-2">
            {filteredUsers.map((user) => (
              <div
                key={user.id}
                onClick={() => toggleUserSelection(user.id)}
                className={`p-4 backdrop-blur-sm border rounded-xl cursor-pointer transition-all duration-300 hover:scale-[1.02] ${
                  selectedUsers.includes(user.id)
                    ? 'bg-blue-600/30 border-blue-400/50 shadow-xl'
                    : 'bg-white/5 border-white/20 hover:bg-white/10'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {/* Avatar */}
                    <div className="relative">
                      <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-medium">
                        {user.avatar}
                      </div>
                      <div className={`absolute -bottom-1 -right-1 h-3 w-3 rounded-full border-2 border-white/20 ${getStatusColor(user.status)}`}></div>
                    </div>

                    {/* User Info */}
                    <div>
                      <h3 className="font-medium text-white">{user.name}</h3>
                      <p className="text-sm text-white/70">{user.role}</p>
                      <p className="text-xs text-white/50">{user.lastSeen}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {/* Status Badge */}
                    <Badge className={`text-xs border ${getStatusBadge(user.status)}`}>
                      {user.status.toUpperCase()}
                    </Badge>

                    {/* Quick Actions */}
                    <div className="flex gap-1">
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-8 w-8 p-0 text-white/60 hover:text-white hover:bg-white/10 rounded-lg"
                        onClick={(e) => {
                          e.stopPropagation();
                          toast({ title: "Calling...", description: `Calling ${user.name}` });
                        }}
                      >
                        <Phone className="h-3 w-3" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-8 w-8 p-0 text-white/60 hover:text-white hover:bg-white/10 rounded-lg"
                        onClick={(e) => {
                          e.stopPropagation();
                          toast({ title: "Video Call", description: `Starting video call with ${user.name}` });
                        }}
                      >
                        <Video className="h-3 w-3" />
                      </Button>
                    </div>

                    {/* Selection Indicator */}
                    {selectedUsers.includes(user.id) && (
                      <CheckCircle className="h-5 w-5 text-green-400" />
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2 pt-4 border-t border-white/20">
            <Button
              onClick={handleStartConversation}
              disabled={selectedUsers.length === 0}
              className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 disabled:opacity-50 border-0 rounded-lg"
            >
              <MessageSquare className="h-4 w-4 mr-2" />
              Start Conversation ({selectedUsers.length})
            </Button>
            <Button
              onClick={onClose}
              variant="outline"
              className="bg-white/10 border border-white/30 text-white hover:bg-white/20 backdrop-blur-sm rounded-lg"
            >
              Cancel
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default MessageDialog;
