import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Mic, MicOff, Zap, ZapOff, Settings, Brain, MapPin, User } from 'lucide-react';
import { useAmbientEMR } from '@/hooks/useAmbientEMR';
import { Badge } from '@/components/ui/badge';

const AmbientControlPanel = () => {
  const [specialty, setSpecialty] = useState<string>('general');
  const [roomNumber, setRoomNumber] = useState<string>('');
  const [physicianRole, setPhysicianRole] = useState<string>('attending');
  
  const {
    isConnected,
    isListening,
    wakeWordActive,
    messages,
    currentContext,
    startAmbientMode,
    stopAmbientMode,
    startWakeWordDetection,
    stopWakeWordDetection,
    sendVoiceCommand,
    updateClinicalContext,
    getAvailableCommands
  } = useAmbientEMR(specialty);

  const quickCommands = [
    { label: "Show Patient Chart", command: "Navigate to patient chart" },
    { label: "Open Lab Results", command: "Show lab results" },
    { label: "Create Progress Note", command: "Create a progress note" },
    { label: "Order Lab Work", command: "Order lab work" },
    { label: "Switch Room", command: `Switch to room ${roomNumber || '101'}` },
    { label: "Emergency Response", command: "Code blue" },
    { label: "Medication Order", command: "Order medication" },
    { label: "Nursing Assessment", command: "Nursing assessment" }
  ];

  const specialtyCommands = {
    cardiology: [
      { label: "Order ECG", command: "Order ECG" },
      { label: "Order Echo", command: "Order echocardiogram" }
    ],
    emergency: [
      { label: "Triage Assessment", command: "Triage this patient" },
      { label: "STAT Labs", command: "STAT lab work" }
    ],
    general: []
  };

  const handleContextUpdate = (field: string, value: string) => {
    updateClinicalContext({ [field]: value });
    if (field === 'room') setRoomNumber(value);
    if (field === 'role') setPhysicianRole(value);
  };

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Brain className="h-5 w-5" />
          Enhanced Ambient EMR Control
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="control" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="control">Control</TabsTrigger>
            <TabsTrigger value="context">Context</TabsTrigger>
            <TabsTrigger value="commands">Commands</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>
          
          <TabsContent value="control" className="space-y-4">
            {/* Connection Status */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <span className="text-sm font-medium">Ambient Mode:</span>
                <Badge variant={isConnected ? "default" : "secondary"} className="w-full justify-center">
                  {isConnected ? "Active" : "Inactive"}
                </Badge>
              </div>
              <div className="space-y-2">
                <span className="text-sm font-medium">Wake Word:</span>
                <Badge variant={wakeWordActive ? "default" : "outline"} className="w-full justify-center">
                  {wakeWordActive ? "Listening" : "Off"}
                </Badge>
              </div>
            </div>

            {/* Listening Indicator */}
            {isConnected && (
              <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                <span className="text-sm font-medium">Voice Activity:</span>
                <div className="flex items-center gap-2">
                  {isListening ? (
                    <Mic className="h-5 w-5 text-green-500 animate-pulse" />
                  ) : (
                    <MicOff className="h-5 w-5 text-muted-foreground" />
                  )}
                  <Badge variant={isListening ? "default" : "outline"}>
                    {isListening ? "Speaking" : "Quiet"}
                  </Badge>
                </div>
              </div>
            )}

            {/* Control Buttons */}
            <div className="grid grid-cols-2 gap-2">
              {!wakeWordActive ? (
                <Button 
                  onClick={startWakeWordDetection}
                  variant="outline"
                  className="w-full"
                >
                  <Brain className="h-4 w-4 mr-2" />
                  Wake Word
                </Button>
              ) : (
                <Button 
                  onClick={stopWakeWordDetection}
                  variant="outline"
                  className="w-full"
                >
                  <Brain className="h-4 w-4 mr-2" />
                  Stop Wake
                </Button>
              )}
              
              {!isConnected ? (
                <Button 
                  onClick={startAmbientMode}
                  className="w-full"
                >
                  <Zap className="h-4 w-4 mr-2" />
                  Start Direct
                </Button>
              ) : (
                <Button 
                  onClick={stopAmbientMode}
                  variant="destructive"
                  className="w-full"
                >
                  <ZapOff className="h-4 w-4 mr-2" />
                  Stop All
                </Button>
              )}
            </div>

            {/* Quick Commands */}
            {isConnected && (
              <div className="space-y-3">
                <span className="text-sm font-medium">Quick Commands:</span>
                <div className="grid grid-cols-2 gap-2">
                  {quickCommands.map((cmd, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      size="sm"
                      onClick={() => sendVoiceCommand(cmd.command)}
                      className="text-xs h-auto py-2 px-2"
                    >
                      {cmd.label}
                    </Button>
                  ))}
                </div>
                
                {/* Specialty Commands */}
                {specialtyCommands[specialty as keyof typeof specialtyCommands]?.length > 0 && (
                  <div className="space-y-2">
                    <span className="text-xs font-medium text-muted-foreground">
                      {specialty.charAt(0).toUpperCase() + specialty.slice(1)} Commands:
                    </span>
                    <div className="grid grid-cols-2 gap-2">
                      {specialtyCommands[specialty as keyof typeof specialtyCommands].map((cmd, index) => (
                        <Button
                          key={index}
                          variant="secondary"
                          size="sm"
                          onClick={() => sendVoiceCommand(cmd.command)}
                          className="text-xs h-auto py-2 px-2"
                        >
                          {cmd.label}
                        </Button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </TabsContent>

          <TabsContent value="context" className="space-y-4">
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-4">
                <MapPin className="h-4 w-4" />
                <span className="font-medium">Clinical Context</span>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="room">Current Room</Label>
                  <Input
                    id="room"
                    value={roomNumber}
                    onChange={(e) => setRoomNumber(e.target.value)}
                    placeholder="101, 201A, ICU-3"
                    onBlur={() => handleContextUpdate('room', roomNumber)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="unit">Unit</Label>
                  <Select onValueChange={(value) => handleContextUpdate('unit', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select unit" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="icu">ICU</SelectItem>
                      <SelectItem value="ed">Emergency Department</SelectItem>
                      <SelectItem value="ward">General Ward</SelectItem>
                      <SelectItem value="surgery">Surgery</SelectItem>
                      <SelectItem value="cardiology">Cardiology</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="workflow">Workflow Type</Label>
                  <Select onValueChange={(value) => handleContextUpdate('workflow', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select workflow" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="rounds">Morning Rounds</SelectItem>
                      <SelectItem value="admission">Patient Admission</SelectItem>
                      <SelectItem value="emergency">Emergency Care</SelectItem>
                      <SelectItem value="consultation">Consultation</SelectItem>
                      <SelectItem value="discharge">Discharge Planning</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="role">Your Role</Label>
                  <Select value={physicianRole} onValueChange={(value) => handleContextUpdate('role', value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="attending">Attending Physician</SelectItem>
                      <SelectItem value="resident">Resident</SelectItem>
                      <SelectItem value="intern">Intern</SelectItem>
                      <SelectItem value="nurse">Nurse</SelectItem>
                      <SelectItem value="specialist">Specialist</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Current Context Display */}
              {Object.keys(currentContext).length > 0 && (
                <div className="p-3 bg-muted rounded-lg">
                  <span className="text-sm font-medium">Active Context:</span>
                  <div className="mt-2 text-xs space-y-1">
                    {currentContext.currentRoom && (
                      <div>Room: {currentContext.currentRoom}</div>
                    )}
                    {currentContext.currentUnit && (
                      <div>Unit: {currentContext.currentUnit}</div>
                    )}
                    {currentContext.workflowType && (
                      <div>Workflow: {currentContext.workflowType}</div>
                    )}
                    {currentContext.timeOfDay && (
                      <div>Time: {currentContext.timeOfDay}</div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="commands" className="space-y-4">
            <div className="space-y-4">
              <span className="text-sm font-medium">Available Voice Commands:</span>
              <div className="max-h-64 overflow-y-auto p-3 bg-muted rounded-lg">
                <pre className="text-xs whitespace-pre-wrap font-mono">
                  {getAvailableCommands()}
                </pre>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="settings" className="space-y-4">
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-4">
                <Settings className="h-4 w-4" />
                <span className="font-medium">Configuration</span>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="specialty">Medical Specialty</Label>
                <Select value={specialty} onValueChange={setSpecialty}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="general">General Medicine</SelectItem>
                    <SelectItem value="cardiology">Cardiology</SelectItem>
                    <SelectItem value="emergency">Emergency Medicine</SelectItem>
                    <SelectItem value="surgery">Surgery</SelectItem>
                    <SelectItem value="pediatrics">Pediatrics</SelectItem>
                    <SelectItem value="neurology">Neurology</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        {/* Recent Activity - Always show in control tab */}
        {messages.length > 0 && (
          <div className="mt-6 space-y-2">
            <span className="text-sm font-medium">Recent Activity:</span>
            <div className="max-h-32 overflow-y-auto space-y-1">
              {messages.slice(-3).map((message) => (
                <div key={message.id} className="text-xs p-2 bg-muted rounded text-muted-foreground">
                  <span className="font-medium">{message.type}</span>
                  {message.content && (
                    <div className="truncate">{message.content}</div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AmbientControlPanel;