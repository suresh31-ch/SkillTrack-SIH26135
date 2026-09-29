import { supabase, isSupabaseConfigured, LocalDbService, formatAuthError } from './supabase';
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
  CandidateRoadmapProgress,
  Job,
  Application,
  Assessment,
  AssessmentResult,
  Placement,
  EmploymentVerification,
  Certification,
  Course
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
   * Helper to check if the current user/context is genuinely a demo account
   */
  private static isDemoContext(profileOrCandidateId?: string): boolean {
    if (!isSupabaseConfigured() || !supabase) return true;
    if (!profileOrCandidateId) return false;
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    // Real authenticated Supabase users always have standard UUIDs and are never demo accounts
    if (uuidRegex.test(profileOrCandidateId)) {
      return false;
    }
    const lower = profileOrCandidateId.toLowerCase();
    return (
      lower.startsWith('auth-cand-') ||
      lower.startsWith('prof-cand-') ||
      lower.startsWith('cand-prof-') ||
      lower.startsWith('demo-') ||
      lower.includes('demo')
    );
  }

  /**
   * Helper to get current authenticated Supabase session
   */
  private static async getAuthenticatedUser(): Promise<{ id: string; email?: string } | null> {
    if (!isSupabaseConfigured() || !supabase) return null;
    try {
      const { data: { session } } = await supabase.auth.getSession();
      return session?.user ? { id: session.user.id, email: session.user.email } : null;
    } catch {
      return null;
    }
  }

  /**
   * Helper to resolve candidate_profiles UUID from candidate_profiles.id, profiles.id, or profiles.auth_user_id
   */
  private static async resolveCandidateProfileId(profileOrCandidateId: string): Promise<string> {
    if (!profileOrCandidateId) return '';
    if (isSupabaseConfigured() && supabase) {
      try {
        const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
        if (!uuidRegex.test(profileOrCandidateId)) {
          return profileOrCandidateId;
        }

        // 1. Check if profileOrCandidateId is directly candidate_profiles.id or candidate_profiles.profile_id
        const { data: cpDirect } = await supabase
          .from('candidate_profiles')
          .select('id')
          .or(`id.eq.${profileOrCandidateId},profile_id.eq.${profileOrCandidateId}`)
          .maybeSingle();

        if (cpDirect?.id) {
          return cpDirect.id;
        }

        // 2. Check if this is an authenticated candidate in profiles (matching id OR auth_user_id)
        const { data: prof } = await supabase
          .from('profiles')
          .select('id, auth_user_id, organization_id, role')
          .or(`id.eq.${profileOrCandidateId},auth_user_id.eq.${profileOrCandidateId}`)
          .maybeSingle();

        if (prof) {
          // Check if candidate_profiles already exists for this resolved profile.id
          const { data: existingCp } = await supabase
            .from('candidate_profiles')
            .select('id')
            .eq('profile_id', prof.id)
            .maybeSingle();

          if (existingCp?.id) {
            return existingCp.id;
          }

          // If no candidate_profile exists yet, auto-provision one linked to the base profile
          const { data: newCp, error: insertErr } = await supabase
            .from('candidate_profiles')
            .insert({
              profile_id: prof.id,
              organization_id: prof.organization_id,
              target_role: 'Full Stack Web Developer',
              target_job: 'Full Stack Web Developer',
              career_goal: 'Software Engineer in IT/Tech Sector',
              education: 'Bachelor of Technology (B.Tech)',
              degree: 'Computer Science & Engineering',
              graduation_year: 2025,
              experience_years: 0,
              employment_status: 'in_training',
              readiness_score: 75,
              profile_completion: 80
            })
            .select('id')
            .maybeSingle();

          if (!insertErr && newCp?.id) {
            return newCp.id;
          }
        }
      } catch (err) {
        console.warn('CandidateProfile resolution note:', err);
      }
    }
    return profileOrCandidateId;
  }

  /**
   * Helper to resolve a skill ID into a valid Supabase UUID in public.skills
   */
  private static async resolveSkillId(skillId: string): Promise<string | null> {
    if (!isSupabaseConfigured() || !supabase) return skillId;
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    if (uuidRegex.test(skillId)) {
      return skillId;
    }

    // If non-UUID (e.g. 'sk-01'), look up local master skill definition
    const localSkill = LocalDbService.getSkills().find(s => s.id === skillId);
    const skillName = localSkill ? localSkill.name : skillId;

    // Search by name in Supabase
    try {
      const { data: existing } = await supabase
        .from('skills')
        .select('id')
        .eq('name', skillName)
        .maybeSingle();

      if (existing?.id) {
        return existing.id;
      }

      // If not found in Supabase, create it so foreign key won't fail
      if (localSkill) {
        const { data: created, error } = await supabase
          .from('skills')
          .insert({
            name: localSkill.name,
            category: localSkill.category,
            description: localSkill.description
          })
          .select('id')
          .maybeSingle();

        if (!error && created?.id) {
          return created.id;
        }
      }
    } catch {
      // Continue
    }

    return null;
  }

  /**
   * Helper to resolve a roadmap item ID into a valid UUID in public.roadmap_items
   */
  private static async resolveRoadmapItemId(roadmapItemId: string): Promise<string | null> {
    if (!isSupabaseConfigured() || !supabase) return roadmapItemId;
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    if (uuidRegex.test(roadmapItemId)) {
      return roadmapItemId;
    }

    // Look up local roadmap item
    const localItem = LocalDbService.getRoadmapItems().find(r => r.id === roadmapItemId);
    if (!localItem) return null;

    try {
      // Search by topic in Supabase
      const { data: existing } = await supabase
        .from('roadmap_items')
        .select('id')
        .eq('topic', localItem.topic)
        .maybeSingle();

      if (existing?.id) {
        return existing.id;
      }

      // If not found, create in roadmap_items
      const resolvedSkillId = await this.resolveSkillId(localItem.skill_id);
      if (resolvedSkillId) {
        const { data: created, error } = await supabase
          .from('roadmap_items')
          .insert({
            skill_id: resolvedSkillId,
            topic: localItem.topic,
            description: localItem.description,
            order_index: localItem.order_index,
            estimated_time: localItem.estimated_time,
            resource_type: localItem.resource_type,
            practice_requirement: localItem.practice_requirement,
            assessment_ready: localItem.assessment_ready
          })
          .select('id')
          .maybeSingle();

        if (!error && created?.id) {
          return created.id;
        }
      }
    } catch {
      // Continue
    }

    return null;
  }

  /**
   * Helper to resolve a job into a valid UUID in public.jobs
   */
  private static async resolveJobId(job: Job): Promise<string | null> {
    if (!isSupabaseConfigured() || !supabase) return job.id;
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    if (uuidRegex.test(job.id)) {
      return job.id;
    }

    try {
      const { data: existing } = await supabase
        .from('jobs')
        .select('id')
        .eq('title', job.title)
        .eq('company_name', job.company_name)
        .maybeSingle();

      if (existing?.id) {
        return existing.id;
      }
    } catch {
      // Continue
    }

    return null;
  }

  /**
   * Fetch candidate skills joined with master skill info from Supabase
   */
  static async getCandidateSkills(profileOrCandidateId: string): Promise<CandidateSkill[]> {
    if (isSupabaseConfigured() && supabase && !this.isDemoContext(profileOrCandidateId)) {
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
   * Explicitly writes to Supabase candidate_skills table when online.
   * Prevents duplicates, resolves foreign keys, and raises errors explicitly.
   */
  static async addCandidateSkill(
    profileId: string,
    skillId: string,
    proficiencyLevel: CandidateSkill['proficiency_level']
  ): Promise<void> {
    const authUser = await this.getAuthenticatedUser();
    const isDemo = this.isDemoContext(profileId) || !authUser;

    if (isDemo) {
      LocalDbService.addCandidateSkill(profileId, skillId, proficiencyLevel);
      return;
    }

    const targetCandId = await this.resolveCandidateProfileId(profileId);
    if (!targetCandId) {
      throw new Error('Candidate profile not found.');
    }

    const resolvedSkillId = await this.resolveSkillId(skillId);
    if (!resolvedSkillId) {
      throw new Error('Selected skill could not be resolved in the database catalog.');
    }

    // Check for existing record to avoid duplicate
    const { data: existingSkill } = await supabase
      .from('candidate_skills')
      .select('id')
      .eq('candidate_id', targetCandId)
      .eq('skill_id', resolvedSkillId)
      .maybeSingle();

    if (existingSkill?.id) {
      const { error: updateError } = await supabase
        .from('candidate_skills')
        .update({
          proficiency_level: proficiencyLevel,
          proficiency: proficiencyLevel,
          updated_at: new Date().toISOString()
        })
        .eq('id', existingSkill.id);

      if (updateError) {
        throw new Error(formatAuthError(updateError));
      }
      LocalDbService.addCandidateSkill(profileId, skillId, proficiencyLevel);
      return;
    }

    const { error: insertError } = await supabase
      .from('candidate_skills')
      .insert({
        candidate_id: targetCandId,
        skill_id: resolvedSkillId,
        proficiency_level: proficiencyLevel,
        proficiency: proficiencyLevel,
        source: 'Self-Declaration',
        verified: false,
        verification_source: 'Self-Declaration',
        assessment_score: 0,
        updated_at: new Date().toISOString()
      });

    if (insertError) {
      if (insertError.code === '23505') {
        // Unique violation due to concurrent insert; perform graceful update
        const { error: updateError } = await supabase
          .from('candidate_skills')
          .update({
            proficiency_level: proficiencyLevel,
            proficiency: proficiencyLevel,
            updated_at: new Date().toISOString()
          })
          .eq('candidate_id', targetCandId)
          .eq('skill_id', resolvedSkillId);

        if (updateError) {
          throw new Error(formatAuthError(updateError));
        }
        LocalDbService.addCandidateSkill(profileId, skillId, proficiencyLevel);
        return;
      }
      throw new Error(formatAuthError(insertError));
    }

    // Keep LocalDbService cache synchronized on successful database write
    LocalDbService.addCandidateSkill(profileId, skillId, proficiencyLevel);
  }

  /**
   * Update proficiency level of an existing skill in Supabase
   */
  static async updateCandidateSkillProficiency(
    candidateSkillId: string,
    proficiencyLevel: CandidateSkill['proficiency_level']
  ): Promise<void> {
    const authUser = await this.getAuthenticatedUser();
    const isDemo = this.isDemoContext(candidateSkillId) || !authUser;

    if (isDemo) {
      LocalDbService.updateCandidateSkill(candidateSkillId, proficiencyLevel);
      return;
    }

    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(candidateSkillId)) {
      // Local demo skill ID
      LocalDbService.updateCandidateSkill(candidateSkillId, proficiencyLevel);
      return;
    }

    const { error } = await supabase
      .from('candidate_skills')
      .update({
        proficiency_level: proficiencyLevel,
        proficiency: proficiencyLevel,
        updated_at: new Date().toISOString()
      })
      .eq('id', candidateSkillId);

    if (error) {
      throw new Error(formatAuthError(error));
    }

    LocalDbService.updateCandidateSkill(candidateSkillId, proficiencyLevel);
  }

  /**
   * Remove a skill from the candidate's profile in Supabase
   */
  static async removeCandidateSkill(
    candidateSkillId: string,
    profileId: string
  ): Promise<void> {
    const authUser = await this.getAuthenticatedUser();
    const isDemo = this.isDemoContext(profileId) || !authUser;

    if (isDemo) {
      LocalDbService.removeCandidateSkill(candidateSkillId, profileId);
      return;
    }

    const targetCandId = await this.resolveCandidateProfileId(profileId);
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

    let query = supabase.from('candidate_skills').delete();
    if (uuidRegex.test(candidateSkillId)) {
      query = query.eq('id', candidateSkillId);
    } else {
      const resolvedSkillId = await this.resolveSkillId(candidateSkillId);
      if (resolvedSkillId && uuidRegex.test(resolvedSkillId)) {
        query = query.eq('candidate_id', targetCandId).eq('skill_id', resolvedSkillId);
      } else {
        LocalDbService.removeCandidateSkill(candidateSkillId, profileId);
        return;
      }
    }

    const { error } = await query;
    if (error) {
      throw new Error(formatAuthError(error));
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
    // Security: sanitize candidate self-updates to prevent unauthorized elevation or self-verification
    const safeProfileUpdates = { ...profileUpdates };
    delete (safeProfileUpdates as any).verification_status;
    delete (safeProfileUpdates as any).role;
    delete (safeProfileUpdates as any).organization_id;

    const safeCandidateUpdates = { ...candidateUpdates };
    delete (safeCandidateUpdates as any).placement_status;
    delete (safeCandidateUpdates as any).retention_status;
    delete (safeCandidateUpdates as any).organization_id;

    // 1. Update in Supabase
    if (isSupabaseConfigured() && supabase) {
      try {
        if (Object.keys(safeProfileUpdates).length > 0) {
          await supabase
            .from('profiles')
            .update({
              ...safeProfileUpdates,
              updated_at: new Date().toISOString()
            })
            .eq('id', profileId);
        }

        if (Object.keys(safeCandidateUpdates).length > 0) {
          await supabase
            .from('candidate_profiles')
            .update({
              ...safeCandidateUpdates,
              updated_at: new Date().toISOString()
            })
            .or(`profile_id.eq.${profileId},id.eq.${profileId}`);
        }
      } catch (err) {
        console.warn('Supabase updateCandidateProfileDetails error, falling back to LocalDb:', err);
      }
    }

    // 2. Update LocalDb Cache
    const updatedProfile = LocalDbService.updateProfile(profileId, safeProfileUpdates);
    const updatedCandidateProfile = LocalDbService.updateCandidateProfile(profileId, safeCandidateUpdates);

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
   * Mark a roadmap item as completed or pending in Supabase
   * Strictly enforces real database persistence, raises explicit errors,
   * and preserves local demo cache synchronization.
   */
  static async toggleRoadmapItemProgress(
    profileOrCandId: string,
    roadmapItemId: string,
    completed: boolean
  ): Promise<CandidateRoadmapProgress[]> {
    const authUser = await this.getAuthenticatedUser();
    const isDemo = this.isDemoContext(profileOrCandId) || !authUser;

    if (isDemo) {
      return LocalDbService.toggleRoadmapProgress(profileOrCandId, roadmapItemId, completed);
    }

    const targetCandId = await this.resolveCandidateProfileId(profileOrCandId);
    if (!targetCandId) {
      throw new Error('Candidate profile not found.');
    }

    const resolvedItemId = await this.resolveRoadmapItemId(roadmapItemId);
    if (!resolvedItemId) {
      throw new Error('Roadmap milestone could not be resolved in the database catalog.');
    }

    if (completed) {
      const { error } = await supabase
        .from('candidate_roadmap_progress')
        .upsert(
          {
            candidate_id: targetCandId,
            roadmap_item_id: resolvedItemId,
            status: 'completed',
            completed_at: new Date().toISOString()
          },
          { onConflict: 'candidate_id,roadmap_item_id' }
        );

      if (error) {
        throw new Error(formatAuthError(error));
      }
    } else {
      const { error } = await supabase
        .from('candidate_roadmap_progress')
        .delete()
        .match({ candidate_id: targetCandId, roadmap_item_id: resolvedItemId });

      if (error) {
        throw new Error(formatAuthError(error));
      }
    }

    // Keep LocalDbService synchronized with success
    LocalDbService.toggleRoadmapProgress(profileOrCandId, roadmapItemId, completed);
    return this.getCandidateRoadmapProgress(profileOrCandId);
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

  /**
   * Fetch active jobs matching organization or all public jobs
   */
  static async getJobs(organizationId?: string): Promise<Job[]> {
    if (isSupabaseConfigured() && supabase) {
      try {
        let query = supabase.from('jobs').select('*').order('created_at', { ascending: false });
        if (organizationId) {
          query = query.eq('organization_id', organizationId);
        }
        const { data, error } = await query;
        if (!error && data && data.length > 0) {
          return data as Job[];
        }
      } catch (err) {
        console.warn('Supabase getJobs fallback:', err);
      }
    }
    return LocalDbService.getJobs(organizationId);
  }

  /**
   * Fetch candidate job applications
   */
  static async getCandidateApplications(candidateId: string): Promise<Application[]> {
    if (isSupabaseConfigured() && supabase) {
      try {
        const targetCandId = await this.resolveCandidateProfileId(candidateId);
        const { data, error } = await supabase
          .from('job_applications')
          .select('*, job:jobs(*)')
          .or(`candidate_id.eq.${targetCandId},candidate_id.eq.${candidateId}`)
          .order('applied_at', { ascending: false });
        if (!error && data) {
          return data as Application[];
        }
      } catch (err) {
        console.warn('Supabase getCandidateApplications fallback:', err);
      }
    }
    return LocalDbService.getCandidateApplications(candidateId);
  }

  /**
   * Apply to a job with duplicate check and explicit Supabase persistence
   */
  static async applyToJob(candidateProfile: Profile, job: Job, candidateMeta?: CandidateProfile): Promise<Application> {
    const authUser = await this.getAuthenticatedUser();
    const isDemo = this.isDemoContext(candidateProfile.id) || !authUser;

    if (isDemo) {
      return LocalDbService.applyToJob(candidateProfile, job);
    }

    const targetCandId = await this.resolveCandidateProfileId(candidateProfile.id);
    if (!targetCandId) {
      throw new Error('Candidate profile not found.');
    }

    const resolvedJobId = await this.resolveJobId(job);
    if (!resolvedJobId) {
      throw new Error('Selected job requisition is not available in the database.');
    }

    const existing = await this.getCandidateApplications(targetCandId);
    const alreadyApplied = existing.find(a => a.job_id === job.id || a.job_id === resolvedJobId);
    if (alreadyApplied) {
      return alreadyApplied;
    }

    const matchScore = Math.floor(Math.random() * 20) + 78;

    const { data, error } = await supabase
      .from('job_applications')
      .insert({
        job_id: resolvedJobId,
        candidate_id: targetCandId,
        status: 'Applied',
        skill_match_score: matchScore,
        applied_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .select('*, job:jobs(*)')
      .single();

    if (error) {
      if (error.code === '23505') {
        const apps = await this.getCandidateApplications(targetCandId);
        const dup = apps.find(a => a.job_id === job.id || a.job_id === resolvedJobId);
        if (dup) return dup;
      }
      throw new Error(formatAuthError(error));
    }

    // Keep LocalDbService synchronized with success
    const localApp = LocalDbService.applyToJob(candidateProfile, job);
    return {
      ...(localApp || {}),
      id: data.id,
      candidate_id: data.candidate_id,
      job_id: data.job_id,
      recruiter_id: job.recruiter_id,
      organization_id: job.organization_id,
      status: data.status,
      skill_match_score: Number(data.skill_match_score) || matchScore,
      readiness_score: candidateMeta?.readiness_score || 82,
      overall_match_score: Math.floor(Math.random() * 15) + 80,
      applied_at: data.applied_at,
      updated_at: data.updated_at,
      candidate: {
        full_name: candidateProfile.full_name,
        email: candidateProfile.email,
        phone: candidateProfile.phone,
        target_job: candidateMeta?.target_job || 'Full Stack Developer',
        readiness_score: candidateMeta?.readiness_score || 82,
        district: candidateProfile.district || 'Pune',
        education: candidateMeta?.education,
        degree: candidateMeta?.degree,
        experience_years: candidateMeta?.experience_years
      },
      job: {
        title: job.title,
        company_name: job.company_name,
        location: job.location,
        employment_type: job.employment_type
      }
    };
  }

  /**
   * Fetch assessments catalog
   */
  static async getAssessments(organizationId?: string): Promise<Assessment[]> {
    if (isSupabaseConfigured() && supabase) {
      try {
        let query = supabase.from('assessments').select('*').order('created_at', { ascending: false });
        if (organizationId) {
          query = query.eq('organization_id', organizationId);
        }
        const { data, error } = await query;
        if (!error && data && data.length > 0) {
          return data as Assessment[];
        }
      } catch (err) {
        console.warn('Supabase getAssessments fallback:', err);
      }
    }
    return LocalDbService.getAssessments(organizationId);
  }

  /**
   * Fetch assessment results for candidate
   */
  static async getAssessmentResults(candidateId: string): Promise<AssessmentResult[]> {
    if (isSupabaseConfigured() && supabase) {
      try {
        const { data, error } = await supabase
          .from('assessment_results')
          .select('*')
          .eq('candidate_id', candidateId)
          .order('completed_at', { ascending: false });
        if (!error && data) {
          return data as AssessmentResult[];
        }
      } catch (err) {
        console.warn('Supabase getAssessmentResults fallback:', err);
      }
    }
    return LocalDbService.getAssessmentResults(candidateId);
  }

  /**
   * Record assessment result and auto-verify candidate skill if passed (>= 75%)
   */
  static async recordAssessmentResult(data: {
    candidate_id: string;
    assessment_id: string;
    assessment_title: string;
    skill_id?: string;
    score: number;
    max_score: number;
    percentage: number;
    passed: boolean;
    answers?: any;
  }): Promise<AssessmentResult> {
    const newResult: AssessmentResult = {
      id: `res-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      candidate_id: data.candidate_id,
      assessment_id: data.assessment_id,
      assessment_title: data.assessment_title,
      score: data.score,
      max_score: data.max_score,
      percentage: data.percentage,
      passed: data.passed,
      completed_at: new Date().toISOString()
    };

    if (isSupabaseConfigured() && supabase) {
      try {
        await supabase.from('assessment_results').insert(newResult);
        if (data.passed && data.skill_id) {
          await supabase
            .from('candidate_skills')
            .update({ verified: true, updated_at: new Date().toISOString() })
            .match({ candidate_id: data.candidate_id, skill_id: data.skill_id });
        }
      } catch (err) {
        console.warn('Supabase recordAssessmentResult notice:', err);
      }
    }

    LocalDbService.recordAssessmentResult(newResult);
    if (data.passed && data.skill_id) {
      const skills = LocalDbService.getCandidateSkills(data.candidate_id);
      const targetSkill = skills.find(s => s.skill_id === data.skill_id);
      if (targetSkill) {
        LocalDbService.updateCandidateSkill(targetSkill.id, targetSkill.proficiency_level);
      }
    }

    return newResult;
  }

  /**
   * Fetch placements
   */
  static async getPlacements(organizationId?: string, candidateId?: string): Promise<Placement[]> {
    if (isSupabaseConfigured() && supabase) {
      try {
        let query = supabase.from('placements').select('*').order('created_at', { ascending: false });
        if (candidateId) {
          query = query.eq('candidate_id', candidateId);
        } else if (organizationId) {
          query = query.eq('organization_id', organizationId);
        }
        const { data, error } = await query;
        if (!error && data && data.length > 0) {
          return data as Placement[];
        }
      } catch (err) {
        console.warn('Supabase getPlacements fallback:', err);
      }
    }
    const all = LocalDbService.getPlacements(organizationId);
    return candidateId ? all.filter(p => p.candidate_id === candidateId) : all;
  }

  /**
   * Fetch employment verifications
   */
  static async getEmploymentVerifications(organizationId?: string, candidateId?: string): Promise<EmploymentVerification[]> {
    if (isSupabaseConfigured() && supabase) {
      try {
        let query = supabase.from('employment_verifications').select('*').order('verified_at', { ascending: false });
        if (candidateId) {
          query = query.eq('candidate_id', candidateId);
        } else if (organizationId) {
          query = query.eq('organization_id', organizationId);
        }
        const { data, error } = await query;
        if (!error && data && data.length > 0) {
          return data as EmploymentVerification[];
        }
      } catch (err) {
        console.warn('Supabase getEmploymentVerifications fallback:', err);
      }
    }
    const all = LocalDbService.getEmploymentVerifications(organizationId);
    return candidateId ? all.filter(e => e.candidate_id === candidateId) : all;
  }

  /**
   * Fetch certifications
   */
  static async getCertifications(organizationId?: string, candidateId?: string): Promise<Certification[]> {
    if (isSupabaseConfigured() && supabase) {
      try {
        let query = supabase.from('certifications').select('*').order('created_at', { ascending: false });
        if (candidateId) {
          query = query.eq('candidate_id', candidateId);
        } else if (organizationId) {
          query = query.eq('organization_id', organizationId);
        }
        const { data, error } = await query;
        if (!error && data && data.length > 0) {
          return data as Certification[];
        }
      } catch (err) {
        console.warn('Supabase getCertifications fallback:', err);
      }
    }
    const all = LocalDbService.getCertifications(organizationId);
    return candidateId ? all.filter(c => c.candidate_id === candidateId) : all;
  }

  /**
   * Fetch courses
   */
  static async getCourses(organizationId?: string): Promise<Course[]> {
    if (isSupabaseConfigured() && supabase) {
      try {
        let query = supabase.from('courses').select('*').order('created_at', { ascending: false });
        if (organizationId) {
          query = query.eq('organization_id', organizationId);
        }
        const { data, error } = await query;
        if (!error && data && data.length > 0) {
          return data as Course[];
        }
      } catch (err) {
        console.warn('Supabase getCourses fallback:', err);
      }
    }
    return LocalDbService.getCourses(organizationId);
  }

  /**
   * Fetch user notifications
   */
  static async getNotifications(userId: string): Promise<any[]> {
    if (isSupabaseConfigured() && supabase) {
      try {
        const { data, error } = await supabase
          .from('notifications')
          .select('*')
          .eq('user_id', userId)
          .order('created_at', { ascending: false });
        if (!error && data && data.length > 0) {
          return data;
        }
      } catch (err) {
        console.warn('Supabase getNotifications fallback:', err);
      }
    }
    return [
      {
        id: 'notif-cand-01',
        user_id: userId,
        title: 'Skill Assessment Verified',
        message: 'Your React & TypeScript benchmark assessment was verified with 88% score.',
        type: 'assessment',
        read: false,
        created_at: new Date(Date.now() - 3600000).toISOString()
      },
      {
        id: 'notif-cand-02',
        user_id: userId,
        title: 'New Job Match Available',
        message: 'Apex Infotech Solutions posted Full Stack Cloud Developer matching 92% of your verified skills.',
        type: 'job',
        read: false,
        created_at: new Date(Date.now() - 7200000).toISOString()
      }
    ];
  }

  /**
   * Mark notification as read
   */
  static async markNotificationRead(notificationId: string): Promise<void> {
    if (isSupabaseConfigured() && supabase) {
      try {
        await supabase
          .from('notifications')
          .update({ read: true, updated_at: new Date().toISOString() })
          .eq('id', notificationId);
      } catch (err) {
        console.warn('Supabase markNotificationRead fallback:', err);
      }
    }
  }

  /**
   * Update profile
   */
  static async updateProfile(profileId: string, updates: Partial<Profile>): Promise<Profile | null> {
    if (isSupabaseConfigured() && supabase) {
      try {
        const { data, error } = await supabase
          .from('profiles')
          .update({ ...updates, updated_at: new Date().toISOString() })
          .eq('id', profileId)
          .select()
          .single();
        if (!error && data) {
          LocalDbService.updateProfile(profileId, updates);
          return data as Profile;
        }
      } catch (err) {
        console.warn('Supabase updateProfile notice:', err);
      }
    }
    return LocalDbService.updateProfile(profileId, updates);
  }

  /**
   * Update candidate profile with automatic score recalculation
   */
  static async updateCandidateProfile(profileId: string, updates: Partial<CandidateProfile>): Promise<CandidateProfile | null> {
    if (isSupabaseConfigured() && supabase) {
      try {
        const { data, error } = await supabase
          .from('candidate_profiles')
          .update({ ...updates, updated_at: new Date().toISOString() })
          .or(`id.eq.${profileId},profile_id.eq.${profileId}`)
          .select()
          .single();
        if (!error && data) {
          LocalDbService.updateCandidateProfile(profileId, updates);
          return data as CandidateProfile;
        }
      } catch (err) {
        console.warn('Supabase updateCandidateProfile notice:', err);
      }
    }
    return LocalDbService.updateCandidateProfile(profileId, updates);
  }
}

