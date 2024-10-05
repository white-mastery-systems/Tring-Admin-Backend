export const whatsAppTemplateSchema = toTypedSchema(
  z.object({
    name: z.string({ required_error: "name is required" }).optional(),
    header: z
      .string({ required_error: "header is required" })
      .min(1, "header is required")
      .optional(),
    headerText: z.string({ required_error: "header is required" }).optional(),
    headerFile: z.object(z.any()).optional(),
    headerLocation: z
      .string({ required_error: "header is required" })
      .optional(),
    body: z.string({ required_error: "body is required" }).optional(),
    footer: z.string({ required_error: "footer is required" }).optional(),
    templateVariables: z
      .array(z.string({ required_error: "value is required" }))
      .optional(),

    // lastName: z.string().min(1, 'LastName is required'),
  }),
);
