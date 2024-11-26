// export const textToSpeechValidation = z.object({
//   provider: z.string().min(1, "Provider is required"),
//   language: z.string().min(1, "Language is required").optional(),
//   pitch: z.string().min(1, "Pitch is required").optional().default("1"),
//   speakingRate: z.string().min(1, "Speaking Rate is required").optional().default("1"),
//   volumeGainDb: z.string().min(1, "Volume Grain db is required").optional().default("0.5"),
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
//   // volumeGainDb: z.number().min(0, "Volume Gain dB is required").optional(),
//   pitch: z.union([z.number().min(0, "Pitch is required"), z.string().transform(Number)]).optional(),
//   speakingRate: z.union([z.number().min(0, "Speaking Rate is required"), z.string().transform(Number)]).optional(),
//   volumeGainDb: z.union([z.number().min(0, "Volume Gain dB is required"), z.string().transform(Number)]).optional(),
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
//     return data.pitch !== undefined && data.speakingRate !== undefined && data.volumeGainDb !== undefined && data.name && data.name.trim() !== '';
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

// import { z } from 'zod';

// export const textToSpeechValidation = z.object({
//   provider: z.string().min(1, "Provider is required"),
//   name: z.string().optional(),
  
//   pitch: z.union([
//     z.number().min(0, "Pitch is required"),
//     z.string().transform(Number),
//   ]).optional(),
  
//   speakingRate: z.union([
//     z.number().min(0, "Speaking Rate is required"),
//     z.string().transform(Number),
//   ]).optional(),
//   speakingSpeed: z.union([
//     z.number().min(0, "Speaking speed is required"),
//     z.string().transform(Number),
//   ]).optional(),
//   volumeGainDb: z.union([
//     z.number().min(0, "Volume Gain dB is required"),
//     z.string().transform(Number),
//   ]).optional(),
//   speaker: z.string().optional(),
//   SampleRate: z.string({required_error: "Sample Rate is required"}).optional(),
//   voice: z.string().optional().refine(value => !!value?.trim(), {
//     message: 'Voice is required',
//   }),
  
//   elevenlabsvoice: z.string().optional().refine(value => !!value?.trim(), {
//     message: 'Voice is required',
//   }),
  
//   model: z.string().optional().refine(value => !!value?.trim(), {
//     message: 'Model is required',
//   }),
  
//   stability: z.union([
//     z.number().min(0, "Stability is required"),
//     z.string().transform(Number),
//   ]).optional(),
  
//   similarityBoost: z.union([
//     z.number().min(0, "Similarity Boost is required"),
//     z.string().transform(Number),
//   ]).optional(),
  
//   style: z.union([
//     z.number().min(0, "Style is required"),
//     z.string().transform(Number),
//   ]).optional(),
  
//   useSpeakerBoost: z.boolean().optional(),
// }).refine(data => {
//   switch (data.provider) {
//     case 'google':
//       return (
//         data.pitch !== undefined && 
//         data.speakingRate !== undefined && 
//         data.volumeGainDb !== undefined &&
//         data.name?.trim() !== ''
//       );
//     case 'deepgram':
//       return data.voice?.trim() !== '';
//     case 'elevenlabs':
//       return (
//         data.stability !== undefined && 
//         data.similarityBoost !== undefined && 
//         data.style !== undefined && 
//         data.useSpeakerBoost !== undefined && 
//         data.elevenlabsvoice?.trim() !== ''
//       );
//       case 'tring':
//       return (
//         data.speakingSpeed !== undefined && 
//         (data.speaker?.trim() !== '') && 
//         (data.SampleRate?.trim() !== '') 
//       );
//     default:
//       return true; // Validation passes for other providers
//   }
// }, {
//   message: "Invalid input based on selected provider",
//   path: [],
// });


import { z } from 'zod';

export const textToSpeechValidation = z.object({
  provider: z.string().min(1, { message: "Provider is required" }),
  name: z.string().optional(),
  
  pitch: z.union([
    z.number().optional(),
    z.string().transform(Number),
  ]).optional(),
  
  // speakingRate: z.union([
  //   z.number().optional(),
  //   z.string().transform(Number),
  // ]).optional(),
  
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
})
  .superRefine((data, ctx) => {
    // Validation for Google provider
    if (data.provider === 'google') {
      if (data.pitch === undefined) {
        ctx.addIssue({
          path: ['pitch'],
          message: 'Pitch is required for Google.',
        });
      }
      // if (data.speakingRate === undefined) {
      //   ctx.addIssue({
      //     path: ['speakingRate'],
      //     message: 'Speaking Rate is required for Google.',
      //   });
      // }
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

    // Validation for Deepgram provider
    if (data.provider === 'deepgram' && !data.voice?.trim()) {
      ctx.addIssue({
        path: ['voice'],
        message: 'Voice is required for Deepgram.',
      });
    }

    // Validation for Eleven Labs provider
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
       if (!data.speaker?.trim()) {
        ctx.addIssue({
          path: ['speaker'],
          message: 'Speaker is required.',
        });
      }
    }

    // Validation for Tring provider
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
      if (!data.sampleRate === undefined) {
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
