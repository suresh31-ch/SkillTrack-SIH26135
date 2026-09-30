import React, { useState, useMemo } from 'react';
import { Card, Button, Badge, Modal, Input } from '../../../ui';
import {
  PostPlacementProfile,
  PostPlacementCheckInMilestone,
  PostPlacementLearningRecommendation
} from '../../../../types/studentJourney';
import { StudentJourneyService } from '../../../../lib/studentJourneyService';
import { useToast } from '../../../../context/ToastContext';
import {
  ShieldCheck,
  Building2,
  Calendar,
  CheckCircle2,
  Clock,
  Sparkles,
  ArrowRight,
  TrendingUp,
  Award,
  AlertCircle,
  HelpCircle,
  BarChart3,
  BookOpen,
  FileCheck,
  Briefcase
} from 'lucide-react';

interface PostPlacementJourneyViewProps {
  studentId: string;
  onNavigateToLearning?: () => void;
}

export const PostPlacementJourneyView: React.FC<PostPlacementJourneyViewProps> = ({
  studentId,
  onNavigateToLearning
}) => {
  const { showToast } = useToast();
  const [profile, setProfile] = useState<PostPlacementProfile | null>(() =>
    StudentJourneyService.getPostPlacementProfile(studentId)
  );

  // Setup / Manual Initiation Modal if not yet placed
  const [isInitModalOpen, setIsInitModalOpen] = useState(false);
  const [initCompany, setInitCompany] = useState('');
  const [initRole, setInitRole] = useState('');
  const [initJoiningDate, setInitJoiningDate] = useState(new Date().toISOString().split('T')[0]);
  const [initLocation, setInitLocation] = useState('Pune, Maharashtra');
  const [initSkillsUsed, setInitSkillsUsed] = useState('Java, Spring Boot, SQL, Git');

  // Active Check-in Modal
  const [activeCheckInMilestone, setActiveCheckInMilestone] = useState<PostPlacementCheckInMilestone | null>(null);
  const [checkInAnswers, setCheckInAnswers] = useState<Record<string, any>>({});

  const handleInitProfile = () => {
    if (!initCompany.trim() || !initRole.trim()) {
      showToast('Please provide Company and Role', 'warning');
      return;
    }

    const created = StudentJourneyService.initializePostPlacementProfile(studentId, {
      companyName: initCompany.trim(),
      roleTitle: initRole.trim(),
      employmentType: 'Full-time',
      workLocation: initLocation,
      joiningDate: initJoiningDate,
      skillsUsedInRole: initSkillsUsed.split(',').map(s => s.trim()).filter(Boolean)
    });

    setProfile(created);
    setIsInitModalOpen(false);
    showToast(`Post-placement journey initialized for ${created.companyName}!`, 'success');
  };

  const handleOpenCheckIn = (milestone: PostPlacementCheckInMilestone) => {
    setActiveCheckInMilestone(milestone);
    const initial: Record<string, any> = {};
    milestone.questions.forEach(q => {
      initial[q.id] = q.answer !== undefined ? q.answer : (q.responseType === 'yes_no' ? 'Yes' : q.responseType === 'scale_1_5' ? 5 : '');
    });
    setCheckInAnswers(initial);
  };

  const handleSubmitCheckIn = () => {
    if (!activeCheckInMilestone) return;
    const updated = StudentJourneyService.submitCheckInAnswers(
      studentId,
      activeCheckInMilestone.interval,
      checkInAnswers
    );
    setProfile(updated);
    setActiveCheckInMilestone(null);
    showToast(`Check-in for ${activeCheckInMilestone.milestoneTitle} submitted successfully!`, 'success');
  };

  const recommendations: PostPlacementLearningRecommendation[] = useMemo(() => {
    if (!profile) return [];
    return StudentJourneyService.getPostPlacementRecommendations(profile);
  }, [profile]);

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-teal-950 via-slate-900 to-indigo-950 text-white shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-1.5 max-w-2xl">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-teal-500/20 text-teal-300 border border-teal-500/30 flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" /> Module 10: Post-Placement Intelligence
            </span>
            <span className="text-xs text-slate-300">EPFO & Retention Tracking</span>
          </div>
          <h2 className="text-xl font-bold tracking-tight">Post-Placement Career Journey & Skill Retention</h2>
          <p className="text-xs text-slate-300 leading-relaxed">
            The skilling workflow doesn’t stop at receiving an offer. Track your day-one onboarding, submit 30/90/180-day transition check-ins, verify your employment outcomes, and receive post-placement upskilling recommendations.
          </p>
        </div>

        {!profile && (
          <Button
            size="md"
            variant="primary"
            onClick={() => setIsInitModalOpen(true)}
            className="text-xs font-semibold bg-teal-600 hover:bg-teal-500 text-white shrink-0 shadow-sm"
          >
            Record Placement Outcome
          </Button>
        )}
      </div>

      {/* When No Placement Recorded Yet */}
      {!profile ? (
        <Card className="p-8 text-center bg-slate-50 border border-dashed border-slate-300 space-y-3">
          <div className="w-12 h-12 rounded-full bg-teal-50 border border-teal-200 flex items-center justify-center text-teal-700 mx-auto">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-slate-800">No Placement Reported Yet</h4>
            <p className="text-xs text-slate-500 max-w-md mx-auto mt-1">
              Once you accept an offer or join an employer, report your placement here or via the Application Tracker to unlock longitudinal check-ins and retention intelligence.
            </p>
          </div>
          <Button
            size="sm"
            variant="primary"
            onClick={() => setIsInitModalOpen(true)}
            className="text-xs bg-teal-700 hover:bg-teal-600"
          >
            Record Placement & Start Post-Placement Journey
          </Button>
        </Card>
      ) : (
        <div className="space-y-6">
          {/* Section 1: Employment Profile Overview Card */}
          <div className="p-5 rounded-xl border border-slate-200 bg-white shadow-2xs space-y-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Badge variant="success" className="text-[10px]">
                    ✓ {profile.retentionStatus}
                  </Badge>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    profile.verificationStatus === 'Self-Reported'
                      ? 'bg-amber-100 text-amber-800 border border-amber-300'
                      : 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                  }`}>
                    Verification: {profile.verificationStatus}
                  </span>
                </div>
                <h3 className="text-xl font-bold text-slate-900">{profile.roleTitle}</h3>
                <div className="flex flex-wrap items-center gap-3 text-xs text-slate-600">
                  <span className="font-semibold text-slate-800 flex items-center gap-1">
                    <Building2 className="w-3.5 h-3.5 text-slate-400" /> {profile.companyName}
                  </span>
                  <span>•</span>
                  <span>Joined: {profile.joiningDate}</span>
                  <span>•</span>
                  <span>Location: {profile.workLocation}</span>
                  {profile.salaryCompensation && (
                    <>
                      <span>•</span>
                      <span className="text-emerald-700 font-bold">₹{profile.salaryCompensation} (Private)</span>
                    </>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    profile.verificationStatus = 'Placement Officer Confirmed';
                    profile.verifiedAt = new Date().toISOString();
                    profile.verifiedBy = 'Institutional Placement Officer (TPO)';
                    setProfile({ ...profile });
                    showToast('Employment verified by Placement Officer!', 'success');
                  }}
                  className="text-xs text-teal-700 border-teal-300 hover:bg-teal-50"
                >
                  <FileCheck className="w-3.5 h-3.5 mr-1" />
                  Simulate TPO Verification
                </Button>
              </div>
            </div>

            {/* Skills in Active Role */}
            <div className="pt-3 border-t border-slate-100 space-y-1">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                Skills Actively Applied on the Job
              </span>
              <div className="flex flex-wrap gap-1.5">
                {profile.skillsUsedInRole.map((sk, idx) => (
                  <span key={idx} className="px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-teal-50 text-teal-800 border border-teal-200">
                    {sk}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Section 2: Longitudinal Follow-up Check-ins Timeline */}
          <Card className="p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <div>
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <Clock className="w-4 h-4 text-teal-600" />
                  Longitudinal Follow-up Check-in Schedule
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Interval evaluations at Joining, 30 days, 90 days, 6 months, and 12 months track skill retention and workplace impact.
                </p>
              </div>
            </div>

            <div className="space-y-3">
              {profile.checkInMilestones.map((m, idx) => (
                <div
                  key={idx}
                  className={`p-4 rounded-xl border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 transition-colors ${
                    m.status === 'Completed'
                      ? 'bg-emerald-50/50 border-emerald-200'
                      : m.status === 'Pending'
                      ? 'bg-amber-50/50 border-amber-200'
                      : 'bg-slate-50 border-slate-200'
                  }`}
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        m.status === 'Completed'
                          ? 'bg-emerald-100 text-emerald-800'
                          : m.status === 'Pending'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-slate-200 text-slate-600'
                      }`}>
                        {m.interval} ({m.status})
                      </span>
                      <span className="text-xs font-bold text-slate-900">{m.milestoneTitle}</span>
                    </div>

                    <div className="text-[11px] text-slate-500 flex items-center gap-3">
                      <span>Scheduled Date: <strong>{m.dueDate}</strong></span>
                      {m.completedDate && (
                        <span>• Completed on: <strong>{new Date(m.completedDate).toLocaleDateString()}</strong></span>
                      )}
                    </div>

                    {/* If completed, display answers summary */}
                    {m.status === 'Completed' && (
                      <div className="pt-1.5 space-y-1 text-[11px] text-slate-700">
                        {m.questions.map(q => (
                          <div key={q.id} className="flex items-center gap-2">
                            <span className="text-slate-400">• {q.question}:</span>
                            <span className="font-semibold text-emerald-800">{String(q.answer || 'Yes')}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="shrink-0">
                    <Button
                      size="sm"
                      variant={m.status === 'Completed' ? 'outline' : 'primary'}
                      onClick={() => handleOpenCheckIn(m)}
                      className="text-xs"
                    >
                      {m.status === 'Completed' ? 'Review Answers' : 'Fill Check-in'}
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Section 3: Post-Placement Skilling Recommendations */}
          <Card className="p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <div>
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-indigo-600" />
                  Post-Placement Continuous Learning Recommendations
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  High-leverage engineering skills mapped to your {profile.roleTitle} role at {profile.companyName} for accelerated promotion.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {recommendations.map(rec => (
                <div key={rec.id} className="p-4 rounded-xl border border-slate-200 bg-white space-y-2.5 flex flex-col justify-between shadow-2xs">
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <Badge variant="purple" className="text-[9px]">{rec.targetProficiency}</Badge>
                      <span className="text-[10px] text-indigo-600 font-semibold">{rec.careerPathGain}</span>
                    </div>
                    <h4 className="text-xs font-bold text-slate-900">{rec.skillName}</h4>
                    <p className="text-[11px] text-slate-600 leading-relaxed">{rec.reason}</p>
                    <div className="p-2 rounded bg-slate-50 border border-slate-100 text-[10px] text-slate-500">
                      Course: <strong>{rec.recommendedCourseTitle}</strong> (~{rec.estimatedHours}h)
                    </div>
                  </div>

                  <Button
                    size="sm"
                    variant="outline"
                    onClick={onNavigateToLearning}
                    className="w-full text-xs text-indigo-700 border-indigo-200 hover:bg-indigo-50"
                  >
                    Open in Learning Hub
                  </Button>
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}

      {/* Manual Placement Initiation Modal */}
      {isInitModalOpen && (
        <Modal
          isOpen={isInitModalOpen}
          onClose={() => setIsInitModalOpen(false)}
          title="Record Joined Placement Outcome"
          maxWidth="max-w-md"
        >
          <div className="space-y-4 text-xs">
            <Input
              label="Hiring Employer *"
              value={initCompany}
              onChange={e => setInitCompany(e.target.value)}
              placeholder="e.g. Google, Microsoft, TCS, Infosys"
              required
            />

            <Input
              label="Joined Job Role *"
              value={initRole}
              onChange={e => setInitRole(e.target.value)}
              placeholder="e.g. Systems Engineer - Digital Track"
              required
            />

            <Input
              type="date"
              label="Joining Date *"
              value={initJoiningDate}
              onChange={e => setInitJoiningDate(e.target.value)}
              required
            />

            <Input
              label="Work Location"
              value={initLocation}
              onChange={e => setInitLocation(e.target.value)}
              placeholder="e.g. Pune, Maharashtra"
            />

            <Input
              label="Key Skills Applied on the Job (Comma-separated)"
              value={initSkillsUsed}
              onChange={e => setInitSkillsUsed(e.target.value)}
              placeholder="e.g. Python, SQL, Cloud Architecture"
            />

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
              <Button size="sm" variant="ghost" onClick={() => setIsInitModalOpen(false)}>
                Cancel
              </Button>
              <Button size="sm" variant="primary" onClick={handleInitProfile}>
                Confirm Placement
              </Button>
            </div>
          </div>
        </Modal>
      )}

      {/* Check-in Questions Modal */}
      {activeCheckInMilestone && (
        <Modal
          isOpen={Boolean(activeCheckInMilestone)}
          onClose={() => setActiveCheckInMilestone(null)}
          title={`${activeCheckInMilestone.interval} Check-in: ${activeCheckInMilestone.milestoneTitle}`}
          maxWidth="max-w-lg"
        >
          <div className="space-y-4 text-xs">
            <p className="text-slate-500">
              Submit your authentic feedback to measure training-to-employment translation. Responses are stored with your student profile.
            </p>

            <div className="space-y-3">
              {activeCheckInMilestone.questions.map(q => (
                <div key={q.id} className="p-3 rounded-lg border border-slate-200 bg-slate-50 space-y-2">
                  <label className="font-bold text-slate-800 block text-xs">{q.question}</label>
                  {q.responseType === 'yes_no' ? (
                    <div className="flex items-center gap-3">
                      <label className="flex items-center gap-1.5 cursor-pointer font-medium text-slate-700">
                        <input
                          type="radio"
                          name={q.id}
                          checked={checkInAnswers[q.id] === 'Yes'}
                          onChange={() => setCheckInAnswers(prev => ({ ...prev, [q.id]: 'Yes' }))}
                        />
                        <span>Yes</span>
                      </label>
                      <label className="flex items-center gap-1.5 cursor-pointer font-medium text-slate-700">
                        <input
                          type="radio"
                          name={q.id}
                          checked={checkInAnswers[q.id] === 'No'}
                          onChange={() => setCheckInAnswers(prev => ({ ...prev, [q.id]: 'No' }))}
                        />
                        <span>No</span>
                      </label>
                    </div>
                  ) : q.responseType === 'scale_1_5' ? (
                    <div className="flex items-center gap-2">
                      {[1, 2, 3, 4, 5].map(score => (
                        <button
                          key={score}
                          type="button"
                          onClick={() => setCheckInAnswers(prev => ({ ...prev, [q.id]: score }))}
                          className={`w-8 h-8 rounded-lg font-bold border transition-colors cursor-pointer ${
                            checkInAnswers[q.id] === score
                              ? 'bg-indigo-600 text-white border-indigo-600'
                              : 'bg-white text-slate-700 border-slate-300 hover:border-slate-400'
                          }`}
                        >
                          {score}
                        </button>
                      ))}
                      <span className="text-[10px] text-slate-400 ml-2">(1 = Low, 5 = Excellent)</span>
                    </div>
                  ) : (
                    <input
                      type="text"
                      value={checkInAnswers[q.id] || ''}
                      onChange={e => setCheckInAnswers(prev => ({ ...prev, [q.id]: e.target.value }))}
                      placeholder="Your response..."
                      className="w-full text-xs rounded border border-slate-300 p-2 bg-white"
                    />
                  )}
                </div>
              ))}
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
              <Button size="sm" variant="ghost" onClick={() => setActiveCheckInMilestone(null)}>
                Cancel
              </Button>
              <Button size="sm" variant="primary" onClick={handleSubmitCheckIn}>
                Submit Check-in
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
