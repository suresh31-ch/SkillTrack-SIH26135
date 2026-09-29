import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { Badge, Button } from '../ui';
import {
  Sparkles,
  TrendingUp,
  Map,
  Briefcase,
  Send,
  ShieldCheck,
  LogOut,
  Info,
  CheckCircle2,
  ChevronRight,
  Flame,
  PieChart,
  Users
} from 'lucide-react';

interface DemoTourBannerProps {
  activeTab: string;
  onNavigateTab: (tab: string) => void;
}

export const DemoTourBanner: React.FC<DemoTourBannerProps> = ({ activeTab, onNavigateTab }) => {
  const { profile, isDemoMode, exitDemoMode } = useAuth();

  if (!isDemoMode || !profile) return null;

  const candidateSteps = [
    {
      id: 'skill_gap',
      label: '1. Skill Gap Analysis',
      icon: <TrendingUp className="w-3.5 h-3.5" />,
      desc: 'Transparent competency calculation & gap classification'
    },
    {
      id: 'ai_roadmap',
      label: '2. Personalized Roadmap',
      icon: <Map className="w-3.5 h-3.5" />,
      desc: 'Modular lesson milestones linked to missing skills'
    },
    {
      id: 'jobs',
      label: '3. Skill-Fit Job Matching',
      icon: <Briefcase className="w-3.5 h-3.5" />,
      desc: 'Calibrated readiness score vs employer requisitions'
    },
    {
      id: 'applications',
      label: '4. 1-Click Application',
      icon: <Send className="w-3.5 h-3.5" />,
      desc: 'Application status tracking with duplicate prevention'
    },
    {
      id: 'employment',
      label: '5. Longitudinal Retention',
      icon: <ShieldCheck className="w-3.5 h-3.5" />,
      desc: 'Statutory 3/6/12-month retention audit verification'
    }
  ];

  const adminSteps = [
    {
      id: 'job_demand',
      label: 'Skill Demand Intelligence',
      icon: <Flame className="w-3.5 h-3.5" />
    },
    {
      id: 'skill_intelligence',
      label: 'Cohort Skill Gaps',
      icon: <Sparkles className="w-3.5 h-3.5" />
    },
    {
      id: 'placement_analytics',
      label: 'Employment Outcomes',
      icon: <Briefcase className="w-3.5 h-3.5" />
    },
    {
      id: 'program_impact',
      label: 'Program Impact & Retention',
      icon: <PieChart className="w-3.5 h-3.5" />
    }
  ];

  return (
    <div className="bg-slate-900 border-b border-indigo-900/60 text-slate-100 py-2.5 px-4 sm:px-6 shadow-md">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
        {/* Left: Demo Status & Evaluator Disclosure */}
        <div className="flex items-center gap-2.5 flex-wrap">
          <span className="px-2 py-0.5 rounded text-[10px] font-extrabold uppercase tracking-wider bg-amber-400 text-slate-950 flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-slate-950" /> SIH Evaluator Guided Demo
          </span>
          <span className="text-xs text-slate-300 font-medium">
            Simulated Prototype Dataset • No Live Hosted Database Records Altered
          </span>
        </div>

        {/* Right: Exit Demo Mode Action */}
        <div className="flex items-center gap-2 shrink-0">
          <Button
            size="sm"
            variant="outline"
            className="text-xs bg-slate-800 border-slate-700 text-slate-200 hover:bg-slate-700 hover:text-white h-7 py-1 px-2.5"
            leftIcon={<LogOut className="w-3 h-3 text-amber-400" />}
            onClick={exitDemoMode}
            id="btn-exit-demo-mode"
          >
            Exit Demo Mode
          </Button>
        </div>
      </div>

      {/* Guided Walkthrough Steps for Candidate Persona */}
      {profile.role === 'candidate' && (
        <div className="max-w-7xl mx-auto mt-2.5 pt-2 border-t border-slate-800/80">
          <div className="text-[11px] text-slate-400 font-semibold mb-1.5 flex items-center justify-between">
            <span>Candidate Evaluation Journey (Click to navigate):</span>
            <span className="text-indigo-400 text-[10px]">Persona: Aarav Patil (Trainee ID: prof-cand-001)</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-5 gap-1.5">
            {candidateSteps.map((step, idx) => {
              const isActive = activeTab === step.id;
              return (
                <button
                  key={step.id}
                  onClick={() => onNavigateTab(step.id)}
                  className={`text-left p-2 rounded-lg text-xs transition-all flex flex-col justify-between border ${
                    isActive
                      ? 'bg-indigo-600/30 border-indigo-400 text-white shadow-2xs'
                      : 'bg-slate-800/60 border-slate-700/80 text-slate-300 hover:bg-slate-800 hover:border-slate-600'
                  }`}
                  id={`btn-demo-step-${step.id}`}
                >
                  <div className="flex items-center justify-between gap-1 w-full">
                    <span className="font-bold flex items-center gap-1.5 truncate">
                      {step.icon}
                      <span className="truncate">{step.label}</span>
                    </span>
                    {isActive && <CheckCircle2 className="w-3 h-3 text-indigo-400 shrink-0" />}
                  </div>
                  <span className="text-[10px] text-slate-400 mt-1 line-clamp-1">
                    {step.desc}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Guided Walkthrough Steps for Org Admin Persona */}
      {profile.role === 'organization_admin' && (
        <div className="max-w-7xl mx-auto mt-2.5 pt-2 border-t border-slate-800/80">
          <div className="text-[11px] text-slate-400 font-semibold mb-1.5 flex items-center justify-between">
            <span>State Administrator Intelligence Tour:</span>
            <span className="text-purple-400 text-[10px]">Persona: Dr. Sunita Shinde, IAS (State Mission)</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
            {adminSteps.map(step => {
              const isActive = activeTab === step.id;
              return (
                <button
                  key={step.id}
                  onClick={() => onNavigateTab(step.id)}
                  className={`text-left p-2 rounded-lg text-xs transition-all flex items-center justify-between border ${
                    isActive
                      ? 'bg-purple-600/30 border-purple-400 text-white shadow-2xs'
                      : 'bg-slate-800/60 border-slate-700/80 text-slate-300 hover:bg-slate-800 hover:border-slate-600'
                  }`}
                  id={`btn-demo-admin-step-${step.id}`}
                >
                  <span className="font-bold flex items-center gap-1.5 truncate">
                    {step.icon}
                    <span className="truncate">{step.label}</span>
                  </span>
                  {isActive && <CheckCircle2 className="w-3 h-3 text-purple-400 shrink-0" />}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
