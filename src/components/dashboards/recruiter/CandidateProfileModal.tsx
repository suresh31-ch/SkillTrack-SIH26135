import React, { useState, useEffect, useMemo } from 'react';
import {
  RecruiterCandidateDetail,
  Application,
  Job,
  ApplicationStatus,
  JobRoleSkill,
  CandidateSkill
} from '../../../types';
import { RecruiterService } from '../../../lib/recruiterService';
import { SkillIntelligenceEngine } from '../../../lib/skillIntelligenceEngine';
import { Card, Badge, Button } from '../../ui';
import {
  X,
  Award,
  Briefcase,
  GraduationCap,
  FolderGit2,
  CheckCircle2,
  ShieldCheck,
  MapPin,
  Mail,
  Phone,
  Globe,
  Github,
  Linkedin,
  FileText,
  Star,
  Clock,
  Sparkles,
  ChevronRight,
  Send,
  Save,
  Check,
  UserCheck,
  Calendar,
  AlertCircle,
  Brain,
  Target
} from 'lucide-react';

interface CandidateProfileModalProps {
  candidateId: string | null;
  applicationId?: string | null;
  jobs: Job[];
  onClose: () => void;
  onStatusChange?: (applicationId: string, newStatus: ApplicationStatus, notes?: string) => void;
  onShortlistCandidate?: (candidate: RecruiterCandidateDetail, job: Job) => void;
}

export const CandidateProfileModal: React.FC<CandidateProfileModalProps> = ({
  candidateId,
  applicationId,
  jobs,
  onClose,
  onStatusChange,
  onShortlistCandidate
}) => {
  const [candidate, setCandidate] = useState<RecruiterCandidateDetail | null>(null);
  const [activeTab, setActiveTab] = useState<'skills' | 'ai_match' | 'experience' | 'education' | 'certifications' | 'projects' | 'notes'>('skills');
  const [recruiterNotes, setRecruiterNotes] = useState('');
  const [isSavingNotes, setIsSavingNotes] = useState(false);
  const [notesSavedToast, setNotesSavedToast] = useState(false);
  const [selectedJobForShortlist, setSelectedJobForShortlist] = useState<string>(jobs[0]?.id || '');
  const [shortlistSuccess, setShortlistSuccess] = useState(false);

  // Dynamic Role Compatibility for the selected Job
  const selectedJob = useMemo(() => {
    return jobs.find(j => j.id === selectedJobForShortlist) || jobs[0];
  }, [jobs, selectedJobForShortlist]);

  const jobRoleSkillsForSelectedJob = useMemo(() => {
    if (!selectedJob) return [];
    return (selectedJob.skills_required || []).map((sk: any, idx: number) => ({
      id: sk.id || `req-${idx}`,
      job_role_id: selectedJob.id,
      skill_id: sk.skill_id || sk.id || `sk-${idx}`,
      skill: { id: sk.skill_id || sk.id || `sk-${idx}`, name: sk.skill_name || 'Skill', category: 'Technical', created_at: '' },
      required_proficiency: sk.required_level || 'Intermediate',
      importance: sk.is_required ? 'Critical' : 'High'
    }));
  }, [selectedJob]);

  const candidateSkillsFormatted = useMemo(() => {
    if (!candidate) return [];
    return (candidate.skills || []).map((cs: any) => ({
      id: cs.id,
      candidate_id: candidate.id,
      skill_id: cs.id,
      skill: { id: cs.id, name: cs.name, category: cs.category, created_at: '' },
      proficiency_level: cs.proficiency,
      verified: Boolean(cs.verified),
      verification_source: cs.verification_source,
      created_at: ''
    }));
  }, [candidate]);

  const roleCompatibility = useMemo(() => {
    if (!selectedJob || !candidate) return null;
    return SkillIntelligenceEngine.calculateRoleCompatibility({
      targetRole: { id: selectedJob.id, name: selectedJob.title, description: selectedJob.description || '', category: selectedJob.job_category || 'Engineering' },
      roleRequirements: jobRoleSkillsForSelectedJob,
      candidateSkills: candidateSkillsFormatted
    });
  }, [selectedJob, candidate, jobRoleSkillsForSelectedJob, candidateSkillsFormatted]);

  // Find associated application if applicable
  const [currentApp, setCurrentApp] = useState<Application | null>(null);

  useEffect(() => {
    if (!candidateId) return;
    const det = RecruiterService.getDetailedCandidateById(candidateId);
    if (det) {
      setCandidate(det);
      const savedNotes = RecruiterService.getCandidateNotes(det.profile_id || det.id);
      setRecruiterNotes(savedNotes);
    }

    const apps = RecruiterService.getApplications();
    if (applicationId) {
      const matched = apps.find(a => a.id === applicationId);
      if (matched) setCurrentApp(matched);
    } else {
      const candidateApp = apps.find(a => a.candidate_id === candidateId);
      if (candidateApp) setCurrentApp(candidateApp);
    }
  }, [candidateId, applicationId]);

  if (!candidateId || !candidate) return null;

  const handleSaveNotes = () => {
    setIsSavingNotes(true);
    RecruiterService.saveCandidateNotes(candidate.profile_id || candidate.id, recruiterNotes);
    if (currentApp && onStatusChange) {
      onStatusChange(currentApp.id, currentApp.status, recruiterNotes);
    }
    setTimeout(() => {
      setIsSavingNotes(false);
      setNotesSavedToast(true);
      setTimeout(() => setNotesSavedToast(false), 3000);
    }, 300);
  };

  const handleDirectShortlist = () => {
    const job = jobs.find(j => j.id === selectedJobForShortlist);
    if (job && onShortlistCandidate) {
      onShortlistCandidate(candidate, job);
      setShortlistSuccess(true);
      setTimeout(() => setShortlistSuccess(false), 3000);
    }
  };

  const verifiedSkillsCount = candidate.skills.filter(s => s.verified).length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-4xl max-h-[90vh] bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 flex flex-col overflow-hidden text-slate-800 dark:text-slate-100"
        onClick={e => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="relative px-6 pt-6 pb-4 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white flex-shrink-0 border-b border-slate-800">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white bg-white/10 hover:bg-white/20 rounded-full transition-colors"
            title="Close Profile"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
            <div className="relative">
              <img
                src={candidate.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=128&auto=format&fit=crop&q=80'}
                alt={candidate.full_name}
                className="w-16 h-16 md:w-20 md:h-20 rounded-2xl object-cover ring-4 ring-indigo-500/30 shadow-lg"
                referrerPolicy="no-referrer"
              />
              <span className="absolute -bottom-1 -right-1 bg-emerald-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full flex items-center gap-0.5 ring-2 ring-slate-900">
                <CheckCircle2 className="w-3 h-3" />
                Verified
              </span>
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-xl md:text-2xl font-bold tracking-tight text-white truncate">
                  {candidate.full_name}
                </h2>
                <Badge variant="primary" className="bg-indigo-500/20 text-indigo-300 border-indigo-500/30 text-xs">
                  {candidate.target_job}
                </Badge>
                <span className="text-xs px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  {candidate.employment_status === 'placed' ? 'Available / Placed' : candidate.employment_status.replace('_', ' ')}
                </span>
              </div>

              <p className="text-xs md:text-sm text-slate-300 mt-1 line-clamp-1">
                {candidate.headline}
              </p>

              <div className="flex flex-wrap items-center gap-3 mt-2 text-xs text-slate-400">
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-indigo-400" />
                  {candidate.district}, {candidate.state}
                </span>
                <span className="flex items-center gap-1">
                  <Mail className="w-3.5 h-3.5 text-indigo-400" />
                  {candidate.email}
                </span>
                <span className="flex items-center gap-1">
                  <Phone className="w-3.5 h-3.5 text-indigo-400" />
                  {candidate.phone}
                </span>
              </div>
            </div>

            {/* Score Ring / Badge */}
            <div className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-xl px-4 py-2 self-stretch md:self-auto justify-between md:justify-center">
              <div className="text-center">
                <div className="text-2xl font-black text-emerald-400 leading-none">
                  {candidate.readiness_score}%
                </div>
                <div className="text-[10px] text-slate-400 font-medium mt-0.5">Readiness Score</div>
              </div>
              <div className="h-8 w-px bg-white/10" />
              <div className="text-center">
                <div className="text-lg font-bold text-indigo-300 leading-none">
                  {candidate.experience_years} {candidate.experience_years === 1 ? 'Yr' : 'Yrs'}
                </div>
                <div className="text-[10px] text-slate-400 font-medium mt-0.5">Experience</div>
              </div>
            </div>
          </div>

          {/* Social Links & Quick Links */}
          <div className="flex items-center gap-2 mt-3 pt-3 border-t border-slate-800/80 text-xs">
            {candidate.portfolio_url && (
              <a
                href={candidate.portfolio_url}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1 text-indigo-300 hover:text-white transition-colors bg-white/5 px-2.5 py-1 rounded-md"
              >
                <Globe className="w-3.5 h-3.5" />
                Portfolio
              </a>
            )}
            {candidate.github_url && (
              <a
                href={candidate.github_url}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1 text-slate-300 hover:text-white transition-colors bg-white/5 px-2.5 py-1 rounded-md"
              >
                <Github className="w-3.5 h-3.5" />
                GitHub
              </a>
            )}
            {candidate.linkedin_url && (
              <a
                href={candidate.linkedin_url}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1 text-sky-300 hover:text-white transition-colors bg-white/5 px-2.5 py-1 rounded-md"
              >
                <Linkedin className="w-3.5 h-3.5" />
                LinkedIn
              </a>
            )}
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-1 px-6 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 overflow-x-auto scrollbar-none flex-shrink-0">
          <button
            onClick={() => setActiveTab('skills')}
            className={`flex items-center gap-1.5 px-3.5 py-2.5 text-xs font-semibold border-b-2 whitespace-nowrap transition-colors ${
              activeTab === 'skills'
                ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400 bg-white dark:bg-slate-900 shadow-sm'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <Award className="w-3.5 h-3.5" />
            Skills & Verification ({candidate.skills.length})
          </button>
          <button
            onClick={() => setActiveTab('experience')}
            className={`flex items-center gap-1.5 px-3.5 py-2.5 text-xs font-semibold border-b-2 whitespace-nowrap transition-colors ${
              activeTab === 'experience'
                ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400 bg-white dark:bg-slate-900 shadow-sm'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <Briefcase className="w-3.5 h-3.5" />
            Experience ({candidate.experience.length})
          </button>
          <button
            onClick={() => setActiveTab('education')}
            className={`flex items-center gap-1.5 px-3.5 py-2.5 text-xs font-semibold border-b-2 whitespace-nowrap transition-colors ${
              activeTab === 'education'
                ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400 bg-white dark:bg-slate-900 shadow-sm'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <GraduationCap className="w-3.5 h-3.5" />
            Education ({candidate.education.length})
          </button>
          <button
            onClick={() => setActiveTab('certifications')}
            className={`flex items-center gap-1.5 px-3.5 py-2.5 text-xs font-semibold border-b-2 whitespace-nowrap transition-colors ${
              activeTab === 'certifications'
                ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400 bg-white dark:bg-slate-900 shadow-sm'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            Certifications ({candidate.certifications.length})
          </button>
          <button
            onClick={() => setActiveTab('projects')}
            className={`flex items-center gap-1.5 px-3.5 py-2.5 text-xs font-semibold border-b-2 whitespace-nowrap transition-colors ${
              activeTab === 'projects'
                ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400 bg-white dark:bg-slate-900 shadow-sm'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <FolderGit2 className="w-3.5 h-3.5" />
            Projects ({candidate.projects.length})
          </button>
          <button
            onClick={() => setActiveTab('notes')}
            className={`flex items-center gap-1.5 px-3.5 py-2.5 text-xs font-semibold border-b-2 whitespace-nowrap transition-colors ${
              activeTab === 'notes'
                ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400 bg-white dark:bg-slate-900 shadow-sm'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            Evaluation & Actions
          </button>
        </div>

        {/* Modal Scrollable Content */}
        <div className="p-6 overflow-y-auto max-h-[55vh] space-y-6">
          {/* TAB 1: SKILLS */}
          {activeTab === 'skills' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                    Candidate Skill Matrix & Verification
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {verifiedSkillsCount} of {candidate.skills.length} skills verified via State Skilling Benchmarks
                  </p>
                </div>
                <div className="flex items-center gap-2 text-xs font-semibold px-2.5 py-1 bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 rounded-lg">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  NSDC & NCVET Compliant
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {candidate.skills.map(skill => (
                  <div
                    key={skill.id}
                    className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50 hover:bg-slate-100/60 dark:hover:bg-slate-800 transition-colors"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <div className="font-semibold text-xs text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                          {skill.name}
                          {skill.verified && (
                            <span title="Verified by State Skilling Assessment">
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" />
                            </span>
                          )}
                        </div>
                        <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                          {skill.category}
                        </div>
                      </div>

                      <Badge
                        variant={
                          skill.proficiency === 'Expert'
                            ? 'primary'
                            : skill.proficiency === 'Advanced'
                            ? 'success'
                            : 'secondary'
                        }
                        className="text-[10px] px-2 py-0.5"
                      >
                        {skill.proficiency}
                      </Badge>
                    </div>

                    {skill.verified && skill.verification_source && (
                      <div className="mt-2.5 pt-2 border-t border-slate-200 dark:border-slate-700/60 flex items-center gap-1 text-[10px] text-emerald-700 dark:text-emerald-400 font-medium">
                        <Sparkles className="w-3 h-3 flex-shrink-0" />
                        <span>Source: {skill.verification_source}</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Bio summary */}
              <div className="p-4 rounded-xl bg-indigo-50/50 dark:bg-indigo-950/20 border border-indigo-100 dark:border-indigo-900/40 mt-4">
                <h4 className="text-xs font-bold text-indigo-900 dark:text-indigo-200 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                  Executive Candidate Summary
                </h4>
                <p className="text-xs text-slate-700 dark:text-slate-300 mt-1.5 leading-relaxed">
                  {candidate.bio}
                </p>
              </div>
            </div>
          )}

          {/* TAB 2: EXPERIENCE */}
          {activeTab === 'experience' && (
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                Work History & Internships
              </h3>
              {candidate.experience.length === 0 ? (
                <div className="text-xs text-slate-500 py-6 text-center">
                  No work experience records listed yet.
                </div>
              ) : (
                <div className="space-y-3 relative before:absolute before:left-3.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200 dark:before:bg-slate-800">
                  {candidate.experience.map(exp => (
                    <div key={exp.id} className="relative pl-8">
                      <div className="absolute left-2 top-1.5 w-3.5 h-3.5 rounded-full border-2 border-indigo-600 bg-white dark:bg-slate-900" />
                      <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/40 dark:bg-slate-800/40">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                          <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100">
                            {exp.title}
                          </h4>
                          <span className="text-[11px] font-medium text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/40 px-2 py-0.5 rounded">
                            {exp.start_date} – {exp.end_date}
                          </span>
                        </div>
                        <div className="text-xs font-medium text-slate-600 dark:text-slate-300 mt-0.5">
                          {exp.company} • {exp.location}
                        </div>
                        <p className="text-xs text-slate-600 dark:text-slate-400 mt-2 leading-relaxed">
                          {exp.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 3: EDUCATION */}
          {activeTab === 'education' && (
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                Academic Background & Degrees
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {candidate.education.map(edu => (
                  <div
                    key={edu.id}
                    className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/40 dark:bg-slate-800/40"
                  >
                    <div className="flex items-center gap-2">
                      <div className="p-2 rounded-lg bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400">
                        <GraduationCap className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100">
                          {edu.degree}
                        </h4>
                        <div className="text-[11px] text-slate-500">{edu.field_of_study}</div>
                      </div>
                    </div>

                    <div className="mt-3 pt-3 border-t border-slate-200 dark:border-slate-700/60 text-xs text-slate-600 dark:text-slate-300">
                      <div className="font-medium text-slate-800 dark:text-slate-200">{edu.institution}</div>
                      <div className="flex items-center justify-between mt-1 text-[11px] text-slate-500">
                        <span>Class of {edu.graduation_year}</span>
                        {edu.grade_or_gpa && (
                          <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                            Score: {edu.grade_or_gpa}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: CERTIFICATIONS */}
          {activeTab === 'certifications' && (
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                Recognized Certifications & Accreditations
              </h3>
              <div className="space-y-3">
                {candidate.certifications.map(cert => (
                  <div
                    key={cert.id}
                    className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/40 dark:bg-slate-800/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                  >
                    <div className="flex items-start gap-3">
                      <div className="p-2 rounded-lg bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 mt-0.5">
                        <ShieldCheck className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                          {cert.name}
                          {cert.verified && (
                            <Badge variant="success" className="text-[9px] px-1.5 py-0">
                              Verified
                            </Badge>
                          )}
                        </h4>
                        <div className="text-[11px] text-slate-500 mt-0.5">
                          Issued by {cert.issuing_org} • {cert.issue_date}
                        </div>
                        <div className="text-[10px] text-slate-400 font-mono mt-1">
                          ID: {cert.credential_id}
                        </div>
                      </div>
                    </div>

                    {cert.verification_url && (
                      <a
                        href={cert.verification_url}
                        target="_blank"
                        rel="noreferrer"
                        className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 flex items-center gap-1 self-end sm:self-center"
                      >
                        Verify Credential
                        <ChevronRight className="w-3 h-3" />
                      </a>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 5: PROJECTS */}
          {activeTab === 'projects' && (
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                Capstone Projects & Portfolio Artifacts
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {candidate.projects.map(proj => (
                  <div
                    key={proj.id}
                    className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/40 dark:bg-slate-800/40 flex flex-col justify-between"
                  >
                    <div>
                      <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100">
                        {proj.title}
                      </h4>
                      <p className="text-xs text-slate-600 dark:text-slate-400 mt-1.5 leading-relaxed">
                        {proj.description}
                      </p>
                      <div className="flex flex-wrap gap-1 mt-3">
                        {proj.tech_stack.map(tech => (
                          <span
                            key={tech}
                            className="text-[10px] px-2 py-0.5 rounded bg-slate-200/70 dark:bg-slate-700 text-slate-700 dark:text-slate-300 font-medium"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 mt-4 pt-3 border-t border-slate-200 dark:border-slate-700/60 text-xs">
                      {proj.github_url && (
                        <a
                          href={proj.github_url}
                          target="_blank"
                          rel="noreferrer"
                          className="flex items-center gap-1 text-slate-600 dark:text-slate-400 hover:text-indigo-600"
                        >
                          <Github className="w-3.5 h-3.5" />
                          Code Repo
                        </a>
                      )}
                      {proj.live_url && (
                        <a
                          href={proj.live_url}
                          target="_blank"
                          rel="noreferrer"
                          className="flex items-center gap-1 text-indigo-600 dark:text-indigo-400 hover:underline font-medium ml-auto"
                        >
                          <Globe className="w-3.5 h-3.5" />
                          Live Demo
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 6: EVALUATION & RECRUITER ACTIONS */}
          {activeTab === 'notes' && (
            <div className="space-y-5">
              {/* Application Status Banner */}
              {currentApp && (
                <div className="p-4 rounded-xl border border-indigo-200 dark:border-indigo-900/50 bg-indigo-50/50 dark:bg-indigo-950/30">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <span className="text-xs font-semibold text-indigo-900 dark:text-indigo-300">
                        Applied Job:
                      </span>
                      <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                        {currentApp.job?.title || 'Job Opening'}
                      </h4>
                      <p className="text-xs text-slate-500">
                        Applied on {new Date(currentApp.applied_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </p>
                    </div>

                    {/* Stage Switcher */}
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-medium text-slate-600 dark:text-slate-400">
                        Recruitment Stage:
                      </span>
                      <select
                        value={currentApp.status}
                        onChange={e => {
                          const newSt = e.target.value as ApplicationStatus;
                          if (onStatusChange) {
                            onStatusChange(currentApp.id, newSt, recruiterNotes);
                            setCurrentApp({ ...currentApp, status: newSt });
                          }
                        }}
                        className="px-3 py-1.5 text-xs font-bold rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500 shadow-sm"
                      >
                        <option value="Applied">Applied</option>
                        <option value="Screening">Screening</option>
                        <option value="Shortlisted">Shortlisted</option>
                        <option value="Interview">Interview</option>
                        <option value="Selected">Selected / Hired</option>
                        <option value="Rejected">Rejected</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {/* Direct Shortlist to Job (if viewing from general candidate search) */}
              {!currentApp && (
                <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/40">
                  <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                    <UserCheck className="w-4 h-4 text-indigo-600" />
                    Directly Shortlist Candidate for Active Vacancy
                  </h4>
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 mt-2.5">
                    <select
                      value={selectedJobForShortlist}
                      onChange={e => setSelectedJobForShortlist(e.target.value)}
                      className="flex-1 px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900"
                    >
                      {jobs.map(job => (
                        <option key={job.id} value={job.id}>
                          {job.title} — {job.company_name} ({job.location})
                        </option>
                      ))}
                    </select>
                    <Button
                      size="sm"
                      variant="primary"
                      onClick={handleDirectShortlist}
                      className="text-xs whitespace-nowrap"
                    >
                      <Send className="w-3.5 h-3.5 mr-1" />
                      Shortlist for Role
                    </Button>
                  </div>
                  {shortlistSuccess && (
                    <div className="text-xs text-emerald-600 font-semibold mt-2 flex items-center gap-1 animate-in fade-in">
                      <Check className="w-3.5 h-3.5" />
                      Successfully added to Job Shortlist pipeline!
                    </div>
                  )}
                </div>
              )}

              {/* Recruiter Evaluation Notes Text Area */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-bold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                    <FileText className="w-3.5 h-3.5 text-indigo-600" />
                    Private Recruiter Evaluation & Interview Notes
                  </label>
                  {notesSavedToast && (
                    <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
                      <Check className="w-3 h-3" />
                      Notes saved securely
                    </span>
                  )}
                </div>
                <textarea
                  rows={4}
                  value={recruiterNotes}
                  onChange={e => setRecruiterNotes(e.target.value)}
                  placeholder="Record interview impressions, technical strengths, salary expectations, or next steps..."
                  className="w-full p-3 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500 leading-relaxed"
                />
                <div className="flex justify-end mt-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={handleSaveNotes}
                    disabled={isSavingNotes}
                    className="text-xs font-semibold"
                  >
                    <Save className="w-3.5 h-3.5 mr-1" />
                    {isSavingNotes ? 'Saving...' : 'Save Evaluation Notes'}
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3.5 bg-slate-50 dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between flex-shrink-0">
          <div className="text-xs text-slate-500 flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>SkillTrack Verified Talent Record</span>
          </div>

          <div className="flex items-center gap-2">
            <Button size="sm" variant="ghost" onClick={onClose} className="text-xs">
              Close
            </Button>
            {activeTab !== 'notes' && (
              <Button
                size="sm"
                variant="primary"
                onClick={() => setActiveTab('notes')}
                className="text-xs font-semibold"
              >
                Hiring Actions & Notes
                <ChevronRight className="w-3.5 h-3.5 ml-1" />
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
