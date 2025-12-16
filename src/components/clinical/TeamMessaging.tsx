
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Send, MessageCircle, Users, Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const TeamMessaging = () => {
  const navigate = useNavigate();
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null);
  const [messageInput, setMessageInput] = useState('');

  // Mock conversation data
  const conversations = [
    {
      id: '1',
      title: 'ICU Team - John Smith',
      lastMessage: 'Latest vitals look stable',
      timestamp: '2 min ago',
      unread: 2,
      participants: ['Dr. Johnson', 'Nurse Kelly', 'Dr. Martinez']
    },
    {
      id: '2',
      title: 'Cardiology Consult',
      lastMessage: 'Echo results available',
      timestamp: '15 min ago',
      unread: 0,
      participants: ['Dr. Smith', 'Dr. Chen']
    },
    {
      id: '3',
      title: 'Surgery Planning',
      lastMessage: 'OR scheduled for tomorrow 8 AM',
      timestamp: '1 hour ago',
      unread: 1,
      participants: ['Dr. Williams', 'OR Coordinator']
    }
  ];

  const messages = [
    {
      id: '1',
      sender: 'Dr. Johnson',
      message: 'Patient vitals are improving. Blood pressure stable at 120/80.',
      timestamp: '10:30 AM',
      isOwn: false
    },
    {
      id: '2',
      sender: 'You',
      message: 'Thanks for the update. Should we continue current medication regimen?',
      timestamp: '10:32 AM',
      isOwn: true
    },
    {
      id: '3',
      sender: 'Nurse Kelly',
      message: 'Patient is comfortable and pain score is 2/10.',
      timestamp: '10:35 AM',
      isOwn: false
    }
  ];

  const handleSendMessage = () => {
    if (messageInput.trim()) {
      setMessageInput('');
    }
  };

  return (
    <div className="min-h-screen p-6" style={{
      background: 'linear-gradient(135deg, hsl(225, 70%, 25%) 0%, hsl(220, 65%, 35%) 25%, hsl(215, 60%, 45%) 50%, hsl(210, 55%, 55%) 75%, hsl(205, 50%, 65%) 100%)'
    }}>
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button 
            onClick={() => navigate('/clinical')}
            variant="outline"
            className="border-white/30 text-white hover:bg-white/10"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-white">Team Messaging</h1>
            <p className="text-white/70">Secure clinical communication platform</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-200px)]">
          {/* Conversations List */}
          <Card className="backdrop-blur-xl bg-blue-500/10 border border-blue-300/30">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <MessageCircle className="h-5 w-5" />
                Conversations
              </CardTitle>
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-white/50" />
                <Input
                  placeholder="Search conversations..."
                  className="pl-10 bg-blue-600/20 border-blue-400/30 text-white placeholder:text-white/50"
                />
              </div>
            </CardHeader>
            <CardContent className="space-y-2">
              {conversations.map((conversation) => (
                <div
                  key={conversation.id}
                  onClick={() => setSelectedConversation(conversation.id)}
                  className={`p-3 rounded-lg cursor-pointer transition-colors ${
                    selectedConversation === conversation.id
                      ? 'bg-blue-600/30'
                      : 'hover:bg-blue-600/20'
                  }`}
                >
                  <div className="flex justify-between items-start mb-1">
                    <h4 className="text-white font-medium text-sm">{conversation.title}</h4>
                    {conversation.unread > 0 && (
                      <Badge className="bg-red-600 text-white text-xs">
                        {conversation.unread}
                      </Badge>
                    )}
                  </div>
                  <p className="text-white/70 text-xs mb-1">{conversation.lastMessage}</p>
                  <div className="flex justify-between items-center">
                    <span className="text-white/50 text-xs">{conversation.timestamp}</span>
                    <div className="flex items-center gap-1">
                      <Users className="h-3 w-3 text-white/50" />
                      <span className="text-white/50 text-xs">{conversation.participants.length}</span>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Message View */}
          <div className="lg:col-span-2">
            <Card className="backdrop-blur-xl bg-blue-500/10 border border-blue-300/30 h-full flex flex-col">
              {selectedConversation ? (
                <>
                  <CardHeader className="border-b border-blue-400/30">
                    <CardTitle className="text-white">
                      {conversations.find(c => c.id === selectedConversation)?.title}
                    </CardTitle>
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-white/70" />
                      <span className="text-white/70 text-sm">
                        {conversations.find(c => c.id === selectedConversation)?.participants.join(', ')}
                      </span>
                    </div>
                  </CardHeader>
                  
                  {/* Messages */}
                  <CardContent className="flex-1 p-4 overflow-y-auto">
                    <div className="space-y-4">
                      {messages.map((message) => (
                        <div
                          key={message.id}
                          className={`flex ${message.isOwn ? 'justify-end' : 'justify-start'}`}
                        >
                          <div
                            className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                              message.isOwn
                                ? 'bg-blue-600 text-white'
                                : 'bg-gray-600 text-white'
                            }`}
                          >
                            {!message.isOwn && (
                              <p className="text-xs font-medium mb-1">{message.sender}</p>
                            )}
                            <p className="text-sm">{message.message}</p>
                            <p className="text-xs opacity-70 mt-1">{message.timestamp}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>

                  {/* Message Input */}
                  <div className="p-4 border-t border-blue-400/30">
                    <div className="flex gap-2">
                      <Input
                        value={messageInput}
                        onChange={(e) => setMessageInput(e.target.value)}
                        placeholder="Type your message..."
                        className="bg-blue-600/20 border-blue-400/30 text-white"
                        onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                      />
                      <Button 
                        onClick={handleSendMessage}
                        className="bg-blue-600 hover:bg-blue-700 text-white"
                      >
                        <Send className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </>
              ) : (
                <CardContent className="flex-1 flex items-center justify-center">
                  <div className="text-center text-white/70">
                    <MessageCircle className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>Select a conversation to start messaging</p>
                  </div>
                </CardContent>
              )}
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeamMessaging;
