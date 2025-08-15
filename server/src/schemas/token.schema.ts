import { z } from "zod";

// Email Verification Token Schema
export const TokenSchema = z.object({
  token: z.string().min(1, "Missing token"),
});

export const EmailSchema = z.object({
  email: z.string().min(1, "Missing email").email("Invalid email format"),
});
