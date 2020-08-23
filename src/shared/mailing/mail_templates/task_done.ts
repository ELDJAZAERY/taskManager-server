import { Task } from "../../../features/models";
import { IUser } from "../../../features/user";

export const taskNotification = (
  task: Task,
  iUser: IUser
): string => `
Salutations,

Nous tenons à vous informer que la tâche (${task.title}) est pleinement réalisé par ${iUser.identificator}.

Cordialement.
`;
