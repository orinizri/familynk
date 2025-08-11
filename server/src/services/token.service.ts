// src/tokens/token.service.ts
import { PoolClient } from "pg";
import pool from "../db/db";
import { genRandomToken, sha256Hex } from "../utils/crypto";
import {
  CRYPTO_RANDOM_BITS,
  EMAIL_VERIFY_TTL_HOURS,
  VERIFY_BASE_URL,
} from "../config/env";

type Purpose = "email_verify" | "password_reset" | "email_change";

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
    // Optional: invalidate previous un-used tokens for this purpose
    await client.query(
      `DELETE FROM verification_tokens
       WHERE user_id = $1 AND purpose = $2 AND used_at IS NULL`,
      [opts.userId, "email_verify"]
    );

    await client.query(
      `INSERT INTO verification_tokens (user_id, purpose, token_hash, expires_at, created_ip, created_ua)
       VALUES ($1, $2, $3, ${expiresAtSql}, $4, $5)`,
      [opts.userId, opts.purpose, hash, opts.ip ?? null, opts.ua ?? null]
    );

    // This is the link you email (raw token in query string)
    const link = `${VERIFY_BASE_URL}/verify-email?token=${raw}`;
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
