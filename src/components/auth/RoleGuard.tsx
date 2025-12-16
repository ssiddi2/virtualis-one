import React from 'react';
import { useRoles } from '@/hooks/useRoles';
import { AppRole } from '@/types/roles';

interface RoleGuardProps {
  children: React.ReactNode;
  roles: AppRole[];
  fallback?: React.ReactNode;
}

export const RoleGuard: React.FC<RoleGuardProps> = ({ 
  children, 
  roles, 
  fallback = null 
}) => {
  const { hasAnyRole } = useRoles();

  if (!hasAnyRole(roles)) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
};

// Convenience components for common role checks
export const AdminOnly: React.FC<{ children: React.ReactNode; fallback?: React.ReactNode }> = (props) => (
  <RoleGuard roles={['admin']} {...props} />
);

export const ClinicalOnly: React.FC<{ children: React.ReactNode; fallback?: React.ReactNode }> = (props) => (
  <RoleGuard roles={['admin', 'physician', 'nurse', 'pharmacist', 'technician']} {...props} />
);

export const BillingOnly: React.FC<{ children: React.ReactNode; fallback?: React.ReactNode }> = (props) => (
  <RoleGuard roles={['admin', 'biller']} {...props} />
);
