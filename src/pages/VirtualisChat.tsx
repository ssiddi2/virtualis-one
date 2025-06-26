
import VirtualisChatEnhanced from "@/components/clinical/VirtualisChatEnhanced";
import { useAuth } from "@/components/auth/AuthProvider";

const VirtualisChatPage = () => {
  const { profile, user } = useAuth();

  return (
    <VirtualisChatEnhanced 
      currentUser={profile || user}
    />
  );
};

export default VirtualisChatPage;
