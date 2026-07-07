import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const STORE_PATH = process.env.VERCEL
  ? path.join('/tmp', 'agency-store.json')
  : path.join(__dirname, '..', 'data', 'store.json');

const DEFAULT_EMAIL_SETTINGS = {
  notificationEmail: 'info@marketmakers.dev',
  emailjsServiceId: '',
  emailjsTemplateId: '',
  emailjsPublicKey: '',
  enabled: false
};

async function readStore() {
  try {
    const raw = await fs.readFile(STORE_PATH, 'utf8');
    const data = JSON.parse(raw);
    return {
      submissions: Array.isArray(data.submissions) ? data.submissions : [],
      emailSettings: { ...DEFAULT_EMAIL_SETTINGS, ...(data.emailSettings || {}) }
    };
  } catch (err) {
    if (err.code === 'ENOENT') {
      return { submissions: [], emailSettings: { ...DEFAULT_EMAIL_SETTINGS } };
    }
    throw err;
  }
}

async function writeStore(data) {
  await fs.mkdir(path.dirname(STORE_PATH), { recursive: true });
  await fs.writeFile(STORE_PATH, JSON.stringify(data, null, 2), 'utf8');
}

export function newSubmissionId() {
  return 'sub_' + Date.now().toString(36) + '_' + Math.random().toString(36).slice(2, 8);
}

export async function listSubmissions() {
  const store = await readStore();
  return store.submissions
    .slice()
    .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
}

export async function createSubmission(submission) {
  const store = await readStore();
  store.submissions.unshift(submission);
  await writeStore(store);
  return submission;
}

export async function deleteSubmission(id) {
  const store = await readStore();
  const before = store.submissions.length;
  store.submissions = store.submissions.filter((s) => s.id !== id);
  if (store.submissions.length === before) return false;
  await writeStore(store);
  return true;
}

export async function clearSubmissions() {
  const store = await readStore();
  store.submissions = [];
  await writeStore(store);
}

export async function getEmailSettings() {
  const store = await readStore();
  return { ...DEFAULT_EMAIL_SETTINGS, ...store.emailSettings };
}

export async function updateEmailSettings(settings) {
  const store = await readStore();
  const current = store.emailSettings;
  store.emailSettings = {
    notificationEmail: String(settings.notificationEmail || '').trim() || current.notificationEmail,
    emailjsServiceId: String(settings.emailjsServiceId ?? current.emailjsServiceId).trim(),
    emailjsTemplateId: String(settings.emailjsTemplateId ?? current.emailjsTemplateId).trim(),
    emailjsPublicKey: String(settings.emailjsPublicKey ?? current.emailjsPublicKey).trim(),
    enabled: settings.enabled !== undefined ? Boolean(settings.enabled) : current.enabled
  };
  await writeStore(store);
  return store.emailSettings;
}
