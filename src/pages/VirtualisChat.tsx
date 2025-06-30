
import VirtualisChatLayout from "@/components/clinical/VirtualisChatLayout";
import { useAuth } from "@/components/auth/AuthProvider";

const VirtualisChatPage = () => {
  const { profile, user } = useAuth();

  // Get the hospital ID from the user profile or user metadata
  const effectiveHospitalId = profile?.hospital_id || user?.user_metadata?.hospital_id;

  console.log('VirtualisChatPage - Hospital ID:', effectiveHospitalId);
  console.log('VirtualisChatPage - Profile:', profile);
  console.log('VirtualisChatPage - User:', user);

  return (
    <VirtualisChatLayout hospitalId={effectiveHospitalId} />
  );
};

export default VirtualisChatPage;
