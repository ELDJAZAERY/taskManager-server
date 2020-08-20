import { IUser } from '../../user';

export default interface loginResponse {
  user: IUser;
  token: string;
  refreshToken: string;
}
