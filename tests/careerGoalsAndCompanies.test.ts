import { describe, it, beforeEach } from 'node:test';
import assert from 'node:assert/strict';
import { StudentJourneyService } from '../src/lib/studentJourneyService';
import { TARGET_COMPANIES_CATALOG } from '../src/lib/companyRoleData';
import { CareerGoal } from '../src/types/studentJourney';

// Mock localStorage for node environment
const storageMock: Record<string, string> = {};
if (typeof globalThis.localStorage === 'undefined') {
  (globalThis as any).localStorage = {
    getItem: (key: string) => storageMock[key] || null,
    setItem: (key: string, val: string) => { storageMock[key] = String(val); },
    removeItem: (key: string) => { delete storageMock[key]; },
    clear: () => {
      for (const k of Object.keys(storageMock)) delete storageMock[k];
    }
  };
}

describe('Career Goals & Companies and Roles Regression Tests', () => {
  const candidateIdA = 'cand-uuid-1111-aaaa';
  const candidateIdB = 'cand-uuid-2222-bbbb';

  beforeEach(() => {
    localStorage.clear();
  });

  it('1. New candidate starts with zero career goals (no fake prefilled goals)', () => {
    const goals = StudentJourneyService.getCareerGoals(candidateIdA);
    assert.deepEqual(goals, [], 'Newly registered candidate must have an empty goals list');
  });

  it('2. Creating and saving a career goal persists and reloads correctly for that candidate', () => {
    const saved = StudentJourneyService.saveCareerGoal(candidateIdA, {
      targetCompany: 'Google',
      targetRole: 'Software Engineering Intern',
      targetIndustry: 'Product & Cloud',
      employmentPreference: 'Internship',
      preferredLocation: 'Bengaluru / Pune',
      workArrangement: 'Hybrid',
      expectedApplicationPeriod: 'Summer 2027',
      targetGraduationOrAvailability: '2027',
      weeklyLearningHours: 12,
      prioritySkills: ['Data Structures & Algorithms', 'Python'],
      status: 'active'
    });

    assert.ok(saved.id, 'Goal must be assigned an ID');
    assert.equal(saved.targetCompany, 'Google');
    assert.equal(saved.targetRole, 'Software Engineering Intern');

    const reloaded = StudentJourneyService.getCareerGoals(candidateIdA);
    assert.equal(reloaded.length, 1);
    assert.equal(reloaded[0].id, saved.id);
    assert.equal(reloaded[0].targetCompany, 'Google');
  });

  it('3. Editing an existing career goal updates record without creating duplicates', () => {
    const first = StudentJourneyService.saveCareerGoal(candidateIdA, {
      targetCompany: 'Microsoft',
      targetRole: 'Software Engineer',
      targetIndustry: 'Product & Cloud',
      employmentPreference: 'Full-time',
      preferredLocation: 'Hyderabad',
      workArrangement: 'Hybrid',
      expectedApplicationPeriod: 'Autumn 2026',
      targetGraduationOrAvailability: '2026',
      weeklyLearningHours: 10,
      prioritySkills: ['C++', 'System Design'],
      status: 'active'
    });

    const goalsAfterFirst = StudentJourneyService.getCareerGoals(candidateIdA);
    assert.equal(goalsAfterFirst.length, 1);

    // Update goal
    const updated = StudentJourneyService.saveCareerGoal(candidateIdA, {
      id: first.id,
      targetCompany: 'Microsoft',
      targetRole: 'Senior Software Engineer',
      targetIndustry: 'Product & Cloud',
      employmentPreference: 'Full-time',
      preferredLocation: 'Bengaluru',
      workArrangement: 'Remote',
      expectedApplicationPeriod: 'Autumn 2026',
      targetGraduationOrAvailability: '2026',
      weeklyLearningHours: 15,
      prioritySkills: ['C++', 'Distributed Systems'],
      status: 'active'
    });

    const goalsAfterUpdate = StudentJourneyService.getCareerGoals(candidateIdA);
    assert.equal(goalsAfterUpdate.length, 1, 'Must not duplicate record when updating by ID');
    assert.equal(goalsAfterUpdate[0].id, first.id);
    assert.equal(goalsAfterUpdate[0].targetRole, 'Senior Software Engineer');
    assert.equal(goalsAfterUpdate[0].workArrangement, 'Remote');
  });

  it('4. Deleting a career goal properly removes it', () => {
    const goal = StudentJourneyService.saveCareerGoal(candidateIdA, {
      targetCompany: 'Amazon',
      targetRole: 'SDE Intern',
      targetIndustry: 'Product & Cloud',
      employmentPreference: 'Internship',
      preferredLocation: 'Bengaluru',
      workArrangement: 'Hybrid',
      expectedApplicationPeriod: 'Summer 2027',
      targetGraduationOrAvailability: '2027',
      weeklyLearningHours: 10,
      prioritySkills: ['Java', 'Algorithms'],
      status: 'active'
    });

    assert.equal(StudentJourneyService.getCareerGoals(candidateIdA).length, 1);

    const deleted = StudentJourneyService.deleteCareerGoal(candidateIdA, goal.id);
    assert.equal(deleted, true);
    assert.equal(StudentJourneyService.getCareerGoals(candidateIdA).length, 0);
  });

  it('5. Strictly isolates career goals between different candidate IDs', () => {
    StudentJourneyService.saveCareerGoal(candidateIdA, {
      targetCompany: 'Google',
      targetRole: 'Software Engineering Intern',
      targetIndustry: 'Product & Cloud',
      employmentPreference: 'Internship',
      preferredLocation: 'Pune',
      workArrangement: 'Hybrid',
      expectedApplicationPeriod: '2027',
      targetGraduationOrAvailability: '2027',
      weeklyLearningHours: 10,
      prioritySkills: ['Python'],
      status: 'active'
    });

    const goalsA = StudentJourneyService.getCareerGoals(candidateIdA);
    const goalsB = StudentJourneyService.getCareerGoals(candidateIdB);

    assert.equal(goalsA.length, 1);
    assert.equal(goalsB.length, 0, "Candidate B must not see Candidate A's goals");
  });

  it('6. TARGET_COMPANIES_CATALOG includes all key employers with complete role profiles', () => {
    const companyNames = TARGET_COMPANIES_CATALOG.map(c => c.name.toLowerCase());
    assert.ok(companyNames.some(n => n.includes('google')), 'Google must exist in catalog');
    assert.ok(companyNames.some(n => n.includes('microsoft')), 'Microsoft must exist in catalog');
    assert.ok(companyNames.some(n => n.includes('amazon')), 'Amazon must exist in catalog');
    assert.ok(companyNames.some(n => n.includes('tcs')), 'TCS must exist in catalog');
    assert.ok(companyNames.some(n => n.includes('infosys')), 'Infosys must exist in catalog');
    assert.ok(companyNames.some(n => n.includes('wipro')), 'Wipro must exist in catalog');
    assert.ok(companyNames.some(n => n.includes('accenture')), 'Accenture must exist in catalog');
    assert.ok(companyNames.some(n => n.includes('ibm')), 'IBM must exist in catalog');

    // Verify company structure
    for (const comp of TARGET_COMPANIES_CATALOG) {
      assert.ok(comp.id, `Company ${comp.name} must have an ID`);
      assert.ok(comp.name, 'Company must have a name');
      assert.ok(comp.officialCareersWebsite, `${comp.name} must have official careers website`);
      assert.ok(comp.availableRoles.length > 0, `${comp.name} must have at least one defined role`);
      
      for (const role of comp.availableRoles) {
        assert.ok(role.id, `Role ${role.roleTitle} in ${comp.name} must have an ID`);
        assert.ok(role.roleTitle, `Role in ${comp.name} must have a title`);
        assert.ok(role.essentialSkills.length > 0, `Role ${role.roleTitle} must specify essential skills`);
        assert.ok(role.officialCareersLink, `Role ${role.roleTitle} must have official careers link`);
      }
    }
  });

  it('7. Calculates role gap analysis deterministically for a company role', () => {
    const google = TARGET_COMPANIES_CATALOG.find(c => c.name.toLowerCase() === 'google')!;
    const sweRole = google.availableRoles[0];

    // Candidate with no skills
    const emptyGap = StudentJourneyService.calculateCompanyRoleGap([], [], [], sweRole);
    assert.equal(emptyGap.readinessPercentage, 0, 'Candidate with no skills should have 0% readiness');
    assert.equal(emptyGap.meetingCount, 0);
    assert.equal(emptyGap.gapItems.length, sweRole.essentialSkills.length + sweRole.preferredSkills.length);

    // Candidate with matching verified skill
    const candSkills = [
      {
        id: 'sk-1',
        studentId: candidateIdA,
        name: 'Data Structures & Algorithms',
        category: 'Data Structures & Algorithms' as any,
        proficiency: 'Advanced' as any,
        howLearned: 'College Coursework' as any,
        evidenceType: 'verified_certification' as any,
        createdAt: '',
        updatedAt: ''
      }
    ];

    const partialGap = StudentJourneyService.calculateCompanyRoleGap(candSkills, [], [], sweRole);
    assert.ok(partialGap.readinessPercentage > 0, 'Candidate with verified core skill should have >0% readiness');
    assert.ok(partialGap.meetingCount >= 1, 'Should have at least 1 requirement meeting requirement');
  });
});
