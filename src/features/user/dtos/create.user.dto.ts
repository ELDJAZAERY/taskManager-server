import {
  IsString,
  IsNotEmpty,
  IsBoolean,
  IsEnum,
  IsAlphanumeric,
  IsEmail,
  IsOptional
} from 'class-validator';

import UserRolesEnum from '../enums/roles.Enum';

export default class CreateUserDTO {
  @IsNotEmpty()
  @IsString()
  identificator: string;

  @IsNotEmpty()
  @IsString()
  @IsEmail()
  email: string;

  @IsOptional()
  @IsEnum(UserRolesEnum)
  role?: UserRolesEnum;

  @IsOptional()
  @IsBoolean()
  isActivated?: boolean;

  @IsNotEmpty()
  @IsAlphanumeric()
  password: string;

  @IsNotEmpty()
  @IsString()
  confirmPassword: string;
}
