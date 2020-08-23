import { confirMailTemplate } from './mail_templates/confirm_mail';
import { resetPasswordMail } from './mail_templates/reset_oodcode';
import { taskNotification } from './mail_templates/task_done';
import { sendMail,sendNotification } from './sendGrid';


export {
  sendMail,
  confirMailTemplate,
  resetPasswordMail,
  sendNotification,
  taskNotification
};
