import { Badge } from '@/components/ui/badge';
import { Mic, Brain, Volume2, Zap, Wifi } from 'lucide-react';
import { cn } from '@/lib/utils';

type StatusType = 'disconnected' | 'listening' | 'processing' | 'speaking' | 'executing';

interface StatusBarProps {
  status: StatusType;
  action?: string;
}

export const StatusBar = ({ status, action }: StatusBarProps) => {
  const getStatusConfig = () => {
    switch (status) {
      case 'listening':
        return {
          icon: <Mic className="h-3 w-3 animate-pulse" />,
          label: 'Listening',
          color: 'text-green-500',
          bgColor: 'bg-green-500/20',
          borderColor: 'border-green-500/30',
        };
      case 'processing':
        return {
          icon: <Brain className="h-3 w-3 animate-spin" />,
          label: 'Processing',
          color: 'text-blue-500',
          bgColor: 'bg-blue-500/20',
          borderColor: 'border-blue-500/30',
        };
      case 'speaking':
        return {
          icon: <Volume2 className="h-3 w-3 animate-pulse" />,
          label: 'Alis Speaking',
          color: 'text-purple-500',
          bgColor: 'bg-purple-500/20',
          borderColor: 'border-purple-500/30',
        };
      case 'executing':
        return {
          icon: <Zap className="h-3 w-3 animate-pulse" />,
          label: action || 'Executing',
          color: 'text-amber-500',
          bgColor: 'bg-amber-500/20',
          borderColor: 'border-amber-500/30',
        };
      default:
        return {
          icon: <Wifi className="h-3 w-3 opacity-50" />,
          label: 'Disconnected',
          color: 'text-destructive',
          bgColor: 'bg-destructive/10',
          borderColor: 'border-destructive/20',
        };
    }
  };

  const config = getStatusConfig();

  return (
    <Badge 
      variant="outline" 
      className={cn(
        'flex items-center gap-1.5 text-xs font-medium transition-all border',
        config.color,
        config.bgColor,
        config.borderColor,
        status === 'listening' && 'shadow-lg shadow-green-500/20',
        status === 'speaking' && 'shadow-lg shadow-purple-500/20'
      )}
    >
      {config.icon}
      {config.label}
    </Badge>
  );
};
