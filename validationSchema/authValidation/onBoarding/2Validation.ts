export const formSchema = toTypedSchema(
  z
    .object({
      name: z
        .string({ required_error: "Company Name is required" })
        .min(1, "Company Name is required"),
      industry: z
        .string({ required_error: "Industry is required" })
        .min(2, "Industry must be provided."),
      avgTraffic: z
        .string({ required_error: "Website Traffic is required" })
        .min(2, "Monthly Website Traffic must be provided."),
      employeeCount: z
        .string({ required_error: "Employees count is required" })
        .min(2, "No. of Employees must be provided"),
      otherRole: z.string().optional().default(""),
    })
    .refine(
      (data: any) => {
        if (data.industry.toLowerCase() === "other") {
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
      if (data.industry.toLowerCase() === "other") {
        return { ...data, industry: data.otherRole };
      }
      return data;
    }),
);
