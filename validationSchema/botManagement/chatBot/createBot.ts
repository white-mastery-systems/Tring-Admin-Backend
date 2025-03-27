const logoAsString = z.string({required_error: "Logo is required"}).min(1, "Logo is required");
const logoAsObject = z.object({
  url: z.string({ required_error: "Logo is required" }).min(1, "Logo is required"),
});

export const botCreateSchema = toTypedSchema(
  z.object({
    BotName: z.string({ required_error: "Bot name is required" }).min(3, "Bot name must be at least 3 characters."),
    NAME: z.string({ required_error: "Agent name is required" })
      .min(3, "Agent name be at least 3 characters."),
    COMPANY: z.string({ required_error: "Company name is required" }).min(3, "Company name must be at least 3 characters."),
    color: z.string({ required_error: "Primary color is required"}).min(1, "Primary color is required"),
    selectedType: z.string().optional(),
    secondaryColor: z.string({ required_error: "Secondary color is required" }).min(1, "Secondary color is required"),
    logo: z.union([logoAsString, logoAsObject]),
    type: z.string({ required_error: "Type is required" }).min(2, "Type is required."),
    ROLE: z.string().min(2, "Role is required"),
    GOAL: z.string().optional(),
    // industry: z.string().min(2, "Industry type must be at least 2 characters."),
    otherRole: z.string().optional(),
    otherGoal: z.string().optional(),
  }));