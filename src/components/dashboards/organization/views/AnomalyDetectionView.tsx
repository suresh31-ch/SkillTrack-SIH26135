import React, { useState, useMemo } from 'react';
import { AnalyticsService } from '../../../../lib/analyticsService';
import { AnomalyAlert } from '../../../../types';
import { Card, Badge, Button, Input } from '../../../ui';
import { useToast } from '../../../../context/ToastContext';
import {
  AlertTriangle,
  ShieldCheck,
  Search,
  CheckCircle2,
  Clock,
  FileText,
  AlertCircle,
  Building2,
  X,
  Filter,
  Eye,
  RotateCcw,
  UserCheck,
  Sparkles,
  Info
} from 'lucide-react';

export const AnomalyDetectionView: React.FC = () => {
  const { showToast } = useToast();
  const [anomalies, setAnomalies] = useState<AnomalyAlert[]>(() => AnalyticsService.getAnomalies());

  // Filter States
  const [selectedSeverity, setSelectedSeverity] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Modal / Review State
  const [activeAlert, setActiveAlert] = useState<AnomalyAlert | null>(null);
  const [reviewStatus, setReviewStatus] = useState<'new' | 'under_review' | 'resolved'>('under_review');
  const [reviewNotes, setReviewNotes] = useState<string>('');

  // Filtered Anomalies
  const filteredAnomalies = useMemo(() => {
    return anomalies.filter(a => {
      const matchSeverity = selectedSeverity === 'all' || a.severity === selectedSeverity;
      const matchStatus = selectedStatus === 'all' || a.status === selectedStatus;
      const matchSearch =
        searchQuery.trim() === '' ||
        a.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        a.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (a.training_center_name && a.training_center_name.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (a.rule_code && a.rule_code.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchSeverity && matchStatus && matchSearch;
    });
  }, [anomalies, selectedSeverity, selectedStatus, searchQuery]);

  // Open Review Drawer
  const handleOpenReview = (alert: AnomalyAlert) => {
    setActiveAlert(alert);
    const normalizedStatus: 'new' | 'under_review' | 'resolved' =
      alert.status === 'open' ? 'new' : alert.status === 'investigating' ? 'under_review' : (alert.status as any);
    setReviewStatus(normalizedStatus);
    setReviewNotes(alert.resolution_notes || '');
  };

  // Submit Review & Persist
  const handleSaveReview = () => {
    if (!activeAlert) return;
    const updated = AnalyticsService.updateAnomalyStatus(
      activeAlert.id,
      reviewStatus,
      reviewNotes,
      'Lead State Audit Officer (MH-HQ)'
    );
    setAnomalies(updated);
    setActiveAlert(null);
    showToast('Audit Status Updated', `Case ${activeAlert.title} updated to "${reviewStatus}".`, 'success');
  };

  // Reset to default
  const handleResetDemoData = () => {
    const fresh = AnalyticsService.resetAnomalies();
    setAnomalies(fresh);
    showToast('Anomalies Reset', 'Demo anomaly records restored to baseline.', 'info');
  };

  // Metrics
  const criticalCount = anomalies.filter(a => a.severity === 'critical' && a.status !== 'resolved').length;
  const underReviewCount = anomalies.filter(a => a.status === 'under_review' || a.status === 'investigating').length;
  const resolvedCount = anomalies.filter(a => a.status === 'resolved').length;
  const newCount = anomalies.filter(a => a.status === 'new' || a.status === 'open').length;

  return (
    <div className="space-y-6">
      {/* Disclaimer Banner: Rule-Based DEMO Detection */}
      <div className="p-4 rounded-xl border border-amber-200 bg-amber-50/70 flex items-start gap-3 text-xs text-amber-900">
        <Info className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
        <div>
          <span className="font-bold">Demo Rule-Based Anomaly Detection Heuristics</span>
          <p className="mt-0.5 text-amber-800 leading-relaxed">
            This module utilizes deterministic validation heuristics (biometric timestamp collision, rapid velocity thresholds, EPFO remittance verification, and attendance floor checks) to flag potential discrepancies for human compliance audit. Flags represent items requiring administrative verification.
          </p>
        </div>
      </div>

      {/* Header */}
      <div className="p-5 rounded-xl border border-slate-200 bg-white shadow-2xs flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Badge variant="rose">Quality Assurance & Fraud Heuristics</Badge>
            <span className="text-xs text-slate-500 font-medium">Compliance Verification Queue</span>
          </div>
          <h1 className="text-xl font-bold text-slate-900 mt-1">
            Program Integrity & Rule-Based Anomaly Audit Desk
          </h1>
          <p className="text-xs text-slate-500 mt-0.5 max-w-3xl">
            Audit potential ghost enrollments, rapid bulk placement spikes, unverified wage claims, and duplicate biometric credentials across accredited skilling institutes.
          </p>
        </div>

        <Button
          size="sm"
          variant="outline"
          leftIcon={<RotateCcw className="w-3.5 h-3.5" />}
          onClick={handleResetDemoData}
          id="btn-reset-anomalies"
        >
          Reset Demo Data
        </Button>
      </div>

      {/* Counter KPIs */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
        <Card className="p-4 border-slate-200">
          <div className="text-xs font-semibold text-slate-500">Critical Priority Alerts</div>
          <div className="text-2xl font-bold text-rose-600 mt-1">{criticalCount}</div>
          <div className="text-[11px] text-rose-600 font-medium mt-1">Immediate action required</div>
        </Card>

        <Card className="p-4 border-slate-200">
          <div className="text-xs font-semibold text-slate-500">New / Unassigned Flags</div>
          <div className="text-2xl font-bold text-amber-600 mt-1">{newCount}</div>
          <div className="text-[11px] text-amber-600 font-medium mt-1">Awaiting audit review</div>
        </Card>

        <Card className="p-4 border-slate-200">
          <div className="text-xs font-semibold text-slate-500">Under Investigation</div>
          <div className="text-2xl font-bold text-indigo-600 mt-1">{underReviewCount}</div>
          <div className="text-[11px] text-indigo-600 font-medium mt-1">Audit team dispatched</div>
        </Card>

        <Card className="p-4 border-slate-200">
          <div className="text-xs font-semibold text-slate-500">Resolved & Verified</div>
          <div className="text-2xl font-bold text-emerald-600 mt-1">{resolvedCount}</div>
          <div className="text-[11px] text-emerald-600 font-medium mt-1">Audit signed off</div>
        </Card>
      </div>

      {/* Search and Filters */}
      <Card className="p-4 border-slate-200 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        <div className="flex-1 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by title, rule code, or training center..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-indigo-500 focus:bg-white"
            />
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500 font-medium shrink-0">Severity:</span>
            <select
              value={selectedSeverity}
              onChange={e => setSelectedSeverity(e.target.value)}
              className="text-xs bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-slate-800 font-medium focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
            >
              <option value="all">All Severities</option>
              <option value="critical">Critical</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-500 font-medium shrink-0">Status:</span>
          <select
            value={selectedStatus}
            onChange={e => setSelectedStatus(e.target.value)}
            className="text-xs bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-slate-800 font-medium focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
          >
            <option value="all">All Statuses</option>
            <option value="new">New / Open</option>
            <option value="under_review">Under Review</option>
            <option value="resolved">Resolved</option>
          </select>
        </div>
      </Card>

      {/* Anomalies List */}
      <div className="space-y-3.5">
        {filteredAnomalies.map(a => {
          const isCritical = a.severity === 'critical';
          const isHigh = a.severity === 'high';
          const isMedium = a.severity === 'medium';
          const isResolved = a.status === 'resolved';

          return (
            <Card
              key={a.id}
              className={`p-5 border transition-all ${
                isResolved
                  ? 'border-slate-200 bg-slate-50/40 opacity-75'
                  : isCritical
                  ? 'border-rose-300 bg-rose-50/20'
                  : isHigh
                  ? 'border-amber-300 bg-amber-50/20'
                  : 'border-slate-200 bg-white'
              }`}
            >
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2 flex-wrap">
                  <span
                    className={`px-2.5 py-0.5 rounded text-[11px] font-bold uppercase tracking-wider border ${
                      isCritical
                        ? 'bg-rose-100 text-rose-800 border-rose-300'
                        : isHigh
                        ? 'bg-amber-100 text-amber-800 border-amber-300'
                        : isMedium
                        ? 'bg-yellow-100 text-yellow-800 border-yellow-300'
                        : 'bg-slate-100 text-slate-700 border-slate-300'
                    }`}
                  >
                    {a.severity} Severity
                  </span>

                  <span className="text-xs font-mono font-bold text-slate-500 px-2 py-0.5 rounded bg-slate-100 border border-slate-200">
                    {a.rule_code || 'RULE_AUDIT'}
                  </span>

                  <span
                    className={`px-2.5 py-0.5 rounded text-[11px] font-bold border ${
                      isResolved
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                        : a.status === 'under_review' || a.status === 'investigating'
                        ? 'bg-indigo-50 text-indigo-700 border-indigo-200'
                        : 'bg-rose-50 text-rose-700 border-rose-200'
                    }`}
                  >
                    {isResolved ? 'Resolved' : a.status === 'under_review' ? 'Under Review' : 'New / Open'}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-[11px] text-slate-400 flex items-center gap-1">
                    <Clock className="w-3 h-3" /> Logged {new Date(a.created_at).toLocaleDateString('en-IN')}
                  </span>
                  <Button
                    size="sm"
                    variant={isResolved ? 'outline' : 'primary'}
                    onClick={() => handleOpenReview(a)}
                    className="text-xs py-1 px-3 h-auto"
                    id={`btn-review-${a.id}`}
                  >
                    {isResolved ? 'View Audit Record' : 'Audit & Review'}
                  </Button>
                </div>
              </div>

              <div className="mt-3 space-y-2">
                <h3 className="text-sm font-bold text-slate-900">{a.title}</h3>
                <p className="text-xs text-slate-700 leading-relaxed">{a.description}</p>

                {a.training_center_name && (
                  <div className="flex items-center gap-1.5 text-xs text-slate-600 pt-1">
                    <Building2 className="w-3.5 h-3.5 text-slate-400" />
                    <span>Entity: <strong>{a.training_center_name}</strong></span>
                  </div>
                )}

                <div className="p-2.5 rounded-lg bg-slate-100/70 border border-slate-200 text-xs text-slate-600 font-mono">
                  <span className="font-semibold text-slate-800">Rule Trigger:</span> {a.detected_pattern}
                </div>

                {a.resolution_notes && (
                  <div className="p-2.5 rounded-lg bg-emerald-50 border border-emerald-200 text-xs text-emerald-900 mt-2">
                    <span className="font-bold flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Audit Findings / Resolution:
                    </span>
                    <p className="mt-0.5 text-emerald-800">{a.resolution_notes}</p>
                    {a.reviewed_by && (
                      <span className="text-[10px] text-emerald-600 font-medium mt-1 block">
                        Reviewed by: {a.reviewed_by} • {a.reviewed_at ? new Date(a.reviewed_at).toLocaleDateString('en-IN') : 'Recent'}
                      </span>
                    )}
                  </div>
                )}
              </div>
            </Card>
          );
        })}

        {filteredAnomalies.length === 0 && (
          <Card className="p-8 text-center border-slate-200 text-slate-500">
            <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
            <div className="font-bold text-slate-800">No anomaly records match current filters</div>
            <p className="text-xs text-slate-400 mt-0.5">All monitored indicators are within acceptable tolerance.</p>
          </Card>
        )}
      </div>

      {/* Review Modal / Drawer */}
      {activeAlert && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in duration-150">
          <Card className="max-w-xl w-full bg-white p-6 rounded-2xl shadow-xl space-y-5 border-slate-200 max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between pb-4 border-b border-slate-200">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center font-bold">
                  <AlertTriangle className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">{activeAlert.title}</h3>
                  <span className="text-[11px] text-slate-500 font-mono">{activeAlert.rule_code}</span>
                </div>
              </div>

              <button
                onClick={() => setActiveAlert(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Alert Details */}
            <div className="space-y-3 text-xs">
              <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 space-y-1.5">
                <div className="font-semibold text-slate-800">Heuristic Trigger Details:</div>
                <p className="text-slate-600 leading-relaxed">{activeAlert.description}</p>
                {activeAlert.training_center_name && (
                  <div className="pt-1 text-slate-700 font-medium">
                    Entity: <strong>{activeAlert.training_center_name}</strong>
                  </div>
                )}
              </div>

              {/* Status Selector */}
              <div className="space-y-1.5">
                <label className="font-bold text-slate-800">Audit Status:</label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setReviewStatus('new')}
                    className={`py-2 px-3 rounded-lg text-xs font-bold border transition-all cursor-pointer ${
                      reviewStatus === 'new'
                        ? 'bg-rose-50 border-rose-500 text-rose-700 ring-2 ring-rose-200'
                        : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    New / Open
                  </button>

                  <button
                    type="button"
                    onClick={() => setReviewStatus('under_review')}
                    className={`py-2 px-3 rounded-lg text-xs font-bold border transition-all cursor-pointer ${
                      reviewStatus === 'under_review'
                        ? 'bg-indigo-50 border-indigo-500 text-indigo-700 ring-2 ring-indigo-200'
                        : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    Under Review
                  </button>

                  <button
                    type="button"
                    onClick={() => setReviewStatus('resolved')}
                    className={`py-2 px-3 rounded-lg text-xs font-bold border transition-all cursor-pointer ${
                      reviewStatus === 'resolved'
                        ? 'bg-emerald-50 border-emerald-500 text-emerald-700 ring-2 ring-emerald-200'
                        : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    Resolved / Dismissed
                  </button>
                </div>
              </div>

              {/* Audit Notes Input */}
              <div className="space-y-1.5">
                <label className="font-bold text-slate-800">Audit Notes & Resolution Remarks:</label>
                <textarea
                  value={reviewNotes}
                  onChange={e => setReviewNotes(e.target.value)}
                  rows={4}
                  placeholder="Enter findings from field audit, employer callback verification, or biometric log reconciliation..."
                  className="w-full text-xs p-3 bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-indigo-500 focus:bg-white text-slate-900"
                />
              </div>
            </div>

            {/* Actions */}
            <div className="pt-3 border-t border-slate-200 flex items-center justify-between">
              <Button variant="outline" onClick={() => setActiveAlert(null)}>
                Cancel
              </Button>
              <Button variant="primary" onClick={handleSaveReview} id="btn-save-anomaly-review">
                Save Audit Decision
              </Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};
