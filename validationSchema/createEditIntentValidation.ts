export const createEditIntentValidation = z
  .object({
    intent: z.string({required_error: "intent is required" }).min(1, { message: "intent is required" }),
    link: z.string().optional(),
    fileName: z.string().optional(),
    file: z.string().optional(),
  })
  .refine(
    (data) => {
      if (
        data.intent.toLowerCase() === "location" ||
        data.intent.toLowerCase() === "virtual_tour"
      ) {
        return data?.link;
      }
      return true;
    },
    {
      message: "link must be provided",
      path: ["link"],
    },
  )
  // .refine(
  //   (data) => {
  //     if (data.intent === "images" || data.intent === "brochures") {
  //       return data?.fileName;
  //     }
  //     return true;
  //   },
  //   {
  //     message: "intent name must be provided",
  //     path: ["fileName"],
  //   },
  // );
