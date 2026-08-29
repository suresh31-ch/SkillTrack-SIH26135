import { supabase, isSupabaseConfigured, LocalDbService } from './supabase';
import {
  Profile,
  CandidateProfile,
  Skill,
  CandidateSkill,
  JobRole,
  JobRoleSkill,
  SkillGapItem,
  SkillGapAnalysisResult,
  SkillGapStatus,
  SkillGapSeverity,
  RoadmapItem,
  LearningRoadmapSkill,
  CandidateRoadmapProgress
} from '../types';

export interface ProfileCompletionDetails {
  percentage: number;
  completedCount: number;
  totalCheckpoints: number;
  missingItems: string[];
  completedItems: string[];
}

const PROFICIENCY_RANKS: Record<string, number> = {
  'None': 0,
  'Beginner': 1,
  'Intermediate': 2,
  'Advanced': 3,
  'Expert': 4
};

const IMPORTANCE_WEIGHTS: Record<string, number> = {
  'Critical': 4,
  'High': 3,
  'Medium': 2,
  'Low': 1
};

export class CandidateService {
  /**
   * Calculate profile completion score with granular item breakdown
   */
  static calculateCompletionBreakdown(
    profile: Profile | null,
    candidateProfile: CandidateProfile | null,
    skills: CandidateSkill[]
  ): ProfileCompletionDetails {
    const checkpoints = [
      { label: 'Full Name', done: Boolean(profile?.full_name?.trim()), weight: 8 },
      { label: 'Email Address', done: Boolean(profile?.email?.trim()), weight: 8 },
      { label: 'Contact Phone Number', done: Boolean(profile?.phone?.trim()), weight: 8 },
      { label: 'District / Region', done: Boolean(profile?.district?.trim()), weight: 8 },
      { label: 'Profile Photo / Avatar', done: Boolean(profile?.avatar_url?.trim()), weight: 8 },
      { label: 'Highest Education Level', done: Boolean(candidateProfile?.education?.trim()), weight: 8 },
      { label: 'Degree / Specialization', done: Boolean(candidateProfile?.degree?.trim()), weight: 8 },
      { label: 'Graduation Year', done: Boolean(candidateProfile?.graduation_year && candidateProfile.graduation_year > 1990), weight: 8 },
      { label: 'Target Career Role', done: Boolean(candidateProfile?.target_job?.trim()), weight: 8 },
      { label: 'Current Employment Status', done: Boolean(candidateProfile?.employment_status?.trim()), weight: 8 },
      { label: 'Primary Technical Skill', done: skills.length >= 1, weight: 10 },
      { label: '3+ Skills Added for Job Matching', done: skills.length >= 3, weight: 10 }
    ];

    const completedItems = checkpoints.filter(c => c.done).map(c => c.label);
    const missingItems = checkpoints.filter(c => !c.done).map(c => c.label);
    const percentage = checkpoints.reduce((acc, c) => acc + (c.done ? c.weight : 0), 0);

    return {
      percentage: Math.min(100, Math.max(0, percentage)),
      completedCount: completedItems.length,
      totalCheckpoints: checkpoints.length,
      missingItems,
      completedItems
    };
  }

  /**
   * Fetch master skills catalog with search and category filters directly from PostgreSQL
   */
  static async getMasterSkills(search?: string, category?: string): Promise<Skill[]> {
    if (isSupabaseConfigured() && supabase) {
      try {
        let query = supabase.from('skills').select('*').order('name', { ascending: true });
        if (category && category !== 'all') {
          query = query.eq('category', category);
        }
        if (search && search.trim()) {
          query = query.ilike('name', `%${search.trim()}%`);
        }
        const { data, error } = await query;
        if (!error && data && data.length > 0) {
          return data as Skill[];
        }
      } catch (err) {
        console.warn('Supabase getMasterSkills notice, falling back to LocalDb:', err);
      }
    }

    let skills = LocalDbService.getSkills();
    if (category && category !== 'all') {
      skills = skills.filter(s => s.category.toLowerCase() === category.toLowerCase());
    }
    if (search && search.trim()) {
      const q = search.toLowerCase().trim();
      skills = skills.filter(s => s.name.toLowerCase().includes(q) || s.category.toLowerCase().includes(q) || s.description?.toLowerCase().includes(q));
    }
    return skills;
  }

  /**
   * Helper to resolve candidate_profiles UUID from either profile_id or candidate_profiles.id
   */
  private static async resolveCandidateProfileId(profileOrCandidateId: string): Promise<string> {
    if (isSupabaseConfigured() && supabase) {
      try {
        const { data } = await supabase
          .from('candidate_profiles')
          .select('id')
          .or(`id.eq.${profileOrCandidateId},profile_id.eq.${profileOrCandidateId}`)
          .maybeSingle();

        if (data?.id) {
          return data.id;
        }
      } catch (err) {
        // Continue to fallback
      }
    }
    return profileOrCandidateId;
  }

  /**
   * Fetch candidate skills joined with master skill info from Supabase
   */
  static async getCandidateSkills(profileOrCandidateId: string): Promise<CandidateSkill[]> {
    if (isSupabaseConfigured() && supabase) {
      try {
        const targetCandId = await this.resolveCandidateProfileId(profileOrCandidateId);

        const { data, error } = await supabase
          .from('candidate_skills')
          .select('*, skill:skills(*)')
          .or(`candidate_id.eq.${targetCandId},candidate_id.eq.${profileOrCandidateId}`)
          .order('created_at', { ascending: false });

        if (!error && data) {
          return data.map((item: any) => ({
            id: item.id,
            candidate_id: item.candidate_id,
            skill_id: item.skill_id,
            proficiency_level: item.proficiency_level,
            verified: Boolean(item.verified),
            created_at: item.created_at,
            skill: item.skill
          })) as CandidateSkill[];
        }
      } catch (err) {
        console.warn('Supabase getCandidateSkills notice, falling back to LocalDb:', err);
      }
    }

    return LocalDbService.getCandidateSkills(profileOrCandidateId);
  }

  /**
   * Add a skill to the candidate's profile
   * Note: Candidate-added skills are always unverified (verified = false) for security
   */
  static async addCandidateSkill(
    profileId: string,
    skillId: string,
    proficiencyLevel: CandidateSkill['proficiency_level']
  ): Promise<void> {
    if (isSupabaseConfigured() && supabase) {
      try {
        const targetCandId = await this.resolveCandidateProfileId(profileId);

        const { error } = await supabase
          .from('candidate_skills')
          .upsert(
            {
              candidate_id: targetCandId,
              skill_id: skillId,
              proficiency_level: proficiencyLevel,
              verified: false
            },
            { onConflict: 'candidate_id,skill_id' }
          );

        if (error) {
          console.warn('Supabase addCandidateSkill notice:', error.message);
        }
      } catch (err) {
        console.warn('Supabase addCandidateSkill fallback to local:', err);
      }
    }

    // Always update local cache as well
    LocalDbService.addCandidateSkill(profileId, skillId, proficiencyLevel);
  }

  /**
   * Update proficiency level of an existing skill
   */
  static async updateCandidateSkillProficiency(
    candidateSkillId: string,
    proficiencyLevel: CandidateSkill['proficiency_level']
  ): Promise<void> {
    if (isSupabaseConfigured() && supabase) {
      try {
        const { error } = await supabase
          .from('candidate_skills')
          .update({
            proficiency_level: proficiencyLevel,
            updated_at: new Date().toISOString()
          })
          .eq('id', candidateSkillId);

        if (error) {
          console.warn('Supabase updateCandidateSkill notice:', error.message);
        }
      } catch (err) {
        console.warn('Supabase updateCandidateSkill fallback to local:', err);
      }
    }

    LocalDbService.updateCandidateSkill(candidateSkillId, proficiencyLevel);
  }

  /**
   * Remove a skill from the candidate's profile
   */
  static async removeCandidateSkill(
    candidateSkillId: string,
    profileId: string
  ): Promise<void> {
    if (isSupabaseConfigured() && supabase) {
      try {
        const { error } = await supabase
          .from('candidate_skills')
          .delete()
          .eq('id', candidateSkillId);

        if (error) {
          console.warn('Supabase removeCandidateSkill notice:', error.message);
        }
      } catch (err) {
        console.warn('Supabase removeCandidateSkill fallback to local:', err);
      }
    }

    LocalDbService.removeCandidateSkill(candidateSkillId, profileId);
  }

  /**
   * Fetch candidate profile from Supabase
   */
  static async getCandidateProfile(profileId: string): Promise<CandidateProfile | null> {
    if (isSupabaseConfigured() && supabase) {
      try {
        const { data, error } = await supabase
          .from('candidate_profiles')
          .select('*')
          .or(`profile_id.eq.${profileId},id.eq.${profileId}`)
          .maybeSingle();

        if (!error && data) {
          return data as CandidateProfile;
        }

        // If no candidate_profile row exists yet for this profile, create one gracefully in Supabase
        if (!error && !data && profileId && !profileId.startsWith('prof-cand-demo')) {
          const { data: prof } = await supabase
            .from('profiles')
            .select('id, organization_id, role')
            .eq('id', profileId)
            .maybeSingle();

          if (prof && prof.role === 'candidate') {
            const { data: newCp, error: cpErr } = await supabase
              .from('candidate_profiles')
              .insert({
                profile_id: prof.id,
                organization_id: prof.organization_id,
                education: 'Bachelor of Technology (B.Tech)',
                degree: 'Computer Engineering',
                graduation_year: 2025,
                experience_years: 0,
                employment_status: 'in_training',
                target_job: 'Full Stack Web Developer',
                readiness_score: 75,
                profile_completion: 80
              })
              .select()
              .maybeSingle();

            if (!cpErr && newCp) {
              return newCp as CandidateProfile;
            }
          }
        }
      } catch (err) {
        console.warn('Supabase getCandidateProfile notice, falling back to LocalDb:', err);
      }
    }

    return LocalDbService.getCandidateProfile(profileId) || null;
  }

  /**
   * Update candidate profile and base profile in Supabase and local cache
   */
  static async updateCandidateProfileDetails(
    profileId: string,
    profileUpdates: Partial<Profile>,
    candidateUpdates: Partial<CandidateProfile>
  ): Promise<{ profile: Profile | null; candidateProfile: CandidateProfile | null }> {
    // 1. Update in Supabase
    if (isSupabaseConfigured() && supabase) {
      try {
        if (Object.keys(profileUpdates).length > 0) {
          await supabase
            .from('profiles')
            .update({
              ...profileUpdates,
              updated_at: new Date().toISOString()
            })
            .eq('id', profileId);
        }

        if (Object.keys(candidateUpdates).length > 0) {
          await supabase
            .from('candidate_profiles')
            .update({
              ...candidateUpdates,
              updated_at: new Date().toISOString()
            })
            .or(`profile_id.eq.${profileId},id.eq.${profileId}`);
        }
      } catch (err) {
        console.warn('Supabase updateCandidateProfileDetails error, falling back to LocalDb:', err);
      }
    }

    // 2. Update LocalDb Cache
    const updatedProfile = LocalDbService.updateProfile(profileId, profileUpdates);
    const updatedCandidateProfile = LocalDbService.updateCandidateProfile(profileId, candidateUpdates);

    return {
      profile: updatedProfile,
      candidateProfile: updatedCandidateProfile
    };
  }

  // =========================================================================
  // JOB ROLES & REQUIREMENTS
  // =========================================================================

  /**
   * Fetch all supported job roles from Supabase or fallback
   */
  static async getJobRoles(): Promise<JobRole[]> {
    if (isSupabaseConfigured() && supabase) {
      try {
        const { data, error } = await supabase
          .from('job_roles')
          .select('*')
          .order('name', { ascending: true });

        if (!error && data && data.length > 0) {
          return data as JobRole[];
        }
      } catch (err) {
        console.warn('Supabase getJobRoles notice, falling back to LocalDb:', err);
      }
    }

    return LocalDbService.getJobRoles();
  }

  /**
   * Fetch skill requirements for a given job role
   */
  static async getJobRoleSkills(jobRoleId?: string): Promise<JobRoleSkill[]> {
    if (isSupabaseConfigured() && supabase) {
      try {
        let query = supabase
          .from('job_role_skills')
          .select('*, skill:skills(*)');

        if (jobRoleId) {
          query = query.eq('job_role_id', jobRoleId);
        }

        const { data, error } = await query;
        if (!error && data && data.length > 0) {
          return data as JobRoleSkill[];
        }
      } catch (err) {
        console.warn('Supabase getJobRoleSkills notice, falling back to LocalDb:', err);
      }
    }

    return LocalDbService.getJobRoleSkills(jobRoleId);
  }

  /**
   * Fetch micro-roadmap item modules
   */
  static async getRoadmapItems(skillId?: string): Promise<RoadmapItem[]> {
    if (isSupabaseConfigured() && supabase) {
      try {
        let query = supabase
          .from('roadmap_items')
          .select('*, skill:skills(name)')
          .order('order_index', { ascending: true });

        if (skillId) {
          query = query.eq('skill_id', skillId);
        }

        const { data, error } = await query;
        if (!error && data && data.length > 0) {
          return data.map((item: any) => ({
            id: item.id,
            roadmap_id: item.roadmap_id,
            skill_id: item.skill_id,
            skill_name: item.skill?.name || 'Technical Skill',
            topic: item.topic,
            description: item.description,
            order_index: item.order_index,
            estimated_time: item.estimated_time,
            resource_type: item.resource_type,
            practice_requirement: item.practice_requirement,
            assessment_ready: Boolean(item.assessment_ready)
          })) as RoadmapItem[];
        }
      } catch (err) {
        console.warn('Supabase getRoadmapItems notice, falling back to LocalDb:', err);
      }
    }

    return LocalDbService.getRoadmapItems(skillId);
  }

  /**
   * Fetch candidate's completed roadmap items
   */
  static async getCandidateRoadmapProgress(profileOrCandId: string): Promise<CandidateRoadmapProgress[]> {
    if (isSupabaseConfigured() && supabase) {
      try {
        const targetCandId = await this.resolveCandidateProfileId(profileOrCandId);

        const { data, error } = await supabase
          .from('candidate_roadmap_progress')
          .select('*')
          .or(`candidate_id.eq.${targetCandId},candidate_id.eq.${profileOrCandId}`);

        if (!error && data) {
          return data as CandidateRoadmapProgress[];
        }
      } catch (err) {
        console.warn('Supabase getCandidateRoadmapProgress notice, falling back to LocalDb:', err);
      }
    }

    return LocalDbService.getCandidateRoadmapProgress(profileOrCandId);
  }

  /**
   * Mark a roadmap item as completed or pending
   */
  static async toggleRoadmapItemProgress(
    profileOrCandId: string,
    roadmapItemId: string,
    completed: boolean
  ): Promise<CandidateRoadmapProgress[]> {
    if (isSupabaseConfigured() && supabase) {
      try {
        const targetCandId = await this.resolveCandidateProfileId(profileOrCandId);

        if (completed) {
          await supabase
            .from('candidate_roadmap_progress')
            .upsert({
              candidate_id: targetCandId,
              roadmap_item_id: roadmapItemId,
              status: 'completed',
              completed_at: new Date().toISOString()
            }, { onConflict: 'candidate_id,roadmap_item_id' });
        } else {
          await supabase
            .from('candidate_roadmap_progress')
            .delete()
            .match({ candidate_id: targetCandId, roadmap_item_id: roadmapItemId });
        }
      } catch (err) {
        console.warn('Supabase toggleRoadmapItemProgress notice:', err);
      }
    }

    return LocalDbService.toggleRoadmapProgress(profileOrCandId, roadmapItemId, completed);
  }

  // =========================================================================
  // AI SKILL GAP ENGINE (DETERMINISTIC ANALYSIS & MATCHING)
  // =========================================================================

  /**
   * Helper to find matching candidate skill with fuzzy skill name harmonization
   */
  private static findMatchingCandidateSkill(
    reqSkill: { id: string; name?: string; category?: string },
    candidateSkills: CandidateSkill[]
  ): CandidateSkill | undefined {
    // 1. Direct ID match
    const directMatch = candidateSkills.find(cs => cs.skill_id === reqSkill.id || cs.skill?.id === reqSkill.id);
    if (directMatch) return directMatch;

    const reqName = (reqSkill.name || '').toLowerCase().trim();
    if (!reqName) return undefined;

    // 2. Name equality or containment
    return candidateSkills.find(cs => {
      const candName = (cs.skill?.name || '').toLowerCase().trim();
      if (!candName) return false;

      if (candName === reqName) return true;

      // React variations
      if ((reqName.includes('react') || reqName === 'react') && candName.includes('react')) return true;
      // Node variations
      if ((reqName.includes('node') || reqName === 'node.js') && candName.includes('node')) return true;
      // Express variations
      if (reqName.includes('express') && (candName.includes('express') || candName.includes('node'))) return true;
      // SQL / PostgreSQL variations
      if ((reqName.includes('sql') || reqName.includes('postgres')) && (candName.includes('sql') || candName.includes('postgres') || candName.includes('database'))) return true;
      // TypeScript / JS
      if (reqName.includes('typescript') && candName.includes('typescript')) return true;
      if (reqName.includes('javascript') && (candName.includes('javascript') || candName.includes('typescript') || candName.includes('react'))) return true;
      // Python
      if (reqName.includes('python') && candName.includes('python')) return true;
      // HTML & CSS
      if ((reqName.includes('html') || reqName.includes('css')) && (candName.includes('tailwind') || candName.includes('css') || candName.includes('html') || candName.includes('frontend'))) return true;
      // Docker / Cloud / DevOps
      if (reqName.includes('docker') && (candName.includes('docker') || candName.includes('devops') || candName.includes('cloud'))) return true;
      if (reqName.includes('cloud') && (candName.includes('cloud') || candName.includes('aws') || candName.includes('azure') || candName.includes('gcp'))) return true;
      if (reqName.includes('devops') && (candName.includes('devops') || candName.includes('docker') || candName.includes('cloud'))) return true;
      // ML & AI
      if ((reqName.includes('machine learning') || reqName.includes('ai') || reqName.includes('data science')) && (candName.includes('machine learning') || candName.includes('scikit') || candName.includes('ai') || candName.includes('python'))) return true;
      // Git
      if (reqName.includes('git') && (candName.includes('git') || candName.includes('github'))) return true;

      return false;
    });
  }

  /**
   * Deterministically analyze skill gap against a target job role
   */
  static analyzeSkillGap(
    targetJobNameOrId: string,
    candidateSkills: CandidateSkill[],
    jobRoles: JobRole[] = LocalDbService.getJobRoles(),
    allRoleSkills: JobRoleSkill[] = LocalDbService.getJobRoleSkills(),
    masterSkills: Skill[] = LocalDbService.getSkills()
  ): SkillGapAnalysisResult {
    // 1. Resolve Target Job Role
    const normalizedTarget = (targetJobNameOrId || 'Full Stack Developer').trim();
    let selectedRole = jobRoles.find(
      r => r.id === normalizedTarget || r.name.toLowerCase() === normalizedTarget.toLowerCase()
    );

    if (!selectedRole) {
      selectedRole = jobRoles.find(r => r.name.toLowerCase().includes('full stack')) || jobRoles[0];
    }

    const roleId = selectedRole?.id || '10000000-0000-0000-0000-000000000001';
    const roleName = selectedRole?.name || 'Full Stack Developer';
    const roleDesc = selectedRole?.description || 'Web and software development';
    const roleCategory = selectedRole?.category || 'Engineering';

    // 2. Get Requirements for this Role
    let requirements = allRoleSkills.filter(rs => rs.job_role_id === roleId);
    if (requirements.length === 0) {
      // Fallback: match by default full stack skills
      requirements = LocalDbService.getJobRoleSkills('10000000-0000-0000-0000-000000000001');
    }

    // 3. Process Each Required Skill
    let totalMaxScore = 0;
    let totalEarnedScore = 0;
    let readyCount = 0;
    let improveCount = 0;
    let missingCount = 0;
    let verifiedCount = 0;

    const gapItems: SkillGapItem[] = [];
    const categoryBreakdown: Record<string, { total: number; ready: number; score: number }> = {};

    requirements.forEach(req => {
      const skillMeta = masterSkills.find(s => s.id === req.skill_id) || req.skill || {
        id: req.skill_id,
        name: 'Technical Skill',
        category: 'Engineering',
        description: ''
      };

      const matchedCandSkill = this.findMatchingCandidateSkill(
        { id: req.skill_id, name: skillMeta.name, category: skillMeta.category },
        candidateSkills
      );

      const reqProf = req.required_proficiency || 'Intermediate';
      const candProf = (matchedCandSkill?.proficiency_level || 'None') as CandidateSkill['proficiency_level'] | 'None';
      const isVerified = Boolean(matchedCandSkill?.verified);

      const reqRank = PROFICIENCY_RANKS[reqProf] || 2;
      const candRank = matchedCandSkill ? (PROFICIENCY_RANKS[candProf] || 1) : 0;
      const importance = req.importance || 'High';
      const weight = IMPORTANCE_WEIGHTS[importance] || 2;

      let status: SkillGapStatus = 'MISSING';
      let severity: SkillGapSeverity = 'OPTIMAL';
      let gapLevels = 0;

      if (candRank >= reqRank) {
        status = 'READY';
        severity = 'OPTIMAL';
        readyCount++;
      } else if (candRank > 0) {
        status = 'IMPROVE';
        gapLevels = reqRank - candRank;
        severity = gapLevels >= 2 ? 'HIGH' : 'MEDIUM';
        improveCount++;
      } else {
        status = 'MISSING';
        gapLevels = reqRank;
        severity = (importance === 'Critical' || importance === 'High') ? 'CRITICAL' : 'MEDIUM';
        missingCount++;
      }

      if (isVerified && candRank > 0) {
        verifiedCount++;
      }

      // Mathematical Score Contribution
      // Max possible for this requirement: weight * reqRank
      const itemMaxScore = weight * reqRank;
      totalMaxScore += itemMaxScore;

      let itemEarned = 0;
      if (candRank > 0) {
        const effectiveRank = Math.min(candRank, reqRank);
        // Verified skills get 100% confidence factor, Self-declared gets 85%
        const confidenceMultiplier = isVerified ? 1.0 : 0.85;
        itemEarned = weight * effectiveRank * confidenceMultiplier;
      }
      totalEarnedScore += itemEarned;

      // Category breakdown
      const cat = skillMeta.category || 'Core Engineering';
      if (!categoryBreakdown[cat]) {
        categoryBreakdown[cat] = { total: 0, ready: 0, score: 0 };
      }
      categoryBreakdown[cat].total += 1;
      if (status === 'READY') categoryBreakdown[cat].ready += 1;
      categoryBreakdown[cat].score += itemEarned;

      gapItems.push({
        skill_id: req.skill_id,
        skill_name: skillMeta.name,
        skill_category: skillMeta.category,
        description: skillMeta.description,
        required_proficiency: reqProf,
        candidate_proficiency: candProf,
        status,
        importance,
        severity,
        verified: isVerified,
        gap_levels: gapLevels,
        roadmap_topic_count: 5
      });
    });

    // 4. Calculate Final Readiness Score (0 - 100)
    const rawScore = totalMaxScore > 0 ? (totalEarnedScore / totalMaxScore) * 100 : 0;
    const readinessScore = Math.min(100, Math.max(0, Math.round(rawScore)));

    // 5. Identify Top Missing & Top Improvement Skill for quick action
    const missingSkills = gapItems.filter(g => g.status === 'MISSING');
    const improveSkills = gapItems.filter(g => g.status === 'IMPROVE');

    // Sort by importance (Critical > High > Medium > Low)
    const importanceSort = (a: SkillGapItem, b: SkillGapItem) =>
      (IMPORTANCE_WEIGHTS[b.importance] || 0) - (IMPORTANCE_WEIGHTS[a.importance] || 0);

    missingSkills.sort(importanceSort);
    improveSkills.sort(importanceSort);

    const topMissingSkill = missingSkills[0] || undefined;
    const topImproveSkill = improveSkills[0] || undefined;

    return {
      target_job: roleName,
      job_role_id: roleId,
      job_description: roleDesc,
      category: roleCategory,
      readiness_score: readinessScore,
      ready_count: readyCount,
      improve_count: improveCount,
      missing_count: missingCount,
      verified_count: verifiedCount,
      total_required: gapItems.length,
      items: gapItems,
      top_missing_skill: topMissingSkill,
      top_improve_skill: topImproveSkill,
      category_breakdown: categoryBreakdown
    };
  }

  /**
   * Build personalized micro-roadmap pathways for missing and improvement skills
   */
  static buildPersonalizedRoadmaps(
    skillGaps: SkillGapItem[],
    candidateProgress: CandidateRoadmapProgress[],
    roadmapItems: RoadmapItem[] = LocalDbService.getRoadmapItems()
  ): LearningRoadmapSkill[] {
    const completedItemIds = new Set(candidateProgress.map(p => p.roadmap_item_id));

    // Focus roadmap on MISSING and IMPROVE skills first, then READY skills
    const prioritizedSkills = [...skillGaps].sort((a, b) => {
      if (a.status === 'MISSING' && b.status !== 'MISSING') return -1;
      if (a.status !== 'MISSING' && b.status === 'MISSING') return 1;
      if (a.status === 'IMPROVE' && b.status === 'READY') return -1;
      if (a.status === 'READY' && b.status === 'IMPROVE') return 1;
      return (IMPORTANCE_WEIGHTS[b.importance] || 0) - (IMPORTANCE_WEIGHTS[a.importance] || 0);
    });

    return prioritizedSkills.map(gap => {
      // Find roadmap items matching this skill ID or skill name
      let items = roadmapItems.filter(item => item.skill_id === gap.skill_id);

      if (items.length === 0) {
        // Fallback: match by skill name substring
        const sName = gap.skill_name.toLowerCase();
        items = roadmapItems.filter(item => {
          const itemSkillName = (item.skill_name || '').toLowerCase();
          return itemSkillName.includes(sName) || sName.includes(itemSkillName);
        });
      }

      // If still no items, generate clean standard structured steps for this skill
      if (items.length === 0) {
        items = [
          {
            id: `gen-${gap.skill_id}-01`,
            skill_id: gap.skill_id,
            skill_name: gap.skill_name,
            topic: `Core Fundamentals of ${gap.skill_name}`,
            description: `Master basic syntax, operational paradigms, component structures, and setup workflows for ${gap.skill_name}.`,
            order_index: 1,
            estimated_time: '3 Hours',
            resource_type: 'Interactive Lab',
            practice_requirement: `Set up a development environment and build a hello-world starter project for ${gap.skill_name}.`,
            assessment_ready: false
          },
          {
            id: `gen-${gap.skill_id}-02`,
            skill_id: gap.skill_id,
            skill_name: gap.skill_name,
            topic: `Intermediate Application & Patterns`,
            description: `Learn state management, async integrations, data modeling, and best practices in ${gap.skill_name}.`,
            order_index: 2,
            estimated_time: '5 Hours',
            resource_type: 'Hands-on Project',
            practice_requirement: `Implement a modular feature module with input validation and clean error handling.`,
            assessment_ready: false
          },
          {
            id: `gen-${gap.skill_id}-03`,
            skill_id: gap.skill_id,
            skill_name: gap.skill_name,
            topic: `Production Capstone Project`,
            description: `Build a production-grade application demonstrating complete end-to-end competency in ${gap.skill_name}.`,
            order_index: 3,
            estimated_time: '6 Hours',
            resource_type: 'Hands-on Project',
            practice_requirement: `Deploy a tested working mini-app with comprehensive documentation.`,
            assessment_ready: false
          },
          {
            id: `gen-${gap.skill_id}-04`,
            skill_id: gap.skill_id,
            skill_name: gap.skill_name,
            topic: `${gap.skill_name} Competency Assessment`,
            description: `Timed validation assessment verifying theoretical and practical mastery of ${gap.skill_name}.`,
            order_index: 4,
            estimated_time: '1 Hour',
            resource_type: 'Code Practice',
            practice_requirement: `Pass the validation assessment with 75%+ score to unlock verified skill status.`,
            assessment_ready: true
          }
        ];
      }

      // Mark completed status
      const mappedItems = items.map(item => ({
        ...item,
        completed: completedItemIds.has(item.id)
      }));

      const completedCount = mappedItems.filter(i => i.completed).length;
      const progressPercent = mappedItems.length > 0 ? Math.round((completedCount / mappedItems.length) * 100) : 0;

      return {
        skill_id: gap.skill_id,
        skill_name: gap.skill_name,
        category: gap.skill_category,
        current_proficiency: gap.candidate_proficiency,
        target_proficiency: gap.required_proficiency,
        status: gap.status,
        importance: gap.importance,
        items: mappedItems,
        progress_percentage: progressPercent,
        completed_items: completedCount,
        total_items: mappedItems.length
      };
    });
  }
}

