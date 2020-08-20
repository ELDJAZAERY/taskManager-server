import { Express } from "express";
import { Controller } from "../shared";
import { AuthController } from "../features/auth";
import authMiddleware from "../middlewares/auth";
import { UserController } from "../features/user";

const URL_PREFIX = "/api";

export default (app: Express): void => {
  const controllers: Controller[] = [
    new AuthController(),
    new UserController(),
  ];

  controllers.forEach((controller) => {
    if (controller.path === "/auth") {
      app.use(URL_PREFIX + controller.path, controller.route);
     } else {
      app.use(URL_PREFIX + controller.path, authMiddleware, controller.route);
    }
  });
};
