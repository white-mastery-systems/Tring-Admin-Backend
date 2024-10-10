export const llmConfigurationValidation = toTypedSchema(
  z.object({
    provider: z
      .string({ required_error: "provider is required" })
      .min(1, "provider is required"),
    model: z
      .string({ required_error: "model is required" })
      .min(1,"model is required"),
    tokens: z
      .string({ required_error: "tokens is required" })
      .min(1,"tokens is required"),
    temperature: z
      .number({ required_error: "number is required" })
      .min(0,"Temperature minumum value should be zero"),
    role: z
      .string({
        required_error: "role is required",
      })
      .min(1, "role is required",)
      .default("Assist customers with their questions and issues."),
    guide: z
      .string({
        required_error: "guide is required",
      })
      .min(1,"guide is required")
      .optional(),
    domainRules: z
      .string({
        required_error: "guide is required",
      })
      .min(1,"guide is required")
      .optional(),
    instruction: z
      .string({
        required_error: "instruction is required",
      }).optional(),
    notes: z
      .string({
        required_error: "notes is required",
      })
      .optional(),
  }),
);
