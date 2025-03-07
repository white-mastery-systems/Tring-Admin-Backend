const logoAsString = z.string().min(1, "Logo is required");
const logoAsObject = z.object({
  url: z.string({ required_error: "Logo is required" }).min(1, "Logo is required"),
});

export const botCreateSchema = toTypedSchema(
  z.object({
    NAME: z.string().min(2, "Name must be at least 2 characters."),
    COMPANY: z.string().min(2, "Company name must be at least 2 characters."),
    color: z.string().min(1, "Primary color is required"),
    selectedType: z.string().optional(),
    secondaryColor: z.string().min(1, "Secondary color is required"),
    logo: z.union([logoAsString, logoAsObject]),
    type: z.string({ required_error: "Type is required" }).min(2, "Type is required."),
    ROLE: z.string().min(2, "Role is required"),
    GOAL: z.string().min(2, "GOAL is required"),
    // industry: z.string().min(2, "Industry type must be at least 2 characters."),
    otherRole: z.string().optional(),
    otherGoal: z.string().optional(),
  }));