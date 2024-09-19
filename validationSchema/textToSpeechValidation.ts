export const textToSpeechValidation = z
  .object({
    provider: z.string().min(1, "Provider is required"),
    language: z.string().min(1, "Language is required").optional(),
    pitch: z.string().min(1, "Pitch is required").optional(),
    voiceType: z.string().min(1, "Voice Type is required").optional(),
    speakingRate: z.string().min(1, "Speaking Rate is required").optional(),
    volumeGrainDb: z.string().min(1, "Volume Grain Db is required").optional(),
    stability: z.string().min(1, "Stability is required").optional(),
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
  })
  .refine(
    (data:any) => {
      if (data.provider === "google") {
        return (
          !!data.language?.length &&
          !!data.speakingRate?.length &&
          !!data.pitch?.length &&
          !!data.volumeGrainDb?.length
        );
      } else if (data.provider === "elevenlabs") {
        return (
          !!data.stability?.length &&
          !!data.similarityBoost?.length &&
          !!data.style?.length &&
          !!data.useSpeakerBoost?.length
        );
      } else {
        return !!data.voice?.length;
      }
    },
    {
      message: (ctx:any) => {
        if (ctx.provider === "google")
          return "Missing required fields for Google TTS.";
        if (ctx.provider === "elevenlabs")
          return "Missing required fields for Eleven Labs TTS.";
        return "Voice is required.";
      },
      path: (ctx:any) => {
        if (ctx.provider === "google")
          return ["language", "speakingRate", "pitch", "volumeGrainDb"];
        if (ctx.provider === "elevenlabs")
          return ["stability", "similarityBoost", "style", "useSpeakerBoost"];
        return ["voice"];
      },
    },
  );
