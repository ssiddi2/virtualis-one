
import VirtualisChatLayout from "@/components/clinical/VirtualisChatLayout";
import { useAuth } from "@/contexts/AuthContext";

interface VirtualisChatPageProps {
  hospitalId?: string;
}

const VirtualisChatPage = ({ hospitalId }: VirtualisChatPageProps) => {
  const { profile, user } = useAuth();

  // Use the passed hospitalId from routing, or fall back to user profile
  const effectiveHospitalId = hospitalId || profile?.hospital_id || user?.user_metadata?.hospital_id;

  return (
    <VirtualisChatLayout hospitalId={effectiveHospitalId} />
  );
};

export default VirtualisChatPage;
