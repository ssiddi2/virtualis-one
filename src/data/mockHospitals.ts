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
      { name: 'Virtualis AI Assistant', enabled: true, version: '5.0.0', lastUpdate: '2024-01-20', status: 'active', usage: 97 },
      { name: 'Smart Workflow Optimization', enabled: true, version: '2.3.1', lastUpdate: '2024-01-18', status: 'active', usage: 85 }
    ],
    aiCapabilities: [
      { name: 'Clinical Decision Support', enabled: true, confidence: 94, lastTrained: '2024-01-15', version: '4.2.1' },
      { name: 'Predictive Analytics', enabled: true, confidence: 89, lastTrained: '2024-01-10', version: '3.1.0' },
      { name: 'Virtualis AI Assistant', enabled: true, confidence: 97, lastTrained: '2024-01-20', version: '5.0.0' }
    ],
    supportedModules: [
      { name: 'Clinical Documentation', enabled: true, version: '2023.1.1', lastUpdated: '2024-01-15', status: 'active' },
      { name: 'Order Management', enabled: true, version: '2023.1.1', lastUpdated: '2024-01-15', status: 'active' },
      { name: 'Medication Administration', enabled: true, version: '2023.1.0', lastUpdated: '2024-01-10', status: 'active' }
    ],
    integrations: [
      { system: 'Lab Information System', type: 'hl7', status: 'active', lastSync: '5 min ago', recordCount: 15420 },
      { system: 'Radiology PACS', type: 'fhir', status: 'active', lastSync: '3 min ago', recordCount: 3240 },
      { system: 'Pharmacy System', type: 'api', status: 'active', lastSync: '1 min ago', recordCount: 8765 }
    ],
    licenses: [
      { type: 'Provider License', count: 250, used: 187, expires: '2024-12-31', cost: 125000 },
      { type: 'Concurrent Users', count: 500, used: 342, expires: '2024-12-31', cost: 75000 },
      { type: 'Virtualis AI Suite', count: 200, used: 150, expires: '2024-12-31', cost: 95000 }
    ],
    contacts: [
      { role: 'IT Director', name: 'John Smith', email: 'j.smith@stmarys.health', phone: '(312) 555-0101', department: 'Information Technology', availability: '24/7' },
      { role: 'EMR Administrator', name: 'Sarah Johnson', email: 's.johnson@stmarys.health', phone: '(312) 555-0102', department: 'Clinical Informatics', availability: 'Business Hours' }
    ],
    systemRequirements: [
      { component: 'CPU Usage', required: '< 80%', current: '72%', status: 'met' },
      { component: 'Memory Usage', required: '< 85%', current: '68%', status: 'met' },
      { component: 'Disk Space', required: '> 20% free', current: '35% free', status: 'met' },
      { component: 'Network Latency', required: '< 50ms', current: '12ms', status: 'met' }
    ],
    maintenanceWindows: [
      { id: 'maint-1', title: 'Monthly Security Updates', startTime: '2024-02-15 02:00', endTime: '2024-02-15 04:00', type: 'planned', impact: 'low', description: 'Routine security patches and system updates' }
    ],
    recentUpdates: [
      { id: 'upd-1', version: '2023.1.2', releaseDate: '2024-01-20', type: 'virtualis_update', description: 'Enhanced Virtualis AI capabilities', installed: true },
      { id: 'upd-2', version: '2023.1.1', releaseDate: '2024-01-15', type: 'security', description: 'Critical security patches', installed: true }
    ],
    performanceMetrics: [
      { metric: 'Response Time', value: 145, unit: 'ms', trend: 'stable', benchmark: 200, status: 'good' },
      { metric: 'Uptime', value: 99.8, unit: '%', trend: 'up', benchmark: 99.5, status: 'good' },
      { metric: 'Error Rate', value: 0.02, unit: '%', trend: 'down', benchmark: 0.05, status: 'good' },
      { metric: 'Virtualis Performance', value: 97, unit: '%', trend: 'up', benchmark: 90, status: 'good' }
    ],
    userCount: 250,
    activeUsers: 187,
    storageUsed: 2.3,
    storageLimit: 5.0,
    networkLatency: 12,
    errorRate: 0.02,
    successRate: 99.98,
    backupStatus: { lastBackup: '2024-01-21 03:00', status: 'successful', size: '1.2TB' },
    disasterRecovery: { lastTest: '2024-01-15', status: 'passed', rto: '4 hours', rpo: '15 minutes' },
    auditCompliance: { lastAudit: '2023-12-15', status: 'compliant', score: 94, nextAudit: '2024-06-15' },
    alerts: [
      { id: 'alert-1', type: 'info', message: 'System maintenance scheduled for Feb 15', severity: 'low', timestamp: '2024-01-21 10:00' }
    ],
    certifications: [
      { name: 'HIPAA Compliance', status: 'active', expires: '2024-12-31', issuer: 'HHS' },
      { name: 'SOC 2 Type II', status: 'active', expires: '2024-08-15', issuer: 'AICPA' }
    ],
    authMethod: 'smart_on_fhir',
    fhirVersion: 'R4',
    interoperabilityScore: 92,
    patientSafetyScore: 96,
    qualityScore: 94,
    efficiencyScore: 88,
    overallScore: 93,
    recommendations: [
      'Consider upgrading to Epic 2024.1 for enhanced AI features',
      'Implement additional backup redundancy for disaster recovery'
    ],
    warnings: [
      'License utilization approaching 75% capacity'
    ],
    criticalIssues: []
  },
  {
    id: '2',
    name: 'Regional Medical Center',
    location: 'North Campus',
    address: '456 Healthcare Boulevard',
    city: 'Schaumburg',
    state: 'IL',
    zipCode: '60173',
    phone: '(847) 555-0200',
    email: 'contact@regional-med.org',
    website: 'https://regional-med.org',
    emrType: 'Cerner',
    emrVersion: '2023.2',
    status: 'degraded',
    connectionHealth: 'good',
    tokenExpiry: '4 hrs',
    apiHealth: 'warning',
    lastSync: '15 min ago',
    totalPatients: 987,
    activePatients: 654,
    criticalAlerts: 7,
    systemLoad: 89,
    uptime: 98.2,
    responseTime: 285,
    dataQuality: 87,
    securityLevel: 'medium',
    complianceStatus: 'partial',
    virtualisEnabled: false,
    virtualisFeatures: [
      { name: 'Basic AI Support', enabled: true, version: '1.0.0', lastUpdate: '2023-12-01', status: 'inactive', usage: 45 },
      { name: 'Workflow Assistance', enabled: false, version: '0.9.1', lastUpdate: '2023-11-15', status: 'inactive', usage: 0 }
    ],
    aiCapabilities: [
      { name: 'Clinical Decision Support', enabled: true, confidence: 78, lastTrained: '2023-12-01', version: '3.1.2' },
      { name: 'Basic Analytics', enabled: true, confidence: 82, lastTrained: '2023-11-15', version: '2.0.1' }
    ],
    supportedModules: [
      { name: 'Clinical Documentation', enabled: true, version: '2023.2.0', lastUpdated: '2024-01-01', status: 'active' },
      { name: 'Order Management', enabled: true, version: '2023.1.5', lastUpdated: '2023-12-15', status: 'active' }
    ],
    integrations: [
      { system: 'Lab Information System', type: 'hl7', status: 'active', lastSync: '20 min ago', recordCount: 9876 },
      { system: 'Pharmacy System', type: 'api', status: 'error', lastSync: '2 hours ago', recordCount: 5432 }
    ],
    licenses: [
      { type: 'Provider License', count: 150, used: 145, expires: '2024-06-30', cost: 85000 }
    ],
    contacts: [
      { role: 'CIO', name: 'Michael Davis', email: 'm.davis@regional-med.org', phone: '(847) 555-0201', department: 'IT', availability: 'Business Hours' }
    ],
    systemRequirements: [
      { component: 'CPU Usage', required: '< 80%', current: '89%', status: 'warning' },
      { component: 'Memory Usage', required: '< 85%', current: '91%', status: 'critical' },
      { component: 'Network Latency', required: '< 50ms', current: '28ms', status: 'met' }
    ],
    maintenanceWindows: [],
    recentUpdates: [
      { id: 'upd-3', version: '2023.2.1', releaseDate: '2024-01-05', type: 'bugfix', description: 'Performance improvements', installed: false }
    ],
    performanceMetrics: [
      { metric: 'Response Time', value: 285, unit: 'ms', trend: 'up', benchmark: 200, status: 'warning' },
      { metric: 'Uptime', value: 98.2, unit: '%', trend: 'down', benchmark: 99.5, status: 'warning' },
      { metric: 'AI Performance', value: 62, unit: '%', trend: 'stable', benchmark: 80, status: 'warning' }
    ],
    userCount: 150,
    activeUsers: 145,
    storageUsed: 3.8,
    storageLimit: 4.0,
    networkLatency: 28,
    errorRate: 0.15,
    successRate: 99.85,
    backupStatus: { lastBackup: '2024-01-20 03:00', status: 'successful', size: '890GB' },
    disasterRecovery: { lastTest: '2023-10-15', status: 'needs_update', rto: '8 hours', rpo: '30 minutes' },
    auditCompliance: { lastAudit: '2023-09-15', status: 'partial', score: 78, nextAudit: '2024-03-15' },
    alerts: [
      { id: 'alert-2', type: 'warning', message: 'High system load detected', severity: 'medium', timestamp: '2024-01-21 09:30' },
      { id: 'alert-3', type: 'critical', message: 'Pharmacy integration offline', severity: 'high', timestamp: '2024-01-21 08:00' }
    ],
    certifications: [
      { name: 'HIPAA Compliance', status: 'active', expires: '2024-06-30', issuer: 'HHS' }
    ],
    authMethod: 'oauth2',
    hl7Version: '2.5.1',
    interoperabilityScore: 74,
    patientSafetyScore: 82,
    qualityScore: 78,
    efficiencyScore: 71,
    overallScore: 76,
    recommendations: [
      'Urgent: Address high system load and memory usage',
      'Restore pharmacy integration connectivity',
      'Consider Virtualis AI upgrade for enhanced performance'
    ],
    warnings: [
      'System performance below optimal levels',
      'License renewal required within 6 months'
    ],
    criticalIssues: [
      'Pharmacy integration offline - affecting medication orders'
    ]
  },
  {
    id: '3',
    name: 'Children\'s Hospital',
    location: 'Pediatric Wing',
    address: '789 Kids Care Avenue',
    city: 'Chicago',
    state: 'IL',
    zipCode: '60614',
    phone: '(312) 555-0300',
    email: 'info@childrens-chicago.org',
    website: 'https://childrens-chicago.org',
    emrType: 'AI-Native',
    emrVersion: '5.0.0',
    status: 'online',
    connectionHealth: 'excellent',
    tokenExpiry: '2 hrs',
    apiHealth: 'healthy',
    lastSync: '30 sec ago',
    totalPatients: 542,
    activePatients: 387,
    criticalAlerts: 1,
    systemLoad: 45,
    uptime: 99.9,
    responseTime: 89,
    dataQuality: 98,
    securityLevel: 'high',
    complianceStatus: 'compliant',
    virtualisEnabled: true,
    virtualisFeatures: [
      { name: 'Pediatric Clinical AI', enabled: true, version: '5.0.0', lastUpdate: '2024-01-18', status: 'active', usage: 96 },
      { name: 'Growth & Development Tracking', enabled: true, version: '4.1.0', lastUpdate: '2024-01-15', status: 'active', usage: 94 },
      { name: 'Virtualis Pediatric Assistant', enabled: true, version: '5.1.0', lastUpdate: '2024-01-20', status: 'active', usage: 98 },
      { name: 'Family Communication AI', enabled: true, version: '3.2.0', lastUpdate: '2024-01-12', status: 'active', usage: 92 }
    ],
    aiCapabilities: [
      { name: 'Pediatric Clinical Decision Support', enabled: true, confidence: 96, lastTrained: '2024-01-18', version: '5.0.0' },
      { name: 'Growth & Development Tracking', enabled: true, confidence: 94, lastTrained: '2024-01-15', version: '4.1.0' },
      { name: 'Virtualis Pediatric Assistant', enabled: true, confidence: 98, lastTrained: '2024-01-20', version: '5.1.0' }
    ],
    supportedModules: [
      { name: 'Pediatric Clinical Documentation', enabled: true, version: '5.0.0', lastUpdated: '2024-01-20', status: 'active' },
      { name: 'Immunization Management', enabled: true, version: '5.0.0', lastUpdated: '2024-01-20', status: 'active' },
      { name: 'Growth Chart Integration', enabled: true, version: '4.2.1', lastUpdated: '2024-01-15', status: 'active' }
    ],
    integrations: [
      { system: 'Pediatric Lab System', type: 'fhir', status: 'active', lastSync: '2 min ago', recordCount: 4321 },
      { system: 'Immunization Registry', type: 'api', status: 'active', lastSync: '5 min ago', recordCount: 2876 },
      { system: 'School Health System', type: 'hl7', status: 'active', lastSync: '10 min ago', recordCount: 1543 }
    ],
    licenses: [
      { type: 'Pediatric Provider License', count: 120, used: 89, expires: '2025-03-31', cost: 95000 },
      { type: 'Virtualis AI Enhancement Package', count: 200, used: 120, expires: '2025-03-31', cost: 45000 }
    ],
    contacts: [
      { role: 'Chief Medical Informatics Officer', name: 'Dr. Emily Chen', email: 'e.chen@childrens-chicago.org', phone: '(312) 555-0301', department: 'Medical Informatics', availability: '24/7' }
    ],
    systemRequirements: [
      { component: 'CPU Usage', required: '< 80%', current: '45%', status: 'met' },
      { component: 'Memory Usage', required: '< 85%', current: '52%', status: 'met' },
      { component: 'AI Processing Load', required: '< 70%', current: '38%', status: 'met' }
    ],
    maintenanceWindows: [],
    recentUpdates: [
      { id: 'upd-4', version: '5.0.1', releaseDate: '2024-01-22', type: 'virtualis_update', description: 'Enhanced pediatric Virtualis AI models', installed: false }
    ],
    performanceMetrics: [
      { metric: 'Response Time', value: 89, unit: 'ms', trend: 'down', benchmark: 200, status: 'good' },
      { metric: 'AI Processing Speed', value: 340, unit: 'req/sec', trend: 'up', benchmark: 250, status: 'good' },
      { metric: 'Data Quality Score', value: 98, unit: '%', trend: 'stable', benchmark: 95, status: 'good' }
    ],
    userCount: 120,
    activeUsers: 89,
    storageUsed: 1.2,
    storageLimit: 3.0,
    networkLatency: 8,
    errorRate: 0.01,
    successRate: 99.99,
    backupStatus: { lastBackup: '2024-01-21 02:00', status: 'successful', size: '650GB' },
    disasterRecovery: { lastTest: '2024-01-01', status: 'passed', rto: '2 hours', rpo: '5 minutes' },
    auditCompliance: { lastAudit: '2024-01-01', status: 'compliant', score: 98, nextAudit: '2024-07-01' },
    alerts: [
      { id: 'alert-4', type: 'info', message: 'New Virtualis AI model update available', severity: 'low', timestamp: '2024-01-21 11:00' }
    ],
    certifications: [
      { name: 'HIPAA Compliance', status: 'active', expires: '2025-03-31', issuer: 'HHS' },
      { name: 'Pediatric Data Security', status: 'active', expires: '2024-12-31', issuer: 'AAP' }
    ],
    authMethod: 'smart_on_fhir',
    fhirVersion: 'R5',
    interoperabilityScore: 98,
    patientSafetyScore: 99,
    qualityScore: 97,
    efficiencyScore: 96,
    overallScore: 98,
    recommendations: [
      'Consider implementing new Virtualis AI model update for enhanced pediatric care',
      'Excellent system performance - maintain current optimization strategies'
    ],
    warnings: [],
    criticalIssues: []
  }
];