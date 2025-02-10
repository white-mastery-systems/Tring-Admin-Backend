export const dynamicFormSchema = toTypedSchema(
  z.object({
    fields: z.array(
      z.object({
        type: z.string({ required_error: "Type is required." }).min(2, "Type is required."),
        label: z.string({ required_error: "Label is required." }).min(2, "Label is required."),
        placeholder: z.string({ required_error: "Placeholder is required." }).min(2, "Placeholder is required."), // Make placeholder required
        errorMessage: z.string({ required_error: "Error message is required." }).min(2, "Error message is required."), // Make errorMessage required
        minLength: z.string().optional(),
        maxLength: z.string().optional(),
      }).superRefine((data, ctx) => {
        if (data.type === 'text') {
          // Validate minLength
          if (!data.minLength) {
            ctx.addIssue({
              path: ["minLength"],
              message: "Minimum length is required.",
            });
          } else if (/^0+$/.test(data.minLength)) {
            ctx.addIssue({
              path: ["minLength"],
              message: "Minimum length cannot consist of only zeros.",
            });
          } else if (!/^\d+$/.test(data.minLength)) {
            ctx.addIssue({
              path: ["minLength"],
              message: "Minimum length must be a valid number.",
            });
          }

          // Validate maxLength
          if (!data.maxLength) {
            ctx.addIssue({
              path: ["maxLength"],
              message: "Maximum length is required.",
            });
          } else if (/^0+$/.test(data.maxLength)) {
            ctx.addIssue({
              path: ["maxLength"],
              message: "Maximum length cannot consist of only zeros.",
            });
          } else if (!/^\d+$/.test(data.maxLength)) {
            ctx.addIssue({
              path: ["maxLength"],
              message: "Maximum length must be a valid number.",
            });
          }

          // Check the relationship between minLength and maxLength
          if (
            /^\d+$/.test(data.minLength) &&
            /^\d+$/.test(data.maxLength)
          ) {
            const min = Number(data.minLength);
            const max = Number(data.maxLength);
            if (max < min) {
              ctx.addIssue({
                path: ["maxLength"],
                message: "Maximum length must be greater than or equal to minimum length.",
              });
            }
          }
        }
      })),
  })
);