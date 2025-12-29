import express from "express";
import cors from "cors";

const app = express();

// ----- Config via env -----
const PORT = parseInt(process.env.PORT || "3000", 10);
const APP_ENV = process.env.APP_ENV || "local";
const CORS_ORIGIN = process.env.CORS_ORIGIN || "*";
const API_PREFIX = process.env.API_PREFIX || "/api";

const APP_VERSION = process.env.APP_VERSION || "0.0.0";
const GIT_SHA = process.env.GIT_SHA || "dev";
const BUILD_DATE = process.env.BUILD_DATE || new Date().toISOString();

// ----- Middlewares -----
app.disable("x-powered-by");
app.use(express.json({ limit: "256kb" }));
app.use(cors({ origin: CORS_ORIGIN === "*" ? true : CORS_ORIGIN }));

// Request logging simple (JSON)
app.use((req, res, next) => {
  const start = Date.now();
  res.on("finish", () => {
    const durationMs = Date.now() - start;
    console.log(
      JSON.stringify({
        ts: new Date().toISOString(),
        level: "info",
        msg: "http_request",
        method: req.method,
        path: req.originalUrl,
        status: res.statusCode,
        durationMs,
        ua: req.headers["user-agent"] || "",
      })
    );
  });
  next();
});

// ----- Routes -----
app.get("/health", (req, res) => {
  res.json({
    status: "ok",
    service: "backend",
    env: APP_ENV,
    time: new Date().toISOString(),
  });
});

app.get(`${API_PREFIX}/info`, (req, res) => {
  res.json({
    name: "cicd-training-backend",
    env: APP_ENV,
    version: APP_VERSION,
    gitSha: GIT_SHA,
    buildDate: BUILD_DATE,
  });
});

// Données simulées (pas de DB)
const QUOTES = [
  { id: 1, text: "Ship small, learn fast.", author: "DevOps proverb" },
  { id: 2, text: "Make it work, make it right, make it fast.", author: "Kent Beck" },
  { id: 3, text: "Automation is good, so long as you know exactly where to put the machine.", author: "Eliyahu Goldratt" }
];

app.get(`${API_PREFIX}/quote`, (req, res) => {
  const pick = QUOTES[Math.floor(Math.random() * QUOTES.length)];
  res.json({
    ...pick,
    meta: {
      env: APP_ENV,
      version: APP_VERSION,
      gitSha: GIT_SHA
    }
  });
});

// 404
app.use((req, res) => {
  res.status(404).json({ error: "not_found", path: req.originalUrl });
});

// Error handler
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  console.error(
    JSON.stringify({
      ts: new Date().toISOString(),
      level: "error",
      msg: "unhandled_error",
      error: err?.message || String(err),
      stack: err?.stack || ""
    })
  );
  res.status(500).json({ error: "internal_error" });
});

app.listen(PORT, () => {
  console.log(
    JSON.stringify({
      ts: new Date().toISOString(),
      level: "info",
      msg: "server_started",
      port: PORT,
      env: APP_ENV,
      apiPrefix: API_PREFIX
    })
  );
});
