
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Hospital, Shield, Lock } from "lucide-react";

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
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      onLogin(email, password, role);
      toast({
        title: "Welcome to Virtualis One™",
        description: `Logged in as ${role}`,
      });
    } catch (error) {
      toast({
        title: "Login Failed",
        description: "Please check your credentials",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <div className="w-16 h-16 bg-virtualis-gold rounded-xl flex items-center justify-center shadow-lg">
              <Hospital className="h-8 w-8 text-white" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-white mb-2">
            Virtualis One™
          </h1>
          <p className="text-virtualis-gold font-semibold text-lg">
            Multi-Hospital EMR Command Center
          </p>
          <p className="text-slate-400 text-sm mt-1">
            An Intelligent Universal EMR Platform
          </p>
        </div>

        {/* Login Card */}
        <Card className="virtualis-card">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold text-white flex items-center justify-center gap-2">
              <Lock className="h-5 w-5 text-virtualis-gold" />
              Secure Sign In
            </CardTitle>
            <CardDescription className="text-slate-400">
              Access your multi-hospital dashboard
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-white font-medium">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-400"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password" className="text-white font-medium">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-400"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="role" className="text-white font-medium">Role</Label>
                <Select value={role} onValueChange={setRole} required>
                  <SelectTrigger className="bg-slate-700/50 border-slate-600 text-white">
                    <SelectValue placeholder="Select your role" />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-800 border-slate-600">
                    <SelectItem value="physician">Physician</SelectItem>
                    <SelectItem value="nurse">Nurse</SelectItem>
                    <SelectItem value="biller">Biller</SelectItem>
                    <SelectItem value="admin">Administrator</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="stayLoggedIn"
                  checked={stayLoggedIn}
                  onChange={(e) => setStayLoggedIn(e.target.checked)}
                  className="rounded border-slate-600 bg-slate-700/50"
                />
                <Label htmlFor="stayLoggedIn" className="text-sm text-slate-300">
                  Stay logged in
                </Label>
              </div>

              <Button 
                type="submit" 
                className="w-full virtualis-button"
                disabled={loading}
              >
                {loading ? "Signing In..." : "Sign In"}
              </Button>
            </form>
            
            <div className="mt-6 text-xs text-slate-400 text-center space-y-2">
              <p className="flex items-center justify-center gap-1">
                <Shield className="h-3 w-3" />
                HIPAA & HITRUST Compliant
              </p>
              <div className="border-t border-slate-600 pt-3">
                <p className="font-medium text-slate-300">Demo Credentials:</p>
                <p>Email: doctor@hospital.com | Role: Physician</p>
                <p>Email: nurse@hospital.com | Role: Nurse</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Login;
