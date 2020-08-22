import LoginDTO from './dtos/login.dto';

import JWTGenerator from '../../utils/jwtGenerator';
import HttpException from '../../exceptions/httpException';
import { HttpStatusCode } from '../../shared';
import loginResponse from './interfaces/login.response';
import RefreshTokenDTO from './dtos/refreshToken.dto';
import { IUser, User } from '../user';
import { normalizeId } from '../user/helpers/user.manager';

export default class AuthService {
  static async login(loginDTO: LoginDTO): Promise<loginResponse> {
    const { identificator, password } = loginDTO;

    let user: User | undefined = await User.findOne({
      identificator: normalizeId(identificator)
    });

    if (!user) {
      user = await User.findOne({
        email: normalizeId(identificator)
      });
    }

    if (!user) {
      return Promise.reject(
        new HttpException(HttpStatusCode.UNAUTHORIZED, 'UNKNOWN USER')
      );
    }

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

    if (user && user.isActivated && user.checkPWD(password)) {
      return AuthService.generateTokens(user);
    }

    return Promise.reject(
      new HttpException(HttpStatusCode.UNAUTHORIZED, 'Password incorrect')
    );
  }

  static async refreshToken(
    refreshTokenDTO: RefreshTokenDTO
  ): Promise<loginResponse | undefined> {
    const { identificator, refreshToken } = refreshTokenDTO;

    const user: User | undefined = await User.findOne({
      identificator: normalizeId(identificator)
    });

    if (!user)
      return Promise.reject(
        new HttpException(HttpStatusCode.UNAUTHORIZED, 'UNKNOWN USER')
      );

    if (user && !user.isActivated) {
      return Promise.reject(
        new HttpException(
          HttpStatusCode.FORBIDDEN,
          'Your account has been deactivated, please contact your admin'
        )
      );
    }

    const tokenData: any = JWTGenerator.verify(refreshToken);

    if (tokenData && tokenData.identificator === identificator) {
      return AuthService.generateTokens(user);
    }

    /**
     * if user isn't exist or refresh token is invalid
     */
    return Promise.reject(
      new HttpException(
        HttpStatusCode.UNAUTHORIZED,
        'The refresh token is invalid, please login again'
      )
    );
  }

  private static async generateTokens(user: User): Promise<loginResponse> {
    const { identificator, email, role, isActivated } = user;

    const token = JWTGenerator.signe({
      identificator,
      email,
      role,
      isActivated
    });

    const refreshToken = JWTGenerator.refreshToken({
      identificator,
      email,
      role
    });

    user = user.normalize();
    const iUser: IUser = { ...user };

    return { token, refreshToken, user: iUser };
  }
}
