
import { useState } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { MessageSquare, Minimize2, Maximize2 } from 'lucide-react';
import VirtualisChat from './VirtualisChat';
import { useAuth } from '@/components/auth/AuthProvider';

// Component with no props - gets hospital ID from auth context only
const VirtualisChatModal = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const { profile, user } = useAuth();

  // Get hospital ID only from auth context
  const effectiveHospitalId = profile?.hospital_id || user?.user_metadata?.hospital_id;

  // V Logo SVG component
  const VLogo = () => (
    <svg 
      viewBox="0 0 100 100" 
      className="h-6 w-6 text-white"
      fill="currentColor"
    >
      <path d="M20 20 L40 60 L50 50 L60 60 L80 20 L70 20 L55 45 L50 40 L45 45 L30 20 Z" />
    </svg>
  );

  // If minimized, show as a small floating button
  if (isMinimized) {
    return (
      <div className="fixed bottom-4 right-4 z-50">
        <Button
          onClick={() => setIsMinimized(false)}
          className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg rounded-full h-12 w-12 p-0"
        >
          <VLogo />
        </Button>
      </div>
    );
  }

  return (
    <>
      {/* Chat Toggle Button */}
      {!isOpen && (
        <div className="fixed bottom-4 right-4 z-50">
          <Button
            onClick={() => setIsOpen(true)}
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg rounded-full h-14 w-14 p-0"
          >
            <VLogo />
          </Button>
        </div>
      )}

      {/* Chat Modal */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-6xl max-h-[90vh] p-0 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 border border-purple-300/30 rounded-2xl overflow-hidden">
          <div className="flex items-center justify-between p-4 border-b border-white/20 bg-gradient-to-r from-blue-600/20 to-purple-600/20">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <VLogo />
              Virtualis Clinical Chat
            </h2>
            <div className="flex gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsMinimized(true)}
                className="text-white hover:bg-white/20"
              >
                <Minimize2 className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsOpen(false)}
                className="text-white hover:bg-white/20"
              >
                <Maximize2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          <div className="p-4 h-[80vh]">
            <VirtualisChat 
              hospitalId={effectiveHospitalId}
              isModal={true}
              onClose={() => setIsOpen(false)}
            />
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default VirtualisChatModal;
