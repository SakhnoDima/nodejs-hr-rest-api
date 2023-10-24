const nodemailer = require("nodemailer");
require("dotenv").config();

const transport = nodemailer.createTransport({
  host: "smtp.meta.ua",
  secureConnection: true,
  port: 465,
  auth: {
    user: process.env.META_USER,
    pass: process.env.META_PASS,
  },
});

const mailSender = async (data) => {
  const email = {
    ...data,
    from: process.env.META_USER,
  };

  await transport
    .sendMail(email)
    .then(() => console.log(`Email to ${data.to} was sended`))
    .catch((error) => console.log(error));
};

module.exports = mailSender;
