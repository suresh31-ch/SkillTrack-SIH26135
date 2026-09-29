import React, { useState, useEffect } from 'react';
import { Modal, Button, Input, Badge } from '../ui';
import { UserRole, Organization } from '../../types';
import { useAuth } from '../../context/AuthContext';
import { LocalDbService, supabase, formatAuthError } from '../../lib/supabase';
import {
  Mail,
  Lock,
  User,
  Phone,
  MapPin,
  Building2,
  ShieldAlert,
  ArrowRight,
  CheckCircle2,
  RefreshCw,
  Send,
  AlertCircle,
  ExternalLink,
  KeyRound
} from 'lucide-react';
import { useToast } from '../../context/ToastContext';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: 'signin' | 'signup' | 'forgot' | 'verification_sent' | 'verify_success';
  onSuccess?: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  initialMode = 'signin',
  onSuccess
}) => {
  const [mode, setMode] = useState<'signin' | 'signup' | 'forgot' | 'verification_sent' | 'verify_success'>(initialMode);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [district, setDistrict] = useState('Pune');
  const [role, setRole] = useState<UserRole>('candidate');
  const [organizationId, setOrganizationId] = useState('00000000-0000-0000-0000-000000000001');
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [unverifiedEmail, setUnverifiedEmail] = useState<string | null>(null);

  const { signIn, signUp, resetPassword, resendVerificationEmail, isSupabaseLive, user } = useAuth();
  const { showToast } = useToast();
  
  // Real dynamic organization loading from Supabase / API with LocalDb fallback
  const [dbOrganizations, setDbOrganizations] = useState<Organization[]>(() => LocalDbService.getOrganizations());

  useEffect(() => {
    let isMounted = true;
    const fetchOrgs = async () => {
      try {
        if (supabase) {
          const { data, error } = await supabase
            .from('organizations')
            .select('*')
            .eq('status', 'active');
          if (!error && data && data.length > 0 && isMounted) {
            setDbOrganizations(data as Organization[]);
            return;
          }
        }
        const res = await fetch('/api/organizations');
        if (res.ok) {
          const json = await res.json();
          if (json.tenants && json.tenants.length > 0 && isMounted) {
            setDbOrganizations(json.tenants);
          }
        }
      } catch (e) {
        console.warn('Organization retrieval note:', e);
      }
    };
    fetchOrgs();
    return () => { isMounted = false; };
  }, []);

  // Ensure default organization is set to Government of Maharashtra
  useEffect(() => {
    if (dbOrganizations.length > 0) {
      const match = dbOrganizations.find(o => o.id === organizationId);
      if (!match) {
        const defaultOrg = dbOrganizations.find(o => o.name.toLowerCase().includes('maharashtra')) || dbOrganizations[0];
        setOrganizationId(defaultOrg.id);
        if (defaultOrg.district) {
          setDistrict(defaultOrg.district);
        }
      }
    }
  }, [dbOrganizations, organizationId]);

  useEffect(() => {
    if (isOpen) {
      setMode(initialMode);
      setError(null);
      setSuccessMessage(null);
      setUnverifiedEmail(null);
    }
  }, [isOpen, initialMode]);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);
    setUnverifiedEmail(null);

    const cleanEmail = email.trim().toLowerCase();
    const cleanPassword = password.trim();

    if (!cleanEmail || !cleanPassword) {
      setError('Please enter both your email address and password.');
      return;
    }

    setLoading(true);
    const res = await signIn(cleanEmail, cleanPassword);
    setLoading(false);

    if (res.success) {
      onClose();
      if (onSuccess) onSuccess();
    } else {
      if (res.unverified) {
        setUnverifiedEmail(res.email || cleanEmail);
      }
      setError(res.error || 'Invalid email or password.');
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);
    setUnverifiedEmail(null);

    const cleanEmail = email.trim().toLowerCase();
    const cleanPassword = password.trim();

    if (!fullName.trim() || !cleanEmail || !cleanPassword) {
      setError('Full Name, Email Address, and Password are required.');
      return;
    }

    if (cleanPassword.length < 6) {
      setError('Password must be at least 6 characters in length.');
      return;
    }

    if (role === 'organization_admin') {
      setError('Public registration as Organization Admin is restricted. Please register as Candidate, Recruiter, or Training Center.');
      return;
    }

    setLoading(true);
    const res = await signUp({
      email: cleanEmail,
      password: cleanPassword,
      fullName: fullName.trim(),
      role,
      organizationId,
      phone: phone.trim(),
      district: district.trim()
    });
    setLoading(false);

    if (res.success) {
      if (res.requiresVerification) {
        setUnverifiedEmail(cleanEmail);
        setMode('verification_sent');
      } else {
        // Account created and verified/active
        if (user) {
          onClose();
          if (onSuccess) onSuccess();
        } else {
          setSuccessMessage('Account registered successfully! Please sign in with your password.');
          setMode('signin');
          setPassword('');
        }
      }
    } else {
      setError(res.error || 'Registration failed. Please check your details.');
    }
  };

  const handleForgot = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!email.trim()) {
      setError('Please enter your registered email address.');
      return;
    }
    setLoading(true);
    const res = await resetPassword(email.trim().toLowerCase());
    setLoading(false);
    if (res.success) {
      setSuccessMessage(`Password recovery link has been dispatched to ${email.trim().toLowerCase()}.`);
    } else {
      setError(res.error || 'Failed to dispatch password recovery email.');
    }
  };

  const handleResendVerification = async () => {
    const targetEmail = unverifiedEmail || email.trim().toLowerCase();
    if (!targetEmail) {
      setError('Please provide an email address to resend verification.');
      return;
    }

    setResending(true);
    setError(null);
    const res = await resendVerificationEmail(targetEmail);
    setResending(false);

    if (res.success) {
      setSuccessMessage(`A fresh verification link has been sent to ${targetEmail}.`);
    } else {
      setError(res.error || 'Failed to resend verification email.');
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={
        mode === 'signin' ? 'Sign In to SkillTrack' :
        mode === 'signup' ? 'Create SkillTrack Account' :
        mode === 'verification_sent' ? 'Check Your Email' :
        mode === 'verify_success' ? 'Email Verified' : 'Reset Password'
      }
      subtitle={
        mode === 'signin' ? 'Access your verified role-based dashboard and skilling records' :
        mode === 'signup' ? 'Join as a Candidate, Recruiter, or Training Center' :
        mode === 'verification_sent' ? 'Activate your account to access SkillTrack' :
        mode === 'verify_success' ? 'Your account has been activated' :
        'Enter your email to receive recovery instructions'
      }
      maxWidth={mode === 'signup' ? 'lg' : 'md'}
    >
      <div className="space-y-4">
        {/* Auth Mode Toggle (Only shown on Sign In and Sign Up) */}
        {(mode === 'signin' || mode === 'signup') && (
          <div className="flex rounded-lg bg-slate-100 p-1 border border-slate-200">
            <button
              type="button"
              onClick={() => { setMode('signin'); setError(null); setSuccessMessage(null); setUnverifiedEmail(null); }}
              className={`flex-1 py-1.5 text-xs font-semibold rounded-md transition-all ${
                mode === 'signin' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-500 hover:text-slate-800'
              }`}
              id="tab-btn-signin"
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => { setMode('signup'); setError(null); setSuccessMessage(null); setUnverifiedEmail(null); }}
              className={`flex-1 py-1.5 text-xs font-semibold rounded-md transition-all ${
                mode === 'signup' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-500 hover:text-slate-800'
              }`}
              id="tab-btn-signup"
            >
              Register
            </button>
          </div>
        )}

        {/* Global Error Banner */}
        {error && (
          <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-start gap-2 animate-fadeIn" id="banner-auth-error">
            <ShieldAlert className="w-4 h-4 shrink-0 text-rose-600 mt-0.5" />
            <div className="flex-1">
              <span className="font-semibold">{error}</span>
            </div>
          </div>
        )}

        {/* Global Success Banner */}
        {successMessage && (
          <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs flex items-start gap-2 animate-fadeIn" id="banner-auth-success">
            <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600 mt-0.5" />
            <span>{successMessage}</span>
          </div>
        )}

        {/* Unverified Account Warning Alert (in Sign In mode) */}
        {mode === 'signin' && unverifiedEmail && (
          <div className="p-3.5 rounded-lg bg-amber-50 border border-amber-200 text-amber-900 text-xs space-y-2.5" id="banner-unverified-alert">
            <div className="flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <div className="font-bold text-amber-900">Email Verification Required</div>
                <div className="text-amber-800 mt-0.5">
                  An activation link was sent to <strong className="font-semibold">{unverifiedEmail}</strong>. You must verify your email before logging in.
                </div>
              </div>
            </div>
            <div className="flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-amber-200/60">
              <Button
                size="sm"
                variant="secondary"
                onClick={handleResendVerification}
                isLoading={resending}
                leftIcon={<RefreshCw className="w-3.5 h-3.5" />}
                className="text-[11px] h-7"
                id="btn-resend-verification-alert"
              >
                Resend Verification Email
              </Button>
              <button
                type="button"
                onClick={() => setUnverifiedEmail(null)}
                className="text-[11px] text-amber-800 hover:text-amber-950 font-medium underline"
              >
                Dismiss
              </button>
            </div>
          </div>
        )}

        {/* 1. SIGN IN MODE */}
        {mode === 'signin' && (
          <form onSubmit={handleSignIn} className="space-y-3.5">
            <Input
              label="Email Address"
              type="email"
              placeholder="candidate@skilltrack.io"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              id="input-signin-email"
            />
            <Input
              label="Password"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              id="input-signin-password"
            />

            <div className="flex items-center justify-between text-xs">
              <label className="flex items-center gap-1.5 text-slate-600 cursor-pointer">
                <input type="checkbox" defaultChecked className="rounded bg-white border-slate-300 text-indigo-600" />
                <span>Keep me signed in</span>
              </label>
              <button
                type="button"
                onClick={() => { setMode('forgot'); setError(null); setSuccessMessage(null); }}
                className="text-indigo-600 hover:text-indigo-800 font-medium transition-colors"
                id="link-forgot-password"
              >
                Forgot password?
              </button>
            </div>

            <Button
              type="submit"
              className="w-full"
              isLoading={loading}
              rightIcon={<ArrowRight className="w-4 h-4" />}
              id="btn-submit-signin"
            >
              Sign In
            </Button>

            {/* Hint for Evaluator Credentials */}
            <div className="p-2.5 rounded-md bg-slate-50 border border-slate-200 text-[11px] text-slate-500 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <KeyRound className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                <span>Demo Passwords: <code className="text-slate-800 font-bold bg-white px-1 py-0.5 rounded border border-slate-200">SkillTrack@2026</code></span>
              </span>
              <span className="text-indigo-600 font-medium">Or use Demo Accounts</span>
            </div>
          </form>
        )}

        {/* 2. SIGN UP MODE */}
        {mode === 'signup' && (
          <form onSubmit={handleSignUp} className="space-y-3.5">
            <Input
              label="Full Name"
              placeholder="e.g. Rahul Sharma"
              value={fullName}
              onChange={e => setFullName(e.target.value)}
              required
              id="input-signup-name"
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Input
                label="Email Address"
                type="email"
                placeholder="name@example.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                id="input-signup-email"
              />
              <Input
                label="Phone Number"
                type="tel"
                placeholder="+91 98765 43210"
                value={phone}
                onChange={e => setPhone(e.target.value)}
                id="input-signup-phone"
              />
            </div>

            <Input
              label="Create Password"
              type="password"
              placeholder="Min 6 characters (e.g. SkillPass@2026)"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              id="input-signup-password"
            />

            {/* Role Picker (candidate, recruiter, training_center) */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Registering As (Role)
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'candidate', label: 'Candidate', desc: 'Job Seeker' },
                  { id: 'recruiter', label: 'Recruiter', desc: 'Hiring Partner' },
                  { id: 'training_center', label: 'Training Center', desc: 'Institute / ITI' }
                ].map(r => (
                  <button
                    key={r.id}
                    type="button"
                    onClick={() => setRole(r.id as UserRole)}
                    className={`p-2.5 rounded-lg border text-left transition-all ${
                      role === r.id
                        ? 'border-indigo-600 bg-indigo-50/50 text-indigo-950 font-medium ring-1 ring-indigo-600'
                        : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
                    }`}
                    id={`btn-role-select-${r.id}`}
                  >
                    <div className="text-xs font-bold">{r.label}</div>
                    <div className="text-[10px] text-slate-500 mt-0.5">{r.desc}</div>
                  </button>
                ))}
              </div>
              <p className="text-[11px] text-slate-500 mt-1.5">
                * Note: Organization Admin accounts are managed privately by state/enterprise administrators.
              </p>
            </div>

            {/* Organization / Tenant Assignment */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Select Organization (Tenant)
                </label>
                <select
                  value={organizationId}
                  onChange={e => {
                    const selectedId = e.target.value;
                    setOrganizationId(selectedId);
                    const selected = dbOrganizations.find(o => o.id === selectedId);
                    if (selected && selected.district) {
                      setDistrict(selected.district);
                    }
                  }}
                  className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-xs text-slate-900 focus:border-indigo-600 focus:outline-none shadow-2xs"
                  id="select-signup-org"
                >
                  {dbOrganizations.map(org => (
                    <option key={org.id} value={org.id}>
                      {org.name} ({org.type})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  District
                </label>
                <select
                  value={district}
                  onChange={e => setDistrict(e.target.value)}
                  className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-xs text-slate-900 focus:border-indigo-600 focus:outline-none shadow-2xs"
                  id="select-signup-district"
                >
                  {['Pune', 'Mumbai Suburban', 'Chhatrapati Sambhajinagar', 'Nagpur', 'Nashik', 'Kolhapur', 'Thane', 'Solapur', 'Amravati'].map(d => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full mt-2"
              isLoading={loading}
              rightIcon={<ArrowRight className="w-4 h-4" />}
              id="btn-submit-signup"
            >
              Register & Send Verification Link
            </Button>
          </form>
        )}

        {/* 3. VERIFICATION SENT SCREEN */}
        {mode === 'verification_sent' && (
          <div className="text-center py-3 space-y-4 animate-fadeIn" id="screen-verification-sent">
            <div className="w-12 h-12 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-600 flex items-center justify-center mx-auto shadow-xs">
              <Mail className="w-6 h-6 animate-pulse" />
            </div>

            <div className="space-y-1">
              <h3 className="text-base font-bold text-slate-900">Verify Your Email Address</h3>
              <p className="text-xs text-slate-600 max-w-sm mx-auto">
                We have sent an authentication verification link to:
              </p>
              <div className="font-semibold text-sm text-indigo-700 bg-indigo-50/60 py-1.5 px-3 rounded-md inline-block border border-indigo-100 mt-1">
                {unverifiedEmail || email}
              </div>
            </div>

            <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-lg text-left text-xs text-slate-600 space-y-2">
              <div className="font-semibold text-slate-800 flex items-center gap-1.5">
                <ShieldAlert className="w-4 h-4 text-indigo-600" />
                <span>Verification Guidelines:</span>
              </div>
              <ul className="list-disc pl-4 space-y-1 text-[11px] text-slate-600">
                <li>Check your email inbox for the verification link.</li>
                <li>Your account is strictly protected and will remain inactive until verified.</li>
                <li>Once verified, you can immediately log in with your password.</li>
              </ul>
            </div>

            {/* Actions for User */}
            <div className="space-y-3 pt-1">
              <div className="flex items-center justify-between">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={handleResendVerification}
                  isLoading={resending}
                  leftIcon={<RefreshCw className="w-3.5 h-3.5" />}
                  className="text-xs"
                  id="btn-resend-verification-screen"
                >
                  Resend Verification Email
                </Button>

                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => { setMode('signin'); setError(null); }}
                  rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
                  className="text-xs"
                  id="btn-back-to-signin-from-sent"
                >
                  Proceed to Sign In
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* 4. VERIFICATION SUCCESS SCREEN */}
        {mode === 'verify_success' && (
          <div className="text-center py-4 space-y-4 animate-fadeIn" id="screen-verify-success">
            <div className="w-14 h-14 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-600 flex items-center justify-center mx-auto shadow-xs">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div className="space-y-1">
              <h3 className="text-base font-bold text-slate-900">Email Verified Successfully!</h3>
              <p className="text-xs text-slate-600 max-w-sm mx-auto">
                Your account is now fully active. Please enter your password to sign in to your dashboard.
              </p>
            </div>

            <Button
              className="w-full"
              onClick={() => {
                setMode('signin');
                setError(null);
                setSuccessMessage('Email verified! Please enter your password to sign in.');
              }}
              rightIcon={<ArrowRight className="w-4 h-4" />}
              id="btn-proceed-signin-after-verify"
            >
              Proceed to Sign In
            </Button>
          </div>
        )}

        {/* 5. FORGOT PASSWORD MODE */}
        {mode === 'forgot' && (
          <form onSubmit={handleForgot} className="space-y-3.5">
            <Input
              label="Registered Email Address"
              type="email"
              placeholder="your-email@example.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              id="input-forgot-email"
            />
            <Button
              type="submit"
              className="w-full"
              isLoading={loading}
              id="btn-submit-forgot"
            >
              Send Reset Link
            </Button>
            <div className="text-center">
              <button
                type="button"
                onClick={() => { setMode('signin'); setError(null); setSuccessMessage(null); }}
                className="text-xs text-indigo-600 font-medium hover:underline"
                id="link-back-to-signin"
              >
                Back to Sign In
              </button>
            </div>
          </form>
        )}

        {/* Supabase / Auth Engine Status Footer */}
        <div className="pt-3 border-t border-slate-200 flex items-center justify-between text-[11px] text-slate-500">
          <span>Engine: {isSupabaseLive ? 'Supabase Auth (Live)' : 'Cryptographic SHA-256 Engine (Salted)'}</span>
          <Badge variant="primary" className="text-[10px] py-0 px-1.5">
            Strict RLS & Verification
          </Badge>
        </div>
      </div>
    </Modal>
  );
};

