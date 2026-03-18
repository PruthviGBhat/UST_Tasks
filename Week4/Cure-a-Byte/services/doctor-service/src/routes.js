const express = require("express");
const jwt = require("jsonwebtoken");
const { Doctor } = require("./models");

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
    const { specialization, department, available } = req.query;
    const where = {};

    if (specialization) where.specialization = specialization;
    if (department) where.department = department;
    if (available !== undefined) where.isAvailable = available === "true";

    const doctors = await Doctor.findAll({ where });
    res.json(doctors);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/:id", authenticateToken, async (req, res) => {
  try {
    const doctor = await Doctor.findByPk(req.params.id);
    if (!doctor) {
      return res.status(404).json({ error: "Doctor not found" });
    }
    res.json(doctor);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post("/", authenticateToken, async (req, res) => {
  try {
    const doctor = await Doctor.create(req.body);
    res.status(201).json(doctor);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put("/:id", authenticateToken, async (req, res) => {
  try {
    const doctor = await Doctor.findByPk(req.params.id);
    if (!doctor) {
      return res.status(404).json({ error: "Doctor not found" });
    }
    await doctor.update(req.body);
    res.json(doctor);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete("/:id", authenticateToken, async (req, res) => {
  try {
    const doctor = await Doctor.findByPk(req.params.id);
    if (!doctor) {
      return res.status(404).json({ error: "Doctor not found" });
    }
    await doctor.destroy();
    res.json({ message: "Doctor deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;