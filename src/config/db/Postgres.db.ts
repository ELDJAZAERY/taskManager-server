import 'reflect-metadata';
import { createConnection } from 'typeorm';
import { DBConfig } from '../../shared/interfaces/config.interface';
import DataBaseInterface from './db.interface';

export default class PostgresDataBase implements DataBaseInterface {
  private host: string;
  private port: number;
  private dbUser: string;
  private password: string;
  private name: string;

  config(dbConfig: DBConfig) {
    this.host = dbConfig.host;
    this.port = parseInt(dbConfig.port);
    this.dbUser = dbConfig.dbUser;
    this.password = dbConfig.password;
    this.name = dbConfig.name;
  }

  async connectDB(): Promise<boolean> {
    try {
      await createConnection({
        type: 'postgres',
        host: this.host,
        port: this.port,
        username: this.dbUser,
        password: this.password,
        database: this.name,
        entities: [`${__dirname}/../../**/**/*.model{.ts,.js }`],
        synchronize: true,
        logging: false,
        ssl: true
      });
      this.success();
      return true;
    } catch (err) {
      this.issue(err);
      return false;
    }
  }

  success(): void {
    console.log(
      `#### Successfully connected to Postgress DB ${this.host}/${this.name} ####`
    );
  }

  issue(err: string): void {
    console.log(
      `#### Failed to connecte to Postgress DB ${this.host}/${this.name} ####`
    );
    console.log(`${err}`);
  }
}
