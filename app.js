require("dotenv").config();
const express = require("express");
const helmet = require("helmet");
const compression = require("compression");
const rateLimit = require("express-rate-limit");
const cors = require("cors");
const {
  checkOrCreateThread,
  addMessage,
  createRun,
  getExistingMessages,
} = require("./bot/assistant");
const {
  getHealthInsights,
  getResourcesRecommendations,
} = require("./bot/function");

const app = express();
const port = process.env.PORT || 4000;

// Middleware
app.use(helmet());
app.use(compression());
app.use(cors());
app.use(express.json({ limit: "10kb" }));

// Rate limiter
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
});
app.use(limiter);

// Routes
app.get("/getExistingMessages/:threadId", async (req, res) => {
  const { threadId } = req.params;
  try {
    const result = await getExistingMessages(threadId);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: "Error getting existing messages" });
  }
});

app.post("/checkOrCreateThread", async (req, res) => {
  const { type, email } = req.body;
  try {
    const result = await checkOrCreateThread(type, email);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: "Error checking or creating thread" });
  }
});

app.post("/addMessage", async (req, res) => {
  const { threadId, content } = req.body;
  try {
    const result = await addMessage(threadId, content);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: "Error adding message to thread" });
  }
});

app.post("/createRun", async (req, res) => {
  const { threadId, assistantId, instructions } = req.body;
  try {
    const result = await createRun(threadId, assistantId, instructions);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: "Error creating run" });
  }
});

app.post("/getHealthInsights", async (req, res) => {
  const data = req.body;
  try {
    const result = await getHealthInsights(data);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: "Error getting health insights" });
  }
});

app.post("/getResourcesRecommendations", async (req, res) => {
  const data = req.body;
  try {
    const result = await getResourcesRecommendations(data);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: "Error getting resource recommendations" });
  }
});

// Health check
app.get("/health", (req, res) => res.status(200).send("OK"));

// Start the server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

// Graceful shutdown
process.on("SIGTERM", () => {
  console.log("SIGTERM received: closing HTTP server");
  server.close(() => {
    console.log("HTTP server closed");
  });
});
