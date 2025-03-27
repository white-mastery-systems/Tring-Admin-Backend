const sellDoSchema = z.object({
  crm: z.literal("sell-do"),
  metadata: z.object({
    apiKey: z.string().min(1, { message: "API key is required" }),
  }),
});

const zohoCRMSchema = z.object({ crm: z.literal("zoho-crm") });

const zohoDeskSchema = z.object({ crm: z.literal("zoho-desk") });

const zohoBiginSchema = z.object({ crm: z.literal("zoho-bigin") });

const hubSpotSchema = z.object({ crm: z.literal("hubspot") });

const slackSchema = z.object({ crm: z.literal("slack") });

const whatsappSchema = z.object({
  crm: z.literal("whatsapp"),
  metadata: z.object({
    countryCode: z
      .string({ required_error: "Country Code is required" })
      .min(1, "Country Code is required"),
    phoneNumber: z.string({ required_error: "Phone number is required" }),
  }),
});

const shopifySchema = z.object({
  crm: z.literal("shopify"),
  metadata: z.object({
    shop: z.string().min(1, { message: "Shop name is required" }),
  }),
});

const zohoCliqSchema = z.object({ crm: z.literal("zoho-cliq") });

const reserveGoSchema = z.object({
  crm: z.literal("reserve-go"),
  metadata: z.object({
    apiKey: z.string().min(1, { message: "API key is required" }),
  }),
});
const salesHandySchema = z.object({
  crm: z.literal("sales-handy"),
  metadata: z.object({
    apiKey: z.string().min(1, { message: "API key is required" }),
  }),
});

export const integrationSchema = toTypedSchema(
  z
    .object({
      name: z
        .string({ required_error: "Name is required" })
        .min(1, "Name is required"),
      crm: z.enum([
        "sell-do",
        "zoho-crm",
        "zoho-desk",
        "zoho-bigin",
        "hubspot",
        "slack",
        "shopify",
        "zoho-cliq",
        "whatsapp",
        "sales-handy",
        "reserve-go",
      ]),
    })
    .and(
      z.discriminatedUnion("crm", [
        sellDoSchema,
        zohoCRMSchema,
        zohoDeskSchema,
        zohoBiginSchema,
        hubSpotSchema,
        slackSchema,
        shopifySchema,
        zohoCliqSchema,
        reserveGoSchema,
        salesHandySchema,
        whatsappSchema,
      ])
    )
    .superRefine((data, ctx) => {
      if (data.crm === "whatsapp") {
        const metadata = data.metadata; // Already ensured to exist

        if (!metadata) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Metadata is required for WhatsApp",
            path: ["metadata"],
          });
          return;
        }

        const { countryCode, phoneNumber } = metadata;
        console.log(countryCode, phoneNumber, "Checking country code & phone number");

        if (!countryCode) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Country Code is required",
            path: ["metadata", "countryCode"],
          });
        }

        if (!phoneNumber) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Phone number is required",
            path: ["metadata", "phoneNumber"],
          });
          return;
        }

        const lengthRequirement = getCountryLengthRequirement(countryCode);

        if (phoneNumber.length !== lengthRequirement) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: `Phone number must be exactly ${lengthRequirement} digits long.`,
            path: ["metadata", "phoneNumber"],
          });
        }
      }
    })
);

// old cod

// const sellDoSchema = z.object({
//   crm: z.literal("sell-do"),
//   metadata: z.object({
//     apiKey: z.string().min(1, { message: "API key is required" }),
//   }),
// });

// const zohoCRMSchema = z.object({
//   crm: z.literal("zoho-crm"),
// });

// const zohoBiginSchema = z.object({
//   crm: z.literal("zoho-bigin"),
// });
// const hubSpotSchema = z.object({
//   crm: z.literal("hubspot"),
// });
// const slackSchema = z.object({
//   crm: z.literal("slack"),
// });
// const whatsappSchema = z.object({
//   crm: z.literal("whatsapp"),
//   metadata: z.object({
//     countryCode: z
//       .string({ required_error: "Country Code is required" })
//       .min(1, "Country Code is required"),
//     phoneNumber: z.string({ required_error: "Phone number is required" }),
//   }),
// });

// const shopifySchema = z.object({
//   crm: z.literal("shopify"),
//   metadata: z.object({
//     shop: z.string().min(1, { message: "Shop name is required" }),
//   }),
// });
// const zohoCliqSchema = z.object({
//   crm: z.literal("zoho-cliq"),
// });
// const reserveGoSchema = z.object({
//   crm: z.literal("reserve-go"),
//   metadata: z.object({
//     apiKey: z.string().min(1, { message: "API key is required" }),
//   }),
// });

// export const integrationSchema = toTypedSchema(
//   z
//     .object({
//       name: z
//         .string({ required_error: "Name is required" })
//         .min(1, "Name is required"),
//       crm: z
//         .enum([
//           "sell-do",
//           "zoho-crm",
//           "zoho-bigin",
//           "hubspot",
//           "slack",
//           "shopify",
//           "zoho-cliq",
//           "whatsapp",
//           "reserve-go",
//         ])
//         .refine(
//           (
//             value,
//           ): value is
//             | "sell-do"
//             | "zoho-crm"
//             | "zoho-bigin"
//             | "hubspot"
//             | "slack"
//             | "shopify"
//             | "zoho-cliq"
//             | "whatsapp"
//             | "reserve-go" => true,
//           {
//             message: "CRM type is required",
//           },
//         ),
//     })
//     .and(
//       z.discriminatedUnion("crm", [
//         sellDoSchema,
//         zohoCRMSchema,
//         zohoBiginSchema,
//         hubSpotSchema,
//         slackSchema,
//         shopifySchema,
//         zohoCliqSchema,
//         reserveGoSchema,
//         whatsappSchema,
//       ]),
//     ).superRefine((data, ctx) => {
//       // Ensure metadata exists before accessing its properties
//       if (data.crm === "whatsapp") {
//         if (!data.metadata) {
//           ctx.addIssue({
//             code: z.ZodIssueCode.custom,
//             message: "Metadata is required for WhatsApp",
//             path: ["metadata"],
//           });
//           return;
//         }

//         const { countryCode, phoneNumber } = data.metadata;
//         console.log(countryCode, phoneNumber, "countryCode, phoneNumber --- countryCode, phoneNumber");
//         // Ensure countryCode and phoneNumber exist before validation
//         if (!countryCode) {
//           ctx.addIssue({
//             code: z.ZodIssueCode.custom,
//             message: "Country Code is required",
//             path: ["metadata", "countryCode"],
//           });
//         }

//         if (!phoneNumber) {
//           ctx.addIssue({
//             code: z.ZodIssueCode.custom,
//             message: "Phone number is required",
//             path: ["metadata", "phoneNumber"],
//           });
//           return;
//         }

//         const lengthRequirement = getCountryLengthRequirement(countryCode);

//         if (phoneNumber.length !== lengthRequirement) {
//           ctx.addIssue({
//             code: z.ZodIssueCode.custom,
//             message: `Number must be exactly ${lengthRequirement} characters long.`,
//             path: ["metadata", "phoneNumber"],
//           });
//         }
//       }
//     }),
// );