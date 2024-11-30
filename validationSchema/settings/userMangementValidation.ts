export const userMangementSchema = toTypedSchema(
  z
    .object({
      email: z
        .string({ required_error: "Email is required" })
        .email("Invalid email address.")
        .regex(
          /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/,
          "Email must be in lowercase.",
        ),
      name: z
        .string({ required_error: "name is required" })
        .min(1, "name is required"),
      countryCode: z
        .string({ required_error: "country Code is required" })
        .min(1, "Country Code is required"),
      roleId: z
        .string({ required_error: "role is required" })
        .min(1, "role is required"),
      mobile: z
        .string({ required_error: "mobile is required" }),
        // .min(1, "mobile is required"),
      // username: z.string().email("Invalid email address."),
      password: z
        .string({ required_error: "Password is required" })
        .min(6, "Password must be at least 6 characters long."),
      confirmPassword: z
        .string({ required_error: "Confirm is required" })
        .min(6, "Confirm Password must be at least 6 characters long."),
    })
    // .refine((data) => data.password === data.confirmPassword, {
    //   message: "Passwords do not match.",
    //   path: ["confirmPassword"], // Point to the field that has the issue
    // }),
    .superRefine((data, ctx) => {
      // Check if passwords match
      if (data.password !== data.confirmPassword) {
        ctx.addIssue({
          path: ["confirmPassword"],
          message: "Passwords do not match.",
          code: z.ZodIssueCode.custom,
        });
      }

      // Validate phone number length based on country code
      const lengthRequirement = getCountryLengthRequirement(data.countryCode);
      if (data.mobile.length !== lengthRequirement) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: `Number must be exactly ${lengthRequirement} characters long.`,
          path: ["mobile"],
        });
      }
      // Add more custom validations here if needed
    }),

);
