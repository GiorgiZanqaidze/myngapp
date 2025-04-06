import * as nodemailer from 'nodemailer';

export async function sendEmail({ to, subject, message }) {
  const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
      user: 'your@gmail.com',
      pass: 'yourpassword',
    },
  });

  await transporter.sendMail({
    from: 'your@gmail.com',
    to,
    subject,
    text: message,
  });
}
