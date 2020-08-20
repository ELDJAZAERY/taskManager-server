const sgMail = require('@sendgrid/mail');

import config from 'config';

export const sendMail = async (
  mail: string = 'eldjazaeryibrahim@gmail.com',
  mailBody: string,
  subject: string = 'subject',
  html?: string
): Promise<boolean> => {
  const SENDGRID_API_KEY: string = config.get('SENDGRID_API_KEY');
  const SENDGRID_SENDER: string = config.get('SENDGRID_SENDER');

  sgMail.setApiKey(SENDGRID_API_KEY);

  const msg = {
    from: SENDGRID_SENDER,
    to: mail,
    subject,
    text: mailBody,
    html
  };

  try {
    const response: any = await sgMail.send(msg);
    return !!response.statusCode;
  } catch (err) {
    console.log(
      'send Grid error ----> ',
      err.response ? err.response.body : err
    );
    return false;
  }
};
