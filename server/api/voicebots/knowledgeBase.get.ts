import { logger } from "~/server/logger"
import { errorResponse } from "~/server/response/error.response"
import { ecommerceSampleKnowledgeBase } from "~/server/utils/sampleKnowledgeBase/e-commerce"
import { energyUtilitiesSampleKnowledgeBase } from "~/server/utils/sampleKnowledgeBase/energy-utilities"
import { financAndBankingSampleKnowledgeBase } from "~/server/utils/sampleKnowledgeBase/finance-banking"
import { governmentSectorSampleKnowledgeBase } from "~/server/utils/sampleKnowledgeBase/government-sectors"
import { healthcareSampleKnowledgeBase } from "~/server/utils/sampleKnowledgeBase/healthcare"
import { hospitalitySampleKnowledgeBase } from "~/server/utils/sampleKnowledgeBase/hospitality"
import { logisticsSampleKnowledgeBase } from "~/server/utils/sampleKnowledgeBase/logistics"
import { realEstateSampleKnowledgeBase } from "~/server/utils/sampleKnowledgeBase/real-estate"
import { telecommunicationsSampleKnowledgeBase } from "~/server/utils/sampleKnowledgeBase/telecommunications"
import { travelSampleKnowledgeBase } from "~/server/utils/sampleKnowledgeBase/travel"

export default defineEventHandler(async (event) => {
  try {
    isOrganizationAdminHandler(event)
    const query = await isValidQueryHandler(event, z.object({
      industryType:  z.enum([  
        "real-estate",
        "government-sectors",
        "finance-banking",
        "healthcare",
        "e-commerce",
        "energy-utilities",
        "telecommunications",
        "travel",
        "hospitality",
        "logistics",
        "education-training"
      ])
    }))

    let knowledgeBase = ""
    switch(query.industryType) {
      case "real-estate": 
        knowledgeBase = realEstateSampleKnowledgeBase()
        break

      case "e-commerce":
        knowledgeBase = ecommerceSampleKnowledgeBase()
        break
     
      case "finance-banking":
         knowledgeBase = financAndBankingSampleKnowledgeBase()
        break
     
     case "healthcare":
        knowledgeBase = healthcareSampleKnowledgeBase()
        break

      case "hospitality":
         knowledgeBase = hospitalitySampleKnowledgeBase()
         break
     
      case "telecommunications":
        knowledgeBase = telecommunicationsSampleKnowledgeBase()
         break
 
      case "travel":
        knowledgeBase = travelSampleKnowledgeBase()
        break
 
      case "energy-utilities":
        knowledgeBase = energyUtilitiesSampleKnowledgeBase()
        break
 
      case "government-sectors":
        knowledgeBase = governmentSectorSampleKnowledgeBase()
        break
      
      case "logistics":
      knowledgeBase = logisticsSampleKnowledgeBase()
      break
    }

    return {
      knowledgeBase
    }
  } catch (error: any) {
    logger.error(`Voicebot get sample knowledgebase API Error: ${JSON.stringify(error.message)}`)
    return errorResponse(event, 500, "Unable to get sample voicebot knowledgebase")
  }
})