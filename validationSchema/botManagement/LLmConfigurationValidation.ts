export const lLmConfigurationValidation = toTypedSchema(
  z.object({
    provider: z
      .string({ required_error: "provider is required" })
      .min(1, { message: "provider is required" })
      .default("openai"),
    model: z
      .string({ required_error: "model is required" })
      .min(1, { message: "model is required" })
      .default("gpt-4o-mini"),
    tokens: z
      .string({ required_error: "tokens is required" })
      .min(1, { message: "tokens is required" })
      .default("2048"),
    temperature: z
      .number({ required_error: "number is required" })
      .min(0, { message: "Temperature minumum value should be zero" })
      .default(0),
    role: z
      .string({
        required_error: "role is required",
      })
      .min(1, {
        message: "role is required",
      })
      .default("Assist customers with their questions and issues."),
    guide: z
      .string({
        required_error: "guide is required",
      })
      .min(1, {
        message: "guide is required",
      })
      .optional(),
    domainRules: z
      .string({
        required_error: "guide is required",
      })
      .min(1, {
        message: "guide is required",
      })
      .optional(),
    instruction: z
      .string({
        required_error: "instruction is required",
      })
      .min(1, {
        message: "instruction is required",
      }),
    notes: z
      .string({
        required_error: "notes is required",
      })
      .min(1, {
        message: "notes is required",
      })
      .optional(),
  }),
);
