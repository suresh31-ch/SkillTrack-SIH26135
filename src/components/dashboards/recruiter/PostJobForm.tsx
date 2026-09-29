import React, { useState } from 'react';
import { Job, JobRequiredSkill, Skill, Profile } from '../../../types';
import { RecruiterService } from '../../../lib/recruiterService';
import { Card, Button, Input, Badge } from '../../ui';
import {
  Briefcase,
  Building,
  MapPin,
  IndianRupee,
  GraduationCap,
  Calendar,
  Award,
  Sparkles,
  Plus,
  X,
  CheckCircle2,
  AlertCircle,
  FileText,
  Clock,
  Layers,
  ArrowRight
} from 'lucide-react';

interface PostJobFormProps {
  recruiterProfile: Profile;
  masterSkills: Skill[];
  onJobCreated: (newJob: Job) => void;
  onCancel: () => void;
}

const COMMON_ROLE_SUGGESTIONS = [
  'Junior Full Stack Engineer',
  'Frontend React Developer',
  'Backend Node.js API Developer',
  'Data Analyst & BI Specialist',
  'Solar & EV Field Technician',
  'CNC Multi-Axis Machinist',
  'Cloud DevOps Associate Engineer',
  'Cybersecurity Analyst',
  'AI & Machine Learning Engineer'
];

const PRESET_COMPANIES = [
  'Apex Infotech Solutions',
  'Tata Consultancy Systems',
  'Mahindra Green Energy Ltd',
  'Kalyani Advanced Precision',
  'TechSkills Cloud India',
  'Zomato Tech Labs',
  'Zerodha Labs Partner'
];

const PRESET_LOCATIONS = [
  'Pune, Maharashtra (Hybrid)',
  'Mumbai Suburban, Maharashtra',
  'Bengaluru / Pune (Remote)',
  'Chhatrapati Sambhajinagar, MH',
  'Nagpur MIDC, Maharashtra',
  'Nashik, Maharashtra',
  'Hyderabad, Telangana',
  'Remote (India)'
];

const PRESET_TEMPLATES: Record<string, { desc: string; skills: string[]; exp: number; edu: string; minSal: number; maxSal: number }> = {
  'Junior Full Stack Engineer': {
    desc: 'We are looking for enthusiastic developers trained under state skilling initiatives with React, Node.js and SQL proficiency. You will build responsive web applications and RESTful backend microservices.',
    skills: ['React.js & TypeScript', 'Node.js & Express API', 'PostgreSQL & Database Design'],
    exp: 1,
    edu: 'B.Tech / BCA / Diploma in CS',
    minSal: 420000,
    maxSal: 650000
  },
  'Data Analyst & BI Specialist': {
    desc: 'Seeking data analysts to design and maintain executive Power BI dashboards, write complex PostgreSQL aggregation queries, and develop predictive analytics models.',
    skills: ['Python & Data Analytics', 'PostgreSQL & Database Design', 'Machine Learning with Scikit-Learn'],
    exp: 1,
    edu: 'BCA / B.Sc Stats / MCA / B.Tech',
    minSal: 450000,
    maxSal: 700000
  },
  'Solar & EV Field Technician': {
    desc: 'Diagnostic testing, preventive maintenance, and rooftop solar grid synchronization for commercial and industrial facilities across Maharashtra.',
    skills: ['Electric Vehicle (EV) Diagnostics', 'Solar PV Installation & Grid Tie'],
    exp: 0,
    edu: 'ITI / Diploma in Electrical',
    minSal: 300000,
    maxSal: 450000
  },
  'CNC Multi-Axis Machinist': {
    desc: 'Precision machining operations for aerospace and automotive components. Setup and program 3-axis and 5-axis CNC machines using Fanuc/Siemens G-code.',
    skills: ['CNC Machine Programming', 'Quality Assurance & Six Sigma (QA/QC)'],
    exp: 1,
    edu: 'ITI / Diploma Mechanical',
    minSal: 360000,
    maxSal: 500000
  }
};

export const PostJobForm: React.FC<PostJobFormProps> = ({
  recruiterProfile,
  masterSkills,
  onJobCreated,
  onCancel
}) => {
  const [title, setTitle] = useState('');
  const [companyName, setCompanyName] = useState('Apex Infotech Solutions');
  const [location, setLocation] = useState('Pune, Maharashtra (Hybrid)');
  const [employmentType, setEmploymentType] = useState<'Full-time' | 'Part-time' | 'Contract' | 'Internship' | 'Remote / Hybrid'>('Full-time');
  const [experienceRequired, setExperienceRequired] = useState(1);
  const [educationRequired, setEducationRequired] = useState('B.Tech / BCA / Diploma in CS');
  const [salaryMin, setSalaryMin] = useState(450000);
  const [salaryMax, setSalaryMax] = useState(650000);
  const [description, setDescription] = useState('');
  const [selectedSkills, setSelectedSkills] = useState<JobRequiredSkill[]>([
    {
      id: 'jrs-tmp-1',
      job_id: '',
      skill_id: 'sk-01',
      skill_name: 'React.js & TypeScript',
      required_level: 'Intermediate',
      is_required: true
    },
    {
      id: 'jrs-tmp-2',
      job_id: '',
      skill_id: 'sk-02',
      skill_name: 'Node.js & Express API',
      required_level: 'Intermediate',
      is_required: true
    }
  ]);
  const [skillSelectorInput, setSkillSelectorInput] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [createdSuccess, setCreatedSuccess] = useState(false);

  // Apply template
  const applyTemplate = (roleKey: string) => {
    const tmpl = PRESET_TEMPLATES[roleKey];
    if (!tmpl) return;
    setTitle(roleKey);
    setDescription(tmpl.desc);
    setExperienceRequired(tmpl.exp);
    setEducationRequired(tmpl.edu);
    setSalaryMin(tmpl.minSal);
    setSalaryMax(tmpl.maxSal);

    const skillsToAdd: JobRequiredSkill[] = tmpl.skills.map((sName, idx) => {
      const match = masterSkills.find(s => s.name.toLowerCase() === sName.toLowerCase());
      return {
        id: `jrs-tmp-${Date.now()}-${idx}`,
        job_id: '',
        skill_id: match?.id || `sk-${idx + 10}`,
        skill_name: sName,
        required_level: 'Intermediate',
        is_required: true
      };
    });
    setSelectedSkills(skillsToAdd);
  };

  const handleAddSkill = (skill: Skill) => {
    if (selectedSkills.some(s => s.skill_id === skill.id || s.skill_name === skill.name)) return;
    setSelectedSkills([
      ...selectedSkills,
      {
        id: `jrs-tmp-${Date.now()}`,
        job_id: '',
        skill_id: skill.id,
        skill_name: skill.name,
        required_level: 'Intermediate',
        is_required: true
      }
    ]);
  };

  const handleRemoveSkill = (skillId: string) => {
    setSelectedSkills(selectedSkills.filter(s => s.skill_id !== skillId));
  };

  const handleSkillLevelChange = (skillId: string, level: JobRequiredSkill['required_level']) => {
    setSelectedSkills(
      selectedSkills.map(s => (s.skill_id === skillId ? { ...s, required_level: level } : s))
    );
  };

  const handleSkillRequiredToggle = (skillId: string) => {
    setSelectedSkills(
      selectedSkills.map(s => (s.skill_id === skillId ? { ...s, is_required: !s.is_required } : s))
    );
  };

  const validate = () => {
    const err: Record<string, string> = {};
    if (!title.trim()) err.title = 'Job title is required';
    if (!companyName.trim()) err.companyName = 'Company name is required';
    if (!location.trim()) err.location = 'Location is required';
    if (salaryMin <= 0) err.salaryMin = 'Minimum salary must be greater than 0';
    if (salaryMax < salaryMin) err.salaryMax = 'Maximum salary cannot be less than minimum salary';
    if (!description.trim() || description.length < 20) {
      err.description = 'Job description must be at least 20 characters';
    }
    if (selectedSkills.length === 0) {
      err.skills = 'Please add at least one required skill';
    }
    setErrors(err);
    return Object.keys(err).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    try {
      const newJob = RecruiterService.createJob({
        recruiter_id: recruiterProfile.id,
        organization_id: recruiterProfile.organization_id || 'org-maha-001',
        company_name: companyName,
        title,
        description,
        location,
        employment_type: employmentType,
        experience_required: Number(experienceRequired),
        education_required: educationRequired,
        salary_min: Number(salaryMin),
        salary_max: Number(salaryMax),
        status: 'open',
        required_skills: selectedSkills
      });

      setCreatedSuccess(true);
      setTimeout(() => {
        onJobCreated(newJob);
      }, 700);
    } catch (err) {
      console.error('Job creation error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredMasterSkills = masterSkills
    .filter(
      s =>
        s.name.toLowerCase().includes(skillSelectorInput.toLowerCase()) &&
        !selectedSkills.some(sel => sel.skill_id === s.id)
    )
    .slice(0, 6);

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 text-xs font-semibold border border-indigo-200 dark:border-indigo-800 mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            New Vacancy Post
          </div>
          <h2 className="text-2xl font-black text-slate-900 dark:text-slate-100">
            Create Job Vacancy
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Post an opening to match instantly against state skilling certified talent.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={onCancel} className="text-xs">
            Cancel
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="text-xs font-bold bg-indigo-600 hover:bg-indigo-500 shadow-md shadow-indigo-600/20"
          >
            <Plus className="w-4 h-4 mr-1" />
            {isSubmitting ? 'Publishing...' : 'Publish Job Opening'}
          </Button>
        </div>
      </div>

      {/* Quick Role Templates */}
      <Card className="p-4 border-dashed border-indigo-300 dark:border-indigo-800 bg-indigo-50/40 dark:bg-indigo-950/20">
        <div className="flex items-center gap-1.5 text-xs font-bold text-indigo-900 dark:text-indigo-300 mb-2">
          <Sparkles className="w-4 h-4 text-indigo-600" />
          Auto-fill with Verified Industry Role Templates:
        </div>
        <div className="flex flex-wrap gap-2">
          {Object.keys(PRESET_TEMPLATES).map(tmplKey => (
            <button
              key={tmplKey}
              type="button"
              onClick={() => applyTemplate(tmplKey)}
              className="text-xs px-3 py-1.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-indigo-500 text-slate-700 dark:text-slate-300 hover:text-indigo-600 transition-all shadow-sm font-medium"
            >
              + {tmplKey}
            </button>
          ))}
        </div>
      </Card>

      {/* Main Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Section 1: Basic Information */}
        <Card className="p-6 border-slate-200 dark:border-slate-800 space-y-4">
          <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2 border-b pb-3 border-slate-100 dark:border-slate-800">
            <Briefcase className="w-4 h-4 text-indigo-600" />
            Primary Job Details
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Job Title */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Job Title <span className="text-rose-500">*</span>
              </label>
              <Input
                placeholder="e.g. Junior Full Stack Engineer"
                value={title}
                onChange={e => setTitle(e.target.value)}
                className="text-xs"
              />
              {errors.title && <p className="text-[11px] text-rose-500">{errors.title}</p>}
            </div>

            {/* Company / Organization */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Hiring Organization / Company <span className="text-rose-500">*</span>
              </label>
              <select
                value={companyName}
                onChange={e => setCompanyName(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500"
              >
                {PRESET_COMPANIES.map(comp => (
                  <option key={comp} value={comp}>
                    {comp}
                  </option>
                ))}
              </select>
              {errors.companyName && <p className="text-[11px] text-rose-500">{errors.companyName}</p>}
            </div>

            {/* Location */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Work Location & Modality <span className="text-rose-500">*</span>
              </label>
              <select
                value={location}
                onChange={e => setLocation(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500"
              >
                {PRESET_LOCATIONS.map(loc => (
                  <option key={loc} value={loc}>
                    {loc}
                  </option>
                ))}
              </select>
              {errors.location && <p className="text-[11px] text-rose-500">{errors.location}</p>}
            </div>

            {/* Employment Type */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Employment Type
              </label>
              <select
                value={employmentType}
                onChange={e => setEmploymentType(e.target.value as any)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500"
              >
                <option value="Full-time">Full-time</option>
                <option value="Part-time">Part-time</option>
                <option value="Contract">Contract</option>
                <option value="Internship">Internship / Apprenticeship</option>
                <option value="Remote / Hybrid">Remote / Hybrid</option>
              </select>
            </div>
          </div>
        </Card>

        {/* Section 2: Compensation & Requirements */}
        <Card className="p-6 border-slate-200 dark:border-slate-800 space-y-4">
          <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2 border-b pb-3 border-slate-100 dark:border-slate-800">
            <IndianRupee className="w-4 h-4 text-emerald-600" />
            Compensation & Eligibility Criteria
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Salary Range */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center justify-between">
                <span>Annual CTC Range (INR) <span className="text-rose-500">*</span></span>
                <span className="text-indigo-600 dark:text-indigo-400 font-semibold">
                  ₹{(salaryMin / 100000).toFixed(1)}L – ₹{(salaryMax / 100000).toFixed(1)}L PA
                </span>
              </label>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <input
                    type="number"
                    step="25000"
                    value={salaryMin}
                    onChange={e => setSalaryMin(Number(e.target.value))}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900"
                    placeholder="Min Salary (₹)"
                  />
                  <span className="text-[10px] text-slate-400">Min: ₹{salaryMin.toLocaleString('en-IN')}</span>
                </div>
                <div>
                  <input
                    type="number"
                    step="25000"
                    value={salaryMax}
                    onChange={e => setSalaryMax(Number(e.target.value))}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900"
                    placeholder="Max Salary (₹)"
                  />
                  <span className="text-[10px] text-slate-400">Max: ₹{salaryMax.toLocaleString('en-IN')}</span>
                </div>
              </div>
              {errors.salaryMin && <p className="text-[11px] text-rose-500">{errors.salaryMin}</p>}
              {errors.salaryMax && <p className="text-[11px] text-rose-500">{errors.salaryMax}</p>}
            </div>

            {/* Minimum Experience */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Minimum Experience Required
              </label>
              <select
                value={experienceRequired}
                onChange={e => setExperienceRequired(Number(e.target.value))}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100"
              >
                <option value={0}>Fresher / No prior experience (0 Yrs)</option>
                <option value={1}>1+ Years (Entry Level)</option>
                <option value={2}>2+ Years (Junior - Mid)</option>
                <option value={3}>3+ Years (Mid Level)</option>
                <option value={5}>5+ Years (Senior)</option>
              </select>
            </div>

            {/* Education Requirement */}
            <div className="space-y-1.5 md:col-span-2">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Education Qualification Required
              </label>
              <Input
                placeholder="e.g. B.Tech / BCA / MCA / Diploma in CS or equivalent"
                value={educationRequired}
                onChange={e => setEducationRequired(e.target.value)}
                className="text-xs"
              />
            </div>
          </div>
        </Card>

        {/* Section 3: Required Skills Matrix */}
        <Card className="p-6 border-slate-200 dark:border-slate-800 space-y-4">
          <div className="flex items-center justify-between border-b pb-3 border-slate-100 dark:border-slate-800">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <Award className="w-4 h-4 text-indigo-600" />
                Required Skills & Proficiency Benchmarks
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Our engine automatically scores candidate applications against these required skills.
              </p>
            </div>
            <span className="text-xs font-bold text-indigo-600 bg-indigo-50 dark:bg-indigo-950 px-2 py-1 rounded">
              {selectedSkills.length} Selected
            </span>
          </div>

          {/* Current Selected Skills List */}
          <div className="space-y-2.5">
            {selectedSkills.map(skill => (
              <div
                key={skill.skill_id}
                className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 flex flex-col sm:flex-row sm:items-center justify-between gap-2"
              >
                <div className="flex items-center gap-2">
                  <Award className="w-4 h-4 text-indigo-600" />
                  <span className="text-xs font-bold text-slate-900 dark:text-slate-100">
                    {skill.skill_name}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <select
                    value={skill.required_level}
                    onChange={e => handleSkillLevelChange(skill.skill_id, e.target.value as any)}
                    className="text-[11px] px-2 py-1 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900"
                  >
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced</option>
                    <option value="Expert">Expert</option>
                  </select>

                  <button
                    type="button"
                    onClick={() => handleSkillRequiredToggle(skill.skill_id)}
                    className={`text-[10px] font-bold px-2 py-1 rounded ${
                      skill.is_required
                        ? 'bg-rose-50 text-rose-700 border border-rose-200 dark:bg-rose-950 dark:text-rose-300'
                        : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    {skill.is_required ? 'Mandatory' : 'Optional'}
                  </button>

                  <button
                    type="button"
                    onClick={() => handleRemoveSkill(skill.skill_id)}
                    className="p-1 text-slate-400 hover:text-rose-500 rounded-md transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {errors.skills && <p className="text-[11px] text-rose-500">{errors.skills}</p>}

          {/* Skill Selector Search & Quick Add */}
          <div className="pt-2">
            <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 block mb-1.5">
              Add Skills from Master Catalog:
            </label>
            <Input
              placeholder="Search master skills catalog (e.g. React, Python, EV, Docker)..."
              value={skillSelectorInput}
              onChange={e => setSkillSelectorInput(e.target.value)}
              className="text-xs mb-2"
            />
            <div className="flex flex-wrap gap-1.5">
              {filteredMasterSkills.map(skill => (
                <button
                  key={skill.id}
                  type="button"
                  onClick={() => handleAddSkill(skill)}
                  className="text-xs px-2.5 py-1 rounded-lg border border-slate-200 dark:border-slate-700 hover:border-indigo-500 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:text-indigo-600 flex items-center gap-1 transition-all"
                >
                  <Plus className="w-3 h-3" />
                  {skill.name}
                </button>
              ))}
            </div>
          </div>
        </Card>

        {/* Section 4: Description */}
        <Card className="p-6 border-slate-200 dark:border-slate-800 space-y-3">
          <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2 border-b pb-3 border-slate-100 dark:border-slate-800">
            <FileText className="w-4 h-4 text-indigo-600" />
            Job Description & Responsibilities <span className="text-rose-500">*</span>
          </h3>

          <textarea
            rows={5}
            value={description}
            onChange={e => setDescription(e.target.value)}
            placeholder="Outline daily duties, engineering stack, growth opportunities, and candidate expectations..."
            className="w-full p-3 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500 leading-relaxed"
          />
          {errors.description && <p className="text-[11px] text-rose-500">{errors.description}</p>}
        </Card>

        {/* Submit Actions */}
        <div className="flex items-center justify-between pt-4">
          <Button variant="ghost" type="button" onClick={onCancel} className="text-xs">
            Cancel
          </Button>

          <Button
            type="submit"
            variant="primary"
            disabled={isSubmitting}
            className="text-xs font-bold bg-indigo-600 hover:bg-indigo-500 px-6 py-2.5 shadow-lg shadow-indigo-600/30"
          >
            <CheckCircle2 className="w-4 h-4 mr-1.5" />
            {isSubmitting ? 'Creating Vacancy...' : 'Publish Job Opening'}
          </Button>
        </div>
      </form>
    </div>
  );
};
