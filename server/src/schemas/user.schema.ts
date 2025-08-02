import { z } from "zod";

export const registerUserSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  first_name: z.string(),
  last_name: z.string(),
  date_of_birth: z.string(), // ISO format
  photo_url: z.string().url().nullable(),
  role: z.enum(["user", "admin"]).default("user"),
});

export type RegisterUserSchema = z.infer<typeof registerUserSchema>;

export const updateUserSchema = z.object({
  first_name: z
    .string()
    .min(1, "First name must be at least 1 character long")
    .optional(),
  last_name: z
    .string()
    .min(1, "Last name must be at least 1 character long")
    .optional(),
  date_of_birth: z
    .string()
    .optional()
    .refine(
      (val) =>
        !val ||
        !isNaN(Date.parse(val)) ||
        new Date(val).getTime() > new Date().getTime(),
      "Must be a valid past date"
    ),
  photo_url: z.string().url("Must be a valid URL").nullable().optional(),
});

export type UpdateUserDTO = z.infer<typeof updateUserSchema>;
