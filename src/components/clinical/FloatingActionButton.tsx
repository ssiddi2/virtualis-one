
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
                  Team Connect
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
                <span>Neural Consult</span>
                <Badge className="ml-auto bg-purple-500/20 text-purple-200">
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
        className={`h-14 w-14 rounded-full shadow-2xl transition-all duration-500 bg-transparent hover:bg-transparent border-0 p-0 ${
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
