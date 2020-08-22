import {
  IsString,
  IsNotEmpty,
  IsEnum,
  IsDateString,
  IsOptional
} from 'class-validator';

import { TaskCategories, TaskPriorities } from '../enums';

export default class TaskDTO {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsEnum(TaskCategories)
  category: TaskCategories;

  @IsEnum(TaskPriorities)
  priority: TaskPriorities;

  @IsNotEmpty()
  @IsDateString()
  deadline: string;
}
