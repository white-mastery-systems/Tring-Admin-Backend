import { intentDescriptions } from "~/server/utils/v2/db/chatbot";
import { logger } from "~/server/logger"

const db = useDrizzle()

export const updateChatbotSchdeuleForms = async () => {
  try {
    const defaultIntents = ["schedule_call", "schedule_appointment", "site_visit"]

    const chatbotIds = await db.query.chatBotSchema.findMany({})

    // Prepare intent records
    const intentData = chatbotIds.flatMap((bot: any) =>
      defaultIntents.map((intent) => ({
        type: "schedule_form",
        intent,
        metadata: {
          traditionalForm: true,
          naturalConversation: false
        },
        description: intentDescriptions[intent] || "",
        botId: bot.id,
        organizationId: bot.organizationId!
      }))
    );
    
    // return intentData
    await createBotIntent(intentData);
  } catch (error: any)  {
    logger.info(`Contact migration Error: ${JSON.stringify(error.message)}`)
    throw new Error(error)
  }
}

export const migrateExistingContactsIntoNewTables = async () => {
  try {
    const oldContacts = await db.query.voicebotContactSchema.findMany({}) // voices
    // const oldContacts = await db.query.contactSchema.findMany({}) // chats

    const oldContactPhoneNumbers = oldContacts.map((i) => i.phone);
    const orgIds = [...new Set(oldContacts.map((i) => i.organizationId))];

    // Get all existing new contacts that match by orgId + phoneNumber
    const existingNewContacts = await db.query.contactProfileSchema.findMany({
      where: and(
        inArray(contactProfileSchema.organizationId, orgIds),
        inArray(contactProfileSchema.phoneNumber, oldContactPhoneNumbers)
      ),
    });

    // Create a Set of "orgId|phoneNumber" to identify duplicates
    const existingKeys = new Set(
      existingNewContacts.map(
        (c) => `${c.organizationId}|${c.phoneNumber}`
      )
    );

    // Filter out contacts that already exist in new table
    const distinctNewContacts = oldContacts.filter((contact) => {
      const key = `${contact.organizationId}|${contact.phone}`;
      return !existingKeys.has(key);
    });

    // return { oldContacts: oldContacts.length, distinctNewContacts: distinctNewContacts[0] }

    const mapData = distinctNewContacts.map((i) => {
      return {
        name: i.name,
        countryCode: i?.countryCode,
        phoneNumber: i?.phone,
        source: "manual",
        organizationId: i.organizationId
      }
    })

    await addContact(mapData)

    return true

  } catch (error: any) {
    logger.info(`Contact migration Error: ${JSON.stringify(error.message)}`)
    throw new Error(error)
  }
}

export const updateBotIndustries = async () => {
  try {
    const chatbotData = await db.query.chatBotSchema.findMany({
      where: (
        and(
          ne(chatBotSchema.type, "others"),
          ne(chatBotSchema.type, "travel-hospitality"),
          eq(chatBotSchema.isDeleted, false),
          isNotNull(chatBotSchema.industryId)
        )
      ),
      columns: {
        id: true,
        type: true
      },
      limit: 10
    })
  
    const industriesList = await db.query.industriesSchema.findMany({
      where: eq(industriesSchema.isDefault, true)
    })
  
    for(const i of chatbotData) {
      const industries = industriesList.find((j)=> j.industryName === i.type)
      // console.log({ chatbotId: i.id })
      await updateBotDetails(i.id, { industryId: industries?.id })
    }
    return { chatbots: chatbotData.length, industries: industriesList.length }
  } catch (error: any) {
    logger.info(`Update industries for all bots Error: ${JSON.stringify(error.message)}`)
    throw new Error(error)
  }
}

export const migrateOrgSubscriptions = async () => {
 try {
    const productionClient = [
      "1ac2b4d6-0019-4059-92f8-0851409e8b2d", // bdcode
      "27d86344-c0fa-4ac1-a2e0-9db7eb507e27", // yourstore
      "0f6623a1-ab08-44e7-b012-670611fb46a6", // sales@tringlabs.ai
      "b7a885aa-92e5-486a-8cc8-dbfe740d5b1a", // marketing@tringlabs.ai
      "23e82d6a-89c8-45fb-a772-c0c5505feee3", // administrator@sis.in
      "52e49185-410e-41cc-aa51-c941bea4373a", // celebrations@etenia.in
      "6aa749a2-9e46-442e-86b5-714ef85f91c8", // gm@thekaavu.in
      "0ec52550-8c93-4548-80fe-926247d4e5e6", // internal@anka.lk
      "f70e6522-ea42-4fe1-9191-f1b4029ab0f7", // menasales@tringlabs.ai
      "96b79c39-ca6d-49ce-adcf-fbb45ef72bda", // noeltringai@yopmail.com
      "1f33bfc2-7be0-4005-a1ba-8a98370415df", // drp.pravin@gmail.com
      "d4c15f32-a635-4da3-9c1d-3fe70564ebd5", // debesh@offineeds.com
      "570c5de3-34b9-49ba-9998-daf19f11c7a5", // rishit.vaish@hex64.net
      "199b95ae-37be-40be-918b-c7ab5bb52093", // keerthipromoters@gmail.com
      "fd634730-4d78-4211-b07c-99516a5481b6", // tech@startuptn.in
      "b3d67701-ac1a-49dd-8f3d-67404b03c4cd", // crownbullacademyandtrader@gmail.com
      "05338af7-97ba-4be9-9677-c0e3595612d4", // sunilchandar.ps@gallabox.com
      "rian@whitemastery.com", // rian@whitemastery.com
      "nahoumraphael@gmail.com", // nahoumraphael@gmail.com
      "vedansh@natturz.com", // vedansh@natturz.com,
      "harshita.arenajayanagar@gmail.com", // harshita.arenajayanagar@gmail.com
      "accounts@uniabroad.co.in", // accounts@uniabroad.co.in
    ]

    // return productionClient 
    const oldAdminSubscription = await db.query.orgSubscriptionSchema.findMany({
      where: inArray(orgSubscriptionSchema.organizationId, productionClient)
    })
    
    // return oldAdminSubscription.length

    const mapAdminSubscriptionData = oldAdminSubscription.map((i) => {
      return {
        organizationId: i.organizationId,
        serviceType: i.botType,
        subscriptionId: i.subscriptionId ?? null,
        pricingPlanCode: i.planCode,
        subscriptionStatus: i.status,
        startDate: i.subscriptionCreatedDate ? new Date(i.subscriptionCreatedDate) : null,
        endDate: i.expiryDate ? new Date(i.expiryDate) : null,
      }
    })

    const mapAdminPlanUsages = oldAdminSubscription.map((j)=> {
      return {
        organizationId: j.organizationId,
        serviceType: j.botType,
        subscriptionId: j.subscriptionId ?? null,
        pricingPlanCode: j.planCode ?? null,
        subscriptionStatus: j.status,
        startDate: j.subscriptionCreatedDate ? new Date(j.subscriptionCreatedDate) : null,
        endDate: j.expiryDate ? new Date(j.expiryDate) : null,
        interactionsUsed: 0,
        extraInteractionsUsed: 0,
        whatsappSessionsUsed: 0
      }
    })

    return { oldAdminSubscription, mapAdminSubscriptionData, mapAdminPlanUsages }

    // const adminSubscriptionInsertion = await createOrgZohoSubscription(mapAdminSubscriptionData)

    // const adminPlanUsageInsertion = await createSubscriptionPlanUsage(mapAdminPlanUsages)


  } catch(error: any) {
    logger.error(`Failed to API error: ${JSON.stringify(error.message)}`)
    throw new Error(error)
  }
}