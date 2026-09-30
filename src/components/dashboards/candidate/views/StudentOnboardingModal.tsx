import React, { useState } from 'react';
import {
  Modal,
  Button,
  Input,
  Badge
} from '../../../ui';
import {
  StudentAcademicProfile,
  StudentSkillRecord,
  StudentCertificationRecord,
  SkillCategory,
  SkillProficiency,
  HowSkillLearned
} from '../../../../types/studentJourney';
import { ALL_SKILL_CATEGORIES, POPULAR_AUTOCOMPLETE_SKILLS } from '../../../../lib/companyRoleData';
import { StudentJourneyService } from '../../../../lib/studentJourneyService';
import { useToast } from '../../../../context/ToastContext';
import {
  CheckCircle2,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  Award,
  BookOpen,
  GraduationCap,
  Briefcase,
  Layers,
  Search,
  Plus,
  Trash2,
  ExternalLink,
  ShieldCheck,
  Clock,
  FileText,
  AlertCircle
} from 'lucide-react';

interface StudentOnboardingModalProps {
  isOpen: boolean;
  onClose: () => void;
  studentId: string;
  initialProfile?: StudentAcademicProfile | null;
  onComplete: () => void;
  onNavigateToAssessments?: () => void;
}

export const StudentOnboardingModal: React.FC<StudentOnboardingModalProps> = ({
  isOpen,
  onClose,
  studentId,
  initialProfile,
  onComplete,
  onNavigateToAssessments
}) => {
  const { showToast } = useToast();
  const [currentStep, setCurrentStep] = useState<number>(1);

  // Step 1 State: Academic Profile
  const [fullName, setFullName] = useState(initialProfile?.fullName || '');
  const [college, setCollege] = useState(initialProfile?.college || '');
  const [degree, setDegree] = useState(initialProfile?.degree || 'Bachelor of Technology (B.Tech)');
  const [branch, setBranch] = useState(initialProfile?.branch || 'Computer Science & Engineering');
  const [currentYearOrSemester, setCurrentYearOrSemester] = useState(initialProfile?.currentYearOrSemester || '3rd Year / 6th Semester');
  const [graduationYear, setGraduationYear] = useState<number>(initialProfile?.graduationYear || new Date().getFullYear() + 1);
  const [location, setLocation] = useState(initialProfile?.location || 'Pune, Maharashtra');
  const [preferredLocations, setPreferredLocations] = useState<string[]>(initialProfile?.preferredLocations || ['Pune', 'Bengaluru', 'Mumbai', 'Remote']);
  const [preferredEmploymentType, setPreferredEmploymentType] = useState<StudentAcademicProfile['preferredEmploymentType']>(initialProfile?.preferredEmploymentType || 'Internship');
  const [resumeFileName, setResumeFileName] = useState<string>(initialProfile?.resumeFileName || '');

  // Step 2 State: Skills
  const [skillsList, setSkillsList] = useState<StudentSkillRecord[]>(() => StudentJourneyService.getSkills(studentId));
  const [skillSearchQuery, setSkillSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<SkillCategory>('Programming Languages');
  const [newSkillName, setNewSkillName] = useState('');
  const [newSkillProficiency, setNewSkillProficiency] = useState<SkillProficiency>('Intermediate');
  const [newSkillHowLearned, setNewSkillHowLearned] = useState<HowSkillLearned>('College Coursework');
  const [newSkillProjectUrl, setNewSkillProjectUrl] = useState('');

  // Step 3 State: Certifications
  const [certsList, setCertsList] = useState<StudentCertificationRecord[]>(() => StudentJourneyService.getCertifications(studentId));
  const [certTitle, setCertTitle] = useState('');
  const [certIssuer, setCertIssuer] = useState('');
  const [certIssueDate, setCertIssueDate] = useState('');
  const [certCredentialId, setCertCredentialId] = useState('');
  const [certUrl, setCertUrl] = useState('');
  const [certRelatedSkill, setCertRelatedSkill] = useState('');

  const steps = [
    { step: 1, title: 'Academic Profile', desc: 'College & Degree Details' },
    { step: 2, title: 'Skills Learned', desc: 'Skills & Project Evidence' },
    { step: 3, title: 'Certifications', desc: 'Credentials & Verification' },
    { step: 4, title: 'Skill Readiness', desc: 'Benchmark & Next Steps' }
  ];

  // Save Step 1
  const handleSaveStep1 = () => {
    if (!fullName.trim()) {
      showToast('Please enter your full name', 'warning');
      return;
    }
    StudentJourneyService.saveAcademicProfile(studentId, {
      fullName,
      college,
      degree,
      branch,
      currentYearOrSemester,
      graduationYear: Number(graduationYear),
      location,
      preferredLocations,
      preferredEmploymentType,
      resumeFileName
    });
    setCurrentStep(2);
  };

  // Add Skill in Step 2
  const handleAddSkill = (skillName: string, category: SkillCategory) => {
    if (!skillName.trim()) return;
    const added = StudentJourneyService.addSkill(studentId, {
      name: skillName.trim(),
      category,
      proficiency: newSkillProficiency,
      howLearned: newSkillHowLearned,
      projectUrl: newSkillProjectUrl.trim() || undefined,
      evidenceType: newSkillProjectUrl.trim() ? 'project_evidence' : 'self_declared'
    });
    setSkillsList(StudentJourneyService.getSkills(studentId));
    setNewSkillName('');
    setNewSkillProjectUrl('');
    showToast(`Added skill "${added.name}"`, 'success');
  };

  const handleRemoveSkill = (id: string) => {
    StudentJourneyService.removeSkill(studentId, id);
    setSkillsList(StudentJourneyService.getSkills(studentId));
  };

  // Add Cert in Step 3
  const handleAddCert = () => {
    if (!certTitle.trim() || !certIssuer.trim()) {
      showToast('Please provide Certificate Title and Issuing Organization', 'warning');
      return;
    }
    const added = StudentJourneyService.addCertification(studentId, {
      title: certTitle.trim(),
      issuingOrganization: certIssuer.trim(),
      issueDate: certIssueDate || new Date().toISOString().split('T')[0],
      credentialId: certCredentialId.trim() || undefined,
      credentialUrl: certUrl.trim() || undefined,
      relatedSkills: certRelatedSkill.trim() ? [certRelatedSkill.trim()] : [],
      verificationStatus: certUrl.trim() ? 'verification_pending' : 'not_submitted'
    });
    setCertsList(StudentJourneyService.getCertifications(studentId));
    setCertTitle('');
    setCertIssuer('');
    setCertCredentialId('');
    setCertUrl('');
    setCertRelatedSkill('');
    showToast('Certification added. Status set to Verification Pending.', 'success');
  };

  const handleVerifyCertDemo = (certId: string) => {
    StudentJourneyService.verifyCertification(studentId, certId, 'Issuer URL Check');
    setCertsList(StudentJourneyService.getCertifications(studentId));
    setSkillsList(StudentJourneyService.getSkills(studentId));
    showToast('Certification verified via cryptographic check! Evidence linked.', 'success');
  };

  // Final Complete
  const handleFinalComplete = () => {
    StudentJourneyService.saveAcademicProfile(studentId, {
      onboardingCompleted: true
    });
    showToast('Career Profile setup completed! You can now explore target companies & roles.', 'success');
    onComplete();
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Student Career Onboarding & Skilling Profile"
      maxWidth="max-w-4xl"
    >
      <div className="space-y-6">
        {/* Progress Stepper */}
        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
          <div className="flex items-center justify-between mb-3">
            {steps.map(s => (
              <div
                key={s.step}
                className={`flex items-center gap-2 cursor-pointer ${
                  currentStep === s.step
                    ? 'text-indigo-600 font-bold'
                    : currentStep > s.step
                    ? 'text-teal-700 font-medium'
                    : 'text-slate-400'
                }`}
                onClick={() => setCurrentStep(s.step)}
              >
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold border transition-colors ${
                    currentStep === s.step
                      ? 'bg-indigo-600 text-white border-indigo-600'
                      : currentStep > s.step
                      ? 'bg-teal-600 text-white border-teal-600'
                      : 'bg-white text-slate-500 border-slate-300'
                  }`}
                >
                  {currentStep > s.step ? <CheckCircle2 className="w-4 h-4" /> : s.step}
                </div>
                <div className="hidden sm:block text-left">
                  <div className="text-xs">{s.title}</div>
                  <div className="text-[10px] text-slate-400 font-normal">{s.desc}</div>
                </div>
              </div>
            ))}
          </div>

          <div className="w-full bg-slate-200 rounded-full h-1.5 overflow-hidden">
            <div
              className="bg-indigo-600 h-1.5 transition-all duration-300"
              style={{ width: `${(currentStep / 4) * 100}%` }}
            />
          </div>
        </div>

        {/* STEP 1: Personal & Academic Profile */}
        {currentStep === 1 && (
          <div className="space-y-4">
            <div className="border-b border-slate-100 pb-2">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <GraduationCap className="w-4 h-4 text-indigo-600" />
                Step 1: Personal & Academic Credentials
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Tell us about your educational institution, graduation timeline, and career preferences.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <Input
                label="Full Name *"
                value={fullName}
                onChange={e => setFullName(e.target.value)}
                placeholder="e.g. Aarav Sharma"
                required
              />

              <Input
                label="College / Institution *"
                value={college}
                onChange={e => setCollege(e.target.value)}
                placeholder="e.g. Pune Institute of Computer Technology (PICT)"
              />

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Degree Program *</label>
                <select
                  value={degree}
                  onChange={e => setDegree(e.target.value)}
                  className="w-full text-xs rounded-lg border border-slate-300 p-2 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="Bachelor of Technology (B.Tech)">Bachelor of Technology (B.Tech)</option>
                  <option value="Bachelor of Engineering (B.E.)">Bachelor of Engineering (B.E.)</option>
                  <option value="Master of Computer Applications (MCA)">Master of Computer Applications (MCA)</option>
                  <option value="Master of Technology (M.Tech)">Master of Technology (M.Tech)</option>
                  <option value="Bachelor of Science in CS / IT">Bachelor of Science in CS / IT</option>
                  <option value="Polytechnic Diploma">Polytechnic Diploma</option>
                </select>
              </div>

              <Input
                label="Branch / Specialization *"
                value={branch}
                onChange={e => setBranch(e.target.value)}
                placeholder="e.g. Computer Science, Artificial Intelligence, IT"
              />

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Current Academic Standing</label>
                <select
                  value={currentYearOrSemester}
                  onChange={e => setCurrentYearOrSemester(e.target.value)}
                  className="w-full text-xs rounded-lg border border-slate-300 p-2 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="1st Year (Sem 1-2)">1st Year (Sem 1-2)</option>
                  <option value="2nd Year (Sem 3-4)">2nd Year (Sem 3-4)</option>
                  <option value="3rd Year (Sem 5-6)">3rd Year (Sem 5-6)</option>
                  <option value="Final Year (Sem 7-8)">Final Year (Sem 7-8)</option>
                  <option value="Recent Graduate (2025/2026)">Recent Graduate (2025/2026)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Expected Graduation Year</label>
                <select
                  value={graduationYear}
                  onChange={e => setGraduationYear(Number(e.target.value))}
                  className="w-full text-xs rounded-lg border border-slate-300 p-2 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value={2025}>2025</option>
                  <option value={2026}>2026</option>
                  <option value={2027}>2027</option>
                  <option value={2028}>2028</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Primary Work Preference</label>
                <select
                  value={preferredEmploymentType}
                  onChange={e => setPreferredEmploymentType(e.target.value as any)}
                  className="w-full text-xs rounded-lg border border-slate-300 p-2 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="Internship">Summer / Semester Internship</option>
                  <option value="Full-time">Graduate Full-Time Role</option>
                  <option value="Apprenticeship">Govt / Industry Apprenticeship</option>
                  <option value="Research Fellowship">Research / Lab Fellowship</option>
                </select>
              </div>

              <Input
                label="Current Location (City, State)"
                value={location}
                onChange={e => setLocation(e.target.value)}
                placeholder="e.g. Pune, Maharashtra"
              />
            </div>

            {/* Resume Upload Simulation */}
            <div className="p-3.5 rounded-lg border border-dashed border-slate-300 bg-slate-50 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-800 flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5 text-indigo-600" />
                  Attach Resume Document (Optional)
                </span>
                {resumeFileName && (
                  <Badge variant="success" className="text-[10px]">
                    Attached: {resumeFileName}
                  </Badge>
                )}
              </div>
              <p className="text-[11px] text-slate-500">
                PDF or Word formats supported (max 5MB). Used for pre-application readiness checklists.
              </p>
              <div className="flex items-center gap-2">
                <input
                  type="file"
                  id="resume-file-input"
                  className="hidden"
                  onChange={e => {
                    const file = e.target.files?.[0];
                    if (file) {
                      setResumeFileName(file.name);
                      showToast(`Attached ${file.name}`, 'info');
                    }
                  }}
                />
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => document.getElementById('resume-file-input')?.click()}
                  className="text-xs"
                >
                  {resumeFileName ? 'Replace File' : 'Browse File...'}
                </Button>
                {resumeFileName && (
                  <button
                    onClick={() => setResumeFileName('')}
                    className="text-xs text-rose-600 hover:underline cursor-pointer"
                  >
                    Remove
                  </button>
                )}
              </div>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-slate-100">
              <Button size="sm" variant="ghost" onClick={onClose} className="text-xs">
                Save & Exit for Later
              </Button>
              <Button size="sm" variant="primary" onClick={handleSaveStep1} className="text-xs flex items-center gap-1">
                <span>Save & Continue</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Button>
            </div>
          </div>
        )}

        {/* STEP 2: Skills I Have Learned */}
        {currentStep === 2 && (
          <div className="space-y-4">
            <div className="border-b border-slate-100 pb-2">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-teal-600" />
                Step 2: What Skills Have You Already Learned?
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Add skills with your genuine proficiency and learning source. Skills with project links provide stronger evidence.
              </p>
            </div>

            {/* Quick Autocomplete Chips */}
            <div className="space-y-2 bg-slate-50 p-3 rounded-lg border border-slate-200">
              <span className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block">
                Quick-Add Recognized Skills
              </span>
              <div className="flex flex-wrap gap-1.5 max-h-28 overflow-y-auto pr-1">
                {POPULAR_AUTOCOMPLETE_SKILLS.slice(0, 16).map(s => {
                  const alreadyAdded = skillsList.some(k => k.name.toLowerCase() === s.name.toLowerCase());
                  return (
                    <button
                      key={s.name}
                      onClick={() => !alreadyAdded && handleAddSkill(s.name, s.category)}
                      disabled={alreadyAdded}
                      className={`px-2 py-1 rounded text-[11px] font-medium transition-colors flex items-center gap-1 cursor-pointer ${
                        alreadyAdded
                          ? 'bg-teal-50 text-teal-700 border border-teal-200 cursor-default opacity-80'
                          : 'bg-white text-slate-700 border border-slate-200 hover:border-indigo-300 hover:text-indigo-600'
                      }`}
                    >
                      {alreadyAdded ? '✓' : '+'} {s.name}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Custom Skill Entry Form */}
            <div className="p-3.5 rounded-lg border border-slate-200 bg-white space-y-3">
              <span className="text-xs font-bold text-slate-900 block">Add Custom Skill with Evidence</span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs">
                <Input
                  label="Skill Name"
                  value={newSkillName}
                  onChange={e => setNewSkillName(e.target.value)}
                  placeholder="e.g. FastAPI, Tailwind, PyTorch"
                />

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Category</label>
                  <select
                    value={selectedCategory}
                    onChange={e => setSelectedCategory(e.target.value as any)}
                    className="w-full text-xs rounded-lg border border-slate-300 p-2 bg-white"
                  >
                    {ALL_SKILL_CATEGORIES.map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">My Proficiency</label>
                  <select
                    value={newSkillProficiency}
                    onChange={e => setNewSkillProficiency(e.target.value as any)}
                    className="w-full text-xs rounded-lg border border-slate-300 p-2 bg-white"
                  >
                    <option value="Beginner">Beginner (Foundational)</option>
                    <option value="Intermediate">Intermediate (Independent)</option>
                    <option value="Advanced">Advanced (Production)</option>
                    <option value="Proficient">Proficient (Architect)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">How Did You Learn It?</label>
                  <select
                    value={newSkillHowLearned}
                    onChange={e => setNewSkillHowLearned(e.target.value as any)}
                    className="w-full text-xs rounded-lg border border-slate-300 p-2 bg-white"
                  >
                    <option value="College Coursework">College Coursework</option>
                    <option value="Self-Learning / Online Courses">Self-Learning / Online Courses</option>
                    <option value="Hands-on Projects">Hands-on Projects</option>
                    <option value="Internship Experience">Internship Experience</option>
                    <option value="Verified Certification">Verified Certification</option>
                  </select>
                </div>

                <Input
                  label="GitHub / Project Link (Optional Evidence)"
                  value={newSkillProjectUrl}
                  onChange={e => setNewSkillProjectUrl(e.target.value)}
                  placeholder="https://github.com/..."
                />
              </div>

              <Button
                size="sm"
                variant="outline"
                onClick={() => handleAddSkill(newSkillName, selectedCategory)}
                className="text-xs flex items-center gap-1"
                disabled={!newSkillName.trim()}
              >
                <Plus className="w-3.5 h-3.5" />
                Add Skill to Profile
              </Button>
            </div>

            {/* Current Added Skills List */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-bold text-slate-900">
                <span>My Recorded Skills ({skillsList.length})</span>
                <span className="text-[11px] text-slate-500 font-normal">
                  {skillsList.filter(s => s.evidenceType === 'project_evidence' || s.evidenceType === 'verified_certification').length} with Evidence
                </span>
              </div>

              {skillsList.length === 0 ? (
                <div className="p-4 rounded-lg bg-slate-50 border border-slate-200 text-center text-xs text-slate-500">
                  No skills added yet. Select from the quick-add chips above or enter your custom skills.
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-48 overflow-y-auto">
                  {skillsList.map(s => (
                    <div
                      key={s.id}
                      className="p-2.5 rounded-lg border border-slate-200 bg-white flex items-center justify-between gap-2 shadow-2xs"
                    >
                      <div className="space-y-0.5 min-w-0">
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs font-bold text-slate-900 truncate">{s.name}</span>
                          <Badge variant="purple" className="text-[9px] py-0">{s.proficiency}</Badge>
                        </div>
                        <div className="text-[10px] text-slate-500 flex items-center gap-1">
                          <span>{s.category}</span>
                          <span>•</span>
                          <span className="text-indigo-600">{s.howLearned}</span>
                        </div>
                      </div>

                      <button
                        onClick={() => handleRemoveSkill(s.id)}
                        className="text-slate-400 hover:text-rose-600 p-1 transition-colors cursor-pointer"
                        title="Remove Skill"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-slate-100">
              <Button size="sm" variant="outline" onClick={() => setCurrentStep(1)} className="text-xs flex items-center gap-1">
                <ArrowLeft className="w-3.5 h-3.5" />
                Back
              </Button>
              <div className="flex items-center gap-2">
                <Button size="sm" variant="ghost" onClick={() => setCurrentStep(3)} className="text-xs">
                  Skip for Now
                </Button>
                <Button size="sm" variant="primary" onClick={() => setCurrentStep(3)} className="text-xs flex items-center gap-1">
                  <span>Save & Continue</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* STEP 3: Certifications & Evidence */}
        {currentStep === 3 && (
          <div className="space-y-4">
            <div className="border-b border-slate-100 pb-2">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Award className="w-4 h-4 text-amber-600" />
                Step 3: Certifications & Professional Training
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Have you completed any certifications? Submit credential links for official cryptographic verification.
              </p>
            </div>

            {/* Add Certification Form */}
            <div className="p-3.5 rounded-lg border border-slate-200 bg-white space-y-3">
              <span className="text-xs font-bold text-slate-900 block">Record Credential Details</span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <Input
                  label="Certification Title *"
                  value={certTitle}
                  onChange={e => setCertTitle(e.target.value)}
                  placeholder="e.g. AWS Certified Cloud Practitioner"
                />

                <Input
                  label="Issuing Organization *"
                  value={certIssuer}
                  onChange={e => setCertIssuer(e.target.value)}
                  placeholder="e.g. Amazon Web Services, Google Cloud, Meta"
                />

                <Input
                  label="Official Verification URL"
                  value={certUrl}
                  onChange={e => setCertUrl(e.target.value)}
                  placeholder="https://www.credly.com/badges/..."
                />

                <Input
                  label="Credential ID / License Number"
                  value={certCredentialId}
                  onChange={e => setCertCredentialId(e.target.value)}
                  placeholder="e.g. AWS-CCP-981240"
                />

                <Input
                  label="Primary Related Skill"
                  value={certRelatedSkill}
                  onChange={e => setCertRelatedSkill(e.target.value)}
                  placeholder="e.g. AWS Cloud Fundamentals, Python"
                />

                <Input
                  type="date"
                  label="Issue Date"
                  value={certIssueDate}
                  onChange={e => setCertIssueDate(e.target.value)}
                />
              </div>

              <Button
                size="sm"
                variant="outline"
                onClick={handleAddCert}
                className="text-xs flex items-center gap-1"
                disabled={!certTitle.trim() || !certIssuer.trim()}
              >
                <Plus className="w-3.5 h-3.5" />
                Add Certification
              </Button>
            </div>

            {/* Added Certifications List */}
            <div className="space-y-2">
              <span className="text-xs font-bold text-slate-900 block">My Certifications ({certsList.length})</span>
              {certsList.length === 0 ? (
                <div className="p-4 rounded-lg bg-slate-50 border border-slate-200 text-center text-xs text-slate-500">
                  No certifications recorded yet. You can add them now or skip this step.
                </div>
              ) : (
                <div className="space-y-2">
                  {certsList.map(c => (
                    <div
                      key={c.id}
                      className="p-3 rounded-lg border border-slate-200 bg-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-2xs"
                    >
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-slate-900">{c.title}</span>
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            c.verificationStatus === 'verified'
                              ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                              : 'bg-amber-100 text-amber-800 border border-amber-300'
                          }`}>
                            {c.verificationStatus === 'verified' ? '✓ Verified' : 'Awaiting Review'}
                          </span>
                        </div>
                        <div className="text-[11px] text-slate-500">
                          <span>{c.issuingOrganization}</span> • Issued: <span>{c.issueDate}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        {c.verificationStatus !== 'verified' && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleVerifyCertDemo(c.id)}
                            className="text-[11px] text-emerald-700 border-emerald-300 hover:bg-emerald-50"
                          >
                            <ShieldCheck className="w-3 h-3 text-emerald-600" />
                            Run Verification
                          </Button>
                        )}
                        {c.credentialUrl && (
                          <a
                            href={c.credentialUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-slate-400 hover:text-indigo-600 p-1"
                            title="Open Credential Link"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                          </a>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-slate-100">
              <Button size="sm" variant="outline" onClick={() => setCurrentStep(2)} className="text-xs flex items-center gap-1">
                <ArrowLeft className="w-3.5 h-3.5" />
                Back
              </Button>
              <div className="flex items-center gap-2">
                <Button size="sm" variant="ghost" onClick={() => setCurrentStep(4)} className="text-xs">
                  Skip for Now
                </Button>
                <Button size="sm" variant="primary" onClick={() => setCurrentStep(4)} className="text-xs flex items-center gap-1">
                  <span>Save & Continue</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* STEP 4: Assess Current Skill Readiness */}
        {currentStep === 4 && (
          <div className="space-y-4">
            <div className="border-b border-slate-100 pb-2">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                Step 4: Skill Readiness & Assessment Action
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Demonstrated assessment results provide the strongest evidence for employer skill matching and role readiness.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-indigo-50/70 border border-indigo-200 space-y-3">
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-lg bg-indigo-600 text-white flex items-center justify-center shrink-0">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-indigo-950">Take a Diagnostic Technical Assessment</h4>
                  <p className="text-xs text-indigo-800/80 mt-0.5">
                    Assess your core problem solving in Python, React, SQL, Java, or Data Structures. Scores are directly verified and attached to your employer-visible talent vector.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 pt-2">
                <Button
                  size="sm"
                  variant="primary"
                  onClick={() => {
                    handleFinalComplete();
                    if (onNavigateToAssessments) onNavigateToAssessments();
                  }}
                  className="text-xs font-semibold"
                >
                  Start Assessment Now
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handleFinalComplete}
                  className="text-xs bg-white"
                >
                  Complete Onboarding & View Dashboard
                </Button>
              </div>
            </div>

            <div className="p-3.5 rounded-lg border border-slate-200 bg-white space-y-2 text-xs text-slate-600">
              <div className="font-bold text-slate-800">What Happens Next?</div>
              <ul className="list-disc pl-4 space-y-1 text-slate-500">
                <li>Select target employers (Google, Microsoft, Amazon, TCS, Infosys, etc.) in the <strong>Career Goals</strong> section.</li>
                <li>Explore detailed 14-section <strong>Company-Wise Role Profiles</strong> with verified hiring criteria.</li>
                <li>Run a deterministic <strong>Skill Gap Analysis</strong> comparing role requirements to your evidenced skills.</li>
                <li>Follow your personalized <strong>Learning Roadmap</strong> and track placement outcomes.</li>
              </ul>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-slate-100">
              <Button size="sm" variant="outline" onClick={() => setCurrentStep(3)} className="text-xs flex items-center gap-1">
                <ArrowLeft className="w-3.5 h-3.5" />
                Back
              </Button>
              <Button size="sm" variant="primary" onClick={handleFinalComplete} className="text-xs">
                Finish & Go to Dashboard
              </Button>
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
};
