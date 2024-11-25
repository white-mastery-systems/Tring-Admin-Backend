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

// import { z } from 'zod';

// export const speechToTextValidation = z.object({
//   provider: z.string().min(1, "Provider is required"),
//   language: z.string().min(1, "Language is required"),
//   adaptation: z.boolean().optional(),
//   model: z.string().optional(),
//   // amplificationFactor: z
//   //   .number()
//   //   .min(1, "Amplification Factor is required"),
//   amplificationFactor: z
//     .number()
//     .refine((val) => val > 0, {
//       message: "Amplification Factor is required",
//     }),
//   utteranceEndMs: z.string().optional(),
//   endpointing: z
//     .number()
//     .min(0, "Endpointing must be a positive number")
//     .optional(),
//     endutterancesilencethreshold: z
//     .number()
//     .min(0, "Endpointing must be a positive number")
//     .optional(),
//   keywords: z.array(z.object({
//     value: z.string().optional(),
//     boostValue: z.string().optional(),
//   })).optional(),
//    wordboost: z.array(z.object({
//     value: z.string().optional(),
//     boostValue: z.string().optional(),
//   })).optional(),
//   phraseSets: z.array(z.object({
//     value: z.string().optional(),
//   })).optional(),
//   phraseLists: z.array(z.object({
//     value: z.string().optional(),
//   })).optional(),
// }).refine((data) => {
//   // Validation based on provider
//   if (data.provider === 'deepgram') {
//     // Make utteranceEndMs required for Deepgram
//     return data.utteranceEndMs && data.utteranceEndMs.trim() !== '';
//   }
//   if (data.provider === 'google') {
//     // Make adaptation and model required for Google
//     return data.adaptation !== undefined &&
//            data.model && data.model.trim() !== '';
//   }
//   if (data.provider === 'assemblyai') {
//     // Make adaptation and model required for Google
//     return data.wordboost !== undefined &&
//            data.endutterancesilencethreshold
//   }
//   // Other providers can have different requirements or no additional requirements
//   return true; // No provider matched, validation passes
// }, {
//   message: "Invalid input based on selected provider",
//   path: [] // No specific path to reference for this general message
// });

import { z } from 'zod';

export const speechToTextValidation = z.object({
  provider: z.string().min(1, "Provider is required"),
  recognizer: z.string().optional(),
  adaptation: z.boolean().optional(),
  model: z.string().optional(),
  googlemodel: z.string().optional(),
  amplificationFactor: z.number({ required_error: "AmplificationFactor is required."}).min(1, "AmplificationFactor is required."),
  // assemblyaiamplificationFactor: z.number().optional(),
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
})
  .superRefine((data, ctx) => {
    // Validation for Deepgram provider
    // && (!data.utteranceEndMs || data.utteranceEndMs.trim() === '')
    if (data.provider === 'deepgram') {
      if (!data.utteranceEndMs || data.utteranceEndMs.trim() === '') {
      ctx.addIssue({
        path: ['utteranceEndMs'],
        message: "Utterance End Ms is required for Deepgram.",
      });
    }
      // if (data.assemblyaiamplificationFactor === undefined) {
      //   ctx.addIssue({
      //     path: ['assemblyaiamplificationFactor'],
      //     message: "Assembly Ai amplificationFactor is required.",
      //   });
      // }
      if (data.keywords || data.keywords.length) {
      // Validate each wordboost entry
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
    // Validation for Google provider
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
      if (data.phraseSets || data?.phraseSets?.length) {
      // Validate each wordboost entry
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

    // Validation for AssemblyAI provider
    if (data.provider === 'assemblyai') {
      // if (!data.wordboost || data.wordboost.length === 0) {
      //   ctx.addIssue({
      //     path: ['wordboost'],
      //     message: "Wordboost is required for AssemblyAI.",
      //   });
      // }
        if (data.provider === 'assemblyai') {
    // Ensure wordboost is required for AssemblyAI
    if (data.wordboost || data?.wordboost?.length) {
      // Validate each wordboost entry
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
  }
      if (data.endutterancesilencethreshold === undefined) {
        ctx.addIssue({
          path: ['endutterancesilencethreshold'],
          message: "End Utterance Silence Threshold is required for AssemblyAI.",
        });
      }
    }
    if (data.provider === 'azure') {
      // if (data.amplificationFactor === undefined) {
      //   ctx.addIssue({
      //     path: ['amplificationFactor'],
      //     message: "AmplificationFactor is required.",
      //   });
      // }
      if (data.phraseLists || data?.phraseLists?.length) {
      // Validate each wordboost entry
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
