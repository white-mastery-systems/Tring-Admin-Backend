export const speechToTextValidation = z.object({
  provider: z.string().min(1, "provider is required"),
  language: z.string().min(1, "language is required"),
  adaptation: z.string().optional(),
  amplification_factor: z.string().optional(),
  model: z.string().optional(),
});
