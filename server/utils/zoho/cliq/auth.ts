import { logger } from "~/server/logger";

const cliqClientId = "1000.K0KXY300LK9C1SEEXNQG4P5I37YG4I"
const cliqClientSecret = "7e4c8513874736a4273a2eb2f2fd8dcf5e9d822867"

export const generateCliqAccessToken = async (body: any) => {
  try {
    const response = await $fetch(`https://accounts.zoho.in/oauth/v2/token?code=${body.metadata.code}&client_id=${cliqClientId}&redirect_uri=${process.env.REDIRECT_URL}/${body.crm}&grant_type=authorization_code&client_secret=${cliqClientSecret}`, 
      { method: "POST" }
    )
    return response
  } catch(error) {
     logger.error(`generateCliqAccessToken: ${JSON.stringify(error)}`)
  }
}

export const regenerateCliqAccessToken = async (refreshToken: string) => {
  try {
     const response = await $fetch(`https://accounts.zoho.in/oauth/v2/token?client_id=${cliqClientId}&grant_type=refresh_token&client_secret=${cliqClientSecret}&refresh_token=${refreshToken}`, 
      { method: "POST" }
    )
    return response
  } catch(error) {
     logger.error(`regenerateCliqAccessToken: ${JSON.stringify(error)}`)
  }
}
