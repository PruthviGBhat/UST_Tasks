const express = require("express");
const jwt = require("jsonwebtoken");
const { LabTest, LabOrder } = require("./models");

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

router.get("/tests", authenticateToken, async (req, res) => {
  try {
    const { category } = req.query;
    const where = {};

    if (category) where.category = category;

    const tests = await LabTest.findAll({ where });
    res.json(tests);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/tests/:id", authenticateToken, async (req, res) => {
  try {
    const test = await LabTest.findByPk(req.params.id);
    if (!test) {
      return res.status(404).json({ error: "Lab test not found" });
    }
    res.json(test);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post("/tests", authenticateToken, async (req, res) => {
  try {
    const test = await LabTest.create(req.body);
    res.status(201).json(test);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put("/tests/:id", authenticateToken, async (req, res) => {
  try {
    const test = await LabTest.findByPk(req.params.id);
    if (!test) {
      return res.status(404).json({ error: "Lab test not found" });
    }
    await test.update(req.body);
    res.json(test);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete("/tests/:id", authenticateToken, async (req, res) => {
  try {
    const test = await LabTest.findByPk(req.params.id);
    if (!test) {
      return res.status(404).json({ error: "Lab test not found" });
    }
    await test.destroy();
    res.json({ message: "Lab test deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/orders", authenticateToken, async (req, res) => {
  try {
    const { status, patientId, doctorId, priority } = req.query;
    const where = {};

    if (status) where.status = status;
    if (patientId) where.patientId = patientId;
    if (doctorId) where.doctorId = doctorId;
    if (priority) where.priority = priority;

    const orders = await LabOrder.findAll({ where });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post("/orders", authenticateToken, async (req, res) => {
  try {
    const order = await LabOrder.create(req.body);
    res.status(201).json(order);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put("/orders/:id", authenticateToken, async (req, res) => {
  try {
    const order = await LabOrder.findByPk(req.params.id);
    if (!order) {
      return res.status(404).json({ error: "Lab order not found" });
    }
    await order.update(req.body);
    res.json(order);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.patch("/orders/:id/result", authenticateToken, async (req, res) => {
  try {
    const order = await LabOrder.findByPk(req.params.id);
    if (!order) {
      return res.status(404).json({ error: "Lab order not found" });
    }
    await order.update({
      result: req.body.result,
      resultDate: new Date(),
      status: "completed",
      abnormalFlag: req.body.abnormalFlag || false,
    });
    res.json(order);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;