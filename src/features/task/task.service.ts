import HttpException from "../../exceptions/httpException";
import { HttpStatusCode } from "../../shared";
import { In } from "typeorm";
import TaskDTO from "./dtos/Task.dto";
import Task from "./models/task.model";
import { IUser } from "../user";

import UpdateStatusDTO from "./dtos/update.status.dto";
import UserRolesEnum from "../user/enums/roles.Enum";
import { sendTaskNotification } from "./helpers";

export default class UserService {
  static createTask = (taskDTO: TaskDTO): Promise<Task> => {
    return Task.createTask(taskDTO);
  };

  static updateTask = async (id: string, taskDTO: TaskDTO): Promise<Task> => {
    const task: Task | undefined = await Task.findOne(id);

    if (!task)
      return Promise.reject(
        new HttpException(HttpStatusCode.BAD_REQUEST, "Task not found")
      );

    return task.updateInfos(taskDTO);
  };

  static deleteTask = async (id: string): Promise<boolean> => {
    const task: Task | undefined = await Task.findOne(id);

    if (!task)
      return Promise.reject(
        new HttpException(HttpStatusCode.BAD_REQUEST, "Task not found")
      );

    const deleted = await Task.delete(id);

    return !!deleted.affected && deleted.affected > 0;
  };

  static getAllTasks = async (user: IUser): Promise<Task[]> => {
    if (user.role === UserRolesEnum.ADMIN) {
      const tasks: Task[] = await Task.find({
        order: { deadline: "ASC" },
      });

      return tasks;
    }

    const tasks: Task[] = await Task.find({
      where: { profile: In([user.role, "ALL"]) },
      order: { deadline: "ASC" },
    });

    return tasks;
  };

  static getTask = async (id: string): Promise<Task> => {
    const task: Task | undefined = await Task.findOne(id);

    if (!task)
      return Promise.reject(
        new HttpException(HttpStatusCode.BAD_REQUEST, "Task not found")
      );

    return task;
  };

  static updateStatus = async (
    id: string,
    updateStatusDTO: UpdateStatusDTO,
    iUser: IUser,
  ): Promise<Task> => {
    const task: Task | undefined = await Task.findOne(id);

    if (!task)
      return Promise.reject(
        new HttpException(HttpStatusCode.BAD_REQUEST, "Task not found")
      );

    const updatedTask = await task.updateStatus(updateStatusDTO.status);

    // notify admin
    sendTaskNotification(updatedTask, iUser)

    return updatedTask
  };
}
