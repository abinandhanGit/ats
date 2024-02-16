// import { Sequelize } from "sequelize";

// const sequelize = new Sequelize({
//   database: 'inoble',
//   username: 'postgres',
//   password: 'password',
//   host: 'localhost',
//   port: 5432,
//   dialect: 'postgres',
//   logging: false
// });

// export default sequelize;

import { Sequelize } from "sequelize";

const sequelize = new Sequelize({
  database: 'inoble',
  username: 'inoble_user',
  password: 'XIgqX6WWhiNaPNewGG3qljkPLKg7Vyiw',
  host: 'dpg-cn7g3vq1hbls73dr9ji0-a',
  port: 5432,
  dialect: 'postgres',
  logging: false
});

export default sequelize;