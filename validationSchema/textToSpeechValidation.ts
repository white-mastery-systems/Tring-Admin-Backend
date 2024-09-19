export const textToSpeechValidation = z
  .object({
    provider: z.string().min(1, "Provider is required").optional(),
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
  .refine((data) => {
    if (data.provider === "google") {
      if (!data.language?.length) {
        return {
          message: "Language is required.",
          path: ["language"],
        };
      }
      if (!data.speakingRate?.length) {
        return {
          message: "Speaking Rate is required.",
          path: ["speakingRate"],
        };
      }
      if (!data.pitch?.length) {
        return {
          message: "Pitch Rate is required.",
          path: ["pitch"],
        };
      }
      if (!data.volumeGrainDb?.length) {
        return {
          message: "volume Grain Db Rate is required.",
          path: ["volumeGrainDb"],
        };
      }
    } else if (data.provider === "elevenlabs") {
      if (!data.stability?.length) {
        return {
          message: "Stability is required.",
          path: ["stability"],
        };
      }
      if (!data.similarityBoost?.length) {
        return {
          message: "Similarity Boost Rate is required.",
          path: ["similarityBoost"],
        };
      }
      if (!data.style?.length) {
        return {
          message: "Style Rate is required.",
          path: ["style"],
        };
      }
      if (!data.useSpeakerBoost?.length) {
        return {
          message: "Use Speaker Boost is required.",
          path: ["useSpeakerBoost"],
        };
      }
    } else {
      if (!data.voice?.length) {
        return {
          message: "Voice is required.",
          path: ["voice"],
        };
      }
    }
  });
