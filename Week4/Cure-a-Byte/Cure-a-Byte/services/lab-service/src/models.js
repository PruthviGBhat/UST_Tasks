const { Sequelize, DataTypes } = require("sequelize");

const sequelize = new Sequelize(
  process.env.DB_NAME || "lab_db",
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

const LabTest = sequelize.define("LabTest", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  category: {
    type: DataTypes.ENUM("blood", "urine", "imaging", "pathology", "microbiology", "other"),
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
  },
  price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
  turnaroundTime: {
    type: DataTypes.STRING,
  },
  requiresFasting: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
});

const LabOrder = sequelize.define("LabOrder", {
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
  testId: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  appointmentId: {
    type: DataTypes.UUID,
  },
  status: {
    type: DataTypes.ENUM("ordered", "sample_collected", "processing", "completed", "cancelled"),
    defaultValue: "ordered",
  },
  priority: {
    type: DataTypes.ENUM("routine", "urgent", "stat"),
    defaultValue: "routine",
  },
  result: {
    type: DataTypes.TEXT,
  },
  resultDate: {
    type: DataTypes.DATE,
  },
  notes: {
    type: DataTypes.TEXT,
  },
  abnormalFlag: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
});

module.exports = { sequelize, LabTest, LabOrder };