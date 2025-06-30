
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { User, Lock, Shield } from "lucide-react";

interface LoginProps {
  onLogin: (email: string, password: string, role: string) => void;
}

const Login = ({ onLogin }: LoginProps) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");
  const [loading, setLoading] = useState(false);
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
        description: `Welcome to VirtualisOne`,
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
    <div className="min-h-screen bg-[#0a1628] flex items-center justify-center p-4">
      <div className="w-full max-w-7xl grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center">
        {/* Logo and Messaging Section */}
        <div className="flex flex-col items-center text-center space-y-8">
          <div className="space-y-6">
            <div className="flex flex-col items-center gap-6">
              <img 
                src="/lovable-uploads/d89e4887-8595-4385-add8-c92d316b043f.png" 
                alt="VirtualisOne Logo" 
                className="h-40 lg:h-56 xl:h-72 w-auto animate-float pulse-glow"
              />
              <div className="text-center max-w-2xl">
                <p className="text-lg lg:text-xl xl:text-2xl text-white/70 tech-font leading-relaxed">
                  Revolutionary healthcare intelligence platform connecting hospitals, 
                  patients, and providers in real-time.
                </p>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full max-w-2xl">
            <div className="glass-badge primary flex items-center justify-center gap-2 p-4">
              <Shield className="h-5 w-5" />
              <span className="tech-font font-semibold">HIPAA SECURE</span>
            </div>
            <div className="glass-badge success flex items-center justify-center gap-2 p-4">
              <Shield className="h-5 w-5" />
              <span className="tech-font font-semibold">AI-POWERED</span>
            </div>
            <div className="glass-badge flex items-center justify-center gap-2 p-4">
              <Shield className="h-5 w-5" />
              <span className="tech-font font-semibold">SOC 2 CERTIFIED</span>
            </div>
          </div>
        </div>

        {/* Authentication Form Section */}
        <div className="w-full max-w-md mx-auto lg:mx-0">
          <div className="glass-card p-8">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="flex items-center gap-2 justify-center mb-4">
                <Shield className="h-5 w-5 text-virtualis-gold" />
                <h1 className="text-2xl font-bold text-white tech-font">
                  VirtualisOne
                </h1>
              </div>
              <p className="text-white/70 tech-font">
                Secure Healthcare Portal Access
              </p>
            </div>

            {/* Login Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-white tech-font">Email</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="glass-input tech-font pl-10 h-12"
                    required
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password" className="text-white tech-font">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="glass-input tech-font pl-10 h-12"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="role" className="text-white tech-font">Role</Label>
                <Select value={role} onValueChange={setRole} required>
                  <SelectTrigger className="glass-input tech-font h-12">
                    <SelectValue placeholder="Select your role" />
                  </SelectTrigger>
                  <SelectContent className="glass-card border-white/20">
                    <SelectItem value="physician" className="text-white tech-font">Physician</SelectItem>
                    <SelectItem value="nurse" className="text-white tech-font">Nurse</SelectItem>
                    <SelectItem value="biller" className="text-white tech-font">Billing Manager</SelectItem>
                    <SelectItem value="admin" className="text-white tech-font">Administrator</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button 
                type="submit" 
                className="w-full glass-button tech-font h-12 text-base font-semibold mt-6"
                disabled={loading}
              >
                {loading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    Signing In...
                  </div>
                ) : (
                  "Sign In"
                )}
              </Button>
            </form>
            
            {/* Demo Accounts */}
            <div className="mt-8 text-center">
              <p className="text-white/60 text-sm tech-font mb-4">Demo Accounts:</p>
              
              <div className="space-y-2 text-sm">
                <div className="flex items-center justify-center gap-2 text-white/50">
                  <Shield className="h-3 w-3" />
                  <span>admin@virtualisone.com</span>
                </div>
                
                <div className="flex items-center justify-center gap-2 text-white/50">
                  <User className="h-3 w-3" />
                  <span>doctor@virtualisone.com</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="text-center text-white/60 text-sm tech-font mt-6">
            <p>🔒 256-bit Encryption • Real-time Monitoring • 99.9% Uptime</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
