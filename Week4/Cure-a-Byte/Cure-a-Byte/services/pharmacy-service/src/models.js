const { Sequelize, DataTypes } = require("sequelize");

const sequelize = new Sequelize(
  process.env.DB_NAME || "pharmacy_db",
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

const Medication = sequelize.define("Medication", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  genericName: {
    type: DataTypes.STRING,
  },
  manufacturer: {
    type: DataTypes.STRING,
  },
  category: {
    type: DataTypes.STRING,
  },
  dosageForm: {
    type: DataTypes.ENUM("tablet", "capsule", "syrup", "injection", "cream", "drops", "inhaler"),
    allowNull: false,
  },
  strength: {
    type: DataTypes.STRING,
  },
  price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
  stockQuantity: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  reorderLevel: {
    type: DataTypes.INTEGER,
    defaultValue: 10,
  },
  expiryDate: {
    type: DataTypes.DATEONLY,
  },
  requiresPrescription: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
});

const PrescriptionOrder = sequelize.define("PrescriptionOrder", {
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
  appointmentId: {
    type: DataTypes.UUID,
  },
  medicationId: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  dosageInstructions: {
    type: DataTypes.TEXT,
  },
  status: {
    type: DataTypes.ENUM("pending", "dispensed", "cancelled"),
    defaultValue: "pending",
  },
  totalPrice: {
    type: DataTypes.DECIMAL(10, 2),
  },
});

module.exports = { sequelize, Medication, PrescriptionOrder };