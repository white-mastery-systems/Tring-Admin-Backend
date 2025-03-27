export const voiceBotCreateSchema = toTypedSchema(
  z.object({
    boundDirection: z
      .string({ required_error: "Bound direction is required" })
      .min(1, { message: "Bound direction must be at least 3 characters long" }),
    newBotName: z
      .string({ required_error: "Bot Name is required" })
      .min(3, { message: "Bot Name is required" }),
    agentName: z
      .string({ required_error: "Agent Name is required" })
      .min(3, { message: "Agent Name is required" }),
    type: z
      .string({ required_error: "Industry type is required" })
      .min(2, "Industry type is required."),
    agentLanguage: z
      .string({ required_error: "Agent Language is required" })
      .min(1, { message: "Agent Language is required" }),
    provideraccountname: z.string().optional(),
    incomingPhoneNumber: z.string().optional(),
    region: z
      .string({ required_error: "Country is required" })
      .min(1, "Country is required"),
    timezone: z
      .string({ required_error: "Time zone is required" })
      .min(1, "Time zone is required"),
    provider_stt: z
      .string({ required_error: "Speech-to-text provider is required" })
      .min(1, "Speech-to-text provider cannot be empty"),
    provider_tts: z
      .string({ required_error: "Text-to-speech provider is required" })
      .min(1, "Text-to-speech provider cannot be empty"),
    name: z.string().optional(),
    model: z.string().optional(),
    // model_stt: z.string().optional(),
    googlemodel: z.string().optional(),
    deepmodel: z.string().optional(),
    elevenlabsvoice: z.string().optional(),
    voice: z.string().optional(),
    deepgramvoice: z.string().optional(),
    temperature: z
      .number({ required_error: "Temperature is required" })
      .min(0, "Temperature minimum value should be zero")
      .max(2, "Temperature maximum value should be 2"),
    max_output_token: z
      .string({ required_error: "Max output token is required" })
      .min(1, { message: "Max output token cannot be empty" }),
    role: z
      .string()
      .min(2, "Role is required"),
    goal: z
      .string()
      .optional(),
    otherRole: z.string().optional(),
    otherGoal: z.string().optional(),
    selectedType: z.string().optional(),
  }).superRefine((data, ctx) => {
    // Speech-to-Text provider validation
    if (!data.provider_stt || data.provider_stt.length === 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Speech-to-text provider is required",
        path: ["provider_stt"]
      });
    }
    
    // Specific STT provider model validation
    // if (data.provider_stt === 'deepgram' && (!data.model_stt || data.model_stt.length === 0)) {
    //   ctx.addIssue({
    //     code: z.ZodIssueCode.custom,
    //     message: "Model is required when using Deepgram STT provider",
    //     path: ["model_stt"]
    //   });
    // }

    if (data.provider_stt === 'google' && (!data.googlemodel || data.googlemodel.length === 0)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Model is required when using Google STT provider",
        path: ["googlemodel"]
      });
    }

    // Text-to-Speech provider validation
    if (!data.provider_tts || data.provider_tts.length === 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Text-to-speech provider is required",
        path: ["provider_tts"]
      });
    }
    
    // Specific TTS provider fields validation
    if (data.provider_tts === 'google' && (!data.name || data.name.length === 0)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Name is required when using Google TTS provider",
        path: ["name"]
      });
    }

    if (data.provider_tts === 'elevenlabs') {
      // if (!data.apikey || data.apikey.length === 0) {
      //   ctx.addIssue({
      //     code: z.ZodIssueCode.custom,
      //     messagePlease select a voice for new api key used Integration TTS providerz: "API Key is required when using ElevenLabs TTS provider",
      //     path: ["apikey"]
      //   });
      // }
      
      // if (!data.elevenlabsvoice || data.elevenlabsvoice.length === 0) {
      //   ctx.addIssue({
      //     code: z.ZodIssueCode.custom,
      //     message: "Voice is required when using ElevenLabs TTS provider",
      //     path: ["elevenlabsvoice"]
      //   });
      // }
      
      if (!data.model || data.model.length === 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Model is required when using ElevenLabs TTS provider",
          path: ["model"]
        });
      }
    }

    // if (data.provider_tts === 'deepgram' && (!data.voice || data.voice.length === 0)) {
    //   ctx.addIssue({
    //     code: z.ZodIssueCode.custom,
    //     message: "Voice is required when using Deepgram TTS provider",
    //     path: ["voice"]
    //   });
    // }

    // Max output token validation
    if (!data.max_output_token || data.max_output_token.length === 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Max output token is required",
        path: ["max_output_token"]
      });
    }

    // Temperature validation
    if (data.temperature === undefined || data.temperature === null) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Temperature is required",
        path: ["temperature"]
      });
    } else if (data.temperature < 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Temperature minimum value should be zero",
        path: ["temperature"]
      });
    } else if (data.temperature > 2) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Temperature maximum value should be 2",
        path: ["temperature"]
      });
    }
    
    // Previous steps validation for completeness
    
    // Step 3 validation (ROLE)
    if (data.role === 'custom' && (!data.otherRole || data.otherRole.length < 2)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Custom role is required when 'custom' role is selected",
        path: ["otherRole"]
      });
    }
    
    // Step 4 validation (GOAL)
    if (data.goal === 'custom' && (!data.otherGoal || data.otherGoal.length < 2)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Custom goal is required when 'custom' goal is selected",
        path: ["otherGoal"]
      });
    }
  }));