const express = require("express");
const jwt = require("jsonwebtoken");
const { Patient } = require("./models");

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
    const { gender, bloodGroup } = req.query;
    const where = {};

    if (gender) where.gender = gender;
    if (bloodGroup) where.bloodGroup = bloodGroup;

    const patients = await Patient.findAll({ where });
    res.json(patients);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/:id", authenticateToken, async (req, res) => {
  try {
    const patient = await Patient.findByPk(req.params.id);
    if (!patient) {
      return res.status(404).json({ error: "Patient not found" });
    }
    res.json(patient);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post("/", authenticateToken, async (req, res) => {
  try {
    const patient = await Patient.create(req.body);
    res.status(201).json(patient);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put("/:id", authenticateToken, async (req, res) => {
  try {
    const patient = await Patient.findByPk(req.params.id);
    if (!patient) {
      return res.status(404).json({ error: "Patient not found" });
    }
    await patient.update(req.body);
    res.json(patient);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete("/:id", authenticateToken, async (req, res) => {
  try {
    const patient = await Patient.findByPk(req.params.id);
    if (!patient) {
      return res.status(404).json({ error: "Patient not found" });
    }
    await patient.destroy();
    res.json({ message: "Patient deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;