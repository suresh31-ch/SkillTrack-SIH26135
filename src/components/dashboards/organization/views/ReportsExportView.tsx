import React, { useState, useMemo } from 'react';
import { AnalyticsService, MAHARASHTRA_DISTRICTS_DATA, TRAINING_CENTERS_PERFORMANCE, SKILL_SUPPLY_DEMAND_DATA } from '../../../../lib/analyticsService';
import { ReportConfig } from '../../../../types';
import { Card, Badge, Button } from '../../../ui';
import { useToast } from '../../../../context/ToastContext';
import {
  Download,
  FileText,
  FileSpreadsheet,
  Filter,
  SlidersHorizontal,
  Eye,
  CheckCircle2,
  Calendar,
  Layers,
  Sparkles,
  Building2,
  MapPin,
  Clock
} from 'lucide-react';

export const ReportsExportView: React.FC = () => {
  const { showToast } = useToast();

  const [reportType, setReportType] = useState<ReportConfig['report_type']>('executive_summary');
  const [districtFilter, setDistrictFilter] = useState<string>('all');
  const [skillCategoryFilter, setSkillCategoryFilter] = useState<string>('all');
  const [timePeriod, setTimePeriod] = useState<ReportConfig['time_period']>('fy_2025_26');

  // Categories list
  const skillCategories = useMemo(() => {
    const set = new Set(SKILL_SUPPLY_DEMAND_DATA.map(s => s.category));
    return ['all', ...Array.from(set)];
  }, []);

  // Generate Report Data
  const reportData = useMemo(() => {
    return AnalyticsService.generateReportData({
      report_type: reportType,
      district_filter: districtFilter,
      training_center_filter: 'all',
      skill_category_filter: skillCategoryFilter,
      time_period: timePeriod,
      format: 'csv'
    });
  }, [reportType, districtFilter, skillCategoryFilter, timePeriod]);

  // Export CSV Handler
  const handleExportCsv = () => {
    const filename = `skilltrack_${reportType}_${timePeriod}_${new Date().toISOString().split('T')[0]}`;
    AnalyticsService.exportToCsv(filename, reportData.headers, reportData.rows);
    showToast('Export Successful', `Saved ${reportData.title} (${reportData.rows.length} rows) as CSV.`, 'success');
  };

  // Export JSON Handler
  const handleExportJson = () => {
    const filename = `skilltrack_${reportType}_${timePeriod}_${new Date().toISOString().split('T')[0]}`;
    AnalyticsService.exportToJson(filename, reportData.headers, reportData.rows, reportData.title);
    showToast('Export Successful', `Saved ${reportData.title} (${reportData.rows.length} rows) as JSON.`, 'success');
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="p-5 rounded-xl border border-slate-200 bg-white shadow-2xs flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Badge variant="purple">Data Export Engine</Badge>
            <span className="text-xs text-slate-500 font-medium">Official Executive & Audit Reports</span>
          </div>
          <h1 className="text-xl font-bold text-slate-900 mt-1">
            Skilling Analytics Reports & Data Export Center
          </h1>
          <p className="text-xs text-slate-500 mt-0.5 max-w-3xl">
            Generate, filter, preview, and download statutory skilling reports, district spatial metrics, skill gap audits, and anti-fraud integrity logs in standard CSV and JSON formats.
          </p>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          <Button
            size="sm"
            variant="outline"
            leftIcon={<FileSpreadsheet className="w-3.5 h-3.5" />}
            onClick={handleExportCsv}
            id="btn-export-csv"
          >
            Export CSV
          </Button>

          <Button
            size="sm"
            variant="primary"
            leftIcon={<Download className="w-3.5 h-3.5" />}
            onClick={handleExportJson}
            id="btn-export-json"
          >
            Export JSON
          </Button>
        </div>
      </div>

      {/* Configuration & Filter Controls Card */}
      <Card className="p-5 border-slate-200 space-y-4">
        <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
          <SlidersHorizontal className="w-3.5 h-3.5 text-indigo-600" /> Report Configuration & Filter Parameters
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
          {/* Report Type */}
          <div className="space-y-1">
            <label className="font-semibold text-slate-700">Report Template:</label>
            <select
              value={reportType}
              onChange={e => setReportType(e.target.value as any)}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 font-medium text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
            >
              <option value="executive_summary">1. Executive Outcomes Summary</option>
              <option value="district_matrix">2. Maharashtra District Matrix</option>
              <option value="skill_supply_demand">3. Skill Supply vs Demand Gap</option>
              <option value="training_centers">4. Training Center Performance</option>
              <option value="employment_retention">5. Employment & Retention Audit</option>
              <option value="fraud_anomalies">6. Anomaly & Fraud Incident Log</option>
            </select>
          </div>

          {/* Time Period */}
          <div className="space-y-1">
            <label className="font-semibold text-slate-700">Reporting Time Period:</label>
            <select
              value={timePeriod}
              onChange={e => setTimePeriod(e.target.value as any)}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 font-medium text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
            >
              <option value="fy_2025_26">Current FY (2025-26)</option>
              <option value="last_quarter">Last Quarter (Q1 2026)</option>
              <option value="last_30_days">Last 30 Days</option>
              <option value="all_time">Cumulative All-Time</option>
            </select>
          </div>

          {/* District Filter */}
          <div className="space-y-1">
            <label className="font-semibold text-slate-700">District Scope:</label>
            <select
              value={districtFilter}
              onChange={e => setDistrictFilter(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 font-medium text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
            >
              <option value="all">All Maharashtra Districts</option>
              {MAHARASHTRA_DISTRICTS_DATA.map(d => (
                <option key={d.id} value={d.district}>
                  {d.district}
                </option>
              ))}
            </select>
          </div>

          {/* Skill Domain Filter */}
          <div className="space-y-1">
            <label className="font-semibold text-slate-700">Skill Domain / Sector:</label>
            <select
              value={skillCategoryFilter}
              onChange={e => setSkillCategoryFilter(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 font-medium text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
            >
              <option value="all">All Sectors</option>
              {skillCategories.filter(c => c !== 'all').map(c => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
        </div>
      </Card>

      {/* Live Data Preview Section */}
      <Card className="p-0 overflow-hidden border border-slate-200">
        <div className="px-5 py-4 bg-slate-50 border-b border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <Eye className="w-4 h-4 text-indigo-600" />
              <h3 className="text-sm font-bold text-slate-900">{reportData.title}</h3>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Live preview containing {reportData.rows.length} records ready for download
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="outline"
              leftIcon={<FileSpreadsheet className="w-3.5 h-3.5" />}
              onClick={handleExportCsv}
              className="text-xs"
            >
              Download CSV
            </Button>
            <Button
              size="sm"
              variant="primary"
              leftIcon={<Download className="w-3.5 h-3.5" />}
              onClick={handleExportJson}
              className="text-xs"
            >
              Download JSON
            </Button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-100/70 border-b border-slate-200 text-slate-700 font-semibold">
              <tr>
                {reportData.headers.map((h, i) => (
                  <th key={i} className="py-2.5 px-3.5 whitespace-nowrap">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {reportData.rows.map((row, rIdx) => (
                <tr key={rIdx} className="hover:bg-slate-50 transition-colors">
                  {row.map((cell: any, cIdx: number) => (
                    <td key={cIdx} className="py-2.5 px-3.5 font-medium">
                      {typeof cell === 'number' ? cell.toLocaleString() : String(cell)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};
