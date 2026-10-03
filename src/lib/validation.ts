// Small hand-rolled validators shared by the API routes. Each returns either
// cleaned data or a map of field -> error message the form can show inline.

export type Result<T> =
  | { ok: true; data: T }
  | { ok: false; errors: Record<string, string> };

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

function str(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

export function validateEmail(value: unknown): Result<string> {
  const email = str(value).toLowerCase();
  if (!email) return { ok: false, errors: { email: "Please enter your email address." } };
  if (email.length > 254 || !EMAIL_RE.test(email))
    return { ok: false, errors: { email: "That doesn't look like a valid email address." } };
  return { ok: true, data: email };
}

export function validateContact(
  input: Record<string, unknown>,
): Result<{ name: string; email: string; body: string }> {
  const errors: Record<string, string> = {};
  const name = str(input.name);
  const body = str(input.message);

  if (!name) errors.name = "Please tell me your name.";
  else if (name.length > 100) errors.name = "That name is a little long (100 characters max).";

  const email = validateEmail(input.email);
  if (!email.ok) Object.assign(errors, email.errors);

  if (body.length < 10) errors.message = "Your message needs at least 10 characters.";
  else if (body.length > 5000) errors.message = "Please keep it under 5,000 characters.";

  if (Object.keys(errors).length > 0) return { ok: false, errors };
  return { ok: true, data: { name, email: (email as { data: string }).data, body } };
}

export type ProjectInput = {
  title: string;
  summary: string;
  year: number;
  tags: string[];
  featured: boolean;
};

export function validateProject(input: Record<string, unknown>, now = new Date()): Result<ProjectInput> {
  const errors: Record<string, string> = {};
  const title = str(input.title);
  const summary = str(input.summary);
  const year = Number(str(input.year));
  const tags = str(input.tags)
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean);

  if (!title) errors.title = "Give the project a title.";
  else if (title.length > 100) errors.title = "Keep the title under 100 characters.";

  if (summary.length < 10) errors.summary = "Write at least a sentence (10+ characters).";
  else if (summary.length > 600) errors.summary = "Keep the description under 600 characters.";

  if (!Number.isInteger(year) || year < 1990 || year > now.getFullYear() + 1)
    errors.year = `Enter a year between 1990 and ${now.getFullYear() + 1}.`;

  if (tags.length > 8) errors.tags = "Use at most 8 tags.";
  else if (tags.some((t) => t.length > 30)) errors.tags = "Each tag must be 30 characters or fewer.";

  if (Object.keys(errors).length > 0) return { ok: false, errors };
  const featured = input.featured === true || input.featured === "on" || input.featured === "true";
  return { ok: true, data: { title, summary, year, tags, featured } };
}
