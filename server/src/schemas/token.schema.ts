import { z } from "zod";

// Email Verification Token Schema
export const TokenSchema = z.object({
  token: z.string().min(1, "Missing token"),
});
