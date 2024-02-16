import { Sequelize } from "sequelize";

const sequelize = new Sequelize({
  database: 'inoble',
  username: 'postgres',
  password: 'password',
  host: 'localhost',
  port: 5432,
  dialect: 'postgres',
  logging: false
});

export default sequelize;