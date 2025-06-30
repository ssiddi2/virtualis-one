
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MessageSquare, Stethoscope, Plus, X } from 'lucide-react';

interface FloatingActionButtonProps {
  onMessageClick: () => void;
  onConsultClick: () => void;
}

const FloatingActionButton = ({ onMessageClick, onConsultClick }: FloatingActionButtonProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleFAB = () => {
    console.log('FAB toggled:', !isOpen);
    setIsOpen(!isOpen);
  };

  const handleMessageClick = () => {
    console.log('Message button clicked');
    onMessageClick();
    setIsOpen(false);
  };

  const handleConsultClick = () => {
    console.log('Consult button clicked');
    onConsultClick();
    setIsOpen(false);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Expanded Options */}
      {isOpen && (
        <div className="mb-4 space-y-3 animate-fade-in">
          {/* Message Option */}
          <Card className="backdrop-blur-xl bg-gradient-to-br from-blue-500/20 to-cyan-500/10 border border-blue-300/30 rounded-xl shadow-2xl">
            <CardContent className="p-3">
              <Button
                onClick={handleMessageClick}
                className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white flex items-center gap-2 justify-start border-0 transition-all duration-300"
              >
                <MessageSquare className="h-4 w-4" />
                <span className="font-medium">Send Message</span>
                <Badge className="ml-auto bg-blue-500/20 text-blue-200 border border-blue-400/30">
                  Team Connect
                </Badge>
              </Button>
            </CardContent>
          </Card>

          {/* Consult Option */}
          <Card className="backdrop-blur-xl bg-gradient-to-br from-purple-500/20 to-indigo-500/10 border border-purple-300/30 rounded-xl shadow-2xl">
            <CardContent className="p-3">
              <Button
                onClick={handleConsultClick}
                className="w-full bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white flex items-center gap-2 justify-start border-0 transition-all duration-300"
              >
                <Stethoscope className="h-4 w-4" />
                <span className="font-medium">Neural Consult</span>
                <Badge className="ml-auto bg-purple-500/20 text-purple-200 border border-purple-400/30">
                  AI-Powered
                </Badge>
              </Button>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Main FAB with Logo */}
      <Button
        onClick={toggleFAB}
        className={`h-14 w-14 rounded-full shadow-2xl transition-all duration-500 bg-transparent hover:bg-white/10 border-0 p-0 hover:scale-110 ${
          isOpen ? 'rotate-180' : 'rotate-0'
        }`}
      >
        <img 
          src="/lovable-uploads/1ef8d41d-9742-4ba5-89ff-e9d7b4a2a999.png" 
          alt="Virtualis Logo" 
          className="h-12 w-12 object-contain"
        />
      </Button>
    </div>
  );
};

export default FloatingActionButton;
