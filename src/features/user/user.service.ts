import HttpException from '../../exceptions/httpException';
import { HttpStatusCode } from '../../shared';
import { Like } from 'typeorm';
import UpdateUserPwdDTO from './dtos/update.user.password.dto';
import PaginationFilter, {
  PaginateObj,
  ORDER
} from '../../shared/interfaces/pagination';
import ResetPasswordDTO from './dtos/reset.uset.password.dto';
import CreateUserDTO from './dtos/create.user.dto';
import User from './models/user.model';
import {
  KeyConstraintCheck,
  normalizeId,
  sendConfirmMail,
  sendOodCode
} from './helpers/user.manager';
import UpdateUserDTO from './dtos/update.user.dto';
import ConfirmMailDTO from '../auth/dtos/confirm.mail';
import ResendCMail from '../auth/dtos/resend.c.mail';
import ResetPasswordWithCodeDTO from '../auth/dtos/forgot.password.dto';

export default class UserService {
  static createUser = async (createUserDTO: CreateUserDTO): Promise<User> => {
    try {
      // chack the id & email validity
      await KeyConstraintCheck(createUserDTO);
      let user: User = new User();
      user.preSave(createUserDTO);
      user = await user.save();

      // send confirmation e-mail
      sendConfirmMail(user.identificator);

      return user;
    } catch (err) {
      return Promise.reject(new HttpException(HttpStatusCode.BAD_REQUEST, err));
    }
  };

  static updateUser = async (
    identificator: string,
    updateUserDTO: UpdateUserDTO
  ): Promise<User> => {
    let user: User | undefined = await User.findOne({
      identificator: normalizeId(identificator)
    });

    if (user) {
      user = await user.updateBasicInfos(updateUserDTO);
      return user;
    }

    return Promise.reject(
      new HttpException(HttpStatusCode.BAD_REQUEST, 'User not found')
    );
  };

  static getAllUsers = async (
    filter: PaginationFilter
  ): Promise<PaginateObj<User>> => {
    const {
      pageSize = 10,
      pageNumber = 1,
      keyword = '',
      orderBy = 'identificator',
      order = ORDER.ASC
    } = filter;

    let [users, totalItems]: [User[], number] = await User.findAndCount({
      where: {
        identificator: Like('%' + normalizeId(keyword) + '%')
      },
      order: { [orderBy]: order },
      take: pageSize,
      skip: pageSize * (pageNumber - 1)
    });

    if (pageSize > totalItems) {
      [users, totalItems] = await User.findAndCount({
        where: { identificator: Like('%' + normalizeId(keyword) + '%') },
        order: { [orderBy]: order },
        take: pageSize,
        skip: 0
      });
    }

    let totalPage: number = Math.trunc(totalItems / pageSize);
    totalPage = totalItems % pageSize === 0 ? totalPage : totalPage + 1;

    // normalize the users Obj
    users = users.map(user => user.normalize());

    const paginate: PaginateObj<User> = {
      totalItems,
      pageSize,
      totalPage,
      pageNumber,
      keyword,
      items: users
    };

    return paginate;
  };

  static getUser = async (identificator: any): Promise<User> => {
    const user: User | undefined = await User.findOne({
      identificator: normalizeId(identificator)
    });

    if (user) return user;

    return Promise.reject(
      new HttpException(HttpStatusCode.BAD_REQUEST, 'User not found')
    );
  };

  static updateUserPWD = async (
    identificator: string,
    updateUserPwdDTO: UpdateUserPwdDTO
  ): Promise<User> => {
    let user: User | undefined = await User.findOne({
      identificator: normalizeId(identificator)
    });

    if (!user)
      return Promise.reject(
        new HttpException(HttpStatusCode.BAD_REQUEST, 'User not found')
      );

    user = await user.updatePWD(updateUserPwdDTO);
    return user;
  };

  static resetUserPWD = async (
    identificator: string,
    resetPasswordDTO: ResetPasswordDTO
  ): Promise<User> => {
    let user: User | undefined = await User.findOne({
      identificator: normalizeId(identificator)
    });

    if (user) {
      user = await user.resetPWD(resetPasswordDTO);
      return user;
    }

    return Promise.reject(
      new HttpException(HttpStatusCode.BAD_REQUEST, 'User not found')
    );
  };

  static confirmEmail = async (
    confirmMailDTO: ConfirmMailDTO
  ): Promise<User> => {
    const { identificator, token } = confirmMailDTO;

    let user: User | undefined = await User.findOne({
      identificator: normalizeId(identificator)
    });

    if (!user)
      return Promise.reject(
        new HttpException(HttpStatusCode.BAD_REQUEST, 'User not found')
      );

    // already confirmed
    if (user.isMailConfirmed)
      return Promise.reject(
        new HttpException(HttpStatusCode.BAD_REQUEST, 'Invalid token')
      );

    user = await user.activeMail(token);

    if (!user.isMailConfirmed)
      return Promise.reject(
        new HttpException(HttpStatusCode.BAD_REQUEST, 'Invalid token')
      );

    return user;
  };

  static resendConfirmMail = async (
    resendCMAil: ResendCMail
  ): Promise<void> => {
    const { email } = resendCMAil;

    let user: User | undefined = await User.findOne({
      email: normalizeId(email)
    });

    if (!user)
      return Promise.reject(
        new HttpException(HttpStatusCode.BAD_REQUEST, 'User not found')
      );

    // already confirmed
    if (user.isMailConfirmed)
      return Promise.reject(
        new HttpException(
          HttpStatusCode.BAD_REQUEST,
          'Your mail already confirmed'
        )
      );

    // send confirmation e-mail
    await sendConfirmMail(user.identificator);
  };

  static resetUserPWDWithCode = async (
    resetPasswordWithCodeDTO: ResetPasswordWithCodeDTO
  ): Promise<User> => {
    const { identificator } = resetPasswordWithCodeDTO;

    let user: User | undefined = await User.findOne({
      identificator: normalizeId(identificator)
    });

    if (!user)
      return Promise.reject(
        new HttpException(HttpStatusCode.BAD_REQUEST, 'User not found')
      );

    user = await user.resetPWDWithCode(resetPasswordWithCodeDTO);
    return user;
  };

  static GenerateOodCode = async (resendCMAil: ResendCMail): Promise<void> => {
    const { email } = resendCMAil;

    let user: User | undefined = await User.findOne({
      email: normalizeId(email)
    });

    if (!user)
      return Promise.reject(
        new HttpException(HttpStatusCode.BAD_REQUEST, 'User not found')
      );

    // send reset password e-mail
    await sendOodCode(user.identificator);
  };
}
