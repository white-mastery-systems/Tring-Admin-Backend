import schedule from "node-schedule"
import { logger } from "~/server/server"

const generateTemplateComponents = (
  body:any[],
  header?:any,
)=>{
  const components:any[] = [{
    "type": "header",
    "parameters": [
      {
        "type": "image",
        "image": {
          "link": (header)?? "https://www.sis.in/florence/assets/img/popup1-new.jpg"
        }
      }
    ]
  }]
  if(body.length){
    components.push({
      "type": "body",
      "parameters": body.map((item)=> ({"type": "text", "text": item }))
    })
  }
  return components
}

const sendWhatsappTemplateMessage = async (
  metaToken: string,
  phoneId: string,
  userPhone: string,
  templateName: string,
  components: Record<string, any>,
  language?: string,
) => {
 try{
   const body = components
  components = generateTemplateComponents([body.name, body.organization, body.project, body.number,  body.manager, body.organizationName])
  console.log({components})
  const data = await $fetch(
    `https://graph.facebook.com/v20.0/${phoneId}/messages`,
    {
      ignoreResponseError: true,
      method: "post",
      headers: {
        Authorization: `Bearer ${metaToken}`,
      },
      body: {
        messaging_product: "whatsapp",
        to: userPhone,
        type: "template",
        template: {
          name: templateName,
          language: {
            code: (language)?? "en_US"
          },
          components,
        },
      },
    },
  );
  return data
 }catch(err){
  console.log(err,'ERRRR')
 }
};

export const scheduleEvent = async (date: any, time: any, contactList: any) => {
  try {
    console.log({ contactList })
    const phoneId="361306107076548"
    const metaToken='EAAwYX9ZCRR1gBO2g5XEpsR7ZAhogIpibKW577rwe2GErcWZCQS7uPM3HPO9lsQaKVVlAV2DBBy2ltUU5ByuZCc0BwSKK4jZCZCg6xZCGA0NBKtJAvhd3rLBzf8fe3SoXxtYqaAGbdynj0cbfpOO3qz3Gpn5cF7dY5eDWPKVwkmFpQLe9ZA6ENZC6gkfy529hEAr8THdBfToWDU6uRhu1MMXxo7RUClwByaxRj748LkAVD3UzmUxxULM0pZCkTuEO4gct8y5norOPSs1gZDZD'
    // const metaToken= "EAAwYX9ZCRR1gBO2ioA7fTdz5SUSdLZAcDdHyQZCIi7dAiKkI2OVqYEgpbbY1JUTPF6FsbbvYbV4hFwZBMtehzff98JFdf2V5YFZBALLSEo0BHFYk54tii9cefhX28ZBi3XjIOaDMrpsrDW3xQcQbRv5BYCP5nZBRGXJoUSAcgPd79X0jSPtArfvSdVspKBbesISKQZDZD"
    // const phoneId= "112867458396790"
    // const userPhone= "919841513901"
    const templateName="client_follow_up_sis"
    const organization = "South India Shelters"
    const salesmanager = "Reena"
    const language = "en"

    const assigned_date = new Date(date)
    const assigned_Time = new Date(time)

    const year = assigned_date.getFullYear()
    const month = assigned_date.getUTCMonth()
    const day = assigned_date.getUTCDate()
    const hours = assigned_Time.getUTCHours()
    const minutes = assigned_Time.getUTCMinutes()

    console.log({  year, month, date: day, hour: hours, minute: minutes, tz: "UTC" })

    const event = schedule.scheduleJob({ year, month, date: day, hour: hours, minute: minutes, tz: "UTC" }, () => {
        logger.info({ level: "info", message: "Message sending..." })
        contactList.forEach(async (item: any) => {
          console.log({ item: item.phone })
          const phoneNumber = (`${item.countryCode}${item.phone}`).replace("+","")
          console.log({ phoneNumber })
           const components = {
             name: item.firstName,
             organization,
             project: "Testing",
             number: phoneNumber,
             manager: salesmanager,
             organizationName: organization,
           }
           const data = await sendWhatsappTemplateMessage(metaToken, phoneId, phoneNumber, templateName, components, language)
           console.log({ data })
        });
    })
    console.log({ event })
    if(!event) {
      return { status: false }
    }
    return { status: true }
  } catch (error: any) {
    logger.error({ level: "error", message: error.message })
    return { status: false }
  }
}