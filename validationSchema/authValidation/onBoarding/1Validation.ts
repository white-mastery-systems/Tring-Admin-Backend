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
      mobile: z.string({ required_error: "Number is required" }), 
      countryCode: z
        .string({ required_error: "Country Code is required" })
        .min(1, "Country Code is required"),
      otherPlan: z.string().optional().default(""),
      otherReferralSource: z.string().optional().default(""),
      otherEstimatedMonthlyBudget: z.string().optional().default(""),
      otherDiscoverySource: z.string().optional().default(""),
      otherRole: z.string().optional().default(""),
    })
    .superRefine((data, ctx) => {
      // Check "other" fields
      const lengthRequirement = getCountryLengthRequirement(data.countryCode);
      // Validate mobile number length dynamically
      if (data.mobile.length !== lengthRequirement) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: `Number must be exactly ${lengthRequirement} characters long.`,
          path: ["mobile"], // Field with the issue
        });
      }
      if (data.role.toLowerCase() === "other" && !data.otherRole.trim()) {
        ctx.addIssue({
          path: ["otherRole"],
          message: "Other role must be provided",
        });
      }
      if (data.planToBuild.toLowerCase() === "other" && !data.otherPlan.trim()) {
        ctx.addIssue({
          path: ["otherPlan"],
          message: "Other plan must be provided",
        });
      }
      if (
        data.referralSource.toLowerCase() === "other" &&
        !data.otherReferralSource.trim()
      ) {
        ctx.addIssue({
          path: ["otherReferralSource"],
          message: "Other referral source must be provided",
        });
      }
      if (
        data.estimatedMonthlyBudget.toLowerCase() === "other" &&
        !data.otherEstimatedMonthlyBudget.trim()
      ) {
        ctx.addIssue({
          path: ["otherEstimatedMonthlyBudget"],
          message: "Other estimated monthly budget must be provided",
        });
      }
      if (
        data.discoverySource.toLowerCase() === "other" &&
        !data.otherDiscoverySource.trim()
      ) {
        ctx.addIssue({
          path: ["otherDiscoverySource"],
          message: "Other discovery source must be provided",
        });
      }
    }),
);

