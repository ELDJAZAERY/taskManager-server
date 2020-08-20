import { IsNotEmpty, IsAlphanumeric, IsString, Length } from 'class-validator';

export default class ConfirmMailDTO {
  @IsNotEmpty()
  @IsString()
  identificator: string;

  @IsNotEmpty()
  @IsString()
  token: string;
}
