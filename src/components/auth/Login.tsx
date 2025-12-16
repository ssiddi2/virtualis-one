
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/EnterpriseAuthContext";
import { useNavigate } from "react-router-dom";
import { User, Lock, Shield, Sparkles, AlertCircle } from "lucide-react";
import LoadingSpinner from "@/components/ui/loading-spinner";

interface LoginProps {
  onLogin: (email: string, password: string, role: string) => void;
}

const Login = ({ onLogin }: LoginProps) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [role, setRole] = useState("physician");
  const [loading, setLoading] = useState(false);
  const [isCreatingDemo, setIsCreatingDemo] = useState(false);
  const { toast } = useToast();
  const { signUp } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password || (!isLogin && (!firstName || !lastName))) {
      toast({
        title: "Missing Information",
        description: "Please complete all required fields",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    
    try {
      if (isLogin) {
        try {
          await onLogin(email, password, role);
          toast({
            title: "Access Granted",
            description: `Welcome to VirtualisOne`,
          });
        } catch (error: any) {
          // Check if it's the demo account that failed
          if (email === "dr.siddiqi@livemedhealth.com") {
            toast({
              title: "Demo Account Not Found",
              description: "Click 'Continue with Demo Account' to create it automatically",
              variant: "destructive",
            });
          } else {
            toast({
              title: "Authentication Failed", 
              description: error?.message || "Invalid email or password. Please try again.",
              variant: "destructive",
            });
          }
          setLoading(false);
        }
      } else {
        const result = await signUp(email, password, firstName, lastName, role);
        if (!result.success) {
          toast({
            title: "Sign Up Failed",
            description: result.error || "Unable to create account. Please try again.",
            variant: "destructive",
          });
        } else {
          toast({
            title: "Account Created",
            description: "Your account has been created successfully. Please sign in.",
          });
          setIsLogin(true);
          setEmail("");
          setPassword("");
        }
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error?.message || "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDemoAccount = () => {
    setIsCreatingDemo(true);
    // Navigate to the create-user tool with demo credentials
    navigate('/tools/create-user?email=dr.siddiqi@livemedhealth.com&password=123456&first_name=Dr.&last_name=Siddiqi&role=physician');
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
          <div className="clinical-card p-8">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="flex items-center gap-2 justify-center mb-4">
                <Shield className="h-5 w-5 text-virtualis-gold" />
                <h1 className="text-2xl font-bold text-white tech-font">
                  VirtualisOne
                </h1>
              </div>
              <p className="text-white/70 tech-font">
                {isLogin ? 'Secure Healthcare Portal Access' : 'Create Your Account'}
              </p>
            </div>

            {/* Auth Toggle */}
            <div className="flex mb-6">
              <button
                type="button"
                onClick={() => setIsLogin(true)}
                className={`flex-1 py-2 px-4 text-sm font-medium rounded-l-lg transition-colors ${
                  isLogin 
                    ? 'bg-virtualis-gold text-white' 
                    : 'bg-white/10 text-white/70 hover:bg-white/20'
                }`}
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => setIsLogin(false)}
                className={`flex-1 py-2 px-4 text-sm font-medium rounded-r-lg transition-colors ${
                  !isLogin 
                    ? 'bg-virtualis-gold text-white' 
                    : 'bg-white/10 text-white/70 hover:bg-white/20'
                }`}
              >
                Create Account
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              {!isLogin && (
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName" className="text-white tech-font">First Name</Label>
                    <Input
                      id="firstName"
                      type="text"
                      placeholder="First name"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      className="bg-white/10 border border-white/30 text-white placeholder:text-white/60 rounded-lg tech-font h-12"
                      required={!isLogin}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName" className="text-white tech-font">Last Name</Label>
                    <Input
                      id="lastName"
                      type="text"
                      placeholder="Last name"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      className="bg-white/10 border border-white/30 text-white placeholder:text-white/60 rounded-lg tech-font h-12"
                      required={!isLogin}
                    />
                  </div>
                </div>
              )}

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
                    className="bg-white/10 border border-white/30 text-white placeholder:text-white/60 rounded-lg tech-font pl-10 h-12"
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
                    className="bg-white/10 border border-white/30 text-white placeholder:text-white/60 rounded-lg tech-font pl-10 h-12"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="role" className="text-white tech-font">Role</Label>
                <Select value={role} onValueChange={setRole} required>
                  <SelectTrigger className="bg-white/10 border border-white/30 text-white rounded-lg tech-font h-12">
                    <SelectValue placeholder="Select your role" />
                  </SelectTrigger>
                  <SelectContent className="clinical-card border-white/20">
                    <SelectItem value="physician" className="text-white tech-font">Physician</SelectItem>
                    <SelectItem value="nurse" className="text-white tech-font">Nurse</SelectItem>
                    <SelectItem value="biller" className="text-white tech-font">Billing Manager</SelectItem>
                    <SelectItem value="admin" className="text-white tech-font">Administrator</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button 
                type="submit" 
                className="w-full bg-blue-600 hover:bg-blue-700 text-white tech-font h-12 text-base font-semibold mt-6"
                disabled={loading || isCreatingDemo}
              >
                {loading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    {isLogin ? 'Signing In...' : 'Creating Account...'}
                  </div>
                ) : (
                  isLogin ? "Sign In" : "Create Account"
                )}
              </Button>
            </form>

            {/* Demo Account Quick Access - only show for login */}
            {isLogin && (
              <>
                <div className="relative mt-6">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t border-white/20" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-transparent px-2 text-white/60 tech-font">Or</span>
                  </div>
                </div>

                <Button 
                  type="button"
                  onClick={handleDemoAccount}
                  className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white tech-font h-12 text-base font-semibold mt-4 flex items-center justify-center gap-2"
                  disabled={isCreatingDemo || loading}
                >
                  {isCreatingDemo ? (
                    <LoadingSpinner size="sm" text="Creating demo account..." />
                  ) : (
                    <>
                      <Sparkles className="h-5 w-5" />
                      Continue with Demo Account
                    </>
                  )}
                </Button>

                <div className="mt-6 p-4 bg-white/5 rounded-lg border border-white/10">
                  <div className="flex items-start gap-2 mb-3">
                    <AlertCircle className="h-4 w-4 text-virtualis-gold mt-0.5" />
                    <p className="text-white/70 text-xs tech-font">
                      Demo Account Credentials:
                    </p>
                  </div>
                  
                  <div className="space-y-2 text-xs">
                    <div className="flex items-center gap-2 text-white/50">
                      <User className="h-3 w-3" />
                      <span>dr.siddiqi@livemedhealth.com</span>
                    </div>
                    <div className="flex items-center gap-2 text-white/50">
                      <Lock className="h-3 w-3" />
                      <span>Password: 123456</span>
                    </div>
                    <div className="flex items-center gap-2 text-white/50">
                      <Shield className="h-3 w-3" />
                      <span>Role: Physician</span>
                    </div>
                  </div>
                </div>
              </>
            )}
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
