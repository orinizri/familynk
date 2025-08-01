import { z } from "zod";


export const registerUserSchema = z.object({
  email: z.email(),
  password: z.string().min(6),
  first_name: z.string(),
  last_name: z.string(),
  date_of_birth: z.string(), // ISO format
  photo_url: z.url().optional(),
  role: z.string().default("user"),
});

export type RegisterUserSchema = z.infer<typeof registerUserSchema>;

export const updateUserSchema = z.object({
  first_name: z.string().min(1, "First name is required").optional(),
  last_name: z.string().min(1, "Last name is required").optional(),
  date_of_birth: z
    .string()
    .optional()
    .refine(
      (val) => !val || !isNaN(Date.parse(val)),
      "Must be a valid ISO date string"
    ),
  photo_url: z.url("Must be a valid URL").nullable().optional(),
});

export type UpdateUserDTO = z.infer<typeof updateUserSchema>;
