
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { TestTube, Clock, AlertCircle } from 'lucide-react';

interface LabOrderFormProps {
  patientId: string;
  hospitalId: string;
  onSubmit: (data: any) => void;
}

const LabOrderForm = ({ patientId, hospitalId, onSubmit }: LabOrderFormProps) => {
  const [selectedTests, setSelectedTests] = useState<string[]>([]);
  const [formData, setFormData] = useState({
    priority: 'routine',
    clinicalInfo: '',
    specimenType: '',
    collectionTime: '',
    fastingRequired: false,
    specialInstructions: ''
  });

  const labCategories = {
    'Basic Metabolic Panel': [
      'Glucose', 'BUN', 'Creatinine', 'Sodium', 'Potassium', 'Chloride', 'CO2'
    ],
    'Complete Blood Count': [
      'WBC', 'RBC', 'Hemoglobin', 'Hematocrit', 'Platelets', 'Differential'
    ],
    'Liver Function': [
      'ALT', 'AST', 'Bilirubin Total', 'Bilirubin Direct', 'Alkaline Phosphatase', 'Albumin'
    ],
    'Lipid Panel': [
      'Total Cholesterol', 'HDL', 'LDL', 'Triglycerides'
    ],
    'Cardiac Markers': [
      'Troponin I', 'CK-MB', 'BNP', 'Pro-BNP'
    ],
    'Coagulation': [
      'PT/INR', 'PTT', 'Fibrinogen', 'D-Dimer'
    ],
    'Inflammatory Markers': [
      'ESR', 'CRP', 'Procalcitonin'
    ],
    'Cultures': [
      'Blood Culture', 'Urine Culture', 'Sputum Culture', 'Wound Culture'
    ]
  };

  const specimenTypes = [
    'Blood - Serum', 'Blood - Plasma', 'Blood - Whole Blood',
    'Urine - Random', 'Urine - 24 Hour', 'Urine - Clean Catch',
    'Stool', 'Sputum', 'CSF', 'Tissue', 'Swab'
  ];

  const handleTestToggle = (test: string) => {
    setSelectedTests(prev => 
      prev.includes(test) 
        ? prev.filter(t => t !== test)
        : [...prev, test]
    );
  };

  const handleCategorySelect = (category: string) => {
    const categoryTests = labCategories[category as keyof typeof labCategories];
    const allSelected = categoryTests.every(test => selectedTests.includes(test));
    
    if (allSelected) {
      // Deselect all tests in category
      setSelectedTests(prev => prev.filter(test => !categoryTests.includes(test)));
    } else {
      // Select all tests in category
      setSelectedTests(prev => {
        const newTests = categoryTests.filter(test => !prev.includes(test));
        return [...prev, ...newTests];
      });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (selectedTests.length === 0) {
      alert('Please select at least one test');
      return;
    }

    const orderData = {
      tests: selectedTests,
      ...formData,
      orderType: 'laboratory'
    };

    onSubmit(orderData);
    
    // Reset form
    setSelectedTests([]);
    setFormData({
      priority: 'routine',
      clinicalInfo: '',
      specimenType: '',
      collectionTime: '',
      fastingRequired: false,
      specialInstructions: ''
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TestTube className="h-5 w-5 text-green-500" />
          Laboratory Orders
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Test Selection */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label className="text-base font-semibold">Select Tests</Label>
              <Badge variant="outline">
                {selectedTests.length} tests selected
              </Badge>
            </div>

            <div className="space-y-4">
              {Object.entries(labCategories).map(([category, tests]) => {
                const categorySelected = tests.filter(test => selectedTests.includes(test)).length;
                const allSelected = categorySelected === tests.length;
                
                return (
                  <div key={category} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <button
                        type="button"
                        onClick={() => handleCategorySelect(category)}
                        className="flex items-center gap-2 text-left hover:text-blue-600"
                      >
                        <span className="font-medium">{category}</span>
                        {categorySelected > 0 && (
                          <Badge variant={allSelected ? "default" : "secondary"}>
                            {categorySelected}/{tests.length}
                          </Badge>
                        )}
                      </button>
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                      {tests.map((test) => (
                        <div key={test} className="flex items-center space-x-2">
                          <Checkbox
                            id={test}
                            checked={selectedTests.includes(test)}
                            onCheckedChange={() => handleTestToggle(test)}
                          />
                          <Label htmlFor={test} className="text-sm cursor-pointer">
                            {test}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Order Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="priority">Priority</Label>
              <Select value={formData.priority} onValueChange={(value) => setFormData(prev => ({ ...prev, priority: value }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="routine">Routine</SelectItem>
                  <SelectItem value="urgent">Urgent</SelectItem>
                  <SelectItem value="stat">STAT</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="specimen">Specimen Type</Label>
              <Select value={formData.specimenType} onValueChange={(value) => setFormData(prev => ({ ...prev, specimenType: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select specimen type" />
                </SelectTrigger>
                <SelectContent>
                  {specimenTypes.map((type) => (
                    <SelectItem key={type} value={type}>{type}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="collectionTime">Collection Time</Label>
              <Select value={formData.collectionTime} onValueChange={(value) => setFormData(prev => ({ ...prev, collectionTime: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="When to collect" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="now">Now</SelectItem>
                  <SelectItem value="am">Morning Draw</SelectItem>
                  <SelectItem value="fasting">Fasting (AM)</SelectItem>
                  <SelectItem value="peak">Peak Level</SelectItem>
                  <SelectItem value="trough">Trough Level</SelectItem>
                  <SelectItem value="scheduled">Scheduled Time</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="fasting"
                checked={formData.fastingRequired}
                onCheckedChange={(checked) => setFormData(prev => ({ ...prev, fastingRequired: !!checked }))}
              />
              <Label htmlFor="fasting" className="cursor-pointer">
                Fasting Required
              </Label>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="clinicalInfo">Clinical Information</Label>
            <Textarea
              id="clinicalInfo"
              value={formData.clinicalInfo}
              onChange={(e) => setFormData(prev => ({ ...prev, clinicalInfo: e.target.value }))}
              placeholder="Relevant clinical information, symptoms, or diagnosis"
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="instructions">Special Instructions</Label>
            <Textarea
              id="instructions"
              value={formData.specialInstructions}
              onChange={(e) => setFormData(prev => ({ ...prev, specialInstructions: e.target.value }))}
              placeholder="Special collection or handling instructions"
              rows={2}
            />
          </div>

          {/* Alerts */}
          {formData.fastingRequired && (
            <div className="flex items-center gap-2 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
              <AlertCircle className="h-4 w-4 text-yellow-600" />
              <span className="text-sm text-yellow-700">
                Patient fasting required - ensure 8-12 hours fasting before collection
              </span>
            </div>
          )}

          {formData.priority === 'stat' && (
            <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
              <Clock className="h-4 w-4 text-red-600" />
              <span className="text-sm text-red-700">
                STAT order - Lab will be notified immediately for priority processing
              </span>
            </div>
          )}

          <div className="flex justify-end gap-4">
            <Button type="button" variant="outline">
              Save as Draft
            </Button>
            <Button type="submit" className="bg-green-600 hover:bg-green-700">
              Submit Lab Order
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default LabOrderForm;
