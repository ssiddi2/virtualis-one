import React from 'react';
import { HospitalStatus, ConnectionHealth, APIHealth } from '@/types/hospital';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, Settings, X, CheckCircle, Wifi } from 'lucide-react';

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
        <Settings className="w-3 h-3 mr-1" />
        Testing
      </Badge>;
    case 'emergency':
      return <Badge className={`${baseClass} bg-red-700/20 text-red-200 border-red-500/30`}>
        <AlertTriangle className="w-3 h-3 mr-1 animate-pulse" />
        Emergency
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
      return <Badge className={`${baseClass} bg-gray-600/20 text-gray-300 border-gray-400/30`}>
        <X className="w-3 h-3 mr-1" />
        Unknown
      </Badge>;
    default:
      return <Badge variant="outline">Unknown</Badge>;
  }
};