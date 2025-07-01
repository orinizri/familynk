import { z } from "zod";

export const AssignmentSchema = z.object({
  id: z.number(),
  reservation_uuid: z.string().uuid(),
  name: z.string(),
});
export const AssignmentsArray = z.array(AssignmentSchema);
