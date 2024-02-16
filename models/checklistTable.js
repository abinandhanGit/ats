import { DataTypes } from 'sequelize';
import sequelize from './sequelizeConfig.js';

const ChecklistTable = sequelize.define('checklisttable', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  company_name: {
    type: DataTypes.STRING,
  },
  contact_person_name: {
    type: DataTypes.STRING,
  },
  mobile_number: {
    type: DataTypes.STRING,
  },
  email_id: {
    type: DataTypes.STRING,
  },
  date_of_request: {
    type: DataTypes.DATEONLY,
  },
  requester_name: {
    type: DataTypes.STRING,
  },
  requester_designation: {
    type: DataTypes.STRING,
  },
  position_tobe_filled: {
    type: DataTypes.STRING,
  },
  onboarding_days: {
    type: DataTypes.INTEGER,
  },
  job_description: {
    type: DataTypes.TEXT,
  },
  reason_for_hiring: {
    type: DataTypes.STRING,
  },
  qualification: {
    type: DataTypes.STRING,
  },
  experience: {
    type: DataTypes.INTEGER,
  },
  position_type: {
    type: DataTypes.STRING,
  },
  location: {
    type: DataTypes.STRING,
  },
  no_of_openings: {
    type: DataTypes.INTEGER,
  },
  ctc_range: {
    type: DataTypes.STRING,
  },
  initial_approval: {
    type: DataTypes.STRING,
  },
  final_approval: {
    type: DataTypes.STRING,
  },
  profile_sourcing: {
    type: DataTypes.STRING,
  },
  budget: {
    type: DataTypes.STRING,
  },
  status: {
    type: DataTypes.STRING,
  },
}, {
  freezeTableName: true,
  timestamps: false
});

export default ChecklistTable;