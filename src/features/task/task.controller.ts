import { Request, Response, Router } from "express";
import { Controller, HttpStatusCode } from "../../shared";
import validationMiddleware from "../../middlewares/dataValidator";
import actionValidator from "../../middlewares/roles/action.validator";
import ActionRoleEnum from "../../middlewares/roles/action.enum";
import TaskDTO from "./dtos/Task.dto";
import UpdateStatusDTO from "./dtos/update.status.dto";

import TaskService from './task.service'
import { IUser } from "../user";
import Task from "./models/task.model";

class UserController implements Controller {
  path = "/task";

  route = Router();

  constructor() {
    this.initializeRoutes();
  }

  initializeRoutes(): void {
    // Task CRUD
    // fetch tasks of connected user
    // fetch all if he is an admin
    this.route.get("/all", this.getTasks);

    // create Task
    this.route.post(
      "/create",
      validationMiddleware(TaskDTO),
      actionValidator(ActionRoleEnum.ADMIN),
      this.createTask
    );

    // update Task
    this.route.put(
      "/update/:id",
      validationMiddleware(TaskDTO),
      actionValidator(ActionRoleEnum.ADMIN),
      this.updateTask
    );

    // delete task
    this.route.delete(
      "/delete/:id",
      actionValidator(ActionRoleEnum.ADMIN),
      this.deleteTask
    );

    // get task by id
    this.route.get("/get/:id/", this.getTask);

    // update the status of one task
    this.route.put(
      "/status/update/:id",
      validationMiddleware(UpdateStatusDTO),
      this.updateStatus
    );
  }

  async createTask(req: Request, res: Response): Promise<void> {
    const taskDTO: TaskDTO = req.body;
    const task = await TaskService.createTask(
      taskDTO
    );
    res.sendStatus(HttpStatusCode.CREATED);
  }

  async updateTask(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    const taskDTO: TaskDTO = req.body;
    const task = await TaskService.updateTask(
      id,
      taskDTO
    );
    res.status(HttpStatusCode.SUCCESS).send(task.normalize());
  }

  async updateStatus(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    const iUser: IUser = (req as any).iUser;
    const updateStatusDTO: UpdateStatusDTO = req.body;
    const task = await TaskService.updateStatus(
      id,
      updateStatusDTO,
      iUser
    );
    res.status(HttpStatusCode.SUCCESS).send(task.normalize());
  }

  async deleteTask(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    const deleted = await TaskService.deleteTask(
      id,
    );
    res.status(HttpStatusCode.SUCCESS).send(deleted);
  }

  async getTasks(req: Request, res: Response): Promise<void> {
    const iUser: IUser = (req as any).iUser;
    const tasks: Task[] = await TaskService.getAllTasks(
      iUser
    );

    res.status(HttpStatusCode.SUCCESS).send(tasks);
  }

  async getTask(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    const task = await TaskService.getTask(
      id,
    );
    res.status(HttpStatusCode.SUCCESS).send(task.normalize());
  }


}

export default UserController;
