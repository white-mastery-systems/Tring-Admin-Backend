export const privacySchema = toTypedSchema(
  z
    .object({
      // username: z.string().email("Invalid email address."),
      password: z
        .string({ required_error: "Password is required" })
        .min(6, "Password must be at least 6 characters long."),
      confirmPassword: z
        .string({ required_error: "Confirm is required" })
        .min(6, "Confirm Password must be at least 6 characters long."),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: "Passwords do not match.",
      path: ["confirmPassword"], // Point to the field that has the issue
    }),
);
