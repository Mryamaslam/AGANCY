export async function sendNotificationEmail(settings, submission) {
  if (!settings.enabled) return { sent: false, reason: 'notifications_disabled' };

  const { emailjsServiceId, emailjsTemplateId, emailjsPublicKey, notificationEmail } = settings;
  if (!emailjsServiceId || !emailjsTemplateId || !emailjsPublicKey) {
    return { sent: false, reason: 'emailjs_not_configured' };
  }

  const body = {
    service_id: emailjsServiceId,
    template_id: emailjsTemplateId,
    user_id: emailjsPublicKey,
    template_params: {
      to_email: notificationEmail,
      from_email: submission.email,
      from_name: submission.name || 'Website Visitor',
      message: submission.message || submission.email,
      reply_to: submission.email
    }
  };

  const res = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  });

  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error('EmailJS error: ' + (text || res.status));
  }

  return { sent: true };
}
