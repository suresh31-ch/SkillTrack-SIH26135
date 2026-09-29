import {
  DistrictAnalytics,
  SkillSupplyDemandItem,
  TrainingCenterPerformanceMetric,
  EmploymentOutcomeMetrics,
  AdminAnalyticsKPIs,
  AnomalyAlert,
  ReportConfig
} from '../types';
import { LocalDbService } from './supabase';

const ANOMALIES_STORAGE_KEY = 'skilltrack_demo_anomalies';

export const MAHARASHTRA_DISTRICTS_DATA: DistrictAnalytics[] = [
  {
    id: 'dist-pune',
    organization_id: 'org-maha-001',
    district: 'Pune',
    state: 'Maharashtra',
    total_candidates: 16800,
    trained_count: 14950,
    placed_count: 12400,
    retention_rate_6m: 87.2,
    top_skill_demanded: 'Cloud & Full Stack Web Dev',
    skill_gap_index: 18,
    enrolled: 16800,
    trained: 14950,
    placed: 12400,
    placement_rate: 82.9,
    average_salary: 540000,
    updated_at: '2026-08-28'
  },
  {
    id: 'dist-mumbai-sub',
    organization_id: 'org-maha-001',
    district: 'Mumbai Suburban',
    state: 'Maharashtra',
    total_candidates: 19400,
    trained_count: 17200,
    placed_count: 14450,
    retention_rate_6m: 85.6,
    top_skill_demanded: 'Data Analytics & AI Ops',
    skill_gap_index: 22,
    enrolled: 19400,
    trained: 17200,
    placed: 14450,
    placement_rate: 84.0,
    average_salary: 620000,
    updated_at: '2026-08-28'
  },
  {
    id: 'dist-thane',
    organization_id: 'org-maha-001',
    district: 'Thane',
    state: 'Maharashtra',
    total_candidates: 11200,
    trained_count: 9800,
    placed_count: 7940,
    retention_rate_6m: 81.4,
    top_skill_demanded: 'DevOps & Cyber Security',
    skill_gap_index: 25,
    enrolled: 11200,
    trained: 9800,
    placed: 7940,
    placement_rate: 81.0,
    average_salary: 490000,
    updated_at: '2026-08-28'
  },
  {
    id: 'dist-sambhajinagar',
    organization_id: 'org-maha-001',
    district: 'Chhatrapati Sambhajinagar',
    state: 'Maharashtra',
    total_candidates: 9400,
    trained_count: 8250,
    placed_count: 6520,
    retention_rate_6m: 78.8,
    top_skill_demanded: 'EV Diagnostics & Green Tech',
    skill_gap_index: 31,
    enrolled: 9400,
    trained: 8250,
    placed: 6520,
    placement_rate: 79.0,
    average_salary: 410000,
    updated_at: '2026-08-28'
  },
  {
    id: 'dist-nagpur',
    organization_id: 'org-maha-001',
    district: 'Nagpur',
    state: 'Maharashtra',
    total_candidates: 10600,
    trained_count: 9300,
    placed_count: 7530,
    retention_rate_6m: 82.5,
    top_skill_demanded: 'CNC Machining & Automation',
    skill_gap_index: 27,
    enrolled: 10600,
    trained: 9300,
    placed: 7530,
    placement_rate: 81.0,
    average_salary: 460000,
    updated_at: '2026-08-28'
  },
  {
    id: 'dist-nashik',
    organization_id: 'org-maha-001',
    district: 'Nashik',
    state: 'Maharashtra',
    total_candidates: 8200,
    trained_count: 7300,
    placed_count: 5770,
    retention_rate_6m: 77.9,
    top_skill_demanded: 'Solar PV & Agro-IoT Systems',
    skill_gap_index: 34,
    enrolled: 8200,
    trained: 7300,
    placed: 5770,
    placement_rate: 79.0,
    average_salary: 395000,
    updated_at: '2026-08-28'
  },
  {
    id: 'dist-kolhapur',
    organization_id: 'org-maha-001',
    district: 'Kolhapur',
    state: 'Maharashtra',
    total_candidates: 6700,
    trained_count: 5950,
    placed_count: 4820,
    retention_rate_6m: 79.8,
    top_skill_demanded: 'Industrial Robotics & Foundry',
    skill_gap_index: 29,
    enrolled: 6700,
    trained: 5950,
    placed: 4820,
    placement_rate: 81.0,
    average_salary: 420000,
    updated_at: '2026-08-28'
  },
  {
    id: 'dist-solapur',
    organization_id: 'org-maha-001',
    district: 'Solapur',
    state: 'Maharashtra',
    total_candidates: 5400,
    trained_count: 4750,
    placed_count: 3705,
    retention_rate_6m: 74.5,
    top_skill_demanded: 'Textile Automation & Renewable Solar',
    skill_gap_index: 39,
    enrolled: 5400,
    trained: 4750,
    placed: 3705,
    placement_rate: 78.0,
    average_salary: 360000,
    updated_at: '2026-08-28'
  },
  {
    id: 'dist-amravati',
    organization_id: 'org-maha-001',
    district: 'Amravati',
    state: 'Maharashtra',
    total_candidates: 4900,
    trained_count: 4250,
    placed_count: 3230,
    retention_rate_6m: 75.2,
    top_skill_demanded: 'Food Processing Tech & Electrical',
    skill_gap_index: 41,
    enrolled: 4900,
    trained: 4250,
    placed: 3230,
    placement_rate: 76.0,
    average_salary: 350000,
    updated_at: '2026-08-28'
  },
  {
    id: 'dist-nanded',
    organization_id: 'org-maha-001',
    district: 'Nanded',
    state: 'Maharashtra',
    total_candidates: 4300,
    trained_count: 3750,
    placed_count: 2850,
    retention_rate_6m: 73.1,
    top_skill_demanded: 'Healthcare Bio-Equip Maintenance',
    skill_gap_index: 44,
    enrolled: 4300,
    trained: 3750,
    placed: 2850,
    placement_rate: 76.0,
    average_salary: 345000,
    updated_at: '2026-08-28'
  }
];

export const SKILL_SUPPLY_DEMAND_DATA: SkillSupplyDemandItem[] = [
  {
    id: 'ssd-01',
    skill_name: 'React.js & Modern TypeScript',
    category: 'Software & Web Development',
    available_candidates: 3420,
    industry_demand: 4850,
    gap: 1430,
    gap_percentage: 29.5,
    classification: 'critical_shortage',
    avg_salary: 580000,
    growth_rate: 36.4,
    top_employers: ['Apex Infotech', 'TCS Innovation Hub', 'Persistent Systems', 'Tech Mahindra']
  },
  {
    id: 'ssd-02',
    skill_name: 'Electric Vehicle (EV) Diagnostics & BMS',
    category: 'Green Tech & Automotive',
    available_candidates: 1850,
    industry_demand: 3200,
    gap: 1350,
    gap_percentage: 42.2,
    classification: 'critical_shortage',
    avg_salary: 460000,
    growth_rate: 52.8,
    top_employers: ['Tata Motors EV Hub', 'Mahindra Electric', 'Bajaj Auto', 'Pinnacle Mobility']
  },
  {
    id: 'ssd-03',
    skill_name: 'Cloud DevOps (Docker, Kubernetes & AWS/GCP)',
    category: 'Cloud Infrastructure & DevOps',
    available_candidates: 2100,
    industry_demand: 3400,
    gap: 1300,
    gap_percentage: 38.2,
    classification: 'critical_shortage',
    avg_salary: 720000,
    growth_rate: 41.2,
    top_employers: ['TechSkills Cloud India', 'Infosys Cloud Practice', 'Wipro Enterprise', 'Zensar']
  },
  {
    id: 'ssd-04',
    skill_name: 'PostgreSQL & Database Architecture',
    category: 'Software & Web Development',
    available_candidates: 2950,
    industry_demand: 3600,
    gap: 650,
    gap_percentage: 18.1,
    classification: 'moderate_shortage',
    avg_salary: 520000,
    growth_rate: 22.5,
    top_employers: ['Apex Infotech', 'Cognizant Pune', 'LTIMindtree', 'Cybage']
  },
  {
    id: 'ssd-05',
    skill_name: 'CNC 5-Axis Multi-Spindle Machining',
    category: 'Industrial Automation 4.0',
    available_candidates: 2400,
    industry_demand: 3100,
    gap: 700,
    gap_percentage: 22.6,
    classification: 'moderate_shortage',
    avg_salary: 440000,
    growth_rate: 19.8,
    top_employers: ['Kalyani Precision', 'Bharat Forge', 'Godrej Aerospace', 'Thermax']
  },
  {
    id: 'ssd-06',
    skill_name: 'Solar PV Rooftop & Grid-Tie Commissioning',
    category: 'Renewable Energy',
    available_candidates: 2600,
    industry_demand: 3350,
    gap: 750,
    gap_percentage: 22.4,
    classification: 'moderate_shortage',
    avg_salary: 390000,
    growth_rate: 44.0,
    top_employers: ['Mahindra Green Energy', 'Tata Power Solar', 'Waaree Energies', 'Suzlon']
  },
  {
    id: 'ssd-07',
    skill_name: 'Industrial Robotics & PLC Automation',
    category: 'Industrial Automation 4.0',
    available_candidates: 1650,
    industry_demand: 2150,
    gap: 500,
    gap_percentage: 23.3,
    classification: 'moderate_shortage',
    avg_salary: 490000,
    growth_rate: 28.6,
    top_employers: ['KUKA India', 'ABB Robotics Pune', 'Fanuc India', 'Siemens Digital Industries']
  },
  {
    id: 'ssd-08',
    skill_name: 'Medical Equipment & Biomedical Calibration',
    category: 'Healthcare Technology',
    available_candidates: 920,
    industry_demand: 1100,
    gap: 180,
    gap_percentage: 16.4,
    classification: 'balanced',
    avg_salary: 430000,
    growth_rate: 18.0,
    top_employers: ['Apollo Hospitals Western Region', 'Ruby Hall Clinic', 'KEM Healthcare Tech', 'Sahyadri']
  },
  {
    id: 'ssd-09',
    skill_name: 'Manual Quality Inspection (Legacy)',
    category: 'Industrial Automation 4.0',
    available_candidates: 3800,
    industry_demand: 2900,
    gap: -900,
    gap_percentage: -31.0,
    classification: 'surplus',
    avg_salary: 280000,
    growth_rate: -12.4,
    top_employers: ['Tier-3 Machine Shops', 'Foundry Units', 'Assembly Subcontractors']
  }
];

export const TRAINING_CENTERS_PERFORMANCE: TrainingCenterPerformanceMetric[] = [
  {
    id: 'tc-001',
    name: 'Maharashtra State Institute of Advanced Skilling (MSIAS)',
    district: 'Pune',
    taluka: 'Haveli',
    contact_email: 'pune.center@msias.edu.in',
    enrolled: 4250,
    trained: 3980,
    completion_rate: 93.6,
    certified: 3820,
    certification_rate: 96.0,
    placed: 3380,
    placement_rate: 84.9,
    retention_3m: 91.2,
    retention_6m: 86.4,
    retention_12m: 78.5,
    avg_salary: 560000,
    compliance_score: 98,
    audit_status: 'Compliant'
  },
  {
    id: 'tc-002',
    name: 'Marathwada Center for Industrial Excellence',
    district: 'Chhatrapati Sambhajinagar',
    taluka: 'Aurangabad',
    contact_email: 'waluj.center@mcie.org.in',
    enrolled: 3100,
    trained: 2820,
    completion_rate: 91.0,
    certified: 2680,
    certification_rate: 95.0,
    placed: 2260,
    placement_rate: 80.1,
    retention_3m: 88.0,
    retention_6m: 81.5,
    retention_12m: 72.0,
    avg_salary: 430000,
    compliance_score: 92,
    audit_status: 'Compliant'
  },
  {
    id: 'tc-003',
    name: 'Vidarbha Skill Innovation Academy',
    district: 'Nagpur',
    taluka: 'Nagpur Urban',
    contact_email: 'nagpur@vsia.gov.in',
    enrolled: 3600,
    trained: 3310,
    completion_rate: 91.9,
    certified: 3180,
    certification_rate: 96.1,
    placed: 2710,
    placement_rate: 81.9,
    retention_3m: 89.5,
    retention_6m: 83.2,
    retention_12m: 74.8,
    avg_salary: 475000,
    compliance_score: 94,
    audit_status: 'Compliant'
  },
  {
    id: 'tc-004',
    name: 'Nashik Green Energy & EV Skilling Hub',
    district: 'Nashik',
    taluka: 'Nashik',
    contact_email: 'nashik.hub@greentech.org',
    enrolled: 2450,
    trained: 2210,
    completion_rate: 90.2,
    certified: 2090,
    certification_rate: 94.6,
    placed: 1750,
    placement_rate: 79.2,
    retention_3m: 86.4,
    retention_6m: 79.0,
    retention_12m: 69.5,
    avg_salary: 405000,
    compliance_score: 89,
    audit_status: 'Compliant'
  },
  {
    id: 'tc-005',
    name: 'Western Maharashtra Robotics & Automation ITI',
    district: 'Kolhapur',
    taluka: 'Karvir',
    contact_email: 'kolhapur.robotics@iti.gov.in',
    enrolled: 2100,
    trained: 1920,
    completion_rate: 91.4,
    certified: 1810,
    certification_rate: 94.3,
    placed: 1530,
    placement_rate: 79.7,
    retention_3m: 87.1,
    retention_6m: 80.4,
    retention_12m: 71.2,
    avg_salary: 425000,
    compliance_score: 91,
    audit_status: 'Compliant'
  },
  {
    id: 'tc-006',
    name: 'Kalyan Industrial Vocational Training Academy',
    district: 'Thane',
    taluka: 'Kalyan',
    contact_email: 'audit@kalyanvocational.org',
    enrolled: 1800,
    trained: 1510,
    completion_rate: 83.9,
    certified: 1390,
    certification_rate: 92.1,
    placed: 1120,
    placement_rate: 74.2,
    retention_3m: 76.5,
    retention_6m: 68.2,
    retention_12m: 59.0,
    avg_salary: 370000,
    compliance_score: 68,
    audit_status: 'Under Review'
  }
];

export const RULE_BASED_ANOMALY_ALERTS: AnomalyAlert[] = [
  {
    id: 'anm-001',
    organization_id: 'org-maha-001',
    training_center_id: 'tc-006',
    training_center_name: 'Kalyan Industrial Vocational Training Academy',
    severity: 'critical',
    title: 'Abnormal 100% Placement Velocity in < 48 Hours',
    description: 'Rule triggered: Batch-14 (48 candidates) reported 100% immediate placement within 48 hours of course completion with identical joining dates at a vendor registered 14 days prior.',
    detected_pattern: 'Bulk Placement Spike vs Industry Median (14-30 Days)',
    reason: 'Suspicious vendor registration date and abnormal placement velocity without prior hiring history.',
    rule_code: 'RULE_VELOCITY_SPIKE_101',
    status: 'new',
    created_at: '2026-08-28T14:30:00Z'
  },
  {
    id: 'anm-002',
    organization_id: 'org-maha-001',
    training_center_id: 'tc-003',
    training_center_name: 'Vidarbha Skill Innovation Academy',
    severity: 'high',
    title: 'Duplicate Candidate Biometric Registration',
    description: 'Rule triggered: 6 candidate records share duplicate masked Aadhaar/biometric tokens with active enrollments in a concurrent Pune technical training center.',
    detected_pattern: 'Cross-District Dual Enrollment Collision',
    reason: 'Simultaneous attendance logs registered in two separate physical ITIs on the same calendar dates.',
    rule_code: 'RULE_DUPLICATE_ID_204',
    status: 'under_review',
    resolution_notes: 'Center coordinator contacted; Biometric device timestamp calibration audit in progress.',
    reviewed_at: '2026-08-29T10:15:00Z',
    reviewed_by: 'State Audit Desk',
    created_at: '2026-08-25T09:15:00Z'
  },
  {
    id: 'anm-003',
    organization_id: 'org-maha-001',
    training_center_id: 'tc-004',
    training_center_name: 'Nashik Green Energy & EV Skilling Hub',
    severity: 'medium',
    title: 'Accelerated Certification Issuance Pattern',
    description: 'Rule triggered: 14 candidates received final NSQF Level 4 certifications with only 48 hours of logged laboratory workbench attendance (min requirement: 160 hours).',
    detected_pattern: 'Sub-Threshold Practical Hours Prior to Certification',
    reason: 'Fast-track test completion without verified LMS lab module completion log.',
    rule_code: 'RULE_ACCELERATED_CERT_305',
    status: 'under_review',
    created_at: '2026-08-21T11:45:00Z'
  },
  {
    id: 'anm-004',
    organization_id: 'org-maha-001',
    training_center_id: 'tc-002',
    training_center_name: 'Marathwada Center for Industrial Excellence',
    severity: 'medium',
    title: 'Placement Records Missing EPFO UAN Remittance Verification',
    description: 'Rule triggered: 22 reported placements in the automotive tooling cohort have pending EPFO UAN remittance verification after 90 days of employment declaration.',
    detected_pattern: 'Delayed Wage Remittance Proof Beyond 90-Day Grace Period',
    reason: 'Employer verification pending HR callback confirmation.',
    rule_code: 'RULE_UNVERIFIED_EPFO_402',
    status: 'new',
    created_at: '2026-08-18T16:00:00Z'
  },
  {
    id: 'anm-005',
    organization_id: 'org-maha-001',
    training_center_id: 'tc-001',
    training_center_name: 'MSIAS Pune Main Campus',
    severity: 'low',
    title: 'Salary Reporting Variance (+140% Above Regional Benchmark)',
    description: 'Rule triggered: 3 candidates reported starting CTC of ₹18,00,000 LPA for junior technician roles (regional benchmark: ₹4,50,000 LPA). Verified as legitimate international remote contractor contracts.',
    detected_pattern: 'Outlier Wage Variance Flag',
    reason: 'Remote overseas engineering placement confirmed with verified bank FX credit receipts.',
    rule_code: 'RULE_WAGE_OUTLIER_501',
    status: 'resolved',
    resolution_notes: 'Offer letters and bank wire remittance statements validated by audit officer on Aug 27.',
    reviewed_at: '2026-08-27T15:20:00Z',
    reviewed_by: 'Lead State Auditor (MH-HQ)',
    created_at: '2026-08-15T08:30:00Z'
  }
];

export class AnalyticsService {
  // Aggregate KPIs
  static getAdminKPIs(): AdminAnalyticsKPIs {
    const districts = MAHARASHTRA_DISTRICTS_DATA;
    const total_candidates = districts.reduce((acc, d) => acc + d.total_candidates, 0);
    const candidates_trained = districts.reduce((acc, d) => acc + d.trained_count, 0);
    const candidates_certified = Math.round(candidates_trained * 0.948); // 94.8% certification rate
    const candidates_placed = districts.reduce((acc, d) => acc + d.placed_count, 0);
    const placement_rate = Number(((candidates_placed / candidates_trained) * 100).toFixed(1));

    return {
      total_candidates,
      candidates_trained,
      candidates_certified,
      candidates_placed,
      placement_rate,
      retention_3m_rate: 89.4,
      retention_6m_rate: 82.1,
      retention_12m_rate: 74.6,
      avg_readiness_score: 83.5,
      avg_skill_gap_index: 28.2
    };
  }

  // Trainee Pipeline Funnel Data
  static getPipelineFunnel() {
    const kpis = this.getAdminKPIs();
    return [
      { step: '1. Total Enrolled Trainees', count: kpis.total_candidates, percentage: 100, fill: '#6366f1' },
      { step: '2. Training Completed', count: kpis.candidates_trained, percentage: Math.round((kpis.candidates_trained / kpis.total_candidates) * 100), fill: '#8b5cf6' },
      { step: '3. Skill Certified (NSQF)', count: kpis.candidates_certified, percentage: Math.round((kpis.candidates_certified / kpis.total_candidates) * 100), fill: '#a855f7' },
      { step: '4. Verified Placements', count: kpis.candidates_placed, percentage: Math.round((kpis.candidates_placed / kpis.total_candidates) * 100), fill: '#10b981' },
      { step: '5. 6-Month Retained (EPFO)', count: Math.round(kpis.candidates_placed * 0.821), percentage: Math.round(((kpis.candidates_placed * 0.821) / kpis.total_candidates) * 100), fill: '#059669' }
    ];
  }

  // Monthly Placement & Wage Trends
  static getMonthlyTrends() {
    return [
      { month: 'Oct 2025', placements: 4210, avgSalaryLPA: 4.6, retentionRate: 85.0 },
      { month: 'Nov 2025', placements: 4680, avgSalaryLPA: 4.8, retentionRate: 84.8 },
      { month: 'Dec 2025', placements: 5120, avgSalaryLPA: 5.0, retentionRate: 84.2 },
      { month: 'Jan 2026', placements: 5540, avgSalaryLPA: 5.2, retentionRate: 83.6 },
      { month: 'Feb 2026', placements: 6100, avgSalaryLPA: 5.3, retentionRate: 83.1 },
      { month: 'Mar 2026', placements: 6850, avgSalaryLPA: 5.5, retentionRate: 82.8 },
      { month: 'Apr 2026', placements: 7240, avgSalaryLPA: 5.6, retentionRate: 82.5 },
      { month: 'May 2026', placements: 7890, avgSalaryLPA: 5.7, retentionRate: 82.3 },
      { month: 'Jun 2026', placements: 8420, avgSalaryLPA: 5.8, retentionRate: 82.1 }
    ];
  }

  // Sectoral Distribution
  static getSectorBreakdown() {
    return [
      { name: 'Software & Cloud Tech', candidates: 36200, placements: 30100, share: 38, fill: '#6366f1' },
      { name: 'EV Mobility & Automotive', candidates: 24800, placements: 19800, share: 26, fill: '#10b981' },
      { name: 'Industrial Automation 4.0', candidates: 17400, placements: 13900, share: 18, fill: '#f59e0b' },
      { name: 'Renewable Solar & Wind', candidates: 11200, placements: 8750, share: 12, fill: '#06b6d4' },
      { name: 'Healthcare & Biotech', candidates: 5600, placements: 4250, share: 6, fill: '#ec4899' }
    ];
  }

  // District Analytics Data
  static getDistrictAnalytics(): DistrictAnalytics[] {
    return MAHARASHTRA_DISTRICTS_DATA;
  }

  // Skill Supply vs Demand Data
  static getSkillSupplyDemand(): SkillSupplyDemandItem[] {
    return SKILL_SUPPLY_DEMAND_DATA;
  }

  // Training Centers Performance
  static getTrainingCenterPerformance(): TrainingCenterPerformanceMetric[] {
    return TRAINING_CENTERS_PERFORMANCE;
  }

  // Employment Outcomes & Retention Metrics
  static getEmploymentOutcomes(): EmploymentOutcomeMetrics {
    const kpis = this.getAdminKPIs();
    const placed = kpis.candidates_placed;
    return {
      total_placed: placed,
      retention_3m_count: Math.round(placed * 0.894),
      retention_3m_rate: 89.4,
      retention_6m_count: Math.round(placed * 0.821),
      retention_6m_rate: 82.1,
      retention_12m_count: Math.round(placed * 0.746),
      retention_12m_rate: 74.6,
      active_employed_count: Math.round(placed * 0.842),
      resigned_count: Math.round(placed * 0.158),
      attrition_rate: 15.8,
      epfo_verified_rate: 91.5,
      avg_initial_salary: 380000,
      avg_current_salary: 512000,
      wage_growth_rate: 34.7
    };
  }

  // Anomaly Alerts Management with Local Storage Persistence
  static getAnomalies(): AnomalyAlert[] {
    try {
      const stored = localStorage.getItem(ANOMALIES_STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch {
      // fallback
    }
    return RULE_BASED_ANOMALY_ALERTS;
  }

  static updateAnomalyStatus(
    id: string,
    status: 'new' | 'under_review' | 'resolved',
    resolutionNotes?: string,
    reviewedBy: string = 'Platform Administrator'
  ): AnomalyAlert[] {
    const current = this.getAnomalies();
    const updated = current.map(item => {
      if (item.id === id) {
        return {
          ...item,
          status,
          resolution_notes: resolutionNotes ?? item.resolution_notes,
          reviewed_at: new Date().toISOString(),
          reviewed_by: reviewedBy
        };
      }
      return item;
    });

    try {
      localStorage.setItem(ANOMALIES_STORAGE_KEY, JSON.stringify(updated));
    } catch (e) {
      console.error('Failed to persist anomalies:', e);
    }
    return updated;
  }

  static resetAnomalies(): AnomalyAlert[] {
    try {
      localStorage.removeItem(ANOMALIES_STORAGE_KEY);
    } catch {
      // ignore
    }
    return RULE_BASED_ANOMALY_ALERTS;
  }

  // Reports Generation Engine
  static generateReportData(config: ReportConfig) {
    let rows: any[] = [];
    let headers: string[] = [];
    let title = 'SkillTrack Intelligence Report';

    switch (config.report_type) {
      case 'district_matrix':
        title = 'Maharashtra District Skilling & Placement Matrix';
        headers = ['District', 'Enrolled Candidates', 'Trained', 'Placed', 'Placement Rate (%)', '6M Retention (%)', 'Top Skill Demanded', 'Avg Salary (₹)'];
        let districts = this.getDistrictAnalytics();
        if (config.district_filter && config.district_filter !== 'all') {
          districts = districts.filter(d => d.district.toLowerCase() === config.district_filter.toLowerCase());
        }
        rows = districts.map(d => [
          d.district,
          d.total_candidates,
          d.trained_count,
          d.placed_count,
          `${d.placement_rate ?? Math.round((d.placed_count / d.trained_count) * 100)}%`,
          `${d.retention_rate_6m}%`,
          d.top_skill_demanded,
          `₹${(d.average_salary ?? 450000).toLocaleString()}`
        ]);
        break;

      case 'skill_supply_demand':
        title = 'Industry Skill Supply vs Market Demand Gap Report';
        headers = ['Skill Name', 'Category', 'Available Supply (Candidates)', 'Industry Demand (Seats)', 'Skill Gap', 'Gap %', 'Classification', 'Avg Salary (₹)', 'YoY Growth (%)'];
        let skills = this.getSkillSupplyDemand();
        if (config.skill_category_filter && config.skill_category_filter !== 'all') {
          skills = skills.filter(s => s.category.toLowerCase().includes(config.skill_category_filter.toLowerCase()));
        }
        rows = skills.map(s => [
          s.skill_name,
          s.category,
          s.available_candidates,
          s.industry_demand,
          s.gap,
          `${s.gap_percentage}%`,
          s.classification.replace('_', ' ').toUpperCase(),
          `₹${s.avg_salary.toLocaleString()}`,
          `+${s.growth_rate}%`
        ]);
        break;

      case 'training_centers':
        title = 'Accredited Training Centers Performance & Audit Report';
        headers = ['Training Center Name', 'District', 'Enrolled', 'Trained', 'Completion Rate (%)', 'Certified', 'Placed', 'Placement Rate (%)', '6M Retention (%)', 'Compliance Score', 'Audit Status'];
        let centers = this.getTrainingCenterPerformance();
        if (config.district_filter && config.district_filter !== 'all') {
          centers = centers.filter(c => c.district.toLowerCase() === config.district_filter.toLowerCase());
        }
        rows = centers.map(c => [
          c.name,
          c.district,
          c.enrolled,
          c.trained,
          `${c.completion_rate}%`,
          c.certified,
          c.placed,
          `${c.placement_rate}%`,
          `${c.retention_6m}%`,
          `${c.compliance_score}/100`,
          c.audit_status
        ]);
        break;

      case 'employment_retention':
        title = 'Longitudinal Employment Retention & EPFO Remittance Verification';
        headers = ['Metric Name', 'Count / Value', 'Percentage / Rate (%)', 'Verification Source / Benchmark'];
        const emp = this.getEmploymentOutcomes();
        rows = [
          ['Total Verified Placements', emp.total_placed, '100%', 'Employer Offer Letters & MSIAS Registrations'],
          ['3-Month Retention Milestone', emp.retention_3m_count, `${emp.retention_3m_rate}%`, 'Simulated EPFO Electronic Challan Return (ECR)'],
          ['6-Month Retention Milestone', emp.retention_6m_count, `${emp.retention_6m_rate}%`, 'Simulated EPFO Continuous UAN Remittance'],
          ['12-Month Retention Milestone', emp.retention_12m_count, `${emp.retention_12m_rate}%`, 'Annual Employment Tax Credit Audit'],
          ['Active Employed Trainees', emp.active_employed_count, `${100 - emp.attrition_rate}%`, 'Continuous Active Status'],
          ['Average Pre-to-Post Wage Growth', `₹${emp.avg_initial_salary.toLocaleString()} → ₹${emp.avg_current_salary.toLocaleString()}`, `+${emp.wage_growth_rate}%`, 'Direct Banking Salary Remittance Stream']
        ];
        break;

      case 'fraud_anomalies':
        title = 'Rule-Based Anomaly & Anti-Fraud Audit Log';
        headers = ['Alert Title', 'Training Center / Entity', 'Severity', 'Rule Code', 'Status', 'Detected Pattern', 'Reviewer Remarks', 'Date Logged'];
        let anomalies = this.getAnomalies();
        rows = anomalies.map(a => [
          a.title,
          a.training_center_name || 'N/A',
          a.severity.toUpperCase(),
          a.rule_code || 'RULE_AUDIT',
          a.status.toUpperCase(),
          a.detected_pattern,
          a.resolution_notes || a.reason || 'Pending verification',
          new Date(a.created_at).toLocaleDateString('en-IN')
        ]);
        break;

      case 'executive_summary':
      default:
        title = 'Statewide Skilling Program Executive Analytics Summary';
        headers = ['Key Performance Indicator', 'Value', 'Growth / Benchmark', 'Verification Status'];
        const kpis = this.getAdminKPIs();
        rows = [
          ['Total Candidate Cohort', kpis.total_candidates.toLocaleString(), '+14.2% YoY', 'Statewide Aadhaar-Seeded Identity'],
          ['Trainees Completed Course', kpis.candidates_trained.toLocaleString(), '89.0% Course Completion Rate', 'Biometric Attendance Audit'],
          ['NSQF Certified Candidates', kpis.candidates_certified.toLocaleString(), '94.8% Certification Exam Pass Rate', 'State Skill Examination Cell'],
          ['Verified Job Placements', kpis.candidates_placed.toLocaleString(), `${kpis.placement_rate}% Placement Conversion`, 'Employer HR Verification'],
          ['6-Month Employment Retention', `${Math.round(kpis.candidates_placed * 0.821).toLocaleString()} candidates`, `${kpis.retention_6m_rate}% Longitudinal Retention`, 'Simulated EPFO UAN Track'],
          ['Average Candidate Readiness Score', `${kpis.avg_readiness_score}/100`, 'Target > 80.0', 'Adaptive Skill Assessment Engine'],
          ['Statewide Skill Gap Index', `${kpis.avg_skill_gap_index}/100`, '-6.4 points vs baseline', 'Industry Hiring Demand Calibration']
        ];
        break;
    }

    return { title, headers, rows };
  }

  // Export to CSV helper
  static exportToCsv(filename: string, headers: string[], rows: any[][]) {
    const escapeCsv = (val: any) => {
      if (val === null || val === undefined) return '""';
      const str = String(val).replace(/"/g, '""');
      return `"${str}"`;
    };

    const csvContent = [
      headers.map(escapeCsv).join(','),
      ...rows.map(row => row.map(escapeCsv).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `${filename}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  // Export to JSON helper
  static exportToJson(filename: string, headers: string[], rows: any[][], title: string) {
    const dataObjects = rows.map(row => {
      const obj: Record<string, any> = {};
      headers.forEach((h, i) => {
        obj[h] = row[i];
      });
      return obj;
    });

    const payload = {
      report_title: title,
      generated_at: new Date().toISOString(),
      platform: 'SkillTrack Enterprise Skilling Intelligence',
      records_count: dataObjects.length,
      data: dataObjects
    };

    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `${filename}.json`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }
}
