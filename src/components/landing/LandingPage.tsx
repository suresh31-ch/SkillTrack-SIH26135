import React, { useState } from 'react';
import { Button, Badge, Card } from '../ui';
import { useAuth } from '../../context/AuthContext';
import { UserRole } from '../../types';
import {
  ArrowRight,
  Database,
  ShieldCheck,
  Building2,
  Users,
  CheckCircle2,
  TrendingUp,
  Cpu,
  GraduationCap,
  Briefcase,
  Layers,
  MapPin,
  Flame,
  Award,
  Sparkles,
  Play
} from 'lucide-react';

interface LandingPageProps {
  onOpenAuth: (mode?: 'signin' | 'signup') => void;
  onOpenDemo: () => void;
  onOpenSchema: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onOpenAuth,
  onOpenDemo,
  onOpenSchema
}) => {
  const { quickDemoLogin, isSupabaseLive } = useAuth();
  const [activeWorkflowStep, setActiveWorkflowStep] = useState(0);

  const workflowSteps = [
    { num: 1, title: 'Training', desc: 'Curriculum & batch management across accredited institutes', icon: <GraduationCap className="w-4 h-4" /> },
    { num: 2, title: 'Skills', desc: 'Granular skill taxonomy mapping & candidate profile logging', icon: <Sparkles className="w-4 h-4" /> },
    { num: 3, title: 'Skill Gap', desc: 'Automated delta calculation vs live industry job market demands', icon: <TrendingUp className="w-4 h-4" /> },
    { num: 4, title: 'Learning', desc: 'AI-generated personalized roadmap & structured milestones', icon: <Layers className="w-4 h-4" /> },
    { num: 5, title: 'Assessment', desc: 'Competency tests, real-time code evaluation in Monaco sandbox', icon: <CheckCircle2 className="w-4 h-4" /> },
    { num: 6, title: 'Certification', desc: 'Tamper-proof verifiable credentials with unique identifiers', icon: <Award className="w-4 h-4" /> },
    { num: 7, title: 'Job', desc: 'Recruiter job postings with required skill proficiency vectors', icon: <Briefcase className="w-4 h-4" /> },
    { num: 8, title: 'Placement', desc: 'Candidate matching, application pipeline, offer & joining tracking', icon: <Users className="w-4 h-4" /> },
    { num: 9, title: 'Verification', desc: 'Simulated EPFO / wage remittance validation to prevent ghost records', icon: <ShieldCheck className="w-4 h-4" /> },
    { num: 10, title: 'Retention (3/6/12M)', desc: 'Longitudinal employment continuity tracking across quarters', icon: <Cpu className="w-4 h-4" /> },
    { num: 11, title: 'Org Analytics', desc: 'State-wide district intelligence, anomaly alerts & funding ROI models', icon: <Building2 className="w-4 h-4" /> }
  ];

  return (
    <div className="space-y-12 pb-16 pt-4">
      {/* Hero Section */}
      <section className="relative pt-8 sm:pt-14 px-4 text-center max-w-5xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-indigo-50 border border-indigo-200 text-[11px] font-bold text-indigo-700 mb-5 uppercase tracking-wider">
          <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
          <span>Smart India Hackathon 2026</span>
          <span className="text-slate-400">•</span>
          <span className="font-bold text-indigo-900">Problem Statement SIH26135</span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight leading-[1.15]">
          AI-Powered Skilling & <br />
          <span className="bg-gradient-to-r from-indigo-600 via-indigo-500 to-sky-600 bg-clip-text text-transparent">
            Employment Intelligence Platform
          </span>
        </h1>

        <p className="mt-4 text-sm sm:text-base text-slate-600 max-w-3xl mx-auto leading-relaxed">
          SkillTrack is an independent commercial multi-tenant SaaS platform built to solve the national challenge of tracking employment outcomes, skill deficits, and longitudinal retention across institutional skilling programs.
        </p>

        {/* CTAs */}
        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
          <Button
            size="md"
            variant="primary"
            onClick={() => onOpenAuth('signup')}
            rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
            id="btn-hero-get-started"
          >
            Create Free Account
          </Button>

          <Button
            size="md"
            variant="secondary"
            onClick={onOpenDemo}
            leftIcon={<Play className="w-3.5 h-3.5 text-amber-600" />}
            id="btn-hero-demo-login"
          >
            Instant Demo Logins
          </Button>

          <Button
            size="md"
            variant="outline"
            onClick={onOpenSchema}
            leftIcon={<Database className="w-3.5 h-3.5 text-indigo-600" />}
            id="btn-hero-schema"
          >
            PostgreSQL & RLS Schema
          </Button>
        </div>

        {/* Live Architecture Status Bar */}
        <div className="mt-8 p-3 rounded-lg border border-slate-200 bg-white shadow-2xs max-w-2xl mx-auto flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 text-slate-600">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Multi-Tenant RLS: <strong className="text-slate-900">Active</strong></span>
          </div>
          <div className="flex items-center gap-2 text-slate-600">
            <Database className="w-3.5 h-3.5 text-indigo-600" />
            <span>Database: <strong className="text-slate-900">{isSupabaseLive ? 'Supabase PostgreSQL' : 'PostgreSQL Engine'}</strong></span>
          </div>
          <div className="flex items-center gap-2 text-slate-600">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>Tenant Isolation: <strong className="text-emerald-700 font-bold">Enforced</strong></span>
          </div>
        </div>
      </section>

      {/* 11-Step Product Workflow Visualizer */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-6">
          <Badge variant="primary" className="mb-1.5">End-to-End Workflow</Badge>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            The Complete Skilling-to-Retention Pipeline
          </h2>
          <p className="text-xs text-slate-500 mt-1 max-w-2xl mx-auto">
            From initial training enrollment to 3/6/12-month verified employment retention and high-level macroeconomic impact intelligence.
          </p>
        </div>

        <div className="p-5 rounded-xl border border-slate-200 bg-white shadow-sm">
          {/* Scrollable Workflow Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-3 scrollbar-thin">
            {workflowSteps.map((step, idx) => {
              const isActive = activeWorkflowStep === idx;
              return (
                <button
                  key={step.num}
                  onClick={() => setActiveWorkflowStep(idx)}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all border shrink-0 cursor-pointer ${
                    isActive
                      ? 'border-indigo-600 bg-indigo-600 text-white shadow-sm'
                      : 'border-slate-200 bg-slate-50 text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                  id={`btn-workflow-step-${step.num}`}
                >
                  <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[9px] font-bold ${isActive ? 'bg-white text-indigo-600' : 'bg-slate-200 text-slate-700'}`}>
                    {step.num}
                  </span>
                  <span>{step.title}</span>
                </button>
              );
            })}
          </div>

          {/* Active Step Details */}
          <div className="mt-4 p-4 rounded-lg border border-slate-200 bg-slate-50 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="p-2.5 rounded-lg bg-indigo-50 border border-indigo-200 text-indigo-600">
                {workflowSteps[activeWorkflowStep].icon}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold text-indigo-700 uppercase tracking-wider">
                    Step {workflowSteps[activeWorkflowStep].num} of 11
                  </span>
                  <h3 className="text-base font-bold text-slate-900">{workflowSteps[activeWorkflowStep].title}</h3>
                </div>
                <p className="text-xs text-slate-600 mt-0.5">{workflowSteps[activeWorkflowStep].desc}</p>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <Button
                size="sm"
                variant="secondary"
                disabled={activeWorkflowStep === 0}
                onClick={() => setActiveWorkflowStep(prev => Math.max(0, prev - 1))}
              >
                Previous
              </Button>
              <Button
                size="sm"
                variant="primary"
                disabled={activeWorkflowStep === workflowSteps.length - 1}
                onClick={() => setActiveWorkflowStep(prev => Math.min(workflowSteps.length - 1, prev + 1))}
              >
                Next Step
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* 4 Multi-Tenant Dashboards Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-8">
          <Badge variant="purple" className="mb-1.5">Multi-Role SaaS</Badge>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            Four Role-Specific SaaS Dashboards
          </h2>
          <p className="text-xs text-slate-500 mt-1 max-w-2xl mx-auto">
            SkillTrack provides dedicated role-based portals with granular data isolation and custom workflows.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Card 1: Candidate */}
          <Card className="p-4 flex flex-col justify-between hover:border-indigo-400 hover:shadow-md transition-all group">
            <div className="space-y-2.5">
              <div className="p-2 rounded-lg bg-indigo-50 border border-indigo-200 text-indigo-600 w-fit">
                <Users className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                Candidate Portal
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Skill gap heatmaps, AI-personalized roadmaps, Monaco code sandbox, verified certifications, job applications, and simulated EPFO retention timeline.
              </p>
              <div className="space-y-1 pt-2 border-t border-slate-100 text-[10px] text-slate-600">
                <div className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-indigo-600" /> Readiness Score Calculator</div>
                <div className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-indigo-600" /> Interactive Skill Gap Matrix</div>
              </div>
            </div>
            <Button
              size="sm"
              variant="secondary"
              className="mt-4 w-full"
              onClick={() => quickDemoLogin('candidate')}
              id="btn-card-demo-candidate"
            >
              Open Candidate Dashboard
            </Button>
          </Card>

          {/* Card 2: Recruiter */}
          <Card className="p-4 flex flex-col justify-between hover:border-emerald-400 hover:shadow-md transition-all group">
            <div className="space-y-2.5">
              <div className="p-2 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-600 w-fit">
                <Briefcase className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-bold text-slate-900 group-hover:text-emerald-600 transition-colors">
                Recruiter Hub
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Post job requirements with required skill proficiency tiers, search verified candidates by district, and triage applicant pipelines.
              </p>
              <div className="space-y-1 pt-2 border-t border-slate-100 text-[10px] text-slate-600">
                <div className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Skill-Match Score Engine</div>
                <div className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Direct Candidate Pipeline</div>
              </div>
            </div>
            <Button
              size="sm"
              variant="secondary"
              className="mt-4 w-full"
              onClick={() => quickDemoLogin('recruiter')}
              id="btn-card-demo-recruiter"
            >
              Open Recruiter Dashboard
            </Button>
          </Card>

          {/* Card 3: Training Center */}
          <Card className="p-4 flex flex-col justify-between hover:border-amber-400 hover:shadow-md transition-all group">
            <div className="space-y-2.5">
              <div className="p-2 rounded-lg bg-amber-50 border border-amber-200 text-amber-600 w-fit">
                <GraduationCap className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-bold text-slate-900 group-hover:text-amber-600 transition-colors">
                Training Center
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Manage batches, mark daily biometric/manual attendance, conduct assessments, issue certificates, and log verified student placements.
              </p>
              <div className="space-y-1 pt-2 border-t border-slate-100 text-[10px] text-slate-600">
                <div className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-amber-600" /> Daily Attendance Log</div>
                <div className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-amber-600" /> Digital Certificate Generator</div>
              </div>
            </div>
            <Button
              size="sm"
              variant="secondary"
              className="mt-4 w-full"
              onClick={() => quickDemoLogin('training_center')}
              id="btn-card-demo-training"
            >
              Open Training Dashboard
            </Button>
          </Card>

          {/* Card 4: Organization Admin */}
          <Card className="p-4 flex flex-col justify-between hover:border-purple-400 hover:shadow-md transition-all group">
            <div className="space-y-2.5">
              <div className="p-2 rounded-lg bg-purple-50 border border-purple-200 text-purple-600 w-fit">
                <Building2 className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-bold text-slate-900 group-hover:text-purple-600 transition-colors">
                Organization Intelligence
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                State-wide district analytics, 3/6/12-month employment retention curves, AI anomaly detection (ghost placements), and funding ROI simulator.
              </p>
              <div className="space-y-1 pt-2 border-t border-slate-100 text-[10px] text-slate-600">
                <div className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-purple-600" /> 3/6/12M Retention Curves</div>
                <div className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-purple-600" /> Anti-Fraud Anomaly Alerts</div>
              </div>
            </div>
            <Button
              size="sm"
              variant="secondary"
              className="mt-4 w-full"
              onClick={() => quickDemoLogin('organization_admin')}
              id="btn-card-demo-org"
            >
              Open Organization Intel
            </Button>
          </Card>
        </div>
      </section>

      {/* Multi-Tenant SaaS Architecture Explanation */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="p-6 rounded-xl border border-slate-200 bg-white shadow-sm flex flex-col lg:flex-row items-center justify-between gap-6">
          <div className="space-y-2.5 max-w-xl">
            <div className="flex items-center gap-2">
              <Badge variant="success">Tenant Isolation</Badge>
              <span className="text-xs text-slate-500">Commercial Architecture</span>
            </div>
            <h3 className="text-xl font-bold text-slate-900">
              Multi-Tenant Architecture with Row Level Security
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              SkillTrack is engineered so multiple customer organizations—such as the <strong>Government of Maharashtra Skilling Mission</strong>, <strong>TechSkills Foundation</strong>, and private CSR trusts—can independently deploy, track, and analyze programs with 100% data isolation.
            </p>
            <div className="flex flex-wrap items-center gap-2.5 pt-2">
              <Button size="sm" variant="primary" onClick={onOpenSchema} id="btn-view-rls-rules">
                Inspect RLS Rules & SQL
              </Button>
              <Button size="sm" variant="outline" onClick={() => onOpenAuth('signup')} id="btn-create-tenant-account">
                Register New User
              </Button>
            </div>
          </div>

          <div className="w-full lg:w-96 rounded-lg border border-slate-800 bg-slate-900 p-4 font-mono text-[11px] text-slate-300 space-y-1.5 shadow-md">
            <div className="text-slate-500">// Example RLS Enforcement:</div>
            <div className="text-emerald-400">CREATE POLICY "Tenant Isolation"</div>
            <div className="text-slate-400 pl-3">ON public.candidate_profiles FOR ALL</div>
            <div className="text-indigo-300 pl-3">USING (</div>
            <div className="text-slate-200 pl-6">organization_id = (</div>
            <div className="text-amber-300 pl-9">SELECT organization_id FROM public.profiles</div>
            <div className="text-amber-300 pl-9">WHERE auth_user_id = auth.uid()</div>
            <div className="text-slate-200 pl-6">)</div>
            <div className="text-indigo-300 pl-3">);</div>
            <div className="pt-2 text-[10px] text-slate-400 border-t border-slate-800 flex items-center gap-1">
              <span className="text-emerald-400">✓</span> Prevents cross-organization data leakage automatically
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
