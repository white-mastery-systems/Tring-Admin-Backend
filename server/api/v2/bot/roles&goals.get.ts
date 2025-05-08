import { logger } from "~/server/logger";
import { errorResponse } from "~/server/response/error.response";
import { getCustomIndustrySuggestions } from "~/server/utils/custom-industry-suggestion";

export default defineEventHandler(async (event) => {
  try {
    const query = await isValidQueryHandler(event, z.object({
      industryId: z.string()
    }))

    const industryDetail = await getIndustryDetail({ industryId: query.industryId });
    const industryName = industryDetail?.industryName!
    
    if(industryDetail?.isDefault) {
      const data = chatbotConfigs[industryName.toLowerCase()];
      return data ?? {}
    } else {
      const customIndustryRolesAndGoals: any = await getCustomIndustrySuggestions(industryName)
      return customIndustryRolesAndGoals ?? {}
    }
  } catch (error: any) {
    logger.error(`Get bot roles & goals by industry API Error: ${JSON.stringify(error.message)}`)
    return errorResponse(event, 500, "Unable to fetch bot roles & goals by industry")
  }
})