import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { useToast } from '../../../context/ToastContext';
import { TrainingService, TrainingDashboardStats } from '../../../lib/trainingService';
import { Batch, Course, Enrollment, Attendance, Certification, Placement } from '../../../types';

import { TrainingOverview } from './TrainingOverview';
import { BatchManagementView } from './BatchManagementView';
import { StudentEnrollmentView } from './StudentEnrollmentView';
import { AttendanceManagementView } from './AttendanceManagementView';
import { CourseProgressView } from './CourseProgressView';
import { CertificationManagementView } from './CertificationManagementView';
import { TrainingOutcomesView } from './TrainingOutcomesView';
import { CertificateModal } from './CertificateModal';

interface TrainingCenterDashboardProps {
  activeTab: string;
  onTabChange: (tabId: string) => void;
}

export const TrainingCenterDashboard: React.FC<TrainingCenterDashboardProps> = ({
  activeTab,
  onTabChange
}) => {
  const { organization } = useAuth();
  const { showToast } = useToast();

  const orgId = organization?.id || 'org-maha-001';

  // Core Data State
  const [stats, setStats] = useState<TrainingDashboardStats>(() => TrainingService.getTrainingStats(orgId));
  const [batches, setBatches] = useState<Batch[]>(() => TrainingService.getBatches(orgId));
  const [courses, setCourses] = useState<Course[]>(() => TrainingService.getCourses(orgId));
  const [enrollments, setEnrollments] = useState<Enrollment[]>(() => TrainingService.getEnrollments(orgId));
  const [attendance, setAttendance] = useState<Attendance[]>(() => TrainingService.getAttendance());
  const [certifications, setCertifications] = useState<Certification[]>(() => TrainingService.getCertifications(orgId));
  const [placements, setPlacements] = useState<Placement[]>(() => TrainingService.getPlacements(orgId));

  // Cross-navigation context
  const [targetBatchIdForView, setTargetBatchIdForView] = useState<string | null>(null);

  // Certificate Modal State
  const [selectedCertForPreview, setSelectedCertForPreview] = useState<Certification | null>(null);
  const [isCertModalOpen, setIsCertModalOpen] = useState(false);

  // Synchronize state reload
  const reloadData = () => {
    setStats(TrainingService.getTrainingStats(orgId));
    setBatches(TrainingService.getBatches(orgId));
    setCourses(TrainingService.getCourses(orgId));
    setEnrollments(TrainingService.getEnrollments(orgId));
    setAttendance(TrainingService.getAttendance());
    setCertifications(TrainingService.getCertifications(orgId));
    setPlacements(TrainingService.getPlacements(orgId));
  };

  // 1. Batch Actions
  const handleCreateBatch = (data: Omit<Batch, 'id' | 'created_at'>) => {
    const newBatch = TrainingService.createBatch(data);
    reloadData();
    showToast('Batch Created', `Cohort "${newBatch.name}" created successfully with ${newBatch.capacity} seats.`, 'success');
  };

  const handleUpdateBatch = (batchId: string, updates: Partial<Batch>) => {
    TrainingService.updateBatch(batchId, updates);
    reloadData();
    showToast('Batch Updated', 'Cohort details updated.', 'info');
  };

  const handleDeleteBatch = (batchId: string) => {
    TrainingService.deleteBatch(batchId);
    reloadData();
    showToast('Batch Removed', 'Cohort was deleted.', 'warning');
  };

  // 2. Student Enrollment Actions
  const handleEnrollStudent = (data: {
    candidate_name: string;
    candidate_email: string;
    candidate_phone: string;
    candidate_district: string;
    batch_id: string;
    organization_id: string;
  }) => {
    const newEnr = TrainingService.enrollStudent(data);
    reloadData();
    showToast('Student Enrolled', `${newEnr.candidate_name} successfully enrolled in ${newEnr.batch_name}.`, 'success');
  };

  const handleRemoveEnrollment = (enrollmentId: string) => {
    TrainingService.removeEnrollment(enrollmentId);
    reloadData();
    showToast('Student Removed', 'Candidate enrollment was removed.', 'warning');
  };

  const handleUpdateEnrollmentProgress = (enrollmentId: string, updates: Partial<Enrollment>) => {
    TrainingService.updateEnrollment(enrollmentId, updates);
    reloadData();
    showToast('Progress Updated', 'Candidate curriculum progress and exam benchmarks saved.', 'success');
  };

  // 3. Attendance Actions
  const handleMarkAttendance = (
    batchId: string,
    candidateId: string,
    candidateName: string,
    date: string,
    status: 'present' | 'absent' | 'leave'
  ) => {
    TrainingService.markAttendance(batchId, candidateId, candidateName, orgId, date, status);
    reloadData();
    showToast('Attendance Logged', `${candidateName} marked as ${status}.`, 'info');
  };

  const handleMarkBulkAttendance = (
    batchId: string,
    students: Array<{ id: string; name: string }>,
    date: string,
    status: 'present' | 'absent'
  ) => {
    TrainingService.markBulkAttendance(batchId, students, orgId, date, status);
    reloadData();
    showToast('Bulk Attendance Logged', `Marked ${students.length} students as ${status}.`, 'success');
  };

  // 4. Certification Actions
  const handleIssueCertificate = (data: {
    candidate_id: string;
    candidate_name: string;
    candidate_email?: string;
    course_id: string;
    course_name: string;
    organization_id: string;
    grade?: 'A+' | 'A' | 'B+' | 'B' | 'Pass';
    score?: number;
  }) => {
    const newCert = TrainingService.issueCertificate(data);
    reloadData();
    showToast('Certificate Issued', `Verifiable credential ${newCert.certificate_number} issued for ${newCert.candidate_name}.`, 'success');
    setSelectedCertForPreview(newCert);
    setIsCertModalOpen(true);
  };

  const handleUpdateCertStatus = (certId: string, status: 'valid' | 'revoked' | 'pending') => {
    TrainingService.updateCertificateStatus(certId, status);
    reloadData();
    showToast('Status Updated', `Certificate marked as ${status}.`, 'info');
  };

  const handleViewCertificate = (cert: Certification) => {
    setSelectedCertForPreview(cert);
    setIsCertModalOpen(true);
  };

  // 5. Placement Actions
  const handleRecordPlacement = (data: {
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
  }) => {
    const newPlc = TrainingService.recordPlacement(data);
    reloadData();
    showToast('Placement Recorded', `Verified employment offer with ${newPlc.company} recorded for ${newPlc.candidate_name}.`, 'success');
  };

  const handleUpdatePlacement = (placementId: string, updates: Partial<Placement>) => {
    TrainingService.updatePlacement(placementId, updates);
    reloadData();
    showToast('Placement Updated', 'Placement record and verification status updated.', 'info');
  };

  const handleUpdateRetentionMilestone = (
    placementId: string,
    milestone: '3m' | '6m' | '12m',
    status: 'verified' | 'pending' | 'failed' | 'needs_review' | 'simulated_epfo_verified',
    notes?: string
  ) => {
    TrainingService.updateRetentionMilestone(placementId, milestone, status, notes);
    reloadData();
    showToast('Retention Milestone Updated', `${milestone.toUpperCase()} milestone status updated to ${status}.`, 'success');
  };

  const handleRunEpfoVerification = (placementId: string) => {
    const res = TrainingService.runEpfoVerification(placementId);
    reloadData();
    if (res.success) {
      showToast('EPFO Verification Passed', res.auditMessage, 'success');
    } else {
      showToast('Verification Failed', res.auditMessage, 'error');
    }
  };

  // Quick navigation helpers
  const handleNavigateToStudentsForBatch = (batchId: string) => {
    setTargetBatchIdForView(batchId);
    onTabChange('students');
  };

  const handleNavigateToAttendanceForBatch = (batchId: string) => {
    setTargetBatchIdForView(batchId);
    onTabChange('attendance');
  };

  return (
    <div className="space-y-6">
      {/* Tab 1: DASHBOARD OVERVIEW */}
      {activeTab === 'dashboard' && (
        <TrainingOverview
          stats={stats}
          batches={batches}
          enrollments={enrollments}
          certifications={certifications}
          placements={placements}
          onNavigateTab={onTabChange}
          onOpenNewBatchModal={() => onTabChange('batches')}
          onOpenEnrollStudentModal={() => onTabChange('students')}
          onOpenIssueCertModal={() => onTabChange('certifications')}
          onOpenRecordPlacementModal={() => onTabChange('placements')}
          onViewCertificate={handleViewCertificate}
        />
      )}

      {/* Tab 2: BATCHES */}
      {activeTab === 'batches' && (
        <BatchManagementView
          batches={batches}
          courses={courses}
          onCreateBatch={handleCreateBatch}
          onUpdateBatch={handleUpdateBatch}
          onDeleteBatch={handleDeleteBatch}
          onNavigateToStudents={handleNavigateToStudentsForBatch}
          onNavigateToAttendance={handleNavigateToAttendanceForBatch}
        />
      )}

      {/* Tab 3: STUDENTS */}
      {activeTab === 'students' && (
        <StudentEnrollmentView
          enrollments={enrollments}
          batches={batches}
          initialBatchId={targetBatchIdForView}
          onEnrollStudent={handleEnrollStudent}
          onRemoveEnrollment={handleRemoveEnrollment}
          onNavigateToProgress={() => onTabChange('progress')}
          onIssueCertificateForCandidate={enr => {
            const course = courses.find(c => c.name === enr.course_name) || courses[0];
            handleIssueCertificate({
              candidate_id: enr.candidate_id,
              candidate_name: enr.candidate_name || 'Aarav Patil',
              candidate_email: enr.candidate_email,
              course_id: course?.id || 'crs-001',
              course_name: enr.course_name || 'Vocational Tech Program',
              organization_id: orgId,
              grade: (enr.assessment_score || 95) >= 90 ? 'A+' : 'A',
              score: enr.assessment_score || 95
            });
          }}
        />
      )}

      {/* Tab 4: ATTENDANCE */}
      {activeTab === 'attendance' && (
        <AttendanceManagementView
          batches={batches}
          enrollments={enrollments}
          attendanceRecords={attendance}
          initialBatchId={targetBatchIdForView}
          onMarkAttendance={handleMarkAttendance}
          onMarkBulkAttendance={handleMarkBulkAttendance}
        />
      )}

      {/* Tab 5: COURSES & PROGRESS & ASSESSMENTS */}
      {(activeTab === 'courses' || activeTab === 'progress' || activeTab === 'assessments') && (
        <CourseProgressView
          courses={courses}
          enrollments={enrollments}
          batches={batches}
          onUpdateEnrollmentProgress={handleUpdateEnrollmentProgress}
          onIssueCertificateForCandidate={enr => {
            const course = courses.find(c => c.name === enr.course_name) || courses[0];
            handleIssueCertificate({
              candidate_id: enr.candidate_id,
              candidate_name: enr.candidate_name || 'Aarav Patil',
              candidate_email: enr.candidate_email,
              course_id: course?.id || 'crs-001',
              course_name: enr.course_name || 'Vocational Tech Program',
              organization_id: orgId,
              grade: (enr.assessment_score || 95) >= 90 ? 'A+' : 'A',
              score: enr.assessment_score || 95
            });
          }}
        />
      )}

      {/* Tab 6: CERTIFICATIONS */}
      {activeTab === 'certifications' && (
        <CertificationManagementView
          certifications={certifications}
          enrollments={enrollments}
          courses={courses}
          onIssueCertificate={handleIssueCertificate}
          onUpdateStatus={handleUpdateCertStatus}
          onViewCertificate={handleViewCertificate}
        />
      )}

      {/* Tab 7: PLACEMENTS & EMPLOYMENT TRACKING */}
      {(activeTab === 'placements' || activeTab === 'employment_tracking') && (
        <TrainingOutcomesView
          placements={placements}
          enrollments={enrollments}
          certificationsCount={certifications.length}
          onRecordPlacement={handleRecordPlacement}
          onUpdatePlacement={handleUpdatePlacement}
          onUpdateRetentionMilestone={handleUpdateRetentionMilestone}
          onRunEpfoVerification={handleRunEpfoVerification}
        />
      )}

      {/* Verifiable Certificate Modal */}
      <CertificateModal
        certificate={selectedCertForPreview}
        isOpen={isCertModalOpen}
        onClose={() => setIsCertModalOpen(false)}
      />
    </div>
  );
};
