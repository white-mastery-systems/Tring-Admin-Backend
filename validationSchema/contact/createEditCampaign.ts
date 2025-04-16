import { z } from "zod";
 export const createEditCampaignValidation = toTypedSchema(z
  .object({
    campaignName: z.string({ required_error: "Campaign Name is required." }).min(1,{ message: "Campaign Name is required." }),
    contactMethod: z.string({ required_error: "Type is required." }).min(1, { message: "Type is required." }),
    bucketId: z.string({ required_error: "Bucket ID is required." }).min(1, { message: "Bucket ID is required." }),
    integrationId: z.string().optional(),
    botId: z.string().optional(),
    date: z
      .string()
      .optional()
      .refine((v) => v || true, { message: "Date is required for WhatsApp." }),
    time: z
      .string()
      .optional(),
    startTime: z
      .string()
      .optional(),
    endTime: z
      .string()
      .optional(),
    templateName: z.string().optional(),
    // callsPerTrigger: z.number({ required_error: "Calls per trigger is required." }).min(1, { message: "Calls per trigger is required." }),
    // callsPerTrigger: z
    //       .union([
    //         z.string().transform((val) => {
    //           const parsed = parseInt(val);
    //           return isNaN(parsed) ? undefined : parsed;
    //         }),
    //         z.number({ required_error: "Calls per trigger is required." }).min(1, { message: "Calls per trigger is required." })
    //       ])
    //       .optional()
    //       .refine((val) => val === undefined || val >= 1, { 
    //         message: "Calls per trigger is required and must be at least 1." 
    //       }),
    callsPerTrigger: z
      .union([
        z.string({ required_error: "Calls per trigger is required." }).transform((val) => {
          const parsed = parseInt(val);
          return isNaN(parsed) ? undefined : parsed;
        }),
        z.number({ required_error: "Calls per trigger is required." }).min(1, { message: "Calls per trigger is required." })
      ]),
  })
  .superRefine((data, ctx) => {
    const isWhatsApp = data.contactMethod === "whatsapp";
    const isVoice = data.contactMethod === "voice";

    ctx.path.forEach((path) => {
      if (path[0] !== "contactMethod") {
        ctx.addIssue({ path, message: "", code: z.ZodIssueCode.invalid_type });
      }
    });
    // Conditional validation for WhatsApp
    if (isWhatsApp) {
      if (!data.date) {
        ctx.addIssue({
          path: ["date"],
          message: "Date is required for WhatsApp campaigns.",
          code: z.ZodIssueCode.custom,
        });
      }
      if (!data.templateName) {
        ctx.addIssue({
          path: ["templateName"],
          message: "Template is required for WhatsApp.",
          code: z.ZodIssueCode.custom,
        });
      }
      if (!data.integrationId) {
        ctx.addIssue({
          path: ["integrationId"],
          message: "IntegrationId is required for WhatsApp.",
          code: z.ZodIssueCode.custom,
        });
      }
      if (!data.time) {
        ctx.addIssue({
          path: ["time"],
          message: "Time are required for whatsapp campaigns.",
          code: z.ZodIssueCode.custom,
        });
      }
    }

    // Conditional validation for Voice
    if (isVoice) {
      if (!data.botId) {
        ctx.addIssue({
          path: ["botId"],
          message: "Bot ID is required for Voice campaigns.",
          code: z.ZodIssueCode.custom,
        });
      }
      if (!data.callsPerTrigger) {
        ctx.addIssue({
          path: ["callsPerTrigger"],
          message: "CallsPerTrigger is required for Voice campaigns.",
          code: z.ZodIssueCode.custom,
        });
      }
      if (!data.startTime || !data.endTime) {
        ctx.addIssue({
          path: ["startTime"],
          message: "Start Time and End Time are required for Voice campaigns.",
          code: z.ZodIssueCode.custom,
        });
      }
    }
  })
);