import { IsNotEmpty, IsEnum, IsUUID } from 'class-validator';

import { TaskStatuses } from '../enums'

export default class UpdateStatusDTO {
  @IsEnum(TaskStatuses)
  status: TaskStatuses;
}
