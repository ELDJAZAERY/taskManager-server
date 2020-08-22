import { TaskCategories } from "../enums";
import UserRolesEnum from "../../user/enums/roles.Enum";

export const getProfile = (category: TaskCategories): UserRolesEnum | "ALL" => {
  switch (category) {
    case TaskCategories.Audit:
      return UserRolesEnum.TECHNICAL_AUDIT;

    case TaskCategories.Data_Analyse:
      return UserRolesEnum.DATA_SCIENTIST;

    case TaskCategories.Data_Visualization:
      return UserRolesEnum.DATA_SCIENTIST;

    case TaskCategories.Web:
      return UserRolesEnum.DEVELOPER;

    case TaskCategories.Mobile:
      return UserRolesEnum.DEVELOPER;

    case TaskCategories.Design:
      return UserRolesEnum.DESIGNER;

    case TaskCategories.Finance:
      return UserRolesEnum.FINANCIAL_ENGINEER;

    case TaskCategories.Other:
      return "ALL";

    default:
      return "ALL";
  }
};
