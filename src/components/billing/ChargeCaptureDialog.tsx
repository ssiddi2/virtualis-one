
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  DollarSign, 
  Search, 
  Plus, 
  FileText,
  Stethoscope,
  Activity,
  Heart,
  Brain
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ChargeCaptureDialogProps {
  patientId: string;
  patientName: string;
  trigger?: React.ReactNode;
}

const ChargeCaptureDialog = ({ patientId, patientName, trigger }: ChargeCaptureDialogProps) => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCharges, setSelectedCharges] = useState<any[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  // Mock CPT codes and billing levels data
  const cptCodes = [
    {
      code: '99213',
      description: 'Office visit - established patient, low complexity',
      category: 'E&M',
      level: 'Level 3',
      rvu: 1.3,
      fee: 125.00,
      icon: Stethoscope
    },
    {
      code: '99214',
      description: 'Office visit - established patient, moderate complexity',
      category: 'E&M',
      level: 'Level 4',
      rvu: 1.92,
      fee: 185.00,
      icon: Stethoscope
    },
    {
      code: '99215',
      description: 'Office visit - established patient, high complexity',
      category: 'E&M',
      level: 'Level 5',
      rvu: 2.8,
      fee: 250.00,
      icon: Stethoscope
    },
    {
      code: '93000',
      description: 'Electrocardiogram, routine ECG with interpretation',
      category: 'Cardiology',
      level: 'Diagnostic',
      rvu: 0.17,
      fee: 35.00,
      icon: Heart
    },
    {
      code: '36415',
      description: 'Collection of venous blood by venipuncture',
      category: 'Laboratory',
      level: 'Basic',
      rvu: 0.17,
      fee: 25.00,
      icon: Activity
    },
    {
      code: '80053',
      description: 'Comprehensive metabolic panel',
      category: 'Laboratory',
      level: 'Panel',
      rvu: 0.0,
      fee: 45.00,
      icon: Activity
    },
    {
      code: '70450',
      description: 'CT scan of head without contrast',
      category: 'Radiology',
      level: 'Advanced',
      rvu: 1.26,
      fee: 320.00,
      icon: Brain
    },
    {
      code: '71020',
      description: 'Chest X-ray, 2 views',
      category: 'Radiology',
      level: 'Basic',
      rvu: 0.22,
      fee: 85.00,
      icon: Activity
    }
  ];

  const billingLevels = [
    {
      level: 'Level 1',
      description: 'Minimal complexity, straightforward',
      duration: '10-15 min',
      criteria: 'Simple problem, minimal risk',
      examples: ['Follow-up visits', 'Simple procedures']
    },
    {
      level: 'Level 2',
      description: 'Low complexity, limited evaluation',
      duration: '15-20 min',
      criteria: 'Low risk, limited data review',
      examples: ['Minor illness', 'Routine check-ups']
    },
    {
      level: 'Level 3',
      description: 'Moderate complexity, detailed evaluation',
      duration: '20-30 min',
      criteria: 'Moderate risk, multiple problems',
      examples: ['Chronic conditions', 'Multiple medications']
    },
    {
      level: 'Level 4',
      description: 'High complexity, comprehensive evaluation',
      duration: '30-45 min',
      criteria: 'High risk, extensive data review',
      examples: ['Complex diagnoses', 'Multiple comorbidities']
    },
    {
      level: 'Level 5',
      description: 'Highest complexity, extensive evaluation',
      duration: '45+ min',
      criteria: 'Highest risk, comprehensive management',
      examples: ['Critical care', 'Complex procedures']
    }
  ];

  const filteredCodes = cptCodes.filter(code =>
    code.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
    code.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    code.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddCharge = (cptCode: any) => {
    const isAlreadySelected = selectedCharges.some(charge => charge.code === cptCode.code);
    if (!isAlreadySelected) {
      setSelectedCharges([...selectedCharges, { ...cptCode, quantity: 1 }]);
      toast({
        title: "Charge Added",
        description: `${cptCode.code} - ${cptCode.description} added to charges`,
      });
    }
  };

  const handleRemoveCharge = (codeToRemove: string) => {
    setSelectedCharges(selectedCharges.filter(charge => charge.code !== codeToRemove));
  };

  const handleSubmitCharges = () => {
    if (selectedCharges.length === 0) {
      toast({
        title: "No Charges Selected",
        description: "Please select at least one charge before submitting.",
        variant: "destructive"
      });
      return;
    }

    const totalAmount = selectedCharges.reduce((sum, charge) => sum + (charge.fee * charge.quantity), 0);
    
    toast({
      title: "Charges Submitted",
      description: `${selectedCharges.length} charges totaling $${totalAmount.toFixed(2)} submitted for ${patientName}`,
    });
    
    setSelectedCharges([]);
    setIsOpen(false);
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'E&M': return 'bg-blue-600/20 text-blue-300 border-blue-600/30';
      case 'Cardiology': return 'bg-red-600/20 text-red-300 border-red-600/30';
      case 'Laboratory': return 'bg-green-600/20 text-green-300 border-green-600/30';
      case 'Radiology': return 'bg-purple-600/20 text-purple-300 border-purple-600/30';
      default: return 'bg-gray-600/20 text-gray-300 border-gray-600/30';
    }
  };

  const defaultTrigger = (
    <Button className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700">
      <DollarSign className="h-4 w-4" />
      Charge Capture
    </Button>
  );

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {trigger || defaultTrigger}
      </DialogTrigger>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto bg-[#1a2332] border-[#2a3441] text-white">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-white">
            Charge Capture - {patientName}
          </DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="cpt-codes" className="w-full">
          <TabsList className="grid w-full grid-cols-3 bg-slate-800/50 border-slate-700">
            <TabsTrigger value="cpt-codes" className="data-[state=active]:bg-slate-700 data-[state=active]:text-white text-slate-300">
              CPT Codes
            </TabsTrigger>
            <TabsTrigger value="billing-levels" className="data-[state=active]:bg-slate-700 data-[state=active]:text-white text-slate-300">
              Billing Levels
            </TabsTrigger>
            <TabsTrigger value="selected-charges" className="data-[state=active]:bg-slate-700 data-[state=active]:text-white text-slate-300">
              Selected Charges ({selectedCharges.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="cpt-codes" className="space-y-4">
            <div className="flex gap-4 items-center">
              <div className="flex-1 relative">
                <Search className="h-4 w-4 absolute left-3 top-3 text-slate-400" />
                <Input
                  placeholder="Search CPT codes, descriptions, or categories..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-slate-700 border-slate-600 text-white"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-96 overflow-y-auto">
              {filteredCodes.map((cptCode) => {
                const IconComponent = cptCode.icon;
                const isSelected = selectedCharges.some(charge => charge.code === cptCode.code);
                
                return (
                  <Card key={cptCode.code} className="bg-slate-800/50 border-slate-700 hover:bg-slate-700/50 transition-colors">
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <IconComponent className="h-5 w-5 text-blue-400" />
                          <div>
                            <CardTitle className="text-lg text-white">{cptCode.code}</CardTitle>
                            <Badge className={getCategoryColor(cptCode.category)}>{cptCode.category}</Badge>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-lg font-bold text-green-400">${cptCode.fee}</div>
                          <div className="text-sm text-slate-400">{cptCode.rvu} RVU</div>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-slate-300 text-sm mb-3">{cptCode.description}</p>
                      <div className="flex items-center justify-between">
                        <Badge variant="outline" className="border-slate-600 text-slate-300">
                          {cptCode.level}
                        </Badge>
                        <Button
                          size="sm"
                          onClick={() => handleAddCharge(cptCode)}
                          disabled={isSelected}
                          className={isSelected ? "bg-green-600 hover:bg-green-700" : "bg-blue-600 hover:bg-blue-700"}
                        >
                          <Plus className="h-3 w-3 mr-1" />
                          {isSelected ? "Added" : "Add Charge"}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>

          <TabsContent value="billing-levels" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {billingLevels.map((level, index) => (
                <Card key={level.level} className="bg-slate-800/50 border-slate-700">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center gap-2">
                      <FileText className="h-5 w-5 text-blue-400" />
                      {level.level}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <p className="text-slate-300 font-medium">{level.description}</p>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2">
                        <span className="text-slate-400">Duration:</span>
                        <span className="text-white">{level.duration}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-slate-400">Criteria:</span>
                        <span className="text-white">{level.criteria}</span>
                      </div>
                      <div>
                        <span className="text-slate-400">Examples:</span>
                        <ul className="mt-1 ml-4 text-white">
                          {level.examples.map((example, idx) => (
                            <li key={idx} className="text-sm">• {example}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="selected-charges" className="space-y-4">
            {selectedCharges.length > 0 ? (
              <>
                <div className="space-y-3 max-h-64 overflow-y-auto">
                  {selectedCharges.map((charge) => (
                    <div key={charge.code} className="flex items-center justify-between p-4 bg-slate-800/50 border border-slate-700 rounded-lg">
                      <div className="flex items-center gap-3">
                        <charge.icon className="h-5 w-5 text-blue-400" />
                        <div>
                          <div className="font-medium text-white">{charge.code}</div>
                          <div className="text-sm text-slate-400">{charge.description}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <div className="text-lg font-bold text-green-400">${charge.fee}</div>
                          <div className="text-sm text-slate-400">Qty: {charge.quantity}</div>
                        </div>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleRemoveCharge(charge.code)}
                          className="border-red-600 text-red-400 hover:bg-red-600/20"
                        >
                          Remove
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="border-t border-slate-700 pt-4">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-lg font-medium text-white">Total Amount:</span>
                    <span className="text-2xl font-bold text-green-400">
                      ${selectedCharges.reduce((sum, charge) => sum + (charge.fee * charge.quantity), 0).toFixed(2)}
                    </span>
                  </div>
                  <Button
                    onClick={handleSubmitCharges}
                    className="w-full bg-green-600 hover:bg-green-700"
                  >
                    Submit Charges
                  </Button>
                </div>
              </>
            ) : (
              <div className="text-center py-8">
                <DollarSign className="h-16 w-16 text-slate-400 mx-auto mb-4" />
                <p className="text-slate-400">No charges selected</p>
                <p className="text-sm text-slate-500">Add charges from the CPT Codes tab</p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default ChargeCaptureDialog;
