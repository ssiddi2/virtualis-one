
import VirtualisChatLayout from "@/components/clinical/VirtualisChatLayout";
import { useAuth } from "@/components/auth/AuthProvider";

const VirtualisChatPage = () => {
  const { profile, user } = useAuth();

  // Get hospital ID from user profile or use a default
  const hospitalId = profile?.hospital_id || user?.user_metadata?.hospital_id || "44444444-4444-4444-4444-444444444444";

  return (
    <VirtualisChatLayout hospitalId={hospitalId} />
  );
};

export default VirtualisChatPage;
