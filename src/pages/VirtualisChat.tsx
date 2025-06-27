
import VirtualisChatAdvanced from "@/components/clinical/VirtualisChatAdvanced";
import { useAuth } from "@/components/auth/AuthProvider";

const VirtualisChatPage = () => {
  const { profile, user } = useAuth();

  return (
    <VirtualisChatAdvanced 
      currentUser={profile || user}
    />
  );
};

export default VirtualisChatPage;
