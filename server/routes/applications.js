import express from 'express';
import crypto from 'crypto';
import { query } from '../db/index.js';
import { authenticateToken, requireStudent } from '../middleware/auth.js';

const router = express.Router();

function mapDbApplication(row) {
  return {
    id: row.id,
    opportunityId: row.opportunity_id,
    status: row.status,
    submissionDate: row.submission_date ? row.submission_date.toISOString().split('T')[0] : undefined,
    lastUpdated: row.last_updated ? row.last_updated.toISOString().split('T')[0] : '',
    missingDocuments: Array.isArray(row.missing_documents) 
      ? row.missing_documents 
      : (typeof row.missing_documents === 'string' ? JSON.parse(row.missing_documents) : []),
    completedDocuments: Array.isArray(row.completed_documents) 
      ? row.completed_documents 
      : (typeof row.completed_documents === 'string' ? JSON.parse(row.completed_documents) : []),
    nextAction: row.next_action || '',
    notes: row.notes || '',
  };
}

// GET /api/applications
router.get('/', authenticateToken, requireStudent, async (req, res) => {
  try {
    const result = await query(
      'SELECT * FROM applications WHERE user_id = $1 ORDER BY last_updated DESC',
      [req.user.userId]
    );
    return res.json(result.rows.map(mapDbApplication));
  } catch (err) {
    console.error('[Get Applications Error]', err.message);
    return res.status(500).json({ error: 'Failed to retrieve applications' });
  }
});

// POST /api/applications (Start or advance application)
router.post('/', authenticateToken, requireStudent, async (req, res) => {
  try {
    const { opportunityId, status } = req.body;
    if (!opportunityId) {
      return res.status(400).json({ error: 'opportunityId is required' });
    }

    const appStatus = status || 'Preparing Documents';

    // Fetch opportunity to initialize document checklist
    const oppRes = await query('SELECT required_documents, deadline FROM opportunities WHERE id = $1', [opportunityId]);
    if (oppRes.rows.length === 0) {
      return res.status(404).json({ error: 'Opportunity not found' });
    }

    const opp = oppRes.rows[0];
    const docs = Array.isArray(opp.required_documents) 
      ? opp.required_documents 
      : (typeof opp.required_documents === 'string' ? JSON.parse(opp.required_documents) : []);

    const completed = docs.slice(0, 1);
    const missing = docs.slice(1);
    const appId = `app-${Date.now()}-${crypto.randomBytes(3).toString('hex')}`;
    const nextAction = `Complete remaining required documents before ${opp.deadline ? opp.deadline.toISOString().split('T')[0] : 'deadline'}`;

    const submissionDate = appStatus === 'Submitted' ? new Date().toISOString().split('T')[0] : null;

    const insertRes = await query(
      `INSERT INTO applications (
        id, user_id, opportunity_id, status, submission_date, last_updated, missing_documents, completed_documents, next_action, notes
      ) VALUES ($1, $2, $3, $4, $5, CURRENT_DATE, $6, $7, $8, $9)
      ON CONFLICT (user_id, opportunity_id) 
      DO UPDATE SET status = EXCLUDED.status, 
                    submission_date = COALESCE(EXCLUDED.submission_date, applications.submission_date),
                    last_updated = CURRENT_DATE
      RETURNING *;`,
      [
        appId,
        req.user.userId,
        opportunityId,
        appStatus,
        submissionDate,
        JSON.stringify(missing),
        JSON.stringify(completed),
        nextAction,
        'Added via ScholarBridge Opportunity Navigator.',
      ]
    );

    return res.status(201).json(mapDbApplication(insertRes.rows[0]));
  } catch (err) {
    console.error('[Create Application Error]', err.message);
    return res.status(500).json({ error: 'Failed to create application record' });
  }
});

// PUT /api/applications/:id (Update status / notes)
router.put('/:id', authenticateToken, requireStudent, async (req, res) => {
  try {
    const { id } = req.params;
    const { status, notes, nextAction } = req.body;

    const submissionDate = status === 'Submitted' ? new Date().toISOString().split('T')[0] : undefined;

    const updateRes = await query(
      `UPDATE applications SET
        status = COALESCE($1, status),
        notes = COALESCE($2, notes),
        next_action = COALESCE($3, next_action),
        submission_date = COALESCE($4, submission_date),
        last_updated = CURRENT_DATE
       WHERE id = $5 AND user_id = $6
       RETURNING *;`,
      [status, notes, nextAction, submissionDate, id, req.user.userId]
    );

    if (updateRes.rows.length === 0) {
      return res.status(404).json({ error: 'Application record not found' });
    }

    return res.json(mapDbApplication(updateRes.rows[0]));
  } catch (err) {
    console.error('[Update Application Error]', err.message);
    return res.status(500).json({ error: 'Failed to update application' });
  }
});

// PUT /api/applications/:id/documents (Toggle document checklist)
router.put('/:id/documents', authenticateToken, requireStudent, async (req, res) => {
  try {
    const { id } = req.params;
    const { docName } = req.body;

    if (!docName) {
      return res.status(400).json({ error: 'docName is required' });
    }

    const appRes = await query('SELECT * FROM applications WHERE id = $1 AND user_id = $2', [id, req.user.userId]);
    if (appRes.rows.length === 0) {
      return res.status(404).json({ error: 'Application record not found' });
    }

    const app = appRes.rows[0];
    const completed = Array.isArray(app.completed_documents) ? app.completed_documents : JSON.parse(app.completed_documents || '[]');
    const missing = Array.isArray(app.missing_documents) ? app.missing_documents : JSON.parse(app.missing_documents || '[]');

    const isCompleted = completed.includes(docName);
    const newCompleted = isCompleted ? completed.filter((d) => d !== docName) : [...completed, docName];
    const newMissing = isCompleted ? [...missing, docName] : missing.filter((d) => d !== docName);

    const updateRes = await query(
      `UPDATE applications SET
        completed_documents = $1,
        missing_documents = $2,
        last_updated = CURRENT_DATE
       WHERE id = $3 AND user_id = $4
       RETURNING *;`,
      [JSON.stringify(newCompleted), JSON.stringify(newMissing), id, req.user.userId]
    );

    return res.json(mapDbApplication(updateRes.rows[0]));
  } catch (err) {
    console.error('[Update App Docs Error]', err.message);
    return res.status(500).json({ error: 'Failed to update document checklist' });
  }
});

export default router;
