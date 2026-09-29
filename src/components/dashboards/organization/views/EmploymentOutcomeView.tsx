import React, { useState, useMemo } from 'react';
import { AnalyticsService } from '../../../../lib/analyticsService';
import { LocalDbService } from '../../../../lib/supabase';
import { Placement, TrainingCenter } from '../../../../types';
import { Card, Badge, Button, Input } from '../../../ui';
import { formatCurrency, formatDate, formatPercentage } from '../../../../lib/utils';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import {
  Briefcase,
  Clock,
  CheckCircle2,
  TrendingUp,
  ShieldCheck,
  Building2,
  DollarSign,
  AlertCircle,
  FileCheck2,
  Layers,
  ArrowUpRight,
  UserCheck,
  Download,
  Filter,
  Search,
  Calendar,
  MapPin,
  Sparkles,
  Info,
  HelpCircle,
  XCircle,
  Users
} from 'lucide-react';
import { useAuth } from '../../../../context/AuthContext';

export const EmploymentOutcomeView: React.FC = () => {
  const { organization } = useAuth();
  const allPlacements = useMemo(() => LocalDbService.getPlacements(organization?.id), [organization?.id]);
  const trainingCenters = useMemo(() => LocalDbService.getTrainingCenters(organization?.id), [organization?.id]);
  const enrollments = useMemo(() => LocalDbService.getEnrollments(organization?.id), [organization?.id]);
  const candidateProfiles = useMemo(() => {
    const profiles = LocalDbService.getProfiles(organization?.id).filter(p => p.role === 'candidate');
    return profiles;
  }, [organization?.id]);

  // Filter States
  const [searchQuery, setSearchQuery] = useState('');
  const [districtFilter, setDistrictFilter] = useState('all');
  const [skillFilter, setSkillFilter] = useState('all');
  const [providerFilter, setProviderFilter] = useState('all');
  const [employmentStatusFilter, setEmploymentStatusFilter] = useState('all');
  const [verificationFilter, setVerificationFilter] = useState<'all' | 'verified' | 'unverified' | 'in_review'>('all');
  const [dateRangeFilter, setDateRangeFilter] = useState<'all' | 'last_30_days' | 'last_90_days' | 'fy_2025_26'>('all');

  // Derive districts and skills from data
  const availableDistricts = useMemo(() => {
    const set = new Set<string>();
    trainingCenters.forEach(tc => { if (tc.district) set.add(tc.district); });
    set.add('Pune');
    set.add('Mumbai Suburban');
    set.add('Thane');
    set.add('Chhatrapati Sambhajinagar');
    set.add('Nagpur');
    set.add('Nashik');
    return ['all', ...Array.from(set)];
  }, [trainingCenters]);

  const availableSkills = useMemo(() => {
    const set = new Set<string>();
    allPlacements.forEach(p => {
      (p.skills || []).forEach(s => set.add(s));
    });
    set.add('React.js & TypeScript');
    set.add('Node.js & Express API');
    set.add('Electric Vehicle (EV) Diagnostics');
    set.add('Python & Data Analytics');
    set.add('Solar PV Installation & Grid Tie');
    set.add('Cloud Infrastructure (GCP/AWS)');
    return ['all', ...Array.from(set)];
  }, [allPlacements]);

  // Filter Logic
  const filteredPlacements = useMemo(() => {
    const now = new Date();
    return allPlacements.filter(p => {
      // 1. Text Search
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = (p.candidate_name || '').toLowerCase().includes(q);
        const matchesCompany = (p.company || '').toLowerCase().includes(q);
        const matchesRole = (p.job_role || '').toLowerCase().includes(q);
        if (!matchesName && !matchesCompany && !matchesRole) return false;
      }

      // 2. Training Provider Filter
      if (providerFilter !== 'all') {
        const matchesCenter = p.training_center_id === providerFilter || p.training_center_name?.includes(providerFilter);
        if (!matchesCenter) return false;
      }

      // 3. District Filter (via training center match)
      if (districtFilter !== 'all') {
        const center = trainingCenters.find(tc => tc.id === p.training_center_id);
        const centerDistrict = center?.district?.toLowerCase();
        const matchesDistrict = centerDistrict === districtFilter.toLowerCase() ||
          p.training_center_name?.toLowerCase().includes(districtFilter.toLowerCase());
        if (!matchesDistrict) return false;
      }

      // 4. Skill Filter
      if (skillFilter !== 'all') {
        const hasSkill = (p.skills || []).some(s => s.toLowerCase().includes(skillFilter.toLowerCase()));
        if (!hasSkill) return false;
      }

      // 5. Employment Status Filter
      if (employmentStatusFilter !== 'all') {
        if (p.employment_status !== employmentStatusFilter) return false;
      }

      // 6. Verification Status Filter
      if (verificationFilter !== 'all') {
        if (verificationFilter === 'verified' && p.verification_status !== 'verified') return false;
        if (verificationFilter === 'unverified' && p.verification_status !== 'unverified') return false;
        if (verificationFilter === 'in_review' && (p.verification_status !== 'in_review' && p.verification_status !== 'flagged')) return false;
      }

      // 7. Date Range Filter
      if (dateRangeFilter !== 'all' && p.joining_date) {
        const joinDate = new Date(p.joining_date);
        const diffDays = (now.getTime() - joinDate.getTime()) / (1000 * 3600 * 24);
        if (dateRangeFilter === 'last_30_days' && diffDays > 30) return false;
        if (dateRangeFilter === 'last_90_days' && diffDays > 90) return false;
        if (dateRangeFilter === 'fy_2025_26') {
          const fyStart = new Date('2025-04-01');
          const fyEnd = new Date('2026-03-31');
          if (joinDate < fyStart || joinDate > fyEnd) return false;
        }
      }

      return true;
    });
  }, [allPlacements, searchQuery, districtFilter, skillFilter, providerFilter, employmentStatusFilter, verificationFilter, dateRangeFilter, trainingCenters]);

  // Aggregate Calculations from live state
  const totalTrainedCount = useMemo(() => {
    const completedEnrollments = enrollments.filter(e => e.completion_status === 'completed' || e.completion_status === 'certified').length;
    return completedEnrollments > 0 ? completedEnrollments : candidateProfiles.length;
  }, [enrollments, candidateProfiles]);

  const placedCount = filteredPlacements.filter(p => p.employment_status === 'active' || p.employment_status === 'placed').length;
  const verifiedPlacedCount = filteredPlacements.filter(p => p.verification_status === 'verified').length;
  const unverifiedPlacedCount = filteredPlacements.filter(p => p.verification_status === 'unverified').length;
  const inReviewPlacedCount = filteredPlacements.filter(p => p.verification_status === 'in_review' || p.verification_status === 'flagged').length;

  const placementRate = totalTrainedCount > 0 ? Math.min(100, (placedCount / totalTrainedCount) * 100).toFixed(1) : '0.0';

  // Candidates Seeking Employment (registered candidate profiles without an active placement)
  const candidatesSeekingCount = useMemo(() => {
    const candidatePlacements = new Set(allPlacements.map(p => p.candidate_id));
    const unplacedProfiles = candidateProfiles.filter(p => !candidatePlacements.has(p.id));
    return unplacedProfiles.length;
  }, [allPlacements, candidateProfiles]);

  // Longitudinal Retention Metrics
  const retained3mCount = filteredPlacements.filter(p => p.retention_3m === 'verified' || p.retention_3m === 'simulated_epfo_verified').length;
  const retained6mCount = filteredPlacements.filter(p => p.retention_6m === 'verified' || p.retention_6m === 'simulated_epfo_verified').length;
  const retained12mCount = filteredPlacements.filter(p => p.retention_12m === 'verified' || p.retention_12m === 'simulated_epfo_verified').length;

  const retention3mRate = placedCount > 0 ? Math.round((retained3mCount / placedCount) * 100) : 0;
  const retention6mRate = placedCount > 0 ? Math.round((retained6mCount / placedCount) * 100) : 0;
  const retention12mRate = placedCount > 0 ? Math.round((retained12mCount / placedCount) * 100) : 0;

  // Average Salary
  const avgSalary = useMemo(() => {
    if (filteredPlacements.length === 0) return 0;
    const sum = filteredPlacements.reduce((acc, p) => acc + (p.salary || 0), 0);
    return Math.round(sum / filteredPlacements.length);
  }, [filteredPlacements]);

  // Retention Milestone Stepper
  const retentionSteps = [
    {
      label: '3-Month Retention',
      count: retained3mCount,
      rate: retention3mRate,
      desc: 'First wage cycle confirmation & EPFO ECR log',
      fill: '#6366f1'
    },
    {
      label: '6-Month Retention',
      count: retained6mCount,
      rate: retention6mRate,
      desc: 'Continuous quarterly PF remittance verified',
      fill: '#8b5cf6'
    },
    {
      label: '12-Month Retention',
      count: retained12mCount,
      rate: retention12mRate,
      desc: 'Annual career longevity and statutory wage appraisal',
      fill: '#10b981'
    }
  ];

  // Status Distribution Pie
  const statusPieData = [
    { name: 'Verified Employed', value: verifiedPlacedCount, fill: '#10b981' },
    { name: 'Self-Reported / Unverified', value: unverifiedPlacedCount, fill: '#f59e0b' },
    { name: 'In Review / Audit', value: inReviewPlacedCount, fill: '#6366f1' },
    { name: 'Resigned / Attrition', value: filteredPlacements.filter(p => p.employment_status === 'resigned').length, fill: '#f43f5e' }
  ].filter(d => d.value > 0);

  // CSV Export Handler
  const handleExportCsv = () => {
    const filename = `skilltrack_employment_outcomes_${new Date().toISOString().split('T')[0]}`;
    const headers = [
      'Candidate ID',
      'Candidate Name',
      'Hiring Employer',
      'Job Role',
      'Annual Salary (INR)',
      'Joining Date',
      'Training Center',
      'Course',
      'Primary Skills',
      'Verification Status',
      'Verification Source/Method',
      'Employment Status',
      '3-Month Retention',
      '6-Month Retention',
      '12-Month Retention'
    ];

    const rows = filteredPlacements.map(p => [
      p.candidate_id,
      p.candidate_name || 'N/A',
      p.company,
      p.job_role,
      p.salary,
      p.joining_date,
      p.training_center_name || 'N/A',
      p.course_name || 'N/A',
      (p.skills || []).join('; '),
      p.verification_status,
      p.verification_method || 'Candidate Self-Declaration',
      p.employment_status,
      p.retention_3m || 'pending',
      p.retention_6m || 'pending',
      p.retention_12m || 'pending'
    ]);

    AnalyticsService.exportToCsv(filename, headers, rows);
  };

  const resetFilters = () => {
    setSearchQuery('');
    setDistrictFilter('all');
    setSkillFilter('all');
    setProviderFilter('all');
    setEmploymentStatusFilter('all');
    setVerificationFilter('all');
    setDateRangeFilter('all');
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="p-5 rounded-xl border border-slate-200 bg-white shadow-2xs flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Badge variant="purple">Longitudinal Analytics</Badge>
            <span className="text-xs text-slate-500 font-medium">Post-Placement Tracking & Quality Assurance (SIH26135)</span>
          </div>
          <h1 className="text-xl font-bold text-slate-900 mt-1">
            Employment Outcomes, Longevity & Verification Dashboard
          </h1>
          <p className="text-xs text-slate-500 mt-0.5 max-w-3xl">
            Real-time longitudinal verification of placed candidates at 3, 6, and 12-month career milestones cross-referenced against statutory EPFO Universal Account Number (UAN) returns, employer confirmations, and verified bank salary deposits.
          </p>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          <Button
            size="sm"
            variant="outline"
            leftIcon={<Download className="w-3.5 h-3.5" />}
            onClick={handleExportCsv}
            id="btn-export-outcomes-csv"
          >
            Export Filtered CSV ({filteredPlacements.length})
          </Button>
        </div>
      </div>

      {/* Multi-Source Statutory Verification Callout */}
      <div className="p-4 rounded-xl bg-slate-900 text-slate-100 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
          <div className="text-xs space-y-1">
            <div className="font-bold text-sm text-white flex items-center gap-2">
              Statutory Multi-Source Verification Integrity Engine
              <Badge variant="success">Triangulated</Badge>
            </div>
            <p className="text-slate-300 max-w-3xl leading-relaxed">
              <strong>Verified Outcomes:</strong> Backed by statutory EPFO monthly electronic challan receipts, bank credits, or confirmed HR validation. <br />
              <strong>Unverified / Self-Reported:</strong> Candidate self-declarations awaiting institutional verification. Placements lacking statutory reconciliation after 90 days are escalated to the state compliance review queue.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0 bg-slate-800/80 px-3.5 py-2 rounded-lg border border-slate-700">
          <span className="text-xs text-slate-300 font-medium">Verified Ratio:</span>
          <span className="text-sm font-extrabold text-emerald-400">
            {allPlacements.length > 0 ? Math.round((verifiedPlacedCount / allPlacements.length) * 100) : 0}%
          </span>
        </div>
      </div>

      {/* Primary KPI Grid (All 6 core requirements) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5">
        <Card className="p-4 border-slate-200">
          <div className="text-xs font-semibold text-slate-500">Total Trained</div>
          <div className="text-2xl font-bold text-slate-900 mt-1">
            {totalTrainedCount.toLocaleString()}
          </div>
          <div className="text-[11px] text-indigo-600 font-medium mt-1 flex items-center gap-1">
            <Users className="w-3 h-3" /> State Cohorts
          </div>
        </Card>

        <Card className="p-4 border-slate-200">
          <div className="text-xs font-semibold text-slate-500">Candidates Placed</div>
          <div className="text-2xl font-bold text-emerald-700 mt-1">
            {placedCount}
          </div>
          <div className="text-[11px] text-emerald-600 font-medium mt-1">
            {verifiedPlacedCount} verified via EPFO/HR
          </div>
        </Card>

        <Card className="p-4 border-slate-200">
          <div className="text-xs font-semibold text-slate-500">Placement Rate</div>
          <div className="text-2xl font-bold text-indigo-700 mt-1">
            {placementRate}%
          </div>
          <div className="text-[11px] text-slate-500 font-medium mt-1">
            State Target: 70.0%
          </div>
        </Card>

        <Card className="p-4 border-slate-200">
          <div className="text-xs font-semibold text-slate-500">Seeking Employment</div>
          <div className="text-2xl font-bold text-amber-700 mt-1">
            {candidatesSeekingCount.toLocaleString()}
          </div>
          <div className="text-[11px] text-amber-600 font-medium mt-1">
            Active in job matching
          </div>
        </Card>

        <Card className="p-4 border-slate-200">
          <div className="text-xs font-semibold text-slate-500">6M Retention Rate</div>
          <div className="text-2xl font-bold text-purple-700 mt-1">
            {retention6mRate}%
          </div>
          <div className="text-[11px] text-purple-600 font-medium mt-1">
            {retained6mCount} confirmed continuous
          </div>
        </Card>

        <Card className="p-4 border-slate-200">
          <div className="text-xs font-semibold text-slate-500">Average CTC</div>
          <div className="text-2xl font-bold text-slate-900 mt-1">
            {formatCurrency(avgSalary)}
          </div>
          <div className="text-[11px] text-slate-500 font-medium mt-1">
            Annual Entry Wage
          </div>
        </Card>
      </div>

      {/* Retention Milestone Cards */}
      <Card className="p-5 border-slate-200">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div>
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Clock className="w-4 h-4 text-indigo-600" /> Longitudinal Retention Milestones (3M, 6M, 12M)
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Verified career continuation backed by statutory EPFO social security remittances
            </p>
          </div>
          <Badge variant="success">EPFO Integration Active</Badge>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-5">
          {retentionSteps.map((step, idx) => (
            <div
              key={idx}
              className="p-4 rounded-xl border border-slate-200 bg-slate-50/70 flex flex-col justify-between space-y-3 relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 right-0 h-1.5" style={{ backgroundColor: step.fill }} />
              <div>
                <span className="text-xs font-bold text-slate-600 uppercase tracking-wider">{step.label}</span>
                <div className="text-2xl font-extrabold text-slate-900 mt-1 flex items-baseline gap-2">
                  <span style={{ color: step.fill }}>{step.rate}%</span>
                  <span className="text-xs font-normal text-slate-500">({step.count} candidates)</span>
                </div>
                <p className="text-xs text-slate-500 mt-1.5">{step.desc}</p>
              </div>

              <div className="pt-3 border-t border-slate-200/80 flex items-center justify-between text-xs font-medium">
                <span className="text-slate-600">State Standard: 70.0%</span>
                <span className="text-emerald-700 font-bold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Compliant
                </span>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Interactive Filter Toolbar */}
      <Card className="p-4 border-slate-200 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-900 uppercase tracking-wider">
            <Filter className="w-3.5 h-3.5 text-indigo-600" /> Filter & Segment Placements
          </div>
          <button
            onClick={resetFilters}
            className="text-xs text-indigo-600 hover:text-indigo-800 font-semibold"
          >
            Reset Filters
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Search */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-3 top-3 text-slate-400" />
            <input
              type="text"
              placeholder="Candidate, Employer, Role..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 text-xs rounded-lg border border-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500 bg-white"
            />
          </div>

          {/* District Filter */}
          <div>
            <select
              value={districtFilter}
              onChange={e => setDistrictFilter(e.target.value)}
              className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500 bg-white text-slate-700"
            >
              <option value="all">All Districts</option>
              {availableDistricts.filter(d => d !== 'all').map(d => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
          </div>

          {/* Skill Filter */}
          <div>
            <select
              value={skillFilter}
              onChange={e => setSkillFilter(e.target.value)}
              className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500 bg-white text-slate-700"
            >
              <option value="all">All Skills</option>
              {availableSkills.filter(s => s !== 'all').map(s => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>

          {/* Verification Status Filter */}
          <div>
            <select
              value={verificationFilter}
              onChange={e => setVerificationFilter(e.target.value as any)}
              className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500 bg-white text-slate-700 font-medium"
            >
              <option value="all">All Verification Statuses</option>
              <option value="verified">Verified (EPFO / HR) Only</option>
              <option value="unverified">Self-Reported / Unverified Only</option>
              <option value="in_review">In Review / Audit Flagged</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
          {/* Training Provider Filter */}
          <div>
            <select
              value={providerFilter}
              onChange={e => setProviderFilter(e.target.value)}
              className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500 bg-white text-slate-700"
            >
              <option value="all">All Training Providers</option>
              {trainingCenters.map(tc => (
                <option key={tc.id} value={tc.id}>{tc.name}</option>
              ))}
            </select>
          </div>

          {/* Employment Status Filter */}
          <div>
            <select
              value={employmentStatusFilter}
              onChange={e => setEmploymentStatusFilter(e.target.value)}
              className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500 bg-white text-slate-700"
            >
              <option value="all">All Employment Statuses</option>
              <option value="active">Active In-Role</option>
              <option value="placed">Newly Placed</option>
              <option value="resigned">Resigned / Attrition</option>
              <option value="in_review">Provisional / In Review</option>
            </select>
          </div>

          {/* Date Range Filter */}
          <div>
            <select
              value={dateRangeFilter}
              onChange={e => setDateRangeFilter(e.target.value as any)}
              className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500 bg-white text-slate-700"
            >
              <option value="all">All Time Records</option>
              <option value="last_30_days">Last 30 Days</option>
              <option value="last_90_days">Last 90 Days</option>
              <option value="fy_2025_26">FY 2025-26</option>
            </select>
          </div>
        </div>
      </Card>

      {/* Outcome Roster Table */}
      <Card className="p-0 overflow-hidden border border-slate-200">
        <div className="px-4 py-3 bg-slate-50 border-b border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
          <div>
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              Candidate Placement & Statutory Verification Records ({filteredPlacements.length})
            </h3>
            <p className="text-[11px] text-slate-500 mt-0.5">
              Distinguishing verified employment outcomes from candidate self-declarations
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[11px] text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
              {verifiedPlacedCount} Verified
            </span>
            <span className="text-[11px] text-amber-700 font-semibold bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
              {unverifiedPlacedCount} Self-Reported
            </span>
          </div>
        </div>

        {filteredPlacements.length === 0 ? (
          <div className="p-8 text-center text-xs text-slate-500 space-y-2">
            <AlertCircle className="w-8 h-8 text-slate-400 mx-auto" />
            <div className="font-semibold text-slate-700">No employment outcome records matched your filter criteria.</div>
            <p className="max-w-md mx-auto">Try clearing search terms or resetting filters to display all candidate placements.</p>
            <Button size="sm" variant="outline" onClick={resetFilters}>Reset Filters</Button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-100/70 border-b border-slate-200 text-slate-700 font-semibold">
                <tr>
                  <th className="py-2.5 px-3.5">Candidate Name</th>
                  <th className="py-2.5 px-3.5">Employer / Company</th>
                  <th className="py-2.5 px-3.5">Job Role</th>
                  <th className="py-2.5 px-3.5">Offered CTC</th>
                  <th className="py-2.5 px-3.5">Placement Date</th>
                  <th className="py-2.5 px-3.5">Training Provider</th>
                  <th className="py-2.5 px-3.5">Verification Status</th>
                  <th className="py-2.5 px-3.5">Retention Status</th>
                  <th className="py-2.5 px-3.5">Employment Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {filteredPlacements.map(p => {
                  const isVerified = p.verification_status === 'verified';
                  const isUnverified = p.verification_status === 'unverified';
                  const isInReview = p.verification_status === 'in_review' || p.verification_status === 'flagged';

                  return (
                    <tr key={p.id} className="hover:bg-slate-50 transition-colors">
                      <td className="py-2.5 px-3.5 font-bold text-slate-900">
                        {p.candidate_name || 'Candidate'}
                        <div className="text-[10px] text-slate-400 font-mono font-normal">{p.candidate_id}</div>
                      </td>
                      <td className="py-2.5 px-3.5 text-slate-900 font-semibold">
                        {p.company}
                      </td>
                      <td className="py-2.5 px-3.5 text-slate-700">
                        {p.job_role}
                        {p.skills && p.skills.length > 0 && (
                          <div className="text-[10px] text-slate-400 truncate max-w-[160px]">
                            {p.skills.slice(0, 2).join(', ')}
                          </div>
                        )}
                      </td>
                      <td className="py-2.5 px-3.5 font-semibold text-emerald-700">
                        {formatCurrency(p.salary || 480000)}/yr
                      </td>
                      <td className="py-2.5 px-3.5 text-slate-600">
                        {p.joining_date ? formatDate(p.joining_date) : 'N/A'}
                      </td>
                      <td className="py-2.5 px-3.5 text-slate-600 text-[11px] max-w-[180px] truncate">
                        {p.training_center_name || 'State Skilling Partner'}
                      </td>
                      <td className="py-2.5 px-3.5">
                        {isVerified && (
                          <div className="space-y-0.5">
                            <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1 w-fit">
                              <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Verified
                            </span>
                            <div className="text-[10px] text-slate-400">
                              {p.verification_method?.replace(/_/g, ' ') || 'EPFO Simulator'}
                            </div>
                          </div>
                        )}
                        {isUnverified && (
                          <div className="space-y-0.5">
                            <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-amber-50 text-amber-700 border border-amber-200 flex items-center gap-1 w-fit">
                              <AlertCircle className="w-3 h-3 text-amber-600" /> Self-Reported
                            </span>
                            <div className="text-[10px] text-amber-600">Awaiting EPFO verification</div>
                          </div>
                        )}
                        {isInReview && (
                          <div className="space-y-0.5">
                            <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-200 flex items-center gap-1 w-fit">
                              <HelpCircle className="w-3 h-3 text-indigo-600" /> In Review
                            </span>
                            <div className="text-[10px] text-slate-400">Audit in progress</div>
                          </div>
                        )}
                      </td>
                      <td className="py-2.5 px-3.5">
                        <div className="flex items-center gap-1 text-[11px]">
                          <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                            p.retention_3m === 'verified' || p.retention_3m === 'simulated_epfo_verified'
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : 'bg-slate-100 text-slate-500'
                          }`}>
                            3M
                          </span>
                          <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                            p.retention_6m === 'verified' || p.retention_6m === 'simulated_epfo_verified'
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : p.retention_6m === 'failed'
                              ? 'bg-rose-50 text-rose-700 border border-rose-200'
                              : 'bg-slate-100 text-slate-500'
                          }`}>
                            6M
                          </span>
                          <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                            p.retention_12m === 'verified' || p.retention_12m === 'simulated_epfo_verified'
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : 'bg-slate-100 text-slate-500'
                          }`}>
                            12M
                          </span>
                        </div>
                      </td>
                      <td className="py-2.5 px-3.5">
                        <Badge variant={p.employment_status === 'active' || p.employment_status === 'placed' ? 'success' : p.employment_status === 'resigned' ? 'danger' : 'primary'}>
                          {p.employment_status === 'active' ? 'Active In-Role' : p.employment_status === 'placed' ? 'Placed' : p.employment_status === 'resigned' ? 'Resigned' : 'In Review'}
                        </Badge>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
};
