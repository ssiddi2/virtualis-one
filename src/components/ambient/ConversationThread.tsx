import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { User, Bot, Activity, FileText } from 'lucide-react';

interface Message {
  id: string;
  type: string;
  content?: string;
  timestamp: Date;
  function_call?: any;
}

interface ConversationThreadProps {
  messages: Message[];
  isExpanded?: boolean;
}

export const ConversationThread = ({ messages, isExpanded }: ConversationThreadProps) => {
  const renderMessage = (msg: Message) => {
    // User voice input
    if (msg.type === 'conversation.item.input_audio_transcription.completed' || 
        msg.type === 'input_audio_buffer.speech_stopped') {
      return (
        <div className="flex gap-3 items-start">
          <Avatar className="h-8 w-8 bg-primary/10">
            <User className="h-4 w-4 text-primary" />
          </Avatar>
          <div className="flex-1 space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">You</span>
              <span className="text-xs text-muted-foreground">
                {new Date(msg.timestamp).toLocaleTimeString()}
              </span>
            </div>
            <div className="bg-primary/10 rounded-lg p-3 text-sm">
              {msg.content || '(Voice input)'}
            </div>
          </div>
        </div>
      );
    }

    // AI response (text/transcript)
    if (msg.type === 'response.audio_transcript.delta' || 
        msg.type === 'response.text.delta' ||
        msg.type === 'response.done') {
      return (
        <div className="flex gap-3 items-start">
          <Avatar className="h-8 w-8 bg-secondary/10">
            <Bot className="h-4 w-4 text-secondary" />
          </Avatar>
          <div className="flex-1 space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">Alis</span>
              <span className="text-xs text-muted-foreground">
                {new Date(msg.timestamp).toLocaleTimeString()}
              </span>
            </div>
            <div className="bg-secondary/10 rounded-lg p-3 text-sm">
              {msg.content || '...'}
            </div>
          </div>
        </div>
      );
    }

    // Function call / action
    if (msg.type === 'ambient_function_call' || msg.type === 'response.function_call_arguments.done') {
      const functionName = msg.function_call?.name || msg.function_call?.section || 'action';
      return (
        <div className="flex gap-3 items-start">
          <Avatar className="h-8 w-8 bg-accent/10">
            <Activity className="h-4 w-4 text-accent" />
          </Avatar>
          <div className="flex-1 space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">System Action</span>
              <Badge variant="outline" className="text-xs">
                {functionName}
              </Badge>
              <span className="text-xs text-muted-foreground">
                {new Date(msg.timestamp).toLocaleTimeString()}
              </span>
            </div>
            <div className="bg-accent/10 rounded-lg p-3 text-sm border-l-2 border-accent">
              {msg.content || JSON.stringify(msg.function_call, null, 2)}
            </div>
          </div>
        </div>
      );
    }

    return null;
  };

  return (
    <ScrollArea className={cn('w-full', isExpanded ? 'h-[600px]' : 'h-[380px]')}>
      <div className="space-y-4 p-1">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-[300px] text-center space-y-3">
            <FileText className="h-12 w-12 text-muted-foreground/30" />
            <div>
              <p className="text-sm font-medium text-muted-foreground">No conversation yet</p>
              <p className="text-xs text-muted-foreground/70 mt-1">
                Alis is listening and ready to help
              </p>
            </div>
          </div>
        ) : (
          messages.map((msg) => (
            <div key={msg.id}>
              {renderMessage(msg)}
            </div>
          ))
        )}
      </div>
    </ScrollArea>
  );
};
