// export const createEditCRMConfigValidation = z.object({
//   integrationId: z.string().min(1, { message: "CRM is required" }),
//   campaignId: z.string().optional(),
//   projectId: z.string().optional(),
//   pipelineId: z.string().optional(),
//   layoutId: z.string().optional(),
//   stageId: z.string().optional(),
//   subPipeline: z.string().optional(),
//   stage: z.string().optional(),
//   restaurantId: z.string().optional(),
// });

// import { z } from "zod";
import { z } from "zod";

export const createEditCRMConfigValidation = z
  .object({
    integrationId: z.string().min(1, { message: "CRM is required" }),
    campaignId: z.string().optional(),
    projectId: z.string().optional(),
    pipelineId: z.string().optional(),
    layoutId: z.string().optional(),
    sequenceId: z.string().optional(),
    stageId: z.string().optional(),
    subPipeline: z.string().optional(),
    stage: z.string().optional(),
    restaurantId: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    // Check required fields based on the CRM type
    if ('pipelineId' in data) {
      if (!data.pipelineId) {
        ctx.addIssue({
          code: "custom",
          path: ["pipelineId"],
          message: "Pipeline ID is required for Zoho Bigin.",
        });
      }
      if (!data.stageId) {
        ctx.addIssue({
          code: "custom",
          path: ["stageId"],
          message: "Stage ID is required for Zoho Bigin.",
        });
         if ('stageId' in data) {
        if (!data.stageId) {
          ctx.addIssue({
            code: "custom",
            path: ["stageId"],
            message: "stageId is required for HubSpot.",
          });
        }
      }
      }
    }

    if ('layoutId' in data) {
      if (!data.layoutId) {
        ctx.addIssue({
          code: "custom",
          path: ["layoutId"],
          message: "Layout ID is required for Zoho CRM.",
        });
      }
    }

    if ('campaignId' in data) {
      console.log(data, "campaignId")
      if (!data.campaignId) {
        ctx.addIssue({
          code: "custom",
          path: ["campaignId"],
          message: "Campaign ID is required for Sell-Do.",
        });
      }
      if (!data.projectId) {
        ctx.addIssue({
          code: "custom",
          path: ["projectId"],
          message: "Project ID is required for Sell-Do.",
        });
      }
    }

    if ('restaurantId' in data) {
      if (!data.restaurantId) {
        ctx.addIssue({
          code: "custom",
          path: ["restaurantId"],
          message: "Restaurant ID is required for Reserve-Go.",
        });
      }
    }
    if ('stage' in data) {
      if (!data.stage) {
        ctx.addIssue({
          code: "custom",
          path: ["stage"],
          message: "Stage is required for HubSpot.",
        });
      }
    }
  });
