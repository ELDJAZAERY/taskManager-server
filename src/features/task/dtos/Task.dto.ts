import {
  IsString,
  IsNotEmpty,
  IsEnum,
  IsDateString
} from 'class-validator';

import { TaskCategories, TaskPriorities } from '../enums';

export default class TaskDTO {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsString()
  description: string;

  @IsEnum(TaskCategories)
  category: TaskCategories;

  @IsEnum(TaskPriorities)
  priority: TaskPriorities;

  @IsNotEmpty()
  @IsDateString()
  deadline: string;
}
