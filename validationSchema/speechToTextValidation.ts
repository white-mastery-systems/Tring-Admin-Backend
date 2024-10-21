export const speechToTextValidation = z.object({
  provider: z.string({required_error: "provider is required"}).min(1, "provider is required"),
  language: z.string({required_error: "language is required"}).min(1, "language is required"),
  adaptation: z.string().optional(),
  model: z.string().optional(),
  phraseSets:z.array(z.any()).optional(),
  keywords:z.array(z.any()).optional(),
  amplificationFactor:z.string({required_error: "amplificationFactor is required"}).optional(),
  utteranceEndMs:z.string({required_error:"utteranceEndMs is required"}).optional(),
  endpointing: z
    .number({ required_error: "endpointing is required" })
    .min(0, "endpointing must be a positive number")
    .optional(),
});
