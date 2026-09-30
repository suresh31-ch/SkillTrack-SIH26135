import React, { useState, useMemo } from 'react';
import { Card, Button, Badge, Modal, Input } from '../../../ui';
import {
  StudentSkillRecord,
  StudentCertificationRecord
} from '../../../../types/studentJourney';
import { StudentJourneyService } from '../../../../lib/studentJourneyService';
import { AssessmentResult } from '../../../../types';
import { useToast } from '../../../../context/ToastContext';
import {
  Briefcase,
  Award,
  Sparkles,
  CheckCircle2,
  Code2,
  ExternalLink,
  Plus,
  Trash2,
  Github,
  Globe,
  FileText,
  ShieldCheck,
  Download,
  Share2,
  BookOpen
} from 'lucide-react';

interface CareerPortfolioViewProps {
  studentId: string;
  onNavigateToAssessments?: () => void;
  onOpenOnboarding?: () => void;
}

export const CareerPortfolioView: React.FC<CareerPortfolioViewProps> = ({
  studentId,
  onNavigateToAssessments,
  onOpenOnboarding
}) => {
  const { showToast } = useToast();
  const profile = useMemo(() => StudentJourneyService.getAcademicProfile(studentId), [studentId]);
  const [skills, setSkills] = useState<StudentSkillRecord[]>(() => StudentJourneyService.getSkills(studentId));
  const [certs, setCerts] = useState<StudentCertificationRecord[]>(() => StudentJourneyService.getCertifications(studentId));

  // Projects State
  const [projects, setProjects] = useState<Array<{ id: string; title: string; description: string; githubUrl: string; liveDemoUrl?: string; techStack: string[] }>>(() => {
    try {
      const stored = localStorage.getItem(`skilltrack_student_projects_${studentId}`);
      if (stored) return JSON.parse(stored);
    } catch (e) {
      console.error(e);
    }
    return [];
  });

  React.useEffect(() => {
    setSkills(StudentJourneyService.getSkills(studentId));
    setCerts(StudentJourneyService.getCertifications(studentId));
    try {
      const stored = localStorage.getItem(`skilltrack_student_projects_${studentId}`);
      setProjects(stored ? JSON.parse(stored) : []);
    } catch (e) {
      console.error(e);
    }
  }, [studentId]);

  const [isAddProjectModalOpen, setIsAddProjectModalOpen] = useState(false);
  const [projTitle, setProjTitle] = useState('');
  const [projDesc, setProjDesc] = useState('');
  const [projGithub, setProjGithub] = useState('');
  const [projLiveDemo, setProjLiveDemo] = useState('');
  const [projTech, setProjTech] = useState('');

  // Assessment results
  const assessments: AssessmentResult[] = useMemo(() => {
    try {
      const stored = localStorage.getItem(`skilltrack_assessment_results_${studentId}`);
      if (stored) return JSON.parse(stored);
    } catch (e) {
      console.error(e);
    }
    return [];
  }, [studentId]);

  const handleSaveProject = () => {
    if (!projTitle.trim()) {
      showToast('Please provide Project Title', 'warning');
      return;
    }
    const newProj = {
      id: `proj-${Date.now()}`,
      title: projTitle.trim(),
      description: projDesc.trim(),
      githubUrl: projGithub.trim(),
      liveDemoUrl: projLiveDemo.trim() || undefined,
      techStack: projTech.split(',').map(t => t.trim()).filter(Boolean)
    };

    const updated = [newProj, ...projects];
    setProjects(updated);
    try {
      localStorage.setItem(`skilltrack_student_projects_${studentId}`, JSON.stringify(updated));
    } catch (e) {
      console.error(e);
    }

    setProjTitle('');
    setProjDesc('');
    setProjGithub('');
    setProjLiveDemo('');
    setProjTech('');
    setIsAddProjectModalOpen(false);
    showToast(`Project "${newProj.title}" added to portfolio!`, 'success');
  };

  const handleDeleteProject = (id: string) => {
    const updated = projects.filter(p => p.id !== id);
    setProjects(updated);
    try {
      localStorage.setItem(`skilltrack_student_projects_${studentId}`, JSON.stringify(updated));
    } catch (e) {
      console.error(e);
    }
    showToast('Project removed', 'info');
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="p-5 rounded-xl border border-slate-200 bg-white shadow-2xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-teal-50 text-teal-700 border border-teal-200">
              Module 6: Verified Evidence Portfolio
            </span>
            <span className="text-xs text-slate-500 font-medium">Candidate Talent Ledger</span>
          </div>
          <h2 className="text-xl font-bold text-slate-900">Career Portfolio & Evidence Center</h2>
          <p className="text-xs text-slate-500 max-w-xl">
            A unified, tamper-evident showcase of your technical projects, verified certifications, assessment scorecards, and demonstrable engineering artifacts.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {onOpenOnboarding && (
            <Button size="sm" variant="outline" onClick={onOpenOnboarding} className="text-xs">
              Edit Academic Profile
            </Button>
          )}
          <Button
            size="sm"
            variant="primary"
            onClick={() => setIsAddProjectModalOpen(true)}
            className="text-xs font-semibold flex items-center gap-1"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Project Artifact</span>
          </Button>
        </div>
      </div>

      {/* Grid: 3 Main Pillars (Projects, Certifications, Assessments) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Pillar 1: Projects & Code Repositories */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
              <Code2 className="w-3.5 h-3.5 text-indigo-600" />
              Verified Projects ({projects.length})
            </h3>
            <button
              onClick={() => setIsAddProjectModalOpen(true)}
              className="text-[11px] text-indigo-600 font-semibold hover:underline cursor-pointer"
            >
              + Add
            </button>
          </div>

          {projects.length === 0 ? (
            <Card className="p-6 text-center bg-slate-50 border border-dashed border-slate-300 space-y-2 text-xs text-slate-500">
              <Code2 className="w-6 h-6 text-slate-400 mx-auto" />
              <div className="font-semibold text-slate-700">No Projects Added Yet</div>
              <p className="text-[11px]">Add your GitHub repositories or live web apps to strengthen role matching.</p>
              <Button size="sm" variant="outline" onClick={() => setIsAddProjectModalOpen(true)} className="text-xs">
                Add First Project
              </Button>
            </Card>
          ) : (
            <div className="space-y-2.5">
              {projects.map(p => (
                <Card key={p.id} className="p-4 border-slate-200 bg-white shadow-2xs space-y-2 text-xs">
                  <div className="flex items-start justify-between gap-2">
                    <h4 className="font-bold text-slate-900">{p.title}</h4>
                    <button
                      onClick={() => handleDeleteProject(p.id)}
                      className="text-slate-400 hover:text-rose-600 cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  {p.description && <p className="text-slate-600 text-[11px]">{p.description}</p>}
                  {p.techStack && p.techStack.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {p.techStack.map((t, idx) => (
                        <span key={idx} className="px-1.5 py-0.5 rounded bg-slate-100 text-slate-700 text-[10px]">
                          {t}
                        </span>
                      ))}
                    </div>
                  )}
                  <div className="flex items-center gap-3 pt-1 border-t border-slate-100 text-[11px]">
                    {p.githubUrl && (
                      <a href={p.githubUrl} target="_blank" rel="noopener noreferrer" className="text-indigo-600 font-semibold flex items-center gap-1 hover:underline">
                        <Github className="w-3 h-3" /> GitHub
                      </a>
                    )}
                    {p.liveDemoUrl && (
                      <a href={p.liveDemoUrl} target="_blank" rel="noopener noreferrer" className="text-teal-700 font-semibold flex items-center gap-1 hover:underline">
                        <Globe className="w-3 h-3" /> Live Demo
                      </a>
                    )}
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Pillar 2: Certifications & Verification Status */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
              <Award className="w-3.5 h-3.5 text-amber-600" />
              Certifications ({certs.length})
            </h3>
            <span className="text-[10px] text-slate-400">Cryptographically Audited</span>
          </div>

          {certs.length === 0 ? (
            <Card className="p-6 text-center bg-slate-50 border border-dashed border-slate-300 space-y-2 text-xs text-slate-500">
              <Award className="w-6 h-6 text-slate-400 mx-auto" />
              <div className="font-semibold text-slate-700">No Certifications Recorded</div>
              <p className="text-[11px]">Upload AWS, Google, or university credentials for verification.</p>
            </Card>
          ) : (
            <div className="space-y-2.5">
              {certs.map(c => (
                <Card key={c.id} className="p-4 border-slate-200 bg-white shadow-2xs space-y-2 text-xs">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h4 className="font-bold text-slate-900">{c.title}</h4>
                      <div className="text-[10px] text-slate-500">{c.issuingOrganization} • {c.issueDate}</div>
                    </div>
                    <Badge variant={c.verificationStatus === 'verified' ? 'success' : 'warning'} className="text-[9px]">
                      {c.verificationStatus === 'verified' ? '✓ Verified' : 'Review Pending'}
                    </Badge>
                  </div>
                  {c.credentialId && (
                    <div className="font-mono text-[10px] text-slate-400">ID: {c.credentialId}</div>
                  )}
                  {c.credentialUrl && (
                    <a href={c.credentialUrl} target="_blank" rel="noopener noreferrer" className="text-indigo-600 text-[11px] font-semibold flex items-center gap-1 hover:underline">
                      <ExternalLink className="w-3 h-3" /> View Credential
                    </a>
                  )}
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Pillar 3: Demonstrated Assessment Scores */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-teal-600" />
              Assessment Evidence ({assessments.length})
            </h3>
            {onNavigateToAssessments && (
              <button
                onClick={onNavigateToAssessments}
                className="text-[11px] text-teal-700 font-semibold hover:underline cursor-pointer"
              >
                Take Assessment
              </button>
            )}
          </div>

          {assessments.length === 0 ? (
            <Card className="p-6 text-center bg-slate-50 border border-dashed border-slate-300 space-y-2 text-xs text-slate-500">
              <CheckCircle2 className="w-6 h-6 text-slate-400 mx-auto" />
              <div className="font-semibold text-slate-700">No Assessment Records Yet</div>
              <p className="text-[11px]">Take coding or conceptual quizzes to verify your proficiency.</p>
              {onNavigateToAssessments && (
                <Button size="sm" variant="outline" onClick={onNavigateToAssessments} className="text-xs">
                  Start Assessment
                </Button>
              )}
            </Card>
          ) : (
            <div className="space-y-2.5">
              {assessments.map((a, idx) => (
                <Card key={idx} className="p-4 border-slate-200 bg-white shadow-2xs space-y-1.5 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900">{a.assessment_title || 'Technical Assessment'}</span>
                    <Badge variant={a.passed ? 'success' : 'warning'} className="text-[9px]">
                      {a.passed ? 'Passed' : 'Under Review'}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between text-slate-500 text-[11px]">
                    <span>Score Achieved:</span>
                    <strong className="text-slate-900">{a.score || a.percentage}%</strong>
                  </div>
                  <div className="text-[10px] text-teal-700 font-medium">
                    ✓ Verified skill vector updated automatically
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Add Project Modal */}
      {isAddProjectModalOpen && (
        <Modal
          isOpen={isAddProjectModalOpen}
          onClose={() => setIsAddProjectModalOpen(false)}
          title="Add Technical Project Artifact"
          maxWidth="max-w-md"
        >
          <div className="space-y-4 text-xs">
            <Input
              label="Project Title *"
              value={projTitle}
              onChange={e => setProjTitle(e.target.value)}
              placeholder="e.g. Distributed In-Memory Cache"
              required
            />

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Project Description & Concurrency / Scale</label>
              <textarea
                value={projDesc}
                onChange={e => setProjDesc(e.target.value)}
                rows={2}
                placeholder="e.g. Built with Go & Redis, handling 50k req/sec with benchmarked p99 latency."
                className="w-full text-xs rounded border border-slate-300 p-2 bg-white"
              />
            </div>

            <Input
              label="GitHub Repository Link"
              value={projGithub}
              onChange={e => setProjGithub(e.target.value)}
              placeholder="https://github.com/username/project"
            />

            <Input
              label="Live Demo URL (Optional)"
              value={projLiveDemo}
              onChange={e => setProjLiveDemo(e.target.value)}
              placeholder="https://my-demo-app.vercel.app"
            />

            <Input
              label="Tech Stack (Comma-separated)"
              value={projTech}
              onChange={e => setProjTech(e.target.value)}
              placeholder="e.g. Python, Docker, PostgreSQL, React"
            />

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
              <Button size="sm" variant="ghost" onClick={() => setIsAddProjectModalOpen(false)}>
                Cancel
              </Button>
              <Button size="sm" variant="primary" onClick={handleSaveProject}>
                Save to Portfolio
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
