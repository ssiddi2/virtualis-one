
import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useAuth } from './AuthProvider'
import { Stethoscope, Shield, UserPlus, LogIn } from 'lucide-react'

const AuthForm = () => {
  const { signIn, signUp, loading } = useAuth()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const [signInData, setSignInData] = useState({
    email: '',
    password: ''
  })

  const [signUpData, setSignUpData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
    role: 'doctor'
  })

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    try {
      await signIn(signInData.email, signInData.password)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (signUpData.password !== signUpData.confirmPassword) {
      alert('Passwords do not match')
      return
    }
    
    setIsSubmitting(true)
    
    try {
      await signUp(signUpData.email, signUpData.password, {
        first_name: signUpData.firstName,
        last_name: signUpData.lastName,
        role: signUpData.role
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a1628] flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#0a1628] flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <img 
            src="/lovable-uploads/c61057eb-57cd-4ce6-89ca-b6ee43ac66a4.png" 
            alt="Virtualis One™" 
            className="h-20 w-auto mx-auto mb-6"
          />
          <h1 className="text-3xl font-bold gradient-text tech-font">
            VIRTUALIS ONE™
          </h1>
          <p className="text-white/80 text-lg tech-font mt-2">
            Healthcare Intelligence Platform
          </p>
        </div>

        <Card className="glass-card">
          <CardHeader className="space-y-1">
            <div className="flex items-center gap-2 mb-4">
              <Shield className="h-5 w-5 text-virtualis-gold" />
              <CardTitle className="text-white tech-font">Secure Access</CardTitle>
            </div>
            <CardDescription className="text-white/70">
              Sign in to access your healthcare management system
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            <Tabs defaultValue="signin" className="w-full">
              <TabsList className="grid w-full grid-cols-2 glass-nav-item">
                <TabsTrigger value="signin" className="tech-font">
                  <LogIn className="h-4 w-4 mr-2" />
                  Sign In
                </TabsTrigger>
                <TabsTrigger value="signup" className="tech-font">
                  <UserPlus className="h-4 w-4 mr-2" />
                  Sign Up
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="signin">
                <form onSubmit={handleSignIn} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-white tech-font">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={signInData.email}
                      onChange={(e) => setSignInData({...signInData, email: e.target.value})}
                      className="glass-input tech-font"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password" className="text-white tech-font">Password</Label>
                    <Input
                      id="password"
                      type="password"
                      value={signInData.password}
                      onChange={(e) => setSignInData({...signInData, password: e.target.value})}
                      className="glass-input tech-font"
                      required
                    />
                  </div>
                  <Button
                    type="submit"
                    className="w-full glass-button tech-font"
                    disabled={isSubmitting}
                  >
                    <Stethoscope className="h-4 w-4 mr-2" />
                    {isSubmitting ? 'Signing In...' : 'Sign In'}
                  </Button>
                </form>
              </TabsContent>
              
              <TabsContent value="signup">
                <form onSubmit={handleSignUp} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName" className="text-white tech-font">First Name</Label>
                      <Input
                        id="firstName"
                        value={signUpData.firstName}
                        onChange={(e) => setSignUpData({...signUpData, firstName: e.target.value})}
                        className="glass-input tech-font"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName" className="text-white tech-font">Last Name</Label>
                      <Input
                        id="lastName"
                        value={signUpData.lastName}
                        onChange={(e) => setSignUpData({...signUpData, lastName: e.target.value})}
                        className="glass-input tech-font"
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="role" className="text-white tech-font">Role</Label>
                    <Select value={signUpData.role} onValueChange={(value) => setSignUpData({...signUpData, role: value})}>
                      <SelectTrigger className="glass-input tech-font">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="glass-card border-white/20">
                        <SelectItem value="doctor" className="text-white tech-font">Doctor</SelectItem>
                        <SelectItem value="nurse" className="text-white tech-font">Nurse</SelectItem>
                        <SelectItem value="technician" className="text-white tech-font">Technician</SelectItem>
                        <SelectItem value="pharmacist" className="text-white tech-font">Pharmacist</SelectItem>
                        <SelectItem value="receptionist" className="text-white tech-font">Receptionist</SelectItem>
                        <SelectItem value="admin" className="text-white tech-font">Administrator</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="signupEmail" className="text-white tech-font">Email</Label>
                    <Input
                      id="signupEmail"
                      type="email"
                      value={signUpData.email}
                      onChange={(e) => setSignUpData({...signUpData, email: e.target.value})}
                      className="glass-input tech-font"
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="signupPassword" className="text-white tech-font">Password</Label>
                    <Input
                      id="signupPassword"
                      type="password"
                      value={signUpData.password}
                      onChange={(e) => setSignUpData({...signUpData, password: e.target.value})}
                      className="glass-input tech-font"
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword" className="text-white tech-font">Confirm Password</Label>
                    <Input
                      id="confirmPassword"
                      type="password"
                      value={signUpData.confirmPassword}
                      onChange={(e) => setSignUpData({...signUpData, confirmPassword: e.target.value})}
                      className="glass-input tech-font"
                      required
                    />
                  </div>
                  
                  <Button
                    type="submit"
                    className="w-full glass-button tech-font"
                    disabled={isSubmitting}
                  >
                    <UserPlus className="h-4 w-4 mr-2" />
                    {isSubmitting ? 'Creating Account...' : 'Create Account'}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
        
        <div className="text-center text-white/60 text-sm tech-font">
          <p>🔒 HIPAA Compliant • SOC 2 Certified • 256-bit Encryption</p>
        </div>
      </div>
    </div>
  )
}

export default AuthForm
