import React, { useState } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { LocalDbService } from '../../../lib/supabase';
import { Button, Card, Badge } from '../../ui';
import { formatCurrency } from '../../../lib/utils';
import { AnalyticsOverviewView } from './views/AnalyticsOverviewView';
import { DistrictAnalyticsView } from './views/DistrictAnalyticsView';
import { SkillSupplyDemandView } from './views/SkillSupplyDemandView';
import { SkillGapIntelligenceView } from './views/SkillGapIntelligenceView';
import { TrainingCenterPerformanceView } from './views/TrainingCenterPerformanceView';
import { EmploymentOutcomeView } from './views/EmploymentOutcomeView';
import { AnomalyDetectionView } from './views/AnomalyDetectionView';
import { ReportsExportView } from './views/ReportsExportView';
import { ProgramImpactView } from './views/ProgramImpactView';
import {
  Sliders,
  TrendingUp,
  Sparkles,
  Award,
  Users,
  CheckCircle2,
  Building2,
  DollarSign,
  Briefcase
} from 'lucide-react';

interface OrganizationAdminDashboardProps {
  activeTab: string;
  onTabChange: (tabId: string) => void;
}

export const OrganizationAdminDashboard: React.FC<OrganizationAdminDashboardProps> = ({
  activeTab,
  onTabChange
}) => {
  const { organization } = useAuth();
  const candidates = LocalDbService.getProfiles(organization?.id).filter(p => p.role === 'candidate');

  // Funding Simulator State
  const [budgetAllocation, setBudgetAllocation] = useState<number>(50); // in Crores
  const [evSectorWeight, setEvSectorWeight] = useState<number>(40);
  const [itSectorWeight, setItSectorWeight] = useState<number>(40);
  const [solarSectorWeight, setSolarSectorWeight] = useState<number>(20);

  // Computed ROI Simulator metrics
  const projectedEnrollees = Math.round(budgetAllocation * 380);
  const projectedPlacements = Math.round(projectedEnrollees * 0.82);
  const estimatedEconomicValue = formatCurrency(projectedPlacements * 480000);

  return (
    <div className="space-y-6">
      {/* 1. Core Analytics Dashboard */}
      {activeTab === 'dashboard' && (
        <AnalyticsOverviewView onNavigateTab={onTabChange} />
      )}

      {/* 2. District Analytics */}
      {activeTab === 'district_analytics' && (
        <DistrictAnalyticsView />
      )}

      {/* 3. Skill Gap Intelligence & Market Supply-Demand */}
      {activeTab === 'skill_intelligence' && (
        <SkillGapIntelligenceView />
      )}
      {activeTab === 'job_demand' && (
        <SkillSupplyDemandView />
      )}

      {/* 4. Training Centers Performance */}
      {activeTab === 'training_centers' && (
        <TrainingCenterPerformanceView />
      )}

      {/* 5. Employment Outcomes & Retention */}
      {(activeTab === 'employment_retention' || activeTab === 'placement_analytics') && (
        <EmploymentOutcomeView />
      )}

      {/* 6. Fraud & Anomaly Detection */}
      {activeTab === 'anomaly_detection' && (
        <AnomalyDetectionView />
      )}

      {/* 7. Reports & Data Export */}
      {activeTab === 'reports' && (
        <ReportsExportView />
      )}

      {/* 8. Statewide Trainee Database */}
      {activeTab === 'candidates' && (
        <div className="space-y-5">
          <div className="p-5 rounded-xl border border-slate-200 bg-white shadow-2xs flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2">
                <Badge variant="purple">Statewide Trainee Database</Badge>
                <span className="text-xs text-slate-500 font-medium">Verified Identity Records</span>
              </div>
              <h2 className="text-xl font-bold text-slate-900 mt-1">Enrolled Trainee Cohorts & Competency Roster</h2>
              <p className="text-xs text-slate-500 mt-0.5">Isolated tenant records with verified skill assessments and placement status</p>
            </div>
            <Badge variant="success">{candidates.length} Registered Candidates</Badge>
          </div>

          <div className="space-y-2.5">
            {candidates.map(cand => (
              <Card key={cand.id} className="p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-slate-200">
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="text-sm font-bold text-slate-900">{cand.full_name}</h4>
                    <Badge variant="primary">Readiness: 86%</Badge>
                    <Badge variant="success">NSQF Certified</Badge>
                  </div>
                  <p className="text-xs text-slate-500 mt-1">
                    {cand.email} • {cand.district || 'Pune'}, Maharashtra • Trainee ID: <span className="font-mono text-slate-600">{cand.id}</span>
                  </p>
                </div>

                <div className="flex items-center gap-2.5 text-xs">
                  <span className="px-2.5 py-1 rounded bg-emerald-50 text-emerald-700 font-bold border border-emerald-200 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Verified Placed
                  </span>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* 9. Funding & Policy Simulator */}
      {activeTab === 'funding_simulator' && (
        <div className="space-y-5">
          <div className="p-5 rounded-xl border border-slate-200 bg-white shadow-2xs flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2">
                <Badge variant="purple">Macro Planning</Badge>
                <span className="text-xs text-slate-500 font-medium">Outcome-Based Budget Allocation</span>
              </div>
              <h2 className="text-xl font-bold text-slate-900 mt-1">
                Skilling Budget & Economic ROI Simulator
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Simulate budget allocation across priority industrial sectors and project economic output and employment retention gains
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
            <Card className="p-5 lg:col-span-1 space-y-4 border-slate-200">
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                <Sliders className="w-3.5 h-3.5 text-indigo-600" /> Allocation Parameters
              </h3>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
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

              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-600 font-medium">EV & Clean Mobility Weight</span>
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

              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
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

              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-600 font-medium">Solar & Agro-IoT Weight</span>
                  <span className="text-amber-700 font-bold">{solarSectorWeight}%</span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="80"
                  value={solarSectorWeight}
                  onChange={e => setSolarSectorWeight(Number(e.target.value))}
                  className="w-full accent-amber-600"
                />
              </div>
            </Card>

            <Card className="p-5 lg:col-span-2 space-y-4 border-slate-200 flex flex-col justify-between">
              <div>
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                  <TrendingUp className="w-3.5 h-3.5 text-emerald-600" /> Projected Socio-Economic Outcomes
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-4">
                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                    <span className="text-xs font-semibold text-slate-500">Forecasted Trainees</span>
                    <div className="text-2xl font-bold text-slate-900 mt-1">{projectedEnrollees.toLocaleString()}</div>
                    <div className="text-[11px] text-slate-400 mt-0.5">Across approved ITIs</div>
                  </div>

                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                    <span className="text-xs font-semibold text-slate-500">Forecasted Placements</span>
                    <div className="text-2xl font-bold text-emerald-700 mt-1">{projectedPlacements.toLocaleString()}</div>
                    <div className="text-[11px] text-emerald-600 font-medium mt-0.5">82% Conversion Est.</div>
                  </div>

                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                    <span className="text-xs font-semibold text-slate-500">Annual Wage Output</span>
                    <div className="text-2xl font-bold text-indigo-700 mt-1">{estimatedEconomicValue}</div>
                    <div className="text-[11px] text-indigo-600 font-medium mt-0.5">Direct state tax ROI</div>
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-indigo-50/70 border border-indigo-200 text-xs text-indigo-950 leading-relaxed">
                <strong>Policy Simulation Recommendation:</strong> Channeling an additional ₹15 Crores towards EV battery assembly hubs in Chhatrapati Sambhajinagar and Pune yields the highest marginal career longevity (+8.6% 12-month retention), directly addressing high automotive manufacturer hiring mandates.
              </div>
            </Card>
          </div>
        </div>
      )}

      {/* 10. Skilling Program Impact Dashboard & Evaluation */}
      {(activeTab === 'program_impact' || activeTab === 'ai_insights') && (
        <ProgramImpactView />
      )}
    </div>
  );
};
