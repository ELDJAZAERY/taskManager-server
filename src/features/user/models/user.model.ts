import { Entity, Column } from 'typeorm';

import BasicUserEntity from './basic.user.model';
import CreateUserDTO from '../dtos/create.user.dto';
import UpdateUserDTO from '../dtos/update.user.dto';
import UpdateUserPwdDTO from '../dtos/update.user.password.dto';
import UserRolesEnum from '../enums/roles.Enum';
import ResetPasswordDTO from '../dtos/reset.uset.password.dto';
import HttpException from '../../../exceptions/httpException';
import { HttpStatusCode } from '../../../shared';
import ResetPasswordWithCodeDTO from '../../auth/dtos/forgot.password.dto';

@Entity({ name: 'user_access' })
export default class User extends BasicUserEntity {
  static readonly TABLE_NAME = 'user_access';

  @Column({ type: 'varchar', nullable: false, default: UserRolesEnum.DEVELOPER })
  role: UserRolesEnum;

  preSave = (createUser: CreateUserDTO): any => {
    this.preSaveUser(createUser);
    this.role = createUser.role;
  };

  updateBasicInfos = (updateUserDTO: UpdateUserDTO): Promise<User> => {
    this.updateBasicInfosUser(updateUserDTO);
    this.role = updateUserDTO.role;
    return this.save();
  };

  updatePWD = async (updateUserPwdDTO: UpdateUserPwdDTO): Promise<User> => {
    await this.updatePWDUser(updateUserPwdDTO);
    return this.save();
  };

  resetPWD = async (resetPasswordDTO: ResetPasswordDTO): Promise<User> => {
    const reseted = this.resetPWDUser(resetPasswordDTO);
    if (reseted) return this.save();
    else
      return Promise.reject(
        new HttpException(
          HttpStatusCode.BAD_REQUEST,
          'Wrong Password Or Your password and confirmation password do not match'
        )
      );
  };

  getConfirmMailToken = (): Promise<string> => {
    return this.cryptoMail();
  };

  private checkMailToken = (token: string): boolean => {
    const email = this.decryptEmailToken(token);
    return email === this.email;
  };

  activeMail = (token: string): Promise<User> => {
    const checkToken = this.checkMailToken(token);
    if (!this.isMailConfirmed) this.isMailConfirmed = checkToken;
    return this.save();
  };

  generateResetPasswordOobCode = (): Promise<string> => {
    return this.generateOobCode();
  };

  resetPWDWithCode = async (
    resetPasswordWithCodeDTO: ResetPasswordWithCodeDTO
  ): Promise<User> => {
    const decryptedOobCode: string = this.decryptOobCode(
      resetPasswordWithCodeDTO.oobCode
    );

    if (decryptedOobCode !== this.email)
      return Promise.reject(
        new HttpException(HttpStatusCode.BAD_REQUEST, 'Invalid oobCode')
      );

    return this.resetPWD(resetPasswordWithCodeDTO);
  };

  normalize = (): User => {
    this.normalizeUser();
    delete this.save;
    delete this.preSave;
    delete this.updateBasicInfos;
    delete this.updatePWD;
    delete this.resetPWD;
    delete this.getConfirmMailToken;
    delete this.checkMailToken;
    delete this.activeMail;
    delete this.generateResetPasswordOobCode;
    delete this.resetPWDWithCode;
    delete this.normalize;
    return this;
  };
}
