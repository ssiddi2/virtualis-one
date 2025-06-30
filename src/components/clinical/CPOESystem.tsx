import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { ArrowLeft, Save, Plus, Edit, Trash } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

const CPOESystem = () => {
  const { patientId } = useParams<{ patientId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [medicationOrders, setMedicationOrders] = useState([
    { id: '1', medication: 'Lisinopril', dosage: '10 mg', route: 'PO', frequency: 'Daily', notes: 'For hypertension' },
    { id: '2', medication: 'Atorvastatin', dosage: '40 mg', route: 'PO', frequency: 'Nightly', notes: 'For hyperlipidemia' }
  ]);
  const [labOrders, setLabOrders] = useState([
    { id: '3', lab: 'CBC', notes: 'Check for infection' },
    { id: '4', lab: 'CMP', notes: 'Monitor electrolytes' }
  ]);
  const [imagingOrders, setImagingOrders] = useState([
    { id: '5', imaging: 'Chest X-Ray', notes: 'Evaluate for pneumonia' },
    { id: '6', imaging: 'MRI Brain', notes: 'Rule out stroke' }
  ]);

  const [newMedication, setNewMedication] = useState({ medication: '', dosage: '', route: '', frequency: '', notes: '' });
  const [newLabOrder, setNewLabOrder] = useState({ lab: '', notes: '' });
  const [newImagingOrder, setNewImagingOrder] = useState({ imaging: '', notes: '' });

  const [editingMedicationId, setEditingMedicationId] = useState<string | null>(null);
  const [editingLabOrderId, setEditingLabOrderId] = useState<string | null>(null);
  const [editingImagingOrderId, setEditingImagingOrderId] = useState<string | null>(null);

  const handleAddMedication = () => {
    if (newMedication.medication && newMedication.dosage && newMedication.route && newMedication.frequency) {
      const newId = Math.random().toString(36).substring(7);
      setMedicationOrders([...medicationOrders, { id: newId, ...newMedication }]);
      setNewMedication({ medication: '', dosage: '', route: '', frequency: '', notes: '' });
      toast({ title: "Medication Order Added", description: "New medication order has been added." });
    } else {
      toast({ title: "Missing Information", description: "Please fill in all required fields for medication order.", variant: "destructive" });
    }
  };

  const handleAddLabOrder = () => {
    if (newLabOrder.lab) {
      const newId = Math.random().toString(36).substring(7);
      setLabOrders([...labOrders, { id: newId, ...newLabOrder }]);
      setNewLabOrder({ lab: '', notes: '' });
      toast({ title: "Lab Order Added", description: "New lab order has been added." });
    } else {
      toast({ title: "Missing Information", description: "Please specify the lab test.", variant: "destructive" });
    }
  };

  const handleAddImagingOrder = () => {
    if (newImagingOrder.imaging) {
      const newId = Math.random().toString(36).substring(7);
      setImagingOrders([...imagingOrders, { id: newId, ...newImagingOrder }]);
      setNewImagingOrder({ imaging: '', notes: '' });
      toast({ title: "Imaging Order Added", description: "New imaging order has been added." });
    } else {
      toast({ title: "Missing Information", description: "Please specify the imaging test.", variant: "destructive" });
    }
  };

  const handleRemoveMedication = (id: string) => {
    setMedicationOrders(medicationOrders.filter(order => order.id !== id));
    toast({ title: "Medication Order Removed", description: "Medication order has been removed." });
  };

  const handleRemoveLabOrder = (id: string) => {
    setLabOrders(labOrders.filter(order => order.id !== id));
    toast({ title: "Lab Order Removed", description: "Lab order has been removed." });
  };

  const handleRemoveImagingOrder = (id: string) => {
    setImagingOrders(imagingOrders.filter(order => order.id !== id));
    toast({ title: "Imaging Order Removed", description: "Imaging order has been removed." });
  };

  const handleStartEditMedication = (id: string) => {
    setEditingMedicationId(id);
    // Implement logic to pre-fill the edit form if needed
  };

  const handleStartEditLabOrder = (id: string) => {
    setEditingLabOrderId(id);
    // Implement logic to pre-fill the edit form if needed
  };

  const handleStartEditImaging = (id: string) => {
    setEditingImagingOrderId(id);
    // Implement logic to pre-fill the edit form if needed
  };

  const handleSaveMedication = (id: string, updatedOrder: any) => {
    setMedicationOrders(medicationOrders.map(order => order.id === id ? { ...order, ...updatedOrder } : order));
    setEditingMedicationId(null);
    toast({ title: "Medication Order Updated", description: "Medication order has been updated." });
  };

  const handleSaveLabOrder = (id: string, updatedOrder: any) => {
    setLabOrders(labOrders.map(order => order.id === id ? { ...order, ...updatedOrder } : order));
    setEditingLabOrderId(null);
    toast({ title: "Lab Order Updated", description: "Lab order has been updated." });
  };

  const handleSaveImaging = (id: string, updatedOrder: any) => {
    setImagingOrders(imagingOrders.map(order => order.id === id ? { ...order, ...updatedOrder } : order));
    setEditingImagingOrderId(null);
    toast({ title: "Imaging Order Updated", description: "Imaging order has been updated." });
  };

  return (
    <div className="min-h-screen p-6" style={{
      background: 'linear-gradient(135deg, hsl(225, 70%, 25%) 0%, hsl(220, 65%, 35%) 25%, hsl(215, 60%, 45%) 50%, hsl(210, 55%, 55%) 75%, hsl(205, 50%, 65%) 100%)'
    }}>
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button
            onClick={() => navigate('/clinical')}
            variant="outline"
            className="border-white/30 text-white hover:bg-white/10"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-white">CPOE System</h1>
            <p className="text-white/70">Computerized Provider Order Entry for Patient {patientId}</p>
          </div>
        </div>

        {/* Medication Orders */}
        <Card className="backdrop-blur-xl bg-blue-500/10 border border-blue-300/30">
          <CardHeader>
            <CardTitle className="text-white">Medication Orders</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {medicationOrders.map((order) => (
              <div key={order.id} className="flex items-center justify-between p-3 rounded-md bg-blue-600/20">
                {editingMedicationId === order.id ? (
                  <div className="grid grid-cols-2 gap-2">
                    <Input
                      placeholder="Medication"
                      value={order.medication}
                      onChange={(e) => handleSaveMedication(order.id, { ...order, medication: e.target.value })}
                      className="bg-blue-600/20 border-blue-400/30 text-white"
                    />
                    <Input
                      placeholder="Dosage"
                      value={order.dosage}
                      onChange={(e) => handleSaveMedication(order.id, { ...order, dosage: e.target.value })}
                      className="bg-blue-600/20 border-blue-400/30 text-white"
                    />
                    <Input
                      placeholder="Route"
                      value={order.route}
                      onChange={(e) => handleSaveMedication(order.id, { ...order, route: e.target.value })}
                      className="bg-blue-600/20 border-blue-400/30 text-white"
                    />
                    <Input
                      placeholder="Frequency"
                      value={order.frequency}
                      onChange={(e) => handleSaveMedication(order.id, { ...order, frequency: e.target.value })}
                      className="bg-blue-600/20 border-blue-400/30 text-white"
                    />
                    <Textarea
                      placeholder="Notes"
                      value={order.notes}
                      onChange={(e) => handleSaveMedication(order.id, { ...order, notes: e.target.value })}
                      className="bg-blue-600/20 border-blue-400/30 text-white"
                    />
                    <Button onClick={() => setEditingMedicationId(null)} className="bg-green-600 hover:bg-green-700 text-white">
                      <Save className="h-4 w-4 mr-2" />
                      Save
                    </Button>
                  </div>
                ) : (
                  <>
                    <div className="text-white">
                      {order.medication} {order.dosage}, {order.route}, {order.frequency}
                      {order.notes && <div className="text-white/60 text-sm">{order.notes}</div>}
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" onClick={() => handleStartEditMedication(order.id)} className="bg-blue-600 hover:bg-blue-700 text-white">
                        <Edit className="h-3 w-3" />
                      </Button>
                      <Button size="sm" onClick={() => handleRemoveMedication(order.id)} className="bg-red-600 hover:bg-red-700 text-white">
                        <Trash className="h-3 w-3" />
                      </Button>
                    </div>
                  </>
                )}
              </div>
            ))}
            <div className="grid grid-cols-2 gap-2">
              <Input
                placeholder="Medication"
                value={newMedication.medication}
                onChange={(e) => setNewMedication({ ...newMedication, medication: e.target.value })}
                className="bg-blue-600/20 border-blue-400/30 text-white"
              />
              <Input
                placeholder="Dosage"
                value={newMedication.dosage}
                onChange={(e) => setNewMedication({ ...newMedication, dosage: e.target.value })}
                className="bg-blue-600/20 border-blue-400/30 text-white"
              />
              <Input
                placeholder="Route"
                value={newMedication.route}
                onChange={(e) => setNewMedication({ ...newMedication, route: e.target.value })}
                className="bg-blue-600/20 border-blue-400/30 text-white"
              />
              <Input
                placeholder="Frequency"
                value={newMedication.frequency}
                onChange={(e) => setNewMedication({ ...newMedication, frequency: e.target.value })}
                className="bg-blue-600/20 border-blue-400/30 text-white"
              />
              <Textarea
                placeholder="Notes"
                value={newMedication.notes}
                onChange={(e) => setNewMedication({ ...newMedication, notes: e.target.value })}
                className="bg-blue-600/20 border-blue-400/30 text-white"
              />
              <Button onClick={handleAddMedication} className="bg-blue-600 hover:bg-blue-700 text-white">
                <Plus className="h-4 w-4 mr-2" />
                Add Medication
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Lab Orders */}
        <Card className="backdrop-blur-xl bg-green-500/10 border border-green-300/30">
          <CardHeader>
            <CardTitle className="text-white">Lab Orders</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {labOrders.map((order) => (
              <div key={order.id} className="flex items-center justify-between p-3 rounded-md bg-green-600/20">
                {editingLabOrderId === order.id ? (
                  <div className="grid grid-cols-1 gap-2">
                    <Input
                      placeholder="Lab Test"
                      value={order.lab}
                      onChange={(e) => handleSaveLabOrder(order.id, { ...order, lab: e.target.value })}
                      className="bg-green-600/20 border-green-400/30 text-white"
                    />
                    <Textarea
                      placeholder="Notes"
                      value={order.notes}
                      onChange={(e) => handleSaveLabOrder(order.id, { ...order, notes: e.target.value })}
                      className="bg-green-600/20 border-green-400/30 text-white"
                    />
                    <Button onClick={() => setEditingLabOrderId(null)} className="bg-green-600 hover:bg-green-700 text-white">
                      <Save className="h-4 w-4 mr-2" />
                      Save
                    </Button>
                  </div>
                ) : (
                  <>
                    <div className="text-white">
                      {order.lab}
                      {order.notes && <div className="text-white/60 text-sm">{order.notes}</div>}
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" onClick={() => handleStartEditLabOrder(order.id)} className="bg-green-600 hover:bg-green-700 text-white">
                        <Edit className="h-3 w-3" />
                      </Button>
                      <Button size="sm" onClick={() => handleRemoveLabOrder(order.id)} className="bg-red-600 hover:bg-red-700 text-white">
                        <Trash className="h-3 w-3" />
                      </Button>
                    </div>
                  </>
                )}
              </div>
            ))}
            <div className="grid grid-cols-1 gap-2">
              <Input
                placeholder="Lab Test"
                value={newLabOrder.lab}
                onChange={(e) => setNewLabOrder({ ...newLabOrder, lab: e.target.value })}
                className="bg-green-600/20 border-green-400/30 text-white"
              />
              <Textarea
                placeholder="Notes"
                value={newLabOrder.notes}
                onChange={(e) => setNewLabOrder({ ...newLabOrder, notes: e.target.value })}
                className="bg-green-600/20 border-green-400/30 text-white"
              />
              <Button onClick={handleAddLabOrder} className="bg-green-600 hover:bg-green-700 text-white">
                <Plus className="h-4 w-4 mr-2" />
                Add Lab Order
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Imaging Orders */}
        <Card className="backdrop-blur-xl bg-purple-500/10 border border-purple-300/30">
          <CardHeader>
            <CardTitle className="text-white">Imaging Orders</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {imagingOrders.map((order) => (
              <div key={order.id} className="flex items-center justify-between p-3 rounded-md bg-purple-600/20">
                {editingImagingOrderId === order.id ? (
                  <div className="grid grid-cols-1 gap-2">
                    <Input
                      placeholder="Imaging Test"
                      value={order.imaging}
                      onChange={(e) => handleSaveImaging(order.id, { ...order, imaging: e.target.value })}
                      className="bg-purple-600/20 border-purple-400/30 text-white"
                    />
                    <Textarea
                      placeholder="Notes"
                      value={order.notes}
                      onChange={(e) => handleSaveImaging(order.id, { ...order, notes: e.target.value })}
                      className="bg-purple-600/20 border-purple-400/30 text-white"
                    />
                    <Button onClick={() => setEditingImagingOrderId(null)} className="bg-purple-600 hover:bg-purple-700 text-white">
                      <Save className="h-4 w-4 mr-2" />
                      Save
                    </Button>
                  </div>
                ) : (
                  <>
                    <div className="text-white">
                      {order.imaging}
                      {order.notes && <div className="text-white/60 text-sm">{order.notes}</div>}
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" onClick={() => handleStartEditImaging(order.id)} className="bg-purple-600 hover:bg-purple-700 text-white">
                        <Edit className="h-3 w-3" />
                      </Button>
                      <Button size="sm" onClick={() => handleRemoveImagingOrder(order.id)} className="bg-red-600 hover:bg-red-700 text-white">
                        <Trash className="h-3 w-3" />
                      </Button>
                    </div>
                  </>
                )}
              </div>
            ))}
            <div className="grid grid-cols-1 gap-2">
              <Input
                placeholder="Imaging Test"
                value={newImagingOrder.imaging}
                onChange={(e) => setNewImagingOrder({ ...newImagingOrder, imaging: e.target.value })}
                className="bg-purple-600/20 border-purple-400/30 text-white"
              />
              <Textarea
                placeholder="Notes"
                value={newImagingOrder.notes}
                onChange={(e) => setNewImagingOrder({ ...newImagingOrder, notes: e.target.value })}
                className="bg-purple-600/20 border-purple-400/30 text-white"
              />
              <Button onClick={handleAddImagingOrder} className="bg-purple-600 hover:bg-purple-700 text-white">
                <Plus className="h-4 w-4 mr-2" />
                Add Imaging Order
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CPOESystem;
