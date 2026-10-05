// Diagnostic endpoint for the contact form. Reports whether each env var is set,
// without ever revealing its value. Safe to leave in — it leaks no secrets.
export const dynamic = "force-dynamic";

export async function GET() {
  const check = (name: string) => Boolean(process.env[name]?.trim());
  return Response.json({
    RESEND_API_KEY: check("RESEND_API_KEY"),
    CONTACT_TO: check("CONTACT_TO"),
    OWNER_EMAIL: check("OWNER_EMAIL"),
    CONTACT_FROM: check("CONTACT_FROM"),
    willForward: check("RESEND_API_KEY") && (check("CONTACT_TO") || check("OWNER_EMAIL")),
  });
}
