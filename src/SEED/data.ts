import UserRolesEnum from "../features/user/enums/roles.Enum";

const Users = [
  {
    identificator: "admin",

    email: "admin@gmail.com",

    role: UserRolesEnum.ADMIN,

    isMailConfirmed: true,

    mailTokenSecretKey: "",

    isActivated: true,

    password: "password",

    confirmPassword: "password",
  },
  {
    identificator: "developer",

    email: "developer@gmail.com",

    role: UserRolesEnum.DEVELOPER,

    isMailConfirmed: true,

    mailTokenSecretKey: "",

    isActivated: true,

    password: "password",

    confirmPassword: "password",
  },
  {
    identificator: "designer",

    email: "designer@gmail.com",

    role: UserRolesEnum.DESIGNER,

    isMailConfirmed: true,

    mailTokenSecretKey: "",

    isActivated: true,

    password: "password",

    confirmPassword: "password",
  },
  {
    identificator: "data.scientist",

    email: "data.scientist@gmail.com",

    role: UserRolesEnum.DATA_SCIENTIST,

    isMailConfirmed: true,

    mailTokenSecretKey: "",

    isActivated: true,

    password: "password",

    confirmPassword: "password",
  },
  {
    identificator: "financial.engineer",

    email: "financial.engineer@gmail.com",

    role: UserRolesEnum.FINANCIAL_ENGINEER,

    isMailConfirmed: true,

    mailTokenSecretKey: "",

    isActivated: true,

    password: "password",

    confirmPassword: "password",
  },
  {
    identificator: "technical.audit",

    email: "technical.audit@gmail.com",

    role: UserRolesEnum.TECHNICAL_AUDIT,

    isMailConfirmed: true,

    mailTokenSecretKey: "",

    isActivated: true,

    password: "password",

    confirmPassword: "password",
  },
];

export { Users };
