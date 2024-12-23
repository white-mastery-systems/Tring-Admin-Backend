import { logger } from "../logger";

export const getAvailablePhoneNumbers = async (provider: string, metadata: any) => {
  try {
    let incomingPhoneNumber = []
    switch(provider) {
      case "twilio":
        incomingPhoneNumber = await twilioIncomingPhoneNumbers({ apiKey: metadata.apiKey, apiSecret: metadata.apiSecret, accountSid: metadata.accountSid })
        break

      case "exotel":
        incomingPhoneNumber = await exotelIncomingPhoneNumbers({ apiKey: metadata.apiKey, apiToken: metadata.apiToken, subDomain: metadata.subDomain, accountSid: metadata.accountSid })
        break
      
      case "telnyx":
        incomingPhoneNumber = await telnyxIncomingPhoneNumbers({ apiKey: metadata.apiKey })
        break

      case "sandbox": 
        incomingPhoneNumber = ["+91 100000", "+91 1001000"]
        break
    }
    return incomingPhoneNumber
  } catch (error: any) {
    logger.error(`Cloud telephony - get available phone-numbers Error, ${JSON.stringify(error.message)}`)
    throw new Error(error)
  }
}

export const twilioIncomingPhoneNumbers = async ({ apiKey, apiSecret, accountSid } : 
  { 
    apiKey: string,
    apiSecret: string,
    accountSid: string
  }) => {
  try {
    const credentials = btoa(`${apiKey}:${apiSecret}`);
    const data: any = await $fetch(`https://api.twilio.com/2010-04-01/Accounts/${accountSid}/IncomingPhoneNumbers.json`, {
      headers: {
        Authorization: `Basic ${credentials}`
      }
    })
    const phoneNumbers = await data.incoming_phone_numbers.map((i: any) => i.phone_number)
    return phoneNumbers
  } catch (error: any) {
    logger.error(`twilioIncomingPhoneNumbers Error: ${JSON.stringify(error.message)}`)
    throw new Error(error)
  }
}

export const exotelIncomingPhoneNumbers = async ({ apiKey, apiToken, subDomain, accountSid }: 
  { 
    apiKey: string, 
    apiToken: string,
    subDomain: string,
    accountSid: string
  }) => {
  try {
    const credentials = btoa(`${apiKey}:${apiToken}`);
    const data: any = await $fetch(`https://${subDomain}/v2_beta/Accounts/${accountSid}/IncomingPhoneNumbers`, {
      method: 'GET',
      headers: {
        Authorization: `Basic ${credentials}`,
      },
    })
    const phoneNumbers = await data.incoming_phone_numbers.map((i: any) => i.phone_number)
    return phoneNumbers
  } catch (error: any) {
    logger.error(`exotelIncomingPhoneNumbers Error: ${JSON.stringify(error.message)}`)
    throw new Error(error)
  }
}

export const telnyxIncomingPhoneNumbers = async ({ apiKey }: { apiKey: string }) => {
  try {
    const result: any = await $fetch(`https://api.telnyx.com/v2/phone_numbers`, {
      headers: {
        Authorization: `Bearer ${apiKey}`
      }
    })
    const phoneNumbers = await result.data.map((i: any) => i.phone_number)
    return phoneNumbers
  } catch (error: any) {
    logger.error(`telnyxIncomingPhoneNumbers Error: ${JSON.stringify(error.message)}`)
    throw new Error(error)
  }
}