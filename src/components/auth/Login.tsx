
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Brain, Shield, Lock, Zap, Eye, Building2 } from "lucide-react";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { useTheme } from "@/hooks/useTheme";

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
  const { theme } = useTheme();

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
    <div className={`min-h-screen flex items-center justify-center p-6 relative overflow-hidden ${
      theme === 'dark' ? 'bg-[#0a1628]' : 'bg-gradient-to-br from-sky-300 via-sky-400 to-blue-500'
    }`}>
      {/* Theme Toggle */}
      <div className="absolute top-6 right-6 z-20">
        <ThemeToggle />
      </div>

      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className={`absolute top-1/4 left-1/4 w-96 h-96 rounded-full blur-3xl animate-float ${
          theme === 'dark' ? 'bg-virtualis-gold/10' : 'bg-white/20'
        }`}></div>
        <div className={`absolute bottom-1/4 right-1/4 w-64 h-64 rounded-full blur-2xl animate-float ${
          theme === 'dark' ? 'bg-virtualis-gold/5' : 'bg-white/10'
        }`} style={{animationDelay: '2s'}}></div>
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
            <h1 className={`text-4xl font-bold tech-font ${
              theme === 'dark' ? 'gradient-text' : 'text-white'
            }`}>
              Universal EMR
            </h1>
            <p className={`font-medium text-xl tech-font ${
              theme === 'dark' ? 'text-white/90' : 'text-white/95'
            }`}>
              AI-Powered Clinical Platform
            </p>
            <p className={`text-lg tech-font max-w-2xl ${
              theme === 'dark' ? 'text-white/70' : 'text-white/90'
            }`}>
              Advanced Healthcare Management System
            </p>
          </div>

          {/* Simple Feature Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-12">
            <div className={`p-6 text-center hover:scale-105 transition-all duration-300 ${
              theme === 'dark' ? 'glass-card' : 'bg-white/20 backdrop-blur-sm rounded-2xl border border-white/30 shadow-lg'
            }`}>
              <Building2 className={`h-8 w-8 mx-auto mb-3 ${
                theme === 'dark' ? 'text-virtualis-gold' : 'text-white'
              }`} />
              <h3 className={`font-semibold tech-font mb-2 ${
                theme === 'dark' ? 'text-white' : 'text-white'
              }`}>Multi-Facility Access</h3>
            </div>
            <div className={`p-6 text-center hover:scale-105 transition-all duration-300 ${
              theme === 'dark' ? 'glass-card' : 'bg-white/20 backdrop-blur-sm rounded-2xl border border-white/30 shadow-lg'
            }`}>
              <Brain className={`h-8 w-8 mx-auto mb-3 pulse-glow ${
                theme === 'dark' ? 'text-virtualis-gold' : 'text-white'
              }`} />
              <h3 className={`font-semibold tech-font mb-2 ${
                theme === 'dark' ? 'text-white' : 'text-white'
              }`}>Clinical AI Assistant</h3>
            </div>
          </div>
        </div>

        {/* Right Side - Login Form */}
        <div className={`p-8 max-w-md mx-auto w-full ${
          theme === 'dark' ? 'floating-glass scan-line' : 'bg-white/95 backdrop-blur-sm rounded-2xl border border-white/50 shadow-2xl'
        }`}>
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Shield className={`h-6 w-6 ${
                theme === 'dark' ? 'text-virtualis-gold' : 'text-sky-600'
              }`} />
              <h2 className={`text-2xl font-bold tech-font ${
                theme === 'dark' ? 'text-white' : 'text-slate-800'
              }`}>Clinical Access Portal</h2>
            </div>
            <p className={`text-sm tech-font ${
              theme === 'dark' ? 'text-white/70' : 'text-slate-600'
            }`}>
              Licensed Healthcare Professionals Only
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email" className={`font-medium tech-font ${
                theme === 'dark' ? 'text-white/90' : 'text-slate-700'
              }`}>Professional Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="physician@hospital.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={`tech-font h-12 ${
                  theme === 'dark' ? 'glass-input' : 'bg-white/80 border-slate-300 text-slate-800 placeholder:text-slate-500'
                }`}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password" className={`font-medium tech-font ${
                theme === 'dark' ? 'text-white/90' : 'text-slate-700'
              }`}>Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={`tech-font h-12 pr-12 ${
                    theme === 'dark' ? 'glass-input' : 'bg-white/80 border-slate-300 text-slate-800 placeholder:text-slate-500'
                  }`}
                  required
                />
                <Button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 p-0 h-auto bg-transparent hover:bg-transparent"
                >
                  <Eye className={`h-4 w-4 ${
                    theme === 'dark' ? 'text-white/60 hover:text-white/80' : 'text-slate-500 hover:text-slate-700'
                  }`} />
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="role" className={`font-medium tech-font ${
                theme === 'dark' ? 'text-white/90' : 'text-slate-700'
              }`}>Role</Label>
              <Select value={role} onValueChange={setRole} required>
                <SelectTrigger className={`tech-font h-12 ${
                  theme === 'dark' ? 'glass-input' : 'bg-white/80 border-slate-300 text-slate-800'
                }`}>
                  <SelectValue placeholder="Select your role" />
                </SelectTrigger>
                <SelectContent className={`${
                  theme === 'dark' ? 'glass-card border-white/20' : 'bg-white border-slate-200'
                }`}>
                  <SelectItem value="physician" className={`tech-font ${
                    theme === 'dark' ? 'text-white hover:bg-white/10' : 'text-slate-800 hover:bg-slate-100'
                  }`}>Physician</SelectItem>
                  <SelectItem value="nurse" className={`tech-font ${
                    theme === 'dark' ? 'text-white hover:bg-white/10' : 'text-slate-800 hover:bg-slate-100'
                  }`}>Nurse</SelectItem>
                  <SelectItem value="biller" className={`tech-font ${
                    theme === 'dark' ? 'text-white hover:bg-white/10' : 'text-slate-800 hover:bg-slate-100'
                  }`}>Billing Manager</SelectItem>
                  <SelectItem value="admin" className={`tech-font ${
                    theme === 'dark' ? 'text-white hover:bg-white/10' : 'text-slate-800 hover:bg-slate-100'
                  }`}>Administrator</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center space-x-3 pt-2">
              <input
                type="checkbox"
                id="stayLoggedIn"
                checked={stayLoggedIn}
                onChange={(e) => setStayLoggedIn(e.target.checked)}
                className={`w-4 h-4 rounded focus:ring-2 ${
                  theme === 'dark' 
                    ? 'text-virtualis-gold bg-white/10 border-white/30 focus:ring-virtualis-gold'
                    : 'text-sky-600 bg-white border-slate-300 focus:ring-sky-600'
                }`}
              />
              <Label htmlFor="stayLoggedIn" className={`tech-font ${
                theme === 'dark' ? 'text-white/80' : 'text-slate-700'
              }`}>
                Stay signed in
              </Label>
            </div>

            <Button 
              type="submit" 
              className={`w-full h-14 text-lg tech-font mt-8 ${
                theme === 'dark' 
                  ? 'glass-button'
                  : 'bg-sky-600 hover:bg-sky-700 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300'
              }`}
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
            <div className={`mb-6 inline-flex items-center gap-2 px-3 py-1 rounded-full ${
              theme === 'dark' ? 'glass-badge' : 'bg-slate-100 border border-slate-300 text-slate-700'
            }`}>
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
