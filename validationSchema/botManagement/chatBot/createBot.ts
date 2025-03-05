import { z } from "zod";
import { toTypedSchema } from "@vee-validate/zod";

export const botCreateSchema = toTypedSchema(
  z.object({
    name: z
      .string({ required_error: "Name must be at least 2 characters." })
      .min(2, "Name must be at least 2 characters."),
    companyName: z
      .string({
        required_error: "Company name must be at least 2 characters.",
      })
      .min(2, "Company name must be at least 2 characters."),
    industry: z
      .string({ required_error: "Industry type must be at least 2 characters." })
      .min(2, "Industry type must be at least 2 characters."),
    intent: z
      .array(z.string(), {
        required_error: "At least one intent must be selected.",
      })
      .min(1, "At least one intent must be selected."),
  })
);
