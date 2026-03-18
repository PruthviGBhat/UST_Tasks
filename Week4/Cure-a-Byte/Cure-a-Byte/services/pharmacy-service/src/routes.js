const express = require("express");
const jwt = require("jsonwebtoken");
const { Medication, PrescriptionOrder } = require("./models");

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

router.get("/medications", authenticateToken, async (req, res) => {
  try {
    const { category, dosageForm, inStock } = req.query;
    const where = {};

    if (category) where.category = category;
    if (dosageForm) where.dosageForm = dosageForm;

    const medications = await Medication.findAll({ where });
    res.json(medications);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/medications/:id", authenticateToken, async (req, res) => {
  try {
    const medication = await Medication.findByPk(req.params.id);
    if (!medication) {
      return res.status(404).json({ error: "Medication not found" });
    }
    res.json(medication);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post("/medications", authenticateToken, async (req, res) => {
  try {
    const medication = await Medication.create(req.body);
    res.status(201).json(medication);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put("/medications/:id", authenticateToken, async (req, res) => {
  try {
    const medication = await Medication.findByPk(req.params.id);
    if (!medication) {
      return res.status(404).json({ error: "Medication not found" });
    }
    await medication.update(req.body);
    res.json(medication);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete("/medications/:id", authenticateToken, async (req, res) => {
  try {
    const medication = await Medication.findByPk(req.params.id);
    if (!medication) {
      return res.status(404).json({ error: "Medication not found" });
    }
    await medication.destroy();
    res.json({ message: "Medication deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/orders", authenticateToken, async (req, res) => {
  try {
    const { status, patientId } = req.query;
    const where = {};

    if (status) where.status = status;
    if (patientId) where.patientId = patientId;

    const orders = await PrescriptionOrder.findAll({ where });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post("/orders", authenticateToken, async (req, res) => {
  try {
    const order = await PrescriptionOrder.create(req.body);
    res.status(201).json(order);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.patch("/orders/:id/status", authenticateToken, async (req, res) => {
  try {
    const order = await PrescriptionOrder.findByPk(req.params.id);
    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }
    await order.update({ status: req.body.status });
    res.json(order);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;