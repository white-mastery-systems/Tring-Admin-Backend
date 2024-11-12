export const getReservegoApikeyAndRestaurantId = async (botId: string, botType: string) => {
  let botDetails: any
  let botIntegrationList: any 
  if(botType === "chatbot") {
    botDetails = await getBotDetails(botId);
    botIntegrationList = await listBotIntegrations(botId)
  } else {
    botDetails = await getVoicebot(botId)
    botIntegrationList = await listVoiceBotIntegrations(botDetails?.organizationId, botId)
  }

  const reservegoCrm = botIntegrationList.find((i: any)=> i.integration.crm  === "reserve-go")

  if(!reservegoCrm) {
    return { status: false, message: "This bot is not integrated with reserve-go"}
  }

  const restaurantId = reservegoCrm?.metadata?.restaurantId
  const apiKey = reservegoCrm?.integration?.metadata?.apiKey

  if(!restaurantId) {
    return { status: false, message: "Reserve-go restaurantId is missing in integration-data"}
  }
  
  if(!apiKey) {
    return { status: false, message: "Reserve-go apikey is missing in integration-data"}
  }

  return { status: true, data: { restaurantId, apiKey } }
}