// export const speechToTextValidation = z.object({
//   provider: z.string({required_error: "provider is required"}).min(1, "provider is required"),
//   language: z.string({required_error: "language is required"}).min(1, "language is required"),
//   adaptation: z.string().optional(),
//   model: z.string().optional(),
//   phraseSets:z.array(z.any()).optional(),
//   keywords:z.array(z.any()).optional(),
//   amplificationFactor:z.string({required_error: "amplificationFactor is required"}).min(1, "amplificationFactor is required"),
//   utteranceEndMs:z.string({required_error:"utteranceEndMs is required"}).min(1, "utteranceEndMs is required"),
//   endpointing: z
//     .number({ required_error: "endpointing is required" })
//     .min(0, "endpointing must be a positive number")
//     .optional(),
// });

import { z } from 'zod';

export const speechToTextValidation = z.object({
  provider: z.string().min(1, "Provider is required"),
  language: z.string().min(1, "Language is required"),
  adaptation: z.boolean().optional(),
  model: z.string().optional(),
  amplificationFactor: z
    .number()
    .min(1, "Amplification Factor is required"),
  utteranceEndMs: z.string().optional(),
  endpointing: z
    .number()
    .min(0, "Endpointing must be a positive number")
    .optional(),
  keywords: z.array(z.object({
    value: z.string().optional(),
    boostValue: z.string().optional(),
  })).optional(),
  phraseSets: z.array(z.object({
    value: z.string().optional(),
  })).optional(),
}).refine((data) => {
  // Validation based on provider
  if (data.provider === 'deepgram') {
    // Make utteranceEndMs required for Deepgram
    return data.utteranceEndMs && data.utteranceEndMs.trim() !== '';
  }
  if (data.provider === 'google') {
    // Make adaptation and model required for Google
    return data.adaptation !== undefined &&
           data.model && data.model.trim() !== '';
  }
  // Other providers can have different requirements or no additional requirements
  return true; // No provider matched, validation passes
}, {
  message: "Invalid input based on selected provider",
  path: [] // No specific path to reference for this general message
});