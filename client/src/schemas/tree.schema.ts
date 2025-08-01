import { z } from "zod";

export const registerTreeSchema = z.object({
  name: z.string().min(1),
  user_id: z.string(),
  privacy: z.string().default("private"),
});

export type RegisterTreeSchema = z.infer<typeof registerTreeSchema>;
