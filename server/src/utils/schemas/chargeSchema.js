import { z } from "zod";

export const ChargeSchema = z.object({
  special_product_assignment_id: z.number(),
  active: z.boolean(),
  amount: z.number(),
});
export const ChargesArray = z.array(ChargeSchema);
