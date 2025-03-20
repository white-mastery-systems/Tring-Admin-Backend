export const voiceBotCreateSchema = toTypedSchema(
  z.object({
    boundDirection: z
  .string({ required_error: "Bound direction is required" }) // Message for required error
  .min(3, { message: "Bound direction must be at least 3 characters long" }), // Message for minimum length error
    newBotName: z
    .string({ required_error: "Bot Name is required" })
    .min(3, { message: "Bot Name is required" }),
    agentName: z
    .string({ required_error: "Agent Name is required" })
    .min(3, { message: "Agent Name is required" }),
    type: z.string({ required_error: "Type is required" }).min(2, "Type is required."),
  agentLanguage: z
    .string({ required_error: "Agent Language is required" })
    .min(1, { message: "Agent Language is required" }),
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
    temperature: z
      .number({ required_error: "number is required" })
      .min(0,"Temperature minumum value should be zero"),
    max_output_token: z.string({ required_error: 'Max output token is required' }).min(1, { message: 'Max output token cannot be empty' }),
    ROLE: z.string().min(2, "Role is required"),
    GOAL: z.string().optional(),
    // industry: z.string().min(2, "Industry type must be at least 2 characters."),
    otherRole: z.string().optional(),
    otherGoal: z.string().optional(),
    selectedType: z.string().optional(),
  }));