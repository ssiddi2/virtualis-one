
import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { usePatients } from '@/hooks/usePatients';
import { useSpecialties, useOnCallSchedules, usePhysicians } from '@/hooks/usePhysicians';
import { useToast } from '@/hooks/use-toast';
import { 
  User, 
  MessageSquare, 
  Moon,
  UserCheck,
  Stethoscope,
  Send
} from 'lucide-react';

interface MessageDialogProps {
  open: boolean;
  onClose: () => void;
  onSend: (messageData: any) => void;
  trigger?: React.ReactNode;
}

const MessageDialog = ({ open, onClose, onSend, trigger }: MessageDialogProps) => {
  const [messageContent, setMessageContent] = useState('');
  const [selectedRecipient, setSelectedRecipient] = useState('');

  const { data: physicians } = usePhysicians();
  const { data: onCallSchedules } = useOnCallSchedules();
  const { toast } = useToast();

  const handleSend = () => {
    if (!messageContent.trim()) {
      toast({
        title: "Error",
        description: "Please enter a message",
        variant: "destructive"
      });
      return;
    }

    const messageData = {
      recipientId: selectedRecipient,
      content: messageContent,
      timestamp: new Date()
    };

    onSend(messageData);
    
    toast({
      title: "Message Sent",
      description: "Your message has been delivered successfully",
    });

    // Reset form
    setSelectedRecipient('');
    setMessageContent('');
    onClose();
  };

  const availablePhysicians = physicians?.slice(0, 6) || [];
  const nocturnists = physicians?.filter(p => 
    p.specialty?.name.toLowerCase().includes('nocturnist') || 
    p.first_name.toLowerCase().includes('night')
  ).slice(0, 2) || [];
  const primaryAttending = physicians?.find(p => 
    p.specialty?.name.toLowerCase().includes('internal medicine')
  ) || physicians?.[0];

  if (trigger) {
    return (
      <Dialog open={open} onOpenChange={onClose}>
        <div onClick={() => {}}>
          {trigger}
        </div>
        <DialogContent className="max-w-2xl backdrop-blur-xl bg-gradient-to-br from-blue-500/30 to-purple-500/20 border border-blue-300/40 text-white shadow-2xl rounded-2xl">
          <DialogHeader className="border-b border-white/20 pb-4">
            <DialogTitle className="text-white text-xl font-bold bg-gradient-to-r from-blue-200 to-purple-200 bg-clip-text text-transparent flex items-center gap-2">
              <MessageSquare className="h-5 w-5 text-cyan-300" />
              SEND MESSAGE
            </DialogTitle>
          </DialogHeader>

          <Card className="backdrop-blur-sm bg-white/5 border border-white/20 rounded-xl">
            <CardContent className="p-6 space-y-6">
              {/* Available Physicians */}
              <div className="space-y-3">
                <h3 className="text-sm text-blue-300 font-medium flex items-center gap-2">
                  <Stethoscope className="h-4 w-4" />
                  Available Physicians
                </h3>
                <div className="space-y-2 max-h-32 overflow-y-auto">
                  {availablePhysicians.map((physician) => (
                    <div
                      key={physician.id}
                      className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                        selectedRecipient === physician.id
                          ? 'bg-blue-600/20 border-blue-500'
                          : 'bg-white/5 border-white/20 hover:border-blue-500/50'
                      }`}
                      onClick={() => setSelectedRecipient(physician.id)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4 text-blue-400" />
                          <span className="font-medium">
                            {physician.first_name} {physician.last_name}
                          </span>
                          {physician.specialty && (
                            <Badge className="bg-blue-600/20 text-blue-300 border-blue-400/30 text-xs">
                              {physician.specialty.name}
                            </Badge>
                          )}
                        </div>
                        {physician.phone && (
                          <span className="text-sm text-white/70">{physician.phone}</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Nocturnist */}
              {nocturnists.length > 0 && (
                <div className="space-y-3">
                  <h3 className="text-sm text-indigo-300 font-medium flex items-center gap-2">
                    <Moon className="h-4 w-4" />
                    Nocturnist On Call
                  </h3>
                  <div className="space-y-2">
                    {nocturnists.map((physician) => (
                      <div
                        key={physician.id}
                        className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                          selectedRecipient === physician.id
                            ? 'bg-indigo-600/20 border-indigo-500'
                            : 'bg-white/5 border-white/20 hover:border-indigo-500/50'
                        }`}
                        onClick={() => setSelectedRecipient(physician.id)}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Moon className="h-4 w-4 text-indigo-400" />
                            <span className="font-medium">
                              {physician.first_name} {physician.last_name}
                            </span>
                            <Badge className="bg-indigo-600/20 text-indigo-300 border-indigo-400/30 text-xs">
                              On Call Tonight
                            </Badge>
                          </div>
                          {physician.phone && (
                            <span className="text-sm text-white/70">{physician.phone}</span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Primary Attending */}
              {primaryAttending && (
                <div className="space-y-3">
                  <h3 className="text-sm text-green-300 font-medium flex items-center gap-2">
                    <UserCheck className="h-4 w-4" />
                    Primary Attending
                  </h3>
                  <div
                    className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                      selectedRecipient === primaryAttending.id
                        ? 'bg-green-600/20 border-green-500'
                        : 'bg-white/5 border-white/20 hover:border-green-500/50'
                    }`}
                    onClick={() => setSelectedRecipient(primaryAttending.id)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <UserCheck className="h-4 w-4 text-green-400" />
                        <span className="font-medium">
                          {primaryAttending.first_name} {primaryAttending.last_name}
                        </span>
                        <Badge className="bg-green-600/20 text-green-300 border-green-400/30 text-xs">
                          Primary Attending
                        </Badge>
                      </div>
                      {primaryAttending.phone && (
                        <span className="text-sm text-white/70">{primaryAttending.phone}</span>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Message Content */}
              <div className="space-y-3">
                <label className="text-sm text-white/70 font-medium">Message</label>
                <Textarea
                  value={messageContent}
                  onChange={(e) => setMessageContent(e.target.value)}
                  placeholder="Type your message here..."
                  className="bg-white/10 border border-white/30 text-white placeholder:text-white/60 min-h-[100px] backdrop-blur-sm rounded-lg"
                />
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4 border-t border-white/20">
            <Button
              onClick={handleSend}
              disabled={!messageContent.trim() || !selectedRecipient}
              className="flex-1 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white backdrop-blur-sm border border-green-400/30 rounded-lg"
            >
              <Send className="h-4 w-4 mr-2" />
              Send Message
            </Button>
            <Button
              onClick={onClose}
              className="bg-white/10 hover:bg-white/20 border border-white/30 text-white backdrop-blur-sm rounded-lg"
            >
              Cancel
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl backdrop-blur-xl bg-gradient-to-br from-blue-500/30 to-purple-500/20 border border-blue-300/40 text-white shadow-2xl rounded-2xl">
        <DialogHeader className="border-b border-white/20 pb-4">
          <DialogTitle className="text-white text-xl font-bold bg-gradient-to-r from-blue-200 to-purple-200 bg-clip-text text-transparent flex items-center gap-2">
            <MessageSquare className="h-5 w-5 text-cyan-300" />
            SEND MESSAGE
          </DialogTitle>
        </DialogHeader>

        <Card className="backdrop-blur-sm bg-white/5 border border-white/20 rounded-xl">
          <CardContent className="p-6 space-y-6">
            {/* Available Physicians */}
            <div className="space-y-3">
              <h3 className="text-sm text-blue-300 font-medium flex items-center gap-2">
                <Stethoscope className="h-4 w-4" />
                Available Physicians
              </h3>
              <div className="space-y-2 max-h-32 overflow-y-auto">
                {availablePhysicians.map((physician) => (
                  <div
                    key={physician.id}
                    className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                      selectedRecipient === physician.id
                        ? 'bg-blue-600/20 border-blue-500'
                        : 'bg-white/5 border-white/20 hover:border-blue-500/50'
                    }`}
                    onClick={() => setSelectedRecipient(physician.id)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-blue-400" />
                        <span className="font-medium">
                          {physician.first_name} {physician.last_name}
                        </span>
                        {physician.specialty && (
                          <Badge className="bg-blue-600/20 text-blue-300 border-blue-400/30 text-xs">
                            {physician.specialty.name}
                          </Badge>
                        )}
                      </div>
                      {physician.phone && (
                        <span className="text-sm text-white/70">{physician.phone}</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Nocturnist */}
            {nocturnists.length > 0 && (
              <div className="space-y-3">
                <h3 className="text-sm text-indigo-300 font-medium flex items-center gap-2">
                  <Moon className="h-4 w-4" />
                  Nocturnist On Call
                </h3>
                <div className="space-y-2">
                  {nocturnists.map((physician) => (
                    <div
                      key={physician.id}
                      className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                        selectedRecipient === physician.id
                          ? 'bg-indigo-600/20 border-indigo-500'
                          : 'bg-white/5 border-white/20 hover:border-indigo-500/50'
                      }`}
                      onClick={() => setSelectedRecipient(physician.id)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Moon className="h-4 w-4 text-indigo-400" />
                          <span className="font-medium">
                            {physician.first_name} {physician.last_name}
                          </span>
                          <Badge className="bg-indigo-600/20 text-indigo-300 border-indigo-400/30 text-xs">
                            On Call Tonight
                          </Badge>
                        </div>
                        {physician.phone && (
                          <span className="text-sm text-white/70">{physician.phone}</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Primary Attending */}
            {primaryAttending && (
              <div className="space-y-3">
                <h3 className="text-sm text-green-300 font-medium flex items-center gap-2">
                  <UserCheck className="h-4 w-4" />
                  Primary Attending
                </h3>
                <div
                  className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                    selectedRecipient === primaryAttending.id
                      ? 'bg-green-600/20 border-green-500'
                      : 'bg-white/5 border-white/20 hover:border-green-500/50'
                  }`}
                  onClick={() => setSelectedRecipient(primaryAttending.id)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <UserCheck className="h-4 w-4 text-green-400" />
                      <span className="font-medium">
                        {primaryAttending.first_name} {primaryAttending.last_name}
                      </span>
                      <Badge className="bg-green-600/20 text-green-300 border-green-400/30 text-xs">
                        Primary Attending
                      </Badge>
                    </div>
                    {primaryAttending.phone && (
                      <span className="text-sm text-white/70">{primaryAttending.phone}</span>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Message Content */}
            <div className="space-y-3">
              <label className="text-sm text-white/70 font-medium">Message</label>
              <Textarea
                value={messageContent}
                onChange={(e) => setMessageContent(e.target.value)}
                placeholder="Type your message here..."
                className="bg-white/10 border border-white/30 text-white placeholder:text-white/60 min-h-[100px] backdrop-blur-sm rounded-lg"
              />
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex gap-3 pt-4 border-t border-white/20">
          <Button
            onClick={handleSend}
            disabled={!messageContent.trim() || !selectedRecipient}
            className="flex-1 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white backdrop-blur-sm border border-green-400/30 rounded-lg"
          >
            <Send className="h-4 w-4 mr-2" />
            Send Message
          </Button>
          <Button
            onClick={onClose}
            className="bg-white/10 hover:bg-white/20 border border-white/30 text-white backdrop-blur-sm rounded-lg"
          >
            Cancel
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default MessageDialog;
