const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const { sequelize } = require("./models");
const routes = require("./routes");

const app = express();
const PORT = process.env.PORT || 3004;

app.use(cors());
app.use(express.json());
app.use(morgan("combined"));

app.get("/health", (req, res) => {
  res.json({ status: "healthy", service: "appointment-service", timestamp: new Date().toISOString() });
});

app.get("/ready", async (req, res) => {
  try {
    await sequelize.authenticate();
    res.json({ status: "ready" });
  } catch (err) {
    res.status(503).json({ status: "not ready", error: err.message });
  }
});

app.use("/api/appointments", routes);

const startServer = async () => {
  let retries = 10;
  while (retries > 0) {
    try {
      await sequelize.authenticate();
      await sequelize.sync({ alter: true });
      console.log("Database connected and synced");
      break;
    } catch (err) {
      console.log(`Database connection failed. Retries left: ${retries - 1}`);
      retries -= 1;
      await new Promise((resolve) => setTimeout(resolve, 5000));
    }
  }

  if (retries === 0) {
    console.error("Could not connect to database. Exiting.");
    process.exit(1);
  }

  app.listen(PORT, () => {
    console.log(`Appointment service running on port ${PORT}`);
  });
};

startServer();