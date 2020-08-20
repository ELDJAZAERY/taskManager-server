/**
 *
 * @__Abstract__USER__CLASS_
 *
 * ## Contains all communs (columns & function)
 * extended by ( @_Client , @_Owner )
 *
 */

import {
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  BaseEntity,
  Column,
  Index
} from 'typeorm';
import CreateUserDTO from '../dtos/create.user.dto';
import UpdateUserDTO from '../dtos/update.user.dto';
import UpdateUserPwdDTO from '../dtos/update.user.password.dto';
import HttpException from '../../../exceptions/httpException';
import { HttpStatusCode } from '../../../shared';

import PwdCrypto from '../../../utils/crypto';
import ResetPasswordDTO from '../dtos/reset.uset.password.dto';

export default abstract class BasicUserEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Index({ unique: true })
  @Column({ type: 'varchar' })
  identificator: string;

  @Column({ type: 'varchar' })
  email: string;

  @Column({
    type: 'boolean',
    nullable: false,
    default: false
  })
  isMailConfirmed: boolean;

  @Column({ type: 'varchar', nullable: true })
  mailTokenSecretKey?: string;

  @Column({
    type: 'boolean',
    nullable: false,
    default: false
  })
  isActivated: boolean;

  @Column({ type: 'varchar' })
  password: string;

  @Column({ type: 'varchar' })
  secretKey: string;

  @Column({ type: 'varchar', nullable: true })
  resetPasswordSecretKey?: string;

  @Column({ nullable: true })
  resetDate?: Date;

  @CreateDateColumn()
  readonly createdAt: Date;

  @UpdateDateColumn()
  readonly updatedAt: Date;

  protected preSaveUser = (createUserDTO: CreateUserDTO): any => {
    const { identificator, email, password, confirmPassword } = createUserDTO;
    if (password !== confirmPassword)
      return Promise.reject(
        new HttpException(
          HttpStatusCode.BAD_REQUEST,
          'Your password and confirmation password do not match'
        )
      );

    // lower cas without white spaces
    this.identificator = identificator.replace(/\s/g, '').toLowerCase();

    this.email = email;
    this.isActivated = false;
    this.password = password;
    this.cryptePWD();

    return true;
  };

  protected updateBasicInfosUser = (updateUserDTO: UpdateUserDTO): void => {
    const { isActivated } = updateUserDTO;
    this.isActivated = isActivated;
  };

  protected updatePWDUser = async (
    updateUserPwdDTO: UpdateUserPwdDTO
  ): Promise<boolean> => {
    const { password, newPassword, confirmPassword } = updateUserPwdDTO;
    const oldPwd = this.decryptPWD();

    if (newPassword === confirmPassword && password === oldPwd) {
      this.password = newPassword;
      this.cryptePWD();
      return true;
    }

    return Promise.reject(
      new HttpException(
        HttpStatusCode.BAD_REQUEST,
        'Wrong Password Or Your password and confirmation password do not match'
      )
    );
  };

  protected resetPWDUser = (resetPasswordDTO: ResetPasswordDTO): boolean => {
    const { password, confirmPassword } = resetPasswordDTO;
    if (password === confirmPassword) {
      this.password = password;
      this.cryptePWD();
      return true;
    } else return false;
  };

  checkPWD = (password: string): boolean => {
    const passDecrypted = this.decryptPWD();
    return password === passDecrypted;
  };

  private cryptePWD = (): void => {
    const { pwdHashed, secretKeyHashed } = PwdCrypto.encrypt(this.password);
    this.password = pwdHashed;
    this.secretKey = secretKeyHashed;
  };

  private decryptPWD = (): String => {
    return PwdCrypto.decrypt(this.password, this.secretKey);
  };

  protected cryptoMail = async (): Promise<string> => {
    const { pwdHashed: mailHashed, secretKeyHashed } = PwdCrypto.encrypt(
      this.email
    );
    this.mailTokenSecretKey = secretKeyHashed;
    await this.save();
    return mailHashed;
  };

  protected decryptEmailToken = (token: string): string => {
    return PwdCrypto.decrypt(token, this.mailTokenSecretKey || '');
  };

  protected generateOobCode = async (): Promise<string> => {
    const { pwdHashed: oobCode, secretKeyHashed } = PwdCrypto.encrypt(
      this.email
    );
    this.resetPasswordSecretKey = secretKeyHashed;
    this.resetDate = new Date();
    await this.save();
    return oobCode;
  };

  protected decryptOobCode = (oobCode: string): string => {
    let now = new Date();
    now.setHours(now.getUTCHours() - 1);

    if (!this.resetPasswordSecretKey || !this.resetDate || this.resetDate < now)
      return 'Invalid oobCode';

    return PwdCrypto.decrypt(oobCode, this.resetPasswordSecretKey);
  };

  protected normalizeUser = (): BasicUserEntity => {
    delete this.save;
    delete this.id;
    delete this.password;
    delete this.secretKey;
    delete this.preSaveUser;
    delete this.updateBasicInfosUser;
    delete this.updatePWDUser;
    delete this.cryptePWD;
    delete this.decryptPWD;
    delete this.checkPWD;
    delete this.cryptoMail;
    delete this.mailTokenSecretKey;
    delete this.decryptEmailToken;
    delete this.resetPasswordSecretKey;
    delete this.resetDate;
    delete this.generateOobCode;
    delete this.decryptOobCode;
    delete this.normalizeUser;
    return this;
  };
}
