import { Request, Response, Router } from "express";
import { Controller, HttpStatusCode } from "../../shared";
import AuthService from "./auth.service";
import validationMiddleware from "../../middlewares/dataValidator";
import LoginDTO from "./dtos/login.dto";
import loginResponse from "./interfaces/login.response";
import RefreshTokenDTO from "./dtos/refreshToken.dto";
import { CreateUserDTO, User } from "../user";
import UserService from "../user/user.service";
import ConfirmMailDTO from "./dtos/confirm.mail";

import ResendCMail from "./dtos/resend.c.mail";
import ResetPasswordWithCodeDTO from "./dtos/forgot.password.dto";

export default class AuthController implements Controller {
  path = "/auth";

  route = Router();

  constructor() {
    this.initializeRoutes();
  }

  initializeRoutes(): void {
    this.route.post(
      "/login",
      validationMiddleware(LoginDTO),
      this.login
    );
    this.route.post(
      "/refresh",
      validationMiddleware(RefreshTokenDTO),
      this.refreshToken
    );

    this.route.post(
      "/register",
      validationMiddleware(CreateUserDTO),
      this.register
    );

    this.route.post(
      "/confirm",
      validationMiddleware(ConfirmMailDTO),
      this.confirmMail
    );

    this.route.post(
      "/resendc-mail",
      validationMiddleware(ResendCMail),
      this.resendConfirmMail
    );

    this.route.post(
      "/forgot-password",
      validationMiddleware(ResendCMail),
      this.forgotPassword
    );

    this.route.post(
      "/reset-password",
      validationMiddleware(ResetPasswordWithCodeDTO),
      this.resetPassword
    );
  }

  async login(req: Request, res: Response): Promise<void> {
    const loginDTO: LoginDTO = req.body;
    const tokens: loginResponse = await AuthService.login(loginDTO);
    res.status(HttpStatusCode.SUCCESS).send(tokens);
  }

  async refreshToken(req: Request, res: Response): Promise<void> {
    const refreshTokenDTO: RefreshTokenDTO = req.body;
    const tokens: loginResponse | undefined = await AuthService.refreshToken(
      refreshTokenDTO
    );
    res.status(HttpStatusCode.SUCCESS).send(tokens);
  }

  async register(req: Request, res: Response): Promise<void> {
    const createUserDTO: CreateUserDTO = req.body;
    const user: User = await UserService.createUser(createUserDTO);
    res.status(HttpStatusCode.CREATED).send(user.normalize());
  }

  async confirmMail(req: Request, res: Response): Promise<void> {
    const confirmMailDTO: ConfirmMailDTO = req.body;
    const user: User = await UserService.confirmEmail(confirmMailDTO);
    res.status(HttpStatusCode.CREATED).send(user.normalize());
  }

  async resendConfirmMail(req: Request, res: Response): Promise<void> {
    const ResendCMail: ResendCMail = req.body;
    await UserService.resendConfirmMail(ResendCMail);
    res.sendStatus(HttpStatusCode.SUCCESS);
  }

  async forgotPassword(req: Request, res: Response): Promise<void> {
    const ResendCMail: ResendCMail = req.body;
    await UserService.GenerateOodCode(ResendCMail);
    res.sendStatus(HttpStatusCode.SUCCESS);
  }

  async resetPassword(req: Request, res: Response): Promise<void> {
    const resetPasswordWithCodeDTO: ResetPasswordWithCodeDTO = req.body;
    const user: User = await UserService.resetUserPWDWithCode(
      resetPasswordWithCodeDTO
    );
    res.status(HttpStatusCode.CREATED).send(user.normalize());
  }
}
