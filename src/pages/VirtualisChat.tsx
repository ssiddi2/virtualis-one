
import VirtualisChat from "@/components/clinical/VirtualisChat";
import { useAuth } from "@/components/auth/AuthProvider";

const VirtualisChatPage = () => {
  const { profile, user } = useAuth();

  return (
    <VirtualisChat 
      currentUser={profile || user}
    />
  );
};

export default VirtualisChatPage;
