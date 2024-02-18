import nodemailer from "nodemailer";
import config from "../config";



export const sendEmail =async () => {
    const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: config.NODE_ENV === 'production',
        auth: {
          // TODO: replace `user` and `pass` values from <https://forwardemail.net>
          user: "rakibhasanoyoniu@gmail.com",
          pass: "fllb fuct vvfg sczg",
        },
      });
      await transporter.sendMail({
        from: 'rakibhasanoyoniu@gmail.com', // sender address
        to: "rakibhasancse07@gmail.com", // list of receivers
        subject: "Password Change", // Subject line
        text: "Hello password vule geso?", // plain text body
        html: "<b>Hello world?</b>", // html body
      });
}