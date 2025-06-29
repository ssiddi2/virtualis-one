
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { 
  MessageCircle, 
  Phone, 
  Video, 
  Search,
  Stethoscope,
  Users,
  Plus
} from 'lucide-react';
import { usePhysicians } from '@/hooks/usePhysicians';

interface VirtualisChatLayoutProps {
  children?: React.ReactNode;
  hospitalId?: string;
}

const VirtualisChatLayout = ({ children, hospitalId }: VirtualisChatLayoutProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const { data: physicians } = usePhysicians();

  // Filter physicians based on search and hospital
  const filteredPhysicians = physicians?.filter(physician => {
    const matchesSearch = physician.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         physician.last_name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesHospital = !hospitalId || physician.hospital_id === hospitalId;
    return matchesSearch && matchesHospital;
  }) || [];

  return (
    <div className="flex h-screen bg-[#0a1628]">
      {/* Left Sidebar - Physician List */}
      <div className="w-80 border-r border-slate-700 bg-slate-800/50 flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-slate-700">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-blue-600/20 rounded-lg">
              <Stethoscope className="h-6 w-6 text-blue-400" />
            </div>
            <div>
              <h1 className="text-lg font-semibold text-white">Virtualis Chat</h1>
              <p className="text-sm text-slate-400">Clinical communication platform</p>
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

        {/* Physicians List */}
        <div className="flex-1 overflow-hidden">
          <ScrollArea className="h-full px-4 py-4">
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
                  <p className="text-sm text-slate-500 mt-1">Try adjusting your search</p>
                </div>
              )}
            </div>
          </ScrollArea>
        </div>

        {/* Quick Actions */}
        <div className="p-4 border-t border-slate-700">
          <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white mb-2">
            <Plus className="h-4 w-4 mr-2" />
            New Consultation
          </Button>
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
