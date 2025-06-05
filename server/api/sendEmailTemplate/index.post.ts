import Handlebars from "handlebars"
import { logger } from "~/server/logger"
import { getIntentByName } from "~/server/utils/db/bot"
import { emailTemplates } from "~/server/utils/intents-emailTemplates"

type IntentType = "location" | "virtual_tour" | "schedule_call" | "site_visit" | "schedule_appointment" | "form";

export default defineEventHandler(async (event) => {
  try {
      const body = await isValidBodyHandler(event, z.object({
        userId: z.string(),
        botId: z.string().uuid(),
        intent: z.string(),
        dateAndTime: z.string().optional(),
        formValues: z.record(z.any()).optional()
      }))
   
      const botDetails = await getBotDetails(body.botId);
      const organizationId = botDetails?.organizationId !
      const botUserDetail = await getBotUserById(body.userId, organizationId)
      
      const orgBotIntent = await getIntentByName(organizationId, body.botId, body.intent)
      
      // if(!orgBotIntent?.isEmailEnabled) return
      
      const organization = await getAdminByOrgId(organizationId)
      const { template: intentEmailTemplate, subject: intentSubject } = getIntentEmailTemplate(body.intent as IntentType)

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
        user_email: botUserDetail?.email,
        user_name: botUserDetail?.name,
        user_phone: `${botUserDetail?.countryCode} ${botUserDetail?.mobile}`,
        chatbot_name: botDetails?.name,
        location_link: orgBotIntent?.link,
        virtual_tour_link: orgBotIntent?.link,
        preferred_date: datePart || undefined,
        preferred_time: timePart || undefined,
        form_details: textContent ? textContent.replace(/\n/g, '<br />') : undefined
      };
      
      const templateData = Handlebars.compile(intentEmailTemplate)
      
      const emailTemplateWithValues = templateData(dynamicaValues)
   
      const emailRecipients: any = botDetails?.emailRecipients && botDetails.emailRecipients.length ? [...botDetails.emailRecipients, organization?.email] : [ organization?.email ]

      // return { emailRecipients }
   
      sendEmail(emailRecipients, intentSubject, emailTemplateWithValues)
   
      return true
   } catch (error: any) {
      logger.error(`Error: sendEmailTemplate, ${error.message}`)
   }
})


const getIntentEmailTemplate = (intent: IntentType) => {
  let template, subject

  switch(intent) {
    case "location":
      template = emailTemplates.templates.LocationInteraction;
      subject = emailTemplates.subjects.LocationInteraction;
      break;
    case "virtual_tour":
      template = emailTemplates.templates.VirtualTourInteraction;
      subject = emailTemplates.subjects.VirtualTourInteraction;
      break;
    case "schedule_call":
      template = emailTemplates.templates.ScheduleCallRequest;
      subject = emailTemplates.subjects.ScheduleCallRequest;
      break;
    case "site_visit":
      template = emailTemplates.templates.ScheduleSiteVisitRequest;
      subject = emailTemplates.subjects.ScheduleSiteVisitRequest;
      break;
    case "schedule_appointment":
      template = emailTemplates.templates.ScheduleAppointmentRequest;
      subject = emailTemplates.subjects.ScheduleAppointmentRequest;
      break;
    case "form":
      template = emailTemplates.templates.FormSubmission;
      subject = emailTemplates.subjects.FormSubmission;
      break;
  }

  return {
      template,
      subject
   }
}