import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Brain, Shield, Lock, Zap, Eye, Building2 } from "lucide-react";

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
        description: `Welcome to Universal EMR`,
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
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-virtualis-gold/10 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-virtualis-gold/5 rounded-full blur-2xl animate-float" style={{animationDelay: '2s'}}></div>
      </div>

      <div className="w-full max-w-5xl relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        {/* Left Side - Logo and Info */}
        <div className="text-center lg:text-left space-y-8">
          <div className="flex items-center justify-center lg:justify-start mb-8">
            <div className="relative">
              <img 
                src="/lovable-uploads/2fea59fe-0e40-4076-8aa6-9578a98e3170.png" 
                alt="Universal EMR" 
                className="h-80 w-80 animate-float pulse-glow rounded-xl"
              />
            </div>
          </div>
          
          <div className="space-y-6">
            <h1 className="text-4xl font-bold gradient-text tech-font">
              Universal EMR
            </h1>
            <p className="text-white/90 font-medium text-xl tech-font">
              AI-Powered Clinical Platform
            </p>
            <p className="text-white/70 text-lg tech-font max-w-2xl">
              Advanced Healthcare Management System
            </p>
          </div>

          {/* Simple Feature Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-12">
            <div className="glass-card p-6 text-center hover:scale-105 transition-all duration-300">
              <Building2 className="h-8 w-8 text-virtualis-gold mx-auto mb-3" />
              <h3 className="text-white font-semibold tech-font mb-2">Multi-Facility Access</h3>
            </div>
            <div className="glass-card p-6 text-center hover:scale-105 transition-all duration-300">
              <Brain className="h-8 w-8 text-virtualis-gold mx-auto mb-3 pulse-glow" />
              <h3 className="text-white font-semibold tech-font mb-2">Clinical AI Assistant</h3>
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
              <Label htmlFor="password" className="text-white/90 font-medium tech-font">Password</Label>
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
              <Label htmlFor="role" className="text-white/90 font-medium tech-font">Role</Label>
              <Select value={role} onValueChange={setRole} required>
                <SelectTrigger className="glass-input tech-font h-12">
                  <SelectValue placeholder="Select your role" />
                </SelectTrigger>
                <SelectContent className="glass-card border-white/20">
                  <SelectItem value="physician" className="tech-font text-white hover:bg-white/10">Physician</SelectItem>
                  <SelectItem value="nurse" className="tech-font text-white hover:bg-white/10">Nurse</SelectItem>
                  <SelectItem value="biller" className="tech-font text-white hover:bg-white/10">Billing Manager</SelectItem>
                  <SelectItem value="admin" className="tech-font text-white hover:bg-white/10">Administrator</SelectItem>
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
                Stay signed in
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
                  Signing In...
                </div>
              ) : (
                <div className="flex items-center gap-3">
                  <Zap className="h-5 w-5" />
                  Sign In
                </div>
              )}
            </Button>
          </form>
          
          <div className="mt-8 text-center">
            <div className="glass-badge mb-6 inline-flex items-center gap-2">
              <Lock className="h-3 w-3" />
              <span className="tech-font text-xs">SECURE • HIPAA COMPLIANT</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
