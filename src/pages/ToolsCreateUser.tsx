import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import LoadingSpinner from "@/components/ui/loading-spinner";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";

const ToolsCreateUser = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [status, setStatus] = useState<string>("Creating account...");
  const [isRunning, setIsRunning] = useState<boolean>(false);

  const provisionAndLogin = async () => {
    const email = searchParams.get("email") || "dr.siddiqi@livemedhealth.com";
    const password = searchParams.get("password") || "123456";
    const first_name = searchParams.get("first_name") || "Siddiqi";
    const last_name = searchParams.get("last_name") || "";
    const role = searchParams.get("role") || "physician";

    setIsRunning(true);
    setStatus("Provisioning account...");

    let createdOk = false;
    try {
      const { data, error } = await supabase.functions.invoke("admin-create-user", {
        body: { email, password, first_name, last_name, role },
      });
      if (error) throw error;
      createdOk = true;
      setStatus("Account ready. Signing you in...");
      toast({ title: "Account ready", description: `Account ${email} is ready.` });
    } catch (err: any) {
      // Even if creation failed (often because the user already exists), try to sign in
      console.warn("Provisioning error (will attempt sign-in anyway):", err?.message || err);
      setStatus("Provisioning may have failed. Trying to sign you in...");
    }

    // Attempt sign-in regardless, to handle "already exists" cases
    const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });
    if (signInError) {
      setIsRunning(false);
      setStatus(createdOk
        ? "Signed in failed after creation. Please try again."
        : "Sign-in failed. Use Retry or go back to Login.");
      toast({ title: "Sign-in failed", description: signInError.message, variant: "destructive" });
      return;
    }

    setStatus("Signed in. Redirecting...");
    navigate("/hospital-selection");
  };

  useEffect(() => {
    provisionAndLogin();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center" style={{
      background:
        "linear-gradient(135deg, hsl(225, 70%, 25%) 0%, hsl(220, 65%, 35%) 25%, hsl(215, 60%, 45%) 50%, hsl(210, 55%, 55%) 75%, hsl(205, 50%, 65%) 100%)",
    }}>
      <div className="text-white flex flex-col items-center gap-4">
        <div className="flex items-center gap-3">
          <LoadingSpinner size="md" />
          <span>{status}</span>
        </div>
        <div className="flex gap-3">
          <Button variant="secondary" onClick={provisionAndLogin} disabled={isRunning}>
            {isRunning ? "Working..." : "Retry provisioning"}
          </Button>
          <Button variant="outline" onClick={() => navigate("/login")}>Go to login</Button>
        </div>
      </div>
    </div>
  );
};

export default ToolsCreateUser;
