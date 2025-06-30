
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Brain, MessageSquare, Stethoscope, Plus, X } from 'lucide-react';

interface FloatingActionButtonProps {
  onMessageClick: () => void;
  onConsultClick: () => void;
}

const FloatingActionButton = ({ onMessageClick, onConsultClick }: FloatingActionButtonProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleFAB = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Expanded Options */}
      {isOpen && (
        <div className="mb-4 space-y-3">
          <Card className="backdrop-blur-xl bg-blue-500/20 border border-blue-300/30 rounded-xl shadow-lg">
            <CardContent className="p-3">
              <Button
                onClick={() => {
                  onMessageClick();
                  setIsOpen(false);
                }}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2 justify-start"
              >
                <MessageSquare className="h-4 w-4" />
                <span>Send Message</span>
                <Badge className="ml-auto bg-blue-500/20 text-blue-200">
                  AI-Powered
                </Badge>
              </Button>
            </CardContent>
          </Card>

          <Card className="backdrop-blur-xl bg-purple-500/20 border border-purple-300/30 rounded-xl shadow-lg">
            <CardContent className="p-3">
              <Button
                onClick={() => {
                  onConsultClick();
                  setIsOpen(false);
                }}
                className="w-full bg-purple-600 hover:bg-purple-700 text-white flex items-center gap-2 justify-start"
              >
                <Stethoscope className="h-4 w-4" />
                <span>Request Consult</span>
                <Badge className="ml-auto bg-purple-500/20 text-purple-200">
                  Smart Routing
                </Badge>
              </Button>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Main FAB */}
      <Button
        onClick={toggleFAB}
        className={`h-14 w-14 rounded-full shadow-2xl transition-all duration-300 ${
          isOpen 
            ? 'bg-red-600 hover:bg-red-700 rotate-45' 
            : 'bg-gradient-to-br from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700'
        }`}
      >
        {isOpen ? (
          <X className="h-6 w-6 text-white" />
        ) : (
          <div className="flex items-center justify-center">
            <Brain className="h-6 w-6 text-white" />
          </div>
        )}
      </Button>
    </div>
  );
};

export default FloatingActionButton;
