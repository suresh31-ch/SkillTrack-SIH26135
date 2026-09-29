import React from 'react';
import { UserRole } from '../../types';
import { useAuth } from '../../context/AuthContext';
import {
  LayoutDashboard,
  User,
  Sparkles,
  TrendingUp,
  Map,
  BookOpen,
  CheckSquare,
  Code2,
  Award,
  Briefcase,
  Send,
  ShieldCheck,
  Building,
  PlusCircle,
  Search,
  BookmarkCheck,
  Users,
  GraduationCap,
  Layers,
  CalendarCheck,
  BarChart3,
  Building2,
  MapPin,
  Flame,
  AlertOctagon,
  PieChart,
  Calculator,
  Brain,
  FileText,
  Clock
} from 'lucide-react';
import { Badge } from '../ui';

interface SidebarProps {
  role: UserRole;
  activeTab: string;
  onTabChange: (tabId: string) => void;
  isOpen?: boolean;
  onClose?: () => void;
}

export interface NavItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  badge?: string;
}

export const Sidebar: React.FC<SidebarProps> = ({
  role,
  activeTab,
  onTabChange,
  isOpen = true,
  onClose
}) => {
  const { organization, profile } = useAuth();
  const getNavItems = (): { section: string; items: NavItem[] }[] => {
    switch (role) {
      case 'candidate':
        return [
          {
            section: 'Candidate Portal',
            items: [
              { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
              { id: 'profile', label: 'My Profile', icon: <User className="w-4 h-4" /> },
              { id: 'skills', label: 'My Skills', icon: <Sparkles className="w-4 h-4" /> },
              { id: 'skill_gap', label: 'Skill Gap', icon: <TrendingUp className="w-4 h-4" /> }
            ]
          },
          {
            section: 'Learning & Practice',
            items: [
              { id: 'ai_roadmap', label: 'AI Roadmap', icon: <Map className="w-4 h-4" /> },
              { id: 'learning', label: 'Learning Hub', icon: <GraduationCap className="w-4 h-4" /> },
              { id: 'assessments', label: 'Assessments', icon: <CheckSquare className="w-4 h-4" /> },
              { id: 'code_lab', label: 'Code Lab', icon: <Code2 className="w-4 h-4" /> },
              { id: 'certifications', label: 'Certifications', icon: <Award className="w-4 h-4" /> }
            ]
          },
          {
            section: 'Career & Retention',
            items: [
              { id: 'jobs', label: 'Jobs', icon: <Briefcase className="w-4 h-4" /> },
              { id: 'applications', label: 'Applications', icon: <Send className="w-4 h-4" /> },
              { id: 'employment', label: 'Employment', icon: <ShieldCheck className="w-4 h-4" />, badge: 'EPFO Sim' }
            ]
          }
        ];

      case 'recruiter':
        return [
          {
            section: 'Recruitment Hub',
            items: [
              { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
              { id: 'jobs', label: 'Jobs', icon: <Briefcase className="w-4 h-4" /> },
              { id: 'applicants', label: 'Applicants', icon: <Users className="w-4 h-4" /> },
              { id: 'candidates', label: 'Candidates', icon: <Search className="w-4 h-4" /> },
              { id: 'pipeline', label: 'Pipeline', icon: <Layers className="w-4 h-4" /> }
            ]
          },
          {
            section: 'Operations',
            items: [
              { id: 'post_job', label: 'Post Job', icon: <PlusCircle className="w-4 h-4" /> },
              { id: 'company_profile', label: 'Company Profile', icon: <Building className="w-4 h-4" /> }
            ]
          }
        ];

      case 'training_center':
        return [
          {
            section: 'Training Operations',
            items: [
              { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
              { id: 'students', label: 'Students', icon: <Users className="w-4 h-4" /> },
              { id: 'courses', label: 'Courses', icon: <GraduationCap className="w-4 h-4" /> },
              { id: 'batches', label: 'Batches', icon: <Layers className="w-4 h-4" /> }
            ]
          },
          {
            section: 'Academics & Quality',
            items: [
              { id: 'attendance', label: 'Attendance', icon: <CalendarCheck className="w-4 h-4" /> },
              { id: 'progress', label: 'Progress', icon: <BarChart3 className="w-4 h-4" /> },
              { id: 'assessments', label: 'Assessments', icon: <CheckSquare className="w-4 h-4" /> },
              { id: 'certifications', label: 'Certifications', icon: <Award className="w-4 h-4" /> }
            ]
          },
          {
            section: 'Outcomes',
            items: [
              { id: 'placements', label: 'Placements', icon: <Briefcase className="w-4 h-4" /> },
              { id: 'employment_tracking', label: 'Employment Tracking', icon: <ShieldCheck className="w-4 h-4" /> }
            ]
          }
        ];

      case 'organization_admin':
        return [
          {
            section: 'Organization Intelligence',
            items: [
              { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
              { id: 'candidates', label: 'Candidates', icon: <Users className="w-4 h-4" /> },
              { id: 'training_centers', label: 'Training Centers', icon: <Building2 className="w-4 h-4" /> },
              { id: 'skill_intelligence', label: 'Skill Intelligence', icon: <Sparkles className="w-4 h-4" /> }
            ]
          },
          {
            section: 'Spatial & Market Analytics',
            items: [
              { id: 'district_analytics', label: 'District Analytics', icon: <MapPin className="w-4 h-4" /> },
              { id: 'job_demand', label: 'Job Demand', icon: <Flame className="w-4 h-4" /> },
              { id: 'placement_analytics', label: 'Placement Analytics', icon: <Briefcase className="w-4 h-4" /> },
              { id: 'employment_retention', label: 'Employment Retention', icon: <Clock className="w-4 h-4" /> },
              { id: 'anomaly_detection', label: 'Anomaly Detection', icon: <AlertOctagon className="w-4 h-4" />, badge: 'AI Flag' }
            ]
          },
          {
            section: 'Strategic Decisions',
            items: [
              { id: 'program_impact', label: 'Program Impact', icon: <PieChart className="w-4 h-4" /> },
              { id: 'funding_simulator', label: 'Funding Simulator', icon: <Calculator className="w-4 h-4" /> },
              { id: 'ai_insights', label: 'AI Insights', icon: <Brain className="w-4 h-4" /> },
              { id: 'reports', label: 'Reports', icon: <FileText className="w-4 h-4" /> }
            ]
          }
        ];

      default:
        return [];
    }
  };

  const navSections = getNavItems();

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-30 bg-slate-950/70 backdrop-blur-xs md:hidden"
          aria-hidden="true"
        />
      )}

      <aside
        className={`fixed md:sticky top-16 z-30 h-[calc(100vh-4rem)] w-64 shrink-0 border-r border-slate-800 bg-slate-900 text-slate-300 flex flex-col justify-between transition-transform duration-200 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        <div className="flex-1 p-3 overflow-y-auto space-y-5">
          {navSections.map((sec, idx) => (
            <div key={idx} className="space-y-1">
              <div className="px-3 text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                {sec.section}
              </div>
              <div className="space-y-0.5">
                {sec.items.map(item => {
                  const isActive = activeTab === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        onTabChange(item.id);
                        if (onClose) onClose();
                      }}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-md text-xs transition-colors cursor-pointer ${
                        isActive
                          ? 'bg-indigo-600/10 text-indigo-400 font-semibold border border-indigo-600/20'
                          : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800 font-medium'
                      }`}
                      id={`nav-item-${item.id}`}
                    >
                      <div className="flex items-center gap-2.5">
                        <span className={isActive ? 'text-indigo-400' : 'text-slate-400 opacity-70'}>
                          {item.icon}
                        </span>
                        <span className="truncate">{item.label}</span>
                      </div>
                      {item.badge && (
                        <span className="text-[9px] font-bold bg-indigo-500/20 text-indigo-300 px-1.5 py-0.5 rounded border border-indigo-500/30 uppercase">
                          {item.badge}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Sidebar High Density Footer */}
        <div className="p-3 border-t border-slate-800 bg-slate-900/90 shrink-0 space-y-2">
          {organization && (
            <div className="flex items-center gap-2.5 px-3 py-2 bg-slate-800/60 rounded-lg border border-slate-800">
              <div className="w-7 h-7 rounded bg-indigo-600/30 border border-indigo-500/30 flex items-center justify-center text-[10px] font-bold text-indigo-300 shrink-0">
                {organization.name.substring(0, 2).toUpperCase()}
              </div>
              <div className="overflow-hidden min-w-0 flex-1">
                <p className="text-xs font-bold text-white truncate">{organization.name}</p>
                <p className="text-[10px] text-slate-400 truncate">{organization.subscription_plan} Plan</p>
              </div>
            </div>
          )}
          <div className="flex items-center justify-between px-2 pt-1 text-[10px] text-slate-500 font-bold uppercase tracking-wider">
            <span>SkillTrack Enterprise</span>
            <div className="flex items-center gap-1.5">
              <span className="text-emerald-400 text-[9px]">ONLINE</span>
              <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]"></div>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};
