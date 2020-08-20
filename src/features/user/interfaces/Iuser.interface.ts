import UserRolesEnum from '../enums/roles.Enum';

export default interface IUser {
  id: string;

  identificator: string;

  email: string;

  role: UserRolesEnum;

  isMailConfirmed: boolean;

  isActivated: boolean;

  createdAt: Date;

  updatedAt: Date;
}
