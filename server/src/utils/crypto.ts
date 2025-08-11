// src/utils/crypto.ts
import { CRYPTO_HASH_TYPE, CRYPTO_RANDOM_BITS } from "../config/env";
import crypto from "crypto";

export function genRandomToken(bytes = CRYPTO_RANDOM_BITS): string {
  return crypto.randomBytes(bytes).toString("hex");
}

export function sha256Hex(input: string): Buffer {
  return crypto.createHash(CRYPTO_HASH_TYPE).update(input, "utf8").digest();
}

export function timingSafeEqual(a: Buffer, b: Buffer): boolean {
  if (a.length !== b.length) return false;
  return crypto.timingSafeEqual(a, b);
}
