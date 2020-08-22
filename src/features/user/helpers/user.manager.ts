import User from '../models/user.model';
import CreateUserDTO from '../dtos/create.user.dto';

import { sendMail } from '../../../shared/mailing';

import {
  confirMailTemplate,
  resetPasswordMail
} from '../../../shared/mailing';
import IUser from '../interfaces/Iuser.interface';
import config from 'config';
import HttpException from '../../../exceptions/httpException';
import { HttpStatusCode } from '../../../shared';

export const idValide = async (identificator: string): Promise<boolean> => {
  const user: User | undefined = await User.findOne({
    identificator: normalizeId(identificator)
  });
  return !!!user;
};

export const emailValid = async (email: string): Promise<boolean> => {
  const user: User | undefined = await User.findOne({
    email: normalizeId(email)
  });
  return !!!user;
};

export const KeyConstraintCheck = async (
  createUser: CreateUserDTO
): Promise<boolean> => {
  if (!(await emailValid(createUser.email))) throw 'Invalid Identifier';

  if (!(await idValide(createUser.identificator))) throw 'Invalid Email';

  return true;
};

export const normalizeId = (id: string) => id.replace(/\s/g, '').toLowerCase();

export const sendConfirmMail = async (
  identificator: string
): Promise<boolean> => {
  const user: User | undefined = await User.findOne({ identificator });
  if (!user) return false;

  const token: string = await user.getConfirmMailToken();

  const HOST: string = config.get('HOST');

  const bodyMail: string = confirMailTemplate(
    user.identificator,
    user.email,
    HOST,
    token
  );

  return sendMail(user.email, bodyMail, 'Confirmation link');
};

export const sendOodCode = async (identificator: string): Promise<boolean> => {
  const user: User | undefined = await User.findOne({ identificator });
  if (!user) return false;

  if (!user.isMailConfirmed) {
    return Promise.reject(
      new HttpException(
        HttpStatusCode.NOT_ACCEPTABLE,
        'You need to confirm your email first'
      )
    );
  }

  if (!user.isActivated) {
    return Promise.reject(
      new HttpException(
        HttpStatusCode.FORBIDDEN,
        `Your account is not active`
      )
    );
  }

  const oodCode: string = await user.generateResetPasswordOobCode();

  const HOST: string = config.get('HOST');

  const bodyMail: string = resetPasswordMail(user.identificator, oodCode, HOST);

  return sendMail(user.email, bodyMail, 'Reset Password Request');
};

export const getIUser = async (
  identificator: string
): Promise<IUser | undefined> => {
  return (await User.findOne({
    identificator: normalizeId(identificator)
  })) as IUser | undefined;
};

export const findOne = async (
  identificator: string
): Promise<User | undefined> => {
  return User.findOne({
    identificator: normalizeId(identificator)
  });
};
