import React, { useState } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { LocalDbService } from '../../../lib/supabase';
import { Button, Card, Badge, Input, Modal } from '../../ui';
import { formatCurrency, formatDate } from '../../../lib/utils';
import { useToast } from '../../../context/ToastContext';
import {
  GraduationCap,
  Users,
  Layers,
  CalendarCheck,
  BarChart3,
  CheckSquare,
  Award,
  Briefcase,
  ShieldCheck,
  Plus,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Building2,
  Search
} from 'lucide-react';

interface TrainingCenterDashboardProps {
  activeTab: string;
  onTabChange: (tabId: string) => void;
}

export const TrainingCenterDashboard: React.FC<TrainingCenterDashboardProps> = ({ activeTab, onTabChange }) => {
  const { profile, organization } = useAuth();
  const { showToast } = useToast();

  const [courses, setCourses] = useState(() => LocalDbService.getCourses(organization?.id));
  const [batches, setBatches] = useState(() => LocalDbService.getBatches(organization?.id));
  const [students] = useState(() => LocalDbService.getProfiles(organization?.id).filter(p => p.role === 'candidate'));
  const [attendance, setAttendance] = useState(() => LocalDbService.getAttendance());
  const [certifications, setCertifications] = useState(() => LocalDbService.getCertifications(organization?.id));
  const [placements, setPlacements] = useState(() => LocalDbService.getPlacements(organization?.id));
  const verifications = LocalDbService.getEmploymentVerifications(organization?.id);

  // Attendance state
  const [selectedDate, setSelectedDate] = useState('2025-10-23');

  // Modals state
  const [isAddCourseOpen, setIsAddCourseOpen] = useState(false);
  const [courseName, setCourseName] = useState('');
  const [courseDuration, setCourseDuration] = useState('3 Months (360 Hours)');
  const [courseSkills, setCourseSkills] = useState('React.js, Node.js, PostgreSQL');

  const [isAddBatchOpen, setIsAddBatchOpen] = useState(false);
  const [batchName, setBatchName] = useState('');
  const [batchCapacity, setBatchCapacity] = useState(30);

  const [isIssueCertOpen, setIsIssueCertOpen] = useState(false);
  const [certCandidateId, setCertCandidateId] = useState(students[0]?.id || 'prof-cand-001');

  const [isAddPlacementOpen, setIsAddPlacementOpen] = useState(false);
  const [placementCompany, setPlacementCompany] = useState('');
  const [placementRole, setPlacementRole] = useState('');
  const [placementSalary, setPlacementSalary] = useState(480000);

  const handleCreateCourse = (e: React.FormEvent) => {
    e.preventDefault();
    if (!courseName.trim()) return;

    LocalDbService.createCourse({
      training_center_id: 'tc-001',
      organization_id: organization?.id || 'org-maha-001',
      name: courseName.trim(),
      description: 'Accredited vocational curriculum aligned to industry standards.',
      duration: courseDuration,
      skills: courseSkills.split(',').map(s => s.trim()),
      status: 'active'
    });

    setCourses(LocalDbService.getCourses(organization?.id));
    setIsAddCourseOpen(false);
    setCourseName('');
    showToast('Course Created', 'New curriculum added to training institute catalogue.', 'success');
  };

  const handleCreateBatch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!batchName.trim()) return;

    LocalDbService.createBatch({
      course_id: courses[0]?.id || 'crs-001',
      course_name: courses[0]?.name,
      training_center_id: 'tc-001',
      organization_id: organization?.id || 'org-maha-001',
      name: batchName.trim(),
      start_date: '2026-09-01',
      end_date: '2026-12-31',
      capacity: Number(batchCapacity)
    });

    setBatches(LocalDbService.getBatches(organization?.id));
    setIsAddBatchOpen(false);
    setBatchName('');
    showToast('Batch Created', 'New student batch created and ready for enrollment.', 'success');
  };

  const handleMarkAttendance = (candidateId: string, candidateName: string, status: 'present' | 'absent' | 'leave') => {
    LocalDbService.markAttendance('batch-001', candidateId, candidateName, organization?.id || 'org-maha-001', selectedDate, status);
    setAttendance(LocalDbService.getAttendance());
    showToast('Attendance Logged', `${candidateName} marked as ${status}.`, 'info');
  };

  const handleIssueCert = (e: React.FormEvent) => {
    e.preventDefault();
    const candidate = students.find(s => s.id === certCandidateId) || students[0];
    const certNum = `ST-MAHA-2026-${Math.floor(10000 + Math.random() * 90000)}`;

    LocalDbService.issueCertificate({
      candidate_id: candidate.id,
      training_center_id: 'tc-001',
      organization_id: organization?.id || 'org-maha-001',
      course_id: courses[0]?.id || 'crs-001',
      course_name: courses[0]?.name || 'Full Stack Engineering',
      certificate_number: certNum,
      issue_date: new Date().toISOString().split('T')[0],
      verification_status: 'valid',
      certificate_url: `https://skilltrack.io/verify/${certNum}`
    });

    setCertifications(LocalDbService.getCertifications(organization?.id));
    setIsIssueCertOpen(false);
    showToast('Certificate Issued', `Digital credential ${certNum} generated for ${candidate.full_name}.`, 'success');
  };

  const handleRecordPlacement = (e: React.FormEvent) => {
    e.preventDefault();
    if (!placementCompany.trim()) return;

    LocalDbService.recordPlacement({
      candidate_id: students[0]?.id || 'prof-cand-001',
      candidate_name: students[0]?.full_name || 'Aarav Patil',
      training_center_id: 'tc-001',
      organization_id: organization?.id || 'org-maha-001',
      company: placementCompany.trim(),
      job_role: placementRole || 'Software Associate',
      salary: Number(placementSalary),
      joining_date: new Date().toISOString().split('T')[0],
      verification_status: 'verified',
      employment_status: 'active'
    });

    setPlacements(LocalDbService.getPlacements(organization?.id));
    setIsAddPlacementOpen(false);
    setPlacementCompany('');
    setPlacementRole('');
    showToast('Placement Recorded', 'Placement added to employment tracking pipeline.', 'success');
  };

  return (
    <div className="space-y-6">
      {/* View 1: DASHBOARD */}
      {activeTab === 'dashboard' && (
        <div className="space-y-5">
          <div className="p-5 rounded-xl border border-slate-200 bg-white shadow-2xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <Badge variant="warning">Training Operations</Badge>
                <span className="text-xs text-slate-500">MSIAS Institute • {organization?.name}</span>
              </div>
              <h2 className="text-xl font-bold text-slate-900 mt-1">
                Welcome, {profile?.full_name || 'Prof. Rajesh Kulkarni'}
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Manage candidate enrollments, track daily biometric attendance, issue verifiable credentials, and record employment outcomes.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <Button size="sm" variant="secondary" onClick={() => setIsAddBatchOpen(true)}>
                New Batch
              </Button>
              <Button size="sm" variant="primary" onClick={() => setIsAddPlacementOpen(true)}>
                Record Placement
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
            <Card className="p-4">
              <div className="text-xs font-semibold text-slate-500">Enrolled Students</div>
              <div className="text-2xl font-bold text-slate-900 mt-1">128</div>
              <div className="text-[11px] text-emerald-600 font-medium mt-1">94% Attendance Rate</div>
            </Card>

            <Card className="p-4">
              <div className="text-xs font-semibold text-slate-500">Active Batches</div>
              <div className="text-2xl font-bold text-slate-900 mt-1">{batches.length}</div>
              <div className="text-[11px] text-indigo-600 font-medium mt-1">Across 3 courses</div>
            </Card>

            <Card className="p-4">
              <div className="text-xs font-semibold text-slate-500">Certificates Issued</div>
              <div className="text-2xl font-bold text-purple-600 mt-1">{certifications.length}</div>
              <div className="text-[11px] text-slate-500 mt-1">Verifiable Credentials</div>
            </Card>

            <Card className="p-4">
              <div className="text-xs font-semibold text-slate-500">Placements Confirmed</div>
              <div className="text-2xl font-bold text-emerald-600 mt-1">{placements.length}</div>
              <div className="text-[11px] text-emerald-600 font-medium mt-1">Avg CTC: ₹4.8 LPA</div>
            </Card>
          </div>

          {/* Quick Actions & Recent Placements */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card className="p-4 space-y-3">
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Active Training Batches</h3>
              <div className="space-y-2.5">
                {batches.map(b => (
                  <div key={b.id} className="p-3 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-between text-xs">
                    <div>
                      <h4 className="font-bold text-slate-900">{b.name}</h4>
                      <p className="text-slate-500 mt-0.5">{b.course_name || 'Vocational Tech'}</p>
                    </div>
                    <Badge variant="primary">{b.capacity} Seats</Badge>
                  </div>
                ))}
              </div>
            </Card>

            <Card className="p-4 space-y-3">
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Recent Placed Graduates</h3>
              <div className="space-y-2.5">
                {placements.map(p => (
                  <div key={p.id} className="p-3 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-between text-xs">
                    <div>
                      <h4 className="font-bold text-slate-900">{p.candidate_name || 'Aarav Patil'}</h4>
                      <p className="text-slate-500 mt-0.5">{p.company} • {p.job_role}</p>
                    </div>
                    <span className="font-bold text-emerald-700">{formatCurrency(p.salary)}/yr</span>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>
      )}

      {/* View 2: STUDENTS */}
      {activeTab === 'students' && (
        <div className="space-y-5">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Student Enrollment Directory</h2>
              <p className="text-xs text-slate-500 mt-0.5">Enrolled candidates under current training center</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
            {students.map(std => (
              <Card key={std.id} className="p-4 space-y-2.5">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-indigo-50 text-indigo-700 border border-indigo-200 flex items-center justify-center font-bold text-xs">
                    {std.full_name.charAt(0)}
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-slate-900">{std.full_name}</h3>
                    <p className="text-[11px] text-slate-500">{std.email}</p>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                  <span>District: {std.district || 'Pune'}</span>
                  <Badge variant="success">Completed</Badge>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* View 3: COURSES */}
      {activeTab === 'courses' && (
        <div className="space-y-5">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Course Curriculum Catalogue</h2>
              <p className="text-xs text-slate-500 mt-0.5">Approved skilling programs and modular certifications</p>
            </div>
            <Button size="sm" variant="primary" leftIcon={<Plus className="w-3.5 h-3.5" />} onClick={() => setIsAddCourseOpen(true)}>
              Add Course
            </Button>
          </div>

          <div className="space-y-3">
            {courses.map(crs => (
              <Card key={crs.id} className="p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-bold text-slate-900">{crs.name}</h3>
                    <Badge variant="primary">{crs.duration}</Badge>
                  </div>
                  <p className="text-xs text-slate-500 mt-1 max-w-2xl">{crs.description}</p>
                  <div className="mt-2.5 flex flex-wrap gap-1.5">
                    {crs.skills.map((s, i) => (
                      <span key={i} className="text-[10px] bg-slate-100 text-slate-700 border border-slate-200 px-2 py-0.5 rounded font-medium">
                        {s}
                      </span>
                    ))}
                  </div>
                </div>

                <Button size="sm" variant="secondary" onClick={() => setIsAddBatchOpen(true)}>
                  Create Batch
                </Button>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* View 4: BATCHES */}
      {activeTab === 'batches' && (
        <div className="space-y-5">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Batches & Cohorts</h2>
              <p className="text-xs text-slate-500 mt-0.5">Manage intake capacity, schedules, and active student groups</p>
            </div>
            <Button size="sm" variant="primary" leftIcon={<Plus className="w-3.5 h-3.5" />} onClick={() => setIsAddBatchOpen(true)}>
              Create Batch
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            {batches.map(batch => (
              <Card key={batch.id} className="p-4 space-y-2.5">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-slate-900">{batch.name}</h3>
                  <Badge variant="success">Active</Badge>
                </div>
                <p className="text-xs text-slate-500">{batch.course_name || 'Vocational Tech Program'}</p>
                <div className="grid grid-cols-2 gap-2 text-xs pt-2 border-t border-slate-100 text-slate-500">
                  <div>Capacity: <strong className="text-slate-900">{batch.capacity}</strong></div>
                  <div>Timeline: <strong className="text-slate-900">{batch.start_date} → {batch.end_date}</strong></div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* View 5: ATTENDANCE */}
      {activeTab === 'attendance' && (
        <div className="space-y-5">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Daily Biometric & Manual Attendance</h2>
              <p className="text-xs text-slate-500 mt-0.5">Audit-compliant attendance logging across batches</p>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-slate-600">Date:</span>
              <input
                type="date"
                value={selectedDate}
                onChange={e => setSelectedDate(e.target.value)}
                className="rounded-md border border-slate-200 bg-white px-3 py-1.5 text-xs text-slate-900 shadow-2xs focus:outline-none"
              />
            </div>
          </div>

          <Card className="p-4">
            <div className="space-y-2.5">
              {students.map(std => {
                const existing = attendance.find(a => a.candidate_id === std.id && a.attendance_date === selectedDate);
                const currentStatus = existing?.status || 'present';

                return (
                  <div key={std.id} className="p-3 rounded-lg bg-slate-50 border border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                    <div>
                      <h4 className="text-xs font-bold text-slate-900">{std.full_name}</h4>
                      <p className="text-[11px] text-slate-500">{std.email}</p>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <Button
                        size="sm"
                        variant={currentStatus === 'present' ? 'success' : 'outline'}
                        onClick={() => handleMarkAttendance(std.id, std.full_name, 'present')}
                      >
                        Present
                      </Button>
                      <Button
                        size="sm"
                        variant={currentStatus === 'absent' ? 'danger' : 'outline'}
                        onClick={() => handleMarkAttendance(std.id, std.full_name, 'absent')}
                      >
                        Absent
                      </Button>
                      <Button
                        size="sm"
                        variant={currentStatus === 'leave' ? 'warning' : 'outline'}
                        onClick={() => handleMarkAttendance(std.id, std.full_name, 'leave')}
                      >
                        Leave
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>
        </div>
      )}

      {/* View 6: CERTIFICATIONS */}
      {activeTab === 'certifications' && (
        <div className="space-y-5">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Issue Digital Certifications</h2>
              <p className="text-xs text-slate-500 mt-0.5">Generate cryptographically verifiable credentials for graduates</p>
            </div>
            <Button size="sm" variant="primary" leftIcon={<Award className="w-3.5 h-3.5" />} onClick={() => setIsIssueCertOpen(true)}>
              Issue Certificate
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            {certifications.map(cert => (
              <Card key={cert.id} className="p-4 space-y-2.5">
                <div className="flex items-center justify-between">
                  <Badge variant="success">Valid Certificate</Badge>
                  <span className="text-[11px] font-mono text-slate-500">{cert.certificate_number}</span>
                </div>
                <h3 className="text-sm font-bold text-slate-900">{cert.course_name}</h3>
                <p className="text-xs text-slate-600">Issued: {formatDate(cert.issue_date)}</p>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* View 7: PLACEMENTS */}
      {activeTab === 'placements' && (
        <div className="space-y-5">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Student Placement Register</h2>
              <p className="text-xs text-slate-500 mt-0.5">Record and monitor corporate job placements</p>
            </div>
            <Button size="sm" variant="primary" leftIcon={<Plus className="w-3.5 h-3.5" />} onClick={() => setIsAddPlacementOpen(true)}>
              Record Placement
            </Button>
          </div>

          <div className="space-y-2.5">
            {placements.map(plc => (
              <Card key={plc.id} className="p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-bold text-slate-900">{plc.candidate_name || 'Aarav Patil'}</h3>
                    <Badge variant="success">Employed</Badge>
                  </div>
                  <p className="text-xs text-slate-600 mt-0.5">{plc.job_role} at <strong className="text-slate-900">{plc.company}</strong></p>
                  <div className="text-[10px] text-slate-400 mt-0.5">Joined: {formatDate(plc.joining_date)}</div>
                </div>

                <div className="text-left sm:text-right">
                  <div className="text-xs font-bold text-emerald-700">{formatCurrency(plc.salary)}/year</div>
                  <Badge variant="purple" className="mt-1">Verified Placement</Badge>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* View 8: EMPLOYMENT TRACKING */}
      {activeTab === 'employment_tracking' && (
        <div className="space-y-5">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Longitudinal Retention Monitoring (3/6/12M)</h2>
            <p className="text-xs text-slate-500 mt-0.5">Continuous verification of wage remittance milestones to eliminate dropout attrition</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
            {verifications.map(ev => (
              <Card key={ev.id} className="p-4 space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-indigo-700 uppercase">{ev.verification_period.replace('_', ' ')}</span>
                  <Badge variant="success">Simulated Verified</Badge>
                </div>
                <h4 className="text-xs font-bold text-slate-900">{ev.candidate_name || 'Aarav Patil'}</h4>
                <p className="text-xs text-slate-600">{ev.notes}</p>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Modal 1: Add Course */}
      <Modal isOpen={isAddCourseOpen} onClose={() => setIsAddCourseOpen(false)} title="Create New Course">
        <form onSubmit={handleCreateCourse} className="space-y-3.5">
          <Input label="Course Name" value={courseName} onChange={e => setCourseName(e.target.value)} required />
          <Input label="Duration" value={courseDuration} onChange={e => setCourseDuration(e.target.value)} required />
          <Input label="Skills Taught (comma separated)" value={courseSkills} onChange={e => setCourseSkills(e.target.value)} required />
          <Button type="submit" className="w-full">Create Course</Button>
        </form>
      </Modal>

      {/* Modal 2: Add Batch */}
      <Modal isOpen={isAddBatchOpen} onClose={() => setIsAddBatchOpen(false)} title="Create Student Batch">
        <form onSubmit={handleCreateBatch} className="space-y-3.5">
          <Input label="Batch Name" placeholder="e.g. EV Batch 15" value={batchName} onChange={e => setBatchName(e.target.value)} required />
          <Input label="Capacity" type="number" value={batchCapacity} onChange={e => setBatchCapacity(Number(e.target.value))} required />
          <Button type="submit" className="w-full">Create Batch</Button>
        </form>
      </Modal>

      {/* Modal 3: Issue Certificate */}
      <Modal isOpen={isIssueCertOpen} onClose={() => setIsIssueCertOpen(false)} title="Issue Verified Certificate">
        <form onSubmit={handleIssueCert} className="space-y-3.5">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Select Graduate Student</label>
            <select
              value={certCandidateId}
              onChange={e => setCertCandidateId(e.target.value)}
              className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-xs text-slate-900 shadow-2xs focus:outline-none"
            >
              {students.map(s => (
                <option key={s.id} value={s.id}>{s.full_name} ({s.email})</option>
              ))}
            </select>
          </div>
          <Button type="submit" className="w-full">Issue Certificate</Button>
        </form>
      </Modal>

      {/* Modal 4: Add Placement */}
      <Modal isOpen={isAddPlacementOpen} onClose={() => setIsAddPlacementOpen(false)} title="Record Candidate Placement">
        <form onSubmit={handleRecordPlacement} className="space-y-3.5">
          <Input label="Hiring Company" placeholder="e.g. Tata Motors / Apex Infotech" value={placementCompany} onChange={e => setPlacementCompany(e.target.value)} required />
          <Input label="Job Role" placeholder="e.g. Junior Systems Engineer" value={placementRole} onChange={e => setPlacementRole(e.target.value)} required />
          <Input label="Annual Salary (₹)" type="number" value={placementSalary} onChange={e => setPlacementSalary(Number(e.target.value))} required />
          <Button type="submit" className="w-full">Save Placement Record</Button>
        </form>
      </Modal>
    </div>
  );
};
