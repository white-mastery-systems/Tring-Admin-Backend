export const roleMangementSchema = toTypedSchema(
  z.object({
    name: z
      .string({ required_error: "name is required" })
      .min(1, "name is required"),
    permissions: z.object({}).optional(),
  }),
);
