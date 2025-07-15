import { logger } from "../logger"
import { errorResponse } from "../response/error.response"
import { getAllUsers } from "../utils/db/user"
import { getAllVoicebots } from "../utils/db/voicebots"

export default defineEventHandler(async (event) => {
  try {
    const query = await isValidQueryHandler(event, z.object({
      key: z.string(),
      page: z.string().optional(),
      limit: z.string().optional(),
    }))

    if(query.key !== "sk_9a7bf65bcf599efb0e8b5e06c8972ae4abb64e9ce1088759") {
      return errorResponse(event, 400, "Invalid key provided")
    }
    let page, offset, limit = 0;

    if (query?.page && query?.limit) {
      page = parseInt(query.page);
      limit = parseInt(query.limit);
      offset = (page - 1) * limit;
    }

    let data: any = await getAllVoicebots()
    const userList = await getAllUsers()

    data = data.map((voicebot: any) => {
      const userDetail = userList.find((user: any) => user.organizationId === voicebot.organizationId)
      return {
        id: voicebot.id,
        voicebotName: voicebot.name,
        incomingPhonenumber: voicebot.incomingPhoneNumber,
        adminDetail: {
          username: userDetail?.username || "N/A",
          email: userDetail?.email || "N/A",
        },
        organization: voicebot.organization,
        ivrConfigDetail: voicebot.ivrConfigDetail
      }
    })
    
    if (query?.page && query?.limit) {
      const paginatedVoicebots = data.slice(offset, offset + limit);
      return {
        page: page,
        limit: limit,
        totalPageCount: Math.ceil(data.length / limit) || 1,
        totalCount: data.length,
        data: paginatedVoicebots,
      };
    } else {
      return data
    }
    
  } catch (error: any) {
    logger.error(`Get All Voicebots API Error: ${JSON.stringify(error.message)}`)
    return errorResponse(event, 500, "Unable to fetch voicebots")
  }
})