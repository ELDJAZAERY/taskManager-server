import { Request, Response, Router } from 'express';
import { Controller, HttpStatusCode } from '../../shared';
import UserService from './user.service';
import validationMiddleware from '../../middlewares/dataValidator';
import UpdateUserPwdDTO from './dtos/update.user.password.dto';
import actionValidator from '../../middlewares/roles/action.validator';
import ActionRoleEnum from '../../middlewares/roles/action.enum';

import PaginationFilter, {
  PaginateObj
} from '../../shared/interfaces/pagination';
import ResetPasswordDTO from './dtos/reset.uset.password.dto';
import User from './models/user.model';
import CreateUserDTO from './dtos/create.user.dto';
import UpdateUserDTO from './dtos/update.user.dto';

class UserController implements Controller {
  path = '/user';

  route = Router();

  constructor() {
    this.initializeRoutes();
  }

  initializeRoutes(): void {
    this.route.post(
      '/',
      validationMiddleware(PaginationFilter),
      actionValidator(ActionRoleEnum.ADMIN),
      this.getAllUsers
    );
    this.route.post(
      '/create',
      validationMiddleware(CreateUserDTO),
      actionValidator(ActionRoleEnum.ADMIN),
      this.createUser
    );
    this.route.get(
      '/profile/:identificator/',
      actionValidator(ActionRoleEnum.SELFISH),
      this.getUser
    );
    this.route.put(
      '/profile/:identificator',
      validationMiddleware(UpdateUserDTO),
      actionValidator(ActionRoleEnum.SELFISH),
      this.updateUser
    );
    this.route.put(
      '/profile/:identificator/pwd/change',
      validationMiddleware(UpdateUserPwdDTO),
      actionValidator(ActionRoleEnum.SELFISH),
      this.updatePwd
    );
    this.route.put(
      '/profile/:identificator/pwd/reset',
      validationMiddleware(ResetPasswordDTO),
      actionValidator(ActionRoleEnum.ADMIN),
      this.resetPwd
    );
  }

  async getAllUsers(req: Request, res: Response): Promise<void> {
    const filter: PaginationFilter = req.body;
    const owners: PaginateObj<User> = await UserService.getAllUsers(filter);
    res.status(HttpStatusCode.SUCCESS).send(owners);
  }

  async getUser(req: Request, res: Response): Promise<void> {
    const { identificator } = req.params;
    const user: User = await UserService.getUser(identificator);
    res.status(HttpStatusCode.SUCCESS).send(user.normalize());
  }

  async createUser(req: Request, res: Response): Promise<void> {
    const createUserDTO: CreateUserDTO = req.body;
    const createdUser: User = await UserService.createUser(createUserDTO);
    res.status(HttpStatusCode.CREATED).send(createdUser.normalize());
  }

  async updateUser(req: Request, res: Response): Promise<void> {
    const updateUserDTO: UpdateUserDTO = req.body;
    const { identificator } = req.params;
    const user: User = await UserService.updateUser(
      identificator,
      updateUserDTO
    );
    res.status(HttpStatusCode.SUCCESS).send(user.normalize());
  }

  async updatePwd(req: Request, res: Response): Promise<void> {
    const { identificator } = req.params;
    const updateUserPwdDTO: UpdateUserPwdDTO = req.body;
    const user: User = await UserService.updateUserPWD(
      identificator,
      updateUserPwdDTO
    );
    res.status(HttpStatusCode.SUCCESS).send(user.normalize());
  }

  async resetPwd(req: Request, res: Response): Promise<void> {
    const { identificator } = req.params;
    const resetPasswordDTO: ResetPasswordDTO = req.body;
    const userUpdated: User = await UserService.resetUserPWD(
      identificator,
      resetPasswordDTO
    );
    res.status(HttpStatusCode.SUCCESS).send(userUpdated.normalize());
  }
}

export default UserController;
