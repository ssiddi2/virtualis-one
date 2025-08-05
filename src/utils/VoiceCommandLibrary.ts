interface VoiceCommand {
  id: string;
  patterns: string[];
  description: string;
  category: 'navigation' | 'documentation' | 'orders' | 'patient' | 'communication' | 'workflow';
  specialty?: string;
  action: (params?: any) => any;
  requiredParams?: string[];
}

export class VoiceCommandLibrary {
  private commands: VoiceCommand[] = [];
  private specialty?: string;

  constructor(specialty?: string) {
    this.specialty = specialty;
    this.initializeCommands();
  }

  private initializeCommands() {
    // General Navigation Commands
    this.addCommand({
      id: 'navigate_patient_chart',
      patterns: [
        'show patient chart',
        'open patient chart',
        'navigate to patient chart',
        'go to chart',
        'chart view'
      ],
      description: 'Navigate to patient chart',
      category: 'navigation',
      action: () => ({ type: 'navigate', destination: '/patients' })
    });

    this.addCommand({
      id: 'navigate_lab_results',
      patterns: [
        'show lab results',
        'open labs',
        'check lab values',
        'laboratory results',
        'show labs'
      ],
      description: 'View laboratory results',
      category: 'navigation',
      action: () => ({ type: 'navigate', destination: '/clinical', section: 'labs' })
    });

    this.addCommand({
      id: 'navigate_medications',
      patterns: [
        'show medications',
        'open med list',
        'medication orders',
        'drug list',
        'current meds'
      ],
      description: 'View current medications',
      category: 'navigation',
      action: () => ({ type: 'navigate', destination: '/cpoe', section: 'medications' })
    });

    // Room Navigation
    this.addCommand({
      id: 'switch_room',
      patterns: [
        'switch to room {room}',
        'go to room {room}',
        'room {room}',
        'patient in room {room}',
        'bed {room}'
      ],
      description: 'Switch to specific patient room',
      category: 'patient',
      requiredParams: ['room'],
      action: (params) => ({ 
        type: 'switch_room', 
        room: params?.room,
        autoSwitchPatient: true 
      })
    });

    // Documentation Commands
    this.addCommand({
      id: 'create_progress_note',
      patterns: [
        'create progress note',
        'new progress note',
        'write progress note',
        'document progress',
        'progress note'
      ],
      description: 'Create a new progress note',
      category: 'documentation',
      action: () => ({ type: 'create_note', noteType: 'progress' })
    });

    this.addCommand({
      id: 'create_soap_note',
      patterns: [
        'create soap note',
        'new soap note',
        'soap documentation',
        'subjective objective assessment plan'
      ],
      description: 'Create a SOAP note',
      category: 'documentation',
      action: () => ({ type: 'create_note', noteType: 'soap' })
    });

    // Order Entry Commands
    this.addCommand({
      id: 'order_lab_work',
      patterns: [
        'order lab work',
        'place lab order',
        'order {labType}',
        'get labs',
        'lab order'
      ],
      description: 'Place laboratory orders',
      category: 'orders',
      action: (params) => ({ 
        type: 'create_order', 
        orderType: 'lab',
        details: params?.labType || 'comprehensive metabolic panel'
      })
    });

    this.addCommand({
      id: 'order_medication',
      patterns: [
        'order medication',
        'prescribe {medication}',
        'start {medication}',
        'order {medication}',
        'medication order'
      ],
      description: 'Place medication orders',
      category: 'orders',
      requiredParams: ['medication'],
      action: (params) => ({ 
        type: 'create_order', 
        orderType: 'medication',
        medication: params?.medication
      })
    });

    // Specialty-Specific Commands
    this.addSpecialtyCommands();

    // Emergency/Urgent Commands
    this.addEmergencyCommands();

    // Nursing-Specific Commands  
    this.addNursingCommands();
  }

  private addSpecialtyCommands() {
    if (this.specialty === 'cardiology') {
      this.addCommand({
        id: 'order_ecg',
        patterns: [
          'order ecg',
          'get an ekg',
          'electrocardiogram',
          'twelve lead',
          'stat ecg'
        ],
        description: 'Order ECG/EKG',
        category: 'orders',
        specialty: 'cardiology',
        action: () => ({ type: 'create_order', orderType: 'diagnostic', test: 'ECG' })
      });

      this.addCommand({
        id: 'order_echo',
        patterns: [
          'order echo',
          'echocardiogram',
          'cardiac ultrasound',
          'echo study'
        ],
        description: 'Order echocardiogram',
        category: 'orders',
        specialty: 'cardiology',
        action: () => ({ type: 'create_order', orderType: 'diagnostic', test: 'Echocardiogram' })
      });
    }

    if (this.specialty === 'emergency') {
      this.addCommand({
        id: 'triage_assessment',
        patterns: [
          'triage this patient',
          'assess severity',
          'emergency assessment',
          'triage level'
        ],
        description: 'Perform triage assessment',
        category: 'workflow',
        specialty: 'emergency',
        action: () => ({ type: 'workflow', action: 'triage_assessment' })
      });
    }
  }

  private addEmergencyCommands() {
    this.addCommand({
      id: 'emergency_response',
      patterns: [
        'code blue',
        'code red',
        'cardiac arrest',
        'respiratory arrest',
        'emergency response'
      ],
      description: 'Emergency response protocols',
      category: 'workflow',
      action: (params) => ({ 
        type: 'emergency_response',
        codeType: params?.codeType || 'general emergency'
      })
    });

    this.addCommand({
      id: 'stat_orders',
      patterns: [
        'stat {orderType}',
        'urgent {orderType}',
        'emergency {orderType}',
        'now {orderType}'
      ],
      description: 'Urgent/STAT orders',
      category: 'orders',
      action: (params) => ({
        type: 'create_order',
        priority: 'STAT',
        orderType: params?.orderType
      })
    });
  }

  private addNursingCommands() {
    this.addCommand({
      id: 'medication_administration',
      patterns: [
        'given {medication}',
        'administered {medication}',
        'med given',
        'medication administered to patient'
      ],
      description: 'Document medication administration',
      category: 'documentation',
      action: (params) => ({
        type: 'document_med_admin',
        medication: params?.medication,
        timestamp: new Date()
      })
    });

    this.addCommand({
      id: 'vital_signs_documentation',
      patterns: [
        'vitals taken',
        'blood pressure {bp}',
        'heart rate {hr}',
        'temperature {temp}',
        'document vitals'
      ],
      description: 'Document vital signs',
      category: 'documentation',
      action: (params) => ({
        type: 'document_vitals',
        vitals: params
      })
    });

    this.addCommand({
      id: 'nursing_assessment',
      patterns: [
        'nursing assessment',
        'patient assessment',
        'bedside assessment',
        'shift assessment'
      ],
      description: 'Perform nursing assessment',
      category: 'documentation',
      action: () => ({ type: 'create_assessment', assessmentType: 'nursing' })
    });
  }

  private addCommand(command: VoiceCommand) {
    this.commands.push(command);
  }

  matchCommand(input: string): { command: VoiceCommand; params?: any } | null {
    const normalizedInput = input.toLowerCase().trim();
    
    for (const command of this.commands) {
      for (const pattern of command.patterns) {
        const match = this.matchPattern(normalizedInput, pattern);
        if (match) {
          return {
            command,
            params: match.params
          };
        }
      }
    }
    
    return null;
  }

  private matchPattern(input: string, pattern: string): { params?: any } | null {
    // Convert pattern to regex, handling {param} placeholders
    let regexPattern = pattern.toLowerCase();
    const params: any = {};
    
    // Find all parameter placeholders
    const paramMatches = pattern.match(/\{(\w+)\}/g);
    
    if (paramMatches) {
      for (const paramMatch of paramMatches) {
        const paramName = paramMatch.slice(1, -1); // Remove { }
        regexPattern = regexPattern.replace(paramMatch, '([\\w\\s]+)');
      }
      
      const regex = new RegExp(`^${regexPattern}$`);
      const match = input.match(regex);
      
      if (match) {
        paramMatches.forEach((paramMatch, index) => {
          const paramName = paramMatch.slice(1, -1);
          params[paramName] = match[index + 1]?.trim();
        });
        
        return { params };
      }
    } else {
      // Simple exact match (with some fuzzy matching)
      if (this.fuzzyMatch(input, pattern.toLowerCase())) {
        return {};
      }
    }
    
    return null;
  }

  private fuzzyMatch(input: string, pattern: string): boolean {
    // Simple fuzzy matching - check if all words in pattern exist in input
    const patternWords = pattern.split(' ');
    const inputWords = input.split(' ');
    
    return patternWords.every(word => 
      inputWords.some(inputWord => 
        inputWord.includes(word) || word.includes(inputWord)
      )
    );
  }

  getCommandsByCategory(category: VoiceCommand['category']): VoiceCommand[] {
    return this.commands.filter(cmd => cmd.category === category);
  }

  getSpecialtyCommands(): VoiceCommand[] {
    return this.commands.filter(cmd => cmd.specialty === this.specialty);
  }

  getAllCommands(): VoiceCommand[] {
    return [...this.commands];
  }

  getCommandHelp(): string {
    const categories = ['navigation', 'documentation', 'orders', 'patient', 'communication', 'workflow'];
    let help = "Available voice commands:\n\n";
    
    categories.forEach(category => {
      const categoryCommands = this.getCommandsByCategory(category as VoiceCommand['category']);
      if (categoryCommands.length > 0) {
        help += `${category.toUpperCase()}:\n`;
        categoryCommands.forEach(cmd => {
          help += `  • ${cmd.patterns[0]} - ${cmd.description}\n`;
        });
        help += "\n";
      }
    });
    
    return help;
  }
}