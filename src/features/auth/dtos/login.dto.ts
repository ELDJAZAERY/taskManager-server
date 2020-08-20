import { IsNotEmpty, IsAlphanumeric, IsString, Length } from 'class-validator';

export default class LoginDTO {
  @IsNotEmpty()
  @IsString()
  identificator: string;

  @IsString()
  @IsNotEmpty()
  @Length(4, 25)
  password: string;
}
