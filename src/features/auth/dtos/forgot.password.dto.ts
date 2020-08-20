import { IsNotEmpty, IsAlphanumeric, IsString, Length } from 'class-validator';
import ResetPasswordDTO from '../../user/dtos/reset.uset.password.dto';

export default class ResetPasswordWithCodeDTO extends ResetPasswordDTO {
  @IsNotEmpty()
  @IsString()
  identificator: string;

  @IsNotEmpty()
  @IsString()
  oobCode: string;
}
