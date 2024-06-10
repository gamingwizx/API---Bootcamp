const nodemailer = require("nodemailer")

const sendEmail = async (options) => {
  const transport = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    auth: {
      user: process.env.SMTP_USERNAME,
      pass: process.env.SMTP_PASSWORD
    }
  })

  options.from = `${process.env.MAIL_FROM_NAME} <${process.env.MAIL_FROM_EMAIL}>`

  const info = await transport.sendMail(options)

  console.log(`Successfully sent message: ${info.messageId}`)
}

module.exports = { sendEmail }
