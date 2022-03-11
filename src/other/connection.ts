import { Sequelize } from "sequelize-typescript";

import { TodoNames, TodoRow, User } from "../models/models";

const connection = new Sequelize({
  dialect: "mysql",
  host: "localhost",
  username: "root",
  password: "password",
  database: "todo",
  logging: false,
  models: [User, TodoRow, TodoNames],
});



export default connection;