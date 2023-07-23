import { createTransport } from 'nodemailer';

import { config } from '../../../app/config/index';

export type EmailMessage = {
  from: string;
  to: any[];
  subject: string;
  replyTo?: string;
  html?: string;
  text: string;
  attachments?: any[];
};
export const NodeMailServiceAdapter = async (options: {
  description?: string;
  html: string;
  subject: string;
  to: any[];
  attachments?: any[];
}) => {
  const { attachments, to, html, subject, description } = options;

  const transporter = createTransport({
    host: config.implementations.mailSMTP.host,
    port: config.implementations.mailSMTP.port,
    secure: false, // true for 465, false for other ports
    auth: {
      user: config.implementations.mailSMTP.user, // generated ethereal user
      pass: config.implementations.mailSMTP.pass, // generated ethereal password
    },
    tls: {
      rejectUnauthorized: false,
    },
  });

  const mailOptions: EmailMessage = {
    from: `${config.datasite.name} ${config.implementations.mailSMTP.email}`, // sender address
    to,
    subject: subject,
    text: description,
    html: html,
    attachments,
  };

  await transporter.sendMail(mailOptions);
};
