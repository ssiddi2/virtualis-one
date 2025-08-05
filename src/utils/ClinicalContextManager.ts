interface ClinicalContext {
  currentRoom?: string;
  currentPatient?: any;
  currentUnit?: string;
  workflowType?: 'rounds' | 'admission' | 'emergency' | 'discharge' | 'consultation';
  timeOfDay?: 'morning' | 'afternoon' | 'evening' | 'night';
  physicianRole?: 'attending' | 'resident' | 'intern' | 'nurse' | 'specialist';
  specialty?: string;
}

export class ClinicalContextManager {
  private context: ClinicalContext = {};
  private contextHistory: ClinicalContext[] = [];
  private onContextChange?: (context: ClinicalContext) => void;

  constructor(onContextChange?: (context: ClinicalContext) => void) {
    this.onContextChange = onContextChange;
    this.initializeContext();
  }

  private initializeContext() {
    // Set time-based context
    const hour = new Date().getHours();
    if (hour >= 6 && hour < 12) this.context.timeOfDay = 'morning';
    else if (hour >= 12 && hour < 18) this.context.timeOfDay = 'afternoon';
    else if (hour >= 18 && hour < 22) this.context.timeOfDay = 'evening';
    else this.context.timeOfDay = 'night';

    // Detect workflow type based on time
    if (hour >= 7 && hour <= 9) this.context.workflowType = 'rounds';
    else if (hour >= 10 && hour <= 16) this.context.workflowType = 'consultation';
    
    this.notifyContextChange();
  }

  updateRoom(roomNumber: string) {
    this.saveContextToHistory();
    this.context.currentRoom = roomNumber;
    
    // Auto-switch patient based on room (simulated)
    this.autoSwitchPatientForRoom(roomNumber);
    this.notifyContextChange();
  }

  updatePatient(patient: any) {
    this.saveContextToHistory();
    this.context.currentPatient = patient;
    this.notifyContextChange();
  }

  updateUnit(unit: string) {
    this.saveContextToHistory();
    this.context.currentUnit = unit;
    
    // Adjust workflow based on unit
    if (unit.toLowerCase().includes('icu')) {
      this.context.workflowType = 'consultation';
    } else if (unit.toLowerCase().includes('ed') || unit.toLowerCase().includes('emergency')) {
      this.context.workflowType = 'emergency';
    }
    
    this.notifyContextChange();
  }

  updateWorkflowType(workflowType: ClinicalContext['workflowType']) {
    this.saveContextToHistory();
    this.context.workflowType = workflowType;
    this.notifyContextChange();
  }

  updatePhysicianRole(role: ClinicalContext['physicianRole']) {
    this.saveContextToHistory();
    this.context.physicianRole = role;
    this.notifyContextChange();
  }

  updateSpecialty(specialty: string) {
    this.saveContextToHistory();
    this.context.specialty = specialty;
    this.notifyContextChange();
  }

  private autoSwitchPatientForRoom(roomNumber: string) {
    // Simulate patient lookup based on room
    const mockPatients = {
      '101': { id: '1', name: 'John Doe', diagnosis: 'Pneumonia' },
      '102': { id: '2', name: 'Jane Smith', diagnosis: 'Post-op care' },
      '103': { id: '3', name: 'Bob Johnson', diagnosis: 'Chest pain' },
      '201A': { id: '4', name: 'Alice Wilson', diagnosis: 'Diabetes management' },
      '201B': { id: '5', name: 'Charlie Brown', diagnosis: 'Hypertension' }
    };

    const patient = mockPatients[roomNumber as keyof typeof mockPatients];
    if (patient) {
      this.context.currentPatient = patient;
    }
  }

  private saveContextToHistory() {
    this.contextHistory.push({ ...this.context });
    // Keep only last 10 contexts
    if (this.contextHistory.length > 10) {
      this.contextHistory.shift();
    }
  }

  private notifyContextChange() {
    this.onContextChange?.(this.context);
  }

  getContext(): ClinicalContext {
    return { ...this.context };
  }

  getContextHistory(): ClinicalContext[] {
    return [...this.contextHistory];
  }

  // Parse room number from voice commands
  parseRoomFromCommand(command: string): string | null {
    const roomPatterns = [
      /room\s+(\d+[A-Z]?)/i,
      /room\s+(\d+)/i,
      /(\d{3}[A-Z]?)/,
      /bed\s+(\d+[A-Z]?)/i
    ];

    for (const pattern of roomPatterns) {
      const match = command.match(pattern);
      if (match) {
        return match[1];
      }
    }
    return null;
  }

  // Parse workflow type from voice commands
  parseWorkflowFromCommand(command: string): ClinicalContext['workflowType'] | null {
    const workflowKeywords = {
      rounds: ['rounds', 'rounding', 'morning rounds', 'bedside rounds'],
      admission: ['admission', 'admit', 'new patient', 'admitting'],
      emergency: ['emergency', 'urgent', 'stat', 'code', 'trauma'],
      discharge: ['discharge', 'discharge planning', 'going home'],
      consultation: ['consult', 'consultation', 'specialist', 'referral']
    };

    const lowerCommand = command.toLowerCase();
    
    for (const [workflow, keywords] of Object.entries(workflowKeywords)) {
      if (keywords.some(keyword => lowerCommand.includes(keyword))) {
        return workflow as ClinicalContext['workflowType'];
      }
      
    }
    
    return null;
  }

  // Generate context-aware prompts for AI
  generateContextPrompt(): string {
    const { currentRoom, currentPatient, currentUnit, workflowType, timeOfDay, physicianRole, specialty } = this.context;
    
    let prompt = "Current clinical context: ";
    
    if (timeOfDay) prompt += `It's ${timeOfDay} time. `;
    if (workflowType) prompt += `Currently in ${workflowType} workflow. `;
    if (currentRoom) prompt += `In room ${currentRoom}. `;
    if (currentUnit) prompt += `Located in ${currentUnit}. `;
    if (physicianRole) prompt += `User is a ${physicianRole}. `;
    if (specialty) prompt += `Specialty: ${specialty}. `;
    if (currentPatient) {
      prompt += `Current patient: ${currentPatient.name} (${currentPatient.diagnosis}). `;
    }
    
    prompt += "Adjust responses based on this context and prioritize relevant clinical workflows.";
    
    return prompt;
  }
}
