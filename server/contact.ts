type ContactBody = { name?: unknown; email?: unknown; message?: unknown };

const json = (status: number, payload: Record<string, unknown>): Response =>
  new Response(JSON.stringify(payload), {
    status,
    headers: { "Content-Type": "application/json" },
  });

// A permissive shape check, not RFC 5322: something@something.tld.
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: Request): Promise<Response> {
  let body: ContactBody;
  try {
    body = (await request.json()) as ContactBody;
  } catch {
    return json(400, { error: "Body must be JSON." });
  }

  // Validate here, on the server. The client cannot be trusted, and every
  // client you ever add gets the same rules for free.
  const name = typeof body.name === "string" ? body.name.trim() : "";
  const email = typeof body.email === "string" ? body.email.trim() : "";
  const message = typeof body.message === "string" ? body.message.trim() : "";

  if (!name) return json(400, { error: "Name is required." });
  if (!email || !EMAIL.test(email)) return json(400, { error: "Enter a valid email address." });
  if (!message) return json(400, { error: "Message cannot be empty." });

  return json(200, { ok: true, message: `Thanks, ${name} — message received.` });
}
