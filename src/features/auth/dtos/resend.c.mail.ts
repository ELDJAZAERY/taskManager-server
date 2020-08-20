import { IsEmail } from 'class-validator';

export default class ResendCMail {
  @IsEmail()
  email: string;
}
