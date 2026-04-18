/**
 * Auth.js / NextAuth HTTP entry (App Router).
 *
 * Providers (Credentials, OAuth, …) are NOT configured here — they live in
 * `src/config/auth.js` inside `NextAuth({ providers: [...] })`.
 *
 * This file only re-exports the framework handlers so requests hit:
 *   /api/auth/* →  sign-in, callback, session, CSRF, etc.
 */
import { handlers } from "@/config/auth";

/** Mongoose + bcrypt in `authorize` need Node, not Edge. */
export const runtime = "nodejs";

export const { GET, POST } = handlers;
