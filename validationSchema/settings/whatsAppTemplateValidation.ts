export const whatsAppTemplateSchema = toTypedSchema(
  z.object({
    name: z.string({ required_error: "Name is required" }).min(1, 'Name is required'),
    languageCode: z.string({ required_error: "Language is required" }).min(1, 'Language is required'),
    header: z
      .string({ required_error: "Header is required" }).optional(),
    headerText: z.string({ required_error: "Header is required" }).optional(),
    headerFile: z.object({}).optional(),
    headerLocation: z
      .string({ required_error: "Header is required" })
      .optional(),
    body: z.string({ required_error: "Body is required" }).min(1, 'Body is required'),
    footer: z.string({ required_error: "Footer is required" }).optional(),
    templateVariables: z
      .array(z.string({ required_error: "Value is required" }))
      .optional(),
    headerTextTemplateVariables: z
      .array(z.string({ required_error: "Value is required" }))
      .optional(),
    integrationId: z.string({ required_error: "IntegrationId is required" }).min(1, 'IntegrationId is required.'),
  }).superRefine((data, ctx) => {
    // Validate each template variable
    if (data.templateVariables || data?.templateVariables?.length) {
      data.templateVariables.forEach((item, index) => {
        if (!item || item.trim() === '') {
          ctx.addIssue({
            path: ['templateVariables', index],
            message: `Template variable ${index + 1} cannot be empty.`,
          });
        }

        // Example: Additional validation for format (e.g., alphanumeric only)
        // if (!/^[a-zA-Z0-9_]+$/.test(item)) {
        //   ctx.addIssue({
        //     path: ['templateVariables', index],
        //     message: `Template variable ${index + 1} must be alphanumeric.`,
        //   });
        // }
      });
    }
  })
);
