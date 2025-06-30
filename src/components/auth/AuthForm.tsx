
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { User, Lock, Shield, Stethoscope } from "lucide-react";

const AuthForm = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [role, setRole] = useState("");
  const [loading, setLoading] = useState(false);
  const { login, signUp } = useAuth();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password || (!isLogin && (!firstName || !lastName || !role))) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    
    try {
      if (isLogin) {
        await login(email, password, role || 'physician');
      } else {
        const userData = {
          first_name: firstName,
          last_name: lastName,
          role: role
        };
        await signUp(email, password, userData);
      }
    } catch (error) {
      // Error handling is done in the auth context
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{
      background: 'linear-gradient(135deg, hsl(225, 70%, 25%) 0%, hsl(220, 65%, 35%) 25%, hsl(215, 60%, 45%) 50%, hsl(210, 55%, 55%) 75%, hsl(205, 50%, 65%) 100%)'
    }}>
      <div className="w-full max-w-7xl grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center">
        {/* Logo and Messaging Section */}
        <div className="flex flex-col items-center text-center space-y-8">
          <div className="space-y-6">
            <div className="flex flex-col items-center gap-6">
              <div className="flex items-center gap-3">
                <Stethoscope className="h-16 w-16 text-yellow-400" />
                <div>
                  <h1 className="text-4xl font-bold text-white">VirtualisOne</h1>
                  <p className="text-yellow-400 text-xl font-semibold">Universal EMR Platform</p>
                </div>
              </div>
              <div className="text-center max-w-2xl">
                <p className="text-lg lg:text-xl text-white/80 leading-relaxed">
                  AI-powered healthcare intelligence connecting hospitals, providers, and patients
                  across any EMR system with seamless interoperability.
                </p>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full max-w-2xl">
            <div className="backdrop-blur-xl bg-blue-500/20 border border-blue-300/30 rounded-xl p-4 flex items-center justify-center gap-2">
              <Shield className="h-5 w-5 text-blue-300" />
              <span className="font-semibold text-white">HIPAA SECURE</span>
            </div>
            <div className="backdrop-blur-xl bg-green-500/20 border border-green-300/30 rounded-xl p-4 flex items-center justify-center gap-2">
              <Shield className="h-5 w-5 text-green-300" />
              <span className="font-semibold text-white">AI-POWERED</span>
            </div>
            <div className="backdrop-blur-xl bg-purple-500/20 border border-purple-300/30 rounded-xl p-4 flex items-center justify-center gap-2">
              <Shield className="h-5 w-5 text-purple-300" />
              <span className="font-semibold text-white">UNIVERSAL EMR</span>
            </div>
          </div>
        </div>

        {/* Authentication Form Section */}
        <div className="w-full max-w-md mx-auto lg:mx-0">
          <Card className="backdrop-blur-xl bg-blue-500/20 border border-blue-300/30 rounded-xl shadow-lg">
            <CardHeader className="text-center">
              <CardTitle className="text-white text-2xl">
                {isLogin ? 'Sign In' : 'Create Account'}
              </CardTitle>
              <p className="text-white/70">
                Access your universal healthcare platform
              </p>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                {!isLogin && (
                  <>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="firstName" className="text-white">First Name</Label>
                        <Input
                          id="firstName"
                          value={firstName}
                          onChange={(e) => setFirstName(e.target.value)}
                          className="bg-white/10 border-white/30 text-white placeholder:text-white/50"
                          required={!isLogin}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="lastName" className="text-white">Last Name</Label>
                        <Input
                          id="lastName"
                          value={lastName}
                          onChange={(e) => setLastName(e.target.value)}
                          className="bg-white/10 border-white/30 text-white placeholder:text-white/50"
                          required={!isLogin}
                        />
                      </div>
                    </div>
                  </>
                )}
                
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-white">Email</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-white/50" />
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="bg-white/10 border-white/30 text-white placeholder:text-white/50 pl-10"
                      placeholder="Enter your email"
                      required
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-white">Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-white/50" />
                    <Input
                      id="password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="bg-white/10 border-white/30 text-white placeholder:text-white/50 pl-10"
                      placeholder="Enter your password"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="role" className="text-white">Role</Label>
                  <Select value={role} onValueChange={setRole} required={!isLogin}>
                    <SelectTrigger className="bg-white/10 border-white/30 text-white">
                      <SelectValue placeholder="Select your role" />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-800 border-slate-600">
                      <SelectItem value="physician">Physician</SelectItem>
                      <SelectItem value="nurse">Nurse</SelectItem>
                      <SelectItem value="pa">Physician Assistant</SelectItem>
                      <SelectItem value="pharmacist">Pharmacist</SelectItem>
                      <SelectItem value="biller">Biller</SelectItem>
                      <SelectItem value="coder">Medical Coder</SelectItem>
                      <SelectItem value="admin">Administrator</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Button 
                  type="submit" 
                  className="w-full bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-white font-semibold"
                  disabled={loading}
                >
                  {loading ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      {isLogin ? 'Signing In...' : 'Creating Account...'}
                    </div>
                  ) : (
                    isLogin ? 'Sign In' : 'Create Account'
                  )}
                </Button>
              </form>
              
              <div className="mt-6 text-center">
                <button
                  type="button"
                  onClick={() => setIsLogin(!isLogin)}
                  className="text-white/70 hover:text-white text-sm"
                >
                  {isLogin ? "Don't have an account? Sign up" : "Already have an account? Sign in"}
                </button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AuthForm;
