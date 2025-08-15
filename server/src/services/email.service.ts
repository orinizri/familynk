// src/tokens/token.service.ts
import { PoolClient } from "pg";
import pool from "../db/db";
import { genRandomToken, sha256Hex } from "../utils/crypto";
import {
  CLIENT_URL,
  CRYPTO_RANDOM_BITS,
  EMAIL_VERIFY_TTL_HOURS,
} from "../config/env";
import { sendVerificationEmail } from "../utils/mailer";

type Purpose = "email_verify" | "password_reset" | "email_change";
type ResendMeta = { ip?: string | null; ua?: string | null };

export async function issueVerificationToken(opts: {
  userId: string;
  purpose: Purpose;
  ip?: string | null;
  ua?: string | null;
  tx?: PoolClient; // optional transaction
}) {
  const raw = genRandomToken(CRYPTO_RANDOM_BITS);
  const hash = sha256Hex(raw);

  const expiresAtSql = `now() + interval '${EMAIL_VERIFY_TTL_HOURS} hours'`;
  const client = opts.tx ?? (await pool.connect());
  const release = opts.tx ? () => {} : () => client.release();

  try {
    // Remove previous un-used tokens for this purpose
    await client.query(
      `DELETE FROM verification_tokens
       WHERE user_id = $1 AND purpose = $2 AND used_at IS NULL`,
      [opts.userId, "email_verify"]
    );

    // Create new token
    await client.query(
      `INSERT INTO verification_tokens (user_id, purpose, token_hash, expires_at, created_ip, created_ua)
       VALUES ($1, $2, $3, ${expiresAtSql}, $4, $5)`,
      [opts.userId, opts.purpose, hash, opts.ip ?? null, opts.ua ?? null]
    );

    // This is the link you email (raw token in query string)
    const link = `${CLIENT_URL}/verify-email?token=${raw}`;
    return { rawToken: raw, link };
  } finally {
    release();
  }
}

export async function verifyEmailToken(rawToken: string) {
  const hash = sha256Hex(rawToken);
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    const { rows } = await client.query(
      `SELECT vt.id, vt.user_id, vt.expires_at, vt.used_at, u.email_verified
         FROM verification_tokens vt
         JOIN users u ON u.id = vt.user_id
        WHERE vt.token_hash = $1
          AND vt.purpose = 'email_verify'
        FOR UPDATE`,
      [hash]
    );

    if (rows.length === 0) {
      await client.query("ROLLBACK");
      return { ok: false, reason: "invalid" as const };
    }

    const t = rows[0] as {
      id: string;
      user_id: string;
      expires_at: string;
      used_at: string | null;
      email_verified: boolean;
    };

    if (t.used_at) {
      await client.query("ROLLBACK");
      return { ok: false, reason: "used" as const };
    }
    if (new Date(t.expires_at).getTime() <= Date.now()) {
      await client.query("ROLLBACK");
      return { ok: false, reason: "expired" as const };
    }

    await client.query(
      `UPDATE verification_tokens SET used_at = now() WHERE id = $1`,
      [t.id]
    );
    await client.query(
      `UPDATE users SET email_verified = true, email_verified_at = now() WHERE id = $1`,
      [t.user_id]
    );

    await client.query("COMMIT");
    return { ok: true as const, userId: t.user_id };
  } catch (e) {
    await client.query("ROLLBACK");
    throw e;
  } finally {
    client.release();
  }
}
// RESEND HELPER
async function countRecentVerificationSends(
  userId: string,
  hours = 24
): Promise<number> {
  const { rows } = (await pool.query(
    `SELECT count(*)::int AS cnt
       FROM verification_tokens
      WHERE user_id = $1
        AND purpose = 'email_verify'
        AND created_at > now() - ($2 || ' hours')::interval`,
    [userId, String(hours)]
  )) as { rows: { cnt: number }[] };
  console.log("countRecentVerificationSends rows:", rows);
  return rows[0].cnt;
}

export async function resendVerificationByEmail(
  emailRaw: string,
  meta?: ResendMeta
) {
  const email = emailRaw.trim().toLowerCase();

  const { rows } = (await pool.query(
    `SELECT id, email_verified FROM users WHERE email = $1`,
    [email]
  )) as { rows: { id: string; email_verified: boolean }[] };
  // Enumeration‑safe: behave the same even if user not found or already verified
  if (rows.length === 0 || rows[0].email_verified) {
    return { sent: false, enumerationsafe: true };
  }

  const userId: string = rows[0].id;

  // Rate limit per user
  const recent = await countRecentVerificationSends(userId, 24);
  if (recent >= 3) return { rateLimited: true as const };

  const { link } = await issueVerificationToken({
    userId,
    purpose: "email_verify",
    ip: meta?.ip ?? null,
    ua: meta?.ua ?? null,
  });
  await sendVerificationEmail(email, link);

  return { sent: true as const };
}

export async function resendVerificationForUserId(
  userId: string,
  meta?: ResendMeta
) {
  // Ensure user exists & not verified
  const { rows } = (await pool.query(
    `SELECT email, email_verified FROM users WHERE id = $1`,
    [userId]
  )) as { rows: { email: string; email_verified: boolean }[] };
  if (rows.length === 0) return { notFound: true as const };
  if (rows[0].email_verified) return { alreadyVerified: true as const };

  const recent = await countRecentVerificationSends(userId, 24);
  if (recent >= 3) return { rateLimited: true as const };

  const { link } = await issueVerificationToken({
    userId,
    purpose: "email_verify",
    ip: meta?.ip ?? null,
    ua: meta?.ua ?? null,
  });
  await sendVerificationEmail(rows[0].email, link);

  return { sent: true as const };
}
