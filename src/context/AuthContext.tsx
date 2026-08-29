import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { UserRole, Profile, Organization, CandidateProfile } from '../types';
import { supabase, isSupabaseConfigured, LocalDbService } from '../lib/supabase';
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
  signIn: (email: string, password?: string) => Promise<{ success: boolean; error?: string }>;
  signUp: (data: SignUpData) => Promise<{ success: boolean; error?: string }>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<{ success: boolean; error?: string }>;
  quickDemoLogin: (role: UserRole, targetOrgId?: string) => Promise<void>;
  switchOrganization: (orgId: string) => void;
  refreshProfile: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AUTH_SESSION_STORAGE_KEY = 'skilltrack_session_user';

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<{ id: string; email: string } | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [organization, setOrganization] = useState<Organization | null>(null);
  const [candidateProfile, setCandidateProfile] = useState<CandidateProfile | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const isSupabaseLive = isSupabaseConfigured();
  const { showToast } = useToast();

  const loadUserData = useCallback(async (authUserId: string, email: string) => {
    try {
      // 1. Prioritize querying live Supabase PostgreSQL
      if (isSupabaseLive && supabase) {
        try {
          const { data: p, error: pError } = await supabase
            .from('profiles')
            .select('*')
            .or(`auth_user_id.eq.${authUserId},email.eq.${email}`)
            .maybeSingle();

          if (!pError && p) {
            setProfile(p as Profile);

            if (p.organization_id) {
              const { data: org } = await supabase
                .from('organizations')
                .select('*')
                .eq('id', p.organization_id)
                .maybeSingle();
              if (org) {
                setOrganization(org as Organization);
              } else {
                setOrganization(LocalDbService.getOrganization(p.organization_id) || LocalDbService.getOrganizations()[0] || null);
              }
            }

            if (p.role === 'candidate') {
              const { data: cp } = await supabase
                .from('candidate_profiles')
                .select('*')
                .eq('profile_id', p.id)
                .maybeSingle();
              if (cp) {
                setCandidateProfile(cp as CandidateProfile);
              } else {
                setCandidateProfile(LocalDbService.getCandidateProfile(p.id) || null);
              }
            } else {
              setCandidateProfile(null);
            }
            return;
          }
        } catch (sErr) {
          console.warn('Supabase profile load notice:', sErr);
        }
      }

      // 2. Fallback to LocalDbService cache
      const p = LocalDbService.getProfileByAuthId(authUserId) || LocalDbService.getProfileByEmail(email);
      if (p) {
        setProfile(p);
        const org = LocalDbService.getOrganization(p.organization_id);
        setOrganization(org || LocalDbService.getOrganizations()[0] || null);

        if (p.role === 'candidate') {
          const cp = LocalDbService.getCandidateProfile(p.id);
          setCandidateProfile(cp || null);
        } else {
          setCandidateProfile(null);
        }
      } else {
        setProfile(null);
        setOrganization(null);
        setCandidateProfile(null);
      }
    } catch (err) {
      console.error('Error loading user data:', err);
    }
  }, [isSupabaseLive]);

  // Initialize session on mount
  useEffect(() => {
    const initAuth = async () => {
      setIsLoading(true);
      try {
        if (isSupabaseLive && supabase) {
          const { data: { session } } = await supabase.auth.getSession();
          if (session?.user) {
            setUser({ id: session.user.id, email: session.user.email || '' });
            await loadUserData(session.user.id, session.user.email || '');
          } else {
            // Check fallback session
            const saved = localStorage.getItem(AUTH_SESSION_STORAGE_KEY);
            if (saved) {
              const parsed = JSON.parse(saved);
              setUser(parsed);
              await loadUserData(parsed.id, parsed.email);
            }
          }
        } else {
          const saved = localStorage.getItem(AUTH_SESSION_STORAGE_KEY);
          if (saved) {
            const parsed = JSON.parse(saved);
            setUser(parsed);
            await loadUserData(parsed.id, parsed.email);
          }
        }
      } catch (err) {
        console.error('Auth initialization error:', err);
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();

    // Listen to Supabase Auth state changes if live
    if (isSupabaseLive && supabase) {
      const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
        if (session?.user) {
          setUser({ id: session.user.id, email: session.user.email || '' });
          await loadUserData(session.user.id, session.user.email || '');
        } else {
          const saved = localStorage.getItem(AUTH_SESSION_STORAGE_KEY);
          if (!saved) {
            setUser(null);
            setProfile(null);
            setOrganization(null);
            setCandidateProfile(null);
          }
        }
      });
      return () => subscription.unsubscribe();
    }
  }, [isSupabaseLive, loadUserData]);

  const refreshProfile = useCallback(() => {
    if (user) {
      loadUserData(user.id, user.email);
    }
  }, [user, loadUserData]);

  const signIn = async (email: string, password?: string): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true);
    try {
      if (isSupabaseLive && supabase && password) {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: email.trim(),
          password: password.trim()
        });
        if (error) {
          console.warn('Supabase signIn notice, checking local DB:', error.message);
        } else if (data?.user) {
          setUser({ id: data.user.id, email: data.user.email || email });
          await loadUserData(data.user.id, data.user.email || email);
          localStorage.setItem(AUTH_SESSION_STORAGE_KEY, JSON.stringify({ id: data.user.id, email: data.user.email || email }));
          showToast('Welcome back!', `Signed in as ${data.user.email}`, 'success');
          return { success: true };
        }
      }

      // Check Local DB Profiles
      const existingProfile = LocalDbService.getProfileByEmail(email);
      if (!existingProfile) {
        return {
          success: false,
          error: 'No account found with this email address. Please register or use quick demo login.'
        };
      }

      const authId = existingProfile.auth_user_id || `auth-${Date.now()}`;
      const sessionUser = { id: authId, email: existingProfile.email };
      setUser(sessionUser);
      await loadUserData(authId, existingProfile.email);
      localStorage.setItem(AUTH_SESSION_STORAGE_KEY, JSON.stringify(sessionUser));
      showToast('Welcome back!', `Signed in as ${existingProfile.full_name}`, 'success');
      return { success: true };
    } catch (err: any) {
      console.error('Sign in error:', err);
      return { success: false, error: err.message || 'Authentication failed' };
    } finally {
      setIsLoading(false);
    }
  };

  const signUp = async (data: SignUpData): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true);
    try {
      if (data.role === 'organization_admin') {
        return {
          success: false,
          error: 'Organization Administrator accounts cannot be created via public registration.'
        };
      }

      const existingProfile = LocalDbService.getProfileByEmail(data.email);
      if (existingProfile) {
        return {
          success: false,
          error: 'An account with this email address already exists. Please sign in.'
        };
      }

      let authId = `auth-${Date.now()}`;

      if (isSupabaseLive && supabase && data.password) {
        try {
          const { data: authData, error: authError } = await supabase.auth.signUp({
            email: data.email.trim(),
            password: data.password.trim(),
            options: {
              data: {
                full_name: data.fullName,
                role: data.role,
                organization_id: data.organizationId
              }
            }
          });
          if (!authError && authData?.user) {
            authId = authData.user.id;

            // Upsert directly to profiles table in Supabase
            const { data: remoteProfile } = await supabase
              .from('profiles')
              .upsert({
                auth_user_id: authId,
                full_name: data.fullName,
                email: data.email.trim(),
                phone: data.phone,
                role: data.role,
                organization_id: data.organizationId,
                district: data.district || 'Pune'
              })
              .select()
              .maybeSingle();

            if (data.role === 'candidate' && remoteProfile?.id) {
              await supabase
                .from('candidate_profiles')
                .upsert({
                  profile_id: remoteProfile.id,
                  organization_id: data.organizationId,
                  education: 'Bachelor of Technology (B.Tech)',
                  degree: 'Computer Engineering',
                  graduation_year: 2025,
                  experience_years: 0,
                  employment_status: 'in_training',
                  target_job: 'Full Stack Web Developer',
                  readiness_score: 75,
                  profile_completion: 80
                });
            }
          }
        } catch (sErr) {
          console.warn('Supabase remote sign up notice:', sErr);
        }
      }

      // Create relational profile in local cache
      const newProfile = LocalDbService.createProfile({
        auth_user_id: authId,
        full_name: data.fullName,
        email: data.email.trim(),
        phone: data.phone,
        role: data.role,
        organization_id: data.organizationId,
        district: data.district || 'Pune'
      });

      const sessionUser = { id: authId, email: data.email };
      setUser(sessionUser);
      setProfile(newProfile);
      setOrganization(LocalDbService.getOrganization(newProfile.organization_id) || null);
      if (newProfile.role === 'candidate') {
        setCandidateProfile(LocalDbService.getCandidateProfile(newProfile.id) || null);
      }
      localStorage.setItem(AUTH_SESSION_STORAGE_KEY, JSON.stringify(sessionUser));

      showToast(
        'Registration Successful',
        `Account created for ${newProfile.full_name} (${newProfile.role.replace('_', ' ')})`,
        'success'
      );

      return { success: true };
    } catch (err: any) {
      console.error('Sign up error:', err);
      return { success: false, error: err.message || 'Registration failed' };
    } finally {
      setIsLoading(false);
    }
  };

  const signOut = async (): Promise<void> => {
    setIsLoading(true);
    try {
      if (isSupabaseLive && supabase) {
        await supabase.auth.signOut().catch(() => {});
      }
      localStorage.removeItem(AUTH_SESSION_STORAGE_KEY);
      setUser(null);
      setProfile(null);
      setOrganization(null);
      setCandidateProfile(null);
      showToast('Signed Out', 'You have been safely signed out.', 'info');
    } catch (err) {
      console.error('Sign out error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const resetPassword = async (email: string): Promise<{ success: boolean; error?: string }> => {
    try {
      if (isSupabaseLive && supabase) {
        const { error } = await supabase.auth.resetPasswordForEmail(email);
        if (error) throw error;
      }
      showToast(
        'Password Reset Email Sent',
        `If an account exists for ${email}, password reset instructions have been dispatched.`,
        'info'
      );
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message || 'Failed to dispatch reset email' };
    }
  };

  const quickDemoLogin = async (role: UserRole, targetOrgId?: string): Promise<void> => {
    setIsLoading(true);
    try {
      const allProfiles = LocalDbService.getProfiles();
      let matchedProfile = allProfiles.find(p => p.role === role);

      if (!matchedProfile) {
        const defaultOrg = targetOrgId || LocalDbService.getOrganizations()[0]?.id || 'org-maha-001';
        matchedProfile = LocalDbService.createProfile({
          auth_user_id: `auth-${role}-demo`,
          full_name: role === 'candidate' ? 'Aarav Patil' :
                     role === 'recruiter' ? 'Pooja Deshmukh' :
                     role === 'training_center' ? 'Prof. Rajesh Kulkarni' : 'Dr. Sunita Shinde, IAS',
          email: `${role}@skilltrack.io`,
          role,
          organization_id: defaultOrg,
          district: 'Pune'
        });
      }

      const sessionUser = { id: matchedProfile.auth_user_id, email: matchedProfile.email };
      setUser(sessionUser);
      setProfile(matchedProfile);
      setOrganization(LocalDbService.getOrganization(matchedProfile.organization_id) || LocalDbService.getOrganizations()[0]);
      if (matchedProfile.role === 'candidate') {
        setCandidateProfile(LocalDbService.getCandidateProfile(matchedProfile.id) || null);
      } else {
        setCandidateProfile(null);
      }
      localStorage.setItem(AUTH_SESSION_STORAGE_KEY, JSON.stringify(sessionUser));

      showToast(
        'Demo Login Active',
        `Logged in as ${matchedProfile.full_name} (${role.replace('_', ' ')})`,
        'success'
      );
    } catch (err) {
      console.error('Quick demo login error:', err);
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
        signIn,
        signUp,
        signOut,
        resetPassword,
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
