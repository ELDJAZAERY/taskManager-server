import config from 'config';
import { DBConfig } from '../../shared/interfaces/config.interface';
import DBsEnum from './dbs.enums';
import PostgresDataBase from './Postgres.db';
import MongooseDataBase from './Mongoose.db';

export default class DataBase {
  private db: DBsEnum;
  private dbConfigs: DBConfig;

  constructor(db: DBsEnum) {
    this.db = db;
    // load the DB connection configs
    const dbConfigs: DBConfig = config.get('db');
    this.dbConfigs = dbConfigs;
  }

  connectDB = async (): Promise<boolean> => {
    switch (this.db) {
      case DBsEnum.Postgres:
        return this.postgresConnect();
      case DBsEnum.Mongoose:
        return this.mongooseConnect();
      default:
        return false;
    }
  };

  postgresConnect = async (): Promise<boolean> => {
    const postgres = new PostgresDataBase();
    postgres.config(this.dbConfigs);
    let retry = 5;
    while (retry) {
      retry--;
      const connected: boolean = await postgres.connectDB();
      if (connected) return true;
      console.log(' -- Connection retry --- ');
      await this.awaitingFor(3);
    }
    return false;
  };

  mongooseConnect = async (): Promise<boolean> => {
    const mongoose = new MongooseDataBase();
    mongoose.config(this.dbConfigs);
    let retry = 5;
    while (retry) {
      retry--;
      const connected: boolean = await mongoose.connectDB();
      if (connected) return true;
      await new Promise((res, rej) => setTimeout(res => res, 500));
    }
    return false;
  };

  awaitingFor = (seconds: number): Promise<boolean> => {
    return new Promise(resolve => {
      setTimeout(() => resolve(), seconds * 1000);
    });
  };
}
