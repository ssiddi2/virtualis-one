
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { MessageCircle, Send, Clock, User, Search, Stethoscope, Users } from "lucide-react";
import { usePhysicians } from "@/hooks/usePhysicians";

interface VirtualisChatPageProps {
  hospitalId: string;
}

interface Message {
  id: string;
  content: string;
  sender: string;
  timestamp: Date;
  type: 'sent' | 'received';
}

const VirtualisChatPage = ({ hospitalId }: VirtualisChatPageProps) => {
  const [selectedChat, setSelectedChat] = useState<string | null>(null);
  const [message, setMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: 'Good morning! How can I assist you today?',
      sender: 'Dr. Sarah Chen',
      timestamp: new Date(Date.now() - 10 * 60000),
      type: 'received'
    },
    {
      id: '2',
      content: 'Hi Dr. Chen, I have a question about the patient in room 302.',
      sender: 'You',
      timestamp: new Date(Date.now() - 5 * 60000),
      type: 'sent'
    }
  ]);

  const { data: physicians } = usePhysicians();

  const filteredPhysicians = physicians?.filter(physician => {
    const matchesSearch = physician.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         physician.last_name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesHospital = !hospitalId || physician.hospital_id === hospitalId;
    return matchesSearch && matchesHospital;
  }) || [];

  const handleSendMessage = () => {
    if (!message.trim()) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      content: message,
      sender: 'You',
      timestamp: new Date(),
      type: 'sent'
    };

    setMessages(prev => [...prev, newMessage]);
    setMessage('');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

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
                  <Card 
                    key={physician.id} 
                    className="bg-slate-700/30 border-slate-600 hover:bg-slate-700/50 transition-colors cursor-pointer"
                    onClick={() => setSelectedChat(physician.id)}
                  >
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
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col">
        {selectedChat ? (
          // Chat Interface
          <div className="flex flex-col h-full">
            {/* Chat Header */}
            <div className="p-4 border-b border-slate-700 bg-slate-800/50">
              <div className="flex items-center gap-3">
                <Avatar className="h-10 w-10">
                  <AvatarFallback className="bg-blue-600/20 text-blue-300">
                    SC
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h2 className="font-semibold text-white">Dr. Sarah Chen</h2>
                  <p className="text-sm text-slate-400">Cardiology</p>
                </div>
                <Badge className="ml-auto bg-green-500/20 text-green-300 border-green-500/30">
                  Online
                </Badge>
              </div>
            </div>

            {/* Messages */}
            <ScrollArea className="flex-1 p-4">
              <div className="space-y-4">
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex ${msg.type === 'sent' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[70%] rounded-lg p-3 ${
                        msg.type === 'sent'
                          ? 'bg-blue-600 text-white'
                          : 'bg-slate-700 text-white'
                      }`}
                    >
                      <p className="text-sm">{msg.content}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs opacity-70">
                          {msg.timestamp.toLocaleTimeString()}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>

            {/* Message Input */}
            <div className="p-4 border-t border-slate-700 bg-slate-800/50">
              <div className="flex gap-2">
                <Input
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Type your message..."
                  className="flex-1 bg-slate-700/50 border-slate-600 text-white placeholder-slate-400"
                />
                <Button
                  onClick={handleSendMessage}
                  disabled={!message.trim()}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        ) : (
          // Welcome Screen
          <div className="flex-1 flex items-center justify-center bg-[#0a1628]">
            <div className="text-center space-y-4">
              <div className="p-4 bg-blue-600/20 rounded-full inline-block">
                <MessageCircle className="h-12 w-12 text-blue-400" />
              </div>
              <h2 className="text-2xl font-semibold text-white">Welcome to Virtualis Chat</h2>
              <p className="text-slate-400 max-w-md">
                Select a physician from the sidebar to start a conversation. 
                Connect with specialists across the hospital network instantly.
              </p>
              <Button
                onClick={() => setSelectedChat('demo')}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                Start Demo Chat
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default VirtualisChatPage;
