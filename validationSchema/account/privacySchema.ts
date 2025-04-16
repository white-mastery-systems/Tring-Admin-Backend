export const privacySchema = toTypedSchema(
  z
    .object({
      // username: z.string().email("Invalid email address."),
      password: z
        .string({ required_error: "Password is required" })
        .min(6, "Password must be at least 6 characters long.")
        .max(24, "Password must not exceed 24 characters.")
        .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
        .regex(/[a-z]/, "Password must contain at least one lowercase letter")
        .regex(/[0-9]/, "Password must contain at least one number")
        .regex(
          /[^A-Za-z0-9]/,
          "Password must contain at least one special character"
        )
        .refine(
          (password) => {
            // Check if password contains common patterns
            const commonPatterns = ["password", "123456", "qwerty", "admin"];
            return !commonPatterns.some(pattern =>
              password.toLowerCase().includes(pattern)
            );
          },
          {
            message: "Password contains a common pattern and may be easily guessed"
          }
        ),
      confirmPassword: z
        .string({ required_error: "Confirm is required" })
        .min(6, "Confirm Password must be at least 6 characters long."),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: "Passwords do not match.",
      path: ["confirmPassword"], // Point to the field that has the issue
    }),
);