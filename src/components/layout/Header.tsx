import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Button, Badge } from '../ui';
import {
  Sparkles,
  Building2,
  Database,
  Users,
  LogOut,
  User,
  ChevronDown,
  Menu,
  X,
  Code,
  ShieldCheck
} from 'lucide-react';

interface HeaderProps {
  onOpenAuth: (mode?: 'signin' | 'signup') => void;
  onOpenDemo: () => void;
  onOpenTenantSwitcher: () => void;
  sidebarOpen?: boolean;
  onToggleSidebar?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenAuth,
  onOpenDemo,
  onOpenTenantSwitcher,
  sidebarOpen,
  onToggleSidebar
}) => {
  const { user, profile, organization, signOut, exitDemoMode, isDemoMode, isSupabaseLive } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const getRoleBadgeVariant = (role?: string) => {
    switch (role) {
      case 'candidate': return 'primary';
      case 'recruiter': return 'success';
      case 'training_center': return 'warning';
      case 'organization_admin': return 'purple';
      default: return 'default';
    }
  };

  const getRoleLabel = (role?: string) => {
    switch (role) {
      case 'candidate': return 'Candidate';
      case 'recruiter': return 'Recruiter';
      case 'training_center': return 'Training Center';
      case 'organization_admin': return 'Organization Admin';
      default: return 'Guest';
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200 bg-white shadow-xs">
      <div className="flex h-16 items-center justify-between px-4 sm:px-6 max-w-7xl mx-auto">
        {/* Left: Brand & Mobile Sidebar Toggle */}
        <div className="flex items-center gap-3">
          {user && onToggleSidebar && (
            <button
              onClick={onToggleSidebar}
              className="md:hidden p-2 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100 focus:outline-none"
              aria-label="Toggle Navigation Menu"
              id="btn-toggle-sidebar-mobile"
            >
              {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          )}

          <div className="flex items-center gap-2.5">
            <div className="h-8 w-8 rounded bg-indigo-600 flex items-center justify-center shadow-sm font-bold text-white tracking-wider text-sm">
              ST
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-base text-slate-900 tracking-tight">SkillTrack</span>
                <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-indigo-50 text-indigo-700 border border-indigo-200">
                  SIH26135
                </span>
              </div>
              <p className="text-[10px] text-slate-500 font-medium hidden sm:block">
                Enterprise Skilling & Employment Intelligence Platform
              </p>
            </div>
          </div>
        </div>

        {/* Center: Tenant Switcher / Active Org Pill */}
        {user && organization && (
          <div className="hidden lg:flex items-center">
            <button
              onClick={onOpenTenantSwitcher}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100 hover:border-slate-300 transition-all text-xs text-slate-700 shadow-2xs"
              id="btn-header-tenant-switcher"
              title="Click to switch organization tenant"
            >
              <Building2 className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
              <span className="text-slate-500">Tenant:</span>
              <span className="font-bold text-slate-900 max-w-[200px] truncate">{organization.name}</span>
              <Badge variant={organization.subscription_plan === 'Enterprise' ? 'purple' : 'primary'} className="text-[10px] py-0 px-1.5">
                {organization.subscription_plan}
              </Badge>
              <ChevronDown className="w-3 h-3 text-slate-400" />
            </button>
          </div>
        )}

        {/* Right Actions */}
        <div className="flex items-center gap-2.5">
          {/* Quick Demo Switcher */}
          {isDemoMode ? (
            <div className="flex items-center gap-1.5">
              <span className="hidden md:inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-bold bg-amber-50 text-amber-900 border border-amber-300">
                <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span>
                Demo Active (Simulated)
              </span>
              <Button
                size="sm"
                variant="outline"
                className="text-xs text-amber-800 border-amber-300 hover:bg-amber-100 font-semibold"
                onClick={exitDemoMode}
                id="btn-header-exit-demo"
              >
                Exit Demo
              </Button>
            </div>
          ) : (
            <Button
              size="sm"
              variant="secondary"
              leftIcon={<Users className="w-3.5 h-3.5 text-amber-600" />}
              onClick={onOpenDemo}
              className="text-xs font-semibold"
              id="btn-header-quick-demo"
            >
              Demo Accounts
            </Button>
          )}

          {user && profile ? (
            <div className="relative">
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-2.5 p-1 rounded-lg hover:bg-slate-100 border border-transparent hover:border-slate-200 transition-all"
                id="btn-user-profile-menu"
              >
                <div className="w-8 h-8 rounded-lg overflow-hidden bg-indigo-50 border border-indigo-200 flex items-center justify-center text-xs font-bold text-indigo-700">
                  {profile.avatar_url ? (
                    <img src={profile.avatar_url} alt={profile.full_name} className="w-full h-full object-cover" />
                  ) : (
                    profile.full_name.charAt(0)
                  )}
                </div>
                <div className="hidden md:block text-left">
                  <div className="text-xs font-bold text-slate-900 truncate max-w-[130px]">{profile.full_name}</div>
                  <div className="flex items-center gap-1 mt-0.5">
                    <Badge variant={getRoleBadgeVariant(profile.role)} className="text-[10px] px-1.5 py-0">
                      {getRoleLabel(profile.role)}
                    </Badge>
                  </div>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden md:block" />
              </button>

              {/* User Dropdown */}
              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-64 rounded-xl border border-slate-200 bg-white p-2 shadow-xl z-50 text-xs text-slate-800">
                  <div className="p-2.5 border-b border-slate-100 mb-1.5 bg-slate-50 rounded-lg">
                    <p className="font-bold text-slate-900">{profile.full_name}</p>
                    <p className="text-slate-500 truncate text-[11px]">{profile.email}</p>
                    <div className="mt-2 flex items-center justify-between text-[11px]">
                      <span className="text-slate-500">Tenant:</span>
                      <span className="text-indigo-600 font-semibold truncate max-w-[140px]">{organization?.name}</span>
                    </div>
                  </div>

                  <button
                    onClick={() => { setDropdownOpen(false); onOpenTenantSwitcher(); }}
                    className="w-full flex items-center gap-2 px-2.5 py-2 rounded-lg text-slate-700 hover:bg-slate-50 hover:text-slate-900 text-left transition-colors font-medium"
                    id="btn-dropdown-switch-tenant"
                  >
                    <Building2 className="w-4 h-4 text-slate-500" />
                    <span>Switch Tenant</span>
                  </button>

                  <div className="my-1 border-t border-slate-100" />

                  <button
                    onClick={() => { setDropdownOpen(false); signOut(); }}
                    className="w-full flex items-center gap-2 px-2.5 py-2 rounded-lg text-rose-600 hover:bg-rose-50 text-left transition-colors font-semibold"
                    id="btn-dropdown-signout"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Sign Out</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Button
                size="sm"
                variant="ghost"
                onClick={() => onOpenAuth('signin')}
                id="btn-header-signin"
              >
                Sign In
              </Button>
              <Button
                size="sm"
                variant="primary"
                onClick={() => onOpenAuth('signup')}
                id="btn-header-register"
              >
                Register
              </Button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
