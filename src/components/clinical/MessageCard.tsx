
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MessageSquare, Send, User } from "lucide-react";

interface MessageCardProps {
  onOpenMessageDialog: () => void;
}

const MessageCard = ({ onOpenMessageDialog }: MessageCardProps) => {
  return (
    <Card className="backdrop-blur-xl bg-white/10 border border-white/30 shadow-xl rounded-lg hover:bg-white/15 transition-all duration-300">
      <CardContent className="p-4 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5 text-blue-300" />
            <h3 className="text-white font-semibold">Send Message</h3>
          </div>
          <Badge className="bg-blue-500/30 text-blue-300 border-blue-400/40 text-xs">
            Available
          </Badge>
        </div>
        
        <p className="text-white/70 text-sm">
          Send secure messages to physicians, specialists, and healthcare team members
        </p>
        
        <div className="flex items-center gap-2 text-xs text-white/60">
          <User className="h-3 w-3" />
          <span>6 physicians available</span>
        </div>
        
        <Button
          onClick={onOpenMessageDialog}
          className="w-full bg-gradient-to-r from-blue-500/20 to-purple-500/20 hover:from-blue-500/30 hover:to-purple-500/30 border border-blue-400/30 text-white backdrop-blur-sm"
        >
          <Send className="h-4 w-4 mr-2" />
          Compose Message
        </Button>
      </CardContent>
    </Card>
  );
};

export default MessageCard;
