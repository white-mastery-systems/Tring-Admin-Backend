import nodemailer from "nodemailer"
import { logger } from "~/server/logger";

const sendEmail = (to: string[] | string, subject: string, message: any) => {
  try {
    return new Promise((resolve) => {
      console.log({ user: process.env.NODEMAILER_USER , pass: process.env.NODEMAILER_PASS})
      const transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        auth: {
          user: process.env.NODEMAILER_USER,
          pass: process.env.NODEMAILER_PASS,
        },
      })

      const mailOptions = {
        from: process.env.NODEMAILER_USER,
        to,
        subject,
        html: message,
      }

    transporter.sendMail(mailOptions, (error) => {
      if (error){
         logger.error(`Error: sending mail: ${JSON.stringify(error)}`)
         resolve({ status: false })
        }
      else resolve({ status: true })
    })
  })
  } catch (err) {
    logger.error(`Error: sending mail: ${JSON.stringify(err)}`)
    return { status: false }
  }
}

export default sendEmail
