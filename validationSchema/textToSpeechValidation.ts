export const textToSpeechValidation = z
  .object({
    provider: z.string().min(1, "Provider is required"),
    language: z.string().min(1, "Language is required").optional(),
    pitch: z.string().min(1, "Pitch is required").optional(),
    voiceType: z.string().min(1, "Voice Type is required").optional(),
    speakingRate: z.string().min(1, "Speaking Rate is required").optional(),
    volumeGrainDb: z.string().min(1, "Volume Grain db is required").optional(),
    stability: z.string().min(1, "stability is required").optional(),
    similarityBoost: z
      .string()
      .min(1, "Similarity Boost is required")
      .optional(),
    style: z.string().min(1, "Style is required").optional(),
    useSpeakerBoost: z
      .string()
      .min(1, "Use Speaker Boost is required")
      .optional(),
    voice: z.string().min(1, "Voice is required").optional(),
    // voiceType: z.string().min(1, "provider is required"),
  })

