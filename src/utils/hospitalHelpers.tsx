import React from 'react';
import { HospitalStatus, ConnectionHealth, APIHealth, SecurityLevel, ComplianceStatus } from '@/types/hospital';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, Settings, X, CheckCircle, Wifi, Monitor, Shield, Brain, TrendingUp } from 'lucide-react';

export const getStatusBadge = (status: HospitalStatus) => {
  const baseClass = "px-2 py-1 rounded-full text-xs font-medium border";
  switch (status) {
    case 'online':
      return <Badge className={`${baseClass} bg-green-600/20 text-green-300 border-green-400/30`}>
        <div className="w-2 h-2 bg-green-400 rounded-full mr-1 animate-pulse"></div>
        Online
      </Badge>;
    case 'degraded':
      return <Badge className={`${baseClass} bg-yellow-600/20 text-yellow-300 border-yellow-400/30`}>
        <AlertTriangle className="w-3 h-3 mr-1" />
        Degraded
      </Badge>;
    case 'maintenance':
      return <Badge className={`${baseClass} bg-blue-600/20 text-blue-300 border-blue-400/30`}>
        <Settings className="w-3 h-3 mr-1" />
        Maintenance
      </Badge>;
    case 'offline':
      return <Badge className={`${baseClass} bg-red-600/20 text-red-300 border-red-400/30`}>
        <X className="w-3 h-3 mr-1" />
        Offline
      </Badge>;
    case 'emergency':
      return <Badge className={`${baseClass} bg-red-700/20 text-red-200 border-red-500/30`}>
        <AlertTriangle className="w-3 h-3 mr-1 animate-pulse" />
        Emergency
      </Badge>;
    case 'testing':
      return <Badge className={`${baseClass} bg-purple-600/20 text-purple-300 border-purple-400/30`}>
        <Monitor className="w-3 h-3 mr-1" />
        Testing
      </Badge>;
    default:
      return <Badge variant="outline">Unknown</Badge>;
  }
};

export const getConnectionHealthBadge = (health: ConnectionHealth) => {
  const baseClass = "px-2 py-1 rounded-full text-xs font-medium border";
  switch (health) {
    case 'excellent':
      return <Badge className={`${baseClass} bg-green-700/20 text-green-200 border-green-500/30`}>
        <Wifi className="w-3 h-3 mr-1" />
        Excellent
      </Badge>;
    case 'good':
      return <Badge className={`${baseClass} bg-green-600/20 text-green-300 border-green-400/30`}>
        <Wifi className="w-3 h-3 mr-1" />
        Good
      </Badge>;
    case 'fair':
      return <Badge className={`${baseClass} bg-yellow-600/20 text-yellow-300 border-yellow-400/30`}>
        <Wifi className="w-3 h-3 mr-1" />
        Fair
      </Badge>;
    case 'poor':
      return <Badge className={`${baseClass} bg-red-600/20 text-red-300 border-red-400/30`}>
        <Wifi className="w-3 h-3 mr-1" />
        Poor
      </Badge>;
    case 'critical':
      return <Badge className={`${baseClass} bg-red-700/20 text-red-200 border-red-500/30`}>
        <AlertTriangle className="w-3 h-3 mr-1 animate-pulse" />
        Critical
      </Badge>;
    default:
      return <Badge variant="outline">Unknown</Badge>;
  }
};

export const getApiHealthBadge = (health: APIHealth) => {
  const baseClass = "px-2 py-1 rounded-full text-xs font-medium border";
  switch (health) {
    case 'healthy':
      return <Badge className={`${baseClass} bg-green-600/20 text-green-300 border-green-400/30`}>
        <CheckCircle className="w-3 h-3 mr-1" />
        Healthy
      </Badge>;
    case 'warning':
      return <Badge className={`${baseClass} bg-yellow-600/20 text-yellow-300 border-yellow-400/30`}>
        <AlertTriangle className="w-3 h-3 mr-1" />
        Warning
      </Badge>;
    case 'critical':
      return <Badge className={`${baseClass} bg-red-600/20 text-red-300 border-red-400/30`}>
        <X className="w-3 h-3 mr-1" />
        Critical
      </Badge>;
    case 'unknown':
      return <Badge className={`${baseClass} bg-slate-600/20 text-slate-300 border-slate-400/30`}>
        <X className="w-3 h-3 mr-1" />
        Unknown
      </Badge>;
    default:
      return <Badge variant="outline">Unknown</Badge>;
  }
};

export const getSecurityLevelBadge = (level: SecurityLevel) => {
  const baseClass = "px-2 py-1 rounded-full text-xs font-medium border";
  switch (level) {
    case 'high':
      return <Badge className={`${baseClass} bg-green-600/20 text-green-300 border-green-400/30`}>
        <Shield className="w-3 h-3 mr-1" />
        High
      </Badge>;
    case 'medium':
      return <Badge className={`${baseClass} bg-yellow-600/20 text-yellow-300 border-yellow-400/30`}>
        <Shield className="w-3 h-3 mr-1" />
        Medium
      </Badge>;
    case 'low':
      return <Badge className={`${baseClass} bg-red-600/20 text-red-300 border-red-400/30`}>
        <Shield className="w-3 h-3 mr-1" />
        Low
      </Badge>;
    case 'critical':
      return <Badge className={`${baseClass} bg-red-700/20 text-red-200 border-red-500/30 animate-pulse`}>
        <AlertTriangle className="w-3 h-3 mr-1" />
        Critical
      </Badge>;
    default:
      return <Badge variant="outline">Unknown</Badge>;
  }
};

export const getComplianceStatusBadge = (status: ComplianceStatus) => {
  const baseClass = "px-2 py-1 rounded-full text-xs font-medium border";
  switch (status) {
    case 'compliant':
      return <Badge className={`${baseClass} bg-green-600/20 text-green-300 border-green-400/30`}>
        <CheckCircle className="w-3 h-3 mr-1" />
        Compliant
      </Badge>;
    case 'partial':
      return <Badge className={`${baseClass} bg-yellow-600/20 text-yellow-300 border-yellow-400/30`}>
        <AlertTriangle className="w-3 h-3 mr-1" />
        Partial
      </Badge>;
    case 'non_compliant':
      return <Badge className={`${baseClass} bg-red-600/20 text-red-300 border-red-400/30`}>
        <X className="w-3 h-3 mr-1" />
        Non-Compliant
      </Badge>;
    case 'pending_audit':
      return <Badge className={`${baseClass} bg-blue-600/20 text-blue-300 border-blue-400/30`}>
        <Settings className="w-3 h-3 mr-1" />
        Pending Audit
      </Badge>;
    default:
      return <Badge variant="outline">Unknown</Badge>;
  }
};

export const getVirtualisStatusBadge = (enabled: boolean, score?: number) => {
  const baseClass = "px-2 py-1 rounded-full text-xs font-medium border";
  if (enabled) {
    return <Badge className={`${baseClass} bg-blue-600/20 text-blue-300 border-blue-400/30`}>
      <Brain className="w-3 h-3 mr-1" />
      {score ? `AI Active (${score})` : 'AI Active'}
    </Badge>;
  } else {
    return <Badge className={`${baseClass} bg-slate-600/20 text-slate-300 border-slate-400/30`}>
      <Brain className="w-3 h-3 mr-1" />
      AI Disabled
    </Badge>;
  }
};

export const getPerformanceStatusBadge = (status: 'good' | 'warning' | 'critical') => {
  const baseClass = "px-2 py-1 rounded-full text-xs font-medium border";
  switch (status) {
    case 'good':
      return <Badge className={`${baseClass} bg-green-600/20 text-green-300 border-green-400/30`}>
        <TrendingUp className="w-3 h-3 mr-1" />
        Good
      </Badge>;
    case 'warning':
      return <Badge className={`${baseClass} bg-yellow-600/20 text-yellow-300 border-yellow-400/30`}>
        <AlertTriangle className="w-3 h-3 mr-1" />
        Warning
      </Badge>;
    case 'critical':
      return <Badge className={`${baseClass} bg-red-600/20 text-red-300 border-red-400/30`}>
        <X className="w-3 h-3 mr-1" />
        Critical
      </Badge>;
    default:
      return <Badge variant="outline">Unknown</Badge>;
  }
};