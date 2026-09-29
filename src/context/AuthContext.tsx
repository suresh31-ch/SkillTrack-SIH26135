import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { UserRole, Profile, Organization, CandidateProfile } from '../types';
import { supabase, isSupabaseConfigured, formatAuthError } from '../lib/supabase';
import { LocalDbService } from '../lib/supabase';
import { useToast } from './ToastContext';

interface SignUpData {
  email: string;
  password?: string;
  fullName: string;
  role: UserRole;
  organizationId: string;
  phone?: string;
  district?: string;
}

interface AuthContextType {
  user: { id: string; email: string } | null;
  profile: Profile | null;
  organization: Organization | null;
  candidateProfile: CandidateProfile | null;
  isLoading: boolean;
  isSupabaseLive: boolean;
  isDemoMode: boolean;
  signIn: (email: string, password?: string) => Promise<{
    success: boolean;
    error?: string;
    unverified?: boolean;
    email?: string;
  }>;
  signUp: (data: SignUpData) => Promise<{
    success: boolean;
    error?: string;
    requiresVerification?: boolean;
    email?: string;
  }>;
  signOut: () => Promise<void>;
  exitDemoMode: () => Promise<void>;
  resetPassword: (email: string) => Promise<{ success: boolean; error?: string }>;
  verifyEmail: (token: string, emailParam?: string) => Promise<{ success: boolean; error?: string }>;
  resendVerificationEmail: (email: string) => Promise<{ success: boolean; error?: string }>;
  quickDemoLogin: (role: UserRole, targetOrgId?: string) => Promise<void>;
  switchOrganization: (orgId: string) => void;
  refreshProfile: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<{ id: string; email: string } | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [organization, setOrganization] = useState<Organization | null>(null);
  const [candidateProfile, setCandidateProfile] = useState<CandidateProfile | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isDemoMode, setIsDemoMode] = useState<boolean>(() => {
    try {
      return localStorage.getItem('skilltrack_demo_mode') === 'true';
    } catch {
      return false;
    }
  });
  const isSupabaseLive = isSupabaseConfigured();
  const { showToast } = useToast();

  // Load profile, tenant organization, and candidate profile
  const loadUserData = useCallback(async (authUserId: string, email: string, userMetadata?: any) => {
    try {
      let resolvedProfile: Profile | null = null;

      // 1. Query public.profiles directly from Supabase
      if (isSupabaseLive && supabase) {
        try {
          const { data: p, error: pError } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', authUserId)
            .maybeSingle();

          if (!pError && p) {
            resolvedProfile = p as Profile;
          }
        } catch (sErr) {
          console.warn('[SkillTrack Auth] Profile query note:', sErr);
        }
      }

      // 2. If profile table query didn't return a record, synthesize from authenticated user metadata
      if (!resolvedProfile) {
        const metaRole = (userMetadata?.role || 'candidate').toLowerCase() as UserRole;
        const metaFullName = userMetadata?.full_name || email.split('@')[0];
        const metaPhone = userMetadata?.phone || '';
        const metaOrgId = userMetadata?.organization_id || '00000000-0000-0000-0000-000000000001';
        const metaDistrict = userMetadata?.district || 'Pune';

        resolvedProfile = {
          id: authUserId,
          auth_user_id: authUserId,
          full_name: metaFullName,
          email: email.trim().toLowerCase(),
          phone: metaPhone,
          role: metaRole,
          organization_id: metaOrgId,
          district: metaDistrict,
          email_verified: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };
      }

      setProfile(resolvedProfile);

      // 3. Resolve Organization
      const orgId = resolvedProfile.organization_id || '00000000-0000-0000-0000-000000000001';
      let resolvedOrg: Organization | null = null;
      if (isSupabaseLive && supabase) {
        try {
          const { data: orgData } = await supabase
            .from('organizations')
            .select('*')
            .eq('id', orgId)
            .maybeSingle();
          if (orgData) {
            resolvedOrg = orgData as Organization;
          }
        } catch (orgErr) {
          // ignore
        }
      }

      if (!resolvedOrg) {
        resolvedOrg = LocalDbService.getOrganization(orgId) || LocalDbService.getOrganizations()[0] || null;
      }
      setOrganization(resolvedOrg);

      // 4. Resolve Candidate Profile if role is candidate
      if (resolvedProfile.role === 'candidate') {
        let resolvedCp: CandidateProfile | null = null;
        if (isSupabaseLive && supabase) {
          try {
            const { data: cpData } = await supabase
              .from('candidate_profiles')
              .select('*')
              .eq('profile_id', resolvedProfile.id)
              .maybeSingle();
            if (cpData) {
              resolvedCp = cpData as CandidateProfile;
            }
          } catch (cpErr) {
            // ignore
          }
        }

        if (!resolvedCp) {
          resolvedCp = {
            id: `cand-${authUserId}`,
            profile_id: authUserId,
            organization_id: orgId,
            education: 'Bachelor of Technology (B.Tech)',
            degree: 'Computer Science & Engineering',
            graduation_year: 2025,
            experience_years: 0,
            target_job: 'Full Stack Web Developer',
            readiness_score: 75,
            profile_completion: 80,
            employment_status: 'in_training',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          };
        }
        setCandidateProfile(resolvedCp);
      } else {
        setCandidateProfile(null);
      }
    } catch (err) {
      console.error('[SkillTrack Auth] Error loading user data:', err);
    }
  }, [isSupabaseLive]);

  // Real Supabase Email Verification Callback handling
  const verifyEmail = useCallback(async (token: string, emailParam?: string): Promise<{ success: boolean; error?: string }> => {
    try {
      if (isSupabaseLive && supabase) {
        // Handle OTP / token hash verification
        const { data, error } = await supabase.auth.verifyOtp({
          token_hash: token,
          type: 'signup'
        });

        if (error) {
          return { success: false, error: formatAuthError(error) };
        }

        if (data.session && data.user) {
          const sessionUser = { id: data.user.id, email: data.user.email || emailParam || '' };
          setUser(sessionUser);
          await loadUserData(data.user.id, data.user.email || emailParam || '', data.user.user_metadata);
          showToast('Email Verified', 'Your email has been verified. Welcome to SkillTrack!', 'success');
          return { success: true };
        }
      }

      showToast('Email Verified', 'Your email has been verified successfully. Please sign in.', 'success');
      return { success: true };
    } catch (err: any) {
      return { success: false, error: formatAuthError(err) };
    }
  }, [isSupabaseLive, loadUserData, showToast]);

  // Real Supabase Resend Verification Email
  const resendVerificationEmail = useCallback(async (email: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const normalizedEmail = email.trim().toLowerCase();
      if (!normalizedEmail) {
        return { success: false, error: 'Please enter a valid email address.' };
      }

      if (isSupabaseLive && supabase) {
        const { error } = await supabase.auth.resend({
          type: 'signup',
          email: normalizedEmail
        });

        if (error) {
          return { success: false, error: formatAuthError(error) };
        }

        showToast(
          'Verification Link Sent',
          `A new activation email has been dispatched to ${normalizedEmail}. Please check your inbox.`,
          'success'
        );
        return { success: true };
      }

      return { success: false, error: 'Authentication service is unavailable.' };
    } catch (err: any) {
      return { success: false, error: formatAuthError(err) };
    }
  }, [isSupabaseLive, showToast]);

  // Initialize session and listen to Supabase Auth state changes
  useEffect(() => {
    let isMounted = true;

    const initAuth = async () => {
      setIsLoading(true);
      try {
        // Handle URL tokens from email confirmation link
        const params = new URLSearchParams(window.location.search);
        const hashParams = new URLSearchParams(window.location.hash.substring(1));
        const tokenHash = params.get('token_hash') || params.get('token');
        const code = params.get('code');

        if (tokenHash) {
          await verifyEmail(tokenHash, params.get('email') || undefined);
        } else if (code && isSupabaseLive && supabase) {
          await supabase.auth.exchangeCodeForSession(code);
        }

        // Clean query/hash parameters from URL
        if (tokenHash || code || hashParams.has('access_token')) {
          const cleanUrl = window.location.pathname;
          window.history.replaceState({}, document.title, cleanUrl);
        }

        // Get current real Supabase session
        if (isSupabaseLive && supabase) {
          const { data: { session } } = await supabase.auth.getSession();
          if (session?.user && isMounted) {
            const sessionUser = { id: session.user.id, email: session.user.email || '' };
            setUser(sessionUser);
            await loadUserData(session.user.id, session.user.email || '', session.user.user_metadata);
          }
        }
      } catch (err) {
        console.error('[SkillTrack Auth] Session restoration note:', err);
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    initAuth();

    // Setup single real Supabase Auth state listener
    let authListener: { subscription: { unsubscribe: () => void } } | null = null;
    if (isSupabaseLive && supabase) {
      const { data } = supabase.auth.onAuthStateChange(async (event, session) => {
        if (!isMounted) return;

        if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED' || event === 'USER_UPDATED') {
          if (session?.user) {
            const sessionUser = { id: session.user.id, email: session.user.email || '' };
            setUser(sessionUser);
            await loadUserData(session.user.id, session.user.email || '', session.user.user_metadata);
          }
        } else if (event === 'SIGNED_OUT') {
          setUser(null);
          setProfile(null);
          setOrganization(null);
          setCandidateProfile(null);
        }
      });
      authListener = data;
    }

    return () => {
      isMounted = false;
      if (authListener?.subscription) {
        authListener.subscription.unsubscribe();
      }
    };
  }, [isSupabaseLive, loadUserData, verifyEmail]);

  const refreshProfile = useCallback(() => {
    if (user) {
      loadUserData(user.id, user.email);
    }
  }, [user, loadUserData]);

  // REAL SUPABASE SIGN IN
  const signIn = async (email: string, password?: string): Promise<{
    success: boolean;
    error?: string;
    unverified?: boolean;
    email?: string;
  }> => {
    setIsLoading(true);
    const normalizedEmail = email.trim().toLowerCase();
    const cleanPassword = password?.trim() || '';

    try {
      if (!normalizedEmail || !cleanPassword) {
        return {
          success: false,
          error: 'Please enter both your email address and password.'
        };
      }

      if (!isSupabaseLive || !supabase) {
        return {
          success: false,
          error: 'Unable to connect to Supabase. Please check your internet connection and try again.'
        };
      }

      const { data, error } = await supabase.auth.signInWithPassword({
        email: normalizedEmail,
        password: cleanPassword
      });

      if (error) {
        const msg = error.message.toLowerCase();
        const isUnconfirmed = error.code === 'email_not_confirmed' ||
          msg.includes('email not confirmed') ||
          msg.includes('email_not_confirmed') ||
          msg.includes('email not verified');

        if (isUnconfirmed) {
          return {
            success: false,
            error: 'Please verify your email before signing in.',
            unverified: true,
            email: normalizedEmail
          };
        }

        if (error.code === 'invalid_credentials' || msg.includes('invalid login credentials') || msg.includes('invalid email or password')) {
          return {
            success: false,
            error: 'Invalid email or password.'
          };
        }

        return {
          success: false,
          error: formatAuthError(error)
        };
      }

      if (data?.session && data.user) {
        const sessionUser = { id: data.user.id, email: data.user.email || normalizedEmail };
        setUser(sessionUser);
        await loadUserData(data.user.id, data.user.email || normalizedEmail, data.user.user_metadata);
        showToast('Welcome back!', `Signed in as ${data.user.email || normalizedEmail}`, 'success');
        return { success: true };
      }

      return {
        success: false,
        error: 'Login could not be completed. Please check your credentials.'
      };
    } catch (err: any) {
      console.error('[SkillTrack Auth] Sign In exception:', err);
      return {
        success: false,
        error: formatAuthError(err)
      };
    } finally {
      setIsLoading(false);
    }
  };

  // REAL SUPABASE SIGN UP
  const signUp = async (data: SignUpData): Promise<{
    success: boolean;
    error?: string;
    requiresVerification?: boolean;
    email?: string;
  }> => {
    setIsLoading(true);
    const cleanFullName = data.fullName.trim();
    const normalizedEmail = data.email.trim().toLowerCase();
    const cleanPassword = data.password?.trim() || '';
    const cleanPhone = data.phone?.trim() || '';
    const cleanDistrict = data.district?.trim() || 'Pune';
    const role = data.role;
    const organizationId = data.organizationId || '00000000-0000-0000-0000-000000000001';

    try {
      if (!cleanFullName || cleanFullName.length < 2) {
        return {
          success: false,
          error: 'Full name is required (at least 2 characters).'
        };
      }

      if (!normalizedEmail) {
        return {
          success: false,
          error: 'A valid email address is required.'
        };
      }

      if (!cleanPassword || cleanPassword.length < 6) {
        return {
          success: false,
          error: 'Password must be at least 6 characters in length.'
        };
      }

      if (role === 'organization_admin') {
        return {
          success: false,
          error: 'Organization Administrator accounts cannot be created via public registration.'
        };
      }

      if (!isSupabaseLive || !supabase) {
        return {
          success: false,
          error: 'Unable to connect to Supabase. Please check your internet connection and try again.'
        };
      }

      // Invoke real Supabase Auth signUp
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: normalizedEmail,
        password: cleanPassword,
        options: {
          data: {
            full_name: cleanFullName,
            role,
            organization_id: organizationId,
            district: cleanDistrict,
            phone: cleanPhone
          }
        }
      });

      if (authError) {
        return {
          success: false,
          error: formatAuthError(authError)
        };
      }

      // Check if user already exists:
      // When email confirmation is enabled and user already exists, Supabase returns a user with empty identities []
      if (authData?.user && Array.isArray(authData.user.identities) && authData.user.identities.length === 0) {
        return {
          success: false,
          error: 'This email is already registered. Please sign in or reset your password.'
        };
      }

      if (authData?.user) {
        const authId = authData.user.id;
        const session = authData.session;
        const isConfirmed = Boolean(authData.user.email_confirmed_at || session);

        // Attempt creating public.profiles record
        try {
          await supabase
            .from('profiles')
            .upsert({
              id: authId,
              auth_user_id: authId,
              full_name: cleanFullName,
              email: normalizedEmail,
              phone: cleanPhone,
              role,
              organization_id: organizationId,
              district: cleanDistrict,
              verification_status: isConfirmed ? 'verified' : 'pending',
              profile_completion: role === 'candidate' ? 80 : 60
            });
        } catch (pErr) {
          console.warn('[SkillTrack Auth] Profile upsert notice:', pErr);
        }

        // Case 1: Session returned immediately (Auto-confirm or confirmation disabled)
        if (session) {
          const sessionUser = { id: authId, email: normalizedEmail };
          setUser(sessionUser);
          await loadUserData(authId, normalizedEmail, authData.user.user_metadata);
          showToast('Registration Successful', `Welcome to SkillTrack, ${cleanFullName}!`, 'success');
          return {
            success: true,
            requiresVerification: false,
            email: normalizedEmail
          };
        }

        // Case 2: Email verification required
        showToast(
          'Verification Required',
          'Registration successful. Please check your email and verify your account before signing in.',
          'info'
        );

        return {
          success: true,
          requiresVerification: true,
          email: normalizedEmail
        };
      }

      return {
        success: false,
        error: 'Registration could not be completed. Please try again.'
      };
    } catch (err: any) {
      console.error('[SkillTrack Auth] Sign Up exception:', err);
      return {
        success: false,
        error: formatAuthError(err)
      };
    } finally {
      setIsLoading(false);
    }
  };

  // REAL SUPABASE SIGN OUT
  const signOut = async (): Promise<void> => {
    setIsLoading(true);
    try {
      if (isSupabaseLive && supabase) {
        await supabase.auth.signOut().catch(() => {});
      }
      setIsDemoMode(false);
      try {
        localStorage.removeItem('skilltrack_demo_mode');
      } catch {}
      setUser(null);
      setProfile(null);
      setOrganization(null);
      setCandidateProfile(null);
      showToast('Signed Out', 'You have been safely signed out.', 'info');
    } catch (err) {
      console.error('[SkillTrack Auth] Sign out error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // EXPLICIT EXIT DEMO MODE
  const exitDemoMode = async (): Promise<void> => {
    setIsLoading(true);
    try {
      setIsDemoMode(false);
      try {
        localStorage.removeItem('skilltrack_demo_mode');
      } catch {}
      setUser(null);
      setProfile(null);
      setOrganization(null);
      setCandidateProfile(null);
      showToast('Exited Demo Mode', 'Returned to standard application state.', 'info');
    } finally {
      setIsLoading(false);
    }
  };

  // REAL SUPABASE RESET PASSWORD
  const resetPassword = async (email: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const normalizedEmail = email.trim().toLowerCase();
      if (!normalizedEmail) {
        return { success: false, error: 'Please enter a valid email address.' };
      }

      if (isSupabaseLive && supabase) {
        const { error } = await supabase.auth.resetPasswordForEmail(normalizedEmail);
        if (error) {
          return { success: false, error: formatAuthError(error) };
        }
      }

      showToast(
        'Password Reset Email Dispatched',
        `If an account exists for ${normalizedEmail}, password reset instructions have been sent.`,
        'info'
      );
      return { success: true };
    } catch (err: any) {
      return { success: false, error: formatAuthError(err) };
    }
  };

  // ISOLATED DEMO LOGIN (Separated clearly from real auth, as requested in Req 20)
  const quickDemoLogin = async (role: UserRole, targetOrgId?: string): Promise<void> => {
    setIsLoading(true);
    try {
      const demoAccounts: Record<UserRole, { id: string; authId: string; email: string; name: string; orgId: string }> = {
        candidate: {
          id: 'prof-cand-001',
          authId: 'auth-cand-001',
          email: 'candidate@skilltrack.io',
          name: 'Aarav Patil',
          orgId: 'org-maha-001'
        },
        recruiter: {
          id: 'prof-recr-001',
          authId: 'auth-recr-001',
          email: 'recruiter@skilltrack.io',
          name: 'Pooja Deshmukh',
          orgId: 'org-maha-001'
        },
        training_center: {
          id: 'prof-tc-001',
          authId: 'auth-tc-001',
          email: 'training@skilltrack.io',
          name: 'Prof. Rajesh Kulkarni',
          orgId: 'org-maha-001'
        },
        organization_admin: {
          id: 'prof-admin-001',
          authId: 'auth-admin-001',
          email: 'admin@skilltrack.io',
          name: 'Dr. Sunita Shinde, IAS',
          orgId: 'org-maha-001'
        }
      };

      const demo = demoAccounts[role];
      const orgId = targetOrgId || demo.orgId || 'org-maha-001';

      const demoUser = { id: demo.authId, email: demo.email };
      setUser(demoUser);

      const demoProfile: Profile = {
        id: demo.id,
        auth_user_id: demo.authId,
        full_name: demo.name,
        email: demo.email,
        phone: '+91 98230 45678',
        role,
        organization_id: orgId,
        district: 'Pune',
        email_verified: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      setProfile(demoProfile);
      setOrganization(LocalDbService.getOrganization(orgId) || LocalDbService.getOrganizations()[0]);

      if (role === 'candidate') {
        const cp = LocalDbService.getCandidateProfile(demo.id);
        setCandidateProfile(cp || {
          id: 'cand-prof-001',
          profile_id: demo.id,
          organization_id: orgId,
          education: 'Bachelor of Technology (B.Tech)',
          degree: 'Computer Engineering',
          graduation_year: 2025,
          experience_years: 1,
          target_job: 'Full Stack Web Developer',
          readiness_score: 84,
          profile_completion: 92,
          employment_status: 'placed',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        });
      } else {
        setCandidateProfile(null);
      }

      setIsDemoMode(true);
      try {
        localStorage.setItem('skilltrack_demo_mode', 'true');
      } catch {}

      showToast(
        'Demo Mode Active',
        `Logged in as Demo ${role.replace('_', ' ').toUpperCase()} (${demo.name})`,
        'info'
      );
    } catch (err) {
      console.error('[SkillTrack Auth] Quick demo login error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const switchOrganization = (orgId: string): void => {
    const org = LocalDbService.getOrganization(orgId);
    if (org && profile) {
      const updatedProfile: Profile = {
        ...profile,
        organization_id: orgId
      };
      setProfile(updatedProfile);
      setOrganization(org);
      showToast('Tenant Switched', `Active organization set to ${org.name}`, 'info');
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        organization,
        candidateProfile,
        isLoading,
        isSupabaseLive,
        isDemoMode,
        signIn,
        signUp,
        signOut,
        exitDemoMode,
        resetPassword,
        verifyEmail,
        resendVerificationEmail,
        quickDemoLogin,
        switchOrganization,
        refreshProfile
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
