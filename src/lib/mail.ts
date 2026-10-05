// Forwards contact-form messages to the owner by email, through Resend's HTTP API
// (https://resend.com/docs/api-reference/emails/send-email). Resend has a free tier
// that covers a personal portfolio comfortably. Configure with:
//   RESEND_API_KEY  — the API key from the Resend dashboard
//   CONTACT_TO      — where to deliver the message (defaults to OWNER_EMAIL)
//   CONTACT_FROM    — a verified sender address (defaults to onboarding@resend.dev,
//                     which only works for messages addressed to the account owner)
// If no key is configured, the function returns false and the API route keeps the
// stored copy so the message is never silently dropped.

type Message = { name: string; email: string; body: string };

export function emailConfigured() {
  return Boolean(process.env.RESEND_API_KEY);
}

function escapeHtml(s: string) {
  return s.replace(/[&<>"']/g, (c) =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!,
  );
}

export async function forwardContactMessage(message: Message) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return { ok: false as const, reason: "unconfigured" as const };
  const to = (process.env.CONTACT_TO || process.env.OWNER_EMAIL || "").trim();
  const from = process.env.CONTACT_FROM?.trim() || "Portfolio Contact <onboarding@resend.dev>";
  if (!to) return { ok: false as const, reason: "no-recipient" as const };

  const subject = `New contact from ${message.name}`;
  const bodyHtml = `
    <p><strong>From:</strong> ${escapeHtml(message.name)} &lt;${escapeHtml(message.email)}&gt;</p>
    <p style="white-space: pre-wrap">${escapeHtml(message.body)}</p>
  `.trim();
  const bodyText = `From: ${message.name} <${message.email}>\n\n${message.body}`;

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${apiKey}` },
      body: JSON.stringify({
        from,
        to: [to],
        reply_to: message.email,
        subject,
        html: bodyHtml,
        text: bodyText,
      }),
    });
    if (!res.ok) {
      const detail = await res.text().catch(() => "");
      return { ok: false as const, reason: "api-error" as const, status: res.status, detail };
    }
    return { ok: true as const };
  } catch (error) {
    return { ok: false as const, reason: "network" as const, error };
  }
}
