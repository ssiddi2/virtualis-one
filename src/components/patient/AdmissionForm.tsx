
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { UserPlus, Save, ArrowLeft, User, Heart, FileText, Shield } from "lucide-react";

const AdmissionForm = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    dateOfBirth: "",
    gender: "",
    phone: "",
    email: "",
    address: "",
    emergencyContact: "",
    emergencyPhone: "",
    chiefComplaint: "",
    provider: "",
    acuity: "",
    allergies: "",
    medications: "",
    medicalHistory: ""
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Simulate admission process
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast({
        title: "Patient Admitted Successfully",
        description: `${formData.firstName} ${formData.lastName} has been admitted to the system`,
      });
      
      navigate("/");
    } catch (error) {
      toast({
        title: "Admission Failed",
        description: "Please try again or contact IT support",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <div className="min-h-screen bg-[#0a1628] p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="glass-card p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                onClick={() => navigate("/")}
                variant="outline"
                className="glass-nav-item border-white/20 hover:border-virtualis-gold/50"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Button>
              <div className="flex items-center gap-3">
                <UserPlus className="h-8 w-8 text-virtualis-gold" />
                <div>
                  <h1 className="text-3xl font-bold gradient-text tech-font">Patient Admission</h1>
                  <p className="text-white/70 tech-font">Complete patient information and admission details</p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="glass-badge success flex items-center gap-2">
                <Shield className="h-4 w-4" />
                <span className="tech-font">HIPAA SECURE</span>
              </div>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Demographics */}
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="text-white tech-font flex items-center gap-2">
                <User className="h-5 w-5 text-virtualis-gold" />
                Patient Demographics
              </CardTitle>
              <CardDescription className="text-white/70">Basic patient information and contact details</CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName" className="text-white font-medium tech-font">First Name *</Label>
                <Input
                  id="firstName"
                  value={formData.firstName}
                  onChange={(e) => handleInputChange("firstName", e.target.value)}
                  className="glass-input"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="lastName" className="text-white font-medium tech-font">Last Name *</Label>
                <Input
                  id="lastName"
                  value={formData.lastName}
                  onChange={(e) => handleInputChange("lastName", e.target.value)}
                  className="glass-input"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="dateOfBirth" className="text-white font-medium tech-font">Date of Birth *</Label>
                <Input
                  id="dateOfBirth"
                  type="date"
                  value={formData.dateOfBirth}
                  onChange={(e) => handleInputChange("dateOfBirth", e.target.value)}
                  className="glass-input"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="gender" className="text-white font-medium tech-font">Gender *</Label>
                <Select value={formData.gender} onValueChange={(value) => handleInputChange("gender", value)}>
                  <SelectTrigger className="glass-input">
                    <SelectValue placeholder="Select gender" />
                  </SelectTrigger>
                  <SelectContent className="bg-virtualis-navy border-white/20">
                    <SelectItem value="male" className="text-white hover:bg-white/10">Male</SelectItem>
                    <SelectItem value="female" className="text-white hover:bg-white/10">Female</SelectItem>
                    <SelectItem value="other" className="text-white hover:bg-white/10">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="phone" className="text-white font-medium tech-font">Phone Number</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => handleInputChange("phone", e.target.value)}
                  className="glass-input"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email" className="text-white font-medium tech-font">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  className="glass-input"
                />
              </div>
              
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="address" className="text-white font-medium tech-font">Home Address</Label>
                <Input
                  id="address"
                  value={formData.address}
                  onChange={(e) => handleInputChange("address", e.target.value)}
                  className="glass-input"
                />
              </div>
            </CardContent>
          </Card>

          {/* Emergency Contact */}
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="text-white tech-font flex items-center gap-2">
                <Heart className="h-5 w-5 text-red-400" />
                Emergency Contact Information
              </CardTitle>
              <CardDescription className="text-white/70">Person to contact in case of emergency</CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="emergencyContact" className="text-white font-medium tech-font">Contact Name</Label>
                <Input
                  id="emergencyContact"
                  value={formData.emergencyContact}
                  onChange={(e) => handleInputChange("emergencyContact", e.target.value)}
                  className="glass-input"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="emergencyPhone" className="text-white font-medium tech-font">Contact Phone</Label>
                <Input
                  id="emergencyPhone"
                  type="tel"
                  value={formData.emergencyPhone}
                  onChange={(e) => handleInputChange("emergencyPhone", e.target.value)}
                  className="glass-input"
                />
              </div>
            </CardContent>
          </Card>

          {/* Clinical Information */}
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="text-white tech-font flex items-center gap-2">
                <FileText className="h-5 w-5 text-virtualis-gold" />
                Clinical Information & Care Assignment
              </CardTitle>
              <CardDescription className="text-white/70">Medical details and provider assignment</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="chiefComplaint" className="text-white font-medium tech-font">Chief Complaint *</Label>
                <Textarea
                  id="chiefComplaint"
                  placeholder="Describe the main reason for this visit or admission..."
                  value={formData.chiefComplaint}
                  onChange={(e) => handleInputChange("chiefComplaint", e.target.value)}
                  className="glass-input min-h-[100px]"
                  required
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="provider" className="text-white font-medium tech-font">Attending Provider *</Label>
                  <Select value={formData.provider} onValueChange={(value) => handleInputChange("provider", value)}>
                    <SelectTrigger className="glass-input">
                      <SelectValue placeholder="Select attending provider" />
                    </SelectTrigger>
                    <SelectContent className="bg-virtualis-navy border-white/20">
                      <SelectItem value="dr-smith" className="text-white hover:bg-white/10">Dr. Sarah Smith - Cardiology</SelectItem>
                      <SelectItem value="dr-johnson" className="text-white hover:bg-white/10">Dr. Michael Johnson - Internal Medicine</SelectItem>
                      <SelectItem value="dr-williams" className="text-white hover:bg-white/10">Dr. Emily Williams - Emergency Medicine</SelectItem>
                      <SelectItem value="dr-brown" className="text-white hover:bg-white/10">Dr. David Brown - Surgery</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="acuity" className="text-white font-medium tech-font">Acuity Level *</Label>
                  <Select value={formData.acuity} onValueChange={(value) => handleInputChange("acuity", value)}>
                    <SelectTrigger className="glass-input">
                      <SelectValue placeholder="Select patient acuity" />
                    </SelectTrigger>
                    <SelectContent className="bg-virtualis-navy border-white/20">
                      <SelectItem value="low" className="text-white hover:bg-white/10">Low Acuity (3-4) - Stable</SelectItem>
                      <SelectItem value="medium" className="text-white hover:bg-white/10">Medium Acuity (2) - Monitoring Required</SelectItem>
                      <SelectItem value="high" className="text-white hover:bg-white/10">High Acuity (1) - Critical Care</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="allergies" className="text-white font-medium tech-font">Known Allergies</Label>
                <Textarea
                  id="allergies"
                  placeholder="List any known allergies (medications, foods, environmental)..."
                  value={formData.allergies}
                  onChange={(e) => handleInputChange("allergies", e.target.value)}
                  className="glass-input"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="medications" className="text-white font-medium tech-font">Current Medications</Label>
                <Textarea
                  id="medications"
                  placeholder="List current medications with dosages and frequencies..."
                  value={formData.medications}
                  onChange={(e) => handleInputChange("medications", e.target.value)}
                  className="glass-input"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="medicalHistory" className="text-white font-medium tech-font">Medical History</Label>
                <Textarea
                  id="medicalHistory"
                  placeholder="Relevant past medical history, surgeries, chronic conditions..."
                  value={formData.medicalHistory}
                  onChange={(e) => handleInputChange("medicalHistory", e.target.value)}
                  className="glass-input"
                />
              </div>
            </CardContent>
          </Card>

          {/* Submit Actions */}
          <Card className="glass-card">
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <Button
                  type="submit"
                  disabled={loading}
                  className="glass-button flex-1 md:flex-none"
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Processing Admission...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4 mr-2" />
                      Admit Patient to System
                    </>
                  )}
                </Button>
                
                <Button
                  type="button"
                  onClick={() => navigate("/")}
                  className="glass-nav-item border-white/20 hover:border-virtualis-gold/50 text-white"
                >
                  Cancel Admission
                </Button>
              </div>
            </CardContent>
          </Card>
        </form>
      </div>
    </div>
  );
};

export default AdmissionForm;
