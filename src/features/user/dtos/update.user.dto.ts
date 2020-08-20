import { IsString, IsNotEmpty, IsBoolean, IsEnum } from 'class-validator';
import UserRolesEnum from '../enums/roles.Enum';

export default class UpdateUserDTO {
  @IsNotEmpty()
  @IsEnum(UserRolesEnum)
  role: UserRolesEnum;

  @IsNotEmpty()
  @IsBoolean()
  isActivated: boolean;
}
