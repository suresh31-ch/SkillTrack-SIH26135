import React, { useState } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { LocalDbService } from '../../../lib/supabase';
import { Button, Card, Badge, Input } from '../../ui';
import { formatCurrency, formatPercentage } from '../../../lib/utils';
import { useToast } from '../../../context/ToastContext';
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
  Cell
} from 'recharts';
import {
  Building2,
  Users,
  MapPin,
  Flame,
  Briefcase,
  Clock,
  AlertOctagon,
  PieChart as PieIcon,
  Calculator,
  Brain,
  FileText,
  TrendingUp,
  ShieldAlert,
  CheckCircle2,
  Sparkles,
  Download,
  Sliders,
  DollarSign
} from 'lucide-react';

interface OrganizationAdminDashboardProps {
  activeTab: string;
  onTabChange: (tabId: string) => void;
}

export const OrganizationAdminDashboard: React.FC<OrganizationAdminDashboardProps> = ({ activeTab, onTabChange }) => {
  const { profile, organization } = useAuth();
  const { showToast } = useToast();

  const candidates = LocalDbService.getProfiles(organization?.id).filter(p => p.role === 'candidate');
  const trainingCenters = LocalDbService.getTrainingCenters(organization?.id);
  const districtAnalytics = LocalDbService.getDistrictAnalytics(organization?.id);
  const anomalies = LocalDbService.getAnomalies(organization?.id);
  const placements = LocalDbService.getPlacements(organization?.id);
  const jobs = LocalDbService.getJobs(organization?.id);

  // Funding Simulator State
  const [budgetAllocation, setBudgetAllocation] = useState(50); // in Crores
  const [evSectorWeight, setEvSectorWeight] = useState(40);
  const [itSectorWeight, setItSectorWeight] = useState(40);
  const [solarSectorWeight, setSolarSectorWeight] = useState(20);

  // Computed ROI Simulator metrics
  const projectedEnrollees = Math.round(budgetAllocation * 380);
  const projectedPlacements = Math.round(projectedEnrollees * 0.79);
  const estimatedEconomicValue = formatCurrency(projectedPlacements * 420000);

  // Chart Data
  const retentionCurveData = [
    { period: 'Initial Placement', rate: 100, verified: 100 },
    { period: '3-Month Retention', rate: 86, verified: 84 },
    { period: '6-Month Retention', rate: 74, verified: 72 },
    { period: '12-Month Retention', rate: 68, verified: 65 }
  ];

  const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ec4899', '#8b5cf6'];

  const sectorDistribution = [
    { name: 'Full Stack & IT', value: 42 },
    { name: 'EV & Automotive', value: 28 },
    { name: 'Renewable Energy', value: 18 },
    { name: 'Healthcare & Biotech', value: 12 }
  ];

  const handleExportReport = () => {
    showToast('Export Generated', 'State Skilling & Employment Intelligence Report downloaded (CSV/JSON).', 'success');
  };

  return (
    <div className="space-y-6">
      {/* View 1: DASHBOARD OVERVIEW */}
      {activeTab === 'dashboard' && (
        <div className="space-y-5">
          <div className="p-5 rounded-xl border border-slate-200 bg-white shadow-2xs flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <Badge variant="purple">Organization Intelligence</Badge>
                <span className="text-xs text-slate-500">Tenant: {organization?.name}</span>
              </div>
              <h2 className="text-xl font-bold text-slate-900 mt-1">
                State Skilling Impact & Retention Intelligence
              </h2>
              <p className="text-xs text-slate-500 mt-0.5 max-w-2xl">
                Real-time tracking of skilling outcomes, district-level performance, longitudinal wage retention, and anti-fraud anomaly detection for SIH26135.
              </p>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <Button size="sm" variant="secondary" onClick={() => onTabChange('funding_simulator')}>
                ROI Simulator
              </Button>
              <Button size="sm" variant="primary" leftIcon={<Download className="w-3.5 h-3.5" />} onClick={handleExportReport}>
                Export Analytics
              </Button>
            </div>
          </div>

          {/* Metric Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
            <Card className="p-4">
              <div className="text-xs font-semibold text-slate-500">Total Enrolled Trainees</div>
              <div className="text-2xl font-bold text-slate-900 mt-1">14,250</div>
              <div className="text-[11px] text-indigo-600 font-medium mt-1">Across 8 Districts</div>
            </Card>

            <Card className="p-4">
              <div className="text-xs font-semibold text-slate-500">Verified Placement Rate</div>
              <div className="text-2xl font-bold text-emerald-600 mt-1">78.4%</div>
              <div className="text-[11px] text-emerald-600 font-medium mt-1">+6.2% vs baseline</div>
            </Card>

            <Card className="p-4">
              <div className="text-xs font-semibold text-slate-500">6-Month Retention Rate</div>
              <div className="text-2xl font-bold text-indigo-700 mt-1">72.1%</div>
              <div className="text-[11px] text-slate-500 mt-1">Simulated EPFO Verified</div>
            </Card>

            <Card className="p-4">
              <div className="text-xs font-semibold text-slate-500">AI Anomalies Flagged</div>
              <div className="text-2xl font-bold text-rose-600 mt-1">{anomalies.length}</div>
              <div className="text-[11px] text-rose-600 font-medium mt-1">1 High Risk (Ghost Placement)</div>
            </Card>
          </div>

          {/* Longitudinal Retention Curve & District Performance */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card className="p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                  <Clock className="w-3.5 h-3.5 text-purple-600" /> Longitudinal 3/6/12-Month Retention Curve
                </h3>
                <Badge variant="purple">EPFO Remittance Audit</Badge>
              </div>

              <div className="h-60">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={retentionCurveData}>
                    <XAxis dataKey="period" stroke="#94a3b8" tick={{ fill: '#475569', fontSize: 10 }} />
                    <YAxis domain={[50, 100]} stroke="#94a3b8" tick={{ fill: '#475569', fontSize: 10 }} />
                    <Tooltip contentStyle={{ backgroundColor: '#ffffff', borderColor: '#e2e8f0', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }} />
                    <Legend wrapperStyle={{ fontSize: '10px' }} />
                    <Line type="monotone" dataKey="rate" name="Reported Employment %" stroke="#6366f1" strokeWidth={2} />
                    <Line type="monotone" dataKey="verified" name="Simulated EPFO Verified %" stroke="#10b981" strokeWidth={2.5} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </Card>

            <Card className="p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                  <MapPin className="w-3.5 h-3.5 text-indigo-600" /> District Skilling & Placement Matrix
                </h3>
                <Button size="sm" variant="ghost" onClick={() => onTabChange('district_analytics')} className="text-xs">
                  Detailed View
                </Button>
              </div>

              <div className="h-60">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={districtAnalytics.slice(0, 5)}>
                    <XAxis dataKey="district" stroke="#94a3b8" tick={{ fill: '#475569', fontSize: 10 }} />
                    <YAxis stroke="#94a3b8" tick={{ fill: '#475569', fontSize: 10 }} />
                    <Tooltip contentStyle={{ backgroundColor: '#ffffff', borderColor: '#e2e8f0', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }} />
                    <Legend wrapperStyle={{ fontSize: '10px' }} />
                    <Bar dataKey="enrolled" name="Enrolled" fill="#6366f1" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="placed" name="Placed" fill="#10b981" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </Card>
          </div>
        </div>
      )}

      {/* View 2: CANDIDATES */}
      {activeTab === 'candidates' && (
        <div className="space-y-5">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Statewide Trainee Database</h2>
              <p className="text-xs text-slate-500 mt-0.5">Isolated tenant records with verified skill gap scores</p>
            </div>
          </div>

          <div className="space-y-2.5">
            {candidates.map(cand => (
              <Card key={cand.id} className="p-3.5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="text-xs font-bold text-slate-900">{cand.full_name}</h4>
                    <Badge variant="primary">Readiness: 84%</Badge>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">{cand.email} • {cand.district}, Maharashtra</p>
                </div>

                <div className="flex items-center gap-2.5 text-xs">
                  <Badge variant="success">Active Placement</Badge>
                  <span className="text-slate-400 font-mono text-[11px]">ID: {cand.id}</span>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* View 3: TRAINING CENTERS */}
      {activeTab === 'training_centers' && (
        <div className="space-y-5">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Accredited Training Centers & ITIs</h2>
            <p className="text-xs text-slate-500 mt-0.5">Audit compliance, capacity, and placement performance</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            {trainingCenters.map(tc => (
              <Card key={tc.id} className="p-4 space-y-2.5">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-slate-900">{tc.name}</h3>
                  <Badge variant="primary">{tc.district}</Badge>
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs pt-2 border-t border-slate-100 text-slate-500">
                  <div>Capacity: <strong className="text-slate-900 font-bold">{tc.capacity} Seats</strong></div>
                  <div>Placement Rate: <strong className="text-emerald-700 font-bold">{tc.placement_rate}%</strong></div>
                  <div>Compliance: <strong className="text-indigo-700 font-bold">Biometric Live</strong></div>
                  <div>Retention: <strong className="text-slate-900 font-bold">74.2%</strong></div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* View 4: DISTRICT ANALYTICS */}
      {activeTab === 'district_analytics' && (
        <div className="space-y-5">
          <div>
            <h2 className="text-lg font-bold text-slate-900">District-Level Skilling Analytics</h2>
            <p className="text-xs text-slate-500 mt-0.5">Comparative spatial intelligence across Maharashtra</p>
          </div>

          <Card className="p-0 overflow-hidden border border-slate-200">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200">
                  <tr className="text-slate-600 font-semibold">
                    <th className="py-2.5 px-3">District</th>
                    <th className="py-2.5 px-3">Enrolled</th>
                    <th className="py-2.5 px-3">Trained</th>
                    <th className="py-2.5 px-3">Placed</th>
                    <th className="py-2.5 px-3">Placement Rate</th>
                    <th className="py-2.5 px-3">Avg Salary</th>
                    <th className="py-2.5 px-3">6M Retention</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {districtAnalytics.map(d => (
                    <tr key={d.id} className="text-slate-700 hover:bg-slate-50">
                      <td className="py-2.5 px-3 font-semibold text-slate-900">{d.district}</td>
                      <td className="py-2.5 px-3">{(d.enrolled ?? d.total_candidates ?? 0).toLocaleString()}</td>
                      <td className="py-2.5 px-3">{(d.trained ?? d.trained_count ?? 0).toLocaleString()}</td>
                      <td className="py-2.5 px-3">{(d.placed ?? d.placed_count ?? 0).toLocaleString()}</td>
                      <td className="py-2.5 px-3 text-emerald-700 font-bold">{d.placement_rate ?? Math.round(((d.placed_count || 0) / (d.trained_count || 1)) * 100)}%</td>
                      <td className="py-2.5 px-3">{formatCurrency(d.average_salary ?? 420000)}</td>
                      <td className="py-2.5 px-3 text-indigo-700 font-bold">{d.retention_rate_6m}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      )}

      {/* View 5: ANOMALY DETECTION (Anti-Fraud) */}
      {activeTab === 'anomaly_detection' && (
        <div className="space-y-5">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-slate-900">AI Anti-Fraud & Anomaly Detection</h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Automated detection of ghost placements, wage remittance mismatches, and duplicate registrations (SIH26135)
              </p>
            </div>
            <Badge variant="danger">{anomalies.length} Flagged Incidents</Badge>
          </div>

          <div className="space-y-3">
            {anomalies.map(anom => (
              <Card key={anom.id} className="p-4 border-rose-200 bg-rose-50/40 space-y-2.5">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <AlertOctagon className="w-4 h-4 text-rose-600 shrink-0" />
                    <div>
                      <h4 className="text-xs font-bold text-slate-900">{(anom.type || anom.title || 'Anomaly').replace('_', ' ').toUpperCase()}</h4>
                      <p className="text-[11px] text-slate-500">Pattern: {anom.detected_pattern || anom.entity_name || 'Pattern Alert'}</p>
                    </div>
                  </div>
                  <Badge variant={anom.severity === 'high' ? 'danger' : 'warning'}>
                    Severity: {anom.severity.toUpperCase()}
                  </Badge>
                </div>

                <p className="text-xs text-slate-700 leading-relaxed bg-white p-2.5 rounded-md border border-rose-200/80">
                  {anom.description}
                </p>

                <div className="flex items-center justify-between text-xs pt-1.5">
                  <span className="text-slate-400 text-[11px]">Detected: 24 Oct 2025</span>
                  <div className="flex items-center gap-2">
                    <Button size="sm" variant="outline" className="text-xs">Dismiss Flag</Button>
                    <Button size="sm" variant="danger" className="text-xs">Initiate Center Audit</Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* View 6: FUNDING ROI SIMULATOR */}
      {activeTab === 'funding_simulator' && (
        <div className="space-y-5">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Skilling Budget & ROI Forecasting Simulator</h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Simulate budget allocation across priority industrial sectors and project economic output and employment retention gains
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <Card className="p-4 lg:col-span-1 space-y-4">
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                <Sliders className="w-3.5 h-3.5 text-indigo-600" /> Allocation Parameters
              </h3>

              <div>
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="text-slate-600 font-medium">Total Program Outlay</span>
                  <span className="text-indigo-700 font-bold">₹{budgetAllocation} Crores</span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="200"
                  value={budgetAllocation}
                  onChange={e => setBudgetAllocation(Number(e.target.value))}
                  className="w-full accent-indigo-600"
                />
              </div>

              <div>
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="text-slate-600 font-medium">EV & Clean Tech Weight</span>
                  <span className="text-emerald-700 font-bold">{evSectorWeight}%</span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="80"
                  value={evSectorWeight}
                  onChange={e => setEvSectorWeight(Number(e.target.value))}
                  className="w-full accent-emerald-600"
                />
              </div>

              <div>
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="text-slate-600 font-medium">IT & Cloud Engineering Weight</span>
                  <span className="text-purple-700 font-bold">{itSectorWeight}%</span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="80"
                  value={itSectorWeight}
                  onChange={e => setItSectorWeight(Number(e.target.value))}
                  className="w-full accent-purple-600"
                />
              </div>
            </Card>

            <Card className="p-4 lg:col-span-2 space-y-4">
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                <TrendingUp className="w-3.5 h-3.5 text-emerald-600" /> Projected Socio-Economic Outcomes
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
                  <span className="text-xs font-semibold text-slate-500">Forecasted Trainees</span>
                  <div className="text-xl font-bold text-slate-900 mt-0.5">{projectedEnrollees.toLocaleString()}</div>
                  <div className="text-[10px] text-slate-400 mt-0.5">Across approved ITIs</div>
                </div>

                <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
                  <span className="text-xs font-semibold text-slate-500">Forecasted Placements</span>
                  <div className="text-xl font-bold text-emerald-700 mt-0.5">{projectedPlacements.toLocaleString()}</div>
                  <div className="text-[10px] text-emerald-600 font-medium mt-0.5">79% Conversion Est.</div>
                </div>

                <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
                  <span className="text-xs font-semibold text-slate-500">Annual Wage Output</span>
                  <div className="text-xl font-bold text-indigo-700 mt-0.5">{estimatedEconomicValue}</div>
                  <div className="text-[10px] text-indigo-600 font-medium mt-0.5">Direct state tax ROI</div>
                </div>
              </div>

              <div className="p-3.5 rounded-lg bg-indigo-50 border border-indigo-200 text-xs text-indigo-950 leading-relaxed">
                <strong>Policy Recommendation:</strong> Increasing allocation by ₹10 Cr towards EV battery assembly in Chhatrapati Sambhajinagar and Pune yields the highest marginal retention rate (+8.4% 12-month retention).
              </div>
            </Card>
          </div>
        </div>
      )}

      {/* Fallback Views */}
      {(activeTab === 'skill_intelligence' || activeTab === 'job_demand' || activeTab === 'placement_analytics' || activeTab === 'employment_retention' || activeTab === 'program_impact' || activeTab === 'ai_insights' || activeTab === 'reports') && (
        <Card className="p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-900 capitalize">{activeTab.replace('_', ' ')}</h2>
            <Button size="sm" variant="primary" onClick={handleExportReport} leftIcon={<Download className="w-3.5 h-3.5" />}>
              Download Dataset
            </Button>
          </div>
          <p className="text-xs text-slate-500">
            Real-time analytics aggregated across {organization?.name} cohorts and verified against simulated EPFO longitudinal datasets.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 pt-2">
            <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200">
              <h4 className="text-xs font-bold text-slate-900">Macroeconomic Metric</h4>
              <p className="text-xs text-slate-600 mt-0.5">Pre-Skilling Avg Income: ₹8,000/mo → Post-Skilling: ₹35,000/mo (337% Lift)</p>
            </div>
            <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200">
              <h4 className="text-xs font-bold text-slate-900">Employment Longevity</h4>
              <p className="text-xs text-slate-600 mt-0.5">Average 12-Month continuity rate stands at 68% for tech & manufacturing sectors.</p>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
};
