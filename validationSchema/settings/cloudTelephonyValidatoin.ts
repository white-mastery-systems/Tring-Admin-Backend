export const cloudTelephonySchema = toTypedSchema(
  z.object({
    provider: z.string({ required_error: 'Provider is required.' }).nonempty({ message: 'Provider is required.' }),
    accountSid: z.string().optional(),
    apiSecret: z.string().optional(),
    // authToken: z.string().optional(),
    subDomain: z.string().optional(),
    apiKey: z.string().optional(),
    apiToken: z.string().optional(),
    flowId: z.string().optional(),
    publicKey: z.string().optional(),
    connectionId: z.string().optional(),
    authId: z.string().optional(),
    authToken: z.string().optional(),
  })
    .superRefine((data, ctx) => {
      if (data.provider !== 'sandbox' && data.provider !== 'plivo' && !data.apiKey) {
        ctx.addIssue({
          path: ['apiKey'],
          message: 'API Key is required unless the provider is "sandbox".',
        });
      }
      // Provider-specific validation
      if (data.provider === 'twilio') {
        if (!data.accountSid) {
          ctx.addIssue({
            path: ['accountSid'],
            message: 'Account SID is required for Twilio.',
          });
        }
        // if (!data.authToken) {
        //   ctx.addIssue({
        //     path: ['authToken'],
        //     message: 'Auth Token is required for Twilio.',
        //   });
        // }
        if (!data.apiSecret) {
          ctx.addIssue({
            path: ['apiSecret'],
            message: 'Api secret is required for Twilio.',
          });
        }
      }

      if (data.provider === 'exotel') {
        if (!data.accountSid) {
          ctx.addIssue({
            path: ['accountSid'],
            message: 'Account SID is required for Exotel.',
          });
        }
        // if (!data.apiKey) {
        //   ctx.addIssue({
        //     path: ['apiKey'],
        //     message: 'API Key is required for Exotel.',
        //   });
        // }
        if (!data.subDomain) {
          ctx.addIssue({
            path: ['subDomain'],
            message: 'Sub Domain is required for Exotel.',
          });
        }
        if (!data.apiToken) {
          ctx.addIssue({
            path: ['apiToken'],
            message: 'API Token is required for Exotel.',
          });
        }
        if (!data.flowId) {
          ctx.addIssue({
            path: ['flowId'],
            message: 'Flow ID is required for Exotel.',
          });
        }
      }

      if (data.provider === 'telnyx') {
        // if (!data.apiKey) {
        //   ctx.addIssue({
        //     path: ['apiKey'],
        //     message: 'API Key is required for Telnyx.',
        //   });
        // }
        if (!data.publicKey) {
          ctx.addIssue({
            path: ['publicKey'],
            message: 'Public Key is required for Telnyx.',
          });
        }
        if (!data.connectionId) {
          ctx.addIssue({
            path: ['connectionId'],
            message: 'Connection Id is required for Telnyx.',
          });
        }
      }
      if (data.provider === 'plivo') {
        if (!data.authId) {
          ctx.addIssue({
            path: ['authId'],
            message: 'authId is required for Plivo.',
          });
        }
        if (!data.authToken) {
          ctx.addIssue({
            path: ['authToken'],
            message: 'authToken is required for Plivo.',
          });
        }
      }
    })
);