import React, { useState, useMemo } from 'react';
import { Card, Button, Badge, Modal } from '../../../ui';
import { TargetCompany, CompanyRoleProfile } from '../../../../types/studentJourney';
import { TARGET_COMPANIES_CATALOG } from '../../../../lib/companyRoleData';
import { StudentJourneyService } from '../../../../lib/studentJourneyService';
import { useToast } from '../../../../context/ToastContext';
import {
  Building2,
  Briefcase,
  ExternalLink,
  MapPin,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  TrendingUp,
  Award,
  BookOpen,
  Code2,
  FileCheck,
  DollarSign,
  Calendar,
  Layers,
  Sparkles,
  ArrowLeft,
  Share2,
  Search,
  Filter,
  X
} from 'lucide-react';

interface CompanyRoleExplorerViewProps {
  initialCompanyId?: string;
  studentId: string;
  onNavigateToSkillGap: (companyName: string, roleTitle: string) => void;
  onOpenPreApplicationReview: (role: CompanyRoleProfile) => void;
  onBackToDirectory?: () => void;
}

export const CompanyRoleExplorerView: React.FC<CompanyRoleExplorerViewProps> = ({
  initialCompanyId = 'comp-google',
  studentId,
  onNavigateToSkillGap,
  onOpenPreApplicationReview,
  onBackToDirectory
}) => {
  const { showToast } = useToast();
  const [selectedCompanyId, setSelectedCompanyId] = useState<string>(initialCompanyId);
  const [companySearchTerm, setCompanySearchTerm] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [roleSearchTerm, setRoleSearchTerm] = useState<string>('');
  const [selectedRoleType, setSelectedRoleType] = useState<string>('All');

  // Categories present in catalog
  const categories = useMemo(() => {
    const cats = Array.from(new Set(TARGET_COMPANIES_CATALOG.map(c => c.category)));
    return ['All', ...cats];
  }, []);

  // Filtered companies based on search term & category
  const filteredCompanies = useMemo(() => {
    return TARGET_COMPANIES_CATALOG.filter(c => {
      const matchesSearch =
        c.name.toLowerCase().includes(companySearchTerm.toLowerCase()) ||
        c.category.toLowerCase().includes(companySearchTerm.toLowerCase()) ||
        c.primaryLocations.some(loc => loc.toLowerCase().includes(companySearchTerm.toLowerCase()));
      const matchesCategory = selectedCategory === 'All' || c.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [companySearchTerm, selectedCategory]);

  React.useEffect(() => {
    if (initialCompanyId) {
      setSelectedCompanyId(initialCompanyId);
      const newComp = TARGET_COMPANIES_CATALOG.find(c => c.id === initialCompanyId);
      if (newComp && newComp.availableRoles.length > 0) {
        setSelectedRoleId(newComp.availableRoles[0].id);
      }
    }
  }, [initialCompanyId]);

  const company: TargetCompany =
    TARGET_COMPANIES_CATALOG.find(c => c.id === selectedCompanyId) ||
    filteredCompanies[0] ||
    TARGET_COMPANIES_CATALOG[0];

  const [selectedRoleId, setSelectedRoleId] = useState<string>(company?.availableRoles[0]?.id || '');

  // Filtered roles within current company
  const filteredRoles = useMemo(() => {
    if (!company) return [];
    return company.availableRoles.filter(r => {
      const matchesSearch =
        r.roleTitle.toLowerCase().includes(roleSearchTerm.toLowerCase()) ||
        r.roleCategory.toLowerCase().includes(roleSearchTerm.toLowerCase()) ||
        r.essentialSkills.some(s => s.skillName.toLowerCase().includes(roleSearchTerm.toLowerCase())) ||
        r.locations.some(l => l.toLowerCase().includes(roleSearchTerm.toLowerCase()));
      const matchesType =
        selectedRoleType === 'All' ||
        (selectedRoleType === 'Internship' && r.employmentType === 'Internship') ||
        (selectedRoleType === 'Full-Time' && r.employmentType !== 'Internship');
      return matchesSearch && matchesType;
    });
  }, [company, roleSearchTerm, selectedRoleType]);

  const activeRole: CompanyRoleProfile | undefined =
    filteredRoles.find(r => r.id === selectedRoleId) ||
    company?.availableRoles.find(r => r.id === selectedRoleId) ||
    filteredRoles[0] ||
    company?.availableRoles[0];

  const handleSelectCompany = (id: string) => {
    setSelectedCompanyId(id);
    const newComp = TARGET_COMPANIES_CATALOG.find(c => c.id === id);
    if (newComp && newComp.availableRoles.length > 0) {
      setSelectedRoleId(newComp.availableRoles[0].id);
    }
  };

  const handleSaveAsGoal = () => {
    if (!activeRole || !company) return;
    StudentJourneyService.saveCareerGoal(studentId, {
      targetCompany: company.name,
      targetRole: activeRole.roleTitle,
      targetIndustry: company.category,
      employmentPreference: activeRole.employmentType,
      preferredLocation: activeRole.locations.join(' / '),
      workArrangement: activeRole.workArrangement === 'Flexible' ? 'Any' : (activeRole.workArrangement as any),
      expectedApplicationPeriod: 'Current Recruitment Cycle',
      targetGraduationOrAvailability: '2026',
      weeklyLearningHours: 10,
      prioritySkills: activeRole.essentialSkills.map(s => s.skillName),
      status: 'active'
    });
    showToast(`Added ${activeRole.roleTitle} at ${company.name} to your active career goals!`, 'success');
  };

  return (
    <div className="space-y-6">
      {/* Search & Filter Toolbar */}
      <div className="p-4 rounded-xl border border-slate-200 bg-white shadow-2xs space-y-3">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={companySearchTerm}
              onChange={(e) => setCompanySearchTerm(e.target.value)}
              placeholder="Search companies by name, domain, or location..."
              className="w-full pl-9 pr-8 py-2 rounded-lg border border-slate-200 bg-slate-50 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
            />
            {companySearchTerm && (
              <button
                onClick={() => setCompanySearchTerm('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5 cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          <div className="flex items-center gap-2 overflow-x-auto">
            <span className="text-[11px] font-semibold text-slate-500 flex items-center gap-1 shrink-0">
              <Filter className="w-3 h-3 text-slate-400" /> Sector:
            </span>
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition-all shrink-0 cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-indigo-600 text-white shadow-2xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Company Quick Pills */}
        <div className="flex items-center justify-between pt-2 border-t border-slate-100 gap-3">
          <div className="flex items-center gap-2 overflow-x-auto py-1">
            {filteredCompanies.length === 0 ? (
              <div className="text-xs text-slate-500 flex items-center gap-2 py-1">
                <span>No companies match "{companySearchTerm}"</span>
                <button
                  onClick={() => {
                    setCompanySearchTerm('');
                    setSelectedCategory('All');
                  }}
                  className="text-indigo-600 hover:underline font-semibold cursor-pointer"
                >
                  Clear filter
                </button>
              </div>
            ) : (
              filteredCompanies.map(c => (
                <button
                  key={c.id}
                  onClick={() => handleSelectCompany(c.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all shrink-0 cursor-pointer ${
                    c.id === selectedCompanyId
                      ? 'bg-indigo-600 text-white shadow-2xs'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  {c.name}
                </button>
              ))
            )}
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {onBackToDirectory && (
              <Button size="sm" variant="ghost" onClick={onBackToDirectory} className="text-xs">
                <ArrowLeft className="w-3.5 h-3.5 mr-1" />
                All Targets
              </Button>
            )}
            {company && (
              <a
                href={company.officialCareersWebsite}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-indigo-600 font-semibold hover:underline inline-flex items-center gap-1 shrink-0"
              >
                <span>{company.name} Careers</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            )}
          </div>
        </div>
      </div>

      {/* Company Overview Header */}
      <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-4">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Badge variant="primary">{company.category}</Badge>
              <span className="text-xs text-slate-500 font-medium">Verified Employer Profile</span>
            </div>
            <h2 className="text-2xl font-bold text-slate-900">{company.name}</h2>
            <p className="text-xs text-slate-600 max-w-3xl leading-relaxed">{company.overview}</p>
          </div>

          <div className="flex flex-wrap items-center gap-2 shrink-0">
            <a
              href={company.officialJobSearchLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-white text-slate-800 border border-slate-300 hover:border-slate-400 shadow-2xs"
            >
              <span>Search Openings</span>
              <ExternalLink className="w-3 h-3 text-slate-400" />
            </a>
          </div>
        </div>

        {/* Hiring Tracks & Locations */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-3 border-t border-slate-100 text-xs">
          <div className="space-y-1">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
              Primary Tech Locations
            </span>
            <div className="flex flex-wrap gap-1.5 text-slate-700">
              {company.primaryLocations.map((loc, idx) => (
                <span key={idx} className="px-2 py-0.5 rounded bg-slate-50 border border-slate-200 text-[11px]">
                  {loc}
                </span>
              ))}
            </div>
          </div>

          <div className="space-y-1">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
              Recruitment Tracks & Timeline
            </span>
            <div className="space-y-1">
              {company.availableHiringTracks.map((tr, idx) => (
                <div key={idx} className="text-slate-600 flex items-center justify-between">
                  <span className="font-semibold text-slate-800">{tr.name}:</span>
                  <span className="text-indigo-600">{tr.applicationWindow}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Role Workspace: Select Role & 14-Section Deep-Dive */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Left Column: Role Selector */}
        <div className="lg:col-span-1 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-900 uppercase tracking-wider block">
              Roles ({filteredRoles.length})
            </span>
            <div className="flex items-center gap-1">
              {(['All', 'Internship', 'Full-Time'] as const).map(type => (
                <button
                  key={type}
                  onClick={() => setSelectedRoleType(type)}
                  className={`px-1.5 py-0.5 rounded text-[10px] font-semibold transition-all cursor-pointer ${
                    selectedRoleType === type
                      ? 'bg-indigo-600 text-white'
                      : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                  }`}
                >
                  {type === 'Full-Time' ? 'FT' : type === 'Internship' ? 'Intern' : 'All'}
                </button>
              ))}
            </div>
          </div>

          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={roleSearchTerm}
              onChange={(e) => setRoleSearchTerm(e.target.value)}
              placeholder="Filter roles or skills..."
              className="w-full pl-8 pr-7 py-1.5 rounded-lg border border-slate-200 bg-slate-50 text-[11px] text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
            />
            {roleSearchTerm && (
              <button
                onClick={() => setRoleSearchTerm('')}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5 cursor-pointer"
              >
                <X className="w-3 h-3" />
              </button>
            )}
          </div>

          <div className="space-y-2">
            {filteredRoles.length === 0 ? (
              <div className="p-3 text-center rounded-lg bg-slate-50 border border-dashed border-slate-200 text-xs text-slate-400">
                No roles match filter
              </div>
            ) : (
              filteredRoles.map(r => (
                <div
                  key={r.id}
                  onClick={() => setSelectedRoleId(r.id)}
                  className={`p-3 rounded-xl border text-left transition-all cursor-pointer space-y-1 ${
                    r.id === activeRole?.id
                      ? 'bg-indigo-50 border-indigo-300 shadow-2xs'
                      : 'bg-white border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-900">{r.roleTitle}</span>
                    <Badge variant={r.employmentType === 'Internship' ? 'warning' : 'primary'} className="text-[9px]">
                      {r.employmentType}
                    </Badge>
                  </div>
                  <div className="text-[11px] text-slate-500">{r.roleCategory}</div>
                  <div className="text-[10px] text-indigo-600 font-medium pt-0.5">
                    {r.essentialSkills.length} Essential Skills
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Action to add custom role */}
          <div className="p-3 rounded-lg border border-dashed border-slate-300 bg-slate-50 text-center text-xs text-slate-500 space-y-2">
            <span>Want to analyze a specific job posting from {company.name}?</span>
            <Button
              size="sm"
              variant="outline"
              onClick={() => onNavigateToSkillGap(company.name, 'Custom Role Analysis')}
              className="w-full text-xs"
            >
              Analyze Custom Role
            </Button>
          </div>
        </div>

        {/* Right Column: 14-Section Role Profile Detail */}
        {activeRole && (
          <div className="lg:col-span-3 space-y-5">
            {/* Role Header Banner */}
            <div className="p-5 rounded-xl border border-slate-200 bg-white shadow-2xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Badge variant="purple">{activeRole.roleCategory}</Badge>
                  <span className="text-xs text-slate-500">Verified Specification</span>
                </div>
                <h3 className="text-xl font-bold text-slate-900">{activeRole.roleTitle}</h3>
                <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500">
                  <span className="flex items-center gap-1">
                    <Building2 className="w-3.5 h-3.5 text-slate-400" /> {activeRole.companyName}
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" /> {activeRole.locations.join(', ')} ({activeRole.workArrangement})
                  </span>
                  <span>•</span>
                  <span className="font-semibold text-emerald-700">
                    {activeRole.salaryOrStipendReference?.minAmount} - {activeRole.salaryOrStipendReference?.maxAmount} {activeRole.salaryOrStipendReference?.currency}
                  </span>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2 shrink-0">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handleSaveAsGoal}
                  className="text-xs"
                >
                  Save as Goal
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => onOpenPreApplicationReview(activeRole)}
                  className="text-xs text-indigo-700 border-indigo-200 hover:bg-indigo-50"
                >
                  <FileCheck className="w-3.5 h-3.5 mr-1" />
                  Pre-Apply Review
                </Button>
                <Button
                  size="sm"
                  variant="primary"
                  onClick={() => onNavigateToSkillGap(activeRole.companyName, activeRole.roleTitle)}
                  className="text-xs flex items-center gap-1 font-semibold"
                >
                  <TrendingUp className="w-3.5 h-3.5" />
                  <span>Run Skill Gap</span>
                </Button>
              </div>
            </div>

            {/* Section 1: Overview */}
            <Card className="p-4 space-y-2">
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                <BookOpen className="w-3.5 h-3.5 text-indigo-600" /> 1. Role Overview
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed">{activeRole.overview}</p>
            </Card>

            {/* Section 2: Day-to-Day Responsibilities */}
            <Card className="p-4 space-y-2">
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                <Briefcase className="w-3.5 h-3.5 text-slate-700" /> 2. Day-to-Day Responsibilities
              </h4>
              <ul className="space-y-1.5 text-xs text-slate-600">
                {activeRole.dayToDayResponsibilities.map((resp, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-indigo-600 font-bold">•</span>
                    <span>{resp}</span>
                  </li>
                ))}
              </ul>
            </Card>

            {/* Section 3 & 4: Essential & Preferred Skills */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card className="p-4 space-y-3">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                  <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                    <Sparkles className="w-3.5 h-3.5 text-emerald-600" /> 3. Essential Skills
                  </h4>
                  <Badge variant="success" className="text-[9px]">Mandatory</Badge>
                </div>

                <div className="space-y-2">
                  {activeRole.essentialSkills.map((sk, idx) => (
                    <div key={idx} className="p-2.5 rounded-lg border border-slate-100 bg-slate-50 flex items-center justify-between text-xs">
                      <div>
                        <div className="font-bold text-slate-800">{sk.skillName}</div>
                        <div className="text-[10px] text-slate-400">{sk.category}</div>
                      </div>
                      <div className="text-right">
                        <Badge variant="purple" className="text-[9px]">{sk.requiredLevel}</Badge>
                        <div className="text-[9px] text-slate-400 mt-0.5">{sk.source}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>

              <Card className="p-4 space-y-3">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                  <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                    <Layers className="w-3.5 h-3.5 text-indigo-600" /> 4. Preferred Skills
                  </h4>
                  <Badge variant="primary" className="text-[9px]">Differentiators</Badge>
                </div>

                <div className="space-y-2">
                  {activeRole.preferredSkills.map((sk, idx) => (
                    <div key={idx} className="p-2.5 rounded-lg border border-slate-100 bg-slate-50 flex items-center justify-between text-xs">
                      <div>
                        <div className="font-bold text-slate-800">{sk.skillName}</div>
                        <div className="text-[10px] text-slate-400">{sk.category}</div>
                      </div>
                      <div className="text-right">
                        <Badge variant="purple" className="text-[9px]">{sk.requiredLevel}</Badge>
                        <div className="text-[9px] text-slate-400 mt-0.5">{sk.source}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </div>

            {/* Section 5 & 6: Education, Eligibility & Experience */}
            <Card className="p-4 space-y-3">
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-teal-600" /> 5 & 6. Education, Eligibility & Experience Requirements
              </h4>
              <div className="space-y-2 text-xs text-slate-600">
                <ul className="list-disc pl-4 space-y-1">
                  {activeRole.educationAndEligibility.map((item, idx) => (
                    <li key={idx}>{item}</li>
                  ))}
                </ul>
                <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100 mt-2">
                  <span className="font-semibold text-slate-700">Experience Guideline: </span>
                  <span>{activeRole.experienceRequirements}</span>
                </div>
              </div>
            </Card>

            {/* Section 7: Projects That Demonstrate Readiness */}
            <Card className="p-4 space-y-3">
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                <Code2 className="w-3.5 h-3.5 text-indigo-600" /> 7. Projects That Demonstrate Readiness
              </h4>
              <p className="text-xs text-slate-500">
                Recruiters look for verifiable codebase artifacts demonstrating high concurrency, latency optimization, and test coverage.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {activeRole.projectsThatDemonstrateReadiness.map((p, idx) => (
                  <div key={idx} className="p-3 rounded-lg border border-slate-200 bg-slate-50 space-y-2 text-xs">
                    <div className="font-bold text-slate-900">{p.title}</div>
                    <p className="text-slate-600 text-[11px]">{p.description}</p>
                    <div className="space-y-1">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Required Deliverables:</span>
                      <div className="flex flex-wrap gap-1">
                        {p.expectedArtifacts.map((art, aIdx) => (
                          <span key={aIdx} className="px-2 py-0.5 rounded bg-white border border-slate-200 text-[10px] text-slate-700 font-medium">
                            {art}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* Section 8 & 9: Certifications & Assessment Preparation Focus */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card className="p-4 space-y-3">
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                  <Award className="w-3.5 h-3.5 text-amber-600" /> 8. Recommended Certifications
                </h4>
                <div className="space-y-2">
                  {activeRole.recommendedCertifications.map((c, idx) => (
                    <div key={idx} className="p-2.5 rounded-lg border border-slate-200 bg-white flex items-center justify-between text-xs">
                      <div>
                        <div className="font-bold text-slate-900">{c.title}</div>
                        <div className="text-[10px] text-slate-400">{c.issuer}</div>
                      </div>
                      <Badge variant={c.isRequired ? 'danger' : 'primary'} className="text-[9px]">
                        {c.isRequired ? 'Required' : 'Optional / Advantage'}
                      </Badge>
                    </div>
                  ))}
                </div>
              </Card>

              <Card className="p-4 space-y-3">
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                  <Calendar className="w-3.5 h-3.5 text-indigo-600" /> 9. Interview & OA Preparation
                </h4>
                <div className="space-y-2">
                  {activeRole.interviewPrepFocus.map((ip, idx) => (
                    <div key={idx} className="p-2.5 rounded-lg border border-slate-200 bg-white space-y-1 text-xs">
                      <div className="flex items-center justify-between font-bold text-slate-900">
                        <span>{ip.topic}</span>
                        <span className="text-[10px] text-indigo-600 font-semibold">{ip.questionsCount} Questions</span>
                      </div>
                      <p className="text-[11px] text-slate-500">{ip.keyFocus}</p>
                    </div>
                  ))}
                </div>
              </Card>
            </div>

            {/* Section 10 - 14: Logistics, Compensation & Official Application */}
            <Card className="p-4 space-y-3">
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                <DollarSign className="w-3.5 h-3.5 text-emerald-600" /> 10-14. Logistics, Compensation & Official Destination
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100">
                  <span className="text-slate-400 block text-[10px] font-bold uppercase">Employment Type</span>
                  <span className="font-bold text-slate-900">{activeRole.employmentType}</span>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100">
                  <span className="text-slate-400 block text-[10px] font-bold uppercase">Work Arrangement</span>
                  <span className="font-bold text-slate-900">{activeRole.workArrangement} ({activeRole.locations.join(', ')})</span>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100">
                  <span className="text-slate-400 block text-[10px] font-bold uppercase">Compensation Benchmark</span>
                  <span className="font-bold text-emerald-700">
                    {activeRole.salaryOrStipendReference?.minAmount} - {activeRole.salaryOrStipendReference?.maxAmount}
                  </span>
                </div>
              </div>

              {activeRole.salaryOrStipendReference?.sourceNotes && (
                <p className="text-[10px] text-slate-400 italic">
                  Note: {activeRole.salaryOrStipendReference.sourceNotes}
                </p>
              )}

              <div className="pt-3 border-t border-slate-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div className="text-xs text-slate-500">
                  Application Deadline: <strong className="text-slate-800">{activeRole.applicationDeadline || 'Rolling Recruitment'}</strong>
                </div>

                <div className="flex items-center gap-2">
                  <a
                    href={activeRole.officialJobSearchLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold bg-indigo-600 hover:bg-indigo-500 text-white shadow-2xs"
                  >
                    <span>Apply on {activeRole.companyName} Careers</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};
