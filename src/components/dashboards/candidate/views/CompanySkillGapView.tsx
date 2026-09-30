import React, { useState, useMemo } from 'react';
import { Card, Button, Badge } from '../../../ui';
import {
  StudentSkillRecord,
  CompanyRoleProfile,
  CompanyRoleGapAnalysis,
  StudentCertificationRecord
} from '../../../../types/studentJourney';
import { TARGET_COMPANIES_CATALOG } from '../../../../lib/companyRoleData';
import { StudentJourneyService } from '../../../../lib/studentJourneyService';
import { AssessmentResult } from '../../../../types';
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ResponsiveContainer,
  Legend
} from 'recharts';
import {
  TrendingUp,
  Building2,
  CheckCircle2,
  AlertTriangle,
  HelpCircle,
  BookOpen,
  ArrowRight,
  ShieldCheck,
  Sparkles,
  Layers,
  Award,
  Clock,
  Info
} from 'lucide-react';

interface CompanySkillGapViewProps {
  studentId: string;
  initialCompany?: string;
  initialRole?: string;
  onNavigateToLearning?: () => void;
  onNavigateToAssessments?: () => void;
  onOpenPreApplyReview?: (role: CompanyRoleProfile) => void;
}

export const CompanySkillGapView: React.FC<CompanySkillGapViewProps> = ({
  studentId,
  initialCompany = 'Google',
  initialRole = 'Software Engineering Intern',
  onNavigateToLearning,
  onNavigateToAssessments,
  onOpenPreApplyReview
}) => {
  const [selectedCompanyName, setSelectedCompanyName] = useState<string>(initialCompany);
  const [selectedRoleTitle, setSelectedRoleTitle] = useState<string>(initialRole);

  const studentSkills = useMemo(() => StudentJourneyService.getSkills(studentId), [studentId]);
  const studentCerts = useMemo(() => StudentJourneyService.getCertifications(studentId), [studentId]);

  // Load existing assessment results for this student if any
  const studentAssessments: AssessmentResult[] = useMemo(() => {
    try {
      const stored = localStorage.getItem(`skilltrack_assessment_results_${studentId}`);
      if (stored) return JSON.parse(stored);
    } catch (e) {
      console.error(e);
    }
    return [];
  }, [studentId]);

  // Find target role profile
  const targetCompany = TARGET_COMPANIES_CATALOG.find(
    c => c.name.toLowerCase() === selectedCompanyName.toLowerCase()
  ) || TARGET_COMPANIES_CATALOG[0];

  const targetRole: CompanyRoleProfile = targetCompany.availableRoles.find(
    r => r.roleTitle.toLowerCase() === selectedRoleTitle.toLowerCase()
  ) || targetCompany.availableRoles[0];

  // Calculate gap analysis deterministically
  const gapAnalysis: CompanyRoleGapAnalysis = useMemo(() => {
    return StudentJourneyService.calculateCompanyRoleGap(
      studentSkills,
      studentAssessments,
      studentCerts,
      targetRole
    );
  }, [studentSkills, studentAssessments, studentCerts, targetRole]);

  // Radar chart data comparing Required Level vs Student Evidenced Level
  const radarData = useMemo(() => {
    return gapAnalysis.gapItems.slice(0, 7).map(item => {
      const reqVal = item.requiredLevel === 'Proficient' ? 100 : item.requiredLevel === 'Advanced' ? 75 : item.requiredLevel === 'Intermediate' ? 50 : 25;
      let studVal = 0;
      if (item.studentLevel === 'Proficient') studVal = 100;
      else if (item.studentLevel === 'Advanced') studVal = 75;
      else if (item.studentLevel === 'Intermediate') studVal = 50;
      else if (item.studentLevel === 'Beginner') studVal = 25;

      // Adjust by confidence
      studVal = Math.round(studVal * item.confidenceScore);

      return {
        skill: item.skillName.length > 14 ? item.skillName.slice(0, 12) + '..' : item.skillName,
        required: reqVal,
        candidate: studVal
      };
    });
  }, [gapAnalysis]);

  return (
    <div className="space-y-6">
      {/* Header & Target Role Selector */}
      <div className="p-5 rounded-xl border border-slate-200 bg-white shadow-2xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-teal-50 text-teal-700 border border-teal-200">
              Module 4: Intelligence Engine
            </span>
            <span className="text-xs text-slate-500 font-medium">Deterministic Gap Analysis</span>
          </div>
          <h2 className="text-xl font-bold text-slate-900">Your Skills vs. Role Requirements</h2>
          <p className="text-xs text-slate-500 max-w-xl">
            Comparing your verified competencies and portfolio evidence against official prerequisites for{' '}
            <strong className="text-slate-800">{targetRole.roleTitle}</strong> at <strong className="text-slate-800">{targetRole.companyName}</strong>.
          </p>
        </div>

        {/* Company & Role Quick Pickers */}
        <div className="flex flex-wrap items-center gap-2">
          <select
            value={selectedCompanyName}
            onChange={e => {
              setSelectedCompanyName(e.target.value);
              const c = TARGET_COMPANIES_CATALOG.find(x => x.name === e.target.value);
              if (c && c.availableRoles.length > 0) {
                setSelectedRoleTitle(c.availableRoles[0].roleTitle);
              }
            }}
            className="text-xs rounded-lg border border-slate-300 p-2 bg-white font-medium focus:ring-2 focus:ring-indigo-500"
          >
            {TARGET_COMPANIES_CATALOG.map(c => (
              <option key={c.id} value={c.name}>{c.name}</option>
            ))}
          </select>

          <select
            value={selectedRoleTitle}
            onChange={e => setSelectedRoleTitle(e.target.value)}
            className="text-xs rounded-lg border border-slate-300 p-2 bg-white font-medium focus:ring-2 focus:ring-indigo-500 max-w-xs truncate"
          >
            {targetCompany.availableRoles.map(r => (
              <option key={r.id} value={r.roleTitle}>{r.roleTitle}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Metric Breakdown Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <Card className="p-3.5 bg-indigo-50/70 border-indigo-200 text-center space-y-1">
          <span className="text-[10px] font-bold text-indigo-700 uppercase tracking-wider block">Role Readiness</span>
          <div className="text-2xl font-black text-indigo-950">{gapAnalysis.readinessPercentage}%</div>
          <span className="text-[10px] text-indigo-600 block">
            {gapAnalysis.provisionalScore ? 'Provisional (Unassessed)' : 'Evidence Grounded'}
          </span>
        </Card>

        <Card className="p-3.5 bg-emerald-50/70 border-emerald-200 text-center space-y-1">
          <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-wider block">Meets Requirement</span>
          <div className="text-2xl font-black text-emerald-950">{gapAnalysis.meetingCount}</div>
          <span className="text-[10px] text-emerald-600 block">Evidenced</span>
        </Card>

        <Card className="p-3.5 bg-amber-50/70 border-amber-200 text-center space-y-1">
          <span className="text-[10px] font-bold text-amber-700 uppercase tracking-wider block">Partial Match</span>
          <div className="text-2xl font-black text-amber-950">{gapAnalysis.partialCount}</div>
          <span className="text-[10px] text-amber-600 block">Needs Level Up</span>
        </Card>

        <Card className="p-3.5 bg-purple-50/70 border-purple-200 text-center space-y-1">
          <span className="text-[10px] font-bold text-purple-700 uppercase tracking-wider block">Needs Assessment</span>
          <div className="text-2xl font-black text-purple-950">{gapAnalysis.needsAssessmentCount}</div>
          <span className="text-[10px] text-purple-600 block">Self-Declared Only</span>
        </Card>

        <Card className="p-3.5 bg-rose-50/70 border-rose-200 text-center space-y-1">
          <span className="text-[10px] font-bold text-rose-700 uppercase tracking-wider block">Skills to Develop</span>
          <div className="text-2xl font-black text-rose-950">{gapAnalysis.toDevelopCount}</div>
          <span className="text-[10px] text-rose-600 block">Prerequisite Deficit</span>
        </Card>

        <Card className="p-3.5 bg-slate-50 border-slate-200 text-center space-y-1">
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Not Yet Evidenced</span>
          <div className="text-2xl font-black text-slate-800">{gapAnalysis.notEvidencedCount}</div>
          <span className="text-[10px] text-slate-400 block">Unassessed</span>
        </Card>
      </div>

      {/* Visual Radar & Top Priorities Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Radar Chart */}
        <Card className="p-5 lg:col-span-1 space-y-3">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
              <TrendingUp className="w-3.5 h-3.5 text-indigo-600" />
              Competency Radar
            </h3>
            <span className="text-[10px] text-slate-400">Target vs Actual</span>
          </div>

          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={radarData}>
                <PolarGrid stroke="#e2e8f0" />
                <PolarAngleAxis dataKey="skill" stroke="#64748b" tick={{ fill: '#475569', fontSize: 10, fontWeight: 500 }} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} stroke="#cbd5e1" tick={{ fontSize: 9 }} />
                <Radar name="Target Requirement" dataKey="required" stroke="#6366f1" fill="#6366f1" fillOpacity={0.15} />
                <Radar name="My Evidenced" dataKey="candidate" stroke="#0d9488" fill="#0d9488" fillOpacity={0.4} />
                <Legend wrapperStyle={{ fontSize: '10px', color: '#475569' }} />
              </RadarChart>
            </ResponsiveContainer>
          </div>

          <div className="text-[11px] text-slate-500 text-center">
            {gapAnalysis.meetingCount === gapAnalysis.totalRequirements ? (
              <span className="text-emerald-700 font-semibold">✓ All core requirements evidenced with verified records!</span>
            ) : (
              <span>Focus on the highest-priority deficits to raise role readiness.</span>
            )}
          </div>
        </Card>

        {/* Priority Gaps & Action Items */}
        <Card className="p-5 lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-teal-600" />
              Targeted Next Steps to Bridge Gaps
            </h3>
            {onOpenPreApplyReview && (
              <Button
                size="sm"
                variant="outline"
                onClick={() => onOpenPreApplyReview(targetRole)}
                className="text-xs"
              >
                Pre-Apply Checklist
              </Button>
            )}
          </div>

          {/* Top Priority Highlights */}
          <div className="space-y-2">
            <span className="text-[11px] font-bold text-slate-600 uppercase tracking-wider block">
              Top Actionable Skill Gaps
            </span>

            {gapAnalysis.gapItems.filter(g => g.gapCategory !== 'Meets requirement').slice(0, 3).map((item, idx) => (
              <div
                key={idx}
                className="p-3 rounded-lg border border-slate-200 bg-slate-50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs"
              >
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900">{item.skillName}</span>
                    <Badge variant={item.importance === 'Critical' ? 'danger' : 'warning'} className="text-[9px]">
                      {item.importance}
                    </Badge>
                    <span className="text-[10px] text-slate-500 font-medium">({item.gapCategory})</span>
                  </div>
                  <p className="text-slate-600 text-[11px]">{item.suggestedAction}</p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-[10px] text-slate-400 font-mono flex items-center gap-1">
                    <Clock className="w-3 h-3" /> ~{item.estimatedEffortHours}h
                  </span>
                  {item.gapCategory === 'Skill needs assessment' ? (
                    <Button
                      size="sm"
                      variant="primary"
                      onClick={onNavigateToAssessments}
                      className="text-[11px] py-1"
                    >
                      Take Assessment
                    </Button>
                  ) : (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={onNavigateToLearning}
                      className="text-[11px] py-1"
                    >
                      View Learning
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Transparent Formula Explanation */}
          <div className="p-3 rounded-lg bg-indigo-50/50 border border-indigo-100 flex items-start gap-2.5 text-[11px] text-indigo-900">
            <Info className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
            <div>
              <strong className="block font-semibold">Deterministic Formula & Evidence Weighting:</strong>
              <span>{gapAnalysis.formulaExplanation} Readiness estimates do not guarantee employment offers; they serve as an objective skills benchmarking guide.</span>
            </div>
          </div>
        </Card>
      </div>

      {/* Comprehensive Skill Gap Comparison Table */}
      <Card className="p-5 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-2">
          <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
            <Layers className="w-4 h-4 text-slate-700" />
            All Role Prerequisites vs. Your Evidence ({gapAnalysis.gapItems.length})
          </h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 text-slate-500 text-[11px]">
                <th className="pb-2.5 font-bold">Skill Requirement</th>
                <th className="pb-2.5 font-bold">Required Level</th>
                <th className="pb-2.5 font-bold">Your Evidenced Level</th>
                <th className="pb-2.5 font-bold">Evidence Source</th>
                <th className="pb-2.5 font-bold">Status</th>
                <th className="pb-2.5 font-bold">Recommended Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {gapAnalysis.gapItems.map((item, idx) => (
                <tr key={idx} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-2.5">
                    <div className="font-bold text-slate-900">{item.skillName}</div>
                    <div className="text-[10px] text-slate-400">{item.category}</div>
                  </td>

                  <td className="py-2.5">
                    <Badge variant="purple" className="text-[9px]">{item.requiredLevel}</Badge>
                    <span className="text-[10px] text-slate-400 block mt-0.5">{item.importance}</span>
                  </td>

                  <td className="py-2.5">
                    {item.studentLevel ? (
                      <span className="font-semibold text-slate-800">{item.studentLevel}</span>
                    ) : (
                      <span className="text-slate-400 italic">Not Provided</span>
                    )}
                  </td>

                  <td className="py-2.5">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      item.evidenceSource === 'Verified Certificate' ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' :
                      item.evidenceSource === 'Assessment Passed' ? 'bg-teal-100 text-teal-800 border border-teal-300' :
                      item.evidenceSource === 'Project Link' ? 'bg-indigo-100 text-indigo-800 border border-indigo-300' :
                      item.evidenceSource === 'Self-Declared' ? 'bg-amber-100 text-amber-800 border border-amber-300' :
                      'bg-slate-100 text-slate-500'
                    }`}>
                      {item.evidenceSource}
                    </span>
                  </td>

                  <td className="py-2.5">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      item.gapCategory === 'Meets requirement' ? 'text-emerald-700 bg-emerald-50' :
                      item.gapCategory === 'Partially meets requirement' ? 'text-amber-700 bg-amber-50' :
                      item.gapCategory === 'Skill needs assessment' ? 'text-purple-700 bg-purple-50' :
                      'text-rose-700 bg-rose-50'
                    }`}>
                      {item.gapCategory}
                    </span>
                  </td>

                  <td className="py-2.5 max-w-xs text-slate-600 text-[11px]">
                    {item.suggestedAction}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};
