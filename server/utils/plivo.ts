import { logger } from "../logger"

const config = useRuntimeConfig()

export const createSubAccountInPlivo = async ({ name }: { name: string }) => {
  try {
    const credentials = btoa(`${config.tringPlivoAuthId}:${config.tringPlivoAuthToken}`);
    const data = await $fetch(`https://api.plivo.com/v1/Account/${config.tringPlivoAuthId}/Subaccount/`, {
      method: "POST",
      headers: {
        Authorization: `Basic ${credentials}`,
      },
      body: {
        name,
        enabled: true
      }
    })
    return data
  } catch (error: any) {
    console.log({ error })
    logger.error(`CreateSubAccountInPlivo function Error: ${JSON.stringify(error.message)}`)
    throw new Error(error)
  }
}

export const listPlivoSubAccountPhoneNumbers = async ({ subAccountAuthId, subAccountAuthToken, country, page, limit } : 
  { 
    subAccountAuthId: string, 
    subAccountAuthToken: string,
    country: string,
    page: string, 
    limit: string
  }) => {
  try {
    const credentials = btoa(`${subAccountAuthId}:${subAccountAuthToken}`);
    const data: any = await $fetch(`https://api.plivo.com/v1/Account/${subAccountAuthId}/PhoneNumber/?country_iso=${country}&offset=${page}&limit=${limit}`, {
      method: "GET",
      headers: {
        Authorization: `Basic ${credentials}`,
      }
    })
    if(!data.objects) {
      throw new Error("data not found")
    }
    const phoneNumbers = data?.objects.map((i: any)=> i.number)
    return phoneNumbers
  } catch (error: any) {
    logger.error(`ListPlivoSubAccountPhoneNumbers function Error: ${JSON.stringify(error.message)}`)
    throw new Error(error)
  }
}

export const buyPhoneNumberForPlivoSubAccount = async ({ subAccountAuthId, phoneNumber }: {
  subAccountAuthId: string,
  phoneNumber: string
}) => {
  try {
    const credentials = btoa(`${config.tringPlivoAuthId}:${config.tringPlivoAuthToken}`);
    const data = await $fetch(`https://api.plivo.com/v1/Account/${config.tringPlivoAuthId}/PhoneNumber/${phoneNumber}/`, {
      method: "POST",
      headers: {
        Authorization: `Basic ${credentials}`,
      },
      body: {
        subaccount: subAccountAuthId
      }
    })
    return data
  } catch (error: any) {
    logger.error(`Buy phoneNumber for plivo sub-account function Error: ${JSON.stringify(error.message)}`)
    throw new Error(error)
  }
}