
const { Sequelize, DataTypes } = require("sequelize");

const sequelize = new Sequelize(
  process.env.DB_NAME || "appointment_db",
  process.env.DB_USER || "postgres",
  process.env.DB_PASSWORD || "postgres",
  {
    host: process.env.DB_HOST || "localhost",
    port: process.env.DB_PORT || 5432,
    dialect: "postgres",
    logging: false,
    pool: {
      max: 10,
      min: 2,
      acquire: 30000,
      idle: 10000,
    },
  }
);

const Appointment = sequelize.define("Appointment", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  patientId: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  doctorId: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  appointmentDate: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
  appointmentTime: {
    type: DataTypes.TIME,
    allowNull: false,
  },
  status: {
    type: DataTypes.ENUM("scheduled", "confirmed", "in_progress", "completed", "cancelled"),
    defaultValue: "scheduled",
  },
  type: {
    type: DataTypes.ENUM("consultation", "follow_up", "emergency", "routine_checkup"),
    defaultValue: "consultation",
  },
  reason: {
    type: DataTypes.TEXT,
  },
  notes: {
    type: DataTypes.TEXT,
  },
  diagnosis: {
    type: DataTypes.TEXT,
  },
  prescription: {
    type: DataTypes.TEXT,
  },
});

module.exports = { sequelize, Appointment };