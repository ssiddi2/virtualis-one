import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import LoadingSpinner from "@/components/ui/loading-spinner";
import { useToast } from "@/hooks/use-toast";

const ToolsCreateUser = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [status, setStatus] = useState<string>("Creating account...");

  useEffect(() => {
    const run = async () => {
      const email = searchParams.get("email") || "dr.siddiqi@livemedhealth.com";
      const password = searchParams.get("password") || "123456";
      const first_name = searchParams.get("first_name") || "Siddiqi";
      const last_name = searchParams.get("last_name") || "";
      const role = searchParams.get("role") || "physician";

      try {
        const { data, error } = await supabase.functions.invoke("admin-create-user", {
          body: { email, password, first_name, last_name, role },
        });

        if (error) throw error;

        toast({ title: "Account ready", description: `Created ${email}. You can log in now.` });
        setStatus("Account created. Redirecting to login...");
        setTimeout(() => navigate("/login"), 1000);
      } catch (err: any) {
        toast({ title: "Account creation", description: err?.message || "Unknown error", variant: "destructive" });
        setStatus("If the user already exists, you can try logging in now.");
        setTimeout(() => navigate("/login"), 1500);
      }
    };

    run();
  }, [navigate, searchParams, toast]);

  return (
    <div className="min-h-screen flex items-center justify-center" style={{
      background:
        "linear-gradient(135deg, hsl(225, 70%, 25%) 0%, hsl(220, 65%, 35%) 25%, hsl(215, 60%, 45%) 50%, hsl(210, 55%, 55%) 75%, hsl(205, 50%, 65%) 100%)",
    }}>
      <div className="text-white flex items-center gap-3">
        <LoadingSpinner size="md" />
        <span>{status}</span>
      </div>
    </div>
  );
};

export default ToolsCreateUser;
