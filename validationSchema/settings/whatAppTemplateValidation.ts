export const whatsAppTemplateSchema = toTypedSchema(
  z.object({
    name: z.string({ required_error: "Name is required" }),
    languageCode: z.string({ required_error: "Language is required" }),
    header: z
      .string({ required_error: "Header is required" }).optional(),
    headerText: z.string({ required_error: "Header is required" }).optional(),
    headerFile: z.object({}).optional(),
    headerLocation: z
      .string({ required_error: "Header is required" })
      .optional(),
    body: z.string({ required_error: "Body is required" }),
    footer: z.string({ required_error: "Footer is required" }).optional(),
    templateVariables: z
      .array(z.string({ required_error: "Value is required" }))
      .optional(),
    headerTextTemplateVariables: z
      .array(z.string({ required_error: "Value is required" }))
      .optional(),
    integrationId: z.string({ required_error: "IntegrationId is required" }),
    // lastName: z.string().min(1, 'LastName is required'),
  }),
);
