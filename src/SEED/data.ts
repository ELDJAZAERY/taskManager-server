import UserRolesEnum from '../features/user/enums/roles.Enum';

const Users = [
  {
    identificator: 'admin',

    email: 'admin@gmail.com',

    role: UserRolesEnum.ADMIN,

    isMailConfirmed: true,

    mailTokenSecretKey: '',

    isActivated: true,

    password: 'password',

    confirmPassword: 'password'
  }
];

export { Users };
