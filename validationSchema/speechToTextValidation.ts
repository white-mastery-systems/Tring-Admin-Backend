export const speechToTextValidation = z.object({
  provider: z.string({required_error: "provider is required"}).min(1, "provider is required"),
  language: z.string({required_error: "language is required"}).min(1, "language is required"),
  adaptation: z.string().optional(),
  amplification_factor: z.string().optional(),
  model: z.string().optional(),
  phraseSets:z.array(z.string()).optional()
});
