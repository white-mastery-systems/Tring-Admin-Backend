export const formSchemaPayment = toTypedSchema(
  z.object({
    cardHolderName: z.string({ required_error: "Card Holder Name is required" }).min(2, "Name must be at least 2 characters long."),
    cardNumber: z.string({ required_error: "Card Number is required" }).regex(/^\d{16}$/, "Card Number must be 16 digits."),
    expiry: z.string({ required_error: "Expiry date is required" }).regex(/^(0[1-9]|1[0-2])\/(\d{2})$/, "Expiry must be in MM/YY format."),
    cvv: z.string({ required_error: "CVV is required" }).regex(/^\d{3,4}$/, "CVV must be 3 or 4 digits."),
    country: z.string({ required_error: "Country is required" }).min(2, "Country must be at least 2 characters long."),
  })
);