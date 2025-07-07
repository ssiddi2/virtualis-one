import { EnhancedHospital } from '@/types/hospital';

export const mockHospitals: EnhancedHospital[] = [
  {
    id: '1',
    name: 'St. Mary\'s General Hospital',
    location: 'Downtown Campus',
    address: '123 Medical Center Drive',
    city: 'Chicago',
    state: 'IL',
    zipCode: '60601',
    phone: '(312) 555-0100',
    email: 'info@stmarys.health',
    website: 'https://stmarys.health',
    emrType: 'Epic',
    emrVersion: '2023.1',
    status: 'online',
    connectionHealth: 'excellent',
    tokenExpiry: '45 min',
    apiHealth: 'healthy',
    lastSync: '2 min ago',
    totalPatients: 1247,
    activePatients: 892,
    criticalAlerts: 3,
    systemLoad: 72,
    uptime: 99.8,
    responseTime: 145,
    dataQuality: 94,
    securityLevel: 'high',
    complianceStatus: 'compliant',
    virtualisEnabled: true,
    virtualisFeatures: [
      { name: 'Clinical Decision Support', enabled: true, version: '4.2.1', lastUpdate: '2024-01-15', status: 'active', usage: 94 },
      { name: 'Predictive Analytics', enabled: true, version: '3.1.0', lastUpdate: '2024-01-10', status: 'active', usage: 89 },
      { name: 'Virtualis AI Assistant', enabled: true, version: '5.0.0', lastUpdate: '2024-01-20', status: 'active', usage: 97 }
    ],
    aiCapabilities: [
      { name: 'Diagnostic AI', enabled: true, confidence: 92, lastTrained: '2024-01-20', version: '2.1.0' },
      { name: 'Risk Assessment', enabled: true, confidence: 89, lastTrained: '2024-01-18', version: '1.8.3' }
    ],
    supportedModules: [
      { name: 'Patient Portal', enabled: true, version: '3.2.1', lastUpdated: '2024-01-15', status: 'active' },
      { name: 'Telehealth', enabled: true, version: '2.9.0', lastUpdated: '2024-01-10', status: 'active' }
    ],
    integrations: [
      { system: 'Lab Information System', type: 'hl7', status: 'active', lastSync: '2 min ago', recordCount: 15234 },
      { system: 'Radiology PACS', type: 'fhir', status: 'active', lastSync: '5 min ago', recordCount: 8901 }
    ],
    licenses: [
      { type: 'Virtualis Core', count: 500, used: 375, expires: '2024-12-31', cost: 45000 },
      { type: 'AI Analytics', count: 200, used: 187, expires: '2024-12-31', cost: 25000 }
    ],
    contacts: [
      { role: 'CIO', name: 'Dr. Sarah Johnson', email: 'sarah.johnson@stmarys.health', phone: '(312) 555-0101', department: 'IT', availability: '24/7' },
      { role: 'CMO', name: 'Dr. Michael Chen', email: 'michael.chen@stmarys.health', phone: '(312) 555-0102', department: 'Medical', availability: 'Mon-Fri 8AM-6PM' }
    ],
    systemRequirements: [
      { component: 'CPU', required: '16 cores', current: '32 cores', status: 'met' },
      { component: 'Memory', required: '64GB', current: '128GB', status: 'met' }
    ],
    maintenanceWindows: [
      { id: '1', title: 'Security Patch', startTime: '2024-02-15T02:00:00Z', endTime: '2024-02-15T04:00:00Z', type: 'planned', impact: 'low', description: 'Monthly security updates' }
    ],
    recentUpdates: [
      { id: '1', version: '2024.1.2', releaseDate: '2024-01-20', type: 'ai_enhancement', description: 'Enhanced diagnostic AI capabilities', installed: true }
    ],
    performanceMetrics: [
      { metric: 'CPU Usage', value: 72, unit: '%', trend: 'stable', benchmark: 80, status: 'good' },
      { metric: 'Memory Usage', value: 68, unit: '%', trend: 'down', benchmark: 85, status: 'good' }
    ],
    backupStatus: { lastBackup: '2024-01-30T02:00:00Z', status: 'successful', size: '2.3TB' },
    disasterRecovery: { lastTest: '2024-01-15', status: 'passed', rto: '4 hours', rpo: '15 minutes' },
    auditCompliance: { lastAudit: '2024-01-15', status: 'compliant', score: 95, nextAudit: '2024-07-15' },
    alerts: [
      { id: '1', type: 'warning', message: 'License utilization at 75%', severity: 'medium', timestamp: '2024-01-30T10:00:00Z', acknowledged: false }
    ],
    certifications: [
      { name: 'HIPAA Compliance', status: 'active', expires: '2024-12-31', issuer: 'HHS' },
      { name: 'SOC 2 Type II', status: 'active', expires: '2024-06-30', issuer: 'AICPA' }
    ],
    authMethod: 'smart_on_fhir',
    fhirVersion: 'R4',
    hl7Version: '2.8',
    overallScore: 93,
    networkLatency: 12,
    errorRate: 0.02,
    successRate: 99.98,
    userCount: 250,
    activeUsers: 187,
    storageUsed: 2.3,
    storageLimit: 5.0,
    recommendations: ['Consider upgrading to Epic 2024.1 for enhanced AI features'],
    warnings: ['License utilization approaching 75% capacity'],
    criticalIssues: [],
    interoperabilityScore: 92,
    patientSafetyScore: 96,
    qualityScore: 94,
    efficiencyScore: 88,
  },
  {
    id: '2',
    name: 'Regional Medical Center',
    location: 'North Campus',
    address: '456 Healthcare Boulevard',
    city: 'Chicago',
    state: 'IL',
    zipCode: '60614',
    phone: '(312) 555-0200',
    email: 'contact@regionalmed.org',
    website: 'https://regionalmed.org',
    emrType: 'Cerner',
    emrVersion: '2023.2',
    status: 'degraded',
    connectionHealth: 'good',
    tokenExpiry: '4 hrs',
    apiHealth: 'warning',
    lastSync: '15 min ago',
    totalPatients: 892,
    activePatients: 634,
    criticalAlerts: 8,
    systemLoad: 89,
    uptime: 97.2,
    responseTime: 287,
    dataQuality: 88,
    securityLevel: 'medium',
    complianceStatus: 'compliant',
    virtualisEnabled: true,
    virtualisFeatures: [
      { name: 'Clinical Decision Support', enabled: true, version: '4.1.0', lastUpdate: '2023-12-20', status: 'active', usage: 78 },
      { name: 'Predictive Analytics', enabled: false, version: '2.8.5', lastUpdate: '2023-11-15', status: 'inactive', usage: 0 },
      { name: 'Virtualis AI Assistant', enabled: true, version: '4.9.2', lastUpdate: '2024-01-18', status: 'active', usage: 82 }
    ],
    aiCapabilities: [
      { name: 'Diagnostic AI', enabled: false, confidence: 78, lastTrained: '2023-11-20', version: '1.9.2' }
    ],
    supportedModules: [
      { name: 'Patient Portal', enabled: true, version: '2.8.1', lastUpdated: '2023-12-10', status: 'active' }
    ],
    integrations: [
      { system: 'Lab System', type: 'hl7', status: 'error', lastSync: '15 min ago', recordCount: 8234 }
    ],
    licenses: [
      { type: 'Cerner Core', count: 300, used: 267, expires: '2024-08-31', cost: 35000 }
    ],
    contacts: [
      { role: 'IT Director', name: 'Mark Thompson', email: 'mark.thompson@regionalmed.org', phone: '(312) 555-0201', department: 'IT', availability: 'Mon-Fri 8AM-6PM' }
    ],
    systemRequirements: [
      { component: 'CPU', required: '12 cores', current: '12 cores', status: 'met' },
      { component: 'Memory', required: '32GB', current: '28GB', status: 'warning' }
    ],
    maintenanceWindows: [],
    recentUpdates: [
      { id: '2', version: '2023.2.1', releaseDate: '2023-12-15', type: 'bugfix', description: 'Performance improvements', installed: true }
    ],
    performanceMetrics: [
      { metric: 'CPU Usage', value: 89, unit: '%', trend: 'up', benchmark: 80, status: 'warning' }
    ],
    backupStatus: { lastBackup: '2024-01-29T02:00:00Z', status: 'successful', size: '1.8TB' },
    disasterRecovery: { lastTest: '2023-12-15', status: 'passed', rto: '6 hours', rpo: '30 minutes' },
    auditCompliance: { lastAudit: '2023-12-15', status: 'compliant', score: 82, nextAudit: '2024-06-15' },
    alerts: [
      { id: '2', type: 'warning', message: 'System performance degraded', severity: 'high', timestamp: '2024-01-30T08:00:00Z', acknowledged: false }
    ],
    certifications: [
      { name: 'HIPAA Compliance', status: 'active', expires: '2024-12-31', issuer: 'HHS' }
    ],
    authMethod: 'oauth2',
    fhirVersion: 'R4',
    hl7Version: '2.7',
    overallScore: 76,
    networkLatency: 28,
    errorRate: 0.15,
    successRate: 99.85,
    userCount: 180,
    activeUsers: 142,
    storageUsed: 1.8,
    storageLimit: 3.0,
    recommendations: ['Upgrade Cerner to latest version', 'Enable Predictive Analytics module'],
    warnings: ['High system load detected', 'API response times elevated'],
    criticalIssues: ['Database performance degradation'],
    interoperabilityScore: 84,
    patientSafetyScore: 91,
    qualityScore: 87,
    efficiencyScore: 73
  },
  {
    id: '3',
    name: 'Children\'s Hospital',
    location: 'Pediatric Campus',
    address: '789 Kids Care Lane',
    city: 'Chicago',
    state: 'IL',
    zipCode: '60611',
    phone: '(312) 555-0300',
    email: 'info@childrenshospital.org',
    website: 'https://childrenshospital.org',
    emrType: 'Epic',
    emrVersion: '2024.1',
    status: 'online',
    connectionHealth: 'excellent',
    tokenExpiry: '2 hrs',
    apiHealth: 'healthy',
    lastSync: '5 min ago',
    totalPatients: 456,
    activePatients: 234,
    criticalAlerts: 1,
    systemLoad: 45,
    uptime: 99.9,
    responseTime: 98,
    dataQuality: 97,
    securityLevel: 'high',
    complianceStatus: 'compliant',
    virtualisEnabled: true,
    virtualisFeatures: [
      { name: 'Clinical Decision Support', enabled: true, version: '4.3.0', lastUpdate: '2024-01-25', status: 'active', usage: 96 },
      { name: 'Predictive Analytics', enabled: true, version: '3.2.1', lastUpdate: '2024-01-22', status: 'active', usage: 91 },
      { name: 'Virtualis AI Assistant', enabled: true, version: '5.1.0', lastUpdate: '2024-01-28', status: 'active', usage: 98 }
    ],
    aiCapabilities: [
      { name: 'Pediatric AI', enabled: true, confidence: 96, lastTrained: '2024-01-25', version: '3.1.0' },
      { name: 'Growth Monitoring', enabled: true, confidence: 94, lastTrained: '2024-01-22', version: '2.8.1' }
    ],
    supportedModules: [
      { name: 'Pediatric Portal', enabled: true, version: '4.1.0', lastUpdated: '2024-01-20', status: 'active' },
      { name: 'Growth Charts', enabled: true, version: '3.5.2', lastUpdated: '2024-01-18', status: 'active' }
    ],
    integrations: [
      { system: 'Pediatric Lab System', type: 'fhir', status: 'active', lastSync: '5 min ago', recordCount: 5234 },
      { system: 'Immunization Registry', type: 'hl7', status: 'active', lastSync: '10 min ago', recordCount: 12456 }
    ],
    licenses: [
      { type: 'Epic Pediatric', count: 150, used: 78, expires: '2024-12-31', cost: 28000 },
      { type: 'Pediatric AI', count: 100, used: 78, expires: '2024-12-31', cost: 15000 }
    ],
    contacts: [
      { role: 'CMIO', name: 'Dr. Emily Rodriguez', email: 'emily.rodriguez@childrenshospital.org', phone: '(312) 555-0301', department: 'Medical Informatics', availability: '24/7' }
    ],
    systemRequirements: [
      { component: 'CPU', required: '8 cores', current: '16 cores', status: 'met' },
      { component: 'Memory', required: '32GB', current: '64GB', status: 'met' }
    ],
    maintenanceWindows: [
      { id: '3', title: 'Pediatric System Update', startTime: '2024-02-20T01:00:00Z', endTime: '2024-02-20T03:00:00Z', type: 'planned', impact: 'low', description: 'Pediatric module updates' }
    ],
    recentUpdates: [
      { id: '3', version: '2024.1.1', releaseDate: '2024-01-25', type: 'feature', description: 'Enhanced pediatric workflows', installed: true }
    ],
    performanceMetrics: [
      { metric: 'CPU Usage', value: 45, unit: '%', trend: 'stable', benchmark: 60, status: 'good' },
      { metric: 'Response Time', value: 98, unit: 'ms', trend: 'down', benchmark: 150, status: 'good' }
    ],
    backupStatus: { lastBackup: '2024-01-30T01:00:00Z', status: 'successful', size: '1.2TB' },
    disasterRecovery: { lastTest: '2024-01-20', status: 'passed', rto: '2 hours', rpo: '5 minutes' },
    auditCompliance: { lastAudit: '2024-01-20', status: 'compliant', score: 98, nextAudit: '2024-07-20' },
    alerts: [],
    certifications: [
      { name: 'HIPAA Compliance', status: 'active', expires: '2024-12-31', issuer: 'HHS' },
      { name: 'Pediatric Safety Certification', status: 'active', expires: '2024-09-30', issuer: 'Joint Commission' }
    ],
    authMethod: 'smart_on_fhir',
    fhirVersion: 'R5',
    hl7Version: '2.8',
    overallScore: 98,
    networkLatency: 8,
    errorRate: 0.01,
    successRate: 99.99,
    userCount: 95,
    activeUsers: 78,
    storageUsed: 1.2,
    storageLimit: 2.5,
    recommendations: ['System performing optimally'],
    warnings: [],
    criticalIssues: [],
    interoperabilityScore: 98,
    patientSafetyScore: 99,
    qualityScore: 97,
    efficiencyScore: 96
  },
  {
    id: '4',
    name: 'University Medical',
    location: 'Teaching Hospital',
    address: '321 Academic Drive',
    city: 'Chicago',
    state: 'IL',
    zipCode: '60637',
    phone: '(312) 555-0400',
    email: 'admin@universitymed.edu',
    website: 'https://universitymed.edu',
    emrType: 'Allscripts',
    emrVersion: '2022.3',
    status: 'maintenance',
    connectionHealth: 'fair',
    tokenExpiry: '1 hr',
    apiHealth: 'warning',
    lastSync: '2 hrs ago',
    totalPatients: 1543,
    activePatients: 987,
    criticalAlerts: 12,
    systemLoad: 95,
    uptime: 94.5,
    responseTime: 450,
    dataQuality: 82,
    securityLevel: 'medium',
    complianceStatus: 'pending_audit',
    virtualisEnabled: false,
    virtualisFeatures: [
      { name: 'Clinical Decision Support', enabled: false, version: '3.8.2', lastUpdate: '2023-09-10', status: 'inactive', usage: 0 },
      { name: 'Predictive Analytics', enabled: false, version: '2.5.1', lastUpdate: '2023-08-15', status: 'inactive', usage: 0 },
      { name: 'Virtualis AI Assistant', enabled: false, version: '4.2.0', lastUpdate: '2023-10-05', status: 'inactive', usage: 0 }
    ],
    aiCapabilities: [
      { name: 'Legacy AI', enabled: false, confidence: 65, lastTrained: '2023-06-15', version: '1.2.0' }
    ],
    supportedModules: [
      { name: 'Academic Portal', enabled: true, version: '1.8.5', lastUpdated: '2023-09-10', status: 'active' },
      { name: 'Research Module', enabled: false, version: '1.2.0', lastUpdated: '2023-05-15', status: 'inactive' }
    ],
    integrations: [
      { system: 'Legacy Lab System', type: 'file_transfer', status: 'error', lastSync: '2 hrs ago', recordCount: 12000 }
    ],
    licenses: [
      { type: 'Allscripts Academic', count: 500, used: 485, expires: '2024-05-31', cost: 42000 }
    ],
    contacts: [
      { role: 'CIO', name: 'Dr. Robert Kim', email: 'robert.kim@universitymed.edu', phone: '(312) 555-0401', department: 'IT', availability: 'Mon-Fri 9AM-5PM' }
    ],
    systemRequirements: [
      { component: 'CPU', required: '16 cores', current: '12 cores', status: 'critical' },
      { component: 'Memory', required: '64GB', current: '48GB', status: 'warning' }
    ],
    maintenanceWindows: [
      { id: '4', title: 'System Upgrade', startTime: '2024-02-10T20:00:00Z', endTime: '2024-02-11T06:00:00Z', type: 'emergency', impact: 'high', description: 'Critical system upgrade' }
    ],
    recentUpdates: [
      { id: '4', version: '2022.3.2', releaseDate: '2023-10-15', type: 'security', description: 'Security patches', installed: false }
    ],
    performanceMetrics: [
      { metric: 'CPU Usage', value: 95, unit: '%', trend: 'up', benchmark: 80, status: 'critical' },
      { metric: 'Memory Usage', value: 92, unit: '%', trend: 'up', benchmark: 85, status: 'critical' }
    ],
    backupStatus: { lastBackup: '2024-01-28T02:00:00Z', status: 'failed', size: '3.8TB' },
    disasterRecovery: { lastTest: '2023-09-15', status: 'needs_update', rto: '12 hours', rpo: '4 hours' },
    auditCompliance: { lastAudit: '2023-09-15', status: 'non_compliant', score: 58, nextAudit: '2024-03-15' },
    alerts: [
      { id: '4', type: 'critical', message: 'System performance critical', severity: 'high', timestamp: '2024-01-30T12:00:00Z', acknowledged: false },
      { id: '5', type: 'warning', message: 'Backup failure detected', severity: 'high', timestamp: '2024-01-28T02:15:00Z', acknowledged: false }
    ],
    certifications: [
      { name: 'HIPAA Compliance', status: 'expired', expires: '2023-12-31', issuer: 'HHS' }
    ],
    authMethod: 'api_key',
    fhirVersion: 'STU3',
    hl7Version: '2.5',
    overallScore: 58,
    networkLatency: 45,
    errorRate: 0.8,
    successRate: 99.2,
    userCount: 320,
    activeUsers: 198,
    storageUsed: 4.1,
    storageLimit: 5.0,
    recommendations: ['Schedule Allscripts upgrade', 'Enable Virtualis integration', 'Review system performance'],
    warnings: ['System under maintenance', 'High error rates detected', 'Compliance review pending'],
    criticalIssues: ['Performance degradation', 'Security audit required'],
    interoperabilityScore: 65,
    patientSafetyScore: 78,
    qualityScore: 71,
    efficiencyScore: 52
  }
];