import { DataTypes } from 'sequelize';
import sequelize from './sequelizeConfig.js';

const CandidateinfoTable = sequelize.define('candidateinfotable', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  candidate_name: {
    type: DataTypes.STRING,
  },
  profile_received_date:{
    type: DataTypes.DATE
  },
  education: {
    type: DataTypes.TEXT,
  },
  technology: {
    type: DataTypes.TEXT,
  },
  mobile_number: {
    type: DataTypes.STRING,
  },
  email_id: {
    type: DataTypes.STRING,
  },
  resume: {
    type: DataTypes.TEXT,
  },
  home_town: {
    type: DataTypes.STRING,
  },
  current_location: {
    type: DataTypes.STRING,
  },
  preferred_location: {
    type: DataTypes.STRING,
  },
  previous_employment: {
    type: DataTypes.TEXT,
  },
  current_employment: {
    type: DataTypes.TEXT,
  },
  designation: {
    type: DataTypes.STRING,
  },
  company_name: {
    type: DataTypes.STRING,
  },
  qualification: {
    type: DataTypes.STRING,
  },
  experience: {
    type: DataTypes.INTEGER,
  },
  relevant_experience: {
    type: DataTypes.STRING,
  },
  course_completion: {
    type: DataTypes.TEXT,
  },
  skill_set: {
    type: DataTypes.TEXT,
  },
  current_takehome: {
    type: DataTypes.STRING,
  },
  expectation: {
    type: DataTypes.STRING,
  },
  notice_duration: {
    type: DataTypes.STRING,
  },
  reason_relieving: {
    type: DataTypes.TEXT,
  },
  having_offers: {
    type: DataTypes.STRING,
  },
  status: {
    type: DataTypes.STRING,
    defaultValue: "pending",
  },
  tele_comm_feedback:{
    type:DataTypes.TEXT
  },
  aptitude_feedback:{
    type:DataTypes.TEXT
  },
  technical_feedback:{
    type:DataTypes.TEXT
  },
  machine_feedback:{
    type:DataTypes.TEXT
  },
  hr_feedback:{
    type:DataTypes.TEXT
  },
  rejected_feedback:{
    type:DataTypes.TEXT
  },
  screening_timestamp:{
    type: DataTypes.DATE
  },
  tele_comm_timestamp:{
    type: DataTypes.DATE
  },
  aptitude_timestamp:{
    type: DataTypes.DATE
  },
  technical_timestamp:{
    type: DataTypes.DATE
  },
  machine_timestamp:{
    type: DataTypes.DATE
  },
  hr_timestamp:{
    type: DataTypes.DATE
  },
  rejected_timestamp:{
    type: DataTypes.DATE
  }
}, {
  freezeTableName: true,
  timestamps: false
});

export default CandidateinfoTable;