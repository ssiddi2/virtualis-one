
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Brain, Shield, Lock, Zap, Cpu, Network } from "lucide-react";

interface LoginProps {
  onLogin: (email: string, password: string, role: string) => void;
}

const Login = ({ onLogin }: LoginProps) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");
  const [stayLoggedIn, setStayLoggedIn] = useState(false);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password || !role) {
      toast({
        title: "Authentication Error",
        description: "Please complete all security fields",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      onLogin(email, password, role);
      toast({
        title: "Neural Network Connected",
        description: `AI Assistant activated for ${role}`,
      });
    } catch (error) {
      toast({
        title: "Authentication Failed",
        description: "Neural network connection failed",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-virtualis-gold/5 rounded-full blur-3xl ai-float"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-virtualis-ai-blue/5 rounded-full blur-3xl ai-float" style={{animationDelay: '1s'}}></div>
        <div className="absolute top-1/2 right-1/3 w-32 h-32 bg-virtualis-ai-purple/10 rounded-full blur-2xl ai-float" style={{animationDelay: '2s'}}></div>
      </div>

      <div className="w-full max-w-md relative z-10">
        {/* Logo Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-6">
            <div className="relative">
              <img 
                src="/lovable-uploads/2fea59fe-0e40-4076-8aa6-9578a98e3170.png" 
                alt="Virtualis One" 
                className="h-24 w-24 ai-float ai-glow"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-virtualis-gold/20 to-transparent rounded-full blur-xl"></div>
            </div>
          </div>
          <h1 className="text-5xl font-bold text-white mb-3 tech-font ai-text-glow">
            VIRTUALIS ONE™
          </h1>
          <p className="text-virtualis-gold font-bold text-xl mb-2 tech-font">
            AI-POWERED EMR COMMAND CENTER
          </p>
          <p className="text-slate-300 text-sm flex items-center justify-center gap-2">
            <Brain className="h-4 w-4 text-virtualis-gold" />
            Next-Generation Medical Intelligence Platform
            <Cpu className="h-4 w-4 text-virtualis-ai-blue" />
          </p>
          
          {/* AI Status Indicators */}
          <div className="flex items-center justify-center gap-4 mt-4 text-xs">
            <div className="flex items-center gap-1 text-green-400">
              <div className="w-2 h-2 bg-green-400 rounded-full ai-pulse"></div>
              <span>AI ONLINE</span>
            </div>
            <div className="flex items-center gap-1 text-blue-400">
              <Network className="h-3 w-3" />
              <span>NEURAL NET</span>
            </div>
            <div className="flex items-center gap-1 text-purple-400">
              <Zap className="h-3 w-3" />
              <span>QUANTUM READY</span>
            </div>
          </div>
        </div>

        {/* Login Card */}
        <Card className="ai-card border-2 border-slate-700/50 hover:border-virtualis-gold/30 transition-all duration-500">
          <CardHeader className="text-center relative">
            <div className="ai-scan-line"></div>
            <CardTitle className="text-2xl font-bold text-white flex items-center justify-center gap-2 tech-font">
              <Lock className="h-5 w-5 text-virtualis-gold" />
              SECURE NEURAL ACCESS
            </CardTitle>
            <CardDescription className="text-slate-400">
              Biometric Authentication Protocol
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-white font-medium tech-font text-sm">NEURAL ID</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter neural identification"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="ai-input h-12 tech-font"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password" className="text-white font-medium tech-font text-sm">QUANTUM KEY</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter security quantum key"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="ai-input h-12 tech-font"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="role" className="text-white font-medium tech-font text-sm">ACCESS LEVEL</Label>
                <Select value={role} onValueChange={setRole} required>
                  <SelectTrigger className="ai-input h-12 tech-font">
                    <SelectValue placeholder="Select authorization level" />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-900 border-slate-700">
                    <SelectItem value="physician" className="tech-font">🧠 NEURAL PHYSICIAN</SelectItem>
                    <SelectItem value="nurse" className="tech-font">⚡ CYBER NURSE</SelectItem>
                    <SelectItem value="biller" className="tech-font">💳 QUANTUM BILLER</SelectItem>
                    <SelectItem value="admin" className="tech-font">🔧 SYSTEM ADMIN</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="stayLoggedIn"
                  checked={stayLoggedIn}
                  onChange={(e) => setStayLoggedIn(e.target.checked)}
                  className="rounded border-slate-600 bg-slate-800/50"
                />
                <Label htmlFor="stayLoggedIn" className="text-sm text-slate-300 tech-font">
                  MAINTAIN NEURAL CONNECTION
                </Label>
              </div>

              <Button 
                type="submit" 
                className="w-full ai-button h-14 text-lg tech-font"
                disabled={loading}
              >
                {loading ? (
                  <div className="flex items-center gap-3">
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    ESTABLISHING NEURAL LINK...
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <Brain className="h-5 w-5" />
                    ACTIVATE AI INTERFACE
                  </div>
                )}
              </Button>
            </form>
            
            <div className="mt-8 text-xs text-slate-400 text-center space-y-3">
              <div className="flex items-center justify-center gap-2 p-3 bg-slate-800/30 rounded-lg border border-slate-700/50">
                <Shield className="h-4 w-4 text-green-400" />
                <span className="tech-font">QUANTUM ENCRYPTED • HIPAA COMPLIANT • AI SECURED</span>
              </div>
              <div className="border-t border-slate-700/50 pt-4">
                <p className="font-medium text-slate-300 tech-font mb-2">DEMO ACCESS CODES:</p>
                <div className="space-y-1 text-virtualis-gold">
                  <p>doctor@virtualis.ai • Neural Physician</p>
                  <p>nurse@virtualis.ai • Cyber Nurse</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Login;
