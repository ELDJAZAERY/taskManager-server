import DataBase from '../config/db';
import DBsEnum from '../config/db/dbs.enums';

import { Users } from './data';
import User from '../features/user/models/user.model';
import { KeyConstraintCheck } from '../features/user/helpers/user.manager';

const ConnectThenSeed = async () => {
  const DB = new DataBase(DBsEnum.Postgres);
  const connected = await DB.connectDB();

  if (connected) {
    await SeedInitialData();
  } else {
    console.error(
      new Error(
        '#### cannot SEED the Data Without ensure the DB connection ####'
      )
    );
  }
};

const SeedInitialData = async () => {
  await initialUsers();
};

const initialUsers = async () => {
  for (let userInfos of Users) {
    try {
      await KeyConstraintCheck(userInfos);
      const user = new User();
      user.preSave({ ...userInfos });
      const token: string = await user.getConfirmMailToken();
      user.isActivated = true;
      await user.activeMail(token);
      await user.save();
    } catch {
      // console.log(` user ${userInfos.identificator}  already exist `);
    }
  }
};

/**
 *  @_INITIAL_DATA
 */

ConnectThenSeed();


export const seed = async () => {
  await initialUsers()
}
