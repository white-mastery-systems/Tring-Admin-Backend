export const assetsValidation = z.object({
  name: z.string().min(1, { message: "name is required" }),
});
