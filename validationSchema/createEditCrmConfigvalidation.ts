export const createEditCRMConfigValidation = z.object({
  integrationId: z.string().min(1, { message: "CRM is required" }),
  campaignId: z.string().optional(),
  projectId: z.string().optional(),
  pipelineId: z.string().optional(),
  layoutId: z.string().optional(),
  stageId: z.string().optional(),
  subPipeline: z.string().optional(),
  stage: z.string().optional(),
});