const addressSchema = z.object({
  street: z
    .string({ required_error: "Street Name is required" })
    .min(2, "Street Name is required"),
  city: z
    .string({ required_error: "City Name is required" })
    .min(2, "City Name is required"),
  state: z
    .string({ required_error: "State Name is required" })
    .min(2, "State Name is required"),
  country: z
    .string({ required_error: "Country Name is required" })
    .min(2, "Country Name is required"),
  zipCode: z
    .string({ required_error: "zipCode is required" })
    .min(1, "zipCode is required"),
});

export const accountSchema = toTypedSchema(
  z
    .object({
      username: z
        .string({ required_error: "Name is required" })
        .min(2, "Name must be at least 2 characters."),
      email: z
        .string({ required_error: "Email is required" })
        .email()
        .default(""),
        mobile: z.string({ required_error: "Number is required" }), 
        password: z
        .string({ required_error: "Password is required" })
        .optional()
        .default(""),
        confirmPassword: z
        .string({ required_error: "Confirm Password is required" })
        .optional()
        .default(""),
        countryCode: z
        .string({ required_error: "Country Code is required" })
        .min(1, "Country Code is required"),
        address: addressSchema,
        metadata: z.object({
        businessName: z
            .string({ required_error: "Business name is required" })
            .min(1, "Business name is required"),
        role: z.string({ required_error: "Street Name is required" }),
        otherRole: z.string().optional().default(""),
      }),
      data: z.string().optional().default(""),
    }).superRefine((data, ctx) => {
         // Example: Find the country and get the minimum length for the mobile number
      const lengthRequirement = getCountryLengthRequirement(data.countryCode);
      // Validate mobile number length dynamically
      if (data.mobile.length !== lengthRequirement) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: `Number must be exactly ${lengthRequirement} characters long.`,
          path: ["mobile"], // Field with the issue
        });
      }
      // Check if passwords match
      if (data.password !== data.confirmPassword) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Passwords do not match.",
          path: ["confirmPassword"], // Field with the issue
        });
      }

      // Check if otherRole is provided when role is "other"
      if (data.metadata.role.toLowerCase() === "other" && (!data.metadata.otherRole || data.metadata.otherRole.length < 1)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Other role must be provided",
          path: ["metadata", "otherRole"], // Field with the issue
        });
      }
    }),
    // .refine((data) => data.password === data.confirmPassword, {
    //   message: "Passwords do not match.",
    //   path: ["confirmPassword"], // Point to the field that has the issue
    // })
    // .refine(
    //   (data) => {
    //     if (data.metadata.role.toLowerCase() === "other") {
    //       return data.metadata.otherRole && data.metadata.otherRole.length >= 1;
    //     }
    //     return true;
    //   },
    //   {
    //     message: "Other role must be provided",
    //     path: ["metadata", "otherRole"], // Path where error will be shown
    //   },
    // ),
);
