import { supabase } from '@/integrations/supabase/client';

export async function createUserAccount() {
  try {
    console.log('Creating user account...');
    
    const { data, error } = await supabase.functions.invoke('admin-create-user', {
      body: {
        email: 'dr.siddiqi@livemedhealth.com',
        password: '123456',
        first_name: 'Siddiqi',
        last_name: '',
        role: 'physician'
      }
    });

    if (error) {
      console.error('Error creating user:', error);
      return { success: false, error };
    }

    console.log('User created successfully:', data);
    
    // Now sign in with the created account
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email: 'dr.siddiqi@livemedhealth.com',
      password: '123456'
    });

    if (authError) {
      console.error('Error signing in:', authError);
      return { success: false, error: authError };
    }

    console.log('Signed in successfully:', authData);
    return { success: true, data: authData };
  } catch (err) {
    console.error('Unexpected error:', err);
    return { success: false, error: err };
  }
}

// Auto-execute when this module is imported
createUserAccount().then(result => {
  if (result.success) {
    console.log('Account created and signed in! Redirecting to hospital selection...');
    window.location.href = '/hospital-selection';
  } else {
    console.error('Failed to create account:', result.error);
  }
});