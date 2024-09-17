export const textToSpeechValidation = z.object({
  provider: z.string().min(1, "provider is required"),
});
