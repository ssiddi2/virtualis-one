
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MessageSquare, Stethoscope, X, Zap, AlertTriangle, Clock, Mic } from 'lucide-react';

interface FloatingActionButtonProps {
  onMessageClick: () => void;
  onConsultClick: () => void;
  onAmbientClick?: () => void;
}

const FloatingActionButton = ({ onMessageClick, onConsultClick, onAmbientClick }: FloatingActionButtonProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleFAB = () => {
    setIsOpen(!isOpen);
  };

  const handleMessageClick = () => {
    onMessageClick();
    setIsOpen(false);
  };

  const handleConsultClick = () => {
    onConsultClick();
    setIsOpen(false);
  };

  const handleAmbientClick = () => {
    onAmbientClick?.();
    setIsOpen(false);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Expanded Options */}
      {isOpen && (
        <div className="mb-4 space-y-3 animate-fade-in">
          {/* Message Option - Enhanced with Acuity Levels */}
          <Card className="backdrop-blur-xl bg-blue-500/20 border border-blue-300/30 rounded-xl shadow-2xl hover:bg-blue-500/30 transition-all duration-300">
            <CardContent className="p-3">
              <Button
                onClick={handleMessageClick}
                className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white flex items-center gap-2 justify-start border-0 transition-all duration-300 hover:scale-105"
              >
                <MessageSquare className="h-4 w-4" />
                <span className="font-medium">Team Message</span>
                <Badge className="ml-auto bg-blue-500/20 text-blue-200 border border-blue-400/30 flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  Priority
                </Badge>
              </Button>
              <div className="flex gap-1 mt-2">
                <Badge className="bg-red-500/20 text-red-200 border border-red-400/30 text-xs">
                  <Zap className="h-2 w-2 mr-1" />
                  Critical
                </Badge>
                <Badge className="bg-yellow-500/20 text-yellow-200 border border-yellow-400/30 text-xs">
                  <AlertTriangle className="h-2 w-2 mr-1" />
                  Urgent
                </Badge>
                <Badge className="bg-green-500/20 text-green-200 border border-green-400/30 text-xs">
                  <Clock className="h-2 w-2 mr-1" />
                  Routine
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* Ambient EMR Option - New Voice AI Feature */}
          {onAmbientClick && (
            <Card className="backdrop-blur-xl bg-amber-500/20 border border-amber-300/30 rounded-xl shadow-2xl hover:bg-amber-500/30 transition-all duration-300">
              <CardContent className="p-3">
                <Button
                  onClick={handleAmbientClick}
                  className="w-full bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white flex items-center gap-2 justify-start border-0 transition-all duration-300 hover:scale-105"
                >
                  <Mic className="h-4 w-4" />
                  <span className="font-medium">Ambient EMR</span>
                  <Badge className="ml-auto bg-amber-500/20 text-amber-200 border border-amber-400/30 flex items-center gap-1 animate-pulse">
                    <Zap className="h-3 w-3" />
                    Voice AI
                  </Badge>
                </Button>
                <div className="text-xs text-white/70 mt-1 flex items-center gap-1">
                  <div className="h-1 w-1 bg-amber-400 rounded-full animate-pulse"></div>
                  Voice commands • Hands-free workflow • Real-time documentation
                </div>
              </CardContent>
            </Card>
          )}

          {/* Consult Option - Enhanced with AI Features */}
          <Card className="backdrop-blur-xl bg-purple-500/20 border border-purple-300/30 rounded-xl shadow-2xl hover:bg-purple-500/30 transition-all duration-300">
            <CardContent className="p-3">
              <Button
                onClick={handleConsultClick}
                className="w-full bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white flex items-center gap-2 justify-start border-0 transition-all duration-300 hover:scale-105"
              >
                <Stethoscope className="h-4 w-4" />
                <span className="font-medium">AI Consult</span>
                <Badge className="ml-auto bg-purple-500/20 text-purple-200 border border-purple-400/30 flex items-center gap-1">
                  <Zap className="h-3 w-3" />
                  Smart
                </Badge>
              </Button>
              <div className="text-xs text-white/70 mt-1 flex items-center gap-1">
                <div className="h-1 w-1 bg-green-400 rounded-full animate-pulse"></div>
                Auto-routing • Specialty matching • Evidence-based
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Main FAB with Enhanced Animation */}
      <Button
        onClick={toggleFAB}
        className={`h-14 w-14 rounded-full shadow-2xl transition-all duration-500 bg-transparent hover:bg-white/10 border-0 p-0 hover:scale-110 ${
          isOpen ? 'rotate-45' : 'rotate-0'
        }`}
      >
        {isOpen ? (
          <X className="h-6 w-6 text-white" />
        ) : (
          <img 
            src="/lovable-uploads/1ef8d41d-9742-4ba5-89ff-e9d7b4a2a999.png" 
            alt="Virtualis Logo" 
            className="h-12 w-12 object-contain"
          />
        )}
      </Button>
    </div>
  );
};

export default FloatingActionButton;
