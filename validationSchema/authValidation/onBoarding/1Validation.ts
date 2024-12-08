export const personalDetailFormValidation = toTypedSchema(
  z
    .object({
      name: z
        .string({ required_error: "Name is required" })
        .min(1, "Name is required"),
        planToBuild: z
        .string({ required_error: "Plan to build is required" })
        .min(1, "Plan to build is required"),
        referralSource: z
        .string({ required_error: "Referral source is required" })
        .min(1, "Referral source is required"),
        estimatedMonthlyBudget: z
        .string({ required_error: "Estimated monthly budget is required" })
        .min(1, "Estimated monthly budget is required"),
        discoverySource: z
        .string({ required_error: "Discovery source is required" })
        .min(1, "Discovery source is required"),
        businessName: z
        .string({ required_error: "Business name is required" })
        .min(1, "Business name is required"),
        country: z
        .string({ required_error: "Country is required" })
        .min(1, "Country is required"),
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
        // return { ...data, role: data.otherRole };
      }
      return data;
    }),
);

