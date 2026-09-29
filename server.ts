import express from 'express';
import path from 'path';
import crypto from 'crypto';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';
import { createClient } from '@supabase/supabase-js';
import { SUPABASE_SCHEMA_SQL } from './src/lib/schema.sql';
import {
  SEED_ORGANIZATIONS,
  SEED_PROFILES,
  SEED_AUTH_CREDENTIALS,
  SEED_CANDIDATE_PROFILES,
  SEED_SKILLS,
  SEED_CANDIDATE_SKILLS,
  SEED_JOB_ROLES,
  SEED_JOB_ROLE_SKILLS,
  SEED_ROADMAP_ITEMS,
  SEED_CANDIDATE_ROADMAP_PROGRESS,
  SEED_JOBS,
  SEED_APPLICATIONS,
  SEED_TRAINING_CENTERS,
  SEED_COURSES,
  SEED_BATCHES,
  SEED_ENROLLMENTS,
  SEED_ATTENDANCE,
  SEED_CERTIFICATIONS,
  SEED_ASSESSMENTS,
  SEED_ASSESSMENT_RESULTS,
  SEED_PLACEMENTS,
  SEED_EMPLOYMENT_VERIFICATIONS,
  SEED_DISTRICT_ANALYTICS,
  SEED_SKILL_DEMAND,
  SEED_ANOMALIES
} from './src/lib/mockData';

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// ==========================================
// IN-MEMORY SKILLTRACK SUPABASE ENGINE STORE
// ==========================================
interface StoreUser {
  id: string;
  email: string;
  passwordHash: string;
  salt: string;
  email_confirmed_at: string | null;
  verification_token?: string;
  phone?: string;
  user_metadata: {
    full_name: string;
    role: string;
    organization_id: string;
    district: string;
    phone?: string;
  };
  created_at: string;
  updated_at: string;
}

interface StoreProfile {
  id: string;
  auth_user_id: string;
  full_name: string;
  email: string;
  phone?: string;
  role: string;
  organization_id: string;
  district: string;
  verification_status: string;
  profile_completion: number;
  avatar_url?: string;
  created_at: string;
  updated_at: string;
}

function hashPasswordSync(password: string, salt: string): string {
  return crypto.createHash('sha256').update(salt + password).digest('hex');
}

// Initial Seed Data
const SEED_ORGS = [
  {
    id: '00000000-0000-0000-0000-000000000001',
    name: 'Government of Maharashtra',
    type: 'Government Program',
    state: 'Maharashtra',
    district: 'Pune',
    location: 'Mantralaya, Nariman Point, Mumbai - 400032',
    contact_email: 'skilling.mission@maharashtra.gov.in',
    subscription_plan: 'Enterprise',
    status: 'active',
    created_at: '2025-01-15T00:00:00.000Z',
    updated_at: '2026-08-01T00:00:00.000Z'
  },
  {
    id: 'org-maha-001',
    name: 'Government of Maharashtra',
    type: 'Government Program',
    state: 'Maharashtra',
    district: 'Pune',
    location: 'Mantralaya, Nariman Point, Mumbai - 400032',
    contact_email: 'skilling.mission@maharashtra.gov.in',
    subscription_plan: 'Enterprise',
    status: 'active',
    created_at: '2025-01-15T00:00:00.000Z',
    updated_at: '2026-08-01T00:00:00.000Z'
  },
  {
    id: '00000000-0000-0000-0000-000000000002',
    name: 'TechSkills India Foundation',
    type: 'Corporate',
    state: 'Maharashtra',
    district: 'Mumbai Suburban',
    location: 'Hinjawadi Phase 1, Pune - 411057',
    contact_email: 'contact@techskillsfoundation.org',
    subscription_plan: 'Pro',
    status: 'active',
    created_at: '2025-03-10T00:00:00.000Z',
    updated_at: '2026-07-20T00:00:00.000Z'
  },
  {
    id: 'org-tech-002',
    name: 'TechSkills India Foundation',
    type: 'Corporate',
    state: 'Maharashtra',
    district: 'Mumbai Suburban',
    location: 'Hinjawadi Phase 1, Pune - 411057',
    contact_email: 'contact@techskillsfoundation.org',
    subscription_plan: 'Pro',
    status: 'active',
    created_at: '2025-03-10T00:00:00.000Z',
    updated_at: '2026-07-20T00:00:00.000Z'
  },
  {
    id: '00000000-0000-0000-0000-000000000003',
    name: 'Vidarbha Rural Livelihood Mission',
    type: 'Skilling NGO',
    state: 'Maharashtra',
    district: 'Nagpur',
    location: 'Civil Lines, Nagpur - 440001',
    contact_email: 'info@vidarbhaskills.org',
    subscription_plan: 'Enterprise',
    status: 'active',
    created_at: '2025-04-01T00:00:00.000Z',
    updated_at: '2026-08-01T00:00:00.000Z'
  }
];

const usersStore: Map<string, StoreUser> = new Map();
const profilesStore: Map<string, StoreProfile> = new Map();
const candidateProfilesStore: Map<string, any> = new Map();

// Seed Demo Accounts
function seedInitialUsers() {
  const demoAccounts = [
    {
      id: 'auth-cand-001',
      email: 'candidate@skilltrack.io',
      full_name: 'Aarav Patil',
      role: 'candidate',
      org_id: '00000000-0000-0000-0000-000000000001',
      district: 'Pune',
      phone: '+91 98230 45678'
    },
    {
      id: 'auth-recr-001',
      email: 'recruiter@skilltrack.io',
      full_name: 'Pooja Deshmukh',
      role: 'recruiter',
      org_id: '00000000-0000-0000-0000-000000000001',
      district: 'Mumbai Suburban',
      phone: '+91 98450 11223'
    },
    {
      id: 'auth-tc-001',
      email: 'training@skilltrack.io',
      full_name: 'Prof. Rajesh Kulkarni',
      role: 'training_center',
      org_id: '00000000-0000-0000-0000-000000000001',
      district: 'Pune',
      phone: '+91 94220 78901'
    },
    {
      id: 'auth-admin-001',
      email: 'admin@skilltrack.io',
      full_name: 'Dr. Sunita Sharma',
      role: 'organization_admin',
      org_id: '00000000-0000-0000-0000-000000000001',
      district: 'Pune',
      phone: '+91 98110 54321'
    }
  ];

  for (const acc of demoAccounts) {
    const salt = 'salt_' + acc.id;
    const passwordHash = hashPasswordSync('demo123', salt);
    const now = new Date().toISOString();

    const user: StoreUser = {
      id: acc.id,
      email: acc.email,
      passwordHash,
      salt,
      email_confirmed_at: now,
      phone: acc.phone,
      user_metadata: {
        full_name: acc.full_name,
        role: acc.role,
        organization_id: acc.org_id,
        district: acc.district,
        phone: acc.phone
      },
      created_at: now,
      updated_at: now
    };
    usersStore.set(acc.email.toLowerCase(), user);

    const profile: StoreProfile = {
      id: acc.id,
      auth_user_id: acc.id,
      full_name: acc.full_name,
      email: acc.email,
      phone: acc.phone,
      role: acc.role,
      organization_id: acc.org_id,
      district: acc.district,
      verification_status: 'verified',
      profile_completion: acc.role === 'candidate' ? 85 : 90,
      created_at: now,
      updated_at: now
    };
    profilesStore.set(acc.id, profile);

    if (acc.role === 'candidate') {
      candidateProfilesStore.set(acc.id, {
        id: 'cand-' + acc.id,
        profile_id: acc.id,
        organization_id: acc.org_id,
        target_role: 'Full Stack Web Developer',
        career_goal: 'Software Engineer in IT/Tech Sector',
        target_job: 'Full Stack Web Developer',
        readiness_score: 82,
        profile_completion: 85,
        employment_status: 'in_training',
        placement_status: 'unplaced',
        retention_status: 'none',
        education: 'Bachelor of Technology (B.Tech)',
        degree: 'Computer Engineering',
        graduation_year: 2025,
        experience_years: 1,
        created_at: now,
        updated_at: now
      });
    }
  }
}

seedInitialUsers();

// ==========================================
// UNIVERSAL SKILLTRACK DATABASE TABLES STORE
// ==========================================
const tablesStore = new Map<string, any[]>([
  ['organizations', [...SEED_ORGANIZATIONS]],
  ['profiles', [...SEED_PROFILES]],
  ['candidate_profiles', [...SEED_CANDIDATE_PROFILES]],
  ['skills', [...SEED_SKILLS]],
  ['candidate_skills', [...SEED_CANDIDATE_SKILLS]],
  ['job_roles', [...SEED_JOB_ROLES]],
  ['job_role_skills', [...SEED_JOB_ROLE_SKILLS]],
  ['roadmap_items', [...SEED_ROADMAP_ITEMS]],
  ['candidate_roadmap_progress', [...SEED_CANDIDATE_ROADMAP_PROGRESS]],
  ['jobs', [...SEED_JOBS]],
  ['job_applications', [...SEED_APPLICATIONS]],
  ['interviews', [
    {
      id: 'int-001',
      application_id: 'app-001',
      candidate_id: 'prof-cand-001',
      recruiter_id: 'prof-recr-001',
      job_id: 'job-001',
      scheduled_at: new Date(Date.now() + 86400000 * 2).toISOString(),
      round: 'Technical Architecture & Coding',
      status: 'scheduled',
      meeting_link: 'https://meet.google.com/xyz-skilltrack-demo',
      created_at: new Date().toISOString()
    }
  ]],
  ['evaluations', [
    {
      id: 'eval-001',
      application_id: 'app-001',
      candidate_id: 'prof-cand-001',
      evaluator_id: 'prof-recr-001',
      rating: 4.5,
      recommendation: 'strong_hire',
      technical_score: 88,
      communication_score: 90,
      notes: 'Strong understanding of React state management and PostgreSQL indexing.',
      created_at: new Date().toISOString()
    }
  ]],
  ['training_centers', [...SEED_TRAINING_CENTERS]],
  ['courses', [...SEED_COURSES]],
  ['batches', [...SEED_BATCHES]],
  ['enrollments', [...SEED_ENROLLMENTS]],
  ['attendance', [...SEED_ATTENDANCE]],
  ['certifications', [...SEED_CERTIFICATIONS]],
  ['assessments', [...SEED_ASSESSMENTS]],
  ['assessment_results', [...SEED_ASSESSMENT_RESULTS]],
  ['placements', [...SEED_PLACEMENTS]],
  ['employment_verifications', [...SEED_EMPLOYMENT_VERIFICATIONS]],
  ['retention_milestones', [
    {
      id: 'ret-001',
      placement_id: 'plc-001',
      candidate_id: 'prof-cand-001',
      organization_id: '00000000-0000-0000-0000-000000000001',
      milestone_period: '3_month',
      milestone_date: '2025-10-15T00:00:00.000Z',
      status: 'completed',
      epfo_confirmed: true,
      epfo_uan: '100982348123',
      wage_amount: 32000,
      notes: 'EPFO wage remittance confirmed for month 1, 2, 3.'
    },
    {
      id: 'ret-002',
      placement_id: 'plc-001',
      candidate_id: 'prof-cand-001',
      organization_id: '00000000-0000-0000-0000-000000000001',
      milestone_period: '6_month',
      milestone_date: '2026-01-15T00:00:00.000Z',
      status: 'completed',
      epfo_confirmed: true,
      epfo_uan: '100982348123',
      wage_amount: 35000,
      notes: 'EPFO verified. Retention milestone reached.'
    }
  ]],
  ['notifications', [
    {
      id: 'notif-001',
      user_id: 'auth-cand-001',
      title: 'Skill Assessment Verified',
      message: 'Your React & TypeScript benchmark assessment was verified with 88% score.',
      type: 'assessment',
      read: false,
      created_at: new Date(Date.now() - 3600000).toISOString()
    },
    {
      id: 'notif-002',
      user_id: 'auth-cand-001',
      title: 'New Job Opportunity Available',
      message: 'Apex Infotech Solutions posted Full Stack Cloud Developer matching 92% of your verified skills.',
      type: 'job',
      read: false,
      created_at: new Date(Date.now() - 7200000).toISOString()
    }
  ]],
  ['district_analytics', [...SEED_DISTRICT_ANALYTICS]],
  ['skill_demand', [...SEED_SKILL_DEMAND]],
  ['anomalies', [...SEED_ANOMALIES]]
]);

// Lazy Gemini API Client initialization
let geminiClient: GoogleGenAI | null = null;
function getGemini(): GoogleGenAI | null {
  if (!geminiClient && process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== 'MY_GEMINI_API_KEY') {
    try {
      geminiClient = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    } catch (e) {
      console.warn('Gemini client init notice:', e);
    }
  }
  return geminiClient;
}

// Supabase Service Client (server-side only)
function getSupabaseAdmin() {
  const url = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY;
  if (url && key) {
    return createClient(url, key);
  }
  return null;
}

// ==========================================
// SKILLTRACK SUPABASE AUTH & REST API
// ==========================================

// 1. SignUp Endpoint (matches Supabase Auth v1 POST /auth/v1/signup)
app.post(['/api/supabase/auth/v1/signup', '/auth/v1/signup'], (req, res) => {
  try {
    const { email, password, data, options } = req.body || {};
    const metadata = data || options?.data || {};
    const normalizedEmail = (email || '').trim().toLowerCase();
    const cleanPassword = (password || '').trim();

    // 1. Resolve full name (check multiple possible fields, with safe fallback to email prefix)
    let fullName = (
      metadata.full_name ||
      metadata.fullName ||
      req.body?.full_name ||
      req.body?.fullName ||
      req.body?.name ||
      ''
    ).trim();

    if (!fullName || fullName.length < 2) {
      if (normalizedEmail) {
        fullName = normalizedEmail.split('@')[0];
      } else {
        fullName = 'User';
      }
    }

    // 2. Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!normalizedEmail || !emailRegex.test(normalizedEmail)) {
      return res.status(400).json({
        error: 'validation_failed',
        message: 'A valid email address is required.'
      });
    }

    // 3. Validate password
    if (!cleanPassword || cleanPassword.length < 6) {
      return res.status(400).json({
        error: 'weak_password',
        message: 'Password must be at least 6 characters in length.'
      });
    }

    // 4. Validate role
    const role = metadata.role || req.body?.role || 'candidate';
    if (!['candidate', 'recruiter', 'training_center'].includes(role)) {
      if (role === 'organization_admin') {
        return res.status(400).json({
          error: 'restricted_role',
          message: 'Organization Administrator accounts cannot be created via public registration.'
        });
      }
      return res.status(400).json({
        error: 'invalid_role',
        message: 'Invalid role specified. Supported: Candidate, Recruiter, Training Center.'
      });
    }

    // 5. Validate duplicate email
    if (usersStore.has(normalizedEmail)) {
      return res.status(400).json({
        error: 'user_already_exists',
        message: 'Your email is already registered. Please sign in.'
      });
    }

    // 6. Organization & District
    const orgId = metadata.organization_id || metadata.organizationId || req.body?.organizationId || '00000000-0000-0000-0000-000000000001';
    const district = metadata.district || req.body?.district || 'Pune';
    const phone = (metadata.phone || req.body?.phone || '').trim();

    // Create user & profile (auth.users.id = profiles.id)
    const userId = crypto.randomUUID();
    const salt = crypto.randomBytes(16).toString('hex');
    const passwordHash = hashPasswordSync(cleanPassword, salt);
    const verificationToken = crypto.randomBytes(24).toString('hex');
    const now = new Date().toISOString();

    // Determine email confirmation status:
    // If REQUIRE_EMAIL_CONFIRMATION is explicitly 'true', require manual confirmation link.
    // Otherwise auto-confirm so users are not blocked when remote SMTP is unconfigured.
    const requireEmailConfirm = process.env.REQUIRE_EMAIL_CONFIRMATION === 'true';
    const emailConfirmedAt = requireEmailConfirm ? null : now;

    const newUser: StoreUser = {
      id: userId,
      email: normalizedEmail,
      passwordHash,
      salt,
      email_confirmed_at: emailConfirmedAt,
      verification_token: emailConfirmedAt ? undefined : verificationToken,
      phone,
      user_metadata: {
        full_name: fullName,
        role,
        organization_id: orgId,
        district,
        phone
      },
      created_at: now,
      updated_at: now
    };
    usersStore.set(normalizedEmail, newUser);

    // Profile (id = auth_user_id = userId)
    const newProfile: StoreProfile = {
      id: userId,
      auth_user_id: userId,
      full_name: fullName,
      email: normalizedEmail,
      phone,
      role,
      organization_id: orgId,
      district,
      verification_status: emailConfirmedAt ? 'verified' : 'pending',
      profile_completion: role === 'candidate' ? 75 : 50,
      created_at: now,
      updated_at: now
    };
    profilesStore.set(userId, newProfile);

    // If candidate, provision candidate profile
    if (role === 'candidate') {
      candidateProfilesStore.set(userId, {
        id: crypto.randomUUID(),
        profile_id: userId,
        organization_id: orgId,
        target_role: 'Full Stack Web Developer',
        career_goal: 'Software Engineer in IT/Tech Sector',
        target_job: 'Full Stack Web Developer',
        readiness_score: 75,
        profile_completion: 80,
        employment_status: 'in_training',
        placement_status: 'unplaced',
        retention_status: 'none',
        education: 'Bachelor of Technology (B.Tech)',
        degree: 'Computer Science',
        graduation_year: 2025,
        experience_years: 0,
        created_at: now,
        updated_at: now
      });
    }

    const verificationLink = `https://skilltrack.gov.in/auth/verify?token=${verificationToken}&email=${encodeURIComponent(normalizedEmail)}`;

    console.log(`[SkillTrack Auth] User registered: ${normalizedEmail} (${role}) | Confirmed: ${Boolean(emailConfirmedAt)}`);

    const userObj = {
      id: userId,
      aud: 'authenticated',
      role: 'authenticated',
      email: normalizedEmail,
      email_confirmed_at: emailConfirmedAt,
      phone,
      user_metadata: newUser.user_metadata,
      created_at: now,
      updated_at: now,
      verification_token: emailConfirmedAt ? undefined : verificationToken,
      verification_link: verificationLink
    };

    let sessionObj: any = null;
    if (emailConfirmedAt) {
      const tokenPayload = {
        userId: userId,
        email: normalizedEmail,
        role
      };
      sessionObj = {
        access_token: 'st_token_' + Buffer.from(JSON.stringify(tokenPayload)).toString('base64'),
        token_type: 'bearer',
        expires_in: 3600,
        refresh_token: 'st_ref_' + crypto.randomUUID(),
        user: userObj
      };
    }

    // Return standard Supabase Auth response shape
    return res.status(200).json({
      ...userObj,
      user: userObj,
      session: sessionObj
    });
  } catch (err: any) {
    console.error('SignUp error:', err);
    res.status(500).json({ error: 'internal_error', message: err.message || 'Registration failed.' });
  }
});

// 2. Token / Login Endpoint (matches Supabase Auth v1 POST /auth/v1/token?grant_type=password)
app.post(['/api/supabase/auth/v1/token', '/auth/v1/token'], (req, res) => {
  try {
    const { email, password } = req.body;
    const normalizedEmail = (email || '').trim().toLowerCase();
    const cleanPassword = (password || '').trim();

    if (!normalizedEmail || !cleanPassword) {
      return res.status(400).json({
        error: 'invalid_request',
        error_description: 'Please enter both your email address and password.'
      });
    }

    const user = usersStore.get(normalizedEmail);
    if (!user) {
      return res.status(400).json({
        error: 'invalid_grant',
        error_description: 'Invalid email or password.'
      });
    }

    // Verify cryptographic SHA-256 hash
    const hash = hashPasswordSync(cleanPassword, user.salt);
    if (hash !== user.passwordHash) {
      return res.status(400).json({
        error: 'invalid_grant',
        error_description: 'Invalid email or password.'
      });
    }

    // Enforce email verification only if email is unconfirmed
    if (!user.email_confirmed_at && process.env.REQUIRE_EMAIL_CONFIRMATION === 'true') {
      return res.status(400).json({
        error: 'email_not_confirmed',
        error_description: 'Email not confirmed',
        message: 'Email not confirmed',
        unverified: true,
        email: normalizedEmail,
        verification_token: user.verification_token
      });
    }

    // Generate session token
    const tokenPayload = {
      userId: user.id,
      email: user.email,
      role: user.user_metadata.role
    };
    const accessToken = 'st_token_' + Buffer.from(JSON.stringify(tokenPayload)).toString('base64');
    const refreshToken = 'st_ref_' + crypto.randomUUID();

    return res.status(200).json({
      access_token: accessToken,
      token_type: 'bearer',
      expires_in: 3600,
      refresh_token: refreshToken,
      user: {
        id: user.id,
        aud: 'authenticated',
        role: 'authenticated',
        email: user.email,
        email_confirmed_at: user.email_confirmed_at || new Date().toISOString(),
        phone: user.phone,
        user_metadata: user.user_metadata,
        created_at: user.created_at,
        updated_at: user.updated_at
      }
    });
  } catch (err: any) {
    console.error('Token endpoint error:', err);
    res.status(500).json({ error: 'internal_error', error_description: 'Sign in failed.' });
  }
});

// 3. Email Verification Endpoint
app.post(['/api/supabase/auth/v1/verify', '/auth/v1/verify'], (req, res) => {
  try {
    const { token, email } = req.body;
    let targetUser: StoreUser | undefined;

    if (email) {
      targetUser = usersStore.get(email.trim().toLowerCase());
    } else if (token) {
      for (const u of usersStore.values()) {
        if (u.verification_token === token) {
          targetUser = u;
          break;
        }
      }
    }

    if (!targetUser || (token && targetUser.verification_token !== token)) {
      return res.status(400).json({
        error: 'invalid_token',
        message: 'Invalid or expired verification token.'
      });
    }

    targetUser.email_confirmed_at = new Date().toISOString();
    targetUser.verification_token = undefined;
    usersStore.set(targetUser.email, targetUser);

    const prof = profilesStore.get(targetUser.id);
    if (prof) {
      prof.verification_status = 'verified';
      profilesStore.set(targetUser.id, prof);
    }

    console.log(`[SkillTrack Auth] Email successfully verified for: ${targetUser.email}`);

    return res.status(200).json({
      success: true,
      message: 'Email successfully verified. You can now sign in.',
      user: {
        id: targetUser.id,
        email: targetUser.email,
        email_confirmed_at: targetUser.email_confirmed_at
      }
    });
  } catch (err: any) {
    res.status(500).json({ error: 'internal_error', message: err.message });
  }
});

// 4. Resend Verification Endpoint
app.post(['/api/supabase/auth/v1/resend', '/auth/v1/resend'], (req, res) => {
  try {
    const { email } = req.body;
    const normalizedEmail = (email || '').trim().toLowerCase();
    const user = usersStore.get(normalizedEmail);

    if (!user) {
      return res.status(404).json({
        error: 'not_found',
        message: 'No account registered with this email address.'
      });
    }

    const newToken = crypto.randomBytes(24).toString('hex');
    user.verification_token = newToken;
    usersStore.set(normalizedEmail, user);

    console.log(`[SkillTrack Auth] Resent verification token for ${normalizedEmail}: ${newToken}`);

    return res.status(200).json({
      success: true,
      message: `Verification link resent to ${normalizedEmail}.`,
      verification_token: newToken
    });
  } catch (err: any) {
    res.status(500).json({ error: 'internal_error', message: err.message });
  }
});

// 5. User Endpoint (GET /auth/v1/user)
app.get(['/api/supabase/auth/v1/user', '/auth/v1/user'], (req, res) => {
  try {
    const authHeader = req.headers.authorization || '';
    if (!authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'unauthorized', message: 'Missing Bearer token.' });
    }
    const tokenStr = authHeader.replace('Bearer ', '');
    if (tokenStr.startsWith('st_token_')) {
      const payloadStr = Buffer.from(tokenStr.replace('st_token_', ''), 'base64').toString('utf-8');
      const payload = JSON.parse(payloadStr);
      const user = usersStore.get(payload.email);
      if (user) {
        return res.status(200).json({
          id: user.id,
          aud: 'authenticated',
          role: 'authenticated',
          email: user.email,
          email_confirmed_at: user.email_confirmed_at,
          user_metadata: user.user_metadata,
          created_at: user.created_at
        });
      }
    }
    return res.status(401).json({ error: 'invalid_token', message: 'Token expired or invalid.' });
  } catch (err: any) {
    res.status(401).json({ error: 'unauthorized', message: 'Authentication required.' });
  }
});

// 6. Logout Endpoint (POST /auth/v1/logout)
app.post(['/api/supabase/auth/v1/logout', '/auth/v1/logout'], (req, res) => {
  res.status(204).end();
});

// ==========================================
// UNIVERSAL POSTGREST V1 API ENGINE
// ==========================================

function normalizeTable(table: string): string {
  if (table === 'applications') return 'job_applications';
  if (table === 'users') return 'profiles';
  return table;
}

function matchesPostgrestFilter(item: any, query: Record<string, any>): boolean {
  for (const [key, rawVal] of Object.entries(query)) {
    if (['select', 'order', 'limit', 'offset'].includes(key)) continue;

    if (key === 'or' && typeof rawVal === 'string') {
      const clean = rawVal.replace(/^\(|\)$/g, '');
      const parts = clean.split(',');
      const anyMatch = parts.some(part => {
        const [field, op, expected] = part.split('.');
        if (op === 'eq') return String(item[field] ?? '').toLowerCase() === String(expected ?? '').toLowerCase();
        if (op === 'neq') return String(item[field] ?? '').toLowerCase() !== String(expected ?? '').toLowerCase();
        return false;
      });
      if (!anyMatch) return false;
      continue;
    }

    const val = String(rawVal);
    if (val.startsWith('eq.')) {
      const expected = val.slice(3);
      if (String(item[key] ?? '').toLowerCase() !== expected.toLowerCase()) return false;
    } else if (val.startsWith('neq.')) {
      const expected = val.slice(4);
      if (String(item[key] ?? '').toLowerCase() === expected.toLowerCase()) return false;
    } else if (val.startsWith('ilike.')) {
      const expected = val.slice(6).replace(/%/g, '').toLowerCase();
      if (!String(item[key] ?? '').toLowerCase().includes(expected)) return false;
    } else if (val.startsWith('in.')) {
      const expectedArr = val.slice(3).replace(/^\(|\)$/g, '').split(',').map(s => s.trim().toLowerCase());
      if (!expectedArr.includes(String(item[key] ?? '').toLowerCase())) return false;
    } else if (val === 'is.null') {
      if (item[key] !== null && item[key] !== undefined) return false;
    } else if (val === 'is.not.null') {
      if (item[key] === null || item[key] === undefined) return false;
    } else {
      if (String(item[key] ?? '') !== val) return false;
    }
  }
  return true;
}

function enrichRecord(table: string, item: any): any {
  if (!item) return item;
  const enriched = { ...item };
  if (table === 'job_applications') {
    const job = tablesStore.get('jobs')?.find(j => j.id === item.job_id);
    const candidateProfile = tablesStore.get('profiles')?.find(p => p.id === item.candidate_id);
    const candidateMeta = tablesStore.get('candidate_profiles')?.find(cp => cp.profile_id === item.candidate_id);
    enriched.job = job || item.job;
    enriched.candidate = {
      full_name: candidateProfile?.full_name || item.candidate?.full_name || 'Candidate',
      email: candidateProfile?.email || item.candidate?.email || '',
      phone: candidateProfile?.phone || item.candidate?.phone || '',
      target_job: candidateMeta?.target_job || candidateMeta?.target_role || 'Developer',
      readiness_score: candidateMeta?.readiness_score || 82,
      district: candidateProfile?.district || 'Pune'
    };
  } else if (table === 'candidate_skills') {
    const skill = tablesStore.get('skills')?.find(s => s.id === item.skill_id);
    enriched.skill = skill;
  } else if (table === 'job_role_skills') {
    const skill = tablesStore.get('skills')?.find(s => s.id === item.skill_id);
    enriched.skill = skill;
  } else if (table === 'roadmap_items') {
    const skill = tablesStore.get('skills')?.find(s => s.id === item.skill_id);
    enriched.skill_name = skill?.name;
  } else if (table === 'enrollments') {
    const batch = tablesStore.get('batches')?.find(b => b.id === item.batch_id);
    const course = tablesStore.get('courses')?.find(c => c.id === item.course_id);
    enriched.batch = batch;
    enriched.course = course;
  }
  return enriched;
}

// 1. Universal GET
app.get(['/api/supabase/rest/v1/:table', '/rest/v1/:table'], (req, res) => {
  const table = normalizeTable(req.params.table);
  const data = tablesStore.get(table);
  if (!data) {
    return res.status(200).json([]);
  }

  let results = data.filter(item => matchesPostgrestFilter(item, req.query));

  // Sorting
  if (req.query.order && typeof req.query.order === 'string') {
    const [col, dir] = req.query.order.split('.');
    const isDesc = dir === 'desc';
    results.sort((a, b) => {
      const aVal = a[col] ?? '';
      const bVal = b[col] ?? '';
      if (aVal < bVal) return isDesc ? 1 : -1;
      if (aVal > bVal) return isDesc ? -1 : 1;
      return 0;
    });
  }

  // Offset & Limit
  if (req.query.offset) {
    const offset = parseInt(String(req.query.offset), 10);
    if (!isNaN(offset)) results = results.slice(offset);
  }
  if (req.query.limit) {
    const limit = parseInt(String(req.query.limit), 10);
    if (!isNaN(limit)) results = results.slice(0, limit);
  }

  const enrichedResults = results.map(item => enrichRecord(table, item));

  // Single object representation (used by .single() or .maybeSingle())
  const acceptHeader = req.headers['accept'] || '';
  if (acceptHeader.includes('application/vnd.pgrst.object+json')) {
    if (enrichedResults.length === 0) {
      return res.status(404).json({
        code: 'PGRST116',
        details: 'The result contains 0 rows',
        message: 'JSON object requested, multiple (or no) rows returned'
      });
    }
    return res.status(200).json(enrichedResults[0]);
  }

  return res.status(200).json(enrichedResults);
});

// 2. Universal POST (Insert)
app.post(['/api/supabase/rest/v1/:table', '/rest/v1/:table'], (req, res) => {
  const table = normalizeTable(req.params.table);
  let list = tablesStore.get(table);
  if (!list) {
    list = [];
    tablesStore.set(table, list);
  }

  const body = req.body;
  const items = Array.isArray(body) ? body : [body];
  const now = new Date().toISOString();

  const inserted = items.map(raw => {
    const prefix = table.slice(0, 3);
    const id = raw.id || `${prefix}-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
    const record = {
      ...raw,
      id,
      created_at: raw.created_at || now,
      updated_at: now
    };
    list.unshift(record);
    return record;
  });

  if (table === 'profiles') {
    inserted.forEach(p => profilesStore.set(p.id, p));
  } else if (table === 'candidate_profiles') {
    inserted.forEach(cp => candidateProfilesStore.set(cp.profile_id, cp));
  }

  const preferHeader = req.headers['prefer'] || '';
  if (preferHeader.includes('return=representation') || !preferHeader) {
    const responsePayload = Array.isArray(body) ? inserted : inserted[0];
    return res.status(201).json(responsePayload);
  }

  return res.status(201).end();
});

// 3. Universal PATCH (Update)
app.patch(['/api/supabase/rest/v1/:table', '/rest/v1/:table'], (req, res) => {
  const table = normalizeTable(req.params.table);
  const list = tablesStore.get(table) || [];
  const now = new Date().toISOString();
  const updatedRecords: any[] = [];

  for (let i = 0; i < list.length; i++) {
    if (matchesPostgrestFilter(list[i], req.query)) {
      list[i] = {
        ...list[i],
        ...req.body,
        updated_at: now
      };
      updatedRecords.push(list[i]);

      if (table === 'profiles') {
        profilesStore.set(list[i].id, list[i]);
      } else if (table === 'candidate_profiles') {
        candidateProfilesStore.set(list[i].profile_id, list[i]);
      }
    }
  }

  const preferHeader = req.headers['prefer'] || '';
  if (preferHeader.includes('return=representation') || !preferHeader) {
    return res.status(200).json(updatedRecords);
  }
  return res.status(204).end();
});

// 4. Universal DELETE (Delete)
app.delete(['/api/supabase/rest/v1/:table', '/rest/v1/:table'], (req, res) => {
  const table = normalizeTable(req.params.table);
  let list = tablesStore.get(table) || [];
  const toDelete = list.filter(item => matchesPostgrestFilter(item, req.query));
  list = list.filter(item => !matchesPostgrestFilter(item, req.query));
  tablesStore.set(table, list);

  if (table === 'profiles') {
    toDelete.forEach(p => profilesStore.delete(p.id));
  } else if (table === 'candidate_profiles') {
    toDelete.forEach(cp => candidateProfilesStore.delete(cp.profile_id));
  }

  return res.status(204).end();
});

// ==========================================
// REST API ENDPOINTS
// ==========================================

app.get('/api/health', async (req, res) => {
  let dbStatus = 'disconnected';
  const supabase = getSupabaseAdmin();
  if (supabase) {
    try {
      const { data, error } = await supabase.from('skills').select('id').limit(1);
      if (!error) {
        dbStatus = 'connected';
      } else {
        dbStatus = `configured (${error.message || error.code})`;
      }
    } catch (e: any) {
      dbStatus = `error: ${e.message}`;
    }
  }

  res.json({
    status: 'healthy',
    platform: 'SkillTrack Multi-tenant SaaS',
    problemStatement: 'SIH26135',
    timestamp: new Date().toISOString(),
    aiEngineAvailable: Boolean(process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== 'MY_GEMINI_API_KEY'),
    supabaseConfigured: Boolean(process.env.SUPABASE_URL && !process.env.SUPABASE_URL.includes('your-project')),
    databaseStatus: dbStatus,
    localEngineActive: true,
    activeUsersCount: usersStore.size,
    organizationsCount: SEED_ORGS.length
  });
});

// Database Migration SQL retrieval endpoint
app.get('/api/db/schema', (req, res) => {
  res.json({
    success: true,
    migrationFile: 'supabase/migrations/20260829000003_complete_backend_foundation.sql',
    sql: SUPABASE_SCHEMA_SQL
  });
});

// Organizations list endpoint
app.get('/api/organizations', (req, res) => {
  res.json({
    tenants: SEED_ORGS
  });
});

// AI Skilling & Employment Intelligence Endpoint (Server-Side Gemini API)
app.post('/api/ai/insights', async (req, res) => {
  try {
    const { prompt, context } = req.body;
    const ai = getGemini();

    if (ai) {
      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: `You are SkillTrack AI Skilling & Employment Intelligence Engine for Smart India Hackathon (SIH26135).
Provide actionable, crisp analytical insights regarding skilling outcomes, district-level skill gaps, and 3/6/12-month employment retention.
Context: ${JSON.stringify(context || {})}
Prompt: ${prompt}`
      });

      return res.json({
        success: true,
        source: 'gemini-3.8-flash',
        insight: response.text
      });
    }

    return res.json({
      success: true,
      source: 'skilltrack-rules-engine',
      insight: `Analysis for ${context?.district || 'State Cohort'}: Retention at 6-month mark is highest (86.4%) in sectors with integrated practical lab modules. Recommended intervention: Align 15% curriculum expansion toward EV battery diagnostics and Cloud DevOps to narrow the 24% district skill deficit.`
    });
  } catch (error: any) {
    console.error('AI Insights endpoint error:', error);
    res.status(500).json({ error: error.message || 'Internal Server Error' });
  }
});

// AI Skill Intelligence & Career Guidance Explanation Endpoint
app.post('/api/ai/skill-intelligence', async (req, res) => {
  try {
    const {
      target_role,
      overall_score,
      readiness_status,
      strengths,
      deficits,
      next_action
    } = req.body;

    // Sanitize untrusted input strings
    const safeRole = String(target_role || 'Target Role').substring(0, 100).replace(/[<>{}]/g, '');
    const safeScore = Math.min(100, Math.max(0, Number(overall_score) || 0));
    const safeStatus = String(readiness_status || 'Developing').substring(0, 50).replace(/[<>{}]/g, '');
    const safeStrengths = Array.isArray(strengths) ? strengths.slice(0, 5).map(s => String(s).substring(0, 80)) : [];
    const safeDeficits = Array.isArray(deficits) ? deficits.slice(0, 5).map(d => String(d).substring(0, 80)) : [];
    const safeNextAction = String(next_action || '').substring(0, 150).replace(/[<>{}]/g, '');

    const ai = getGemini();

    if (ai) {
      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: `You are SkillTrack AI Career Guidance & Competency Intelligence Engine (SIH26135).
Provide a concise, 2-to-3 sentence explainable career recommendation based solely on the verified competency vector below.
Role: ${safeRole}
Deterministic Readiness Score: ${safeScore}/100 (${safeStatus})
Matched Strengths: ${safeStrengths.join(', ') || 'None recorded'}
Identified Gaps: ${safeDeficits.join(', ') || 'None'}
Prescribed Action: ${safeNextAction}

Rules:
1. Ground your explanation strictly on the provided competencies.
2. Do not promise hiring outcomes or inflate scores.
3. Suggest a concrete learning milestone to close the primary gap. Keep it within 3 sentences.`
      });

      if (response && response.text && response.text.trim().length > 15) {
        return res.json({
          success: true,
          source: 'gemini-3.8-flash',
          explanation: response.text.trim()
        });
      }
    }

    // Deterministic fallback response
    const fallback = `Competency analysis for ${safeRole} (${safeScore}/100 - ${safeStatus}): Candidate demonstrates established proficiency in ${safeStrengths.slice(0, 2).join(' and ') || 'foundational prerequisites'}. The primary career accelerator is closing ${safeDeficits[0] || 'remaining curriculum benchmarks'}. ${safeNextAction || 'Complete targeted code labs and practical assessments to advance.'}`;

    return res.json({
      success: true,
      source: 'deterministic-engine',
      explanation: fallback
    });
  } catch (error: any) {
    console.warn('AI Skill Intelligence error, using deterministic fallback:', error?.message);
    const fallback = `Competency analysis for ${req.body.target_role || 'Target Role'}: Candidate readiness score is ${req.body.overall_score || 75}/100 based on verified role skills and practice assessments. Follow recommended roadmap milestones to systematically advance proficiency.`;
    return res.json({
      success: true,
      source: 'deterministic-engine',
      explanation: fallback
    });
  }
});

// ==========================================
// VITE DEV MIDDLEWARE / STATIC PRODUCTION SERVING
// ==========================================
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[SkillTrack] Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
