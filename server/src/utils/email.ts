import nodemailer from 'nodemailer';

interface IMailOptions {
  from: string;
  to: string;
  subject: string;
  text: string;
}

type TSendEmail = (options: {
  email: IMailOptions['to'];
  subject: IMailOptions['subject'];
  message: IMailOptions['text'];
}) => Promise<void>;

const sendEmail: TSendEmail = async (options) => {
  const { email, subject, message } = options;

  // 1) Create a transporter
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD,
    },
  } as nodemailer.TransportOptions);

  // 2) Define email options
  const mailOptions: IMailOptions = {
    from: 'Josh Rodriguez <hello@personalbudgetapp.com>',
    to: email,
    subject,
    text: message,
  };

  // 3) Send the email
  await transporter.sendMail(mailOptions);
};

export default sendEmail;
