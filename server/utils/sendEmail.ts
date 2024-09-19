import nodemailer from "nodemailer"

const config = useRuntimeConfig();

const sendEmail = (to: string, subject: string, message: any) => {
  try {
    console.log({ user: config.nodemailerUser , pass: config.nodemailerPass})
    const transporter = nodemailer.createTransport({
      host: "lin.ezveb.com",
      port: 465,
      secure: true,
      auth: {
        user: config.nodemailerUser,
        pass: config.nodemailerPass,
      },
    })

    const mailOptions = {
      from: config.nodemailerUser,
      to,
      subject,
      html: message,
    }

    const response = transporter.sendMail( mailOptions, async (error, info) => {
      if (error) {
        throw new Error(error)
      } else {
        return info
      }
    })
    return response
  } catch (err) {
    console.error(err)
  }
}

export default sendEmail
