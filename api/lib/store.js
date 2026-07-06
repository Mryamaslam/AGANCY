import { getSupabase } from './supabase.js';

const DEFAULT_EMAIL_SETTINGS = {
  notificationEmail: 'info@marketmakers.dev',
  emailjsServiceId: '',
  emailjsTemplateId: '',
  emailjsPublicKey: '',
  enabled: false
};

function rowToSubmission(row) {
  return {
    id: row.id,
    timestamp: row.created_at,
    name: row.name,
    email: row.email,
    message: row.message || ''
  };
}

function rowToEmailSettings(row) {
  if (!row) return { ...DEFAULT_EMAIL_SETTINGS };
  return {
    notificationEmail: row.notification_email || DEFAULT_EMAIL_SETTINGS.notificationEmail,
    emailjsServiceId: row.emailjs_service_id || '',
    emailjsTemplateId: row.emailjs_template_id || '',
    emailjsPublicKey: row.emailjs_public_key || '',
    enabled: Boolean(row.enabled)
  };
}

export function newSubmissionId() {
  return 'sub_' + Date.now().toString(36) + '_' + Math.random().toString(36).slice(2, 8);
}

export async function listSubmissions() {
  const { data, error } = await getSupabase()
    .from('submissions')
    .select('id, created_at, name, email, message')
    .order('created_at', { ascending: false });

  if (error) throw new Error(error.message);
  return (data || []).map(rowToSubmission);
}

export async function createSubmission(submission) {
  const { data, error } = await getSupabase()
    .from('submissions')
    .insert({
      id: submission.id,
      name: submission.name,
      email: submission.email,
      message: submission.message,
      created_at: submission.timestamp
    })
    .select('id, created_at, name, email, message')
    .single();

  if (error) throw new Error(error.message);
  return rowToSubmission(data);
}

export async function deleteSubmission(id) {
  const { data, error } = await getSupabase()
    .from('submissions')
    .delete()
    .eq('id', id)
    .select('id');

  if (error) throw new Error(error.message);
  return (data || []).length > 0;
}

export async function clearSubmissions() {
  const { error } = await getSupabase()
    .from('submissions')
    .delete()
    .like('id', 'sub_%');

  if (error) throw new Error(error.message);
}

export async function getEmailSettings() {
  const { data, error } = await getSupabase()
    .from('email_settings')
    .select('*')
    .eq('id', 1)
    .maybeSingle();

  if (error) throw new Error(error.message);
  return rowToEmailSettings(data);
}

export async function updateEmailSettings(settings) {
  const current = await getEmailSettings();
  const next = {
    id: 1,
    notification_email: String(settings.notificationEmail || '').trim() || current.notificationEmail,
    emailjs_service_id: String(settings.emailjsServiceId ?? current.emailjsServiceId).trim(),
    emailjs_template_id: String(settings.emailjsTemplateId ?? current.emailjsTemplateId).trim(),
    emailjs_public_key: String(settings.emailjsPublicKey ?? current.emailjsPublicKey).trim(),
    enabled: settings.enabled !== undefined ? Boolean(settings.enabled) : current.enabled
  };

  const { data, error } = await getSupabase()
    .from('email_settings')
    .upsert(next, { onConflict: 'id' })
    .select('*')
    .single();

  if (error) throw new Error(error.message);
  return rowToEmailSettings(data);
}
