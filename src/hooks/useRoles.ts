import { useAuth } from '@/contexts/AuthContext';
import { AppRole, CLINICAL_ROLES, BILLING_ROLES } from '@/types/roles';

export const useRoles = () => {
  const { roles, hasRole } = useAuth();

  const isAdmin = hasRole('admin');
  const isPhysician = hasRole('physician');
  const isNurse = hasRole('nurse');
  const isPharmacist = hasRole('pharmacist');
  const isTechnician = hasRole('technician');
  const isBiller = hasRole('biller');
  const isReceptionist = hasRole('receptionist');

  const hasClinicalAccess = roles.some(r => CLINICAL_ROLES.includes(r));
  const hasBillingAccess = roles.some(r => BILLING_ROLES.includes(r));

  const hasAnyRole = (requiredRoles: AppRole[]) => 
    roles.some(r => requiredRoles.includes(r));

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
