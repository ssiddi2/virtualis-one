export type HospitalStatus = 'online' | 'degraded' | 'maintenance' | 'offline';
export type ConnectionHealth = 'excellent' | 'good' | 'fair' | 'poor';
export type APIHealth = 'healthy' | 'warning' | 'error';
export type EMRType = 'Epic' | 'Cerner' | 'Allscripts' | 'Meditech' | 'athenahealth';
export type AuthMethod = 'smart_on_fhir' | 'oauth2' | 'saml' | 'api_key';
export type FHIRVersion = 'R4' | 'R5' | 'DSTU2' | 'STU3';

export interface VirtualisFeature {
  name: string;
  enabled: boolean;
  version: string;
  lastUpdate: string;
  status: 'active' | 'inactive' | 'updating';
  usage: number; // percentage
}

export interface EnhancedHospital {
  // Basic Information
  id: string;
  name: string;
  location: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  phone: string;
  email?: string;
  website?: string;

  // EMR Information
  emrType: EMRType;
  emrVersion: string;
  status: HospitalStatus;
  connectionHealth: ConnectionHealth;
  tokenExpiry: string;
  apiHealth: APIHealth;
  lastSync: string;

  // Metrics
  totalPatients: number;
  activePatients: number;
  criticalAlerts: number;
  systemLoad: number; // percentage
  uptime: number; // percentage
  responseTime: number; // milliseconds
  dataQuality: number; // percentage
  securityLevel: 'low' | 'medium' | 'high' | 'enterprise';
  complianceStatus: 'compliant' | 'non_compliant' | 'pending';

  // Virtualis Integration
  virtualisEnabled: boolean;
  virtualisFeatures: VirtualisFeature[];
  overallScore: number; // 0-100

  // Performance Metrics
  networkLatency: number; // milliseconds
  errorRate: number; // percentage
  successRate: number; // percentage
  userCount: number;
  activeUsers: number;
  storageUsed: number; // GB
  storageLimit: number; // GB

  // Health & Quality Scores
  interoperabilityScore: number; // 0-100
  patientSafetyScore: number; // 0-100
  qualityScore: number; // 0-100
  efficiencyScore: number; // 0-100

  // System Information
  authMethod: AuthMethod;
  fhirVersion: FHIRVersion;

  // Recommendations & Issues
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