import React, { useState, useMemo } from 'react';
import {
  LearningRoadmapSkill,
  RoadmapItem,
  CandidateRoadmapProgress,
  SkillGapItem
} from '../../../types';
import { Card, Badge, Button, Input } from '../../ui';
import {
  Map,
  CheckCircle2,
  Clock,
  BookOpen,
  Code2,
  CheckSquare,
  Award,
  Sparkles,
  AlertCircle,
  Play,
  ArrowRight,
  Filter,
  Search,
  ChevronDown,
  ChevronUp,
  Layers,
  Flame,
  Check,
  RotateCcw,
  ExternalLink,
  Target
} from 'lucide-react';

interface MicroRoadmapViewProps {
  targetJobName: string;
  roadmaps: LearningRoadmapSkill[];
  candidateProgress: CandidateRoadmapProgress[];
  onToggleProgress: (roadmapItemId: string, completed: boolean) => Promise<void>;
  onNavigateToCodeLab: () => void;
  onNavigateToAssessments: (skillName?: string) => void;
  onNavigateToSkillGap: () => void;
  initialSelectedSkillId?: string;
}

export const MicroRoadmapView: React.FC<MicroRoadmapViewProps> = ({
  targetJobName,
  roadmaps,
  candidateProgress,
  onToggleProgress,
  onNavigateToCodeLab,
  onNavigateToAssessments,
  onNavigateToSkillGap,
  initialSelectedSkillId
}) => {
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'MISSING' | 'IMPROVE' | 'READY'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedSkillIds, setExpandedSkillIds] = useState<Record<string, boolean>>(() => {
    const init: Record<string, boolean> = {};
    roadmaps.forEach(r => {
      // Default expand missing and improve skills or initially selected skill
      init[r.skill_id] = initialSelectedSkillId ? r.skill_id === initialSelectedSkillId : r.status !== 'READY';
    });
    return init;
  });
  const [togglingItemId, setTogglingItemId] = useState<string | null>(null);

  const toggleExpand = (skillId: string) => {
    setExpandedSkillIds(prev => ({
      ...prev,
      [skillId]: !prev[skillId]
    }));
  };

  const handleCheckboxClick = async (itemId: string, currentCompleted: boolean) => {
    setTogglingItemId(itemId);
    try {
      await onToggleProgress(itemId, !currentCompleted);
    } finally {
      setTogglingItemId(null);
    }
  };

  // Filtered Roadmaps
  const filteredRoadmaps = useMemo(() => {
    return roadmaps.filter(rm => {
      const matchStatus = selectedFilter === 'all' || rm.status === selectedFilter;
      const matchSearch =
        rm.skill_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        rm.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        rm.items.some(i => i.topic.toLowerCase().includes(searchQuery.toLowerCase()) || i.description.toLowerCase().includes(searchQuery.toLowerCase()));

      return matchStatus && matchSearch;
    });
  }, [roadmaps, selectedFilter, searchQuery]);

  // Overall Statistics
  const overallStats = useMemo(() => {
    let totalItems = 0;
    let completedItems = 0;
    let totalSkills = roadmaps.length;
    let fullyCompletedSkills = 0;

    roadmaps.forEach(rm => {
      totalItems += rm.total_items;
      completedItems += rm.completed_items;
      if (rm.completed_items === rm.total_items && rm.total_items > 0) {
        fullyCompletedSkills++;
      }
    });

    const percent = totalItems > 0 ? Math.round((completedItems / totalItems) * 100) : 0;

    return {
      totalItems,
      completedItems,
      totalSkills,
      fullyCompletedSkills,
      percent
    };
  }, [roadmaps]);

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-5 rounded-xl border border-slate-200 shadow-2xs">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Badge variant="primary" className="text-xs">
              AI Micro-Roadmap
            </Badge>
            <span className="text-xs text-slate-500 font-medium">Personalized for: {targetJobName}</span>
          </div>
          <h2 className="text-xl font-bold text-slate-900">Step-by-Step Skilling Pathways</h2>
          <p className="text-xs text-slate-500 max-w-xl">
            Structured modular lessons and practical capstones to bridge your identified skill deficits and prepare you for employer competency tests.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2.5 shrink-0">
          <Button
            size="sm"
            variant="outline"
            onClick={onNavigateToSkillGap}
            leftIcon={<Target className="w-3.5 h-3.5 text-indigo-600" />}
            className="text-xs"
          >
            Review Skill Gaps
          </Button>
          <Button
            size="sm"
            variant="primary"
            onClick={onNavigateToCodeLab}
            leftIcon={<Code2 className="w-3.5 h-3.5" />}
            className="text-xs"
          >
            Open Code Sandbox
          </Button>
        </div>
      </div>

      {/* Progress & Milestone Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-4 bg-gradient-to-r from-indigo-50/70 via-slate-50 to-emerald-50/50 border-indigo-100 md:col-span-2 flex flex-col justify-between">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-indigo-600" /> Overall Roadmap Completion
              </span>
              <span className="text-xs font-black text-indigo-700">{overallStats.percent}%</span>
            </div>
            <p className="text-xs text-slate-600">
              You have completed {overallStats.completedItems} of {overallStats.totalItems} micro-modules across {overallStats.totalSkills} critical skill tracks.
            </p>

            <div className="w-full bg-slate-200 rounded-full h-2.5 mt-2">
              <div
                className="bg-indigo-600 h-2.5 rounded-full transition-all duration-500 ease-out"
                style={{ width: `${overallStats.percent}%` }}
              />
            </div>
          </div>

          <div className="pt-3 mt-3 border-t border-slate-200/70 flex items-center justify-between text-xs text-slate-500">
            <span>Completed Skill Tracks: {overallStats.fullyCompletedSkills} / {overallStats.totalSkills}</span>
            <span className="text-emerald-700 font-bold flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-emerald-600" /> Continuous Auto-Save
            </span>
          </div>
        </Card>

        {/* Quick Tips Card */}
        <Card className="p-4 flex flex-col justify-between bg-slate-50 border-slate-200">
          <div className="space-y-1.5">
            <span className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
              <Flame className="w-3.5 h-3.5 text-amber-600" /> Skilling Protocol
            </span>
            <p className="text-xs text-slate-600 leading-relaxed">
              Complete the practical practice requirements for each topic before attempting the skill verification quiz.
            </p>
          </div>
          <div className="pt-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => onNavigateToAssessments()}
              leftIcon={<Award className="w-3.5 h-3.5 text-emerald-600" />}
              className="w-full text-xs"
            >
              Take Skill Quizzes
            </Button>
          </div>
        </Card>
      </div>

      {/* Filter & Search Bar */}
      <Card className="p-4 space-y-3">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search roadmap modules by skill, topic, or practice requirement..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:border-indigo-600 shadow-2xs"
              id="input-search-roadmap"
            />
          </div>

          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg text-xs overflow-x-auto">
            <button
              onClick={() => setSelectedFilter('all')}
              className={`px-3 py-1.5 rounded text-xs font-semibold shrink-0 transition-colors cursor-pointer ${
                selectedFilter === 'all' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              All Skills ({roadmaps.length})
            </button>
            <button
              onClick={() => setSelectedFilter('MISSING')}
              className={`px-3 py-1.5 rounded text-xs font-semibold shrink-0 transition-colors cursor-pointer ${
                selectedFilter === 'MISSING'
                  ? 'bg-rose-500 text-white shadow-2xs'
                  : 'text-rose-700 hover:bg-rose-100/50'
              }`}
            >
              Missing Skills ({roadmaps.filter(r => r.status === 'MISSING').length})
            </button>
            <button
              onClick={() => setSelectedFilter('IMPROVE')}
              className={`px-3 py-1.5 rounded text-xs font-semibold shrink-0 transition-colors cursor-pointer ${
                selectedFilter === 'IMPROVE'
                  ? 'bg-amber-500 text-white shadow-2xs'
                  : 'text-amber-700 hover:bg-amber-100/50'
              }`}
            >
              Needs Boost ({roadmaps.filter(r => r.status === 'IMPROVE').length})
            </button>
            <button
              onClick={() => setSelectedFilter('READY')}
              className={`px-3 py-1.5 rounded text-xs font-semibold shrink-0 transition-colors cursor-pointer ${
                selectedFilter === 'READY'
                  ? 'bg-emerald-600 text-white shadow-2xs'
                  : 'text-emerald-700 hover:bg-emerald-100/50'
              }`}
            >
              Mastered ({roadmaps.filter(r => r.status === 'READY').length})
            </button>
          </div>
        </div>
      </Card>

      {/* Roadmap Skill Tracks List */}
      <div className="space-y-4">
        {filteredRoadmaps.length > 0 ? (
          filteredRoadmaps.map(roadmap => {
            const isExpanded = expandedSkillIds[roadmap.skill_id] ?? true;

            return (
              <Card
                key={roadmap.skill_id}
                className={`overflow-hidden border transition-all ${
                  roadmap.status === 'MISSING'
                    ? 'border-rose-200/80 bg-rose-50/20'
                    : roadmap.status === 'IMPROVE'
                    ? 'border-amber-200/80 bg-amber-50/20'
                    : 'border-slate-200 bg-white'
                }`}
              >
                {/* Track Header (Clickable to Expand/Collapse) */}
                <div
                  onClick={() => toggleExpand(roadmap.skill_id)}
                  className="p-4 cursor-pointer hover:bg-slate-50/80 transition-colors flex flex-col md:flex-row md:items-center justify-between gap-4 select-none"
                >
                  <div className="flex items-start gap-3 flex-1">
                    <div
                      className={`p-2.5 rounded-lg border shrink-0 ${
                        roadmap.status === 'READY'
                          ? 'bg-emerald-100 border-emerald-300 text-emerald-800'
                          : roadmap.status === 'IMPROVE'
                          ? 'bg-amber-100 border-amber-300 text-amber-800'
                          : 'bg-rose-100 border-rose-300 text-rose-800'
                      }`}
                    >
                      {roadmap.status === 'READY' ? (
                        <CheckCircle2 className="w-5 h-5" />
                      ) : roadmap.status === 'IMPROVE' ? (
                        <Sparkles className="w-5 h-5" />
                      ) : (
                        <AlertCircle className="w-5 h-5" />
                      )}
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="text-sm font-bold text-slate-900">{roadmap.skill_name}</h3>
                        <Badge variant="primary" className="text-[10px]">
                          {roadmap.category}
                        </Badge>
                        <Badge
                          variant={
                            roadmap.status === 'READY'
                              ? 'success'
                              : roadmap.status === 'IMPROVE'
                              ? 'warning'
                              : 'danger'
                          }
                          className="text-[10px]"
                        >
                          {roadmap.status === 'READY'
                            ? 'Ready'
                            : roadmap.status === 'IMPROVE'
                            ? 'Needs Boost'
                            : 'Missing Skill'}
                        </Badge>
                        <Badge
                          variant={
                            roadmap.importance === 'Critical'
                              ? 'danger'
                              : roadmap.importance === 'High'
                              ? 'warning'
                              : 'default'
                          }
                          className="text-[10px]"
                        >
                          {roadmap.importance} Priority
                        </Badge>
                      </div>

                      <div className="text-xs text-slate-500 flex items-center gap-2">
                        <span>Current: <strong>{roadmap.current_proficiency}</strong></span>
                        <span>•</span>
                        <span>Target: <strong className="text-indigo-600">{roadmap.target_proficiency}</strong></span>
                        <span>•</span>
                        <span>{roadmap.items.length} Lessons</span>
                      </div>
                    </div>
                  </div>

                  {/* Progress & Toggle Chevron */}
                  <div className="flex items-center gap-4 shrink-0">
                    <div className="w-36 space-y-1 text-right">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-[11px] text-slate-500">Progress</span>
                        <strong className="text-indigo-700 font-bold">
                          {roadmap.completed_items}/{roadmap.total_items} ({roadmap.progress_percentage}%)
                        </strong>
                      </div>
                      <div className="w-full bg-slate-200 rounded-full h-1.5">
                        <div
                          className="bg-indigo-600 h-1.5 rounded-full transition-all duration-300"
                          style={{ width: `${roadmap.progress_percentage}%` }}
                        />
                      </div>
                    </div>

                    <button
                      className="p-1 rounded text-slate-400 hover:text-slate-700"
                      title={isExpanded ? 'Collapse' : 'Expand'}
                    >
                      {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                {/* Collapsible Roadmap Modules Timeline */}
                {isExpanded && (
                  <div className="border-t border-slate-200/80 bg-white p-4 space-y-3">
                    <div className="space-y-3">
                      {roadmap.items.map((item, idx) => (
                        <div
                          key={item.id}
                          className={`p-3.5 rounded-lg border transition-all flex flex-col sm:flex-row items-start justify-between gap-3 ${
                            item.completed
                              ? 'bg-emerald-50/40 border-emerald-200 text-slate-800'
                              : 'bg-slate-50/60 border-slate-200 text-slate-900 hover:bg-slate-50'
                          }`}
                        >
                          {/* Checkbox and Content */}
                          <div className="flex items-start gap-3 flex-1">
                            <button
                              onClick={() => handleCheckboxClick(item.id, Boolean(item.completed))}
                              disabled={togglingItemId === item.id}
                              className={`mt-0.5 w-5 h-5 rounded border flex items-center justify-center transition-colors cursor-pointer shrink-0 ${
                                item.completed
                                  ? 'bg-emerald-600 border-emerald-600 text-white shadow-2xs'
                                  : 'bg-white border-slate-300 hover:border-indigo-600'
                              }`}
                              title={item.completed ? 'Mark as incomplete' : 'Mark as complete'}
                              id={`check-roadmap-${item.id}`}
                            >
                              {item.completed && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                            </button>

                            <div className="space-y-1 flex-1">
                              <div className="flex items-center gap-2 flex-wrap">
                                <span className="text-xs font-bold text-slate-900">
                                  Step {idx + 1}: {item.topic}
                                </span>
                                <Badge variant="secondary" className="text-[10px]">
                                  {item.resource_type}
                                </Badge>
                                <span className="inline-flex items-center gap-1 text-[10px] text-slate-500 font-medium">
                                  <Clock className="w-3 h-3 text-slate-400" /> {item.estimated_time}
                                </span>
                                {item.assessment_ready && (
                                  <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
                                    <Award className="w-3 h-3 text-indigo-600" /> Test Prep
                                  </span>
                                )}
                              </div>

                              <p className="text-xs text-slate-600 leading-relaxed">{item.description}</p>

                              {item.practice_requirement && (
                                <div className="mt-2 p-2 rounded bg-white border border-slate-200 text-xs text-slate-700">
                                  <strong className="text-indigo-900 font-bold flex items-center gap-1 mb-0.5">
                                    <Code2 className="w-3.5 h-3.5 text-indigo-600" /> Practice Assignment:
                                  </strong>
                                  <span>{item.practice_requirement}</span>
                                </div>
                              )}
                            </div>
                          </div>

                          {/* Quick Action Button */}
                          <div className="sm:self-center shrink-0 flex items-center gap-1.5">
                            {item.assessment_ready ? (
                              <Button
                                size="sm"
                                variant="primary"
                                onClick={() => onNavigateToAssessments(roadmap.skill_name)}
                                className="text-xs py-1"
                              >
                                Take Quiz
                              </Button>
                            ) : (
                              <Button
                                size="sm"
                                variant="secondary"
                                onClick={onNavigateToCodeLab}
                                className="text-xs py-1"
                              >
                                Code Lab
                              </Button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </Card>
            );
          })
        ) : (
          <Card className="p-8 text-center space-y-2">
            <div className="w-10 h-10 rounded-full bg-slate-100 text-slate-400 mx-auto flex items-center justify-center">
              <Search className="w-5 h-5" />
            </div>
            <h3 className="text-xs font-bold text-slate-900">No Roadmaps Match Your Filter</h3>
            <p className="text-xs text-slate-500">Try switching your category or status filters above.</p>
          </Card>
        )}
      </div>
    </div>
  );
};
