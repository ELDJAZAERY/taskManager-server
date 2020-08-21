import express, { Express } from "express";
import cors from "cors";

const Ddos = require("ddos");

export default (app: Express): void => {
  app.use(express.json({ limit: "10mb" }));
  app.use(express.urlencoded({ limit: "10mb", extended: true }));
  app.use(cors());

  // DDOS attack
  var ddos = new Ddos({
    burst: 100,
    limit: 100,
  }); // 100 request in 1 sec 100 time
  app.use(ddos.express);
};
