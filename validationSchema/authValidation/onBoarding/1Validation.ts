export const formSchema = toTypedSchema(
  z
    .object({
      name: z
        .string({ required_error: "Name is required" })
        .min(1, "Name is required"),
      role: z
        .string({ required_error: "Role is required" })
        .min(2, "Role must be provided"),
      otherRole: z.string().optional().default(""),
    })
    .refine(
      (data: any) => {
        if (data.role.toLowerCase() === "other") {
          return data.otherRole.length >= 1;
        }
        return true;
      },
      {
        message: "Other role must be provided",
        path: ["otherRole"],
      },
    )
    .transform((data: any) => {
      if (data.role.toLowerCase() === "other") {
        return { ...data, role: data.otherRole };
      }
      return data;
    }),
);

