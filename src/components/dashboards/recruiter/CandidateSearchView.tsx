import React, { useState, useMemo } from 'react';
import { RecruiterCandidateDetail, Job, Skill } from '../../../types';
import { Card, Badge, Button, Input, UserAvatar } from '../../ui';
import {
  Search,
  Filter,
  Award,
  MapPin,
  Briefcase,
  GraduationCap,
  CheckCircle2,
  ShieldCheck,
  Sparkles,
  UserCheck,
  Eye,
  SlidersHorizontal,
  ChevronRight,
  Star,
  Send,
  Check
} from 'lucide-react';

interface CandidateSearchViewProps {
  candidates: RecruiterCandidateDetail[];
  masterSkills: Skill[];
  jobs: Job[];
  onOpenCandidateProfile: (candidateId: string) => void;
  onShortlistCandidate: (candidate: RecruiterCandidateDetail, job: Job) => void;
}

export const CandidateSearchView: React.FC<CandidateSearchViewProps> = ({
  candidates,
  masterSkills,
  jobs,
  onOpenCandidateProfile,
  onShortlistCandidate
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSkillFilter, setSelectedSkillFilter] = useState<string>('all');
  const [selectedLocation, setSelectedLocation] = useState<string>('all');
  const [minReadinessScore, setMinReadinessScore] = useState<number>(70);
  const [minExperience, setMinExperience] = useState<number>(0);
  const [verifiedSkillsOnly, setVerifiedSkillsOnly] = useState(false);
  const [employmentStatusFilter, setEmploymentStatusFilter] = useState<string>('all');

  // Shortlist Modal State
  const [shortlistingCandidate, setShortlistingCandidate] = useState<RecruiterCandidateDetail | null>(null);
  const [targetJobId, setTargetJobId] = useState<string>(jobs[0]?.id || '');
  const [shortlistSuccessToast, setShortlistSuccessToast] = useState<string | null>(null);

  // Distinct locations
  const locations = useMemo(() => {
    return Array.from(new Set(candidates.map(c => c.district)));
  }, [candidates]);

  // Distinct skill names
  const skillOptions = useMemo(() => {
    const sSet = new Set<string>();
    candidates.forEach(c => c.skills.forEach(s => sSet.add(s.name)));
    return Array.from(sSet);
  }, [candidates]);

  // Filter candidates
  const filteredCandidates = useMemo(() => {
    return candidates.filter(cand => {
      // Search query matches name, target job, bio, or skills
      const q = searchQuery.toLowerCase();
      const matchesSearch =
        !q ||
        cand.full_name.toLowerCase().includes(q) ||
        cand.target_job.toLowerCase().includes(q) ||
        cand.bio.toLowerCase().includes(q) ||
        cand.skills.some(s => s.name.toLowerCase().includes(q));

      // Skill Filter
      const matchesSkill =
        selectedSkillFilter === 'all' ||
        cand.skills.some(s => s.name.toLowerCase() === selectedSkillFilter.toLowerCase());

      // Location Filter
      const matchesLocation =
        selectedLocation === 'all' || cand.district === selectedLocation;

      // Readiness Score
      const matchesReadiness = cand.readiness_score >= minReadinessScore;

      // Experience
      const matchesExperience = cand.experience_years >= minExperience;

      // Verified Skills Only
      const matchesVerified =
        !verifiedSkillsOnly || cand.skills.some(s => s.verified);

      // Employment Status
      const matchesStatus =
        employmentStatusFilter === 'all' || cand.employment_status === employmentStatusFilter;

      return (
        matchesSearch &&
        matchesSkill &&
        matchesLocation &&
        matchesReadiness &&
        matchesExperience &&
        matchesVerified &&
        matchesStatus
      );
    });
  }, [
    candidates,
    searchQuery,
    selectedSkillFilter,
    selectedLocation,
    minReadinessScore,
    minExperience,
    verifiedSkillsOnly,
    employmentStatusFilter
  ]);

  const handleExecuteShortlist = () => {
    if (!shortlistingCandidate) return;
    const job = jobs.find(j => j.id === targetJobId);
    if (job) {
      onShortlistCandidate(shortlistingCandidate, job);
      setShortlistSuccessToast(`${shortlistingCandidate.full_name} added to shortlist for ${job.title}`);
      setShortlistingCandidate(null);
      setTimeout(() => setShortlistSuccessToast(null), 4000);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 text-xs font-semibold border border-indigo-200 dark:border-indigo-800 mb-2">
            <ShieldCheck className="w-3.5 h-3.5" />
            Verified Talent Pool Discovery
          </div>
          <h2 className="text-2xl font-black text-slate-900 dark:text-slate-100">
            Candidate Search & Talent Discovery
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Discover and source certified youth candidates evaluated under state technical frameworks.
          </p>
        </div>

        <div className="text-xs font-bold px-3.5 py-1.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/50 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800/60 self-start sm:self-center">
          {filteredCandidates.length} of {candidates.length} Profiles Available
        </div>
      </div>

      {/* Success Notification Toast */}
      {shortlistSuccessToast && (
        <div className="p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200 text-xs font-bold flex items-center gap-2 animate-in fade-in">
          <Check className="w-4 h-4 text-emerald-600" />
          {shortlistSuccessToast}
        </div>
      )}

      {/* Search & Comprehensive Filters */}
      <Card className="p-5 border-slate-200 dark:border-slate-800 space-y-4">
        {/* Main Search Input */}
        <div className="relative">
          <Search className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
          <Input
            placeholder="Search by candidate name, target role (e.g. React, EV Technician, CNC, DevOps), or skills..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="pl-10 text-xs py-2.5"
          />
        </div>

        {/* Multi-Parameter Filter Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 pt-2">
          {/* Skill Filter */}
          <div>
            <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
              Required Skill
            </label>
            <select
              value={selectedSkillFilter}
              onChange={e => setSelectedSkillFilter(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 font-medium"
            >
              <option value="all">All Skills</option>
              {skillOptions.map(skill => (
                <option key={skill} value={skill}>
                  {skill}
                </option>
              ))}
            </select>
          </div>

          {/* Location Filter */}
          <div>
            <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
              District / Location
            </label>
            <select
              value={selectedLocation}
              onChange={e => setSelectedLocation(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 font-medium"
            >
              <option value="all">All Districts</option>
              {locations.map(loc => (
                <option key={loc} value={loc}>
                  {loc}
                </option>
              ))}
            </select>
          </div>

          {/* Minimum Experience */}
          <div>
            <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
              Min Experience
            </label>
            <select
              value={minExperience}
              onChange={e => setMinExperience(Number(e.target.value))}
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 font-medium"
            >
              <option value={0}>Any Experience / Fresher</option>
              <option value={1}>1+ Years</option>
              <option value={2}>2+ Years</option>
              <option value={3}>3+ Years</option>
            </select>
          </div>

          {/* Readiness Score Threshold Slider */}
          <div className="space-y-1">
            <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-wider text-slate-400">
              <span>Min Readiness</span>
              <span className="text-indigo-600 dark:text-indigo-400 font-bold">{minReadinessScore}%+</span>
            </div>
            <input
              type="range"
              min={50}
              max={95}
              step={5}
              value={minReadinessScore}
              onChange={e => setMinReadinessScore(Number(e.target.value))}
              className="w-full accent-indigo-600 cursor-pointer h-2 bg-slate-200 dark:bg-slate-700 rounded-lg"
            />
          </div>

          {/* Verified Only Toggle */}
          <div className="flex flex-col justify-end">
            <label className="flex items-center gap-2 p-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/40 cursor-pointer hover:bg-slate-100 transition-colors">
              <input
                type="checkbox"
                checked={verifiedSkillsOnly}
                onChange={e => setVerifiedSkillsOnly(e.target.checked)}
                className="w-4 h-4 rounded text-indigo-600 accent-indigo-600 focus:ring-indigo-500"
              />
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                Verified Only
              </span>
            </label>
          </div>
        </div>
      </Card>

      {/* Candidates Results Grid */}
      {filteredCandidates.length === 0 ? (
        <Card className="p-12 text-center border-slate-200 dark:border-slate-800">
          <Search className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
          <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
            No candidates matched your search criteria
          </h3>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            Try reducing the minimum readiness score or expanding your district and skill filters.
          </p>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setSearchQuery('');
              setSelectedSkillFilter('all');
              setSelectedLocation('all');
              setMinReadinessScore(60);
              setMinExperience(0);
              setVerifiedSkillsOnly(false);
            }}
            className="mt-4 text-xs font-semibold"
          >
            Reset All Filters
          </Button>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {filteredCandidates.map(cand => {
            const verifiedCount = cand.skills.filter(s => s.verified).length;

            return (
              <Card
                key={cand.id}
                hover
                className="p-5 border-slate-200 dark:border-slate-800 flex flex-col justify-between"
              >
                <div>
                  {/* Top: Avatar, Name, Readiness */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <UserAvatar
                          avatarUrl={cand.avatar_url}
                          name={cand.full_name}
                          size="xl"
                          className="w-14 h-14 rounded-2xl ring-2 ring-indigo-500/20 shadow-sm"
                        />
                        <span className="absolute -bottom-1 -right-1 bg-emerald-500 text-white rounded-full p-0.5 ring-2 ring-white dark:ring-slate-900" title="State Skilling Certified">
                          <CheckCircle2 className="w-3 h-3" />
                        </span>
                      </div>

                      <div className="min-w-0">
                        <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 hover:text-indigo-600 transition-colors">
                          {cand.full_name}
                        </h3>
                        <div className="text-xs text-indigo-600 dark:text-indigo-400 font-semibold truncate">
                          {cand.target_job}
                        </div>
                        <div className="flex items-center gap-2 text-[11px] text-slate-500 mt-0.5">
                          <span className="flex items-center gap-1">
                            <MapPin className="w-3 h-3" />
                            {cand.district}, {cand.state}
                          </span>
                          <span>•</span>
                          <span>{cand.experience_years === 0 ? 'Fresher' : `${cand.experience_years} Yrs Exp`}</span>
                        </div>
                      </div>
                    </div>

                    {/* Readiness Score Badge */}
                    <div className="text-center px-3 py-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 flex-shrink-0">
                      <div className="text-lg font-black text-emerald-600 dark:text-emerald-400 leading-none">
                        {cand.readiness_score}%
                      </div>
                      <div className="text-[9px] font-bold text-slate-500 dark:text-slate-400 mt-0.5">
                        Readiness
                      </div>
                    </div>
                  </div>

                  {/* Bio snippet */}
                  <p className="text-xs text-slate-600 dark:text-slate-400 mt-3 line-clamp-2 leading-relaxed">
                    {cand.bio}
                  </p>

                  {/* Skills Grid */}
                  <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800">
                    <div className="flex items-center justify-between text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-2">
                      <span>Evaluated Skill Matrix:</span>
                      <span className="text-emerald-600 dark:text-emerald-400 lowercase font-medium">
                        {verifiedCount} verified
                      </span>
                    </div>

                    <div className="flex flex-wrap gap-1.5">
                      {cand.skills.slice(0, 4).map(skill => (
                        <span
                          key={skill.id}
                          className={`text-[11px] px-2.5 py-0.5 rounded-lg font-medium flex items-center gap-1 ${
                            skill.verified
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800'
                              : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                          }`}
                        >
                          {skill.verified && <CheckCircle2 className="w-3 h-3 text-emerald-600" />}
                          {skill.name}
                        </span>
                      ))}
                      {cand.skills.length > 4 && (
                        <span className="text-[11px] px-1.5 py-0.5 text-slate-400 font-medium">
                          +{cand.skills.length - 4} more
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Bottom Actions */}
                <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
                  <div className="text-[11px] text-slate-500 truncate">
                    {cand.education[0]?.degree || 'Graduate'}
                  </div>

                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setShortlistingCandidate(cand)}
                      className="text-xs font-semibold px-2.5 py-1 text-indigo-600 dark:text-indigo-400"
                    >
                      <UserCheck className="w-3.5 h-3.5 mr-1" />
                      Shortlist
                    </Button>

                    <Button
                      size="sm"
                      variant="primary"
                      onClick={() => onOpenCandidateProfile(cand.profile_id || cand.id)}
                      className="text-xs font-bold px-3 py-1 bg-indigo-600 hover:bg-indigo-500"
                    >
                      <Eye className="w-3.5 h-3.5 mr-1" />
                      Full Profile
                    </Button>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {/* Shortlist Modal Dialog */}
      {shortlistingCandidate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
          <div
            className="w-full max-w-md bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 p-6 space-y-4"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b pb-3 border-slate-100 dark:border-slate-800">
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <UserCheck className="w-5 h-5 text-indigo-600" />
                Shortlist Candidate
              </h3>
              <button
                onClick={() => setShortlistingCandidate(null)}
                className="text-slate-400 hover:text-slate-600 text-xs"
              >
                ✕
              </button>
            </div>

            <div>
              <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 mb-3">
                <UserAvatar
                  avatarUrl={shortlistingCandidate.avatar_url}
                  name={shortlistingCandidate.full_name}
                  size="md"
                  className="w-10 h-10 rounded-xl"
                />
                <div>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100">
                    {shortlistingCandidate.full_name}
                  </h4>
                  <div className="text-[11px] text-slate-500">
                    {shortlistingCandidate.target_job} • {shortlistingCandidate.readiness_score}% Readiness
                  </div>
                </div>
              </div>

              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1.5">
                Select Active Job Vacancy:
              </label>
              <select
                value={targetJobId}
                onChange={e => setTargetJobId(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 font-medium"
              >
                {jobs.map(job => (
                  <option key={job.id} value={job.id}>
                    {job.title} — {job.company_name} ({job.location})
                  </option>
                ))}
              </select>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
              <Button
                size="sm"
                variant="ghost"
                onClick={() => setShortlistingCandidate(null)}
                className="text-xs"
              >
                Cancel
              </Button>
              <Button
                size="sm"
                variant="primary"
                onClick={handleExecuteShortlist}
                className="text-xs font-bold bg-indigo-600 hover:bg-indigo-500"
              >
                <Send className="w-3.5 h-3.5 mr-1" />
                Confirm Shortlist
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
