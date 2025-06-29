
import { useAuth } from '@/components/auth/AuthProvider';
import V1DriftAssistant from '@/components/ai/V1DriftAssistant';
import { useSearchParams } from 'react-router-dom';

const V1DriftPage = () => {
  const { profile } = useAuth();
  const [searchParams] = useSearchParams();
  
  const hospitalId = profile?.hospital_id || searchParams.get('hospitalId') || "44444444-4444-4444-4444-444444444444";
  const patientId = searchParams.get('patientId') || undefined;
  const roomNumber = searchParams.get('room') || undefined;

  return (
    <div className="h-screen bg-gradient-to-br from-slate-900 via-blue-900/20 to-slate-900">
      <V1DriftAssistant 
        hospitalId={hospitalId}
        patientId={patientId}
        roomNumber={roomNumber}
      />
    </div>
  );
};

export default V1DriftPage;
