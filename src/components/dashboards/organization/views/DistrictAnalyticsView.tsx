import React, { useState, useMemo } from 'react';
import { AnalyticsService } from '../../../../lib/analyticsService';
import { DistrictAnalytics } from '../../../../types';
import { Card, Badge, Button, Input } from '../../../ui';
import { formatCurrency, formatPercentage } from '../../../../lib/utils';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
  LineChart,
  Line
} from 'recharts';
import {
  MapPin,
  Search,
  SlidersHorizontal,
  TrendingUp,
  Users,
  Briefcase,
  CheckCircle2,
  Clock,
  Sparkles,
  ArrowRightLeft,
  Filter,
  BarChart3,
  Layers
} from 'lucide-react';

export const DistrictAnalyticsView: React.FC = () => {
  const allDistricts = useMemo(() => AnalyticsService.getDistrictAnalytics(), []);

  // Filter and Search States
  const [selectedDistrict, setSelectedDistrict] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortBy, setSortBy] = useState<'total_candidates' | 'placed_count' | 'placement_rate' | 'retention_rate_6m'>('placed_count');

  // District Comparison Mode State
  const [compareMode, setCompareMode] = useState<boolean>(false);
  const [compareDistrictA, setCompareDistrictA] = useState<string>('Pune');
  const [compareDistrictB, setCompareDistrictB] = useState<string>('Nagpur');

  // Filtered Districts
  const filteredDistricts = useMemo(() => {
    return allDistricts.filter(d => {
      const matchesDistrict = selectedDistrict === 'all' || d.district.toLowerCase() === selectedDistrict.toLowerCase();
      const matchesSearch =
        searchQuery.trim() === '' ||
        d.district.toLowerCase().includes(searchQuery.toLowerCase()) ||
        d.top_skill_demanded.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesDistrict && matchesSearch;
    }).sort((a, b) => {
      if (sortBy === 'placement_rate') {
        const rateA = a.placement_rate ?? (a.placed_count / a.trained_count);
        const rateB = b.placement_rate ?? (b.placed_count / b.trained_count);
        return rateB - rateA;
      }
      return (b[sortBy] ?? 0) - (a[sortBy] ?? 0);
    });
  }, [allDistricts, selectedDistrict, searchQuery, sortBy]);

  // Comparison Objects
  const distAObj = allDistricts.find(d => d.district.toLowerCase() === compareDistrictA.toLowerCase()) || allDistricts[0];
  const distBObj = allDistricts.find(d => d.district.toLowerCase() === compareDistrictB.toLowerCase()) || allDistricts[1];

  // Chart Comparison Data
  const chartData = useMemo(() => {
    return filteredDistricts.map(d => ({
      district: d.district,
      enrolled: d.total_candidates,
      trained: d.trained_count,
      placed: d.placed_count,
      placementRate: d.placement_rate ?? Math.round((d.placed_count / d.trained_count) * 100),
      retention6m: d.retention_rate_6m
    }));
  }, [filteredDistricts]);

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="p-5 rounded-xl border border-slate-200 bg-white shadow-2xs flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Badge variant="purple">Spatial Analytics</Badge>
            <span className="text-xs text-slate-500 font-medium">Statewide District Breakdown</span>
          </div>
          <h1 className="text-xl font-bold text-slate-900 mt-1">
            Maharashtra District Skilling & Placement Intelligence
          </h1>
          <p className="text-xs text-slate-500 mt-0.5 max-w-3xl">
            Spatial distribution of candidate intake, training completion rates, placement velocity, verified longitudinal retention, and regional skill demand clusters across Maharashtra.
          </p>
        </div>

        <Button
          size="sm"
          variant={compareMode ? 'primary' : 'outline'}
          leftIcon={<ArrowRightLeft className="w-3.5 h-3.5" />}
          onClick={() => setCompareMode(!compareMode)}
          id="btn-toggle-district-compare"
        >
          {compareMode ? 'Exit Comparison Mode' : 'Compare 2 Districts'}
        </Button>
      </div>

      {/* District Comparison Section (when active) */}
      {compareMode && (
        <Card className="p-5 border-indigo-200 bg-indigo-50/30 space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-indigo-100">
            <div>
              <h3 className="text-sm font-bold text-indigo-950 flex items-center gap-2">
                <ArrowRightLeft className="w-4 h-4 text-indigo-600" /> Side-by-Side District Benchmark
              </h3>
              <p className="text-xs text-indigo-700 mt-0.5">
                Compare skilling pipeline efficiency and retention outcomes between two regions
              </p>
            </div>

            <div className="flex items-center gap-2 text-xs">
              <span className="text-slate-600 font-medium">District A:</span>
              <select
                value={compareDistrictA}
                onChange={e => setCompareDistrictA(e.target.value)}
                className="bg-white border border-slate-300 rounded px-2.5 py-1 font-semibold text-slate-900"
              >
                {allDistricts.map(d => (
                  <option key={d.id} value={d.district} disabled={d.district === compareDistrictB}>
                    {d.district}
                  </option>
                ))}
              </select>

              <span className="text-slate-400 font-bold px-1">vs</span>

              <span className="text-slate-600 font-medium">District B:</span>
              <select
                value={compareDistrictB}
                onChange={e => setCompareDistrictB(e.target.value)}
                className="bg-white border border-slate-300 rounded px-2.5 py-1 font-semibold text-slate-900"
              >
                {allDistricts.map(d => (
                  <option key={d.id} value={d.district} disabled={d.district === compareDistrictA}>
                    {d.district}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* District A Card */}
            <Card className="p-4 bg-white border-slate-200 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-xs">
                    A
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">{distAObj.district}</h4>
                    <p className="text-[11px] text-slate-500">{distAObj.state}</p>
                  </div>
                </div>
                <Badge variant="primary">{distAObj.top_skill_demanded}</Badge>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs pt-2 border-t border-slate-100">
                <div className="p-2 rounded bg-slate-50 border border-slate-100">
                  <span className="text-slate-500">Enrolled Trainees</span>
                  <div className="text-base font-bold text-slate-900">{distAObj.total_candidates.toLocaleString()}</div>
                </div>
                <div className="p-2 rounded bg-slate-50 border border-slate-100">
                  <span className="text-slate-500">Trained Completed</span>
                  <div className="text-base font-bold text-purple-700">{distAObj.trained_count.toLocaleString()}</div>
                </div>
                <div className="p-2 rounded bg-slate-50 border border-slate-100">
                  <span className="text-slate-500">Placed Candidates</span>
                  <div className="text-base font-bold text-emerald-700">{distAObj.placed_count.toLocaleString()}</div>
                </div>
                <div className="p-2 rounded bg-slate-50 border border-slate-100">
                  <span className="text-slate-500">Placement Rate</span>
                  <div className="text-base font-bold text-emerald-700">{distAObj.placement_rate}%</div>
                </div>
                <div className="p-2 rounded bg-slate-50 border border-slate-100">
                  <span className="text-slate-500">6-Month Retention</span>
                  <div className="text-base font-bold text-sky-700">{distAObj.retention_rate_6m}%</div>
                </div>
                <div className="p-2 rounded bg-slate-50 border border-slate-100">
                  <span className="text-slate-500">Average Annual CTC</span>
                  <div className="text-base font-bold text-slate-900">{formatCurrency(distAObj.average_salary ?? 450000)}</div>
                </div>
              </div>
            </Card>

            {/* District B Card */}
            <Card className="p-4 bg-white border-slate-200 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-teal-100 text-teal-700 flex items-center justify-center font-bold text-xs">
                    B
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">{distBObj.district}</h4>
                    <p className="text-[11px] text-slate-500">{distBObj.state}</p>
                  </div>
                </div>
                <Badge variant="success">{distBObj.top_skill_demanded}</Badge>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs pt-2 border-t border-slate-100">
                <div className="p-2 rounded bg-slate-50 border border-slate-100">
                  <span className="text-slate-500">Enrolled Trainees</span>
                  <div className="text-base font-bold text-slate-900">{distBObj.total_candidates.toLocaleString()}</div>
                </div>
                <div className="p-2 rounded bg-slate-50 border border-slate-100">
                  <span className="text-slate-500">Trained Completed</span>
                  <div className="text-base font-bold text-purple-700">{distBObj.trained_count.toLocaleString()}</div>
                </div>
                <div className="p-2 rounded bg-slate-50 border border-slate-100">
                  <span className="text-slate-500">Placed Candidates</span>
                  <div className="text-base font-bold text-emerald-700">{distBObj.placed_count.toLocaleString()}</div>
                </div>
                <div className="p-2 rounded bg-slate-50 border border-slate-100">
                  <span className="text-slate-500">Placement Rate</span>
                  <div className="text-base font-bold text-emerald-700">{distBObj.placement_rate}%</div>
                </div>
                <div className="p-2 rounded bg-slate-50 border border-slate-100">
                  <span className="text-slate-500">6-Month Retention</span>
                  <div className="text-base font-bold text-sky-700">{distBObj.retention_rate_6m}%</div>
                </div>
                <div className="p-2 rounded bg-slate-50 border border-slate-100">
                  <span className="text-slate-500">Average Annual CTC</span>
                  <div className="text-base font-bold text-slate-900">{formatCurrency(distBObj.average_salary ?? 450000)}</div>
                </div>
              </div>
            </Card>
          </div>
        </Card>
      )}

      {/* Filter and Search Bar */}
      <Card className="p-4 border-slate-200 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        <div className="flex-1 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by district name or in-demand skill..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-indigo-500 focus:bg-white"
            />
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500 font-medium shrink-0">District:</span>
            <select
              value={selectedDistrict}
              onChange={e => setSelectedDistrict(e.target.value)}
              className="text-xs bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-slate-800 font-medium focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
            >
              <option value="all">All Districts (Maharashtra)</option>
              {allDistricts.map(d => (
                <option key={d.id} value={d.district}>
                  {d.district}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-500 font-medium shrink-0">Sort By:</span>
          <select
            value={sortBy}
            onChange={e => setSortBy(e.target.value as any)}
            className="text-xs bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-slate-800 font-medium focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
          >
            <option value="placed_count">Placed Candidates (High to Low)</option>
            <option value="total_candidates">Total Enrolled (High to Low)</option>
            <option value="placement_rate">Placement Rate (%)</option>
            <option value="retention_rate_6m">6-Month Retention (%)</option>
          </select>
        </div>
      </Card>

      {/* Interactive Charts: District Skilling Funnel & Retention Matrix */}
      <Card className="p-5 border-slate-200">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-indigo-600" /> District Skilling & Placement Conversion Matrix
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Enrolled vs Trained vs Placed candidate counts across filtered Maharashtra districts
            </p>
          </div>
          <Badge variant="primary">{filteredDistricts.length} Districts Analyzed</Badge>
        </div>

        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 10, right: 20, left: -10, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="district" angle={-25} textAnchor="end" interval={0} stroke="#94a3b8" tick={{ fill: '#475569', fontSize: 10 }} />
              <YAxis stroke="#94a3b8" tick={{ fill: '#475569', fontSize: 11 }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#ffffff',
                  borderColor: '#e2e8f0',
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                  fontSize: '12px'
                }}
              />
              <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '15px' }} />
              <Bar dataKey="enrolled" name="Enrolled Trainees" fill="#6366f1" radius={[4, 4, 0, 0]} />
              <Bar dataKey="trained" name="Trained Completed" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
              <Bar dataKey="placed" name="Verified Placements" fill="#10b981" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>

      {/* District Detail Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredDistricts.map(d => (
          <Card key={d.id} className="p-4 border-slate-200 flex flex-col justify-between space-y-3">
            <div>
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-indigo-600 shrink-0" /> {d.district}
                  </h4>
                  <p className="text-[11px] text-slate-500 mt-0.5">Top Demand: {d.top_skill_demanded}</p>
                </div>
                <Badge variant={d.placement_rate && d.placement_rate >= 80 ? 'success' : 'primary'}>
                  {d.placement_rate}% Placed
                </Badge>
              </div>

              {/* Metrics mini grid */}
              <div className="grid grid-cols-2 gap-2 mt-3 pt-3 border-t border-slate-100 text-xs">
                <div>
                  <span className="text-[11px] text-slate-500">Enrolled:</span>
                  <div className="font-bold text-slate-900">{d.total_candidates.toLocaleString()}</div>
                </div>
                <div>
                  <span className="text-[11px] text-slate-500">Trained:</span>
                  <div className="font-bold text-purple-700">{d.trained_count.toLocaleString()}</div>
                </div>
                <div>
                  <span className="text-[11px] text-slate-500">Placed:</span>
                  <div className="font-bold text-emerald-700">{d.placed_count.toLocaleString()}</div>
                </div>
                <div>
                  <span className="text-[11px] text-slate-500">6M Retention:</span>
                  <div className="font-bold text-sky-700">{d.retention_rate_6m}%</div>
                </div>
              </div>
            </div>

            <div className="pt-2.5 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
              <span>Avg Salary: <strong className="text-slate-900">{formatCurrency(d.average_salary ?? 450000)}</strong></span>
              <span className="text-[11px] text-indigo-600 font-semibold">Gap Index: {d.skill_gap_index}/100</span>
            </div>
          </Card>
        ))}
      </div>

      {/* Summary Table */}
      <Card className="p-0 overflow-hidden border border-slate-200">
        <div className="px-4 py-3 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
            Comprehensive District Skilling Summary Table
          </h3>
          <span className="text-[11px] text-slate-500 font-medium">
            Showing {filteredDistricts.length} Maharashtra District Jurisdictions
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-100/60 border-b border-slate-200 text-slate-600 font-semibold">
              <tr>
                <th className="py-2.5 px-3.5">District</th>
                <th className="py-2.5 px-3.5">Enrolled</th>
                <th className="py-2.5 px-3.5">Trained</th>
                <th className="py-2.5 px-3.5">Placed</th>
                <th className="py-2.5 px-3.5">Placement Rate</th>
                <th className="py-2.5 px-3.5">6M Retention Rate</th>
                <th className="py-2.5 px-3.5">Avg Annual CTC</th>
                <th className="py-2.5 px-3.5">Primary In-Demand Skill</th>
                <th className="py-2.5 px-3.5">Skill Gap Index</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filteredDistricts.map(d => (
                <tr key={d.id} className="hover:bg-slate-50 transition-colors">
                  <td className="py-2.5 px-3.5 font-bold text-slate-900 flex items-center gap-1.5">
                    <MapPin className="w-3 h-3 text-indigo-600" /> {d.district}
                  </td>
                  <td className="py-2.5 px-3.5 font-medium">{d.total_candidates.toLocaleString()}</td>
                  <td className="py-2.5 px-3.5 text-purple-700 font-medium">{d.trained_count.toLocaleString()}</td>
                  <td className="py-2.5 px-3.5 font-bold text-emerald-700">{d.placed_count.toLocaleString()}</td>
                  <td className="py-2.5 px-3.5 font-bold text-emerald-700">
                    <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
                      {d.placement_rate}%
                    </span>
                  </td>
                  <td className="py-2.5 px-3.5 font-bold text-sky-700">{d.retention_rate_6m}%</td>
                  <td className="py-2.5 px-3.5 font-medium">{formatCurrency(d.average_salary ?? 450000)}</td>
                  <td className="py-2.5 px-3.5 text-slate-800">{d.top_skill_demanded}</td>
                  <td className="py-2.5 px-3.5">
                    <span className={`font-bold ${d.skill_gap_index <= 25 ? 'text-emerald-700' : d.skill_gap_index <= 35 ? 'text-amber-700' : 'text-rose-700'}`}>
                      {d.skill_gap_index}/100
                    </span>
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
