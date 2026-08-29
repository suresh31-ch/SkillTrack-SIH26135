import React from 'react';
import { Modal, Button, Badge } from '../ui';
import { UserRole } from '../../types';
import { useAuth } from '../../context/AuthContext';
import { User, Briefcase, GraduationCap, Building2, ArrowRight } from 'lucide-react';

interface DemoAccountsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectRole?: (role: UserRole) => void;
}

export const DemoAccountsModal: React.FC<DemoAccountsModalProps> = ({ isOpen, onClose, onSelectRole }) => {
  const { quickDemoLogin } = useAuth();

  const handleSelect = async (role: UserRole) => {
    await quickDemoLogin(role);
    onClose();
    if (onSelectRole) onSelectRole(role);
  };

  const accounts: Array<{
    role: UserRole;
    title: string;
    subtitle: string;
    name: string;
    email: string;
    icon: React.ReactNode;
    badge: 'primary' | 'success' | 'warning' | 'purple';
    description: string;
  }> = [
    {
      role: 'candidate',
      title: 'Candidate / Job Seeker',
      subtitle: 'Candidate Dashboard',
      name: 'Aarav Patil',
      email: 'candidate@skilltrack.io',
      icon: <User className="w-5 h-5 text-indigo-400" />,
      badge: 'primary',
      description: 'View Skill Gap Analysis, Personalized AI Roadmap, Practical Assessments, Code Lab, Job Matching & EPFO Retention status.'
    },
    {
      role: 'recruiter',
      title: 'Corporate Recruiter',
      subtitle: 'Recruiter Dashboard',
      name: 'Pooja Deshmukh',
      email: 'recruiter@skilltrack.io',
      icon: <Briefcase className="w-5 h-5 text-emerald-400" />,
      badge: 'success',
      description: 'Post Jobs with required skill levels, search verified candidates with skill matching scores, manage applicant pipeline.'
    },
    {
      role: 'training_center',
      title: 'Training Institute / ITI',
      subtitle: 'Training Center Dashboard',
      name: 'Prof. Rajesh Kulkarni',
      email: 'training@skilltrack.io',
      icon: <GraduationCap className="w-5 h-5 text-amber-400" />,
      badge: 'warning',
      description: 'Manage students, courses, batches, mark daily biometric attendance, issue digital certificates, and track student placements.'
    },
    {
      role: 'organization_admin',
      title: 'Organization Admin (State/CSR)',
      subtitle: 'Organization Intelligence Dashboard',
      name: 'Dr. Sunita Shinde, IAS',
      email: 'admin@skilltrack.io',
      icon: <Building2 className="w-5 h-5 text-purple-400" />,
      badge: 'purple',
      description: 'State-wide district analytics, 3/6/12-month retention intelligence, anomaly detection, funding ROI simulator & AI cohort insights.'
    }
  ];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Instant Quick-Login (SIH Evaluator Mode)"
      subtitle="Test all 4 distinct role-based dashboards and tenant capabilities with 1 click"
      maxWidth="2xl"
    >
      <div className="space-y-2.5">
        {accounts.map(acc => (
          <div
            key={acc.role}
            className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-3.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50/80 hover:border-slate-300 transition-all gap-3 group shadow-2xs"
            id={`card-demo-login-${acc.role}`}
          >
            <div className="flex items-start gap-3 flex-1">
              <div className="p-2 rounded-lg bg-slate-100 border border-slate-200 shrink-0 group-hover:border-slate-300">
                {acc.icon}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="text-xs font-bold text-slate-900">{acc.title}</h4>
                  <Badge variant={acc.badge}>{acc.subtitle}</Badge>
                </div>
                <div className="text-xs text-slate-500 mt-0.5">
                  <span className="text-slate-800 font-semibold">{acc.name}</span> ({acc.email})
                </div>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">{acc.description}</p>
              </div>
            </div>

            <Button
              size="sm"
              variant={acc.badge === 'primary' ? 'primary' : 'secondary'}
              onClick={() => handleSelect(acc.role)}
              rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
              className="shrink-0 w-full sm:w-auto text-xs"
              id={`btn-demo-switch-${acc.role}`}
            >
              Sign In as {acc.role.replace('_', ' ')}
            </Button>
          </div>
        ))}
      </div>
    </Modal>
  );
};
