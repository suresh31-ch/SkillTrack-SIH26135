import React, { useState, useMemo } from 'react';
import { AnalyticsService } from '../../../../lib/analyticsService';
import { TrainingCenterPerformanceMetric } from '../../../../types';
import { Card, Badge, Button, Input } from '../../../ui';
import { formatCurrency, formatPercentage } from '../../../../lib/utils';
import {
  Building2,
  Search,
  SlidersHorizontal,
  Award,
  GraduationCap,
  Briefcase,
  Clock,
  ShieldCheck,
  AlertTriangle,
  ExternalLink,
  Mail,
  MapPin,
  CheckCircle2,
  X,
  FileText
} from 'lucide-react';

export const TrainingCenterPerformanceView: React.FC = () => {
  const allCenters = useMemo(() => AnalyticsService.getTrainingCenterPerformance(), []);

  // Filter and Sort States
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedDistrict, setSelectedDistrict] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [sortBy, setSortBy] = useState<keyof TrainingCenterPerformanceMetric>('placed');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  // Detail Modal State
  const [selectedCenter, setSelectedCenter] = useState<TrainingCenterPerformanceMetric | null>(null);

  const districts = useMemo(() => {
    const set = new Set(allCenters.map(c => c.district));
    return ['all', ...Array.from(set)];
  }, [allCenters]);

  // Filtered & Sorted Centers
  const filteredCenters = useMemo(() => {
    return allCenters.filter(c => {
      const matchDistrict = selectedDistrict === 'all' || c.district.toLowerCase() === selectedDistrict.toLowerCase();
      const matchStatus = selectedStatus === 'all' || c.audit_status === selectedStatus;
      const matchSearch =
        searchQuery.trim() === '' ||
        c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.district.toLowerCase().includes(searchQuery.toLowerCase());
      return matchDistrict && matchStatus && matchSearch;
    }).sort((a, b) => {
      const valA = a[sortBy] ?? 0;
      const valB = b[sortBy] ?? 0;
      if (typeof valA === 'string' && typeof valB === 'string') {
        return sortOrder === 'asc' ? valA.localeCompare(valB) : valB.localeCompare(valA);
      }
      return sortOrder === 'asc' ? (valA as number) - (valB as number) : (valB as number) - (valA as number);
    });
  }, [allCenters, selectedDistrict, selectedStatus, searchQuery, sortBy, sortOrder]);

  const handleSort = (field: keyof TrainingCenterPerformanceMetric) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('desc');
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="p-5 rounded-xl border border-slate-200 bg-white shadow-2xs flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Badge variant="purple">Institutional Quality</Badge>
            <span className="text-xs text-slate-500 font-medium">Accredited Skill Providers & ITIs</span>
          </div>
          <h1 className="text-xl font-bold text-slate-900 mt-1">
            Training Center Performance & Quality Assurance Scorecards
          </h1>
          <p className="text-xs text-slate-500 mt-0.5 max-w-3xl">
            Statewide audit metrics tracking training completion efficiency, NSQF certification rates, verified placement conversion, 6-month retention, and institutional compliance rankings.
          </p>
        </div>
      </div>

      {/* Summary KPI Mini Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
        <Card className="p-4 border-slate-200">
          <div className="text-xs font-semibold text-slate-500">Accredited Centers</div>
          <div className="text-2xl font-bold text-slate-900 mt-1">
            {allCenters.length} ITIs / Hubs
          </div>
          <div className="text-[11px] text-emerald-600 font-medium mt-1">
            Across 6 Administrative Zones
          </div>
        </Card>

        <Card className="p-4 border-slate-200">
          <div className="text-xs font-semibold text-slate-500">Avg Completion Rate</div>
          <div className="text-2xl font-bold text-purple-700 mt-1">
            90.3%
          </div>
          <div className="text-[11px] text-purple-600 font-medium mt-1">
            Biometric Log Verified
          </div>
        </Card>

        <Card className="p-4 border-slate-200">
          <div className="text-xs font-semibold text-slate-500">Avg Placement Conversion</div>
          <div className="text-2xl font-bold text-emerald-700 mt-1">
            79.9%
          </div>
          <div className="text-[11px] text-emerald-600 font-medium mt-1">
            State Target: &gt; 70.0%
          </div>
        </Card>

        <Card className="p-4 border-slate-200">
          <div className="text-xs font-semibold text-slate-500">Compliance Audit Status</div>
          <div className="text-2xl font-bold text-slate-900 mt-1">
            5 / 6 Fully Compliant
          </div>
          <div className="text-[11px] text-amber-600 font-medium mt-1">
            1 Under Compliance Review
          </div>
        </Card>
      </div>

      {/* Search and Filters */}
      <Card className="p-4 border-slate-200 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        <div className="flex-1 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search training center name or district..."
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
              <option value="all">All Districts</option>
              {districts.filter(d => d !== 'all').map(d => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-500 font-medium shrink-0">Audit Status:</span>
          <select
            value={selectedStatus}
            onChange={e => setSelectedStatus(e.target.value)}
            className="text-xs bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-slate-800 font-medium focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
          >
            <option value="all">All Statuses</option>
            <option value="Compliant">Compliant</option>
            <option value="Under Review">Under Review</option>
            <option value="Audit Pending">Audit Pending</option>
          </select>
        </div>
      </Card>

      {/* Main Sortable & Filterable Performance Table */}
      <Card className="p-0 overflow-hidden border border-slate-200">
        <div className="px-4 py-3 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
            Institutional Quality & Skilling Outcomes Registry
          </h3>
          <span className="text-[11px] text-slate-500 font-medium">
            Click column headers to sort • Showing {filteredCenters.length} centers
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-100/60 border-b border-slate-200 text-slate-600 font-semibold select-none">
              <tr>
                <th
                  className="py-2.5 px-3.5 cursor-pointer hover:text-slate-900"
                  onClick={() => handleSort('name')}
                >
                  Training Center {sortBy === 'name' ? (sortOrder === 'asc' ? '↑' : '↓') : ''}
                </th>
                <th
                  className="py-2.5 px-3.5 cursor-pointer hover:text-slate-900"
                  onClick={() => handleSort('district')}
                >
                  District {sortBy === 'district' ? (sortOrder === 'asc' ? '↑' : '↓') : ''}
                </th>
                <th
                  className="py-2.5 px-3.5 cursor-pointer hover:text-slate-900 text-right"
                  onClick={() => handleSort('enrolled')}
                >
                  Enrolled {sortBy === 'enrolled' ? (sortOrder === 'asc' ? '↑' : '↓') : ''}
                </th>
                <th
                  className="py-2.5 px-3.5 cursor-pointer hover:text-slate-900 text-right"
                  onClick={() => handleSort('completion_rate')}
                >
                  Completion Rate {sortBy === 'completion_rate' ? (sortOrder === 'asc' ? '↑' : '↓') : ''}
                </th>
                <th
                  className="py-2.5 px-3.5 cursor-pointer hover:text-slate-900 text-right"
                  onClick={() => handleSort('certification_rate')}
                >
                  Certification {sortBy === 'certification_rate' ? (sortOrder === 'asc' ? '↑' : '↓') : ''}
                </th>
                <th
                  className="py-2.5 px-3.5 cursor-pointer hover:text-slate-900 text-right"
                  onClick={() => handleSort('placed')}
                >
                  Placed Candidates {sortBy === 'placed' ? (sortOrder === 'asc' ? '↑' : '↓') : ''}
                </th>
                <th
                  className="py-2.5 px-3.5 cursor-pointer hover:text-slate-900 text-right"
                  onClick={() => handleSort('placement_rate')}
                >
                  Placement % {sortBy === 'placement_rate' ? (sortOrder === 'asc' ? '↑' : '↓') : ''}
                </th>
                <th
                  className="py-2.5 px-3.5 cursor-pointer hover:text-slate-900 text-right"
                  onClick={() => handleSort('retention_6m')}
                >
                  6M Retention {sortBy === 'retention_6m' ? (sortOrder === 'asc' ? '↑' : '↓') : ''}
                </th>
                <th
                  className="py-2.5 px-3.5 cursor-pointer hover:text-slate-900 text-right"
                  onClick={() => handleSort('compliance_score')}
                >
                  Compliance {sortBy === 'compliance_score' ? (sortOrder === 'asc' ? '↑' : '↓') : ''}
                </th>
                <th className="py-2.5 px-3.5 text-center">Audit Status</th>
                <th className="py-2.5 px-3.5 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filteredCenters.map(c => (
                <tr key={c.id} className="hover:bg-slate-50 transition-colors">
                  <td className="py-3 px-3.5 font-bold text-slate-900 flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-indigo-600 shrink-0" />
                    <div>
                      <div>{c.name}</div>
                      <div className="text-[10px] text-slate-400 font-normal">{c.contact_email}</div>
                    </div>
                  </td>
                  <td className="py-3 px-3.5 text-slate-700 font-medium">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-slate-400" /> {c.district}
                    </span>
                  </td>
                  <td className="py-3 px-3.5 text-right font-medium">{c.enrolled.toLocaleString()}</td>
                  <td className="py-3 px-3.5 text-right text-purple-700 font-semibold">{c.completion_rate}%</td>
                  <td className="py-3 px-3.5 text-right text-emerald-700 font-semibold">{c.certification_rate}%</td>
                  <td className="py-3 px-3.5 text-right font-bold text-slate-900">{c.placed.toLocaleString()}</td>
                  <td className="py-3 px-3.5 text-right font-bold text-emerald-700">
                    <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
                      {c.placement_rate}%
                    </span>
                  </td>
                  <td className="py-3 px-3.5 text-right font-bold text-sky-700">{c.retention_6m}%</td>
                  <td className="py-3 px-3.5 text-right">
                    <span className={`font-bold ${c.compliance_score >= 90 ? 'text-emerald-700' : c.compliance_score >= 80 ? 'text-amber-700' : 'text-rose-700'}`}>
                      {c.compliance_score}/100
                    </span>
                  </td>
                  <td className="py-3 px-3.5 text-center">
                    <span
                      className={`px-2 py-0.5 rounded text-[11px] font-bold border ${
                        c.audit_status === 'Compliant'
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                          : c.audit_status === 'Under Review'
                          ? 'bg-amber-50 text-amber-700 border-amber-200'
                          : 'bg-rose-50 text-rose-700 border-rose-200'
                      }`}
                    >
                      {c.audit_status}
                    </span>
                  </td>
                  <td className="py-3 px-3.5 text-center">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setSelectedCenter(c)}
                      className="text-[11px] py-1 px-2.5 h-auto"
                    >
                      Dossier
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Center Detail Audit Modal */}
      {selectedCenter && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in duration-150">
          <Card className="max-w-2xl w-full bg-white p-6 rounded-2xl shadow-xl space-y-5 border-slate-200 max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between pb-4 border-b border-slate-200">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-700 flex items-center justify-center font-bold">
                  <Building2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">{selectedCenter.name}</h3>
                  <p className="text-xs text-slate-500 flex items-center gap-1.5 mt-0.5">
                    <MapPin className="w-3 h-3 text-slate-400" /> {selectedCenter.district}, Maharashtra • {selectedCenter.contact_email}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setSelectedCenter(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Performance Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
                <span className="text-slate-500 font-medium">Total Enrolled</span>
                <div className="text-lg font-bold text-slate-900 mt-0.5">{selectedCenter.enrolled.toLocaleString()}</div>
              </div>
              <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
                <span className="text-slate-500 font-medium">Trained Completed</span>
                <div className="text-lg font-bold text-purple-700 mt-0.5">{selectedCenter.trained.toLocaleString()} ({selectedCenter.completion_rate}%)</div>
              </div>
              <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
                <span className="text-slate-500 font-medium">NSQF Certified</span>
                <div className="text-lg font-bold text-emerald-700 mt-0.5">{selectedCenter.certified.toLocaleString()} ({selectedCenter.certification_rate}%)</div>
              </div>
              <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
                <span className="text-slate-500 font-medium">Verified Placed</span>
                <div className="text-lg font-bold text-emerald-700 mt-0.5">{selectedCenter.placed.toLocaleString()} ({selectedCenter.placement_rate}%)</div>
              </div>
            </div>

            {/* Longitudinal Retention Breakdown */}
            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-3">
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-indigo-600" /> Longitudinal Retention Milestones (EPFO Verified)
              </h4>
              <div className="grid grid-cols-3 gap-3 text-xs">
                <div className="p-2.5 rounded bg-white border border-slate-200">
                  <span className="text-slate-500">3-Month Retention</span>
                  <div className="text-base font-bold text-sky-700 mt-0.5">{selectedCenter.retention_3m}%</div>
                </div>
                <div className="p-2.5 rounded bg-white border border-slate-200">
                  <span className="text-slate-500">6-Month Retention</span>
                  <div className="text-base font-bold text-indigo-700 mt-0.5">{selectedCenter.retention_6m}%</div>
                </div>
                <div className="p-2.5 rounded bg-white border border-slate-200">
                  <span className="text-slate-500">12-Month Retention</span>
                  <div className="text-base font-bold text-emerald-700 mt-0.5">{selectedCenter.retention_12m}%</div>
                </div>
              </div>
            </div>

            {/* Quality & Compliance Status */}
            <div className="space-y-2 text-xs">
              <h4 className="font-bold text-slate-900 flex items-center justify-between">
                <span>Compliance & Accreditation Status</span>
                <Badge variant={selectedCenter.audit_status === 'Compliant' ? 'success' : 'warning'}>
                  Score: {selectedCenter.compliance_score}/100 • {selectedCenter.audit_status}
                </Badge>
              </h4>
              <p className="text-slate-600 leading-relaxed bg-slate-50 p-3 rounded-lg border border-slate-200">
                {selectedCenter.audit_status === 'Compliant'
                  ? 'All biometric attendance terminals, trainer NSQF Level 5 certifications, and laboratory workbench hours are fully validated and in sync with the central state repository.'
                  : 'An administrative review flag is currently active regarding batch completion speed. On-site verification scheduled with the District Skilling Committee.'}
              </p>
            </div>

            <div className="pt-3 border-t border-slate-200 flex justify-end">
              <Button variant="primary" onClick={() => setSelectedCenter(null)}>
                Close Dossier
              </Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};
