import fs from "fs"
import path from "path"
import yaml from "js-yaml"
import Handlebars from "handlebars"
import { logger } from "~/server/logger"
import { getIntentByName } from "~/server/utils/db/bot"

export default defineEventHandler(async (event) => {
  try {
      const body = await isValidBodyHandler(event, z.object({
        botUser: z.any(),
        botId: z.string().uuid(),
        intent: z.string(),
        dateAndTime: z.string(),
        formValues: z.record(z.any()).optional()
      }))
   
      const botDetails = await getBotDetails(body.botId);
      const organizationId = botDetails?.organizationId !
      
      const orgBotIntent = await getIntentByName(organizationId, body.botId, body.intent)
      
      if(!orgBotIntent?.isEmailEnabled) return
      
      const organization = await getAdminByOrgId(organizationId)
      const { template: intentEmailTemplate, subject: intentSubject } = getIntentEmailTemplate(body.intent)

      // return { intentSubject}
      let datePart, timePart
      if(body?.dateAndTime) {
        const dateTimePart = body?.dateAndTime.split("on ")[1]; // "October 4, 2024 - 02:30 PM"
        [datePart, timePart] = dateTimePart.split(" - "); // ["October 4, 2024", "02:30 PM" ]
      }
      let textContent 
      if(body?.intent === "form") {
        textContent = Object.entries(body?.formValues)
        .map(([key, value]) => `${key}: ${value}`)
        .join('\n');
      }

      // console.log({ textContent })
      
      const dynamicaValues = {
        business_owner_name: organization?.username,
        user_email: body?.botUser?.email,
        user_name: body?.botUser?.name,
        user_phone: body?.botUser?.mobile,
        chatbot_name: botDetails?.name,
        location_link: orgBotIntent?.link,
        virtual_tour_link: orgBotIntent?.link,
        preferred_date: datePart || undefined,
        preferred_time: timePart || undefined,
        form_details: textContent ? textContent.replace(/\n/g, '<br />') : undefined
      };
      
      const templateData = Handlebars.compile(intentEmailTemplate)
      
      const emailTemplateWithValues = templateData(dynamicaValues)
   
      const emailRecipients: any = orgBotIntent.emailRecipients && orgBotIntent.emailRecipients.length ? [...orgBotIntent.emailRecipients, organization?.email] : [ organization?.email ]

      // return { emailRecipients }
   
      sendEmail(emailRecipients, intentSubject, emailTemplateWithValues)
   
      return true
   } catch (error: any) {
      logger.error(`Error: sendEmailTemplate, ${error.message}`)
   }
})


const getIntentEmailTemplate = (intent: string) => {
   const yamlFilePath = path.resolve('./assets/emailTemplates/intents.yaml')

   const readYamlFile = fs.readFileSync(yamlFilePath, "utf8")
   const parsedYamlIntent: any = yaml.load(readYamlFile)

   let template, subject

   switch(intent) {
      case "location":
        template = parsedYamlIntent.LocationInteractionTemplate
        subject = parsedYamlIntent.LocationInteractionSubject
        break
      
      case "virtual_tour":
        template = parsedYamlIntent.VirtualTourInteractionTemplate
        subject = parsedYamlIntent.VirtualTourInteractionSubject
        break

      case "schedule_call":
        template = parsedYamlIntent.ScheduleCallRequestTemplate
        subject = parsedYamlIntent.ScheduleCallRequestSubject
        break

      case "site_visit":
        template = parsedYamlIntent.ScheduleSiteVisitRequestTemplate
        subject = parsedYamlIntent.ScheduleSiteVisitRequestSubject
        break

      case "images":
        template = parsedYamlIntent.ImagesViewedTemplate
        subject = parsedYamlIntent.ImagesViewedSubject
        break

      case "brochures":
        template = parsedYamlIntent.BrochureDownloadedTemplate
        subject = parsedYamlIntent.BrochureDownloadedSubject
        break

      case "form":
        template = parsedYamlIntent.FormSubmissionTemplate
        subject = parsedYamlIntent.FormSubmissionSubject
        break
   }

   return {
      template,
      subject
   }
}