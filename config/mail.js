const nodemailer = require("nodemailer");


const transporter = nodemailer.createTransport({
    host: process.env.MAIL_HOST,
    port: process.env.MAIL_PORT,
    // secure:true,
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASS,
    },
  });


const mail = async ({subject,text,html,to}) =>{

    const info = await transporter.sendMail({
        from:`"Nodemailer" <${process.env.MAIL_EMAIL}>` , // sender address
        to: to, // list of receivers
        subject: subject, // Subject line
        text: text, // plain text body
        html: html, // html body
      });
    
      console.log("Message sent: %s", info.messageId);

}

module.exports = mail;