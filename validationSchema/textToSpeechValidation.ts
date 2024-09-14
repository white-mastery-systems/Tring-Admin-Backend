export const textToSpeechValidation = z.object({
  adaptation: z.string().min(1, "adaptation is required"),
});
