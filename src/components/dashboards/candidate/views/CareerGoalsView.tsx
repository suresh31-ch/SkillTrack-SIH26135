import React, { useState } from 'react';
import { Card, Button, Badge, Input, Modal } from '../../../ui';
import { CareerGoal, TargetCompany, PreferredEmploymentType } from '../../../../types/studentJourney';
import { TARGET_COMPANIES_CATALOG } from '../../../../lib/companyRoleData';
import { StudentJourneyService } from '../../../../lib/studentJourneyService';
import { useToast } from '../../../../context/ToastContext';
import {
  Compass,
  Building2,
  Briefcase,
  Calendar,
  Clock,
  Plus,
  Trash2,
  Edit3,
  CheckCircle2,
  ArrowRight,
  Search,
  ExternalLink,
  Sparkles,
  Layers,
  MapPin,
  AlertCircle
} from 'lucide-react';

interface CareerGoalsViewProps {
  studentId: string;
  onExploreCompanyRoles: (companyId: string) => void;
  onNavigateToSkillGap?: (companyName: string, roleTitle: string) => void;
}

export const CareerGoalsView: React.FC<CareerGoalsViewProps> = ({
  studentId,
  onExploreCompanyRoles,
  onNavigateToSkillGap
}) => {
  const { showToast } = useToast();
  const [goals, setGoals] = useState<CareerGoal[]>(() => StudentJourneyService.getCareerGoals(studentId));
  const [isAddGoalModalOpen, setIsAddGoalModalOpen] = useState(false);
  const [editingGoalId, setEditingGoalId] = useState<string | null>(null);

  React.useEffect(() => {
    setGoals(StudentJourneyService.getCareerGoals(studentId));
  }, [studentId]);

  // Form State
  const [selectedCompany, setSelectedCompany] = useState<string>('Google');
  const [customCompany, setCustomCompany] = useState<string>('');
  const [targetRole, setTargetRole] = useState<string>('Software Engineering Intern');
  const [targetIndustry, setTargetIndustry] = useState<string>('Product Tech & Cloud');
  const [employmentPreference, setEmploymentPreference] = useState<PreferredEmploymentType>('Internship');
  const [preferredLocation, setPreferredLocation] = useState<string>('Bengaluru / Pune / Remote');
  const [workArrangement, setWorkArrangement] = useState<CareerGoal['workArrangement']>('Hybrid');
  const [expectedApplicationPeriod, setExpectedApplicationPeriod] = useState<string>('Autumn 2026 Campus Drive');
  const [weeklyLearningHours, setWeeklyLearningHours] = useState<number>(10);
  const [prioritySkillsInput, setPrioritySkillsInput] = useState<string>('Data Structures, Python, System Design');

  // Search filter for company cards
  const [companySearch, setCompanySearch] = useState('');

  const filteredCompanies = TARGET_COMPANIES_CATALOG.filter(c =>
    c.name.toLowerCase().includes(companySearch.toLowerCase()) ||
    c.category.toLowerCase().includes(companySearch.toLowerCase())
  );

  const selectedCompanyRoles = React.useMemo(() => {
    const c = TARGET_COMPANIES_CATALOG.find(x => x.name.toLowerCase() === selectedCompany.toLowerCase());
    return c ? c.availableRoles : [];
  }, [selectedCompany]);

  const handleOpenAddGoal = (prefillCompany?: string) => {
    setEditingGoalId(null);
    if (prefillCompany) {
      setSelectedCompany(prefillCompany);
      setCustomCompany('');
      const c = TARGET_COMPANIES_CATALOG.find(x => x.name.toLowerCase() === prefillCompany.toLowerCase());
      if (c && c.availableRoles.length > 0) {
        setTargetRole(c.availableRoles[0].roleTitle);
        setTargetIndustry(c.category);
        setPrioritySkillsInput(c.availableRoles[0].essentialSkills.map(s => s.skillName).join(', '));
      }
    } else {
      setSelectedCompany('Google');
      setCustomCompany('');
      setTargetRole('Software Engineering Intern');
      setTargetIndustry('Product Tech & Cloud');
      setPrioritySkillsInput('Data Structures & Algorithms, Python, System Design Fundamentals');
    }
    setIsAddGoalModalOpen(true);
  };

  const handleOpenEditGoal = (goal: CareerGoal) => {
    setEditingGoalId(goal.id);
    const inCatalog = TARGET_COMPANIES_CATALOG.some(c => c.name.toLowerCase() === goal.targetCompany.toLowerCase());
    if (inCatalog) {
      setSelectedCompany(goal.targetCompany);
      setCustomCompany('');
    } else {
      setSelectedCompany('Custom');
      setCustomCompany(goal.targetCompany);
    }
    setTargetRole(goal.targetRole);
    setTargetIndustry(goal.targetIndustry);
    setEmploymentPreference(goal.employmentPreference);
    setPreferredLocation(goal.preferredLocation);
    setWorkArrangement(goal.workArrangement);
    setExpectedApplicationPeriod(goal.expectedApplicationPeriod);
    setWeeklyLearningHours(goal.weeklyLearningHours);
    setPrioritySkillsInput(goal.prioritySkills.join(', '));
    setIsAddGoalModalOpen(true);
  };

  const handleSaveGoal = () => {
    const finalCompany = customCompany.trim() || selectedCompany;
    if (!finalCompany) {
      showToast('Please select or specify a target company', 'warning');
      return;
    }
    if (!targetRole.trim()) {
      showToast('Please specify a target role', 'warning');
      return;
    }

    const prioritySkills = prioritySkillsInput
      .split(',')
      .map(s => s.trim())
      .filter(Boolean);

    const saved = StudentJourneyService.saveCareerGoal(studentId, {
      id: editingGoalId || undefined,
      targetCompany: finalCompany,
      targetRole: targetRole.trim(),
      targetIndustry,
      employmentPreference,
      preferredLocation,
      workArrangement,
      expectedApplicationPeriod,
      targetGraduationOrAvailability: '2026',
      weeklyLearningHours: Number(weeklyLearningHours),
      prioritySkills,
      status: 'active'
    });

    setGoals(StudentJourneyService.getCareerGoals(studentId));
    setIsAddGoalModalOpen(false);
    setEditingGoalId(null);
    showToast(`Career goal ${editingGoalId ? 'updated' : 'saved'}: ${saved.targetRole} at ${saved.targetCompany}!`, 'success');
  };

  const handleDeleteGoal = (goalId: string) => {
    StudentJourneyService.deleteCareerGoal(studentId, goalId);
    setGoals(StudentJourneyService.getCareerGoals(studentId));
    showToast('Career goal removed', 'info');
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-1.5 max-w-2xl">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 flex items-center gap-1">
              <Compass className="w-3.5 h-3.5" /> Career Destination Center
            </span>
          </div>
          <h2 className="text-xl font-bold tracking-tight">Where Do You Want Your Career to Go?</h2>
          <p className="text-xs text-slate-300 leading-relaxed">
            Select your dream employers, target job tracks, and weekly skilling schedule. We compare your authentic verified skills against verified job descriptions to create targeted roadmaps.
          </p>
        </div>

        <Button
          size="md"
          variant="primary"
          onClick={() => handleOpenAddGoal()}
          className="text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white shrink-0 shadow-sm flex items-center gap-1.5"
        >
          <Plus className="w-4 h-4" />
          <span>Set New Career Goal</span>
        </Button>
      </div>

      {/* Active Career Goals Section */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <Compass className="w-4 h-4 text-indigo-600" />
            My Active Career Targets ({goals.length})
          </h3>
          <span className="text-[11px] text-slate-500">
            {goals.length === 0 ? 'No goals established yet' : 'Multiple active targets supported'}
          </span>
        </div>

        {goals.length === 0 ? (
          <Card className="p-8 text-center bg-slate-50 border border-dashed border-slate-300 space-y-3">
            <div className="w-12 h-12 rounded-full bg-indigo-50 border border-indigo-200 flex items-center justify-center text-indigo-600 mx-auto">
              <Compass className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-800">No Career Goals Recorded Yet</h4>
              <p className="text-xs text-slate-500 max-w-md mx-auto mt-1">
                Setting a career target unlocks deterministic skill gap analysis, personalized curriculum milestones, and relevant opportunity matching.
              </p>
            </div>
            <Button
              size="sm"
              variant="primary"
              onClick={() => handleOpenAddGoal()}
              className="text-xs"
            >
              Set My First Career Goal
            </Button>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {goals.map(g => {
              const matchedCatalog = TARGET_COMPANIES_CATALOG.find(
                c => c.name.toLowerCase() === g.targetCompany.toLowerCase()
              );

              return (
                <Card key={g.id} className="p-5 border-slate-200 bg-white shadow-2xs flex flex-col justify-between space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <Badge variant="primary" className="text-[10px] font-bold">
                            {g.targetCompany}
                          </Badge>
                          <span className="text-[10px] px-2 py-0.5 rounded font-bold bg-slate-100 text-slate-700">
                            {g.employmentPreference}
                          </span>
                        </div>
                        <h4 className="text-base font-bold text-slate-900 mt-1">{g.targetRole}</h4>
                        <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-0.5">
                          <MapPin className="w-3.5 h-3.5 text-slate-400" />
                          <span>{g.preferredLocation}</span> • <span>{g.workArrangement}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => handleOpenEditGoal(g)}
                          className="text-slate-400 hover:text-indigo-600 p-1.5 transition-colors cursor-pointer"
                          title="Edit Goal"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteGoal(g.id)}
                          className="text-slate-400 hover:text-rose-600 p-1.5 transition-colors cursor-pointer"
                          title="Delete Goal"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-[11px] p-2.5 rounded-lg bg-slate-50 border border-slate-100">
                      <div>
                        <span className="text-slate-400 block font-medium">Application Window:</span>
                        <span className="text-slate-800 font-semibold">{g.expectedApplicationPeriod}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block font-medium">Weekly Skilling:</span>
                        <span className="text-indigo-600 font-semibold">{g.weeklyLearningHours} hours / week</span>
                      </div>
                    </div>

                    {g.prioritySkills && g.prioritySkills.length > 0 && (
                      <div className="space-y-1">
                        <span className="text-[10px] uppercase tracking-wider font-bold text-slate-400 block">
                          Priority Focus Areas
                        </span>
                        <div className="flex flex-wrap gap-1">
                          {g.prioritySkills.map((sk, idx) => (
                            <span key={idx} className="px-2 py-0.5 rounded text-[10px] font-medium bg-indigo-50 text-indigo-700 border border-indigo-200">
                              {sk}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                    {matchedCatalog ? (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => onExploreCompanyRoles(matchedCatalog.id)}
                        className="text-xs flex items-center gap-1"
                      >
                        <Building2 className="w-3.5 h-3.5" />
                        Explore Roles
                      </Button>
                    ) : (
                      <span className="text-[11px] text-slate-400">Custom Target Employer</span>
                    )}

                    {onNavigateToSkillGap && (
                      <Button
                        size="sm"
                        variant="primary"
                        onClick={() => onNavigateToSkillGap(g.targetCompany, g.targetRole)}
                        className="text-xs flex items-center gap-1"
                      >
                        <span>Analyze Skill Gap</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Button>
                    )}
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </div>

      {/* Target Companies Directory */}
      <div className="space-y-4 pt-4 border-t border-slate-200">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Building2 className="w-4 h-4 text-slate-700" />
              Verified Employer Role Catalog
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Select any company to view structured 14-section role profiles, official career portals, and hiring prerequisites.
            </p>
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              value={companySearch}
              onChange={e => setCompanySearch(e.target.value)}
              placeholder="Search companies or sectors..."
              className="w-full text-xs pl-8 pr-3 py-1.5 rounded-lg border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>

        {/* Disclaimer Card */}
        <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 flex items-start gap-2.5 text-xs text-slate-500">
          <AlertCircle className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
          <span>
            <strong>Official Transparency Notice:</strong> Target company listings represent student career interests and curated curriculum roadmaps. Listing does not imply commercial partnership or endorsement with SkillTrack.
          </span>
        </div>

        {/* Companies Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredCompanies.map(c => (
            <Card
              key={c.id}
              className="p-4 border-slate-200 hover:border-indigo-300 transition-all hover:shadow-xs flex flex-col justify-between space-y-3 cursor-pointer group"
              onClick={() => onExploreCompanyRoles(c.id)}
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-700">
                    {c.category}
                  </span>
                  <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:text-indigo-600 transition-colors" />
                </div>

                <div>
                  <h4 className="text-sm font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                    {c.name}
                  </h4>
                  <p className="text-xs text-slate-500 line-clamp-2 mt-0.5">{c.overview}</p>
                </div>

                <div className="text-[11px] text-slate-500 space-y-1 pt-1">
                  <div className="flex items-center gap-1 truncate">
                    <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                    <span>{c.primaryLocations.slice(0, 3).join(', ')}</span>
                  </div>
                  <div className="flex items-center gap-1 text-teal-700 font-medium">
                    <Briefcase className="w-3 h-3 text-teal-600 shrink-0" />
                    <span>{c.availableRoles.length} Verified Career Track(s)</span>
                  </div>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-indigo-600 font-semibold group-hover:translate-x-0.5 transition-transform">
                <span>Explore Roles & Requirements</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Add Career Goal Modal */}
      {isAddGoalModalOpen && (
        <Modal
          isOpen={isAddGoalModalOpen}
          onClose={() => setIsAddGoalModalOpen(false)}
          title="Establish Career Target & Skilling Commitment"
          maxWidth="max-w-2xl"
        >
          <div className="space-y-4 text-xs">
            <div className="space-y-1 border-b border-slate-100 pb-2">
              <p className="text-slate-500">
                Define the employer, role, and learning hours you commit to each week.
              </p>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Target Company *</label>
              <select
                value={selectedCompany}
                onChange={e => {
                  const val = e.target.value;
                  setSelectedCompany(val);
                  setCustomCompany('');
                  const c = TARGET_COMPANIES_CATALOG.find(x => x.name.toLowerCase() === val.toLowerCase());
                  if (c) {
                    setTargetIndustry(c.category);
                    if (c.availableRoles.length > 0) {
                      setTargetRole(c.availableRoles[0].roleTitle);
                      setPrioritySkillsInput(c.availableRoles[0].essentialSkills.map(s => s.skillName).join(', '));
                    }
                  }
                }}
                className="w-full text-xs rounded-lg border border-slate-300 p-2 bg-white"
              >
                {TARGET_COMPANIES_CATALOG.map(c => (
                  <option key={c.id} value={c.name}>{c.name} ({c.category})</option>
                ))}
                <option value="Custom">Other / Custom Employer...</option>
              </select>
            </div>

            {selectedCompany === 'Custom' && (
              <Input
                label="Custom Company Name *"
                value={customCompany}
                onChange={e => setCustomCompany(e.target.value)}
                placeholder="e.g. Atlassian, Uber, Cisco, Razorpay"
                required
              />
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Target Job Track / Role *</label>
                {selectedCompanyRoles.length > 0 ? (
                  <div className="space-y-1.5">
                    <select
                      value={targetRole}
                      onChange={e => {
                        const val = e.target.value;
                        setTargetRole(val);
                        const r = selectedCompanyRoles.find(x => x.roleTitle === val);
                        if (r) {
                          setPrioritySkillsInput(r.essentialSkills.map(s => s.skillName).join(', '));
                          setEmploymentPreference(r.employmentType);
                        }
                      }}
                      className="w-full text-xs rounded-lg border border-slate-300 p-2 bg-white"
                    >
                      {selectedCompanyRoles.map(r => (
                        <option key={r.id} value={r.roleTitle}>{r.roleTitle} ({r.employmentType})</option>
                      ))}
                      <option value="Custom">Custom / Other Role Title...</option>
                    </select>
                    {targetRole === 'Custom' && (
                      <input
                        type="text"
                        placeholder="Enter custom role title..."
                        onChange={e => setTargetRole(e.target.value)}
                        className="w-full text-xs rounded-lg border border-slate-300 p-2 bg-white mt-1"
                        required
                      />
                    )}
                  </div>
                ) : (
                  <Input
                    label=""
                    value={targetRole}
                    onChange={e => setTargetRole(e.target.value)}
                    placeholder="e.g. Software Engineering Intern, AI Engineer"
                  />
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Employment Preference</label>
                <select
                  value={employmentPreference}
                  onChange={e => setEmploymentPreference(e.target.value as any)}
                  className="w-full text-xs rounded-lg border border-slate-300 p-2 bg-white"
                >
                  <option value="Internship">Summer / Semester Internship</option>
                  <option value="Full-time">Graduate Full-Time</option>
                  <option value="Apprenticeship">Apprenticeship</option>
                </select>
              </div>

              <Input
                label="Preferred Location"
                value={preferredLocation}
                onChange={e => setPreferredLocation(e.target.value)}
                placeholder="e.g. Pune, Bengaluru, Remote"
              />

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Work Arrangement</label>
                <select
                  value={workArrangement}
                  onChange={e => setWorkArrangement(e.target.value as any)}
                  className="w-full text-xs rounded-lg border border-slate-300 p-2 bg-white"
                >
                  <option value="Hybrid">Hybrid (In-Office + WFH)</option>
                  <option value="In-office">In-office Only</option>
                  <option value="Remote">Fully Remote</option>
                  <option value="Any">Flexible / Any</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Application Cycle</label>
                <select
                  value={expectedApplicationPeriod}
                  onChange={e => setExpectedApplicationPeriod(e.target.value)}
                  className="w-full text-xs rounded-lg border border-slate-300 p-2 bg-white"
                >
                  <option value="Immediate (Rolling Openings)">Immediate (Rolling Openings)</option>
                  <option value="Autumn 2026 Campus Drive">Autumn 2026 Campus Drive</option>
                  <option value="Spring 2027 Placement Window">Spring 2027 Placement Window</option>
                  <option value="Off-Campus Pool Drive">Off-Campus Pool Drive</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Weekly Learning Time</label>
                <select
                  value={weeklyLearningHours}
                  onChange={e => setWeeklyLearningHours(Number(e.target.value))}
                  className="w-full text-xs rounded-lg border border-slate-300 p-2 bg-white"
                >
                  <option value={5}>5 hours / week (Light Skilling)</option>
                  <option value={10}>10 hours / week (Recommended Track)</option>
                  <option value={15}>15 hours / week (Intensive Prep)</option>
                  <option value={20}>20+ hours / week (Full-time Bootcamp)</option>
                </select>
              </div>
            </div>

            <Input
              label="Priority Skills to Develop (Comma Separated)"
              value={prioritySkillsInput}
              onChange={e => setPrioritySkillsInput(e.target.value)}
              placeholder="e.g. Data Structures, React, SQL, Cloud Architecture"
            />

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
              <Button size="sm" variant="ghost" onClick={() => setIsAddGoalModalOpen(false)}>
                Cancel
              </Button>
              <Button size="sm" variant="primary" onClick={handleSaveGoal}>
                Confirm & Save Goal
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
