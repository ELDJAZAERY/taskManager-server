import {
  Entity,
  Column,
  BaseEntity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";
import { TaskCategories, TaskPriorities, TaskStatuses } from "../enums";
import TaskDTO from "../dtos/Task.dto";
import UserRolesEnum from "../../user/enums/roles.Enum";
import { getProfile } from "../helpers";

@Entity({ name: "task" })
export default class Task extends BaseEntity {
  static readonly TABLE_NAME = "task";

  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  title: string;

  @Column()
  description: string;

  @Column({ type: "enum", enum: TaskCategories })
  category: TaskCategories;

  @Column({ type: "enum", enum: TaskPriorities })
  priority: TaskPriorities;

  @Column()
  deadline: Date;

  @Column({ type: "enum", enum: TaskStatuses })
  status: TaskStatuses;

  @Column()
  profile: UserRolesEnum | "ALL";

  @CreateDateColumn()
  readonly createdAt: Date;

  @UpdateDateColumn()
  readonly updatedAt: Date;

  constructor(taskDTO: TaskDTO) {
    super();

    if (!taskDTO) return this;

    const { title, description, category, priority, deadline } = taskDTO;

    this.title = title;
    this.description = description || "";
    this.category = category;
    this.priority = priority;
    this.deadline = new Date(deadline);
    this.status = TaskStatuses.In_Backlog;
    this.profile = getProfile(this.category);
  }

  static createTask = (taskDTO: TaskDTO): Promise<Task> => {
    const task = new Task(taskDTO);
    return task.save();
  };

  updateStatus = (status: TaskStatuses): Promise<Task> => {
    this.status = status;
    return this.save();
  };

  updateInfos = (taskDTO: TaskDTO): Promise<Task> => {
    const { title, description, category, priority, deadline } = taskDTO;

    this.title = title;
    this.description = description || "";
    this.category = category;
    this.priority = priority;
    this.deadline = new Date(deadline);
    this.profile = getProfile(this.category);

    return this.save();
  };

  normalize = (): Task => {
    delete this.save;
    delete this.updateStatus;
    delete this.updateInfos;
    delete this.normalize;
    return this;
  };
}
