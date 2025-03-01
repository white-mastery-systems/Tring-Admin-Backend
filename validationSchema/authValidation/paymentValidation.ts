export const formSchemaPayment = toTypedSchema(
  z.object({
    cardHolderName: z.string({ required_error: "Card Holder Name is required" }).min(2, ""),
    cardNumber: z.string({ required_error: "Card Number is required" }).regex(/^\d{16}$/, ""),
    expiry: z.string({ required_error: "Expiry date is required" }).regex(/^(0[1-9]|1[0-2])\/(\d{2})$/, ""),
    cvv: z
    .string({ required_error: "CVV is required" })
    .regex(/^\d{3,4}$/, { message: "" }),
    country: z.string({ required_error: "Country is required" }).min(2, ""),
  })
);