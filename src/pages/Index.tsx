
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Brain, 
  Stethoscope, 
  Activity, 
  Building2, 
  ArrowRight,
  Sparkles,
  Shield,
  Zap
} from 'lucide-react';

const Index = () => {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleLogin = () => {
    setIsLoggedIn(true);
    navigate('/dashboard');
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
  };

  const features = [
    {
      icon: Brain,
      title: "AI Clinical Assistant",
      description: "Advanced AI-powered clinical decision support and diagnosis assistance",
      badge: "AI",
      color: "purple"
    },
    {
      icon: Stethoscope,
      title: "Smart EMR Integration",
      description: "Seamless electronic medical records with intelligent data insights",
      badge: "CORE",
      color: "blue"
    },
    {
      icon: Activity,
      title: "Real-time Monitoring",
      description: "Live patient tracking and clinical workflow optimization",
      badge: "LIVE",
      color: "green"
    }
  ];

  if (isLoggedIn) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-6">
        <Card className="w-full max-w-2xl bg-white/90 backdrop-blur-sm border border-blue-200 shadow-xl">
          <CardHeader className="text-center pb-6">
            <div className="flex items-center justify-center gap-3 mb-4">
              <img 
                src="/lovable-uploads/d05aa5d2-561a-436f-ae8c-de68ab1b3e88.png" 
                alt="Virtualis" 
                className="w-12 h-12 rounded-xl shadow-lg"
              />
              <div>
                <CardTitle className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  Virtualis One™
                </CardTitle>
                <p className="text-slate-600 text-sm font-medium">Healthcare AI Platform</p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="text-center space-y-6">
            <p className="text-slate-700 text-lg leading-relaxed">
              Welcome to the future of healthcare technology. You are successfully logged in to the Virtualis platform.
            </p>
            <div className="flex gap-3 justify-center">
              <Button 
                onClick={() => navigate('/dashboard')}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <Building2 className="h-5 w-5 mr-2" />
                Go to Dashboard
              </Button>
              <Button 
                onClick={handleLogout}
                variant="outline"
                className="border-slate-300 text-slate-700 hover:bg-slate-100 px-6 py-3 rounded-xl shadow-md hover:shadow-lg transition-all duration-300"
              >
                Sign Out
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-blue-100">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-blue-200 shadow-sm">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img 
                src="/lovable-uploads/d05aa5d2-561a-436f-ae8c-de68ab1b3e88.png" 
                alt="Virtualis" 
                className="w-10 h-10 rounded-lg shadow-md"
              />
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  Virtualis One™
                </h1>
                <p className="text-slate-600 text-sm">Healthcare AI Platform</p>
              </div>
            </div>
            <Button 
              onClick={handleLogin}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
            >
              Sign In
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="container mx-auto px-6 py-16">
        <div className="text-center mb-16">
          <Badge className="mb-6 bg-blue-100 text-blue-700 border border-blue-200 px-4 py-2 rounded-full shadow-sm">
            <Sparkles className="h-4 w-4 mr-2" />
            Next-Generation Healthcare Technology
          </Badge>
          
          <h2 className="text-5xl font-bold text-slate-800 mb-6 leading-tight">
            Intelligent Healthcare
            <span className="block bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Powered by AI
            </span>
          </h2>
          
          <p className="text-xl text-slate-600 mb-12 max-w-3xl mx-auto leading-relaxed">
            Transform your hospital operations with our comprehensive AI-driven platform. 
            From clinical decision support to operational efficiency, Virtualis One™ delivers 
            the future of healthcare technology today.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button 
              onClick={handleLogin}
              size="lg"
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
            >
              <ArrowRight className="h-5 w-5 mr-2" />
              Get Started
            </Button>
            <Button 
              variant="outline"
              size="lg"
              className="border-slate-300 text-slate-700 hover:bg-white px-8 py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
            >
              Learn More
            </Button>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {features.map((feature, index) => (
            <Card key={index} className="bg-white/70 backdrop-blur-sm border border-blue-200 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
              <CardHeader className="text-center pb-4">
                <div className={`w-16 h-16 mx-auto rounded-2xl flex items-center justify-center mb-4 shadow-lg ${
                  feature.color === 'purple' ? 'bg-purple-100' :
                  feature.color === 'blue' ? 'bg-blue-100' : 'bg-green-100'
                }`}>
                  <feature.icon className={`h-8 w-8 ${
                    feature.color === 'purple' ? 'text-purple-600' :
                    feature.color === 'blue' ? 'text-blue-600' : 'text-green-600'
                  }`} />
                </div>
                <div className="flex items-center justify-center gap-2 mb-2">
                  <CardTitle className="text-xl text-slate-800">{feature.title}</CardTitle>
                  <Badge className={`text-xs px-2 py-1 rounded-full ${
                    feature.color === 'purple' ? 'bg-purple-100 text-purple-700 border-purple-200' :
                    feature.color === 'blue' ? 'bg-blue-100 text-blue-700 border-blue-200' : 'bg-green-100 text-green-700 border-green-200'
                  }`}>
                    {feature.badge}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-slate-600 leading-relaxed">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* CTA Section */}
        <Card className="bg-gradient-to-r from-blue-600 to-indigo-600 border-0 shadow-2xl">
          <CardContent className="text-center py-12">
            <div className="flex items-center justify-center mb-6">
              <Shield className="h-12 w-12 text-white mr-4" />
              <Zap className="h-12 w-12 text-white" />
            </div>
            <h3 className="text-3xl font-bold text-white mb-4">
              Ready to Transform Your Hospital?
            </h3>
            <p className="text-blue-100 text-lg mb-8 max-w-2xl mx-auto">
              Join leading healthcare institutions using Virtualis One™ to improve patient outcomes 
              and operational efficiency through intelligent automation.
            </p>
            <Button 
              onClick={handleLogin}
              size="lg"
              className="bg-white text-blue-600 hover:bg-blue-50 px-8 py-4 rounded-xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 font-semibold"
            >
              Start Your Journey
              <ArrowRight className="h-5 w-5 ml-2" />
            </Button>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default Index;
