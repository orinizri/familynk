import { z } from "zod";

export const registerUserSchema = z.object({
  email: z.email(),
  password: z.string().min(6),
  first_name: z.string(),
  last_name: z.string(),
  date_of_birth: z.string(), // ISO format
  photo_url: z.url().optional(),
  role: z.enum(["user", "admin"]).default("user"),
});

export type RegisterUserSchema = z.infer<typeof registerUserSchema>;
