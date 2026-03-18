const express = require("express");
const jwt = require("jsonwebtoken");
const { Appointment } = require("./models");
const { Op } = require("sequelize");

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || "healthcare-secret-key-change-in-production";

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ error: "Access token required" });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(403).json({ error: "Invalid or expired token" });
  }
};

router.get("/", authenticateToken, async (req, res) => {
  try {
    const { status, doctorId, patientId, date } = req.query;
    const where = {};

    if (status) where.status = status;
    if (doctorId) where.doctorId = doctorId;
    if (patientId) where.patientId = patientId;
    if (date) where.appointmentDate = date;

    const appointments = await Appointment.findAll({ where, order: [["appointmentDate", "ASC"], ["appointmentTime", "ASC"]] });
    res.json(appointments);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/:id", authenticateToken, async (req, res) => {
  try {
    const appointment = await Appointment.findByPk(req.params.id);
    if (!appointment) {
      return res.status(404).json({ error: "Appointment not found" });
    }
    res.json(appointment);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post("/", authenticateToken, async (req, res) => {
  try {
    const appointment = await Appointment.create(req.body);
    res.status(201).json(appointment);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put("/:id", authenticateToken, async (req, res) => {
  try {
    const appointment = await Appointment.findByPk(req.params.id);
    if (!appointment) {
      return res.status(404).json({ error: "Appointment not found" });
    }
    await appointment.update(req.body);
    res.json(appointment);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.patch("/:id/status", authenticateToken, async (req, res) => {
  try {
    const appointment = await Appointment.findByPk(req.params.id);
    if (!appointment) {
      return res.status(404).json({ error: "Appointment not found" });
    }
    await appointment.update({ status: req.body.status });
    res.json(appointment);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete("/:id", authenticateToken, async (req, res) => {
  try {
    const appointment = await Appointment.findByPk(req.params.id);
    if (!appointment) {
      return res.status(404).json({ error: "Appointment not found" });
    }
    await appointment.destroy();
    res.json({ message: "Appointment deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;