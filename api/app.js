import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import {
  authMiddleware,
  signToken,
  validateAdminCredentials
} from './lib/auth.js';
import {
  listSubmissions,
  createSubmission,
  deleteSubmission,
  clearSubmissions,
  getEmailSettings,
  updateEmailSettings,
  newSubmissionId,
  getStorageMode
} from './lib/store.js';
import { sendNotificationEmail } from './lib/email.js';

dotenv.config();

const app = express();
const routes = express.Router();

app.use(cors({ origin: true }));
app.use(express.json({ limit: '100kb' }));

routes.get('/health', (_req, res) => {
  res.json({ ok: true, service: 'market-maker-agency-api', storage: getStorageMode() });
});

routes.post('/auth/login', async (req, res) => {
  try {
    const { username, password } = req.body || {};
    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password are required' });
    }

    const valid = await validateAdminCredentials(
      String(username).trim(),
      String(password)
    );
    if (!valid) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = signToken({ sub: username, role: 'admin' });
    res.json({
      token,
      expiresIn: '24h',
      user: { username: String(username).trim(), role: 'admin' }
    });
  } catch (err) {
    res.status(500).json({ error: err.message || 'Login failed' });
  }
});

routes.get('/auth/me', authMiddleware, (req, res) => {
  res.json({ user: { username: req.user.sub, role: req.user.role } });
});

routes.get('/submissions', authMiddleware, async (_req, res) => {
  try {
    const submissions = await listSubmissions();
    res.json(submissions);
  } catch (err) {
    res.status(500).json({ error: err.message || 'Failed to load submissions' });
  }
});

routes.post('/submissions', async (req, res) => {
  try {
    const { name, email, message } = req.body || {};
    const cleanEmail = String(email || '').trim().toLowerCase();
    if (!cleanEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
      return res.status(400).json({ error: 'Valid email is required' });
    }

    const submission = {
      id: newSubmissionId(),
      timestamp: new Date().toISOString(),
      name: String(name || '').trim() || 'Website Visitor',
      email: cleanEmail,
      message: String(message || '').trim() || 'Contact request from footer form'
    };

    await createSubmission(submission);

    let emailResult = { sent: false };
    try {
      const emailSettings = await getEmailSettings();
      emailResult = await sendNotificationEmail(emailSettings, submission);
    } catch (err) {
      emailResult = { sent: false, error: err.message };
    }

    res.status(201).json({ ok: true, id: submission.id, emailSent: emailResult.sent });
  } catch (err) {
    res.status(500).json({ error: err.message || 'Failed to save submission' });
  }
});

routes.delete('/submissions/:id', authMiddleware, async (req, res) => {
  try {
    const deleted = await deleteSubmission(req.params.id);
    if (!deleted) {
      return res.status(404).json({ error: 'Submission not found' });
    }
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ error: err.message || 'Delete failed' });
  }
});

routes.delete('/submissions', authMiddleware, async (_req, res) => {
  try {
    await clearSubmissions();
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ error: err.message || 'Clear failed' });
  }
});

routes.get('/email-settings', authMiddleware, async (_req, res) => {
  try {
    const settings = await getEmailSettings();
    res.json(settings);
  } catch (err) {
    res.status(500).json({ error: err.message || 'Failed to load settings' });
  }
});

routes.put('/email-settings', authMiddleware, async (req, res) => {
  try {
    const settings = await updateEmailSettings(req.body || {});
    res.json({ ok: true, settings });
  } catch (err) {
    res.status(500).json({ error: err.message || 'Failed to save settings' });
  }
});

routes.post('/email-settings/test', authMiddleware, async (_req, res) => {
  try {
    const emailSettings = await getEmailSettings();
    const result = await sendNotificationEmail(emailSettings, {
      name: 'Admin Test',
      email: 'test@marketmaker.local',
      message: 'This is a test notification from the Market Makers admin portal.'
    });
    if (!result.sent) {
      return res.status(400).json({ error: result.reason || 'Email not sent' });
    }
    res.json({ ok: true, message: 'Test email sent successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message || 'Test email failed' });
  }
});

// Vercel maps api/index.js to /api/* and passes paths without the /api prefix.
// Local dev (node api/server.js) uses full /api/* paths — mount both.
app.use('/api', routes);
app.use(routes);

app.use((_req, res) => {
  res.status(404).json({ error: 'Not found' });
});

export default app;
