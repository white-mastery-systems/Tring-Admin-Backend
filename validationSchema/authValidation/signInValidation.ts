// };
export const formSchema = toTypedSchema(
  z.object({
    email: z
      .string({ required_error: "Email is required" })
      .email("Invalid email address.")
      .regex(
        /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/,
        "Email must be in lowercase.",
      ),
    password: z
      .string({ required_error: "password is required" })
      .min(6, "Password must be at least 6 characters long."),
  }),
);
