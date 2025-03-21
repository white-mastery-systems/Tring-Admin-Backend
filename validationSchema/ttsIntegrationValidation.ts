// Validation schema
export const ttsIntegrationSchema = toTypedSchema(
  z.object({
    provider: z.string({ required_error: 'Provider is required.' })
      .nonempty({ message: 'Provider is required.' }),
    ttsIntegrationName: z.string().optional(),
    apikey: z.string().optional()
  })
  .superRefine((data, ctx) => {
    // ElevenLabs provider validations
    if (data.provider === 'elevenlabs') {
      if (!data.ttsIntegrationName?.trim()) {
        ctx.addIssue({
          path: ['ttsIntegrationName'],
          message: 'Integration Name is required for ElevenLabs',
        });
      }
      
      if (!data.apikey?.trim()) {
        ctx.addIssue({
          path: ['apikey'],
          message: 'API Key is required for ElevenLabs',
        });
      }
    }
  })
);