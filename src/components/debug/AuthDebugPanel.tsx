import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/EnterpriseAuthContext';
import { useAIAssistant } from '@/hooks/useAIAssistant';
import { supabase } from '@/integrations/supabase/client';
import { CheckCircle, XCircle, Loader2, Bug, RefreshCw, Brain } from 'lucide-react';

export const AuthDebugPanel = () => {
  const { user, profile, session, loading } = useAuth();
  const { callAI, isLoading: aiLoading, error: aiError } = useAIAssistant();
  const [aiTestResult, setAiTestResult] = useState<string | null>(null);
  const [isTestingAI, setIsTestingAI] = useState(false);
  const [roleCheck, setRoleCheck] = useState<{ checked: boolean; isProvider: boolean | null }>({ checked: false, isProvider: null });

  const testAIConnection = async () => {
    setIsTestingAI(true);
    setAiTestResult(null);
    try {
      const result = await callAI({
        type: 'note_suggestions',
        data: {
          noteType: 'Progress Note',
          patientName: 'Test Patient',
          currentContent: 'Assessment: Patient presents with chest pain.',
        },
      });
      setAiTestResult(`✓ AI Connected: ${result?.substring(0, 100)}...`);
    } catch (err: any) {
      setAiTestResult(`✗ AI Error: ${err.message}`);
    } finally {
      setIsTestingAI(false);
    }
  };

  const checkProviderRole = async () => {
    if (!user?.id) {
      setRoleCheck({ checked: true, isProvider: false });
      return;
    }
    
    try {
      const { data, error } = await supabase.rpc('is_healthcare_provider', { user_uuid: user.id });
      console.log('[AuthDebugPanel] Provider role check:', { data, error });
      setRoleCheck({ checked: true, isProvider: data ?? false });
    } catch (err) {
      console.error('[AuthDebugPanel] Role check error:', err);
      setRoleCheck({ checked: true, isProvider: null });
    }
  };

  if (loading) {
    return (
      <Card className="bg-slate-800 border-slate-700">
        <CardContent className="p-4 flex items-center gap-2">
          <Loader2 className="h-4 w-4 animate-spin text-blue-400" />
          <span className="text-slate-300">Loading auth state...</span>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-slate-800 border-slate-700">
      <CardHeader className="pb-3">
        <CardTitle className="text-white flex items-center gap-2">
          <Bug className="h-5 w-5 text-amber-400" />
          Auth & AI Debug Panel
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Authentication Status */}
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-slate-300">Authentication</h4>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div className="flex items-center gap-2">
              {user ? <CheckCircle className="h-4 w-4 text-green-400" /> : <XCircle className="h-4 w-4 text-red-400" />}
              <span className="text-slate-400">User:</span>
              <span className="text-white truncate">{user?.email || 'Not logged in'}</span>
            </div>
            <div className="flex items-center gap-2">
              {session ? <CheckCircle className="h-4 w-4 text-green-400" /> : <XCircle className="h-4 w-4 text-red-400" />}
              <span className="text-slate-400">Session:</span>
              <span className="text-white">{session ? 'Active' : 'None'}</span>
            </div>
          </div>
        </div>

        {/* Profile Data */}
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-slate-300">Profile</h4>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div className="flex items-center gap-2">
              {profile?.id ? <CheckCircle className="h-4 w-4 text-green-400" /> : <XCircle className="h-4 w-4 text-red-400" />}
              <span className="text-slate-400">Profile ID:</span>
              <span className="text-white truncate">{profile?.id?.substring(0, 8) || 'None'}...</span>
            </div>
            <div className="flex items-center gap-2">
              {profile?.hospital_id ? <CheckCircle className="h-4 w-4 text-green-400" /> : <XCircle className="h-4 w-4 text-red-400" />}
              <span className="text-slate-400">Hospital:</span>
              <span className="text-white truncate">{profile?.hospital_id?.substring(0, 8) || 'Not assigned'}...</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-slate-400">Role:</span>
              <Badge variant={profile?.role === 'physician' || profile?.role === 'admin' ? 'default' : 'secondary'}>
                {profile?.role || 'Unknown'}
              </Badge>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-slate-400">Name:</span>
              <span className="text-white">{profile?.first_name} {profile?.last_name}</span>
            </div>
          </div>
        </div>

        {/* Role Check */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-medium text-slate-300">RLS Permission Check</h4>
            <Button variant="outline" size="sm" onClick={checkProviderRole} className="h-7 text-xs">
              <RefreshCw className="h-3 w-3 mr-1" />
              Check Role
            </Button>
          </div>
          {roleCheck.checked && (
            <div className="flex items-center gap-2 text-sm">
              {roleCheck.isProvider === true ? (
                <><CheckCircle className="h-4 w-4 text-green-400" /><span className="text-green-300">Healthcare provider role confirmed</span></>
              ) : roleCheck.isProvider === false ? (
                <><XCircle className="h-4 w-4 text-red-400" /><span className="text-red-300">Not a healthcare provider - cannot create notes</span></>
              ) : (
                <span className="text-amber-300">Role check failed - function may not exist</span>
              )}
            </div>
          )}
        </div>

        {/* AI Test */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-medium text-slate-300">AI Assistant</h4>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={testAIConnection} 
              disabled={isTestingAI}
              className="h-7 text-xs"
            >
              {isTestingAI ? <Loader2 className="h-3 w-3 mr-1 animate-spin" /> : <Brain className="h-3 w-3 mr-1" />}
              Test AI
            </Button>
          </div>
          {aiTestResult && (
            <div className={`text-sm p-2 rounded ${aiTestResult.startsWith('✓') ? 'bg-green-900/30 text-green-300' : 'bg-red-900/30 text-red-300'}`}>
              {aiTestResult}
            </div>
          )}
          {aiError && !aiTestResult && (
            <div className="text-sm p-2 rounded bg-red-900/30 text-red-300">
              Last error: {aiError}
            </div>
          )}
        </div>

        {/* Quick Status Summary */}
        <div className="pt-2 border-t border-slate-700">
          <div className="flex items-center gap-2">
            <span className="text-sm text-slate-400">Can create notes:</span>
            {user && profile?.id && profile?.hospital_id ? (
              <Badge className="bg-green-600">Yes</Badge>
            ) : (
              <Badge variant="destructive">No - {!user ? 'Not logged in' : !profile?.id ? 'No profile' : 'No hospital'}</Badge>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AuthDebugPanel;
