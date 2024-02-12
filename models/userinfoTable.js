import { DataTypes } from 'sequelize';
import sequelize from './sequelizeConfig.js';

const UserinfoTable = sequelize.define('userinfotable', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  username: {
    type: DataTypes.STRING,
  },
  emailid: {
    type: DataTypes.STRING,
  },
  password: {
    type: DataTypes.STRING,
  },
}, {
  freezeTableName: true,
  timestamps: false
});

export default UserinfoTable;