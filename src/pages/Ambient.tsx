
import { useEffect } from "react";
import AmbientQuickAccess from "@/components/ambient/AmbientQuickAccess";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const Ambient = () => {
  useEffect(() => {
    document.title = "Ambient AI – Virtualis";
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) metaDesc.setAttribute('content', 'Ambient AI for hands-free clinical workflow and documentation');
    const link = document.querySelector('link[rel="canonical"]') || document.createElement('link');
    link.setAttribute('rel', 'canonical');
    link.setAttribute('href', window.location.href);
    if (!link.parentNode) document.head.appendChild(link);
  }, []);

  return (
    <div className="min-h-screen" style={{
      background: 'linear-gradient(135deg, hsl(225, 70%, 25%) 0%, hsl(220, 65%, 35%) 25%, hsl(215, 60%, 45%) 50%, hsl(210, 55%, 55%) 75%, hsl(205, 50%, 65%) 100%)'
    }}>
      <div className="max-w-7xl mx-auto p-6 space-y-6">
        <header className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src="/lovable-uploads/1ef8d41d-9742-4ba5-89ff-e9d7b4a2a999.png" alt="Virtualis icon" className="h-10 w-10" />
            <div>
              <h1 className="text-2xl font-bold text-white">Ambient AI</h1>
              <p className="text-white/70 text-sm">Voice-controlled clinical workflow and documentation</p>
            </div>
          </div>
        </header>

        <AmbientQuickAccess className="shadow-lg" />

        <Card className="bg-slate-900 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white text-base">Getting started</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="list-disc pl-6 text-sm text-white/80 space-y-2">
              <li>Click “Start Ambient Mode”, then say “Hey Virtualis” to wake.</li>
              <li>Try: “Go to room 312”, “Open CPOE”, “Create a progress note”.</li>
              <li>Open Controls to enable Wake Word and manage context.</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Ambient;
