import express from 'express';
import { query } from '../db/index.js';

const router = express.Router();

/**
 * Helper to map DB row to frontend Opportunity domain model
 */
export function mapDbOpportunity(row) {
  const deadlineDate = new Date(row.deadline);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  deadlineDate.setHours(0, 0, 0, 0);
  const diffTime = deadlineDate.getTime() - today.getTime();
  const daysRemaining = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  const totalSeats = parseInt(row.total_seats || 1, 10);
  const confirmedSeats = parseInt(row.confirmed_seats || 0, 10);
  const availableSeats = Math.max(0, totalSeats - confirmedSeats);

  return {
    id: row.id,
    title: row.title,
    isIllustrativeSample: Boolean(row.is_demonstration_sample),
    provider: row.provider,
    providerType: row.provider_type,
    category: row.category,
    educationLevels: Array.isArray(row.education_levels) 
      ? row.education_levels 
      : (typeof row.education_levels === 'string' ? JSON.parse(row.education_levels) : []),
    location: row.location,
    benefitsSummary: row.benefits_summary,
    annualValueNumeric: parseFloat(row.annual_value_inr || 0),
    coverageDetails: Array.isArray(row.coverage_details)
      ? row.coverage_details
      : (typeof row.coverage_details === 'string' ? JSON.parse(row.coverage_details) : []),
    deadline: row.deadline ? row.deadline.toISOString().split('T')[0] : '',
    daysRemaining,
    verificationStatus: row.verification_status,
    verifiedDate: row.verified_date ? row.verified_date.toISOString().split('T')[0] : '',
    verifiedBy: row.verified_by || '',
    officialSourceUrl: row.official_source_url,
    description: row.description,
    requiredDocuments: Array.isArray(row.required_documents)
      ? row.required_documents
      : (typeof row.required_documents === 'string' ? JSON.parse(row.required_documents) : []),
    viewsCount: parseInt(row.views_count || 0, 10),
    savesCount: parseInt(row.saves_count || 0, 10),
    applicationsCount: parseInt(row.applications_count || 0, 10),
    addedDate: row.added_date ? row.added_date.toISOString().split('T')[0] : '',
    archived: Boolean(row.archived),
    minGpa: parseFloat(row.min_grade_value || 0),
    requiredGradeScale: row.required_grade_scale || '10.0_CGPA',
    maxHouseholdIncome: row.max_annual_income_inr ? parseFloat(row.max_annual_income_inr) : undefined,
    allowedMajors: Array.isArray(row.allowed_majors)
      ? row.allowed_majors
      : (typeof row.allowed_majors === 'string' ? JSON.parse(row.allowed_majors) : ['All']),
    requiresPortfolioOrResearchStatement: Boolean(row.requires_portfolio),
    requiresFirstGenVerification: Boolean(row.requires_first_gen),
    // Attendance and Seat Capacity
    minAttendancePercentage: row.min_attendance_percentage ? parseFloat(row.min_attendance_percentage) : undefined,
    totalSeats,
    confirmedSeats,
    availableSeats,
  };
}

// GET /api/opportunities
router.get('/', async (req, res) => {
  try {
    const { search, category, educationLevel, location, verificationStatus, sortBy, includeArchived } = req.query;

    let sql = `
      SELECT o.*,
        COALESCE(alloc.confirmed_count, 0) AS confirmed_seats,
        COALESCE(apps.app_count, 0) AS applications_count,
        COALESCE(sav.save_count, 0) AS saves_count
      FROM opportunities o
      LEFT JOIN (
        SELECT opportunity_id, COUNT(*)::int AS confirmed_count 
        FROM opportunity_seat_allocations 
        GROUP BY opportunity_id
      ) alloc ON alloc.opportunity_id = o.id
      LEFT JOIN (
        SELECT opportunity_id, COUNT(*)::int AS app_count 
        FROM applications 
        GROUP BY opportunity_id
      ) apps ON apps.opportunity_id = o.id
      LEFT JOIN (
        SELECT opportunity_id, COUNT(*)::int AS save_count 
        FROM saved_opportunities 
        GROUP BY opportunity_id
      ) sav ON sav.opportunity_id = o.id
      WHERE 1=1
    `;

    const params = [];
    let pIdx = 1;

    if (includeArchived !== 'true') {
      sql += ` AND o.archived = FALSE`;
    }

    if (verificationStatus) {
      sql += ` AND o.verification_status = $${pIdx++}`;
      params.push(verificationStatus);
    }

    if (category && category !== 'All Categories') {
      sql += ` AND o.category = $${pIdx++}`;
      params.push(category);
    }

    if (location && location !== 'All Locations') {
      sql += ` AND o.location = $${pIdx++}`;
      params.push(location);
    }

    if (search) {
      sql += ` AND (o.title ILIKE $${pIdx} OR o.provider ILIKE $${pIdx} OR o.description ILIKE $${pIdx})`;
      params.push(`%${search}%`);
      pIdx++;
    }

    if (educationLevel && educationLevel !== 'All Levels') {
      sql += ` AND o.education_levels @> $${pIdx}::jsonb`;
      params.push(JSON.stringify([educationLevel]));
      pIdx++;
    }

    // Sorting
    if (sortBy === 'deadline') {
      sql += ` ORDER BY o.deadline ASC`;
    } else if (sortBy === 'value-high') {
      sql += ` ORDER BY o.annual_value_inr DESC`;
    } else if (sortBy === 'most-viewed') {
      sql += ` ORDER BY o.views_count DESC`;
    } else {
      sql += ` ORDER BY o.added_date DESC, o.deadline ASC`;
    }

    const result = await query(sql, params);
    const mapped = result.rows.map(mapDbOpportunity);
    return res.json(mapped);
  } catch (err) {
    console.error('[Opportunities Error]', err.message);
    return res.status(500).json({ error: 'Failed to retrieve opportunities catalogue' });
  }
});

// GET /api/opportunities/:id
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    // Increment views_count atomically
    await query('UPDATE opportunities SET views_count = views_count + 1 WHERE id = $1', [id]);

    const result = await query(
      `SELECT o.*,
        COALESCE(alloc.confirmed_count, 0) AS confirmed_seats,
        COALESCE(apps.app_count, 0) AS applications_count,
        COALESCE(sav.save_count, 0) AS saves_count
      FROM opportunities o
      LEFT JOIN (
        SELECT opportunity_id, COUNT(*)::int AS confirmed_count 
        FROM opportunity_seat_allocations 
        GROUP BY opportunity_id
      ) alloc ON alloc.opportunity_id = o.id
      LEFT JOIN (
        SELECT opportunity_id, COUNT(*)::int AS app_count 
        FROM applications 
        GROUP BY opportunity_id
      ) apps ON apps.opportunity_id = o.id
      LEFT JOIN (
        SELECT opportunity_id, COUNT(*)::int AS save_count 
        FROM saved_opportunities 
        GROUP BY opportunity_id
      ) sav ON sav.opportunity_id = o.id
      WHERE o.id = $1`,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Opportunity not found' });
    }

    return res.json(mapDbOpportunity(result.rows[0]));
  } catch (err) {
    console.error('[Opportunity Detail Error]', err.message);
    return res.status(500).json({ error: 'Failed to retrieve opportunity details' });
  }
});

export default router;
