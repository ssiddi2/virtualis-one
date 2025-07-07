export type EMRType = 'Epic' | 'Cerner' | 'MEDITECH' | 'Allscripts' | 'athenahealth' | 'NextGen' | 'eClinicalWorks' | 'Practice Fusion' | 'Vitera' | 'Centricity' | 'AI-Native' | 'Custom';

export type HospitalStatus = 'online' | 'degraded' | 'maintenance' | 'offline' | 'emergency' | 'testing';
export type ConnectionHealth = 'excellent' | 'good' | 'fair' | 'poor' | 'critical';
export type APIHealth = 'healthy' | 'warning' | 'critical' | 'unknown';
export type SecurityLevel = 'high' | 'medium' | 'low' | 'critical';
export type ComplianceStatus = 'compliant' | 'partial' | 'non_compliant' | 'pending_audit';
export type AuthMethod = 'oauth2' | 'saml' | 'api_key' | 'smart_on_fhir';

export interface VirtualisFeature {
  name: string;
  enabled: boolean;
  version: string;
  lastUpdate: string;
  status: 'active' | 'inactive' | 'updating';
  usage: number;
}

export interface AICapability {
  name: string;
  enabled: boolean;
  confidence: number;
  lastTrained: string;
  version: string;
}

export interface HospitalModule {
  name: string;
  enabled: boolean;
  version: string;
  lastUpdated: string;
  status: 'active' | 'inactive' | 'error';
}

export interface Integration {
  system: string;
  type: 'hl7' | 'fhir' | 'api' | 'file_transfer';
  status: 'active' | 'inactive' | 'error';
  lastSync: string;
  recordCount: number;
}

export interface License {
  type: string;
  count: number;
  used: number;
  expires: string;
  cost: number;
}

export interface HospitalContact {
  role: string;
  name: string;
  email: string;
  phone: string;
  department: string;
  availability: string;
}

export interface SystemRequirement {
  component: string;
  required: string;
  current: string;
  status: 'met' | 'warning' | 'critical';
}

export interface MaintenanceWindow {
  id: string;
  title: string;
  startTime: string;
  endTime: string;
  type: 'planned' | 'emergency' | 'patch';
  impact: 'low' | 'medium' | 'high';
  description: string;
}

export interface SystemUpdate {
  id: string;
  version: string;
  releaseDate: string;
  type: 'security' | 'feature' | 'bugfix' | 'ai_enhancement' | 'virtualis_update';
  description: string;
  installed: boolean;
}

export interface PerformanceMetric {
  metric: string;
  value: number;
  unit: string;
  trend: 'up' | 'down' | 'stable';
  benchmark: number;
  status: 'good' | 'warning' | 'critical';
}

export interface BackupStatus {
  lastBackup: string;
  status: 'successful' | 'failed' | 'in_progress';
  size: string;
}

export interface DisasterRecoveryStatus {
  lastTest: string;
  status: 'passed' | 'failed' | 'needs_update';
  rto: string;
  rpo: string;
}

export interface AuditCompliance {
  lastAudit: string;
  status: 'compliant' | 'partial' | 'non_compliant';
  score: number;
  nextAudit: string;
}

export interface SystemAlert {
  id: string;
  type: 'info' | 'warning' | 'critical';
  message: string;
  severity: 'low' | 'medium' | 'high';
  timestamp: string;
  acknowledged?: boolean;
}

export interface Certification {
  name: string;
  status: 'active' | 'expired' | 'pending';
  expires: string;
  issuer: string;
}

export interface EnhancedHospital {
  id: string;
  name: string;
  location: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  phone: string;
  email: string;
  website: string;
  emrType: EMRType;
  emrVersion: string;
  status: HospitalStatus;
  connectionHealth: ConnectionHealth;
  tokenExpiry: string;
  apiHealth: APIHealth;
  lastSync: string;
  totalPatients: number;
  activePatients: number;
  criticalAlerts: number;
  systemLoad: number;
  uptime: number;
  responseTime: number;
  dataQuality: number;
  securityLevel: SecurityLevel;
  complianceStatus: ComplianceStatus;
  virtualisEnabled: boolean;
  virtualisFeatures: VirtualisFeature[];
  aiCapabilities: AICapability[];
  supportedModules: HospitalModule[];
  integrations: Integration[];
  licenses: License[];
  contacts: HospitalContact[];
  systemRequirements: SystemRequirement[];
  maintenanceWindows: MaintenanceWindow[];
  recentUpdates: SystemUpdate[];
  performanceMetrics: PerformanceMetric[];
  userCount: number;
  activeUsers: number;
  storageUsed: number;
  storageLimit: number;
  networkLatency: number;
  errorRate: number;
  successRate: number;
  backupStatus: BackupStatus;
  disasterRecovery: DisasterRecoveryStatus;
  auditCompliance: AuditCompliance;
  alerts: SystemAlert[];
  certifications: Certification[];
  authMethod: AuthMethod;
  fhirVersion?: string;
  hl7Version?: string;
  interoperabilityScore: number;
  patientSafetyScore: number;
  qualityScore: number;
  efficiencyScore: number;
  overallScore: number;
  recommendations: string[];
  warnings: string[];
  criticalIssues: string[];
}

export interface HospitalSelectorProps {
  onSelectHospital: (hospitalId: string) => void;
  allowMultipleSelection?: boolean;
  showAdvancedMetrics?: boolean;
  filterByRole?: boolean;
  emergencyMode?: boolean;
}