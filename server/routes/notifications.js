import express from 'express';
import { query } from '../db/index.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

function mapDbNotification(row) {
  return {
    id: row.id,
    title: row.title,
    message: row.message,
    timestamp: row.created_at ? row.created_at.toISOString().split('T')[0] : '',
    category: row.category,
    read: Boolean(row.read),
    relatedOpportunityId: row.related_opportunity_id || undefined,
    targetPage: row.target_page || undefined,
  };
}

// GET /api/notifications
router.get('/', authenticateToken, async (req, res) => {
  try {
    const result = await query(
      'SELECT * FROM notifications WHERE user_id = $1 ORDER BY created_at DESC',
      [req.user.userId]
    );
    return res.json(result.rows.map(mapDbNotification));
  } catch (err) {
    console.error('[Get Notifications Error]', err.message);
    return res.status(500).json({ error: 'Failed to retrieve notifications' });
  }
});

// PATCH /api/notifications/:id/read
router.patch('/:id/read', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    await query('UPDATE notifications SET read = TRUE WHERE id = $1 AND user_id = $2', [id, req.user.userId]);
    return res.json({ success: true, id });
  } catch (err) {
    console.error('[Mark Read Error]', err.message);
    return res.status(500).json({ error: 'Failed to mark notification as read' });
  }
});

// POST /api/notifications/mark-all-read
router.post('/mark-all-read', authenticateToken, async (req, res) => {
  try {
    await query('UPDATE notifications SET read = TRUE WHERE user_id = $1', [req.user.userId]);
    return res.json({ success: true, message: 'All notifications marked as read' });
  } catch (err) {
    console.error('[Mark All Read Error]', err.message);
    return res.status(500).json({ error: 'Failed to mark all notifications as read' });
  }
});

export default router;
