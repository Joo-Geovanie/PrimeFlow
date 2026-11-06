import { cookies } from "next/headers";
import crypto from "crypto";
import type { AppRole } from "@/types/domain";
import { getInternalUsers } from "@/lib/data-store";
import { createPublicSupabaseClient, isSupabaseConfigured } from "@/lib/supabase/client";

export interface AuthenticatedSession {
  userId: string;
  email: string;
  fullName: string;
  title: string;
  role: AppRole;
  authMode: "SUPABASE_AUTH" | "LOCAL_DEV_CONSOLE";
}

const SESSION_COOKIE_NAME = "pf_internal_session";

function getSigningSecret(): string {
  return (
    process.env.PRIMEFLOW_SESSION_SECRET ||
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    "primeflow-industrial-rbac-dev-signing-key-2026"
  );
}

function signPayload(payloadJson: string): string {
  const b64 = Buffer.from(payloadJson, "utf-8").toString("base64url");
  const hmac = crypto
    .createHmac("sha256", getSigningSecret())
    .update(b64)
    .digest("base64url");
  return `${b64}.${hmac}`;
}

function verifySignedToken(token: string): Record<string, string> | null {
  const parts = token.split(".");
  if (parts.length !== 2) return null;
  const [b64, signature] = parts;
  const expected = crypto
    .createHmac("sha256", getSigningSecret())
    .update(b64)
    .digest("base64url");
  if (signature.length !== expected.length) return null;
  if (
    !crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expected))
  ) {
    return null;
  }
  try {
    return JSON.parse(Buffer.from(b64, "base64url").toString("utf-8"));
  } catch {
    return null;
  }
}

export async function getCurrentSession(): Promise<AuthenticatedSession | null> {
  const cookieStore = await cookies();
  const rawToken = cookieStore.get(SESSION_COOKIE_NAME)?.value;
  if (!rawToken) return null;

  const decoded = verifySignedToken(rawToken);
  if (!decoded || !decoded.email) return null;

  const users = await getInternalUsers();
  const matched = users.find(
    (u) => u.email.toLowerCase() === decoded.email.toLowerCase() && u.is_active
  );
  if (!matched) return null;

  return {
    userId: matched.id,
    email: matched.email,
    fullName: matched.full_name,
    title: matched.title,
    role: matched.role,
    authMode: (decoded.authMode as AuthenticatedSession["authMode"]) || "LOCAL_DEV_CONSOLE",
  };
}

export async function establishInternalSession(
  email: string,
  passwordOrCode: string
): Promise<{ ok: boolean; error?: string; session?: AuthenticatedSession }> {
  const normalizedEmail = email.trim().toLowerCase();
  const users = await getInternalUsers();
  const matchedUser = users.find(
    (u) => u.email.toLowerCase() === normalizedEmail
  );

  if (!matchedUser || !matchedUser.is_active) {
    return {
      ok: false,
      error:
        "Unauthorized account. Only invited PrimeFlow internal staff may access the operating console.",
    };
  }

  let authMode: AuthenticatedSession["authMode"] = "LOCAL_DEV_CONSOLE";

  if (isSupabaseConfigured()) {
    const supabase = createPublicSupabaseClient();
    if (supabase) {
      const { error } = await supabase.auth.signInWithPassword({
        email: normalizedEmail,
        password: passwordOrCode,
      });
      if (error) {
        return {
          ok: false,
          error: `Supabase authentication failed: ${error.message}`,
        };
      }
      authMode = "SUPABASE_AUTH";
    }
  } else {
    const expectedPasscode =
      process.env.PRIMEFLOW_DEV_PASSCODE || "PRIMEFLOW-2026";
    if (passwordOrCode !== expectedPasscode) {
      return {
        ok: false,
        error:
          "Invalid operator access key. In local workspace mode without live Supabase credentials, use operator access key PRIMEFLOW-2026.",
      };
    }
  }

  const session: AuthenticatedSession = {
    userId: matchedUser.id,
    email: matchedUser.email,
    fullName: matchedUser.full_name,
    title: matchedUser.title,
    role: matchedUser.role,
    authMode,
  };

  const token = signPayload(
    JSON.stringify({
      userId: session.userId,
      email: session.email,
      role: session.role,
      authMode: session.authMode,
      iat: String(Date.now()),
    })
  );

  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 12,
  });

  return { ok: true, session };
}

export async function clearInternalSession(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE_NAME);
}
