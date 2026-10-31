import express from 'express';
import { query } from '../db/index.js';
import { authenticateToken, requireStudent } from '../middleware/auth.js';
import { evaluateOpportunityEligibility } from '../services/matching.js';
import { mapDbOpportunity } from './opportunities.js';

const router = express.Router();

// Helper to map DB profile row to frontend StudentProfileData model
function mapDbProfile(row, latestAttendance) {
  return {
    fullName: row.full_name,
    email: row.email,
    institution: row.institution,
    educationLevel: row.education_level,
    fieldOfStudy: row.field_of_study,
    currentYear: row.current_year,
    gpa: parseFloat(row.grade_value || 0),
    gpaScale: row.grade_scale === '10.0_CGPA' ? 10.0 : row.grade_scale === '5.0_GPA' ? 5.0 : row.grade_scale === 'PERCENTAGE' ? 100 : 4.0,
    gradeScale: row.grade_scale,
    annualHouseholdIncome: row.annual_household_income_inr ? parseFloat(row.annual_household_income_inr) : 0,
    incomeFinancialYear: row.income_financial_year || 'FY 2025-26',
    location: row.location,
    enrollmentStatus: row.enrollment_status,
    firstGenerationStudent: row.first_generation_status === 'Yes' ? 'Yes' : row.first_generation_status === 'No' ? 'No' : 'Unverified',
    // Readiness flags
    transcriptUploaded: Boolean(row.transcript_ready),
    incomeCertificateUploaded: Boolean(row.income_cert_ready),
    recommendationLetterUploaded: Boolean(row.recommendation_ready),
    researchStatementUploaded: Boolean(row.portfolio_ready),
    careerInterests: Array.isArray(row.career_interests) 
      ? row.career_interests 
      : (typeof row.career_interests === 'string' ? JSON.parse(row.career_interests) : []),
    // Attendance
    currentAttendancePercentage: latestAttendance ? parseFloat(latestAttendance.attendance_percentage) : undefined,
    latestAttendancePeriod: latestAttendance ? latestAttendance.period_label : undefined,
  };
}

// GET /api/students/profile
router.get('/profile', authenticateToken, requireStudent, async (req, res) => {
  try {
    const profRes = await query(
      `SELECT p.*, u.email 
       FROM student_profiles p 
       JOIN users u ON u.id = p.user_id 
       WHERE p.user_id = $1`,
      [req.user.userId]
    );

    if (profRes.rows.length === 0) {
      return res.status(404).json({ error: 'Student profile not found' });
    }

    const attRes = await query(
      `SELECT * FROM student_attendance_history 
       WHERE user_id = $1 
       ORDER BY period_start_date DESC 
       LIMIT 1`,
      [req.user.userId]
    );

    const latestAttendance = attRes.rows.length > 0 ? attRes.rows[0] : null;
    return res.json(mapDbProfile(profRes.rows[0], latestAttendance));
  } catch (err) {
    console.error('[Get Profile Error]', err.message);
    return res.status(500).json({ error: 'Failed to retrieve profile' });
  }
});

// PUT /api/students/profile
router.put('/profile', authenticateToken, requireStudent, async (req, res) => {
  try {
    const {
      fullName,
      institution,
      educationLevel,
      fieldOfStudy,
      currentYear,
      gpa,
      gradeScale,
      annualHouseholdIncome,
      incomeFinancialYear,
      location,
      enrollmentStatus,
      firstGenerationStudent,
      transcriptUploaded,
      incomeCertificateUploaded,
      recommendationLetterUploaded,
      researchStatementUploaded,
      careerInterests,
    } = req.body;

    const scale = gradeScale || '10.0_CGPA';
    const gradeVal = parseFloat(gpa || 0);

    // Validate grade range based on scale
    if (scale === '4.0_GPA' && (gradeVal < 0 || gradeVal > 4.0)) {
      return res.status(400).json({ error: 'GPA on 4.0 scale must be between 0.00 and 4.00' });
    }
    if (scale === '10.0_CGPA' && (gradeVal < 0 || gradeVal > 10.0)) {
      return res.status(400).json({ error: 'CGPA on 10.0 scale must be between 0.00 and 10.00' });
    }

    const firstGenStatus = firstGenerationStudent === 'Yes' ? 'Yes' : firstGenerationStudent === 'No' ? 'No' : 'Unspecified';

    await query(
      `UPDATE student_profiles SET
        full_name = COALESCE($1, full_name),
        institution = COALESCE($2, institution),
        education_level = COALESCE($3, education_level),
        field_of_study = COALESCE($4, field_of_study),
        current_year = COALESCE($5, current_year),
        grade_scale = $6,
        grade_value = $7,
        annual_household_income_inr = $8,
        income_financial_year = $9,
        location = COALESCE($10, location),
        enrollment_status = COALESCE($11, enrollment_status),
        first_generation_status = $12,
        transcript_ready = COALESCE($13, transcript_ready),
        income_cert_ready = COALESCE($14, income_cert_ready),
        recommendation_ready = COALESCE($15, recommendation_ready),
        portfolio_ready = COALESCE($16, portfolio_ready),
        career_interests = COALESCE($17, career_interests),
        updated_at = NOW()
       WHERE user_id = $18`,
      [
        fullName,
        institution,
        educationLevel,
        fieldOfStudy,
        currentYear,
        scale,
        gradeVal,
        annualHouseholdIncome !== undefined ? parseFloat(annualHouseholdIncome) : null,
        incomeFinancialYear || 'FY 2025-26',
        location,
        enrollmentStatus,
        firstGenStatus,
        transcriptUploaded,
        incomeCertificateUploaded,
        recommendationLetterUploaded,
        researchStatementUploaded,
        careerInterests ? JSON.stringify(careerInterests) : null,
        req.user.userId,
      ]
    );

    const profRes = await query(
      `SELECT p.*, u.email 
       FROM student_profiles p 
       JOIN users u ON u.id = p.user_id 
       WHERE p.user_id = $1`,
      [req.user.userId]
    );

    const attRes = await query(
      `SELECT * FROM student_attendance_history 
       WHERE user_id = $1 
       ORDER BY period_start_date DESC 
       LIMIT 1`,
      [req.user.userId]
    );

    return res.json(mapDbProfile(profRes.rows[0], attRes.rows[0]));
  } catch (err) {
    console.error('[Update Profile Error]', err.message);
    return res.status(500).json({ error: 'Failed to update student profile' });
  }
});

// GET /api/students/attendance
router.get('/attendance', authenticateToken, requireStudent, async (req, res) => {
  try {
    const historyRes = await query(
      `SELECT id, period_start_date, period_label, attendance_percentage, reported_at 
       FROM student_attendance_history 
       WHERE user_id = $1 
       ORDER BY period_start_date ASC`,
      [req.user.userId]
    );

    const history = historyRes.rows.map((r) => ({
      id: r.id,
      periodStartDate: r.period_start_date.toISOString().split('T')[0],
      periodLabel: r.period_label,
      attendancePercentage: parseFloat(r.attendance_percentage),
      reportedAt: r.reported_at,
    }));

    const latest = history.length > 0 ? history[history.length - 1] : null;

    return res.json({
      history,
      latest,
      disclaimer: 'Self-reported by student · Not institution-verified',
    });
  } catch (err) {
    console.error('[Get Attendance Error]', err.message);
    return res.status(500).json({ error: 'Failed to retrieve attendance history' });
  }
});

// POST /api/students/attendance (Self-Report Attendance Period)
router.post('/attendance', authenticateToken, requireStudent, async (req, res) => {
  try {
    const { periodStartDate, periodLabel, attendancePercentage } = req.body;

    if (!periodStartDate || !periodLabel || attendancePercentage === undefined) {
      return res.status(400).json({ error: 'periodStartDate, periodLabel, and attendancePercentage are required' });
    }

    const pct = parseFloat(attendancePercentage);
    if (isNaN(pct) || pct < 0 || pct > 100) {
      return res.status(400).json({ error: 'Attendance percentage must be between 0.00% and 100.00%' });
    }

    await query(
      `INSERT INTO student_attendance_history (user_id, period_start_date, period_label, attendance_percentage)
       VALUES ($1, $2, $3, $4)
       ON CONFLICT (user_id, period_start_date)
       DO UPDATE SET attendance_percentage = EXCLUDED.attendance_percentage, period_label = EXCLUDED.period_label, reported_at = NOW()`,
      [req.user.userId, periodStartDate, periodLabel.trim(), pct]
    );

    return res.status(201).json({
      message: 'Attendance recorded successfully (Self-reported)',
      periodLabel,
      attendancePercentage: pct,
    });
  } catch (err) {
    console.error('[Post Attendance Error]', err.message);
    return res.status(500).json({ error: 'Failed to record attendance' });
  }
});

// GET /api/students/matches (Transparent, Deterministic Matching Engine)
router.get('/matches', authenticateToken, requireStudent, async (req, res) => {
  try {
    // 1. Fetch student profile
    const profRes = await query('SELECT * FROM student_profiles WHERE user_id = $1', [req.user.userId]);
    if (profRes.rows.length === 0) {
      return res.status(404).json({ error: 'Student profile not found' });
    }
    const profile = profRes.rows[0];

    // 2. Fetch latest attendance
    const attRes = await query(
      `SELECT * FROM student_attendance_history 
       WHERE user_id = $1 
       ORDER BY period_start_date DESC 
       LIMIT 1`,
      [req.user.userId]
    );
    const latestAttendance = attRes.rows.length > 0 ? attRes.rows[0] : null;

    // 3. Fetch active opportunities
    const oppsRes = await query(
      `SELECT o.*,
        COALESCE(alloc.confirmed_count, 0) AS confirmed_seats
       FROM opportunities o
       LEFT JOIN (
         SELECT opportunity_id, COUNT(*)::int AS confirmed_count 
         FROM opportunity_seat_allocations 
         GROUP BY opportunity_id
       ) alloc ON alloc.opportunity_id = o.id
       WHERE o.archived = FALSE AND o.verification_status != 'Expired'
       ORDER BY o.deadline ASC`
    );

    const matched = [];
    const possiblyMatched = [];
    const ineligible = [];

    for (const row of oppsRes.rows) {
      const opportunity = mapDbOpportunity(row);
      const evaluation = evaluateOpportunityEligibility(row, profile, latestAttendance);

      const item = {
        opportunity,
        evaluation,
      };

      if (evaluation.category === 'MATCHED') {
        matched.push(item);
      } else if (evaluation.category === 'POSSIBLY_MATCHED') {
        possiblyMatched.push(item);
      } else {
        ineligible.push(item);
      }
    }

    return res.json({
      matched,
      possiblyMatched,
      ineligible,
      totalEvaluated: oppsRes.rows.length,
    });
  } catch (err) {
    console.error('[Matches Engine Error]', err.message);
    return res.status(500).json({ error: 'Failed to calculate opportunity matches' });
  }
});

export default router;
