import { z } from "zod";

export const TreeSchema = z.object({
  id: z.string(),
  name: z.string().min(1, "Name required"),
  user_id: z.string(), // ✅ User ID assumed to be UUID
  privacy: z.enum(["public", "private"]).default("private"),
});

export const CreateTreeSchema = TreeSchema.omit({ id: true });
export const UpdateTreeSchema = TreeSchema.partial().omit({ id: true, user_id: true });

export type TreeDTO = z.infer<typeof TreeSchema>;
export type CreateTreeDTO = z.infer<typeof CreateTreeSchema>;
export type UpdateTreeDTO = z.infer<typeof UpdateTreeSchema>;