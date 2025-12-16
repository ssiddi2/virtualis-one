// Enterprise role types - matches database app_role enum
export type AppRole = 
  | 'admin'
  | 'physician'
  | 'nurse'
  | 'pharmacist'
  | 'technician'
  | 'biller'
  | 'receptionist';

export const CLINICAL_ROLES: AppRole[] = ['admin', 'physician', 'nurse', 'pharmacist', 'technician'];
export const BILLING_ROLES: AppRole[] = ['admin', 'biller'];
export const ALL_ROLES: AppRole[] = ['admin', 'physician', 'nurse', 'pharmacist', 'technician', 'biller', 'receptionist'];

export interface UserRole {
  id: string;
  user_id: string;
  role: AppRole;
  hospital_id: string | null;
  granted_at: string;
}
