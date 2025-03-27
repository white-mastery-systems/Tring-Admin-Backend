import { z } from 'zod';

// TTS Validation
export const ttsValidation = z.object({
  provider: z.string().min(1, { message: "Provider is required" }),
  name: z.string().optional(),
  pitch: z.union([
    z.number().optional(),
    z.string().transform(Number),
  ]).optional(),
  speakingRate: z.union([
    z.number().optional(),
    z.string().transform(Number),
  ]).optional(),
  speakingSpeed: z.union([
    z.number().optional(),
    z.string().transform(Number),
  ]).optional(),
  silence_pad: z.union([
    z.number().optional(),
    z.string().transform(Number),
  ]).optional(),
  volumeGainDb: z.union([
    z.number().optional(),
    z.string().transform(Number),
  ]).optional(),
  speaker: z.string().optional(),
  apikey: z.string().optional(),
  sampleRate: z.number().optional(),
  voice: z.string().optional(),
  elevenlabsvoice: z.string().optional(),
  model: z.string().optional(),
  stability: z.union([
    z.number().optional(),
    z.string().transform(Number),
  ]).optional(),
  similarityBoost: z.union([
    z.number().optional(),
    z.string().transform(Number),
  ]).optional(),
  style: z.union([
    z.number().optional(),
    z.string().transform(Number),
  ]).optional(),
  useSpeakerBoost: z.boolean().optional(),
}).superRefine((data, ctx) => {
  // TTS provider-specific validations
  if (data.provider === 'google') {
    if (data.pitch === undefined) {
      ctx.addIssue({
        path: ['pitch'],
        message: 'Pitch is required for Google.',
      });
    }
    if (data.volumeGainDb === undefined) {
      ctx.addIssue({
        path: ['volumeGainDb'],
        message: 'Volume Gain dB is required for Google.',
      });
    }
    if (!data.name?.trim()) {
      ctx.addIssue({
        path: ['name'],
        message: 'Name is required for Google.',
      });
    }
  }
  if (data.provider === 'deepgram' && !data.voice?.trim()) {
    ctx.addIssue({
      path: ['voice'],
      message: 'Voice is required for Deepgram.',
    });
  }
  if (data.provider === 'elevenlabs') {
    if (data.stability === undefined) {
      ctx.addIssue({
        path: ['stability'],
        message: 'Stability is required for Eleven Labs.',
      });
    }
    if (data.similarityBoost === undefined) {
      ctx.addIssue({
        path: ['similarityBoost'],
        message: 'Similarity Boost is required for Eleven Labs.',
      });
    }
    if (data.style === undefined) {
      ctx.addIssue({
        path: ['style'],
        message: 'Style is required for Eleven Labs.',
      });
    }
    if (data.useSpeakerBoost === undefined) {
      ctx.addIssue({
        path: ['useSpeakerBoost'],
        message: 'Use Speaker Boost is required for Eleven Labs.',
      });
    }
    if (!data.elevenlabsvoice?.trim()) {
      ctx.addIssue({
        path: ['elevenlabsvoice'],
        message: 'Voice is required for Eleven Labs.',
      });
    }
    if (!data.apikey?.trim()) {
      ctx.addIssue({
        path: ['apikey'],
        message: 'API key is required for Eleven Labs.',
      });
    }
  }
  if (data.provider === 'tring') {
    if (data.speakingSpeed === undefined) {
      ctx.addIssue({
        path: ['speakingSpeed'],
        message: 'Speaking Speed is required for Tring.',
      });
    }
    if (data.silence_pad === undefined) {
      ctx.addIssue({
        path: ['silence_pad'],
        message: 'Silence Pad is required for Tring.',
      });
    }
    if (!data.speaker?.trim()) {
      ctx.addIssue({
        path: ['speaker'],
        message: 'Speaker is required for Tring.',
      });
    }
    if (data.sampleRate === undefined) {
      ctx.addIssue({
        path: ['sampleRate'],
        message: 'Sample Rate is required for Tring.',
      });
    }
    if (!data.apikey?.trim()) {
      ctx.addIssue({
        path: ['apikey'],
        message: 'API key is required.',
      });
    }
  }
});

// STT Validation
export const sttValidation = z.object({
  provider: z.string().min(1, "Provider is required"),
  recognizer: z.string().optional(),
  adaptation: z.boolean().optional(),
  model: z.string().optional(),
  googlemodel: z.string().optional(),
  amplificationFactor: z.number({ required_error: "AmplificationFactor is required." }).min(1, "AmplificationFactor is required."),
  utteranceEndMs: z.string().optional(),
  endpointing: z.number().optional(),
  endutterancesilencethreshold: z.number().optional(),
  keywords: z.array(z.object({
    value: z.string().optional(),
    boostValue: z.string().optional(),
  })).optional(),
  wordboost: z.array(z.object({
    value: z.string().optional(),
    boostValue: z.string().optional(),
  })).optional(),
  phraseSets: z.array(z.object({
    value: z.string().optional(),
  })).optional(),
  phraseLists: z.array(z.object({
    value: z.string().optional(),
  })).optional(),
}).superRefine((data, ctx) => {
  // STT provider-specific validations
  if (data.provider === 'deepgram') {
    if (!data.utteranceEndMs || data.utteranceEndMs.trim() === '') {
      ctx.addIssue({
        path: ['utteranceEndMs'],
        message: "Utterance End Ms is required for Deepgram.",
      });
    }
    if (data.keywords && data.keywords.length) {
      data.keywords.forEach((item, index) => {
        if (!item.value || item.value.trim() === '') {
          ctx.addIssue({
            path: ['keywords', index, 'value'],
            message: `Keyword ${index + 1} is required.`,
          });
        }
        if (item.boostValue === undefined || item.boostValue === '') {
          ctx.addIssue({
            path: ['keywords', index, 'boostValue'],
            message: `Boost value ${index + 1} is required.`,
          });
        }
      });
    }
  }
  if (data.provider === 'google') {
    if (data.adaptation === undefined) {
      ctx.addIssue({
        path: ['adaptation'],
        message: "Adaptation is required for Google.",
      });
    }
    if (!data.googlemodel?.trim()) {
      ctx.addIssue({
        path: ['googlemodel'],
        message: "Model is required for Google.",
      });
    }
    if (!data.recognizer?.trim()) {
      ctx.addIssue({
        path: ['recognizer'],
        message: "Recognizer is required for Google.",
      });
    }
    if (data.phraseSets && data.phraseSets.length) {
      data.phraseSets.forEach((item, index) => {
        if (!item.value || item.value.trim() === '') {
          ctx.addIssue({
            path: ['phraseSets', index, 'value'],
            message: `phraseSets ${index + 1} is required.`,
          });
        }
      });
    }
  }
  if (data.provider === 'assemblyai') {
    if (data.wordboost && data.wordboost.length) {
      data.wordboost.forEach((item, index) => {
        if (!item.value || item.value.trim() === '') {
          ctx.addIssue({
            path: ['wordboost', index, 'value'],
            message: `Keyword ${index + 1} is required.`,
          });
        }
        if (item.boostValue === undefined || item.boostValue === '') {
          ctx.addIssue({
            path: ['wordboost', index, 'boostValue'],
            message: `Boost value ${index + 1} is required.`,
          });
        }
      });
    }
    if (data.endutterancesilencethreshold === undefined) {
      ctx.addIssue({
        path: ['endutterancesilencethreshold'],
        message: "End Utterance Silence Threshold is required for AssemblyAI.",
      });
    }
  }
  if (data.provider === 'azure') {
    if (data.phraseLists && data.phraseLists.length) {
      data.phraseLists.forEach((item, index) => {
        if (!item.value || item.value.trim() === '') {
          ctx.addIssue({
            path: ['phraseLists', index, 'value'],
            message: `phraseLists ${index + 1} is required.`,
          });
        }
      });
    }
  }
});

// LLM Validation
export const llmValidation = z.object({
  top_k: z.string({ required_error: "Top K is required" }).min(1, "Top K is required"),
  top_p: z.string({ required_error: "Top P is required" }).min(1, "Top P is required"),
  max_output_token: z.string({ required_error: "tokens is required" }).min(1, "tokens is required"),
  temperature: z.number({ required_error: "number is required" }).min(0, "Temperature minumum value should be zero"),
  // prompt: z.string({ required_error: "System prompt is required" }).min(1, "System prompt is required"),
});

// Combined Validation Schema
export const combinedValidationSchema = z.object({
  tts: ttsValidation,
  stt: sttValidation,
  llm: llmValidation
});

export type CombinedFormValues = z.infer<typeof combinedValidationSchema>;