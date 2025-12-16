import { useAuth } from '@/contexts/EnterpriseAuthContext';
import { AppRole, CLINICAL_ROLES, BILLING_ROLES } from '@/types/roles';

export const useRoles = () => {
  const { profile, hasRole } = useAuth();

  // Get role from profile - default to empty string if not available
  const userRole = (profile?.role || '') as AppRole;
  const roles: AppRole[] = userRole ? [userRole] : [];

  const isAdmin = hasRole('admin');
  const isPhysician = hasRole('physician');
  const isNurse = hasRole('nurse');
  const isPharmacist = hasRole('pharmacist');
  const isTechnician = hasRole('technician');
  const isBiller = hasRole('biller');
  const isReceptionist = hasRole('receptionist');

  const hasClinicalAccess = CLINICAL_ROLES.includes(userRole);
  const hasBillingAccess = BILLING_ROLES.includes(userRole);

  const hasAnyRole = (requiredRoles: AppRole[]) => 
    requiredRoles.includes(userRole);

  return {
    roles,
    isAdmin,
    isPhysician,
    isNurse,
    isPharmacist,
    isTechnician,
    isBiller,
    isReceptionist,
    hasClinicalAccess,
    hasBillingAccess,
    hasRole,
    hasAnyRole,
  };
};
