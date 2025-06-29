
import VirtualisChatLayout from "@/components/clinical/VirtualisChatLayout";
import { useAuth } from "@/components/auth/AuthProvider";

const VirtualisChatPage = () => {
  const { profile, user } = useAuth();

  // Get hospital ID from user profile or use a default
  const hospitalId = profile?.hospital_id || user?.user_metadata?.hospital_id || "44444444-4444-4444-4444-444444444444";

  return (
    <VirtualisChatLayout hospitalId={hospitalId}>
      <div className="flex-1 flex items-center justify-center bg-[#0a1628]">
        <div className="text-center space-y-4">
          <h2 className="text-2xl font-semibold text-white">Welcome to Virtualis Chat</h2>
          <p className="text-slate-400">Select a physician from the sidebar to start a consultation</p>
        </div>
      </div>
    </VirtualisChatLayout>
  );
};

export default VirtualisChatPage;
