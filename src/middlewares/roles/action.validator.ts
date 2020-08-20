import * as express from 'express';
import HttpException from '../../exceptions/httpException';
import { HttpStatusCode } from '../../shared';
import IUser from '../../features/user/interfaces/Iuser.interface';
import ActionRoleEnum from './action.enum';
import UserRolesEnum from '../../features/user/enums/roles.Enum';

function actionValidator<T>(action: ActionRoleEnum): express.RequestHandler {
  return async (req: any, res: any, next: any): Promise<void> => {
    if (await checkRole(req, res, action)) {
      next();
    } else {
      next(
        new HttpException(
          HttpStatusCode.FORBIDDEN,
          'Permission denied, please contact your admin'
        )
      );
    }
  };
}

const checkRole = async (
  req: any,
  res: any,
  action: ActionRoleEnum
): Promise<boolean> => {
  const iUser: IUser = req.iUser;

  switch (action) {
    case ActionRoleEnum.ADMIN:
      return iUser && iUser.isActivated && iUser.role === UserRolesEnum.ADMIN;

    case ActionRoleEnum.SELFISH:
      return (
        iUser &&
        iUser.isActivated &&
        (iUser.role === UserRolesEnum.ADMIN ||
          req.params.identificator === req.iUser.identificator)
      );

    case ActionRoleEnum.BASIC:
      return iUser && iUser.isActivated && true;

    default:
      return false;
  }
};

export default actionValidator;
