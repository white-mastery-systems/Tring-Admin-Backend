export const speechToTextValidation = z.object({
  provider: z.string({required_error: "provider is required"}).min(1, "provider is required"),
  language: z.string({required_error: "language is required"}).min(1, "language is required"),
  adaptation: z.string().optional(),
  amplification_factor: z.string().optional(),
  model: z.string().optional(),
  phraseSets:z.array(z.string()).optional(),
  keywords:z.array(z.string()).optional(),

  amplificationFactor:z.number({required_error: "amplificationFactor is required"}).min(0, "amplificationFactor is required").max(4, "amplificationFactor is required").optional(),
  utteranceEndMs:z.number({required_error:"utteranceEndMs is required"}).min(0, "utteranceEndMs is required").max(5000, "utteranceEndMs is required").optional(),
  endpointing:z.number({ required_error:"endpointing is required"}).min(0, "endpointing is required").max(5000, "endpointing is required").optional(),
});
