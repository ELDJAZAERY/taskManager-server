import config from "config";
import App from "./app";
import DataBase from "./config/db";
import DBsEnum from "./config/db/dbs.enums";
import { seed } from "./SEED/init";

const startServer = async () => {
  const serverConfig: any = config.get("server");

  const DB = new DataBase(DBsEnum.Postgres);
  const connected = await DB.connectDB();

  if (connected) {
    const app = new App(process.env.PORT || serverConfig.port);
    app.listen();

    // seed Data
    seed();
  } else {
    console.error(
      new Error(
        "#### cannot start the Server Without ensure the DB connection ####"
      )
    );
  }
};

/**
 *
 * @_START_SERVER_
 *
 */
startServer();
