import express from 'express';
import crypto from 'crypto';
import { query, getClient } from '../db/index.js';
import { authenticateToken, requireAdmin } from '../middleware/auth.js';
import { mapDbOpportunity } from './opportunities.js';

const router = express.Router();

// Apply admin guard to all routes in this router
router.use(authenticateToken, requireAdmin);

// GET /api/admin/analytics (Real database metrics)
router.get('/analytics', async (req, res) => {
  try {
    const totalOppsRes = await query('SELECT COUNT(*)::int AS count FROM opportunities WHERE archived = FALSE');
    const verifiedRes = await query("SELECT COUNT(*)::int AS count FROM opportunities WHERE verification_status = 'Verified' AND archived = FALSE");
    const pendingRes = await query("SELECT COUNT(*)::int AS count FROM opportunities WHERE verification_status = 'Pending Review' AND archived = FALSE");
    const expiringRes = await query("SELECT COUNT(*)::int AS count FROM opportunities WHERE deadline >= CURRENT_DATE AND deadline <= CURRENT_DATE + INTERVAL '14 days' AND archived = FALSE");
    const studentsRes = await query("SELECT COUNT(*)::int AS count FROM users WHERE role = 'student'");
    const applicationsRes = await query('SELECT COUNT(*)::int AS count FROM applications');
    const savesRes = await query('SELECT COUNT(*)::int AS count FROM saved_opportunities');
    const allocationsRes = await query('SELECT COUNT(*)::int AS count FROM opportunity_seat_allocations');

    const catRes = await query(
      `SELECT category, COUNT(*)::int AS count 
       FROM opportunities 
       WHERE archived = FALSE 
       GROUP BY category 
       ORDER BY count DESC`
    );

    return res.json({
      totalOpportunities: totalOppsRes.rows[0].count,
      verifiedOpportunities: verifiedRes.rows[0].count,
      pendingVerification: pendingRes.rows[0].count,
      expiringOpportunities: expiringRes.rows[0].count,
      registeredStudents: studentsRes.rows[0].count,
      totalApplications: applicationsRes.rows[0].count,
      totalSaves: savesRes.rows[0].count,
      totalSeatAllocations: allocationsRes.rows[0].count,
      categoryBreakdown: catRes.rows,
    });
  } catch (err) {
    console.error('[Admin Analytics Error]', err.message);
    return res.status(500).json({ error: 'Failed to retrieve analytics' });
  }
});

// POST /api/admin/opportunities (Create Opportunity)
router.post('/opportunities', async (req, res) => {
  try {
    const opp = req.body;
    const oppId = opp.id || `opp-${Date.now()}-${crypto.randomBytes(3).toString('hex')}`;

    const totalSeats = parseInt(opp.totalSeats || opp.total_seats || 1, 10);
    const minAttendance = opp.minAttendancePercentage !== undefined ? parseFloat(opp.minAttendancePercentage) : null;
    const gradeScale = opp.requiredGradeScale || '10.0_CGPA';
    const minGrade = parseFloat(opp.minGpa || opp.minGradeValue || 0);

    const result = await query(
      `INSERT INTO opportunities (
        id, title, is_demonstration_sample, provider, provider_type, category, education_levels, location,
        benefits_summary, annual_value_inr, coverage_details, deadline, verification_status,
        official_source_url, description, required_documents, min_attendance_percentage,
        required_grade_scale, min_grade_value, max_annual_income_inr, allowed_majors,
        requires_first_gen, requires_portfolio, total_seats
      ) VALUES (
        $1, $2, FALSE, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23
      ) RETURNING *;`,
      [
        oppId,
        opp.title,
        opp.provider || 'Institutional Provider',
        opp.providerType || 'Foundation',
        opp.category || 'Merit Scholarship',
        JSON.stringify(opp.educationLevels || ['Undergraduate']),
        opp.location || 'National',
        opp.benefitsSummary || 'Tuition and academic support',
        parseFloat(opp.annualValueNumeric || 0),
        JSON.stringify(opp.coverageDetails || []),
        opp.deadline,
        opp.verificationStatus || 'Verified',
        opp.officialSourceUrl || 'https://scholarbridge.example.org',
        opp.description || '',
        JSON.stringify(opp.requiredDocuments || []),
        minAttendance,
        gradeScale,
        minGrade,
        opp.maxHouseholdIncome ? parseFloat(opp.maxHouseholdIncome) : null,
        JSON.stringify(opp.allowedMajors || ['All']),
        Boolean(opp.requiresFirstGenVerification),
        Boolean(opp.requiresPortfolioOrResearchStatement),
        totalSeats,
      ]
    );

    // Audit log
    await query(
      'INSERT INTO audit_logs (admin_id, action, target_entity, target_id, details) VALUES ($1, $2, $3, $4, $5)',
      [req.user.userId, 'CREATE_OPPORTUNITY', 'opportunities', oppId, JSON.stringify({ title: opp.title })]
    );

    return res.status(201).json(mapDbOpportunity(result.rows[0]));
  } catch (err) {
    console.error('[Create Opp Error]', err.message);
    return res.status(500).json({ error: 'Failed to create opportunity record' });
  }
});

// PUT /api/admin/opportunities/:id (Update with Concurrency-Safe Capacity Check)
router.put('/opportunities/:id', async (req, res) => {
  const client = await getClient();
  try {
    const { id } = req.params;
    const opp = req.body;

    await client.query('BEGIN');

    // 1. Lock opportunity row for update
    const lockRes = await client.query('SELECT id, total_seats FROM opportunities WHERE id = $1 FOR UPDATE', [id]);
    if (lockRes.rows.length === 0) {
      await client.query('ROLLBACK');
      return res.status(404).json({ error: 'Opportunity not found' });
    }

    // 2. Concurrency-Safe Check: Total seats cannot be reduced below existing confirmed allocations
    const newTotalSeats = opp.totalSeats !== undefined ? parseInt(opp.totalSeats, 10) : lockRes.rows[0].total_seats;
    const allocCountRes = await client.query(
      'SELECT COUNT(*)::int AS count FROM opportunity_seat_allocations WHERE opportunity_id = $1',
      [id]
    );
    const existingAllocations = allocCountRes.rows[0].count;

    if (newTotalSeats < existingAllocations) {
      await client.query('ROLLBACK');
      return res.status(409).json({
        error: `Cannot reduce total seats to ${newTotalSeats}. There are already ${existingAllocations} confirmed seat allocations.`,
      });
    }

    const minAttendance = opp.minAttendancePercentage !== undefined ? parseFloat(opp.minAttendancePercentage) : undefined;
    const minGrade = opp.minGpa !== undefined ? parseFloat(opp.minGpa) : undefined;

    const updateRes = await client.query(
      `UPDATE opportunities SET
        title = COALESCE($1, title),
        provider = COALESCE($2, provider),
        category = COALESCE($3, category),
        benefits_summary = COALESCE($4, benefits_summary),
        annual_value_inr = COALESCE($5, annual_value_inr),
        deadline = COALESCE($6, deadline),
        description = COALESCE($7, description),
        total_seats = $8,
        min_attendance_percentage = COALESCE($9, min_attendance_percentage),
        min_grade_value = COALESCE($10, min_grade_value),
        max_annual_income_inr = COALESCE($11, max_annual_income_inr),
        updated_at = NOW()
       WHERE id = $12
       RETURNING *;`,
      [
        opp.title,
        opp.provider,
        opp.category,
        opp.benefitsSummary,
        opp.annualValueNumeric !== undefined ? parseFloat(opp.annualValueNumeric) : undefined,
        opp.deadline,
        opp.description,
        newTotalSeats,
        minAttendance,
        minGrade,
        opp.maxHouseholdIncome !== undefined ? parseFloat(opp.maxHouseholdIncome) : undefined,
        id,
      ]
    );

    // Audit log
    await client.query(
      'INSERT INTO audit_logs (admin_id, action, target_entity, target_id, details) VALUES ($1, $2, $3, $4, $5)',
      [req.user.userId, 'UPDATE_OPPORTUNITY', 'opportunities', id, JSON.stringify({ totalSeats: newTotalSeats })]
    );

    await client.query('COMMIT');
    return res.json(mapDbOpportunity(updateRes.rows[0]));
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('[Update Opp Error]', err.message);
    return res.status(500).json({ error: 'Failed to update opportunity record' });
  } finally {
    client.release();
  }
});

// PATCH /api/admin/opportunities/:id/verify (Update Verification Status)
router.patch('/opportunities/:id/verify', async (req, res) => {
  try {
    const { id } = req.params;
    const { status, auditNotes } = req.body;

    if (!['Verified', 'Pending Review', 'Expired'].includes(status)) {
      return res.status(400).json({ error: 'Invalid verification status' });
    }

    const verifiedBy = `Admin Desk (${req.user.email}) · ${auditNotes || 'Audit Approved'}`;

    const updateRes = await query(
      `UPDATE opportunities SET
        verification_status = $1,
        verified_date = CURRENT_DATE,
        verified_by = $2,
        updated_at = NOW()
       WHERE id = $3
       RETURNING *;`,
      [status, verifiedBy, id]
    );

    if (updateRes.rows.length === 0) {
      return res.status(404).json({ error: 'Opportunity not found' });
    }

    // Audit log
    await query(
      'INSERT INTO audit_logs (admin_id, action, target_entity, target_id, details) VALUES ($1, $2, $3, $4, $5)',
      [req.user.userId, 'VERIFY_OPPORTUNITY', 'opportunities', id, JSON.stringify({ status, notes: auditNotes })]
    );

    return res.json(mapDbOpportunity(updateRes.rows[0]));
  } catch (err) {
    console.error('[Verify Opp Error]', err.message);
    return res.status(500).json({ error: 'Failed to update verification status' });
  }
});

// PATCH /api/admin/opportunities/:id/archive (Default Safe Deletion Mechanism)
router.patch('/opportunities/:id/archive', async (req, res) => {
  try {
    const { id } = req.params;

    const resCheck = await query('SELECT archived, title FROM opportunities WHERE id = $1', [id]);
    if (resCheck.rows.length === 0) {
      return res.status(404).json({ error: 'Opportunity not found' });
    }

    const newArchived = !resCheck.rows[0].archived;

    const updateRes = await query(
      'UPDATE opportunities SET archived = $1, updated_at = NOW() WHERE id = $2 RETURNING *;',
      [newArchived, id]
    );

    // Audit log
    await query(
      'INSERT INTO audit_logs (admin_id, action, target_entity, target_id, details) VALUES ($1, $2, $3, $4, $5)',
      [req.user.userId, newArchived ? 'ARCHIVE_OPPORTUNITY' : 'RESTORE_OPPORTUNITY', 'opportunities', id, JSON.stringify({ archived: newArchived })]
    );

    return res.json(mapDbOpportunity(updateRes.rows[0]));
  } catch (err) {
    console.error('[Archive Opp Error]', err.message);
    return res.status(500).json({ error: 'Failed to toggle archive state' });
  }
});

// POST /api/admin/opportunities/:id/allocate (Concurrency-Safe Seat Allocation)
router.post('/opportunities/:id/allocate', async (req, res) => {
  const client = await getClient();
  try {
    const { id } = req.params;
    const { studentId, notes } = req.body;

    if (!studentId) {
      return res.status(400).json({ error: 'studentId is required' });
    }

    await client.query('BEGIN');

    // 1. Lock opportunity row for update
    const oppRes = await client.query(
      'SELECT id, total_seats, archived FROM opportunities WHERE id = $1 FOR UPDATE',
      [id]
    );

    if (oppRes.rows.length === 0) {
      await client.query('ROLLBACK');
      return res.status(404).json({ error: 'Opportunity not found' });
    }

    const opp = oppRes.rows[0];
    if (opp.archived) {
      await client.query('ROLLBACK');
      return res.status(400).json({ error: 'Cannot allocate seats for an archived opportunity' });
    }

    // 2. Count existing confirmed allocations under lock
    const allocCountRes = await client.query(
      'SELECT COUNT(*)::int AS count FROM opportunity_seat_allocations WHERE opportunity_id = $1',
      [id]
    );
    const confirmedCount = allocCountRes.rows[0].count;

    if (confirmedCount >= opp.total_seats) {
      await client.query('ROLLBACK');
      return res.status(409).json({
        error: `Seat capacity of ${opp.total_seats} reached. No available seats remain.`,
        totalSeats: opp.total_seats,
        confirmedSeats: confirmedCount,
        availableSeats: 0,
      });
    }

    // 3. Insert allocation
    const insertRes = await client.query(
      `INSERT INTO opportunity_seat_allocations (opportunity_id, student_id, allocated_by, notes)
       VALUES ($1, $2, $3, $4)
       RETURNING *;`,
      [id, studentId, req.user.userId, notes || 'Confirmed by Admin Desk']
    );

    // 4. Audit log
    await client.query(
      'INSERT INTO audit_logs (admin_id, action, target_entity, target_id, details) VALUES ($1, $2, $3, $4, $5)',
      [req.user.userId, 'CONFIRM_SEAT_ALLOCATION', 'opportunity_seat_allocations', id, JSON.stringify({ studentId, allocationId: insertRes.rows[0].id })]
    );

    await client.query('COMMIT');

    return res.status(201).json({
      message: 'Seat allocated successfully',
      allocation: insertRes.rows[0],
      totalSeats: opp.total_seats,
      confirmedSeats: confirmedCount + 1,
      availableSeats: opp.total_seats - (confirmedCount + 1),
    });
  } catch (err) {
    await client.query('ROLLBACK');
    if (err.code === '23505') {
      return res.status(409).json({ error: 'Student already has a confirmed seat allocation for this opportunity' });
    }
    console.error('[Seat Allocation Error]', err.message);
    return res.status(500).json({ error: 'Failed to allocate seat' });
  } finally {
    client.release();
  }
});

export default router;
