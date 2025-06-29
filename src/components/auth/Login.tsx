
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/components/auth/AuthProvider";
import { User, Lock, Shield } from "lucide-react";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const { signIn } = useAuth();

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
      const { error } = await signIn(email, password);
      
      if (error) {
        toast({
          title: "Authentication Failed",
          description: "Access denied - Please verify credentials",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Access Granted",
          description: `Welcome to Virtualis One™`,
        });
      }
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
    <div className="min-h-screen flex items-center justify-center p-6 relative overflow-hidden">
      <div className="w-full max-w-md relative z-10">
        {/* Main Login Card */}
        <div className="livemed-card p-8">
          {/* Logo and Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 mx-auto mb-4 rounded-xl flex items-center justify-center livemed-button animate-pulse-glow">
              <Shield className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-white livemed-font-bold mb-2">
              Virtualis One™
            </h1>
            <p className="text-gray-300 livemed-font">
              Universal EMR Platform
            </p>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="livemed-form-container">
            <div className="livemed-form-group">
              <Label htmlFor="email" className="livemed-label">Email</Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="livemed-input pl-10 h-12"
                  required
                />
              </div>
            </div>
            
            <div className="livemed-form-group">
              <Label htmlFor="password" className="livemed-label">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="livemed-input pl-10 h-12"
                  required
                />
              </div>
            </div>

            <div className="livemed-form-group">
              <Label htmlFor="role" className="livemed-label">Role</Label>
              <Select value={role} onValueChange={setRole} required>
                <SelectTrigger className="livemed-input h-12">
                  <SelectValue placeholder="Select your role" />
                </SelectTrigger>
                <SelectContent className="livemed-select-content">
                  <SelectItem value="physician" className="livemed-select-item">Physician</SelectItem>
                  <SelectItem value="nurse" className="livemed-select-item">Nurse</SelectItem>
                  <SelectItem value="pharmacist" className="livemed-select-item">Pharmacist</SelectItem>
                  <SelectItem value="admin" className="livemed-select-item">Administrator</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button 
              type="submit" 
              className="w-full livemed-button h-12 text-base livemed-font-bold mt-6"
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
          
          {/* Registration Link */}
          <div className="mt-6 text-center">
            <div className="flex items-center justify-center gap-2 text-gray-300 livemed-demo-text">
              <User className="h-4 w-4 livemed-demo-icon" />
              <span>New Healthcare Provider? Register Here</span>
            </div>
          </div>
        </div>

        {/* Demo Accounts Section */}
        <div className="mt-8 text-center">
          <p className="livemed-demo-text mb-4">Demo Accounts:</p>
          
          <div className="space-y-3">
            <div className="flex items-center justify-center gap-3 livemed-demo-text">
              <Shield className="h-4 w-4 livemed-demo-icon" />
              <span>Admin Portal (admin@virtualis.com)</span>
            </div>
            
            <div className="flex items-center justify-center gap-3 livemed-demo-text">
              <User className="h-4 w-4 livemed-demo-icon" />
              <span>Dr. Sarah Johnson (sarah@virtualis.com)</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
