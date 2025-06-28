
import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { 
  X, 
  Send, 
  User, 
  Clock, 
  AlertTriangle,
  MessageSquare,
  Phone,
  Video
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Message {
  id: string;
  content: string;
  sender: string;
  senderRole: string;
  timestamp: Date;
  acuity: 'critical' | 'urgent' | 'routine';
  patientId?: string;
  patientName?: string;
  replies?: Message[];
}

interface ConversationThreadProps {
  message: Message;
  onClose: () => void;
  onReply: (content: string, parentId: string) => void;
  currentUser?: any;
}

const ConversationThread = ({ message, onClose, onReply, currentUser }: ConversationThreadProps) => {
  const [replyContent, setReplyContent] = useState('');
  const [isReplying, setIsReplying] = useState(false);
  const { toast } = useToast();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [message.replies]);

  const getAcuityColor = (acuity: string) => {
    switch (acuity) {
      case 'critical': return 'bg-red-500/20 text-red-200 border-red-400/30';
      case 'urgent': return 'bg-yellow-500/20 text-yellow-200 border-yellow-400/30';
      case 'routine': return 'bg-green-500/20 text-green-200 border-green-400/30';
      default: return 'bg-gray-500/20 text-gray-200 border-gray-400/30';
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

  const handleSendReply = async () => {
    if (!replyContent.trim()) return;

    setIsReplying(true);
    try {
      await onReply(replyContent, message.id);
      setReplyContent('');
      toast({
        title: "Reply Sent",
        description: "Your reply has been sent to the conversation thread.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send reply. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsReplying(false);
    }
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  return (
    <Card className="backdrop-blur-xl bg-blue-500/20 border border-blue-300/30 rounded-xl shadow-lg h-[600px] flex flex-col">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-white text-lg">Clinical Conversation</CardTitle>
          <div className="flex items-center gap-2">
            <Button size="sm" variant="outline" className="border-green-400/30 text-green-300 hover:bg-green-600/20">
              <Phone className="h-3 w-3 mr-1" />
              Call
            </Button>
            <Button size="sm" variant="outline" className="border-blue-400/30 text-blue-300 hover:bg-blue-600/20">
              <Video className="h-3 w-3 mr-1" />
              Video
            </Button>
            <Button size="sm" onClick={onClose} className="bg-gray-600 hover:bg-gray-700 text-white">
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
        {message.patientName && (
          <div className="flex items-center gap-2 text-sm text-white/70">
            <User className="h-3 w-3" />
            <span>Patient: {message.patientName}</span>
          </div>
        )}
      </CardHeader>

      <CardContent className="flex-1 overflow-y-auto space-y-4">
        {/* Original Message */}
        <div className="p-4 backdrop-blur-sm bg-blue-600/30 border border-blue-400/40 rounded-lg">
          <div className="flex items-start gap-3 mb-3">
            <Avatar className="h-8 w-8">
              <AvatarFallback className="bg-blue-600 text-white text-xs">
                {getInitials(message.sender)}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <span className="font-medium text-white">{message.sender}</span>
                <Badge className="bg-blue-500/30 text-blue-200 border border-blue-400/30 text-xs">
                  {message.senderRole}
                </Badge>
                <Badge className={`text-xs ${getAcuityColor(message.acuity)}`}>
                  {getAcuityIcon(message.acuity)}
                  <span className="ml-1">{message.acuity.toUpperCase()}</span>
                </Badge>
              </div>
              <span className="text-xs text-white/60">
                {message.timestamp.toLocaleString()}
              </span>
            </div>
          </div>
          <p className="text-white/90">{message.content}</p>
        </div>

        {/* Replies */}
        {message.replies && message.replies.length > 0 && (
          <div className="space-y-3 ml-4 border-l-2 border-blue-400/30 pl-4">
            {message.replies.map((reply) => (
              <div key={reply.id} className="p-3 backdrop-blur-sm bg-blue-600/20 border border-blue-400/30 rounded-lg">
                <div className="flex items-start gap-3">
                  <Avatar className="h-6 w-6">
                    <AvatarFallback className="bg-purple-600 text-white text-xs">
                      {getInitials(reply.sender)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium text-white text-sm">{reply.sender}</span>
                      <Badge className="bg-purple-500/30 text-purple-200 border border-purple-400/30 text-xs">
                        {reply.senderRole}
                      </Badge>
                    </div>
                    <span className="text-xs text-white/60">
                      {reply.timestamp.toLocaleString()}
                    </span>
                    <p className="text-white/90 text-sm mt-1">{reply.content}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
        <div ref={messagesEndRef} />
      </CardContent>

      {/* Reply Input */}
      <div className="p-4 border-t border-blue-400/30">
        <div className="space-y-3">
          <Textarea
            value={replyContent}
            onChange={(e) => setReplyContent(e.target.value)}
            placeholder="Type your clinical response..."
            className="bg-blue-600/20 border border-blue-400/30 text-white placeholder:text-white/60 min-h-[80px]"
          />
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs text-white/60">
              <User className="h-3 w-3" />
              <span>Replying as {currentUser?.name || 'Current User'}</span>
            </div>
            <Button 
              onClick={handleSendReply}
              disabled={!replyContent.trim() || isReplying}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              <Send className="h-4 w-4 mr-2" />
              {isReplying ? 'Sending...' : 'Send Reply'}
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default ConversationThread;
