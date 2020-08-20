import { Request, Response, NextFunction } from 'express';
import HttpException from '../exceptions/httpException';
import { HttpStatusCode } from '../shared';
import JWTGenerator from '../utils/jwtGenerator';
import { IUser } from '../features/user';
import { getIUser } from '../features/user/helpers/user.manager';

export default async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> => {
  const tokenHeader: string = (req.headers['x-access-token'] ||
    req.headers['authorization']) as string;

  const idFromHeaders = req.headers['identificator'];

  const token: string =
    tokenHeader &&
    tokenHeader.split(' ')[0] === 'Bearer' &&
    tokenHeader.split(' ')[1]
      ? tokenHeader.split(' ')[1]
      : 'invalide Token';

  const { identificator: idFromToken } = JWTGenerator.verify(token);

  if (
    idFromHeaders &&
    idFromToken &&
    idFromToken.toLowerCase() === (idFromHeaders as string).toLowerCase()
  ) {
    const iUser: IUser | undefined = await getIUser(idFromToken);
    if (iUser && iUser.isActivated) {
      (req as any).iUser = iUser;
      return next();
    }
  }

  return next(
    new HttpException(HttpStatusCode.UNAUTHORIZED, 'Unauthorized User')
  );
};
