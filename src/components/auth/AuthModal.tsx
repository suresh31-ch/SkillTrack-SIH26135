import React, { useState } from 'react';
import { Modal, Button, Input, Badge } from '../ui';
import { UserRole } from '../../types';
import { useAuth } from '../../context/AuthContext';
import { LocalDbService } from '../../lib/supabase';
import { Mail, Lock, User, Phone, MapPin, Building2, ShieldAlert, ArrowRight } from 'lucide-react';
import { useToast } from '../../context/ToastContext';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: 'signin' | 'signup' | 'forgot';
  onSuccess?: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  initialMode = 'signin',
  onSuccess
}) => {
  const [mode, setMode] = useState<'signin' | 'signup' | 'forgot'>(initialMode);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [district, setDistrict] = useState('Pune');
  const [role, setRole] = useState<UserRole>('candidate');
  const [organizationId, setOrganizationId] = useState('org-maha-001');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { signIn, signUp, resetPassword, isSupabaseLive } = useAuth();
  const { showToast } = useToast();
  const organizations = LocalDbService.getOrganizations();

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!email.trim()) {
      setError('Please enter your email address');
      return;
    }
    setLoading(true);
    const res = await signIn(email, password);
    setLoading(false);
    if (res.success) {
      onClose();
      if (onSuccess) onSuccess();
    } else {
      setError(res.error || 'Invalid credentials');
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!fullName.trim() || !email.trim()) {
      setError('Full Name and Email are required');
      return;
    }
    if (role === 'organization_admin') {
      setError('Public registration as Organization Admin is restricted. Please register as Candidate, Recruiter, or Training Center.');
      return;
    }

    setLoading(true);
    const res = await signUp({
      email: email.trim(),
      password,
      fullName: fullName.trim(),
      role,
      organizationId,
      phone: phone.trim(),
      district: district.trim()
    });
    setLoading(false);

    if (res.success) {
      onClose();
      if (onSuccess) onSuccess();
    } else {
      setError(res.error || 'Registration failed');
    }
  };

  const handleForgot = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      setError('Please enter your email address');
      return;
    }
    setLoading(true);
    const res = await resetPassword(email);
    setLoading(false);
    if (res.success) {
      setMode('signin');
    } else {
      setError(res.error || 'Failed to dispatch reset email');
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={
        mode === 'signin' ? 'Sign In to SkillTrack' :
        mode === 'signup' ? 'Create SkillTrack Account' : 'Reset Password'
      }
      subtitle={
        mode === 'signin' ? 'Access your role-based dashboard and skilling records' :
        mode === 'signup' ? 'Join as a Candidate, Recruiter, or Training Center' :
        'Enter your email to receive recovery instructions'
      }
      maxWidth={mode === 'signup' ? 'lg' : 'md'}
    >
      <div className="space-y-4">
        {/* Auth Mode Toggle */}
        <div className="flex rounded-lg bg-slate-100 p-1 border border-slate-200">
          <button
            type="button"
            onClick={() => { setMode('signin'); setError(null); }}
            className={`flex-1 py-1.5 text-xs font-semibold rounded-md transition-all ${
              mode === 'signin' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-500 hover:text-slate-800'
            }`}
            id="tab-btn-signin"
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => { setMode('signup'); setError(null); }}
            className={`flex-1 py-1.5 text-xs font-semibold rounded-md transition-all ${
              mode === 'signup' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-500 hover:text-slate-800'
            }`}
            id="tab-btn-signup"
          >
            Register
          </button>
        </div>

        {error && (
          <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-start gap-2">
            <ShieldAlert className="w-4 h-4 shrink-0 text-rose-600 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {mode === 'signin' && (
          <form onSubmit={handleSignIn} className="space-y-3.5">
            <Input
              label="Email Address"
              type="email"
              placeholder="aarav.patil@example.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              id="input-signin-email"
            />
            <Input
              label="Password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={e => setPassword(e.target.value)}
              id="input-signin-password"
            />

            <div className="flex items-center justify-between text-xs">
              <label className="flex items-center gap-1.5 text-slate-600 cursor-pointer">
                <input type="checkbox" defaultChecked className="rounded bg-white border-slate-300 text-indigo-600" />
                <span>Keep me signed in</span>
              </label>
              <button
                type="button"
                onClick={() => setMode('forgot')}
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
          </form>
        )}

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
              placeholder="Min 6 characters"
              value={password}
              onChange={e => setPassword(e.target.value)}
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
                * Note: Organization Admin accounts are managed privately by enterprise customer admins.
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
                  onChange={e => setOrganizationId(e.target.value)}
                  className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-xs text-slate-900 focus:border-indigo-600 focus:outline-none shadow-2xs"
                  id="select-signup-org"
                >
                  {organizations.map(org => (
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
              Complete Registration
            </Button>
          </form>
        )}

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
                onClick={() => setMode('signin')}
                className="text-xs text-indigo-600 font-medium hover:underline"
                id="link-back-to-signin"
              >
                Back to Sign In
              </button>
            </div>
          </form>
        )}

        {/* Supabase Status Footer */}
        <div className="pt-3 border-t border-slate-200 flex items-center justify-between text-[11px] text-slate-500">
          <span>Storage: {isSupabaseLive ? 'Supabase PostgreSQL (Live)' : 'PostgreSQL Engine (Hybrid Active)'}</span>
          <span>SIH26135 Compliant</span>
        </div>
      </div>
    </Modal>
  );
};
