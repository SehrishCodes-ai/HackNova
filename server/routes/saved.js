import express from 'express';
import { query } from '../db/index.js';
import { authenticateToken, requireStudent } from '../middleware/auth.js';

const router = express.Router();

// GET /api/saved-opportunities
router.get('/', authenticateToken, requireStudent, async (req, res) => {
  try {
    const result = await query(
      'SELECT opportunity_id FROM saved_opportunities WHERE user_id = $1 ORDER BY created_at DESC',
      [req.user.userId]
    );
    const savedIds = result.rows.map((r) => r.opportunity_id);
    return res.json(savedIds);
  } catch (err) {
    console.error('[Saved Opps Error]', err.message);
    return res.status(500).json({ error: 'Failed to retrieve saved opportunities' });
  }
});

// POST /api/saved-opportunities/:opportunityId
router.post('/:opportunityId', authenticateToken, requireStudent, async (req, res) => {
  try {
    const { opportunityId } = req.params;

    await query(
      'INSERT INTO saved_opportunities (user_id, opportunity_id) VALUES ($1, $2) ON CONFLICT DO NOTHING',
      [req.user.userId, opportunityId]
    );

    return res.status(201).json({ message: 'Opportunity saved', opportunityId });
  } catch (err) {
    console.error('[Save Opp Error]', err.message);
    return res.status(500).json({ error: 'Failed to save opportunity' });
  }
});

// DELETE /api/saved-opportunities/:opportunityId
router.delete('/:opportunityId', authenticateToken, requireStudent, async (req, res) => {
  try {
    const { opportunityId } = req.params;

    await query(
      'DELETE FROM saved_opportunities WHERE user_id = $1 AND opportunity_id = $2',
      [req.user.userId, opportunityId]
    );

    return res.json({ message: 'Opportunity removed from saved list', opportunityId });
  } catch (err) {
    console.error('[Delete Saved Opp Error]', err.message);
    return res.status(500).json({ error: 'Failed to remove saved opportunity' });
  }
});

export default router;
