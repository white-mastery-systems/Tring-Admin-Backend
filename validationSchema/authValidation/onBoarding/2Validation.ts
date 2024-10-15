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
      gst: z
        .string()
        .max(15, "GST number must be 15 characters")
        .min(15, "GST number must be 15 characters")
        .optional()
        .refine((val) => (val?.length > 0 ? val?.length === 15 : false), {
          message: "GST number must be exactly 15 characters if provided",
        }),
      logo: z.object({}).optional(),
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
      }
      return data;
    }),
);

export const companyDetailValidation = toTypedSchema(
  z
    .object({
      companyName: z
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
      industryOtherRole: z.string().optional().default(""),
    })
    .refine(
      (data: any) => {
        if (data.industry.toLowerCase() === "other") {
          return data.industryOtherRole.length >= 1;
        }
        return true;
      },
      {
        message: "Other role must be provided",
        path: ["industryOtherRole"],
      },
    )
    .transform((data: any) => {
      if (data.industry.toLowerCase() === "other") {
      }
      return data;
    }),
);
