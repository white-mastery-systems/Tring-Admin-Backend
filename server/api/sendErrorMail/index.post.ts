import { logger } from "~/server/logger"

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    let recipients = [
      "habeeb@whitemastery.com",
      "purushothaman@whitemastery.com",
      "joseph@whitemastery.com",
      "dhanalakshmi@whitemastery.com",
      "sathish@whitemastery.com",
      "naveenkumar@whitemastery.com",
    ];
    if(body?.envType === "production") {
      recipients.push("rianozal@gmail.com")
    }
    logger.info(`send email for LLM server failed", recipients:[${recipients}], req_body: ${JSON.stringify(body)}` )
    const errorMessage = body?.message
    const subject = body?.messageTitle
    sendEmail(recipients, subject, errorMessage)
    return { status: true }
  } catch(error) {
    logger.error(`Error: send error mail, ${error}`)
    return { status: false }
  }
})