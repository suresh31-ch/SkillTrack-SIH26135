import React, { useState, useMemo } from 'react';
import { Placement, Enrollment } from '../../../types';
import { TrainingService } from '../../../lib/trainingService';
import { Card, Badge, Button, Input, Modal } from '../../ui';
import { formatCurrency, formatDate } from '../../../lib/utils';
import {
  Briefcase,
  Plus,
  Search,
  Building,
  TrendingUp,
  CheckCircle2,
  ShieldCheck,
  Award,
  GraduationCap,
  Users,
  Building2,
  Sparkles,
  DollarSign,
  FileText,
  UploadCloud,
  FileCheck,
  Eye,
  Check,
  X,
  AlertCircle,
  Clock,
  ExternalLink,
  Filter,
  ArrowRight,
  Download,
  Calendar,
  CheckCircle,
  HelpCircle,
  Layers,
  ChevronRight,
  RefreshCw,
  Zap,
  Cpu,
  MapPin
} from 'lucide-react';
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
  AreaChart,
  Area
} from 'recharts';

interface TrainingOutcomesViewProps {
  placements: Placement[];
  enrollments: Enrollment[];
  certificationsCount: number;
  onRecordPlacement: (data: {
    candidate_id: string;
    candidate_name: string;
    training_center_id?: string;
    training_center_name?: string;
    course_name?: string;
    skills?: string[];
    company: string;
    job_role: string;
    salary: number;
    joining_date: string;
    organization_id: string;
    offer_letter_filename?: string;
    offer_letter_url?: string;
    verification_status?: 'unverified' | 'in_review' | 'verified' | 'flagged' | 'needs_review' | 'failed';
    employment_status?: 'active' | 'placed' | 'in_review' | 'resigned' | 'terminated';
    verification_method?: 'EPFO_Simulator' | 'Employer_HR_Call' | 'Bank_Salary_Credit' | 'Payslip_Upload' | 'Manual_Audit';
    verification_notes?: string;
  }) => void;
  onUpdatePlacement?: (placementId: string, updates: Partial<Placement>) => void;
  onUpdateRetentionMilestone?: (
    placementId: string,
    milestone: '3m' | '6m' | '12m',
    status: 'verified' | 'pending' | 'failed' | 'needs_review' | 'simulated_epfo_verified',
    notes?: string
  ) => void;
  onRunEpfoVerification?: (placementId: string) => void;
}

type SubTab = 'overview' | 'records' | 'offer_submission' | 'retention_tracking' | 'timeline' | 'analytics';

export const TrainingOutcomesView: React.FC<TrainingOutcomesViewProps> = ({
  placements,
  enrollments,
  certificationsCount,
  onRecordPlacement,
  onUpdatePlacement,
  onUpdateRetentionMilestone,
  onRunEpfoVerification
}) => {
  // Navigation
  const [activeSubTab, setActiveSubTab] = useState<SubTab>('overview');

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [verificationFilter, setVerificationFilter] = useState<string>('all');
  const [courseFilter, setCourseFilter] = useState<string>('all');
  const [centerFilter, setCenterFilter] = useState<string>('all');
  const [employmentFilter, setEmploymentFilter] = useState<string>('all');

  // Modals State
  const [isRecordModalOpen, setIsRecordModalOpen] = useState(false);
  const [selectedPlacementForDetails, setSelectedPlacementForDetails] = useState<Placement | null>(null);
  const [selectedPlacementForOfferLetter, setSelectedPlacementForOfferLetter] = useState<Placement | null>(null);
  const [selectedPlacementForEpfo, setSelectedPlacementForEpfo] = useState<Placement | null>(null);
  const [selectedPlacementForMilestoneEdit, setSelectedPlacementForMilestoneEdit] = useState<Placement | null>(null);
  const [selectedTimelineCandidateId, setSelectedTimelineCandidateId] = useState<string>(placements[0]?.id || 'plc-001');

  // Record Form State
  const [selectedCandidateId, setSelectedCandidateId] = useState(enrollments[0]?.candidate_id || '');
  const [candidateNameInput, setCandidateNameInput] = useState(enrollments[0]?.candidate_name || '');
  const [trainingCenterName, setTrainingCenterName] = useState('Maharashtra State Innovation Academy (MSIAS)');
  const [courseNameInput, setCourseNameInput] = useState('Full Stack Cloud Application Engineering');
  const [company, setCompany] = useState('');
  const [jobRole, setJobRole] = useState('');
  const [salary, setSalary] = useState(540000);
  const [joiningDate, setJoiningDate] = useState(new Date().toISOString().split('T')[0]);
  const [offerFilename, setOfferFilename] = useState('');
  const [verificationMethod, setVerificationMethod] = useState<'EPFO_Simulator' | 'Employer_HR_Call' | 'Bank_Salary_Credit' | 'Payslip_Upload'>('EPFO_Simulator');
  const [verificationStatusInput, setVerificationStatusInput] = useState<'verified' | 'in_review' | 'needs_review' | 'unverified'>('verified');

  // OCR Upload State
  const [isScanningOcr, setIsScanningOcr] = useState(false);
  const [ocrSuccess, setOcrSuccess] = useState(false);
  const [ocrDetails, setOcrDetails] = useState<{
    company: string;
    role: string;
    salary: number;
    joiningDate: string;
    candidateName: string;
    confidence: number;
    skills: string[];
    filename: string;
  } | null>(null);

  // Milestone Edit Form State
  const [milestone3mStatus, setMilestone3mStatus] = useState<any>('verified');
  const [milestone6mStatus, setMilestone6mStatus] = useState<any>('verified');
  const [milestone12mStatus, setMilestone12mStatus] = useState<any>('pending');
  const [milestoneNotes, setMilestoneNotes] = useState('');

  // Metrics Calculations
  const totalTrained = enrollments.length;
  const totalCompleted = enrollments.filter(e => e.completion_status === 'completed').length;
  const totalPlaced = placements.length;
  const placementRate = totalCompleted > 0 ? Math.round((totalPlaced / totalCompleted) * 100) : 85;
  const verifiedPlacementsCount = placements.filter(p => p.verification_status === 'verified').length;
  
  const retention3mCount = placements.filter(p => p.retention_3m === 'verified' || p.retention_3m === 'simulated_epfo_verified').length;
  const retention3mRate = totalPlaced > 0 ? Math.round((retention3mCount / totalPlaced) * 100) : 88;

  const retention6mCount = placements.filter(p => p.retention_6m === 'verified' || p.retention_6m === 'simulated_epfo_verified').length;
  const retention6mRate = totalPlaced > 0 ? Math.round((retention6mCount / totalPlaced) * 100) : 82;

  const retention12mCount = placements.filter(p => p.retention_12m === 'verified' || p.retention_12m === 'simulated_epfo_verified').length;
  const retention12mRate = totalPlaced > 0 ? Math.round((retention12mCount / totalPlaced) * 100) : 67;

  const avgSalary =
    placements.length > 0
      ? Math.round(placements.reduce((acc, p) => acc + p.salary, 0) / placements.length)
      : 524000;

  // Filtered Placements
  const filteredPlacements = useMemo(() => {
    return placements.filter(p => {
      const matchSearch =
        !searchQuery ||
        (p.candidate_name && p.candidate_name.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (p.company && p.company.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (p.job_role && p.job_role.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (p.course_name && p.course_name.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (p.training_center_name && p.training_center_name.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (p.skills && p.skills.some(sk => sk.toLowerCase().includes(searchQuery.toLowerCase())));

      const matchVerification =
        verificationFilter === 'all' || p.verification_status === verificationFilter;

      const matchEmployment =
        employmentFilter === 'all' || p.employment_status === employmentFilter;

      const matchCourse =
        courseFilter === 'all' || (p.course_name && p.course_name.includes(courseFilter));

      const matchCenter =
        centerFilter === 'all' || (p.training_center_name && p.training_center_name.includes(centerFilter));

      return matchSearch && matchVerification && matchEmployment && matchCourse && matchCenter;
    });
  }, [placements, searchQuery, verificationFilter, employmentFilter, courseFilter, centerFilter]);

  // Selected candidate for timeline view
  const currentTimelinePlacement = useMemo(() => {
    return placements.find(p => p.id === selectedTimelineCandidateId) || placements[0];
  }, [placements, selectedTimelineCandidateId]);

  // Handle Form Submit for new placement
  const handleRecordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!company.trim() || !jobRole.trim()) return;

    const candidate = enrollments.find(e => e.candidate_id === selectedCandidateId) || enrollments[0];

    onRecordPlacement({
      candidate_id: candidate?.candidate_id || `cand-${Date.now()}`,
      candidate_name: candidateNameInput.trim() || candidate?.candidate_name || 'Aarav Patil',
      training_center_name: trainingCenterName,
      course_name: courseNameInput,
      skills: ['React.js & TypeScript', 'Node.js & Express API', 'PostgreSQL & Database Design'],
      company: company.trim(),
      job_role: jobRole.trim(),
      salary: Number(salary) || 500000,
      joining_date: joiningDate,
      organization_id: 'org-maha-001',
      offer_letter_filename: offerFilename || `Offer_${company.replace(/\s+/g, '_')}_${candidate?.candidate_name?.replace(/\s+/g, '_') || 'Candidate'}.pdf`,
      verification_status: verificationStatusInput,
      employment_status: 'active',
      verification_method: verificationMethod,
      verification_notes: `Manual placement record registered via Training Center Outcome Portal on ${new Date().toLocaleDateString()}.`
    });

    setIsRecordModalOpen(false);
    setCompany('');
    setJobRole('');
    setOfferFilename('');
  };

  // OCR Document Upload Simulation
  const handleSimulateOcrUpload = (sampleName?: string) => {
    const filename = sampleName || 'Offer_Letter_Apex_Infotech_Aarav_Patil.pdf';
    setIsScanningOcr(true);
    setOcrSuccess(false);

    setTimeout(() => {
      const extracted = TrainingService.simulateOcrExtraction(filename, candidateNameInput);
      setOcrDetails({
        company: extracted.extractedCompany,
        role: extracted.extractedRole,
        salary: extracted.extractedSalary,
        joiningDate: extracted.extractedJoiningDate,
        candidateName: extracted.extractedCandidateName,
        confidence: extracted.confidenceScore,
        skills: extracted.skillsIdentified,
        filename
      });

      // Auto-fill form fields
      setCompany(extracted.extractedCompany);
      setJobRole(extracted.extractedRole);
      setSalary(extracted.extractedSalary);
      setJoiningDate(extracted.extractedJoiningDate);
      setCandidateNameInput(extracted.extractedCandidateName);
      setOfferFilename(filename);

      setIsScanningOcr(false);
      setOcrSuccess(true);
    }, 1200);
  };

  // Save Milestone updates
  const handleSaveMilestoneEdits = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPlacementForMilestoneEdit) return;

    if (onUpdatePlacement) {
      onUpdatePlacement(selectedPlacementForMilestoneEdit.id, {
        retention_3m: milestone3mStatus,
        retention_6m: milestone6mStatus,
        retention_12m: milestone12mStatus,
        verification_notes: milestoneNotes ? `[Milestone Update]: ${milestoneNotes}` : selectedPlacementForMilestoneEdit.verification_notes
      });
    } else if (onUpdateRetentionMilestone) {
      onUpdateRetentionMilestone(selectedPlacementForMilestoneEdit.id, '3m', milestone3mStatus);
      onUpdateRetentionMilestone(selectedPlacementForMilestoneEdit.id, '6m', milestone6mStatus);
      onUpdateRetentionMilestone(selectedPlacementForMilestoneEdit.id, '12m', milestone12mStatus, milestoneNotes);
    }

    setSelectedPlacementForMilestoneEdit(null);
  };

  const openMilestoneEditModal = (plc: Placement) => {
    setSelectedPlacementForMilestoneEdit(plc);
    setMilestone3mStatus(plc.retention_3m || 'pending');
    setMilestone6mStatus(plc.retention_6m || 'pending');
    setMilestone12mStatus(plc.retention_12m || 'pending');
    setMilestoneNotes(plc.verification_notes || '');
  };

  // Trigger simulated EPFO verification
  const handleExecuteEpfoVerification = (placementId: string) => {
    if (onRunEpfoVerification) {
      onRunEpfoVerification(placementId);
    } else {
      TrainingService.runEpfoVerification(placementId);
    }
    setSelectedPlacementForEpfo(null);
  };

  // Corporate Partners
  const topHiringPartners = [
    { name: 'Apex Infotech Solutions', hires: 4, sector: 'Cloud & Full Stack', avgPackage: 540000, retentionRate: 100 },
    { name: 'Infosys BPM & Cloud Labs', hires: 3, sector: 'Enterprise IT', avgPackage: 620000, retentionRate: 100 },
    { name: 'Tata AutoComp Systems', hires: 3, sector: 'EV & Automotive', avgPackage: 460000, retentionRate: 100 },
    { name: 'Kalyani Advanced Precision', hires: 2, sector: 'Industrial CNC', avgPackage: 420000, retentionRate: 100 },
    { name: 'Cognizant AI Labs', hires: 2, sector: 'Data & AI', avgPackage: 580000, retentionRate: 100 },
    { name: 'Mahindra Green Energy Ltd', hires: 1, sector: 'EV Powertrain', avgPackage: 490000, retentionRate: 100 }
  ];

  // Chart Data: Course Wise Placements
  const coursePlacementChartData = [
    { name: 'Cloud & Web Dev', enrolled: 35, placed: 32, rate: 91 },
    { name: 'EV & Battery Tech', enrolled: 30, placed: 26, rate: 86 },
    { name: 'CNC & Automation', enrolled: 25, placed: 22, rate: 88 },
    { name: 'Solar PV & Grid', enrolled: 20, placed: 17, rate: 85 }
  ];

  // Chart Data: Retention Curve
  const retentionCurveData = [
    { milestone: 'Day 1 Joining', retainedRate: 100, verifiedCount: totalPlaced },
    { milestone: '3-Month Milestone', retainedRate: retention3mRate, verifiedCount: retention3mCount },
    { milestone: '6-Month Milestone', retainedRate: retention6mRate, verifiedCount: retention6mCount },
    { milestone: '12-Month Milestone', retainedRate: retention12mRate, verifiedCount: retention12mCount }
  ];

  // Chart Data: Salary Bands
  const salaryBandData = [
    { range: '₹3.5L - ₹4.5L', count: placements.filter(p => p.salary < 450000).length, fill: '#6366f1' },
    { range: '₹4.5L - ₹5.5L', count: placements.filter(p => p.salary >= 450000 && p.salary < 550000).length, fill: '#10b981' },
    { range: '₹5.5L - ₹6.5L', count: placements.filter(p => p.salary >= 550000 && p.salary < 650000).length, fill: '#8b5cf6' },
    { range: '₹6.5L+', count: placements.filter(p => p.salary >= 650000).length, fill: '#f59e0b' }
  ];

  const getStatusBadge = (status?: string) => {
    switch (status) {
      case 'verified':
      case 'simulated_epfo_verified':
        return <Badge variant="success" className="text-[10px]"><CheckCircle2 className="w-3 h-3 mr-1" /> Verified</Badge>;
      case 'in_review':
        return <Badge variant="purple" className="text-[10px]"><Clock className="w-3 h-3 mr-1" /> In Review</Badge>;
      case 'needs_review':
        return <Badge variant="warning" className="text-[10px]"><AlertCircle className="w-3 h-3 mr-1" /> Needs Review</Badge>;
      case 'failed':
        return <Badge variant="danger" className="text-[10px]"><X className="w-3 h-3 mr-1" /> Failed</Badge>;
      default:
        return <Badge variant="default" className="text-[10px]"><Clock className="w-3 h-3 mr-1" /> Pending</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {/* 1. Master Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white shadow-md">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-semibold border border-emerald-500/30 mb-2">
            <Briefcase className="w-3.5 h-3.5" />
            SIH26135 • Placement & Outcome Verification Module
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
            Placement & Longitudinal Employment Outcome Tracking
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl">
            Real-time tracking of vocational trainees from corporate recruitment to 3, 6, and 12-month retention with automated EPFO wage remittance validation.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <Button
            size="sm"
            variant="secondary"
            onClick={() => setActiveSubTab('offer_submission')}
            className="bg-white/10 hover:bg-white/20 text-white border-white/20 text-xs font-bold"
          >
            <UploadCloud className="w-3.5 h-3.5 mr-1.5" />
            OCR Offer Upload
          </Button>
          <Button
            size="sm"
            variant="primary"
            onClick={() => setIsRecordModalOpen(true)}
            className="font-bold bg-emerald-500 hover:bg-emerald-400 text-slate-950"
          >
            <Plus className="w-4 h-4 mr-1.5" />
            Record Placement
          </Button>
        </div>
      </div>

      {/* 2. Top Outcome Working Metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5">
        <Card className="p-3.5 bg-white border-slate-200 shadow-xs">
          <span className="text-[11px] font-bold text-slate-500 uppercase">Candidates Trained</span>
          <div className="text-xl font-black text-slate-900 mt-1">{totalTrained} Trainees</div>
          <span className="text-[10px] text-slate-400 block mt-0.5">{totalCompleted} Graduated</span>
        </Card>

        <Card className="p-3.5 bg-white border-slate-200 shadow-xs">
          <span className="text-[11px] font-bold text-emerald-700 uppercase">Candidates Placed</span>
          <div className="text-xl font-black text-emerald-800 mt-1">{totalPlaced} Placed</div>
          <span className="text-[10px] text-emerald-600 font-semibold block mt-0.5">{placementRate}% Placement Rate</span>
        </Card>

        <Card className="p-3.5 bg-white border-slate-200 shadow-xs">
          <span className="text-[11px] font-bold text-indigo-700 uppercase">Offers Received</span>
          <div className="text-xl font-black text-indigo-900 mt-1">{totalPlaced} Offers</div>
          <span className="text-[10px] text-indigo-600 font-semibold block mt-0.5">100% Documented</span>
        </Card>

        <Card className="p-3.5 bg-white border-slate-200 shadow-xs">
          <span className="text-[11px] font-bold text-teal-700 uppercase">Employment Verified</span>
          <div className="text-xl font-black text-teal-800 mt-1">{verifiedPlacementsCount} Verified</div>
          <span className="text-[10px] text-teal-600 font-semibold block mt-0.5">EPFO / Bank Verified</span>
        </Card>

        <Card className="p-3.5 bg-white border-slate-200 shadow-xs">
          <span className="text-[11px] font-bold text-purple-700 uppercase">6M Retention Rate</span>
          <div className="text-xl font-black text-purple-900 mt-1">{retention6mRate}%</div>
          <span className="text-[10px] text-purple-600 font-semibold block mt-0.5">{retention6mCount} Active at 6 Months</span>
        </Card>

        <Card className="p-3.5 bg-white border-slate-200 shadow-xs">
          <span className="text-[11px] font-bold text-amber-700 uppercase">Average Package</span>
          <div className="text-base sm:text-lg font-black text-amber-800 mt-1">{formatCurrency(avgSalary)}</div>
          <span className="text-[10px] text-amber-600 font-semibold block mt-0.5">Per Annum (CTC)</span>
        </Card>
      </div>

      {/* 3. Sub-Navigation Tabs */}
      <div className="flex items-center gap-1.5 border-b border-slate-200 pb-2 overflow-x-auto">
        <button
          onClick={() => setActiveSubTab('overview')}
          className={`px-3.5 py-2 rounded-lg text-xs font-bold transition-colors shrink-0 flex items-center gap-1.5 ${
            activeSubTab === 'overview'
              ? 'bg-indigo-600 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
          }`}
        >
          <Briefcase className="w-3.5 h-3.5" />
          Dashboard Overview
        </button>

        <button
          onClick={() => setActiveSubTab('records')}
          className={`px-3.5 py-2 rounded-lg text-xs font-bold transition-colors shrink-0 flex items-center gap-1.5 ${
            activeSubTab === 'records'
              ? 'bg-indigo-600 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          Placement Records ({filteredPlacements.length})
        </button>

        <button
          onClick={() => setActiveSubTab('offer_submission')}
          className={`px-3.5 py-2 rounded-lg text-xs font-bold transition-colors shrink-0 flex items-center gap-1.5 ${
            activeSubTab === 'offer_submission'
              ? 'bg-indigo-600 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
          }`}
        >
          <UploadCloud className="w-3.5 h-3.5" />
          Offer Letter OCR Upload
        </button>

        <button
          onClick={() => setActiveSubTab('retention_tracking')}
          className={`px-3.5 py-2 rounded-lg text-xs font-bold transition-colors shrink-0 flex items-center gap-1.5 ${
            activeSubTab === 'retention_tracking'
              ? 'bg-indigo-600 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
          }`}
        >
          <Clock className="w-3.5 h-3.5" />
          3/6/12M Retention Tracker
        </button>

        <button
          onClick={() => setActiveSubTab('timeline')}
          className={`px-3.5 py-2 rounded-lg text-xs font-bold transition-colors shrink-0 flex items-center gap-1.5 ${
            activeSubTab === 'timeline'
              ? 'bg-indigo-600 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
          }`}
        >
          <TrendingUp className="w-3.5 h-3.5" />
          Candidate Career Timeline
        </button>

        <button
          onClick={() => setActiveSubTab('analytics')}
          className={`px-3.5 py-2 rounded-lg text-xs font-bold transition-colors shrink-0 flex items-center gap-1.5 ${
            activeSubTab === 'analytics'
              ? 'bg-indigo-600 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5" />
          Placement Analytics & Charts
        </button>
      </div>

      {/* SUB-VIEW 1: OVERVIEW */}
      {activeSubTab === 'overview' && (
        <div className="space-y-6">
          {/* Quick OCR Banner */}
          <div className="p-4 rounded-xl bg-indigo-50 border border-indigo-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center shrink-0">
                <UploadCloud className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-900">Automated Offer Letter Extraction & Verification</h4>
                <p className="text-xs text-slate-600 mt-0.5">
                  Upload corporate offer letters in PDF or image format to instantly extract candidate name, CTC, role, and joining date.
                </p>
              </div>
            </div>

            <Button
              size="sm"
              variant="primary"
              onClick={() => setActiveSubTab('offer_submission')}
              className="bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shrink-0"
            >
              Launch OCR Parser
            </Button>
          </div>

          {/* Hiring Partners & Retention Curve */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            {/* Top Hiring Corporate Partners */}
            <Card className="p-5 bg-white border-slate-200 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-black text-slate-900">Key Corporate Hiring Partners</h3>
                  <p className="text-xs text-slate-500 mt-0.5">Top regional enterprises actively hiring SkillTrack certified candidates</p>
                </div>
                <Badge variant="purple">MoU Verified</Badge>
              </div>

              <div className="space-y-2.5">
                {topHiringPartners.map((partner, idx) => (
                  <div key={idx} className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between gap-2">
                    <div className="space-y-0.5">
                      <h4 className="text-xs font-bold text-slate-900">{partner.name}</h4>
                      <p className="text-[11px] text-slate-500">{partner.sector}</p>
                      <div className="text-[10px] text-emerald-700 font-bold">
                        Avg CTC: {formatCurrency(partner.avgPackage)}/yr • {partner.retentionRate}% Retention
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-base font-black text-indigo-900">{partner.hires}</span>
                      <span className="text-[10px] text-slate-400 block uppercase">Hired</span>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* Longitudinal 3/6/12 Month Retention Curve */}
            <Card className="p-5 bg-white border-slate-200 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-black text-slate-900">Longitudinal Retention Milestone Curve</h3>
                  <p className="text-xs text-slate-500 mt-0.5">Employment continuity verified through simulated EPFO UAN monthly credits</p>
                </div>
                <Badge variant="success">EPFO Verified</Badge>
              </div>

              <div className="h-56">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={retentionCurveData}>
                    <defs>
                      <linearGradient id="retentionGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.4}/>
                        <stop offset="95%" stopColor="#10b981" stopOpacity={0.0}/>
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="milestone" stroke="#94a3b8" tick={{ fill: '#475569', fontSize: 10 }} />
                    <YAxis domain={[50, 100]} stroke="#94a3b8" tick={{ fill: '#475569', fontSize: 10 }} />
                    <Tooltip formatter={(value: any) => [`${value}% Retention`, 'Rate']} />
                    <Area type="monotone" dataKey="retainedRate" stroke="#10b981" strokeWidth={2.5} fillOpacity={1} fill="url(#retentionGrad)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>

              <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-100 text-center">
                <div className="p-2 rounded-lg bg-emerald-50/60 border border-emerald-100">
                  <span className="text-[10px] font-bold text-slate-500 uppercase">3-Month</span>
                  <div className="text-xs font-black text-emerald-800 mt-0.5">{retention3mRate}%</div>
                </div>
                <div className="p-2 rounded-lg bg-emerald-50/60 border border-emerald-100">
                  <span className="text-[10px] font-bold text-slate-500 uppercase">6-Month</span>
                  <div className="text-xs font-black text-emerald-800 mt-0.5">{retention6mRate}%</div>
                </div>
                <div className="p-2 rounded-lg bg-purple-50/60 border border-purple-100">
                  <span className="text-[10px] font-bold text-slate-500 uppercase">12-Month</span>
                  <div className="text-xs font-black text-purple-800 mt-0.5">{retention12mRate}%</div>
                </div>
              </div>
            </Card>
          </div>

          {/* Quick Placements List */}
          <Card className="p-5 bg-white border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-black text-slate-900">Recent Placement Dispatches</h3>
                <p className="text-xs text-slate-500 mt-0.5">Most recently onboarded candidates</p>
              </div>
              <Button size="sm" variant="ghost" onClick={() => setActiveSubTab('records')} className="text-xs font-bold text-indigo-600">
                View All ({placements.length}) <ChevronRight className="w-3.5 h-3.5 ml-1" />
              </Button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 uppercase font-bold text-[10px]">
                  <tr>
                    <th className="p-3">Candidate</th>
                    <th className="p-3">Hiring Enterprise</th>
                    <th className="p-3">Job Role</th>
                    <th className="p-3">Annual CTC</th>
                    <th className="p-3">Joining Date</th>
                    <th className="p-3">Verification</th>
                    <th className="p-3">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {placements.slice(0, 5).map(plc => (
                    <tr key={plc.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="p-3 font-bold text-slate-900">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-lg bg-indigo-100 text-indigo-800 font-bold flex items-center justify-center text-xs">
                            {(plc.candidate_name || 'A').charAt(0)}
                          </div>
                          <span>{plc.candidate_name}</span>
                        </div>
                      </td>
                      <td className="p-3 font-semibold text-slate-800">{plc.company}</td>
                      <td className="p-3 text-slate-600">{plc.job_role}</td>
                      <td className="p-3 font-black text-emerald-700">{formatCurrency(plc.salary)}</td>
                      <td className="p-3 text-slate-500">{formatDate(plc.joining_date)}</td>
                      <td className="p-3">{getStatusBadge(plc.verification_status)}</td>
                      <td className="p-3">
                        <div className="flex items-center gap-1.5">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => {
                              setSelectedTimelineCandidateId(plc.id);
                              setActiveSubTab('timeline');
                            }}
                            className="text-[11px] h-7 px-2"
                          >
                            Timeline
                          </Button>
                          <Button
                            size="sm"
                            variant="secondary"
                            onClick={() => setSelectedPlacementForDetails(plc)}
                            className="text-[11px] h-7 px-2"
                          >
                            Details
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      )}

      {/* SUB-VIEW 2: PLACEMENT RECORDS (FULL TABLE) */}
      {activeSubTab === 'records' && (
        <Card className="p-5 bg-white border-slate-200 shadow-xs space-y-4">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-3 border-b border-slate-100">
            <div>
              <h3 className="text-sm font-black text-slate-900">Placement & Employment Outcomes Registry</h3>
              <p className="text-xs text-slate-500 mt-0.5">Comprehensive audit table of verified corporate placements, CTC compensation, and retention status</p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <Button
                size="sm"
                variant="primary"
                onClick={() => setIsRecordModalOpen(true)}
                className="bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold"
              >
                <Plus className="w-3.5 h-3.5 mr-1" />
                Add Record
              </Button>
            </div>
          </div>

          {/* Search and Multi-Faceted Filters */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2.5 pt-1">
            <div className="relative sm:col-span-2">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search candidate, company, role, skills, center..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-slate-200 bg-slate-50 text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <select
                value={verificationFilter}
                onChange={e => setVerificationFilter(e.target.value)}
                className="w-full p-2 text-xs rounded-lg border border-slate-200 bg-slate-50 text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="all">All Verification Statuses</option>
                <option value="verified">Verified (EPFO/Audit)</option>
                <option value="in_review">In Review</option>
                <option value="needs_review">Needs Review</option>
                <option value="unverified">Unverified</option>
                <option value="failed">Failed</option>
              </select>
            </div>

            <div>
              <select
                value={courseFilter}
                onChange={e => setCourseFilter(e.target.value)}
                className="w-full p-2 text-xs rounded-lg border border-slate-200 bg-slate-50 text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="all">All Vocational Courses</option>
                <option value="Full Stack">Full Stack Cloud Engineering</option>
                <option value="Electric Mobility">EV & High-Voltage Battery</option>
                <option value="CNC">Advanced CNC Machining</option>
              </select>
            </div>

            <div>
              <select
                value={employmentFilter}
                onChange={e => setEmploymentFilter(e.target.value)}
                className="w-full p-2 text-xs rounded-lg border border-slate-200 bg-slate-50 text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="all">All Employment Statuses</option>
                <option value="active">Active Employed</option>
                <option value="placed">Placed (Pending Onboarding)</option>
                <option value="in_review">In Review</option>
              </select>
            </div>
          </div>

          {/* Records Table */}
          <div className="overflow-x-auto rounded-xl border border-slate-200">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 uppercase font-bold text-[10px]">
                <tr>
                  <th className="p-3.5">Candidate Details</th>
                  <th className="p-3.5">Training Center & Course</th>
                  <th className="p-3.5">Hiring Employer & Role</th>
                  <th className="p-3.5">Annual CTC</th>
                  <th className="p-3.5">Joining Date</th>
                  <th className="p-3.5">Verification</th>
                  <th className="p-3.5">Retention Milestones</th>
                  <th className="p-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredPlacements.map(plc => (
                  <tr key={plc.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="p-3.5 font-bold text-slate-900">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-800 font-bold flex items-center justify-center text-xs shrink-0">
                          {(plc.candidate_name || 'A').charAt(0)}
                        </div>
                        <div>
                          <span className="font-bold block text-slate-900">{plc.candidate_name}</span>
                          <span className="text-[10px] text-slate-400 font-normal">ID: {plc.candidate_id || plc.id}</span>
                        </div>
                      </div>
                    </td>

                    <td className="p-3.5">
                      <div className="font-semibold text-slate-800 max-w-[200px] truncate">{plc.training_center_name || 'MSIAS Pune'}</div>
                      <div className="text-[11px] text-slate-500 truncate max-w-[200px]">{plc.course_name || 'Full Stack Cloud Dev'}</div>
                      {plc.skills && plc.skills.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-1">
                          {plc.skills.slice(0, 2).map((sk, sidx) => (
                            <span key={sidx} className="text-[9px] px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 font-medium">
                              {sk}
                            </span>
                          ))}
                        </div>
                      )}
                    </td>

                    <td className="p-3.5">
                      <div className="font-bold text-slate-900">{plc.company}</div>
                      <div className="text-slate-600 text-[11px]">{plc.job_role}</div>
                    </td>

                    <td className="p-3.5 font-black text-emerald-700">
                      {formatCurrency(plc.salary)} <span className="text-[10px] font-normal text-slate-400">/ yr</span>
                    </td>

                    <td className="p-3.5 text-slate-600">{formatDate(plc.joining_date)}</td>

                    <td className="p-3.5">
                      {getStatusBadge(plc.verification_status)}
                    </td>

                    <td className="p-3.5">
                      <div className="flex items-center gap-1.5">
                        <span
                          title="3-Month Milestone"
                          className={`text-[9px] px-1.5 py-0.5 rounded font-bold ${
                            plc.retention_3m === 'verified' || plc.retention_3m === 'simulated_epfo_verified'
                              ? 'bg-emerald-100 text-emerald-800'
                              : plc.retention_3m === 'failed'
                              ? 'bg-rose-100 text-rose-800'
                              : 'bg-slate-100 text-slate-500'
                          }`}
                        >
                          3M: {plc.retention_3m === 'verified' || plc.retention_3m === 'simulated_epfo_verified' ? '✓' : '…'}
                        </span>
                        <span
                          title="6-Month Milestone"
                          className={`text-[9px] px-1.5 py-0.5 rounded font-bold ${
                            plc.retention_6m === 'verified' || plc.retention_6m === 'simulated_epfo_verified'
                              ? 'bg-emerald-100 text-emerald-800'
                              : plc.retention_6m === 'failed'
                              ? 'bg-rose-100 text-rose-800'
                              : 'bg-slate-100 text-slate-500'
                          }`}
                        >
                          6M: {plc.retention_6m === 'verified' || plc.retention_6m === 'simulated_epfo_verified' ? '✓' : '…'}
                        </span>
                        <span
                          title="12-Month Milestone"
                          className={`text-[9px] px-1.5 py-0.5 rounded font-bold ${
                            plc.retention_12m === 'verified' || plc.retention_12m === 'simulated_epfo_verified'
                              ? 'bg-emerald-100 text-emerald-800'
                              : plc.retention_12m === 'failed'
                              ? 'bg-rose-100 text-rose-800'
                              : 'bg-slate-100 text-slate-500'
                          }`}
                        >
                          12M: {plc.retention_12m === 'verified' || plc.retention_12m === 'simulated_epfo_verified' ? '✓' : '…'}
                        </span>
                      </div>
                    </td>

                    <td className="p-3.5 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => {
                            setSelectedTimelineCandidateId(plc.id);
                            setActiveSubTab('timeline');
                          }}
                          className="h-7 px-2 text-[11px]"
                          title="View Candidate Career Timeline"
                        >
                          Timeline
                        </Button>

                        <Button
                          size="sm"
                          variant="secondary"
                          onClick={() => openMilestoneEditModal(plc)}
                          className="h-7 px-2 text-[11px]"
                          title="Update 3/6/12 Month Retention"
                        >
                          Milestones
                        </Button>

                        <Button
                          size="sm"
                          variant="primary"
                          onClick={() => setSelectedPlacementForEpfo(plc)}
                          className="h-7 px-2 text-[11px] bg-indigo-600 text-white"
                          title="Run EPFO UAN Remittance Verification"
                        >
                          EPFO
                        </Button>

                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => setSelectedPlacementForDetails(plc)}
                          className="h-7 px-1.5 text-slate-500"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredPlacements.length === 0 && (
            <div className="p-8 text-center bg-slate-50 rounded-xl border border-slate-200">
              <Briefcase className="w-8 h-8 text-slate-400 mx-auto mb-2" />
              <h4 className="text-xs font-bold text-slate-800">No Matching Placements Found</h4>
              <p className="text-[11px] text-slate-500 mt-0.5">Try clearing filters or search queries.</p>
            </div>
          )}
        </Card>
      )}

      {/* SUB-VIEW 3: OFFER LETTER OCR UPLOAD & EXTRACTION */}
      {activeSubTab === 'offer_submission' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column: Upload Dropzone & Sample Letters */}
          <Card className="p-5 bg-white border-slate-200 shadow-xs space-y-4">
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 text-[10px] font-bold mb-1.5">
                <Zap className="w-3 h-3" />
                OCR Document Engine
              </div>
              <h3 className="text-sm font-black text-slate-900">Upload Offer Letter</h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Simulate optical character recognition to extract corporate metadata
              </p>
            </div>

            {/* Dropzone */}
            <div
              onClick={() => handleSimulateOcrUpload()}
              className={`p-6 rounded-xl border-2 border-dashed text-center cursor-pointer transition-all ${
                isScanningOcr
                  ? 'border-indigo-500 bg-indigo-50/50'
                  : 'border-slate-300 hover:border-indigo-400 hover:bg-slate-50'
              }`}
            >
              <UploadCloud className={`w-8 h-8 mx-auto mb-2 ${isScanningOcr ? 'text-indigo-600 animate-bounce' : 'text-slate-400'}`} />
              <h4 className="text-xs font-bold text-slate-800">
                {isScanningOcr ? 'Scanning & Parsing Document...' : 'Click to Upload PDF / Image'}
              </h4>
              <p className="text-[10px] text-slate-500 mt-1">
                Supports .PDF, .PNG, .JPG (Max 15MB)
              </p>
            </div>

            {/* Quick Sample Offer Letters */}
            <div className="space-y-2 pt-2 border-t border-slate-100">
              <label className="block text-[11px] font-bold text-slate-700 uppercase">
                Or Test with Demo Corporate Offer Letters:
              </label>
              <div className="space-y-1.5">
                {[
                  { name: 'Apex_Infotech_Offer_Aarav.pdf', company: 'Apex Infotech', role: 'Full Stack Dev', ctc: '₹5.40L' },
                  { name: 'Infosys_Cloud_Offer_Sneha.pdf', company: 'Infosys BPM', role: 'UI Specialist', ctc: '₹6.20L' },
                  { name: 'Tata_AutoComp_Priya.pdf', company: 'Tata AutoComp', role: 'EV Trainee', ctc: '₹4.80L' },
                  { name: 'Kalyani_Precision_Vikas.pdf', company: 'Kalyani Precision', role: 'CNC Operator', ctc: '₹4.40L' }
                ].map((sample, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleSimulateOcrUpload(sample.name)}
                    className="w-full p-2.5 rounded-lg border border-slate-200 bg-slate-50 hover:bg-indigo-50 hover:border-indigo-200 flex items-center justify-between text-left transition-all"
                  >
                    <div className="space-y-0.5">
                      <span className="text-xs font-bold text-slate-900 block">{sample.name}</span>
                      <span className="text-[10px] text-slate-500">{sample.company} • {sample.role}</span>
                    </div>
                    <span className="text-xs font-bold text-emerald-700">{sample.ctc}</span>
                  </button>
                ))}
              </div>
            </div>
          </Card>

          {/* Right Column: OCR Extraction Review Form */}
          <Card className="lg:col-span-2 p-5 bg-white border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-sm font-black text-slate-900">Extracted Placement Metadata</h3>
                <p className="text-xs text-slate-500 mt-0.5">Review, verify, and submit parsed corporate offer into registry</p>
              </div>

              {ocrDetails && (
                <Badge variant="success" className="text-xs font-bold">
                  ✓ OCR Confidence: {ocrDetails.confidence}%
                </Badge>
              )}
            </div>

            {isScanningOcr && (
              <div className="p-8 text-center space-y-3 bg-indigo-50/50 rounded-xl border border-indigo-100">
                <RefreshCw className="w-6 h-6 text-indigo-600 animate-spin mx-auto" />
                <h4 className="text-xs font-bold text-indigo-950">AI Document Parser Analyzing Header & CTC Grids...</h4>
                <p className="text-[11px] text-indigo-700">Detecting entity names, annual remuneration, and official seal validation...</p>
              </div>
            )}

            {!isScanningOcr && (
              <form onSubmit={handleRecordSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Target Candidate Graduate</label>
                    <select
                      value={selectedCandidateId}
                      onChange={e => {
                        setSelectedCandidateId(e.target.value);
                        const cand = enrollments.find(en => en.candidate_id === e.target.value);
                        if (cand) setCandidateNameInput(cand.candidate_name || '');
                      }}
                      className="w-full p-2 text-xs rounded-lg border border-slate-200 bg-white text-slate-900 focus:ring-2 focus:ring-indigo-500"
                    >
                      {enrollments.map(e => (
                        <option key={e.id} value={e.candidate_id}>
                          {e.candidate_name} ({e.course_name})
                        </option>
                      ))}
                    </select>
                  </div>

                  <Input
                    label="Candidate Name"
                    value={candidateNameInput}
                    onChange={e => setCandidateNameInput(e.target.value)}
                    required
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <Input
                    label="Hiring Enterprise / Employer"
                    placeholder="e.g. Apex Infotech Solutions"
                    value={company}
                    onChange={e => setCompany(e.target.value)}
                    required
                  />

                  <Input
                    label="Job Role / Designation"
                    placeholder="e.g. Junior Full Stack Engineer"
                    value={jobRole}
                    onChange={e => setJobRole(e.target.value)}
                    required
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                  <Input
                    label="Annual CTC Package (INR ₹)"
                    type="number"
                    min={100000}
                    step={10000}
                    value={salary}
                    onChange={e => setSalary(Number(e.target.value))}
                    required
                  />

                  <Input
                    label="Joining / Onboarding Date"
                    type="date"
                    value={joiningDate}
                    onChange={e => setJoiningDate(e.target.value)}
                    required
                  />

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Verification Method</label>
                    <select
                      value={verificationMethod}
                      onChange={e => setVerificationMethod(e.target.value as any)}
                      className="w-full p-2 text-xs rounded-lg border border-slate-200 bg-white text-slate-900 focus:ring-2 focus:ring-indigo-500"
                    >
                      <option value="EPFO_Simulator">EPFO UAN Remittance Simulator</option>
                      <option value="Employer_HR_Call">Employer HR Direct Confirmation</option>
                      <option value="Bank_Salary_Credit">Bank Salary Credit Statement</option>
                      <option value="Payslip_Upload">Monthly Payslip Upload</option>
                    </select>
                  </div>
                </div>

                {ocrDetails && ocrDetails.skills && ocrDetails.skills.length > 0 && (
                  <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 space-y-1.5">
                    <span className="text-[11px] font-bold text-slate-700 uppercase">Identified Competency Match:</span>
                    <div className="flex flex-wrap gap-1.5">
                      {ocrDetails.skills.map((sk, sidx) => (
                        <Badge key={sidx} variant="primary" className="text-[10px] font-bold">
                          ✓ {sk}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-100 text-emerald-900 text-xs flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Submitting this record will establish baseline employment and initiate automated 3, 6, and 12-month retention schedules.</span>
                </div>

                <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                  <Button
                    type="submit"
                    variant="primary"
                    size="sm"
                    className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold"
                  >
                    Confirm & Record Verified Placement
                  </Button>
                </div>
              </form>
            )}
          </Card>
        </div>
      )}

      {/* SUB-VIEW 4: 3/6/12M RETENTION TRACKING */}
      {activeSubTab === 'retention_tracking' && (
        <div className="space-y-5">
          <div className="p-4 rounded-xl bg-purple-50 border border-purple-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-purple-600 text-white flex items-center justify-center shrink-0">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-purple-950">Longitudinal 3/6/12-Month Retention Engine</h4>
                <p className="text-xs text-purple-800 mt-0.5">
                  Track employee continuity, career progression, and automated wage remittance audits across all placed batches.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 text-xs font-bold text-purple-900 bg-white px-3 py-1.5 rounded-lg border border-purple-200 shrink-0">
              <span>Overall 6M Retention:</span>
              <strong className="text-purple-700 text-sm">{retention6mRate}%</strong>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {placements.map(plc => (
              <Card key={plc.id} className="p-4 bg-white border-slate-200 shadow-xs space-y-3.5">
                <div className="flex items-start justify-between gap-2 pb-2 border-b border-slate-100">
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">{plc.candidate_name}</h4>
                    <p className="text-[11px] text-slate-500">{plc.company} • {plc.job_role}</p>
                    <span className="text-[10px] text-emerald-700 font-bold">{formatCurrency(plc.salary)}/yr</span>
                  </div>
                  {getStatusBadge(plc.verification_status)}
                </div>

                {/* Milestone Progress Grid */}
                <div className="space-y-2">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Milestone Status:</span>
                  <div className="grid grid-cols-3 gap-1.5 text-center">
                    <div className={`p-2 rounded-lg border text-xs font-bold ${
                      plc.retention_3m === 'verified' || plc.retention_3m === 'simulated_epfo_verified'
                        ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                        : 'bg-slate-50 border-slate-200 text-slate-500'
                    }`}>
                      <div className="text-[9px] text-slate-400 font-normal">3-Month</div>
                      <div className="mt-0.5">{plc.retention_3m === 'verified' || plc.retention_3m === 'simulated_epfo_verified' ? '✓ Verified' : 'Pending'}</div>
                    </div>

                    <div className={`p-2 rounded-lg border text-xs font-bold ${
                      plc.retention_6m === 'verified' || plc.retention_6m === 'simulated_epfo_verified'
                        ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                        : 'bg-slate-50 border-slate-200 text-slate-500'
                    }`}>
                      <div className="text-[9px] text-slate-400 font-normal">6-Month</div>
                      <div className="mt-0.5">{plc.retention_6m === 'verified' || plc.retention_6m === 'simulated_epfo_verified' ? '✓ Verified' : 'Pending'}</div>
                    </div>

                    <div className={`p-2 rounded-lg border text-xs font-bold ${
                      plc.retention_12m === 'verified' || plc.retention_12m === 'simulated_epfo_verified'
                        ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                        : 'bg-slate-50 border-slate-200 text-slate-500'
                    }`}>
                      <div className="text-[9px] text-slate-400 font-normal">12-Month</div>
                      <div className="mt-0.5">{plc.retention_12m === 'verified' || plc.retention_12m === 'simulated_epfo_verified' ? '✓ Verified' : 'Pending'}</div>
                    </div>
                  </div>
                </div>

                {plc.verification_notes && (
                  <p className="text-[11px] text-slate-600 bg-slate-50 p-2 rounded-lg border border-slate-100 leading-relaxed">
                    {plc.verification_notes}
                  </p>
                )}

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => openMilestoneEditModal(plc)}
                    className="text-[11px] h-7 px-2.5"
                  >
                    Edit Status
                  </Button>

                  <Button
                    size="sm"
                    variant="primary"
                    onClick={() => setSelectedPlacementForEpfo(plc)}
                    className="text-[11px] h-7 px-2.5 bg-indigo-600 text-white"
                  >
                    Run EPFO Audit
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* SUB-VIEW 5: CANDIDATE CAREER & EMPLOYMENT TIMELINE */}
      {activeSubTab === 'timeline' && (
        <div className="space-y-6">
          {/* Candidate Selector */}
          <Card className="p-4 bg-white border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700">Select Placed Graduate for Career Pathway:</label>
              <p className="text-[11px] text-slate-500">Visual progression from vocational training enrollment to 12-month tenure</p>
            </div>

            <select
              value={selectedTimelineCandidateId}
              onChange={e => setSelectedTimelineCandidateId(e.target.value)}
              className="p-2 text-xs rounded-lg border border-slate-300 bg-white text-slate-900 font-bold focus:ring-2 focus:ring-indigo-500 w-full sm:w-72"
            >
              {placements.map(p => (
                <option key={p.id} value={p.id}>
                  {p.candidate_name} — {p.company}
                </option>
              ))}
            </select>
          </Card>

          {/* Timeline Visual Card */}
          {currentTimelinePlacement && (
            <Card className="p-6 bg-white border-slate-200 shadow-xs space-y-6">
              {/* Profile Card Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-xl bg-slate-50 border border-slate-200">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-indigo-600 text-white font-black text-lg flex items-center justify-center shrink-0">
                    {(currentTimelinePlacement.candidate_name || 'A').charAt(0)}
                  </div>
                  <div>
                    <h3 className="text-base font-black text-slate-900">{currentTimelinePlacement.candidate_name}</h3>
                    <p className="text-xs text-slate-600">
                      {currentTimelinePlacement.job_role} at <strong className="text-slate-900">{currentTimelinePlacement.company}</strong>
                    </p>
                    <div className="flex items-center gap-2 mt-0.5 text-xs">
                      <span className="text-emerald-700 font-bold">{formatCurrency(currentTimelinePlacement.salary)}/year</span>
                      <span>•</span>
                      <span className="text-slate-500">Joined: {formatDate(currentTimelinePlacement.joining_date)}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => setSelectedPlacementForOfferLetter(currentTimelinePlacement)}
                    className="text-xs font-bold"
                  >
                    <FileText className="w-3.5 h-3.5 mr-1" />
                    Offer Letter
                  </Button>
                  <Button
                    size="sm"
                    variant="primary"
                    onClick={() => setSelectedPlacementForEpfo(currentTimelinePlacement)}
                    className="bg-indigo-600 text-white text-xs font-bold"
                  >
                    EPFO Validation
                  </Button>
                </div>
              </div>

              {/* Stepwise Timeline Path */}
              <div className="relative pl-6 sm:pl-8 space-y-8 before:absolute before:left-3 sm:before:left-4 before:top-3 before:bottom-3 before:w-0.5 before:bg-indigo-200">
                {/* Step 1 */}
                <div className="relative flex items-start gap-4">
                  <div className="absolute -left-6 sm:-left-8 w-6 h-6 rounded-full bg-indigo-600 text-white flex items-center justify-center text-xs font-bold">
                    ✓
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h4 className="text-xs font-bold text-slate-900">Enrolled in Vocational Skilling Initiative</h4>
                      <Badge variant="primary" className="text-[9px]">Completed</Badge>
                    </div>
                    <p className="text-xs text-slate-600">
                      Admitted into <strong className="text-slate-900">{currentTimelinePlacement.course_name || 'Full Stack Cloud Application Engineering'}</strong> at {currentTimelinePlacement.training_center_name || 'Maharashtra State Innovation Academy (MSIAS)'}.
                    </p>
                    <span className="text-[10px] text-slate-400">Cohort Start Date: 01 Jul 2025</span>
                  </div>
                </div>

                {/* Step 2 */}
                <div className="relative flex items-start gap-4">
                  <div className="absolute -left-6 sm:-left-8 w-6 h-6 rounded-full bg-indigo-600 text-white flex items-center justify-center text-xs font-bold">
                    ✓
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h4 className="text-xs font-bold text-slate-900">Curriculum & Practical Assessment Completed</h4>
                      <Badge variant="primary" className="text-[9px]">Completed</Badge>
                    </div>
                    <p className="text-xs text-slate-600">
                      Completed 480 hours of hands-on laboratory work, modular projects, and secured 95% in terminal competency assessment.
                    </p>
                    <span className="text-[10px] text-slate-400">Completion Date: 31 Oct 2025</span>
                  </div>
                </div>

                {/* Step 3 */}
                <div className="relative flex items-start gap-4">
                  <div className="absolute -left-6 sm:-left-8 w-6 h-6 rounded-full bg-indigo-600 text-white flex items-center justify-center text-xs font-bold">
                    ✓
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h4 className="text-xs font-bold text-slate-900">SkillTrack Verifiable Digital Certificate Issued</h4>
                      <Badge variant="success" className="text-[9px]">Verified Valid</Badge>
                    </div>
                    <p className="text-xs text-slate-600">
                      Digital credential generated with cryptographic tamper-proof validation ID (ST-MAHA-2025-08942).
                    </p>
                    <span className="text-[10px] text-slate-400">Issue Date: 05 Nov 2025</span>
                  </div>
                </div>

                {/* Step 4 */}
                <div className="relative flex items-start gap-4">
                  <div className="absolute -left-6 sm:-left-8 w-6 h-6 rounded-full bg-indigo-600 text-white flex items-center justify-center text-xs font-bold">
                    ✓
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h4 className="text-xs font-bold text-slate-900">Recruiter Match & Corporate Offer Received</h4>
                      <Badge variant="success" className="text-[9px]">Offer Signed</Badge>
                    </div>
                    <p className="text-xs text-slate-600">
                      Selected by <strong className="text-slate-900">{currentTimelinePlacement.company}</strong> for the role of <strong className="text-slate-900">{currentTimelinePlacement.job_role}</strong> at an annual CTC of {formatCurrency(currentTimelinePlacement.salary)}.
                    </p>
                    <span className="text-[10px] text-slate-400">Document: {currentTimelinePlacement.offer_letter_filename || 'Offer_Letter.pdf'}</span>
                  </div>
                </div>

                {/* Step 5 */}
                <div className="relative flex items-start gap-4">
                  <div className="absolute -left-6 sm:-left-8 w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center text-xs font-bold">
                    ✓
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h4 className="text-xs font-bold text-slate-900">Corporate Onboarding & Joining Milestone</h4>
                      <Badge variant="success" className="text-[9px]">Active Employed</Badge>
                    </div>
                    <p className="text-xs text-slate-600">
                      Officially joined corporate payroll on {formatDate(currentTimelinePlacement.joining_date)}. Initial employer registration verified.
                    </p>
                  </div>
                </div>

                {/* Step 6 */}
                <div className="relative flex items-start gap-4">
                  <div className={`absolute -left-6 sm:-left-8 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                    currentTimelinePlacement.retention_3m === 'verified' || currentTimelinePlacement.retention_3m === 'simulated_epfo_verified'
                      ? 'bg-emerald-600 text-white'
                      : 'bg-slate-200 text-slate-500'
                  }`}>
                    {currentTimelinePlacement.retention_3m === 'verified' || currentTimelinePlacement.retention_3m === 'simulated_epfo_verified' ? '✓' : '6'}
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h4 className="text-xs font-bold text-slate-900">3-Month Retention Milestone</h4>
                      {getStatusBadge(currentTimelinePlacement.retention_3m)}
                    </div>
                    <p className="text-xs text-slate-600">
                      EPFO Monthly Electronic Challan Return (ECR) wage contribution validated for months 1, 2, and 3.
                    </p>
                  </div>
                </div>

                {/* Step 7 */}
                <div className="relative flex items-start gap-4">
                  <div className={`absolute -left-6 sm:-left-8 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                    currentTimelinePlacement.retention_6m === 'verified' || currentTimelinePlacement.retention_6m === 'simulated_epfo_verified'
                      ? 'bg-emerald-600 text-white'
                      : 'bg-slate-200 text-slate-500'
                  }`}>
                    {currentTimelinePlacement.retention_6m === 'verified' || currentTimelinePlacement.retention_6m === 'simulated_epfo_verified' ? '✓' : '7'}
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h4 className="text-xs font-bold text-slate-900">6-Month Retention Milestone</h4>
                      {getStatusBadge(currentTimelinePlacement.retention_6m)}
                    </div>
                    <p className="text-xs text-slate-600">
                      Mid-term retention confirmed. Validated uninterrupted wage credits and career continuity.
                    </p>
                  </div>
                </div>

                {/* Step 8 */}
                <div className="relative flex items-start gap-4">
                  <div className={`absolute -left-6 sm:-left-8 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                    currentTimelinePlacement.retention_12m === 'verified' || currentTimelinePlacement.retention_12m === 'simulated_epfo_verified'
                      ? 'bg-emerald-600 text-white'
                      : 'bg-slate-200 text-slate-500'
                  }`}>
                    {currentTimelinePlacement.retention_12m === 'verified' || currentTimelinePlacement.retention_12m === 'simulated_epfo_verified' ? '✓' : '8'}
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h4 className="text-xs font-bold text-slate-900">12-Month Longitudinal Career Audit</h4>
                      {getStatusBadge(currentTimelinePlacement.retention_12m)}
                    </div>
                    <p className="text-xs text-slate-600">
                      Annual institutional placement audit and salary increment / promotion assessment tracking.
                    </p>
                  </div>
                </div>
              </div>
            </Card>
          )}
        </div>
      )}

      {/* SUB-VIEW 6: PLACEMENT ANALYTICS & CHARTS */}
      {activeSubTab === 'analytics' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            {/* Chart 1: Course Wise Placement Rates */}
            <Card className="p-5 bg-white border-slate-200 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-black text-slate-900">Placement Rate by Vocational Sector</h3>
                  <p className="text-xs text-slate-500 mt-0.5">Comparative placement yield across technical domains</p>
                </div>
                <Badge variant="primary">Domain Metrics</Badge>
              </div>

              <div className="h-60">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={coursePlacementChartData}>
                    <XAxis dataKey="name" stroke="#94a3b8" tick={{ fill: '#475569', fontSize: 10 }} />
                    <YAxis stroke="#94a3b8" tick={{ fill: '#475569', fontSize: 10 }} />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="enrolled" name="Enrolled" fill="#94a3b8" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="placed" name="Placed" fill="#6366f1" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </Card>

            {/* Chart 2: Salary Package Distribution */}
            <Card className="p-5 bg-white border-slate-200 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-black text-slate-900">Salary Package Distribution (CTC)</h3>
                  <p className="text-xs text-slate-500 mt-0.5">Annual compensation bands for placed candidates</p>
                </div>
                <Badge variant="success">Wage Tiers</Badge>
              </div>

              <div className="h-60">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={salaryBandData}>
                    <XAxis dataKey="range" stroke="#94a3b8" tick={{ fill: '#475569', fontSize: 10 }} />
                    <YAxis stroke="#94a3b8" tick={{ fill: '#475569', fontSize: 10 }} />
                    <Tooltip formatter={(value: any) => [`${value} Placements`, 'Count']} />
                    <Bar dataKey="count" name="Placements" radius={[4, 4, 0, 0]}>
                      {salaryBandData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </Card>
          </div>

          {/* Regional Skilling & Placement Matrix */}
          <Card className="p-5 bg-white border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-black text-slate-900">Training Center Institutional Performance</h3>
                <p className="text-xs text-slate-500 mt-0.5">Outcome conversion rates and longitudinal retention compliance per accredited academy</p>
              </div>
              <Badge variant="purple">State Matrix</Badge>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                { center: 'Maharashtra State Innovation Academy (MSIAS)', district: 'Pune', trained: 35, placed: 32, avgSalary: 580000, retention6m: 88 },
                { center: 'Marathwada Center for Industrial Excellence (MCIE)', district: 'Chhatrapati Sambhajinagar', trained: 30, placed: 26, avgSalary: 470000, retention6m: 81 },
                { center: 'Vidarbha Skill Innovation Academy (VSIA)', district: 'Nagpur', trained: 25, placed: 22, avgSalary: 430000, retention6m: 78 }
              ].map((inst, idx) => (
                <div key={idx} className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
                  <div className="space-y-0.5">
                    <span className="text-[10px] font-bold text-indigo-700 uppercase tracking-wider">{inst.district} District</span>
                    <h4 className="text-xs font-bold text-slate-900">{inst.center}</h4>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs pt-2 border-t border-slate-200">
                    <div>
                      <span className="text-slate-500 text-[10px]">Placement Rate</span>
                      <div className="font-bold text-emerald-700 mt-0.5">{Math.round((inst.placed / inst.trained) * 100)}% ({inst.placed}/{inst.trained})</div>
                    </div>
                    <div>
                      <span className="text-slate-500 text-[10px]">Avg Package</span>
                      <div className="font-bold text-slate-900 mt-0.5">{formatCurrency(inst.avgSalary)}</div>
                    </div>
                    <div>
                      <span className="text-slate-500 text-[10px]">6M Retention</span>
                      <div className="font-bold text-purple-700 mt-0.5">{inst.retention6m}%</div>
                    </div>
                    <div>
                      <span className="text-slate-500 text-[10px]">Audit Status</span>
                      <div className="font-bold text-emerald-600 mt-0.5">✓ Compliant</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}

      {/* MODAL 1: RECORD NEW PLACEMENT */}
      <Modal isOpen={isRecordModalOpen} onClose={() => setIsRecordModalOpen(false)} title="Record Verified Corporate Placement" size="md">
        <form onSubmit={handleRecordSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Placed Trainee</label>
              <select
                value={selectedCandidateId}
                onChange={e => {
                  setSelectedCandidateId(e.target.value);
                  const cand = enrollments.find(en => en.candidate_id === e.target.value);
                  if (cand) setCandidateNameInput(cand.candidate_name || '');
                }}
                className="w-full p-2.5 text-xs rounded-lg border border-slate-300 bg-white text-slate-900 focus:ring-2 focus:ring-indigo-500"
              >
                {enrollments.map(e => (
                  <option key={e.id} value={e.candidate_id}>
                    {e.candidate_name} ({e.course_name})
                  </option>
                ))}
              </select>
            </div>

            <Input
              label="Candidate Full Name"
              value={candidateNameInput}
              onChange={e => setCandidateNameInput(e.target.value)}
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Input
              label="Hiring Enterprise / Employer"
              placeholder="e.g. Apex Infotech Solutions or Tata Motors"
              value={company}
              onChange={e => setCompany(e.target.value)}
              required
            />

            <Input
              label="Job Role / Designation"
              placeholder="e.g. Associate Full Stack Developer"
              value={jobRole}
              onChange={e => setJobRole(e.target.value)}
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Input
              label="Annual CTC Package (INR ₹)"
              type="number"
              min={100000}
              step={10000}
              value={salary}
              onChange={e => setSalary(Number(e.target.value))}
              required
            />
            <Input
              label="Joining / Start Date"
              type="date"
              value={joiningDate}
              onChange={e => setJoiningDate(e.target.value)}
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Verification Status</label>
              <select
                value={verificationStatusInput}
                onChange={e => setVerificationStatusInput(e.target.value as any)}
                className="w-full p-2.5 text-xs rounded-lg border border-slate-300 bg-white text-slate-900 focus:ring-2 focus:ring-indigo-500"
              >
                <option value="verified">Verified (EPFO Remittance)</option>
                <option value="in_review">In Review (Pending Audit)</option>
                <option value="needs_review">Needs Review</option>
                <option value="unverified">Unverified</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Verification Method</label>
              <select
                value={verificationMethod}
                onChange={e => setVerificationMethod(e.target.value as any)}
                className="w-full p-2.5 text-xs rounded-lg border border-slate-300 bg-white text-slate-900 focus:ring-2 focus:ring-indigo-500"
              >
                <option value="EPFO_Simulator">EPFO UAN Remittance Simulator</option>
                <option value="Employer_HR_Call">Employer HR Direct Confirmation</option>
                <option value="Bank_Salary_Credit">Bank Salary Credit Statement</option>
                <option value="Payslip_Upload">Monthly Payslip Upload</option>
              </select>
            </div>
          </div>

          <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-100 text-emerald-900 text-xs flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Placement record will be submitted to the State Employment Outcome Portal for longitudinal 3/6/12-month retention tracking.</span>
          </div>

          <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
            <Button type="button" variant="secondary" size="sm" onClick={() => setIsRecordModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" size="sm" className="bg-indigo-600 text-white font-bold">
              Save Placement Record
            </Button>
          </div>
        </form>
      </Modal>

      {/* MODAL 2: PLACEMENT DETAILS MODAL */}
      {selectedPlacementForDetails && (
        <Modal isOpen={Boolean(selectedPlacementForDetails)} onClose={() => setSelectedPlacementForDetails(null)} title="Candidate Placement Details" size="md">
          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white font-black flex items-center justify-center">
                  {(selectedPlacementForDetails.candidate_name || 'A').charAt(0)}
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900">{selectedPlacementForDetails.candidate_name}</h4>
                  <p className="text-[11px] text-slate-500">{selectedPlacementForDetails.job_role}</p>
                </div>
              </div>
              {getStatusBadge(selectedPlacementForDetails.verification_status)}
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-2.5 rounded-lg border border-slate-200 bg-white">
                <span className="text-slate-500 text-[10px]">Hiring Enterprise</span>
                <div className="font-bold text-slate-900 mt-0.5">{selectedPlacementForDetails.company}</div>
              </div>
              <div className="p-2.5 rounded-lg border border-slate-200 bg-white">
                <span className="text-slate-500 text-[10px]">Annual Remuneration</span>
                <div className="font-black text-emerald-700 mt-0.5">{formatCurrency(selectedPlacementForDetails.salary)}/year</div>
              </div>
              <div className="p-2.5 rounded-lg border border-slate-200 bg-white">
                <span className="text-slate-500 text-[10px]">Joining Date</span>
                <div className="font-bold text-slate-900 mt-0.5">{formatDate(selectedPlacementForDetails.joining_date)}</div>
              </div>
              <div className="p-2.5 rounded-lg border border-slate-200 bg-white">
                <span className="text-slate-500 text-[10px]">Training Institute</span>
                <div className="font-bold text-slate-900 mt-0.5">{selectedPlacementForDetails.training_center_name || 'MSIAS Pune'}</div>
              </div>
            </div>

            {selectedPlacementForDetails.verification_notes && (
              <div className="p-3 rounded-lg bg-indigo-50 border border-indigo-100 text-xs text-indigo-900">
                <span className="font-bold block mb-0.5">Audit Trail & Verification Notes:</span>
                <p className="text-[11px] leading-relaxed">{selectedPlacementForDetails.verification_notes}</p>
              </div>
            )}

            <div className="flex items-center justify-between pt-3 border-t border-slate-100">
              <Button
                size="sm"
                variant="secondary"
                onClick={() => {
                  setSelectedPlacementForOfferLetter(selectedPlacementForDetails);
                  setSelectedPlacementForDetails(null);
                }}
                className="text-xs font-bold"
              >
                <FileText className="w-3.5 h-3.5 mr-1" />
                View Offer Letter
              </Button>

              <Button
                size="sm"
                variant="primary"
                onClick={() => {
                  setSelectedTimelineCandidateId(selectedPlacementForDetails.id);
                  setSelectedPlacementForDetails(null);
                  setActiveSubTab('timeline');
                }}
                className="bg-indigo-600 text-white text-xs font-bold"
              >
                Open Career Timeline
              </Button>
            </div>
          </div>
        </Modal>
      )}

      {/* MODAL 3: RUN EPFO VERIFICATION SIMULATOR */}
      {selectedPlacementForEpfo && (
        <Modal isOpen={Boolean(selectedPlacementForEpfo)} onClose={() => setSelectedPlacementForEpfo(null)} title="Simulated EPFO Wage Remittance Audit" size="md">
          <div className="space-y-4">
            <div className="p-3.5 rounded-xl bg-indigo-50 border border-indigo-200 text-xs text-indigo-950 flex items-start gap-2.5">
              <Zap className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
              <div>
                <strong className="font-bold">Indian EPFO UAN & Electronic Challan Return (ECR) Engine</strong>
                <p className="text-[11px] text-indigo-800 mt-0.5">
                  Validates real-time monthly provident fund wage contribution stream for candidate {selectedPlacementForEpfo.candidate_name} with employer {selectedPlacementForEpfo.company}.
                </p>
              </div>
            </div>

            <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50 space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-500">Candidate Name:</span>
                <strong className="text-slate-900">{selectedPlacementForEpfo.candidate_name}</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Hiring Employer:</span>
                <strong className="text-slate-900">{selectedPlacementForEpfo.company}</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Annual Package:</span>
                <strong className="text-emerald-700">{formatCurrency(selectedPlacementForEpfo.salary)}</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Joining Date:</span>
                <strong className="text-slate-900">{formatDate(selectedPlacementForEpfo.joining_date)}</strong>
              </div>
            </div>

            <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-100 text-xs text-emerald-900 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Simulated API validation will automatically mark 3M & 6M milestones as verified.</span>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
              <Button size="sm" variant="secondary" onClick={() => setSelectedPlacementForEpfo(null)}>
                Cancel
              </Button>
              <Button
                size="sm"
                variant="primary"
                onClick={() => handleExecuteEpfoVerification(selectedPlacementForEpfo.id)}
                className="bg-indigo-600 text-white font-bold"
              >
                Execute EPFO Verification
              </Button>
            </div>
          </div>
        </Modal>
      )}

      {/* MODAL 4: EDIT RETENTION MILESTONES */}
      {selectedPlacementForMilestoneEdit && (
        <Modal isOpen={Boolean(selectedPlacementForMilestoneEdit)} onClose={() => setSelectedPlacementForMilestoneEdit(null)} title="Update Retention Milestones" size="md">
          <form onSubmit={handleSaveMilestoneEdits} className="space-y-4">
            <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 text-xs">
              <span className="text-slate-500">Updating Milestones for:</span>
              <div className="font-bold text-slate-900 text-sm mt-0.5">
                {selectedPlacementForMilestoneEdit.candidate_name} ({selectedPlacementForMilestoneEdit.company})
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">3-Month Milestone</label>
                <select
                  value={milestone3mStatus}
                  onChange={e => setMilestone3mStatus(e.target.value)}
                  className="w-full p-2 text-xs rounded-lg border border-slate-300 bg-white text-slate-900 font-semibold"
                >
                  <option value="verified">Verified</option>
                  <option value="pending">Pending</option>
                  <option value="needs_review">Needs Review</option>
                  <option value="failed">Failed</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">6-Month Milestone</label>
                <select
                  value={milestone6mStatus}
                  onChange={e => setMilestone6mStatus(e.target.value)}
                  className="w-full p-2 text-xs rounded-lg border border-slate-300 bg-white text-slate-900 font-semibold"
                >
                  <option value="verified">Verified</option>
                  <option value="pending">Pending</option>
                  <option value="needs_review">Needs Review</option>
                  <option value="failed">Failed</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">12-Month Milestone</label>
                <select
                  value={milestone12mStatus}
                  onChange={e => setMilestone12mStatus(e.target.value)}
                  className="w-full p-2 text-xs rounded-lg border border-slate-300 bg-white text-slate-900 font-semibold"
                >
                  <option value="verified">Verified</option>
                  <option value="pending">Pending</option>
                  <option value="needs_review">Needs Review</option>
                  <option value="failed">Failed</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Audit Log / Verification Notes</label>
              <textarea
                rows={3}
                value={milestoneNotes}
                onChange={e => setMilestoneNotes(e.target.value)}
                placeholder="Enter audit remarks or employer verification details..."
                className="w-full p-2.5 text-xs rounded-lg border border-slate-300 bg-white text-slate-900 focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
              <Button type="button" variant="secondary" size="sm" onClick={() => setSelectedPlacementForMilestoneEdit(null)}>
                Cancel
              </Button>
              <Button type="submit" variant="primary" size="sm" className="bg-indigo-600 text-white font-bold">
                Save Milestones
              </Button>
            </div>
          </form>
        </Modal>
      )}

      {/* MODAL 5: DIGITAL OFFER LETTER PREVIEW */}
      {selectedPlacementForOfferLetter && (
        <Modal isOpen={Boolean(selectedPlacementForOfferLetter)} onClose={() => setSelectedPlacementForOfferLetter(null)} title="Corporate Offer Letter Document" size="md">
          <div className="space-y-4">
            <div className="p-6 rounded-xl border border-slate-300 bg-white shadow-xs space-y-4 font-sans text-xs">
              <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                <div>
                  <h4 className="text-sm font-black text-slate-900">{selectedPlacementForOfferLetter.company}</h4>
                  <p className="text-[10px] text-slate-500">Corporate Headquarters • Human Resources Division</p>
                </div>
                <Badge variant="purple">Official Offer Document</Badge>
              </div>

              <div className="space-y-2">
                <div className="text-right text-[10px] text-slate-400">Date: {formatDate(selectedPlacementForOfferLetter.joining_date)}</div>
                <p className="text-slate-800 leading-relaxed">
                  Dear <strong className="text-slate-900">{selectedPlacementForOfferLetter.candidate_name}</strong>,
                </p>
                <p className="text-slate-700 leading-relaxed">
                  We are pleased to offer you employment with <strong className="text-slate-900">{selectedPlacementForOfferLetter.company}</strong> in the position of <strong className="text-slate-900">{selectedPlacementForOfferLetter.job_role}</strong>. Your performance in the SkillTrack technical assessment and final interview has been exemplary.
                </p>
                <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className="text-slate-500 text-[10px]">Annual CTC Package:</span>
                    <div className="font-black text-emerald-700 text-sm mt-0.5">{formatCurrency(selectedPlacementForOfferLetter.salary)} / year</div>
                  </div>
                  <div>
                    <span className="text-slate-500 text-[10px]">Reporting Date:</span>
                    <div className="font-bold text-slate-900 mt-0.5">{formatDate(selectedPlacementForOfferLetter.joining_date)}</div>
                  </div>
                </div>
                <p className="text-[11px] text-slate-600">
                  This employment record is indexed on the Maharashtra State Vocational Employment Registry with automated EPFO UAN synchronization.
                </p>
              </div>

              <div className="pt-3 border-t border-slate-200 flex items-center justify-between text-[10px] text-slate-400">
                <span>Ref: OFFER-ST-{selectedPlacementForOfferLetter.id.toUpperCase()}</span>
                <span>Authorized Digital Seal ✓</span>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
              <Button size="sm" variant="secondary" onClick={() => setSelectedPlacementForOfferLetter(null)}>
                Close Preview
              </Button>
              <Button size="sm" variant="primary" onClick={() => setSelectedPlacementForOfferLetter(null)} className="bg-indigo-600 text-white font-bold">
                <Download className="w-3.5 h-3.5 mr-1" />
                Download PDF
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
