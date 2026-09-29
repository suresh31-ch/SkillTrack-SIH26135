import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import { Header } from './components/layout/Header';
import { Sidebar } from './components/layout/Sidebar';
import { LandingPage } from './components/landing/LandingPage';
import { CandidateDashboard } from './components/dashboards/candidate/CandidateDashboard';
import { RecruiterDashboard } from './components/dashboards/recruiter/RecruiterDashboard';
import { TrainingCenterDashboard } from './components/dashboards/training/TrainingCenterDashboard';
import { OrganizationAdminDashboard } from './components/dashboards/organization/OrganizationAdminDashboard';
import { AuthModal } from './components/auth/AuthModal';
import { DemoAccountsModal } from './components/modals/DemoAccountsModal';
import { TenantSwitcherModal } from './components/modals/TenantSwitcherModal';
import { DemoTourBanner } from './components/demo/DemoTourBanner';

export function AppContent() {
  const { user, profile } = useAuth();

  // Tab State
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);

  // Modal States
  const [isAuthOpen, setIsAuthOpen] = useState<boolean>(false);
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin');
  const [isDemoOpen, setIsDemoOpen] = useState<boolean>(false);
  const [isTenantOpen, setIsTenantOpen] = useState<boolean>(false);

  const handleOpenAuth = (mode: 'signin' | 'signup' = 'signin') => {
    setAuthMode(mode);
    setIsAuthOpen(true);
  };

  const handleRoleChange = () => {
    setActiveTab('dashboard');
  };

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 flex flex-col font-sans selection:bg-indigo-500 selection:text-white">
      {/* Top Navigation Bar */}
      <Header
        onOpenAuth={handleOpenAuth}
        onOpenDemo={() => setIsDemoOpen(true)}
        onOpenTenantSwitcher={() => setIsTenantOpen(true)}
        sidebarOpen={sidebarOpen}
        onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
      />

      {/* Main Content Area */}
      {!user || !profile ? (
        // Public Landing Page
        <main className="flex-1 overflow-y-auto">
          <LandingPage
            onOpenAuth={handleOpenAuth}
            onOpenDemo={() => setIsDemoOpen(true)}
          />
        </main>
      ) : (
        // Authenticated Dashboard Layout
        <div className="flex-1 flex w-full overflow-hidden">
          {/* Dynamic Role-Based High-Density Sidebar */}
          <Sidebar
            role={profile.role}
            activeTab={activeTab}
            onTabChange={setActiveTab}
            isOpen={sidebarOpen}
            onClose={() => setSidebarOpen(false)}
          />

          {/* Main Dashboard Canvas */}
          <div className="flex-1 flex flex-col min-w-0 h-[calc(100vh-4rem)] overflow-hidden">
            <DemoTourBanner activeTab={activeTab} onNavigateTab={setActiveTab} />
            <main className="flex-1 p-4 sm:p-6 overflow-y-auto max-w-7xl w-full mx-auto space-y-6">
              {profile.role === 'candidate' && (
                <CandidateDashboard activeTab={activeTab} onTabChange={setActiveTab} />
              )}

              {profile.role === 'recruiter' && (
                <RecruiterDashboard activeTab={activeTab} onTabChange={setActiveTab} />
              )}

              {profile.role === 'training_center' && (
                <TrainingCenterDashboard activeTab={activeTab} onTabChange={setActiveTab} />
              )}

              {profile.role === 'organization_admin' && (
                <OrganizationAdminDashboard activeTab={activeTab} onTabChange={setActiveTab} />
              )}
            </main>

            {/* High Density Enterprise Footer */}
            <footer className="h-10 border-t border-slate-200 px-6 flex items-center justify-between bg-white text-[10px] text-slate-400 font-medium shrink-0">
              <div className="flex items-center gap-4">
                <span className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                  System Status: Operational
                </span>
                <span className="hidden sm:inline">Data Governance: Tenant-Isolated & Protected</span>
                <span className="hidden sm:inline">Audit Readiness: 100%</span>
              </div>
              <div className="flex items-center gap-3 uppercase tracking-wider">
                <span>© 2026 SkillTrack Intelligence</span>
                <span className="text-indigo-600 font-semibold">SIH26135</span>
              </div>
            </footer>
          </div>
        </div>
      )}

      {/* Global Modals */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        initialMode={authMode}
        onSuccess={() => setActiveTab('dashboard')}
      />

      <DemoAccountsModal
        isOpen={isDemoOpen}
        onClose={() => setIsDemoOpen(false)}
        onSelectRole={handleRoleChange}
      />

      <TenantSwitcherModal
        isOpen={isTenantOpen}
        onClose={() => setIsTenantOpen(false)}
      />
    </div>
  );
}

export default function App() {
  return (
    <ToastProvider>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </ToastProvider>
  );
}
