import nodemailer from "nodemailer"

const config = useRuntimeConfig();

const sendEmail = (to: string, subject: string, message: any) => {
  try {
    return new Promise((resolve) => {
      console.log({ user: config?.nodemailerUser , pass: config?.nodemailerPass})
      const transporter = nodemailer.createTransport({
        host: "lin.ezveb.com",
        port: 465,
        secure: true,
        auth: {
          user: config?.nodemailerUser,
          pass: config?.nodemailerPass,
        },
      })

      const mailOptions = {
        from: config?.nodemailerUser,
        to,
        subject,
        html: message,
      }

    transporter.sendMail(mailOptions, (error) => {
      if (error) resolve({ status: false })
      else resolve({ status: true })
    })
  })
  } catch (err) {
    console.error(err)
    return { status: false }
  }
}

export default sendEmail
