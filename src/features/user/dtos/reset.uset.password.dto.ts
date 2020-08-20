import { IsNotEmpty, IsString, IsAlphanumeric } from 'class-validator';

export default class ResetPasswordDTO {
  @IsNotEmpty()
  @IsAlphanumeric()
  password: string;

  @IsNotEmpty()
  @IsAlphanumeric()
  confirmPassword: string;
}
