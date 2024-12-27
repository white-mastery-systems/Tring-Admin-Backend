import { z } from "zod";

export const createEditCRMConfigValidation = z
  .object({
    integrationId: z.string({required_error: "Connected communication is required"}).min(1, { message: "Connected communication is required" }),
    channelId: z.string({required_error: "Channel ID is required"}).min(1, {message: "Channel ID is required for Zoho Bigin."}).optional(),
  })