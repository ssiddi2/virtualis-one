import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ArrowLeft, User, Calendar, FileText, Pill, TestTube, ImageIcon, Plus, Brain, Clock, AlertTriangle, DollarSign, Save, Send } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const PatientChart = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [patient, setPatient] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // State for charge capture
  const [charges, setCharges] = useState([]);
  const [newCharge, setNewCharge] = useState({
    cptCode: '',
    description: '',
    units: '1',
    amount: ''
  });

  // State for orders
  const [orders, setOrders] = useState([
    { id: 1, type: 'ECG - 12 Lead', status: 'Pending', priority: 'STAT', time: '10:30 AM' },
    { id: 2, type: 'Troponin I', status: 'Pending', priority: 'STAT', time: '10:30 AM' }
  ]);
  const [newOrder, setNewOrder] = useState({
    type: '',
    priority: 'routine',
    instructions: ''
  });

  // State for notes
  const [notes, setNotes] = useState([
    {
      id: 1,
      type: 'Initial Assessment',
      content: '45-year-old female presents with acute onset chest pain, described as sharp and radiating to left arm. No shortness of breath. Pain started 2 hours ago while at rest. No previous cardiac history.',
      author: 'Dr. Michael Chen',
      time: 'Today, 09:45 AM'
    }
  ]);
  const [newNote, setNewNote] = useState({
    type: '',
    content: '',
    aiAssist: false
  });

  useEffect(() => {
    // Mock patient data fetch
    setTimeout(() => {
      setPatient({
        id,
        name: "Sarah Johnson",
        age: 45,
        gender: "Female",
        room: "302A",
        complaint: "Acute MI",
        status: "in-progress",
        provider: "Dr. Michael Chen",
        admitTime: "09:30 AM",
        acuity: "high",
        risk: "60%",
        allergies: ["Penicillin", "Shellfish"],
        vitals: {
          temperature: "98.6°F",
          bloodPressure: "140/90",
          heartRate: "88 bpm",
          oxygenSat: "98%"
        }
      });
      setLoading(false);
    }, 1000);
  }, [id]);

  const handleAddCharge = () => {
    if (newCharge.cptCode && newCharge.description && newCharge.amount) {
      const charge = {
        id: charges.length + 1,
        ...newCharge,
        date: new Date().toLocaleDateString(),
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        status: 'Pending'
      };
      setCharges([...charges, charge]);
      setNewCharge({ cptCode: '', description: '', units: '1', amount: '' });
      toast({
        title: "Charge Added",
        description: `CPT ${charge.cptCode} has been captured successfully.`,
      });
    }
  };

  const handleAddOrder = () => {
    if (newOrder.type) {
      const order = {
        id: orders.length + 1,
        type: newOrder.type,
        status: 'Pending',
        priority: newOrder.priority.toUpperCase(),
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        instructions: newOrder.instructions
      };
      setOrders([...orders, order]);
      setNewOrder({ type: '', priority: 'routine', instructions: '' });
      toast({
        title: "Order Created",
        description: `${order.type} order has been placed successfully.`,
      });
    }
  };

  const handleAddNote = () => {
    if (newNote.content && newNote.type) {
      const note = {
        id: notes.length + 1,
        type: newNote.type,
        content: newNote.content,
        author: patient?.provider || 'Current User',
        time: `Today, ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`
      };
      setNotes([...notes, note]);
      setNewNote({ type: '', content: '', aiAssist: false });
      toast({
        title: "Note Created",
        description: `${note.type} note has been documented successfully.`,
      });
    }
  };

  const generateAINote = () => {
    // Mock AI note generation
    const aiContent = `Based on current vitals and patient presentation:\n\nPatient continues to show stable vitals with HR ${patient?.vitals?.heartRate}, BP ${patient?.vitals?.bloodPressure}. Chief complaint of ${patient?.complaint} being monitored closely. Pain level assessed and managed per protocol. Patient remains alert and oriented. Continue current treatment plan and monitor for any changes.`;
    
    setNewNote({
      ...newNote,
      content: aiContent
    });
    
    toast({
      title: "AI Note Generated",
      description: "AI has drafted a clinical note based on current patient data.",
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-virtualis-navy p-6 flex items-center justify-center">
        <div className="glass-card p-8 text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-virtualis-gold mx-auto pulse-glow"></div>
          <p className="text-white mt-4 tech-font">Loading Patient Chart...</p>
        </div>
      </div>
    );
  }

  if (!patient) {
    return (
      <div className="min-h-screen bg-virtualis-navy p-6 flex items-center justify-center">
        <div className="glass-card p-8 text-center">
          <h2 className="text-2xl font-bold text-white mb-4 tech-font">Patient not found</h2>
          <Button onClick={() => navigate("/")} className="glass-button">
            Return to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  const getAcuityColor = (acuity: string) => {
    switch (acuity) {
      case 'high':
        return 'glass-badge error';
      case 'medium':
        return 'glass-badge warning';
      case 'low':
        return 'glass-badge success';
      default:
        return 'glass-badge';
    }
  };

  return (
    <div className="min-h-screen bg-virtualis-navy">
      {/* Header */}
      <div className="p-6 border-b border-white/10">
        <div className="flex items-center gap-4 mb-6">
          <Button
            variant="ghost"
            onClick={() => navigate("/")}
            className="glass-nav-item text-white hover:text-virtualis-gold"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
          
          <div className="flex-1">
            <div className="flex items-center gap-4 mb-2">
              <h1 className="text-3xl font-bold text-white brand-font gradient-text">{patient.name}</h1>
              <Badge className={getAcuityColor(patient.acuity)}>
                <AlertTriangle className="h-3 w-3 mr-1" />
                {patient.acuity.toUpperCase()} ACUITY
              </Badge>
              <div className="glass-badge primary">
                Risk: {patient.risk}
              </div>
            </div>
            <div className="flex items-center gap-6 text-sm text-white/70 tech-font">
              <span>Age: {patient.age}</span>
              <span>Gender: {patient.gender}</span>
              <span>Room: {patient.room}</span>
              <span>Provider: {patient.provider}</span>
              <span className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                Admitted: {patient.admitTime}
              </span>
            </div>
          </div>
        </div>

        {/* Priority Alert */}
        <div className="glass-card bg-gradient-to-r from-red-900/20 to-orange-900/20 border-red-400/30 p-4 mb-6">
          <div className="flex items-center gap-3">
            <AlertTriangle className="h-5 w-5 text-red-400 pulse-glow" />
            <div>
              <h3 className="text-red-300 font-semibold tech-font">Priority #1: Highest acuity with escalating risk factors</h3>
              <p className="text-red-200/80 text-sm">D/C: 1-2 days • Requires immediate attention</p>
            </div>
          </div>
        </div>
      </div>

      <div className="p-6">
        {/* Patient Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="glass-card p-4 hover:scale-105 transition-all duration-300">
            <div className="text-xs text-virtualis-gold font-medium mb-1 tech-font">Chief Complaint</div>
            <p className="text-lg font-semibold text-white">{patient.complaint}</p>
          </div>

          <div className="glass-card p-4 hover:scale-105 transition-all duration-300">
            <div className="text-xs text-virtualis-gold font-medium mb-1 tech-font">Temperature</div>
            <p className="text-lg font-semibold text-white">{patient.vitals.temperature}</p>
          </div>

          <div className="glass-card p-4 hover:scale-105 transition-all duration-300">
            <div className="text-xs text-virtualis-gold font-medium mb-1 tech-font">Blood Pressure</div>
            <p className="text-lg font-semibold text-white">{patient.vitals.bloodPressure}</p>
          </div>

          <div className="glass-card p-4 hover:scale-105 transition-all duration-300">
            <div className="text-xs text-virtualis-gold font-medium mb-1 tech-font">Heart Rate</div>
            <p className="text-lg font-semibold text-white">{patient.vitals.heartRate}</p>
          </div>
        </div>

        {/* Chart Tabs */}
        <Tabs defaultValue="notes" className="space-y-4">
          <TabsList className="grid w-full grid-cols-6 glass-card p-1">
            <TabsTrigger value="notes" className="glass-nav-item flex items-center gap-2 text-white data-[state=active]:bg-virtualis-gold/20 data-[state=active]:text-virtualis-gold">
              <FileText className="h-4 w-4" />
              Notes
            </TabsTrigger>
            <TabsTrigger value="orders" className="glass-nav-item flex items-center gap-2 text-white data-[state=active]:bg-virtualis-gold/20 data-[state=active]:text-virtualis-gold">
              <Calendar className="h-4 w-4" />
              Orders
            </TabsTrigger>
            <TabsTrigger value="results" className="glass-nav-item flex items-center gap-2 text-white data-[state=active]:bg-virtualis-gold/20 data-[state=active]:text-virtualis-gold">
              <TestTube className="h-4 w-4" />
              Results
            </TabsTrigger>
            <TabsTrigger value="mar" className="glass-nav-item flex items-center gap-2 text-white data-[state=active]:bg-virtualis-gold/20 data-[state=active]:text-virtualis-gold">
              <Pill className="h-4 w-4" />
              MAR
            </TabsTrigger>
            <TabsTrigger value="imaging" className="glass-nav-item flex items-center gap-2 text-white data-[state=active]:bg-virtualis-gold/20 data-[state=active]:text-virtualis-gold">
              <ImageIcon className="h-4 w-4" />
              Imaging
            </TabsTrigger>
            <TabsTrigger value="charges" className="glass-nav-item flex items-center gap-2 text-white data-[state=active]:bg-virtualis-gold/20 data-[state=active]:text-virtualis-gold">
              <DollarSign className="h-4 w-4" />
              Charges
            </TabsTrigger>
          </TabsList>

          <TabsContent value="notes" className="space-y-4">
            <div className="glass-card">
              <div className="p-6 border-b border-white/10">
                <div className="flex items-center gap-3 mb-2">
                  <Brain className="h-5 w-5 text-virtualis-gold pulse-glow" />
                  <h3 className="text-xl font-semibold text-white tech-font">Clinical Notes</h3>
                </div>
                <p className="text-white/70 tech-font">AI-Enhanced Documentation and Progress Notes</p>
              </div>
              <div className="p-6 space-y-6">
                {/* Existing Notes */}
                <div className="space-y-4">
                  {notes.map((note) => (
                    <div key={note.id} className="glass-card border-l-4 border-virtualis-gold p-4">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="font-medium text-white tech-font">{note.type}</h4>
                        <span className="text-sm text-virtualis-gold">{note.time}</span>
                      </div>
                      <p className="text-sm text-white/80 mb-3 whitespace-pre-line">{note.content}</p>
                      <p className="text-xs text-virtualis-gold tech-font">{note.author}</p>
                    </div>
                  ))}
                </div>

                {/* New Note Form */}
                <div className="glass-card p-4 border border-virtualis-gold/30">
                  <h4 className="text-lg font-semibold text-white mb-4 tech-font">Create New Note</h4>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="noteType" className="text-white">Note Type</Label>
                      <Select value={newNote.type} onValueChange={(value) => setNewNote({...newNote, type: value})}>
                        <SelectTrigger className="glass-input">
                          <SelectValue placeholder="Select note type" />
                        </SelectTrigger>
                        <SelectContent className="glass-card border-white/20">
                          <SelectItem value="Progress Note">Progress Note</SelectItem>
                          <SelectItem value="Assessment">Assessment</SelectItem>
                          <SelectItem value="Plan">Plan</SelectItem>
                          <SelectItem value="Discharge Summary">Discharge Summary</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="noteContent" className="text-white">Note Content</Label>
                      <Textarea
                        id="noteContent"
                        value={newNote.content}
                        onChange={(e) => setNewNote({...newNote, content: e.target.value})}
                        placeholder="Enter clinical note content..."
                        className="glass-input min-h-[120px]"
                      />
                    </div>
                    <div className="flex gap-3">
                      <Button onClick={generateAINote} className="glass-button">
                        <Brain className="h-4 w-4 mr-2" />
                        Generate AI Note
                      </Button>
                      <Button onClick={handleAddNote} className="glass-button">
                        <Save className="h-4 w-4 mr-2" />
                        Save Note
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="orders" className="space-y-4">
            <div className="glass-card">
              <div className="p-6 border-b border-white/10">
                <h3 className="text-xl font-semibold text-white tech-font">Orders Management</h3>
                <p className="text-white/70 tech-font">Laboratory, imaging, and medication orders</p>
              </div>
              <div className="p-6 space-y-6">
                {/* Active Orders */}
                <div className="space-y-3">
                  <h4 className="text-lg font-semibold text-white tech-font">Active Orders</h4>
                  {orders.map((order) => (
                    <div key={order.id} className="glass-card p-4 border-l-4 border-yellow-400">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium text-white tech-font">{order.type}</h4>
                          <p className="text-sm text-white/60">{order.priority} - {order.time}</p>
                          {order.instructions && (
                            <p className="text-sm text-white/70 mt-1">{order.instructions}</p>
                          )}
                        </div>
                        <div className="glass-badge warning">{order.status}</div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* New Order Form */}
                <div className="glass-card p-4 border border-virtualis-gold/30">
                  <h4 className="text-lg font-semibold text-white mb-4 tech-font">Create New Order</h4>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="orderType" className="text-white">Order Type</Label>
                      <Select value={newOrder.type} onValueChange={(value) => setNewOrder({...newOrder, type: value})}>
                        <SelectTrigger className="glass-input">
                          <SelectValue placeholder="Select order type" />
                        </SelectTrigger>
                        <SelectContent className="glass-card border-white/20">
                          <SelectItem value="CBC with Differential">CBC with Differential</SelectItem>
                          <SelectItem value="Chest X-Ray">Chest X-Ray</SelectItem>
                          <SelectItem value="CT Chest">CT Chest</SelectItem>
                          <SelectItem value="BMP">BMP</SelectItem>
                          <SelectItem value="Lipid Panel">Lipid Panel</SelectItem>
                          <SelectItem value="Echocardiogram">Echocardiogram</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="priority" className="text-white">Priority</Label>
                      <Select value={newOrder.priority} onValueChange={(value) => setNewOrder({...newOrder, priority: value})}>
                        <SelectTrigger className="glass-input">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="glass-card border-white/20">
                          <SelectItem value="stat">STAT</SelectItem>
                          <SelectItem value="urgent">Urgent</SelectItem>
                          <SelectItem value="routine">Routine</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="instructions" className="text-white">Special Instructions</Label>
                      <Textarea
                        id="instructions"
                        value={newOrder.instructions}
                        onChange={(e) => setNewOrder({...newOrder, instructions: e.target.value})}
                        placeholder="Enter any special instructions..."
                        className="glass-input"
                      />
                    </div>
                    <Button onClick={handleAddOrder} className="glass-button w-full">
                      <Plus className="h-4 w-4 mr-2" />
                      Place Order
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="results" className="space-y-4">
            <div className="glass-card">
              <div className="p-6 border-b border-white/10">
                <h3 className="text-xl font-semibold text-white tech-font">Laboratory Results</h3>
                <p className="text-white/70 tech-font">Recent lab values and reports</p>
              </div>
              <div className="p-6">
                <p className="text-white/60 text-center py-8">No results available yet. Orders are pending.</p>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="mar" className="space-y-4">
            <div className="glass-card">
              <div className="p-6 border-b border-white/10">
                <h3 className="text-xl font-semibold text-white tech-font">Medication Administration Record</h3>
                <p className="text-white/70 tech-font">Scheduled and PRN medications</p>
              </div>
              <div className="p-6">
                <p className="text-white/60 text-center py-8">No medications ordered at this time.</p>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="imaging" className="space-y-4">
            <div className="glass-card">
              <div className="p-6 border-b border-white/10">
                <h3 className="text-xl font-semibold text-white tech-font">Imaging Studies</h3>
                <p className="text-white/70 tech-font">Radiology reports and images</p>
              </div>
              <div className="p-6">
                <p className="text-white/60 text-center py-8">No imaging studies available.</p>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="charges" className="space-y-4">
            <div className="glass-card">
              <div className="p-6 border-b border-white/10">
                <div className="flex items-center gap-3 mb-2">
                  <DollarSign className="h-5 w-5 text-virtualis-gold pulse-glow" />
                  <h3 className="text-xl font-semibold text-white tech-font">Charge Capture</h3>
                </div>
                <p className="text-white/70 tech-font">CPT codes and billing information</p>
              </div>
              <div className="p-6 space-y-6">
                {/* Existing Charges */}
                {charges.length > 0 && (
                  <div className="space-y-4">
                    <h4 className="text-lg font-semibold text-white tech-font">Captured Charges</h4>
                    <div className="glass-card">
                      <Table>
                        <TableHeader>
                          <TableRow className="border-white/10">
                            <TableHead className="text-virtualis-gold">CPT Code</TableHead>
                            <TableHead className="text-virtualis-gold">Description</TableHead>
                            <TableHead className="text-virtualis-gold">Units</TableHead>
                            <TableHead className="text-virtualis-gold">Amount</TableHead>
                            <TableHead className="text-virtualis-gold">Status</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {charges.map((charge) => (
                            <TableRow key={charge.id} className="border-white/10">
                              <TableCell className="text-white tech-font">{charge.cptCode}</TableCell>
                              <TableCell className="text-white">{charge.description}</TableCell>
                              <TableCell className="text-white">{charge.units}</TableCell>
                              <TableCell className="text-white">${charge.amount}</TableCell>
                              <TableCell>
                                <div className="glass-badge warning">{charge.status}</div>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  </div>
                )}

                {/* New Charge Form */}
                <div className="glass-card p-4 border border-virtualis-gold/30">
                  <h4 className="text-lg font-semibold text-white mb-4 tech-font">Add New Charge</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="cptCode" className="text-white">CPT Code</Label>
                      <Input
                        id="cptCode"
                        value={newCharge.cptCode}
                        onChange={(e) => setNewCharge({...newCharge, cptCode: e.target.value})}
                        placeholder="e.g., 99213"
                        className="glass-input"
                      />
                    </div>
                    <div>
                      <Label htmlFor="description" className="text-white">Description</Label>
                      <Input
                        id="description"
                        value={newCharge.description}
                        onChange={(e) => setNewCharge({...newCharge, description: e.target.value})}
                        placeholder="e.g., Office Visit - Established Patient"
                        className="glass-input"
                      />
                    </div>
                    <div>
                      <Label htmlFor="units" className="text-white">Units</Label>
                      <Input
                        id="units"
                        type="number"
                        value={newCharge.units}
                        onChange={(e) => setNewCharge({...newCharge, units: e.target.value})}
                        className="glass-input"
                      />
                    </div>
                    <div>
                      <Label htmlFor="amount" className="text-white">Amount ($)</Label>
                      <Input
                        id="amount"
                        type="number"
                        step="0.01"
                        value={newCharge.amount}
                        onChange={(e) => setNewCharge({...newCharge, amount: e.target.value})}
                        placeholder="e.g., 125.00"
                        className="glass-input"
                      />
                    </div>
                  </div>
                  <Button onClick={handleAddCharge} className="glass-button w-full mt-4">
                    <Plus className="h-4 w-4 mr-2" />
                    Capture Charge
                  </Button>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default PatientChart;
