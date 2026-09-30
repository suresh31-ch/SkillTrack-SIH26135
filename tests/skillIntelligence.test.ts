import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import {
  SkillIntelligenceEngine,
  PROFICIENCY_RANKS,
  IMPORTANCE_WEIGHTS,
  CONFIDENCE_MULTIPLIERS,
  normalizeSkillName
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

  it('9. Normalizes informal skill aliases to canonical framework names', () => {
    assert.equal(normalizeSkillName('react'), 'React.js & TypeScript');
    assert.equal(normalizeSkillName('reactjs'), 'React.js & TypeScript');
    assert.equal(normalizeSkillName('postgres'), 'PostgreSQL & Database Design');
    assert.equal(normalizeSkillName('k8s'), 'Docker & Kubernetes');
    assert.equal(normalizeSkillName('tailwind'), 'Tailwind CSS & Responsive UI');
  });

  it('10. Compares multiple roles accurately and ranks them by readiness', () => {
    const role1: JobRole = { id: 'r1', name: 'Frontend Dev', description: '', category: 'Tech' };
    const role2: JobRole = { id: 'r2', name: 'Database Admin', description: '', category: 'Tech' };

    const reqs1: JobRoleSkill[] = [
      {
        id: '1',
        job_role_id: 'r1',
        skill_id: 'sk-react',
        skill: { id: 'sk-react', name: 'React.js & TypeScript', category: 'Frontend', created_at: '' },
        required_proficiency: 'Intermediate',
        importance: 'Critical'
      }
    ];
    const reqs2: JobRoleSkill[] = [
      {
        id: '2',
        job_role_id: 'r2',
        skill_id: 'sk-postgres',
        skill: { id: 'sk-postgres', name: 'PostgreSQL & Database Design', category: 'Database', created_at: '' },
        required_proficiency: 'Advanced',
        importance: 'Critical'
      }
    ];

    const candidateSkills: CandidateSkill[] = [
      {
        id: 'cs-1',
        candidate_id: 'cand-1',
        skill_id: 'sk-react',
        proficiency_level: 'Intermediate',
        verified: true,
        verification_source: 'SkillTrack Verified Assessment',
        created_at: ''
      }
    ];

    const comparison = SkillIntelligenceEngine.compareMultipleRoles({
      roles: [
        { role: role1, requirements: reqs1 },
        { role: role2, requirements: reqs2 }
      ],
      candidateSkills
    });

    assert.equal(comparison.length, 2);
    // Role 1 (Frontend Dev) should have readiness 100% and be first
    assert.equal(comparison[0].role_id, 'r1');
    assert.equal(comparison[0].readiness_score, 100);
    // Role 2 (Database Admin) should have readiness 0%
    assert.equal(comparison[1].role_id, 'r2');
    assert.equal(comparison[1].readiness_score, 0);
  });

  it('11. Generates structured Career Copilot milestones bridging foundational and advanced gaps', () => {
    const candidateSkills: CandidateSkill[] = [
      {
        id: 'cs-1',
        candidate_id: 'cand-1',
        skill_id: 'sk-react',
        proficiency_level: 'Beginner', // Deficit: needs Advanced
        verified: false,
        created_at: ''
      }
    ];

    const compat = SkillIntelligenceEngine.calculateRoleCompatibility({
      targetRole: dummyRole,
      roleRequirements: dummyRoleSkills,
      candidateSkills
    });

    const milestones = SkillIntelligenceEngine.generateCareerCopilotRoadmap({
      targetRole: dummyRole,
      compatibilityResult: compat
    });

    assert.ok(milestones.length > 0);
    const milestoneTitles = milestones.map(m => m.title);
    assert.ok(milestoneTitles.length > 0);
    for (const ms of milestones) {
      assert.ok(ms.target_skills.length > 0);
      assert.ok(Boolean(ms.next_action));
      assert.ok(ms.projected_score_gain >= 0);
    }
  });

  it('12. Analyzes raw job descriptions and extracts required skills deterministically', () => {
    const jdText = `
      We are hiring a Senior Software Engineer.
      Requirements:
      - 3+ years experience with React and TypeScript building scalable frontends.
      - Strong knowledge of PostgreSQL database design and query optimization.
      - Docker containerization and CI/CD pipelines.
    `;

    const masterSkills = [
      { id: 'sk-01', name: 'React.js & TypeScript', category: 'Frontend', created_at: '' },
      { id: 'sk-02', name: 'PostgreSQL & Database Design', category: 'Database', created_at: '' },
      { id: 'sk-03', name: 'Docker & Kubernetes', category: 'DevOps', created_at: '' }
    ];

    const candidateSkills: CandidateSkill[] = [
      {
        id: 'cs-1',
        candidate_id: 'cand-1',
        skill_id: 'sk-01',
        proficiency_level: 'Advanced',
        verified: true,
        created_at: '',
        skill: masterSkills[0]
      }
    ];

    const analysis = SkillIntelligenceEngine.analyzeJobDescriptionText({
      jobTitle: 'Senior Software Engineer',
      jobDescription: jdText,
      candidateSkills,
      masterSkills
    });

    assert.ok(analysis.extracted_keywords.length >= 2);
    assert.ok(analysis.matched_skills.some(s => s.skill_name.toLowerCase().includes('react')));
    assert.ok(analysis.alignment_percentage > 0);
    assert.ok(analysis.recommendations.length > 0);
  });

  it('13. Generates targeted technical interview prep questions mapped to role gaps', () => {
    const candidateSkills: CandidateSkill[] = [
      {
        id: 'cs-1',
        candidate_id: 'cand-1',
        skill_id: 'sk-react',
        proficiency_level: 'Advanced',
        verified: true,
        created_at: ''
      }
    ];

    const compat = SkillIntelligenceEngine.calculateRoleCompatibility({
      targetRole: dummyRole,
      roleRequirements: dummyRoleSkills,
      candidateSkills
    });

    const questions = SkillIntelligenceEngine.generateInterviewPrepQuestions({
      targetRoleName: dummyRole.name,
      skillGaps: compat.skill_gaps,
      strengths: compat.strengths
    });

    assert.ok(questions.length >= 2);
    for (const q of questions) {
      assert.ok(q.question.length > 10);
      assert.ok(q.talking_points.length >= 2);
      assert.ok(['Beginner', 'Intermediate', 'Advanced'].includes(q.difficulty));
    }
  });

  it('14. New candidate with 0 skills yields strictly 0% readiness and honest unassessed state', () => {
    const freshCandidateSkills: CandidateSkill[] = [];
    const compat = SkillIntelligenceEngine.calculateRoleCompatibility({
      targetRole: dummyRole,
      roleRequirements: dummyRoleSkills,
      candidateSkills: freshCandidateSkills
    });

    assert.equal(compat.overall_score, 0);
    assert.equal(compat.role_readiness_score, 0);
    assert.equal(compat.confidence_score, 0);
    assert.equal(compat.skills_count.meets_or_exceeds, 0);
    assert.equal(compat.skills_count.deficit, 0);
    assert.equal(compat.skills_count.unassessed, 3);
    assert.equal(compat.strengths.length, 0);
    assert.equal(compat.skill_gaps.length, 3);
    assert.ok(compat.next_best_action.length > 0);
  });

  it('15. Strictly isolates candidate competency vectors between distinct user IDs', () => {
    const candidateA_Skills: CandidateSkill[] = [
      {
        id: 'cs-a1',
        candidate_id: 'user-uuid-aaaa',
        skill_id: 'sk-react',
        proficiency_level: 'Advanced',
        verified: true,
        verification_source: 'SkillTrack Verified Assessment',
        created_at: ''
      }
    ];

    const candidateB_Skills: CandidateSkill[] = [
      {
        id: 'cs-b1',
        candidate_id: 'user-uuid-bbbb',
        skill_id: 'sk-postgres',
        proficiency_level: 'Intermediate',
        verified: false,
        created_at: ''
      }
    ];

    const compatA = SkillIntelligenceEngine.calculateRoleCompatibility({
      targetRole: dummyRole,
      roleRequirements: dummyRoleSkills,
      candidateSkills: candidateA_Skills.filter(s => s.candidate_id === 'user-uuid-aaaa')
    });

    const compatB = SkillIntelligenceEngine.calculateRoleCompatibility({
      targetRole: dummyRole,
      roleRequirements: dummyRoleSkills,
      candidateSkills: candidateB_Skills.filter(s => s.candidate_id === 'user-uuid-bbbb')
    });

    // Candidate A has React (12 points / 22 = 55%)
    assert.equal(compatA.skills_count.meets_or_exceeds, 1);
    assert.equal(compatA.strengths[0].skill_name, 'React & TypeScript');

    // Candidate B has Postgres (4 points * 0.85 / 22 = ~15%)
    assert.equal(compatB.skills_count.meets_or_exceeds, 1);
    assert.equal(compatB.strengths[0].skill_name, 'PostgreSQL');
    // Ensure Candidate B has NO React points
    assert.ok(compatB.skill_gaps.some(g => g.skill_id === 'sk-react' && g.status === 'UNASSESSED'));
  });

  it('16. Passing an assessment and obtaining verified evidence increases readiness score deterministically', () => {
    // Stage 1: Self-declared React
    const selfDeclaredSkills: CandidateSkill[] = [
      {
        id: 'cs-1',
        candidate_id: 'cand-1',
        skill_id: 'sk-react',
        proficiency_level: 'Advanced',
        verified: false, // self-declared (multiplier = 0.80)
        created_at: ''
      }
    ];

    const resultStage1 = SkillIntelligenceEngine.calculateRoleCompatibility({
      targetRole: dummyRole,
      roleRequirements: dummyRoleSkills,
      candidateSkills: selfDeclaredSkills
    });

    // Stage 2: Assessment passed -> verified evidence awarded (multiplier = 1.0)
    const verifiedSkills: CandidateSkill[] = [
      {
        id: 'cs-1',
        candidate_id: 'cand-1',
        skill_id: 'sk-react',
        proficiency_level: 'Advanced',
        verified: true, // verified (multiplier = 1.0)
        verification_source: 'SkillTrack MSIAS Advanced Assessment (88%)',
        created_at: ''
      }
    ];

    const resultStage2 = SkillIntelligenceEngine.calculateRoleCompatibility({
      targetRole: dummyRole,
      roleRequirements: dummyRoleSkills,
      candidateSkills: verifiedSkills
    });

    // Verified assessment evidence must yield a higher deterministic score than unverified self-declaration
    assert.ok(resultStage2.overall_score > resultStage1.overall_score);
    assert.ok(resultStage2.confidence_score > resultStage1.confidence_score);
    assert.equal(resultStage2.matches[0].evidence, 'VERIFIED_ASSESSMENT');
    assert.equal(resultStage2.matches[0].evidence_confidence, 100);
  });
});
