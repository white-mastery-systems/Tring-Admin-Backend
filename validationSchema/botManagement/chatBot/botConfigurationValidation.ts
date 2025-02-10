export const botConfigSchema = toTypedSchema(
  z
    .object({
      NAME: z
        .string({ required_error: "Name must be at least 2 characters." })
        .min(2, "Name must be at least 2 characters."),
      COMPANY: z
        .string({
          required_error: "Company name must be at least 2 characters.",
        })
        .min(2, "Company name must be at least 2 characters."),

      ROLE: z
        .string({ required_error: "Role must be provided." })
        .min(2, "Role must be provided."),
      GOAL: z
        .string({ required_error: "Goal must be provided." })
        .min(2, "Goal must be provided."),
      LANGUAGE: z
        .string({ required_error: "Language is required" })
        .min(1, { message: "Language is required" }),
      NOTES: z.string().optional().default(""),
      DESCRIPTION: z.string().optional().default(""),
      otherRole: z.string().optional().default(""),
      otherGoal: z.string().optional().default(""),
      errorMessage: z.string().optional(),
    })
    .refine(
      (data) => {
        if (data.ROLE.toLowerCase() === "other") {
          return data.otherRole.length >= 1;
        }
        return true;
      },
      {
        message: "Other role must be provided",
        path: ["otherRole"],
      },
    )
    .refine(
      (data) => {
        if (data.GOAL.toLowerCase() === "other") {
          return data.otherGoal.length >= 1;
        }
        return true;
      },
      {
        message: "Other goal must be provided",
        path: ["otherGoal"],
      },
    )
    .transform((data) => {
      if (data.ROLE.toLowerCase() === "other") {
        return { ...data, ROLE: data.otherRole };
      }
      if (data.GOAL.toLowerCase() === "other") {
        return { ...data, GOAL: data.otherGoal };
      }
      return data;
    }),
);
