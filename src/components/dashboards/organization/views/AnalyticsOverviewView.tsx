import React from 'react';
import { AnalyticsService } from '../../../../lib/analyticsService';
import { Card, Badge, Button } from '../../../ui';
import { formatCurrency, formatPercentage } from '../../../../lib/utils';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  CartesianGrid
} from 'recharts';
import {
  Users,
  GraduationCap,
  Award,
  Briefcase,
  TrendingUp,
  Clock,
  Sparkles,
  AlertTriangle,
  Layers,
  CheckCircle2,
  Building2,
  DollarSign,
  ArrowUpRight,
  ShieldCheck
} from 'lucide-react';

interface AnalyticsOverviewViewProps {
  onNavigateTab: (tabId: string) => void;
}

export const AnalyticsOverviewView: React.FC<AnalyticsOverviewViewProps> = ({ onNavigateTab }) => {
  const kpis = AnalyticsService.getAdminKPIs();
  const funnelData = AnalyticsService.getPipelineFunnel();
  const monthlyTrends = AnalyticsService.getMonthlyTrends();
  const sectorBreakdown = AnalyticsService.getSectorBreakdown();
  const anomalies = AnalyticsService.getAnomalies();
  const openAnomalies = anomalies.filter(a => a.status !== 'resolved');

  return (
    <div className="space-y-6">
      {/* Top Banner / Header */}
      <div className="p-5 rounded-xl border border-slate-200 bg-white shadow-2xs flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Badge variant="purple">Platform Administrator</Badge>
            <span className="text-xs text-slate-500 font-medium">State Skilling Intelligence & Outcomes</span>
          </div>
          <h1 className="text-xl font-bold text-slate-900 mt-1">
            Skilling Outcomes, Retention & Quality Assurance Dashboard
          </h1>
          <p className="text-xs text-slate-500 mt-0.5 max-w-3xl">
            Longitudinal tracking of trainee enrollment, NSQF skill certification, industry placements, EPFO-verified employment continuity, and automated integrity safeguards.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <Button
            size="sm"
            variant="outline"
            leftIcon={<Building2 className="w-3.5 h-3.5" />}
            onClick={() => onNavigateTab('district_analytics')}
            id="btn-nav-districts"
          >
            District Analytics
          </Button>
          <Button
            size="sm"
            variant="outline"
            leftIcon={<Sparkles className="w-3.5 h-3.5" />}
            onClick={() => onNavigateTab('skill_intelligence')}
            id="btn-nav-skills"
          >
            Supply vs Demand
          </Button>
          <Button
            size="sm"
            variant="primary"
            leftIcon={<Briefcase className="w-3.5 h-3.5" />}
            onClick={() => onNavigateTab('reports')}
            id="btn-nav-reports"
          >
            Generate Report
          </Button>
        </div>
      </div>

      {/* 8 Primary Key Performance Indicators (KPI Cards) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
        <Card className="p-4 border-slate-200">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Total Candidates</span>
            <div className="w-7 h-7 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-slate-900 mt-1.5">
            {kpis.total_candidates.toLocaleString()}
          </div>
          <div className="flex items-center gap-1 text-[11px] text-emerald-600 font-medium mt-1">
            <ArrowUpRight className="w-3 h-3" /> +14.2% YoY growth
          </div>
        </Card>

        <Card className="p-4 border-slate-200">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Candidates Trained</span>
            <div className="w-7 h-7 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center">
              <GraduationCap className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-slate-900 mt-1.5">
            {kpis.candidates_trained.toLocaleString()}
          </div>
          <div className="text-[11px] text-indigo-600 font-medium mt-1">
            {Math.round((kpis.candidates_trained / kpis.total_candidates) * 100)}% Completion Rate
          </div>
        </Card>

        <Card className="p-4 border-slate-200">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Candidates Certified</span>
            <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Award className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-slate-900 mt-1.5">
            {kpis.candidates_certified.toLocaleString()}
          </div>
          <div className="text-[11px] text-emerald-600 font-medium mt-1">
            94.8% Pass Rate (NSQF)
          </div>
        </Card>

        <Card className="p-4 border-slate-200">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Candidates Placed</span>
            <div className="w-7 h-7 rounded-lg bg-teal-50 text-teal-600 flex items-center justify-center">
              <Briefcase className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-emerald-700 mt-1.5">
            {kpis.candidates_placed.toLocaleString()}
          </div>
          <div className="text-[11px] text-emerald-700 font-semibold mt-1">
            {kpis.placement_rate}% Verified Placement
          </div>
        </Card>

        <Card className="p-4 border-slate-200">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">6-Month Retention Rate</span>
            <div className="w-7 h-7 rounded-lg bg-sky-50 text-sky-600 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-sky-700 mt-1.5">
            {kpis.retention_6m_rate}%
          </div>
          <div className="text-[11px] text-slate-500 font-medium mt-1">
            Simulated EPFO UAN Track
          </div>
        </Card>

        <Card className="p-4 border-slate-200">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">12-Month Retention Rate</span>
            <div className="w-7 h-7 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-amber-700 mt-1.5">
            {kpis.retention_12m_rate}%
          </div>
          <div className="text-[11px] text-slate-500 font-medium mt-1">
            Longitudinal Career Longevity
          </div>
        </Card>

        <Card className="p-4 border-slate-200">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Average Readiness Score</span>
            <div className="w-7 h-7 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-indigo-700 mt-1.5">
            {kpis.avg_readiness_score}<span className="text-sm font-normal text-slate-400">/100</span>
          </div>
          <div className="text-[11px] text-indigo-600 font-medium mt-1">
            +5.8 pts above benchmark
          </div>
        </Card>

        <Card className="p-4 border-slate-200">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Integrity & Quality Alerts</span>
            <div className="w-7 h-7 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-rose-600 mt-1.5">
            {openAnomalies.length}
          </div>
          <div className="flex items-center justify-between text-[11px] text-rose-600 font-medium mt-1">
            <span>Rule-based flags</span>
            <button
              onClick={() => onNavigateTab('anomaly_detection')}
              className="underline font-bold hover:text-rose-700 cursor-pointer"
            >
              Review
            </button>
          </div>
        </Card>
      </div>

      {/* Trainee Pipeline Funnel Visualizer */}
      <Card className="p-5 border-slate-200">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-4 border-b border-slate-100 gap-2">
          <div>
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Layers className="w-4 h-4 text-indigo-600" /> Statewide Trainee Pipeline & Conversion Funnel
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Attrition analysis across key skilling lifecycle milestones: Enrollment → Training → Certification → Placement → 6M Retention
            </p>
          </div>
          <Badge variant="success">Consistency Audit Passed</Badge>
        </div>

        <div className="mt-5 grid grid-cols-1 md:grid-cols-5 gap-3">
          {funnelData.map((stage, idx) => (
            <div
              key={idx}
              className="p-3.5 rounded-lg border border-slate-200 bg-slate-50/70 flex flex-col justify-between relative overflow-hidden"
            >
              <div
                className="absolute top-0 left-0 right-0 h-1"
                style={{ backgroundColor: stage.fill }}
              />
              <div>
                <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">{stage.step}</div>
                <div className="text-xl font-bold text-slate-900 mt-1.5">
                  {stage.count.toLocaleString()}
                </div>
              </div>

              <div className="mt-3 pt-2.5 border-t border-slate-200/60 flex items-center justify-between text-xs">
                <span className="text-slate-500 font-medium">Conversion</span>
                <span className="font-bold text-slate-900" style={{ color: stage.fill }}>
                  {stage.percentage}%
                </span>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Charts Grid: Monthly Placements & Wage Trend + Sector Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Monthly Placements & Avg Wage Trend (2 cols) */}
        <Card className="p-5 lg:col-span-2 border-slate-200">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-emerald-600" /> Monthly Placement Volume & Wage Trajectory (LPA)
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Combined trend of monthly candidate hirings and average verified annual salary (INR Lakhs)
              </p>
            </div>
            <Badge variant="primary">9-Month Trend</Badge>
          </div>

          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyTrends} margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="month" stroke="#94a3b8" tick={{ fill: '#475569', fontSize: 11 }} />
                <YAxis yAxisId="left" stroke="#94a3b8" tick={{ fill: '#475569', fontSize: 11 }} />
                <YAxis yAxisId="right" orientation="right" domain={[0, 8]} stroke="#94a3b8" tick={{ fill: '#475569', fontSize: 11 }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#ffffff',
                    borderColor: '#e2e8f0',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                    fontSize: '12px'
                  }}
                />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                <Bar yAxisId="left" dataKey="placements" name="Placements (Count)" fill="#6366f1" radius={[4, 4, 0, 0]} />
                <Line yAxisId="right" type="monotone" dataKey="avgSalaryLPA" name="Avg CTC (₹ LPA)" stroke="#10b981" strokeWidth={3} dot={{ r: 4 }} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Sectoral Candidates & Placement Share (1 col) */}
        <Card className="p-5 border-slate-200">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Industry Sector Share</h3>
              <p className="text-xs text-slate-500 mt-0.5">Enrollment distribution</p>
            </div>
          </div>

          <div className="h-44">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={sectorBreakdown}
                  cx="50%"
                  cy="50%"
                  innerRadius={45}
                  outerRadius={70}
                  paddingAngle={3}
                  dataKey="share"
                >
                  {sectorBreakdown.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Pie>
                <Tooltip formatter={(value: any) => [`${value}% Share`, 'Cohort Share']} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="space-y-1.5 mt-2 pt-2 border-t border-slate-100 text-xs">
            {sectorBreakdown.map((sec, i) => (
              <div key={i} className="flex items-center justify-between text-[11px]">
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: sec.fill }} />
                  <span className="text-slate-700 font-medium truncate max-w-[130px]">{sec.name}</span>
                </div>
                <span className="font-bold text-slate-900">{sec.share}% ({sec.placements.toLocaleString()})</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Strategic Callouts: Skill Gap vs Readiness & Integrity Check */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="p-4 border-indigo-100 bg-indigo-50/40 space-y-2.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-indigo-600" />
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Skill Gap Calibration</h4>
            </div>
            <Badge variant="primary">Gap Index: 28.2/100</Badge>
          </div>
          <p className="text-xs text-slate-700 leading-relaxed">
            High market demand is driving significant talent deficits in <strong>Electric Vehicle (EV) Diagnostics</strong> (+42.2% gap) and <strong>Cloud DevOps</strong> (+38.2% gap). Upskilling roadmaps have been updated with adaptive micro-curriculum to bridge competency gaps before candidate certification.
          </p>
          <div className="pt-1">
            <Button size="sm" variant="outline" onClick={() => onNavigateTab('skill_intelligence')} className="text-xs bg-white">
              View Detailed Supply vs Demand Analysis →
            </Button>
          </div>
        </Card>

        <Card className="p-4 border-emerald-100 bg-emerald-50/40 space-y-2.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Quality Assurance & Fraud Heuristics</h4>
            </div>
            <Badge variant="success">91.5% EPFO Remittance Verified</Badge>
          </div>
          <p className="text-xs text-slate-700 leading-relaxed">
            Automated rule-based heuristics continuously cross-audit candidate biometric logs, training duration, and wage credits against simulated EPFO registers. <strong>{openAnomalies.length} potential anomalies</strong> currently require administrator verification.
          </p>
          <div className="pt-1">
            <Button size="sm" variant="outline" onClick={() => onNavigateTab('anomaly_detection')} className="text-xs bg-white text-rose-700 border-rose-200 hover:bg-rose-50">
              Open Anomaly Audit Desk ({openAnomalies.length} Flagged) →
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
};
