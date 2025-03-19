export const formSchema = toTypedSchema(
  z
    .object({
      username: z.string({ required_error: "Name is required" }).min(2, "Name is required"),
      email: z
        .string({ required_error: "Email is required" })
        .email("Invalid email address.")
        .regex(
          /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/,
          "Email must be in lowercase.",
        ),
      // username: z.string().email("Invalid email address."),
      password: z
        .string({ required_error: "Password is required" })
        .min(6, "Password must be at least 6 characters long."),
      // confirmPassword: z
      //   .string({ required_error: "Confirm is required" })
      //   .min(6, "Confirm Password must be at least 6 characters long."),
    })
    // .refine((data) => data.password === data.confirmPassword, {
    //   message: "Passwords do not match.",
    //   path: ["confirmPassword"], // Point to the field that has the issue
    // }),
);

export const formSchemaVariation = toTypedSchema(
  z
    .object({
      name: z.string({ required_error: "Name is required" }),
      email: z
        .string({ required_error: "Email is required" })
        .email("Invalid email address.")
        .regex(
          /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/,
          "Email must be in lowercase.",
        ),
      // username: z.string().email("Invalid email address."),
      password: z
        .string({ required_error: "Password is required" })
        .min(6, "Password must be at least 6 characters long."),
      // confirmPassword: z
      //   .string({ required_error: "Confirm is required" })
      //   .min(6, "Confirm Password must be at least 6 characters long."),
    })
  // .refine((data) => data.password === data.confirmPassword, {
  //   message: "Passwords do not match.",
  //   path: ["confirmPassword"], // Point to the field that has the issue
  // }),
);

