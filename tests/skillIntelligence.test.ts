import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import {
  SkillIntelligenceEngine,
  PROFICIENCY_RANKS,
  IMPORTANCE_WEIGHTS,
  CONFIDENCE_MULTIPLIERS
} from '../src/lib/skillIntelligenceEngine';
import { JobRole, JobRoleSkill, CandidateSkill, RoadmapItem, Job } from '../src/types';

describe('SkillIntelligenceEngine Unit Tests', () => {
  const dummyRole: JobRole = {
    id: 'role-test-01',
    name: 'Full Stack Engineer',
    description: 'Web development role',
    category: 'Engineering'
  };

  const dummyRoleSkills: JobRoleSkill[] = [
    {
      id: 'req-1',
      job_role_id: 'role-test-01',
      skill_id: 'sk-react',
      skill: { id: 'sk-react', name: 'React & TypeScript', category: 'Frontend', created_at: '' },
      required_proficiency: 'Advanced', // Rank 3
      importance: 'Critical' // Weight 4. Max = 12
    },
    {
      id: 'req-2',
      job_role_id: 'role-test-01',
      skill_id: 'sk-node',
      skill: { id: 'sk-node', name: 'Node.js & Express', category: 'Backend', created_at: '' },
      required_proficiency: 'Intermediate', // Rank 2
      importance: 'High' // Weight 3. Max = 6
    },
    {
      id: 'req-3',
      job_role_id: 'role-test-01',
      skill_id: 'sk-postgres',
      skill: { id: 'sk-postgres', name: 'PostgreSQL', category: 'Database', created_at: '' },
      required_proficiency: 'Intermediate', // Rank 2
      importance: 'Medium' // Weight 2. Max = 4
    }
  ];

  // Total Max Points = 12 + 6 + 4 = 22

  it('1. Calculates 100% when candidate meets all requirements with verified credentials', () => {
    const candidateSkills: CandidateSkill[] = [
      {
        id: 'cs-1',
        candidate_id: 'cand-1',
        skill_id: 'sk-react',
        proficiency_level: 'Advanced',
        verified: true,
        verification_source: 'NCVET Assessment',
        created_at: ''
      },
      {
        id: 'cs-2',
        candidate_id: 'cand-1',
        skill_id: 'sk-node',
        proficiency_level: 'Advanced', // Exceeds Intermediate
        verified: true,
        verification_source: 'Assessment Lab',
        created_at: ''
      },
      {
        id: 'cs-3',
        candidate_id: 'cand-1',
        skill_id: 'sk-postgres',
        proficiency_level: 'Intermediate',
        verified: true,
        verification_source: 'Assessment Center',
        created_at: ''
      }
    ];

    const result = SkillIntelligenceEngine.calculateRoleCompatibility({
      targetRole: dummyRole,
      roleRequirements: dummyRoleSkills,
      candidateSkills
    });

    assert.equal(result.overall_score, 100);
    assert.equal(result.confidence_score, 100);
    assert.equal(result.skills_count.meets_or_exceeds, 3);
    assert.equal(result.skills_count.deficit, 0);
    assert.equal(result.skills_count.unassessed, 0);
  });

  it('2. Correctly calculates score of 0 when candidate has no skills, labeling competencies as Unassessed', () => {
    const result = SkillIntelligenceEngine.calculateRoleCompatibility({
      targetRole: dummyRole,
      roleRequirements: dummyRoleSkills,
      candidateSkills: []
    });

    assert.equal(result.overall_score, 0);
    assert.equal(result.confidence_score, 0);
    assert.equal(result.skills_count.unassessed, 3);
    assert.equal(result.matches[0].candidate_proficiency, 'Not Assessed');
    assert.equal(result.matches[0].status, 'UNASSESSED');
  });

  it('3. Distinguishes missing skills from partial proficiency deficits', () => {
    const candidateSkills: CandidateSkill[] = [
      {
        id: 'cs-1',
        candidate_id: 'cand-1',
        skill_id: 'sk-react',
        proficiency_level: 'Beginner', // Deficit: Required Advanced (Rank 3 vs 1, delta = 2)
        verified: true,
        verification_source: 'Assessment Lab',
        created_at: ''
      }
      // Node and PostgreSQL are missing (unassessed)
    ];

    const result = SkillIntelligenceEngine.calculateRoleCompatibility({
      targetRole: dummyRole,
      roleRequirements: dummyRoleSkills,
      candidateSkills
    });

    assert.equal(result.skills_count.deficit, 1);
    assert.equal(result.skills_count.unassessed, 2);

    const reactMatch = result.matches.find(m => m.skill_id === 'sk-react');
    assert.ok(reactMatch);
    assert.equal(reactMatch.status, 'PROFICIENCY_DEFICIT');
    assert.equal(reactMatch.gap_levels, 2);

    const nodeMatch = result.matches.find(m => m.skill_id === 'sk-node');
    assert.ok(nodeMatch);
    assert.equal(nodeMatch.status, 'UNASSESSED');
    assert.equal(nodeMatch.gap_levels, 2); // needs 2 levels to reach intermediate
  });

  it('4. Applies evidence confidence factor: Verified = 1.0 vs Self-Declared = 0.8', () => {
    const verifiedCandidateSkills: CandidateSkill[] = [
      {
        id: 'cs-1',
        candidate_id: 'cand-1',
        skill_id: 'sk-react',
        proficiency_level: 'Advanced',
        verified: true,
        verification_source: 'NCVET Assessment',
        created_at: ''
      }
    ];

    const selfDeclaredCandidateSkills: CandidateSkill[] = [
      {
        id: 'cs-1',
        candidate_id: 'cand-1',
        skill_id: 'sk-react',
        proficiency_level: 'Advanced',
        verified: false, // self-declared
        created_at: ''
      }
    ];

    const verifiedResult = SkillIntelligenceEngine.calculateRoleCompatibility({
      targetRole: dummyRole,
      roleRequirements: [dummyRoleSkills[0]], // Only React (weight 4 * rank 3 = 12 max points)
      candidateSkills: verifiedCandidateSkills
    });

    const selfDeclaredResult = SkillIntelligenceEngine.calculateRoleCompatibility({
      targetRole: dummyRole,
      roleRequirements: [dummyRoleSkills[0]],
      candidateSkills: selfDeclaredCandidateSkills
    });

    assert.equal(verifiedResult.overall_score, 100);
    // 12 * 0.8 = 9.6 points out of 12 = 80%
    assert.equal(selfDeclaredResult.overall_score, 80);
  });

  it('5. Handles duplicate skill requirements safely without double-counting', () => {
    const duplicateRequirements: JobRoleSkill[] = [
      ...dummyRoleSkills,
      {
        id: 'req-dup',
        job_role_id: 'role-test-01',
        skill_id: 'sk-react', // duplicate React requirement with lower importance
        required_proficiency: 'Beginner',
        importance: 'Low'
      }
    ];

    const candidateSkills: CandidateSkill[] = [
      {
        id: 'cs-1',
        candidate_id: 'cand-1',
        skill_id: 'sk-react',
        proficiency_level: 'Advanced',
        verified: true,
        verification_source: 'NCVET Assessment',
        created_at: ''
      },
      {
        id: 'cs-2',
        candidate_id: 'cand-1',
        skill_id: 'sk-node',
        proficiency_level: 'Intermediate',
        verified: true,
        verification_source: 'NCVET Assessment',
        created_at: ''
      },
      {
        id: 'cs-3',
        candidate_id: 'cand-1',
        skill_id: 'sk-postgres',
        proficiency_level: 'Intermediate',
        verified: true,
        verification_source: 'NCVET Assessment',
        created_at: ''
      }
    ];

    const result = SkillIntelligenceEngine.calculateRoleCompatibility({
      targetRole: dummyRole,
      roleRequirements: duplicateRequirements,
      candidateSkills
    });

    // Should still have exactly 3 unique requirements, max score = 22, overall score = 100
    assert.equal(result.skills_count.total_required, 3);
    assert.equal(result.overall_score, 100);
  });

  it('6. Handles empty requirements safely (0 total points)', () => {
    const result = SkillIntelligenceEngine.calculateRoleCompatibility({
      targetRole: dummyRole,
      roleRequirements: [],
      candidateSkills: []
    });

    assert.equal(result.overall_score, 0);
    assert.equal(result.skills_count.total_required, 0);
  });

  it('7. Ranks learning priorities with Critical importance and larger gaps first', () => {
    const candidateSkills: CandidateSkill[] = [
      {
        id: 'cs-1',
        candidate_id: 'cand-1',
        skill_id: 'sk-postgres',
        proficiency_level: 'Intermediate', // Postgres is met
        verified: true,
        created_at: ''
      }
      // React (Critical) is missing
      // Node (High) is missing
    ];

    const result = SkillIntelligenceEngine.calculateRoleCompatibility({
      targetRole: dummyRole,
      roleRequirements: dummyRoleSkills,
      candidateSkills
    });

    assert.ok(result.learning_priorities.length >= 2);
    // React should be #1 priority because importance is Critical (weight 4)
    assert.equal(result.learning_priorities[0].skill_name, 'React & TypeScript');
    assert.equal(result.learning_priorities[0].importance, 'Critical');
    assert.equal(result.learning_priorities[0].rank, 1);
  });

  it('8. Calculates exact projected score gains for each skill gap', () => {
    const candidateSkills: CandidateSkill[] = [];
    const result = SkillIntelligenceEngine.calculateRoleCompatibility({
      targetRole: dummyRole,
      roleRequirements: dummyRoleSkills,
      candidateSkills
    });

    // Total points = 22. React is 12 points (55%). Node is 6 points (27%). Postgres is 4 points (18%).
    const reactGap = result.matches.find(m => m.skill_id === 'sk-react');
    assert.ok(reactGap);
    assert.equal(reactGap.projected_score_gain, 55);

    const nodeGap = result.matches.find(m => m.skill_id === 'sk-node');
    assert.ok(nodeGap);
    assert.equal(nodeGap.projected_score_gain, 27);
  });
});
