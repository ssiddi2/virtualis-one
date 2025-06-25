
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Brain, Shield, Lock, Zap, Cpu, Network, Eye, Building2, Users, FileText } from "lucide-react";

interface LoginProps {
  onLogin: (email: string, password: string, role: string) => void;
}

const Login = ({ onLogin }: LoginProps) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");
  const [stayLoggedIn, setStayLoggedIn] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password || !role) {
      toast({
        title: "Authentication Required",
        description: "Please complete all required credentials",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      onLogin(email, password, role);
      toast({
        title: "Clinical System Access Granted",
        description: `Virtualis One™ activated for ${role}`,
      });
    } catch (error) {
      toast({
        title: "Authentication Failed",
        description: "Access denied - Please verify credentials",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-virtualis-navy flex items-center justify-center p-6 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-virtualis-gold/10 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-virtualis-gold/5 rounded-full blur-2xl animate-float" style={{animationDelay: '2s'}}></div>
        <div className="absolute top-1/2 right-1/3 w-32 h-32 bg-virtualis-gold/15 rounded-full blur-xl animate-float" style={{animationDelay: '4s'}}></div>
      </div>

      <div className="w-full max-w-6xl relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        {/* Left Side - Hero Section */}
        <div className="text-center lg:text-left space-y-8">
          <div className="flex items-center justify-center lg:justify-start mb-8">
            <div className="relative">
              <img 
                src="/lovable-uploads/2fea59fe-0e40-4076-8aa6-9578a98e3170.png" 
                alt="Virtualis One" 
                className="h-40 w-40 animate-float pulse-glow rounded-xl"
              />
            </div>
          </div>
          
          <div>
            <h1 className="text-7xl lg:text-8xl font-bold text-white mb-6 brand-font gradient-text tech-glow">
              Virtualis One™
            </h1>
            <p className="text-white/90 font-medium text-2xl mb-4 tech-font">
              Advanced Clinical Intelligence Platform
            </p>
            <p className="text-white/70 text-lg mb-8 tech-font max-w-2xl">
              Unified Multi-Facility EMR Integration with AI-Powered Clinical Decision Support for Healthcare Providers
            </p>
          </div>

          {/* Feature Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
            <div className="glass-card p-6 text-center hover:scale-105 transition-all duration-300">
              <Building2 className="h-8 w-8 text-virtualis-gold mx-auto mb-3" />
              <h3 className="text-white font-semibold tech-font mb-2">Multi-Facility</h3>
              <p className="text-white/60 text-sm tech-font">Seamless EMR integration</p>
            </div>
            <div className="glass-card p-6 text-center hover:scale-105 transition-all duration-300">
              <Brain className="h-8 w-8 text-virtualis-gold mx-auto mb-3 pulse-glow" />
              <h3 className="text-white font-semibold tech-font mb-2">Clinical AI</h3>
              <p className="text-white/60 text-sm tech-font">Intelligent documentation</p>
            </div>
            <div className="glass-card p-6 text-center hover:scale-105 transition-all duration-300">
              <Shield className="h-8 w-8 text-virtualis-gold mx-auto mb-3" />
              <h3 className="text-white font-semibold tech-font mb-2">HIPAA Compliant</h3>
              <p className="text-white/60 text-sm tech-font">Enterprise security</p>
            </div>
          </div>

          {/* System Status Indicators */}
          <div className="flex items-center justify-center lg:justify-start gap-6 mt-8">
            <div className="flex items-center gap-2 glass-badge success">
              <div className="w-2 h-2 bg-green-400 rounded-full pulse-glow"></div>
              <span className="tech-font text-xs">SECURE</span>
            </div>
            <div className="flex items-center gap-2 glass-badge primary">
              <Brain className="h-3 w-3" />
              <span className="tech-font text-xs">AI ACTIVE</span>
            </div>
            <div className="flex items-center gap-2 glass-badge success">
              <Network className="h-3 w-3" />
              <span className="tech-font text-xs">CONNECTED</span>
            </div>
          </div>
        </div>

        {/* Right Side - Login Form */}
        <div className="floating-glass p-8 scan-line max-w-md mx-auto w-full">
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Shield className="h-6 w-6 text-virtualis-gold" />
              <h2 className="text-2xl font-bold text-white tech-font">Clinical Access Portal</h2>
            </div>
            <p className="text-white/70 text-sm tech-font">
              Licensed Healthcare Professionals Only
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-white/90 font-medium tech-font">Professional Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="physician@hospital.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="glass-input tech-font h-12"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password" className="text-white/90 font-medium tech-font">Secure Credentials</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="glass-input tech-font h-12 pr-12"
                  required
                />
                <Button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 p-0 h-auto bg-transparent hover:bg-transparent"
                >
                  <Eye className="h-4 w-4 text-white/60 hover:text-white/80" />
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="role" className="text-white/90 font-medium tech-font">Professional Role</Label>
              <Select value={role} onValueChange={setRole} required>
                <SelectTrigger className="glass-input tech-font h-12">
                  <SelectValue placeholder="Select professional role" />
                </SelectTrigger>
                <SelectContent className="glass-card border-white/20">
                  <SelectItem value="physician" className="tech-font text-white hover:bg-white/10">🩺 Physician</SelectItem>
                  <SelectItem value="nurse" className="tech-font text-white hover:bg-white/10">👩‍⚕️ Registered Nurse</SelectItem>
                  <SelectItem value="biller" className="tech-font text-white hover:bg-white/10">💼 Revenue Cycle Manager</SelectItem>
                  <SelectItem value="admin" className="tech-font text-white hover:bg-white/10">⚙️ System Administrator</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center space-x-3 pt-2">
              <input
                type="checkbox"
                id="stayLoggedIn"
                checked={stayLoggedIn}
                onChange={(e) => setStayLoggedIn(e.target.checked)}
                className="w-4 h-4 text-virtualis-gold bg-white/10 border-white/30 rounded focus:ring-virtualis-gold focus:ring-2"
              />
              <Label htmlFor="stayLoggedIn" className="text-white/80 tech-font">
                Maintain session
              </Label>
            </div>

            <Button 
              type="submit" 
              className="w-full glass-button h-14 text-lg tech-font mt-8"
              disabled={loading}
            >
              {loading ? (
                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  Authenticating Clinical Access...
                </div>
              ) : (
                <div className="flex items-center gap-3">
                  <Zap className="h-5 w-5" />
                  Access Clinical Platform
                </div>
              )}
            </Button>
          </form>
          
          <div className="mt-8 text-center">
            <div className="glass-badge mb-6 inline-flex items-center gap-2">
              <Lock className="h-3 w-3" />
              <span className="tech-font text-xs">256-BIT ENCRYPTED • HIPAA COMPLIANT</span>
            </div>
            <div className="text-xs text-white/50 tech-font">
              <p className="mb-2">Trusted by Healthcare Institutions Globally</p>
              <p>All clinical access monitored and audited</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
