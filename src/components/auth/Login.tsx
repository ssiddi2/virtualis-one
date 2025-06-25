
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Brain, Shield, Lock, Zap, Eye, Building2, Activity, Database } from "lucide-react";

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
        title: "Access Granted",
        description: `Welcome to Universal EMR Command Center`,
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
    <div className="min-h-screen bg-[#0a1628] flex items-center justify-center p-6 relative overflow-hidden">
      {/* Enhanced animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-virtualis-gold/10 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-virtualis-gold/5 rounded-full blur-2xl animate-float" style={{animationDelay: '2s'}}></div>
        <div className="absolute top-1/2 left-1/2 w-32 h-32 bg-blue-500/5 rounded-full blur-xl animate-float" style={{animationDelay: '4s'}}></div>
      </div>

      <div className="w-full max-w-6xl relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        {/* Left Side - Enhanced Logo and Info */}
        <div className="text-center lg:text-left space-y-10">
          <div className="flex items-center justify-center lg:justify-start mb-12">
            <div className="relative">
              <img 
                src="/lovable-uploads/2fea59fe-0e40-4076-8aa6-9578a98e3170.png" 
                alt="Universal EMR Command Center" 
                className="h-80 w-80 animate-float pulse-glow rounded-xl"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-virtualis-gold/20 to-transparent rounded-xl"></div>
            </div>
          </div>
          
          <div className="space-y-8">
            <h1 className="text-5xl font-bold gradient-text tech-font">
              Universal EMR
            </h1>
            <h2 className="text-3xl font-semibold text-virtualis-gold tech-font">
              Command Center
            </h2>
            <p className="text-white/90 font-medium text-xl tech-font">
              Next-Generation Healthcare Platform
            </p>
            <p className="text-white/70 text-lg tech-font max-w-2xl">
              Advanced clinical operations and intelligent patient management system
            </p>
          </div>

          {/* Enhanced Feature Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-16">
            <div className="glass-card p-8 text-center hover:scale-105 transition-all duration-300 border border-virtualis-gold/20">
              <Building2 className="h-10 w-10 text-virtualis-gold mx-auto mb-4 pulse-glow" />
              <h3 className="text-white font-semibold tech-font mb-3 text-lg">Multi-Facility Network</h3>
              <p className="text-white/60 text-sm">Seamless integration across healthcare systems</p>
            </div>
            <div className="glass-card p-8 text-center hover:scale-105 transition-all duration-300 border border-blue-400/20">
              <Activity className="h-10 w-10 text-blue-400 mx-auto mb-4 pulse-glow" />
              <h3 className="text-white font-semibold tech-font mb-3 text-lg">Real-Time Analytics</h3>
              <p className="text-white/60 text-sm">Live patient monitoring and clinical insights</p>
            </div>
            <div className="glass-card p-8 text-center hover:scale-105 transition-all duration-300 border border-green-400/20">
              <Brain className="h-10 w-10 text-green-400 mx-auto mb-4 pulse-glow" />
              <h3 className="text-white font-semibold tech-font mb-3 text-lg">AI Clinical Assistant</h3>
              <p className="text-white/60 text-sm">Intelligent diagnostic support and recommendations</p>
            </div>
            <div className="glass-card p-8 text-center hover:scale-105 transition-all duration-300 border border-purple-400/20">
              <Database className="h-10 w-10 text-purple-400 mx-auto mb-4 pulse-glow" />
              <h3 className="text-white font-semibold tech-font mb-3 text-lg">Cloud Integration</h3>
              <p className="text-white/60 text-sm">Secure, scalable healthcare data management</p>
            </div>
          </div>
        </div>

        {/* Right Side - Enhanced Login Form */}
        <div className="floating-glass p-10 scan-line max-w-md mx-auto w-full border border-white/20">
          <div className="text-center mb-10">
            <div className="flex items-center justify-center gap-3 mb-6">
              <Shield className="h-8 w-8 text-virtualis-gold pulse-glow" />
              <h2 className="text-3xl font-bold text-white tech-font">Access Portal</h2>
            </div>
            <p className="text-white/70 text-base tech-font">
              Authorized Healthcare Professionals Only
            </p>
            <div className="glass-badge primary mt-4 inline-flex items-center gap-2">
              <Lock className="h-3 w-3" />
              <span className="tech-font text-xs">SECURE GATEWAY</span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="space-y-3">
              <Label htmlFor="email" className="text-white/90 font-medium tech-font text-base">Professional Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="physician@hospital.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="glass-input tech-font h-14 text-base"
                required
              />
            </div>
            
            <div className="space-y-3">
              <Label htmlFor="password" className="text-white/90 font-medium tech-font text-base">Security Code</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="glass-input tech-font h-14 pr-14 text-base"
                  required
                />
                <Button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 p-0 h-auto bg-transparent hover:bg-transparent"
                >
                  <Eye className="h-5 w-5 text-white/60 hover:text-white/80" />
                </Button>
              </div>
            </div>

            <div className="space-y-3">
              <Label htmlFor="role" className="text-white/90 font-medium tech-font text-base">Access Level</Label>
              <Select value={role} onValueChange={setRole} required>
                <SelectTrigger className="glass-input tech-font h-14 text-base">
                  <SelectValue placeholder="Select your access level" />
                </SelectTrigger>
                <SelectContent className="glass-card border-white/20 backdrop-blur-xl">
                  <SelectItem value="physician" className="tech-font text-white hover:bg-white/10">Chief Medical Officer</SelectItem>
                  <SelectItem value="nurse" className="tech-font text-white hover:bg-white/10">Clinical Specialist</SelectItem>
                  <SelectItem value="biller" className="tech-font text-white hover:bg-white/10">Operations Manager</SelectItem>
                  <SelectItem value="admin" className="tech-font text-white hover:bg-white/10">System Administrator</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center space-x-3 pt-4">
              <input
                type="checkbox"
                id="stayLoggedIn"
                checked={stayLoggedIn}
                onChange={(e) => setStayLoggedIn(e.target.checked)}
                className="w-5 h-5 text-virtualis-gold bg-white/10 border-white/30 rounded focus:ring-virtualis-gold focus:ring-2"
              />
              <Label htmlFor="stayLoggedIn" className="text-white/80 tech-font text-base">
                Maintain session
              </Label>
            </div>

            <Button 
              type="submit" 
              className="w-full glass-button h-16 text-xl tech-font mt-10"
              disabled={loading}
            >
              {loading ? (
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  Authenticating...
                </div>
              ) : (
                <div className="flex items-center gap-3">
                  <Zap className="h-6 w-6" />
                  Initialize Access
                </div>
              )}
            </Button>
          </form>
          
          <div className="mt-10 text-center">
            <div className="glass-badge success mb-6 inline-flex items-center gap-2">
              <Shield className="h-4 w-4" />
              <span className="tech-font text-sm">ENTERPRISE SECURITY • HIPAA COMPLIANT</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
