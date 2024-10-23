// export const textToSpeechValidation = z.object({
//   provider: z.string().min(1, "Provider is required"),
//   language: z.string().min(1, "Language is required").optional(),
//   pitch: z.string().min(1, "Pitch is required").optional().default("1"),
//   speakingRate: z.string().min(1, "Speaking Rate is required").optional().default("1"),
//   volumeGrainDb: z.string().min(1, "Volume Grain db is required").optional().default("0.5"),
//   stability: z.string().min(1, "stability is required").optional().default("0.5"),
//   similarityBoost: z.string().min(1, "Similarity Boost is required").optional().default("1"),
//   style: z.string().min(1, "Style is required").optional().default("0.5"),
//   useSpeakerBoost: z
//     .string()
//     .min(1, "Use Speaker Boost is required")
//     .optional(),
//   voice: z.string().min(1, "Voice is required").optional(),
// });

// export const textToSpeechValidation = z.object({
//   provider: z.string().min(1, "Provider is required"),
//   name: z.string().optional(),
//   // pitch: z.number().min(0, "Pitch is required").optional(),
//   // speakingRate: z.number().min(0, "Speaking Rate is required").optional(),
//   // volumeGrainDb: z.number().min(0, "Volume Gain dB is required").optional(),
//   pitch: z.union([z.number().min(0, "Pitch is required"), z.string().transform(Number)]).optional(),
//   speakingRate: z.union([z.number().min(0, "Speaking Rate is required"), z.string().transform(Number)]).optional(),
//   volumeGrainDb: z.union([z.number().min(0, "Volume Gain dB is required"), z.string().transform(Number)]).optional(),
//   voice: z.string({ required_error: 'Voice is required'}).optional(),
//   elevenlabsvoice: z.string({ required_error: 'Voice is required'}).optional(),
//   modal: z.string({required_error: 'Modal is required'}).optional(),
//   stability: z.union([z.number().min(0, "Stability is required"), z.string().transform(Number)]).optional(),
//   similarityBoost: z.union([z.number().min(0, "Similarity Boost is required"), z.string().transform(Number)]).optional(),
//   style: z.union([z.number().min(0, "Style is required"), z.string().transform(Number)]).optional(),
//   useSpeakerBoost: z.boolean().optional(),
// }).refine((data) => {

//   if (data.provider === 'google') {
//     // Ensure 'pitch', 'speakingRate', and 'volumeGainDb' are provided
//     return data.pitch !== undefined && data.speakingRate !== undefined && data.volumeGrainDb !== undefined && data.name && data.name.trim() !== '';
//   }
//   if (data.provider === 'deepgram') {
//     // Ensure 'voice' is provided
//     return data.voice && data.voice.trim() !== '';
//   }
//   if (data.provider === 'elevenlabs') {
//     // Ensure 'stability', 'similarityBoost', 'style', and 'useSpeakerBoost' are provided
//     return data.stability !== undefined &&
//            data.similarityBoost !== undefined &&
//            data.style !== undefined &&
//            data.useSpeakerBoost !== undefined &&
//            data.elevenlabsvoice && data.elevenlabsvoice.trim() !== ''
//   }
//   return true; // Validation passes for other providers
// }, {
//   message: "Invalid input based on selected provider",
//   path: [] // No specific path to reference for this general message
// });

import { z } from 'zod';

export const textToSpeechValidation = z.object({
  provider: z.string().min(1, "Provider is required"),
  name: z.string().optional(),
  
  pitch: z.union([
    z.number().min(0, "Pitch is required"),
    z.string().transform(Number),
  ]).optional(),
  
  speakingRate: z.union([
    z.number().min(0, "Speaking Rate is required"),
    z.string().transform(Number),
  ]).optional(),
  
  volumeGrainDb: z.union([
    z.number().min(0, "Volume Gain dB is required"),
    z.string().transform(Number),
  ]).optional(),
  
  voice: z.string().optional().refine(value => !!value?.trim(), {
    message: 'Voice is required',
  }),
  
  elevenlabsvoice: z.string().optional().refine(value => !!value?.trim(), {
    message: 'Voice is required',
  }),
  
  modal: z.string().optional().refine(value => !!value?.trim(), {
    message: 'Modal is required',
  }),
  
  stability: z.union([
    z.number().min(0, "Stability is required"),
    z.string().transform(Number),
  ]).optional(),
  
  similarityBoost: z.union([
    z.number().min(0, "Similarity Boost is required"),
    z.string().transform(Number),
  ]).optional(),
  
  style: z.union([
    z.number().min(0, "Style is required"),
    z.string().transform(Number),
  ]).optional(),
  
  useSpeakerBoost: z.boolean().optional(),
}).refine(data => {
  switch (data.provider) {
    case 'google':
      return (
        data.pitch !== undefined && 
        data.speakingRate !== undefined && 
        data.volumeGrainDb !== undefined &&
        data.name?.trim() !== ''
      );
    case 'deepgram':
      return data.voice?.trim() !== '';
    case 'elevenlabs':
      return (
        data.stability !== undefined && 
        data.similarityBoost !== undefined && 
        data.style !== undefined && 
        data.useSpeakerBoost !== undefined && 
        data.elevenlabsvoice?.trim() !== ''
      );
    default:
      return true; // Validation passes for other providers
  }
}, {
  message: "Invalid input based on selected provider",
  path: [],
});
