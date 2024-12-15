const nodemailer = require("nodemailer");

const config = require("../config")
const transporter = nodemailer.createTransport({
  host: config.mail.host,
  port: config.mail.port,
  secure: config.mail.secure, // true for port 465, false for other ports
  auth: {
    user: config.mail.auth.user,
    pass: config.mail.auth.pass,
  },
});

module.exports = transporter