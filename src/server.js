const express = require("express");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const cors = require("cors");

const router = require("./Routes/index");

const server = express();

server.use(morgan("dev"));
server.use(express.json());

// --- CORS (flexible y con preflight) ---
const allowedOrigins = [
  "https://www.royalgames.me",
  "http://localhost:5173",
  "https://html-classic.itch.zone",
  /^https?:\/\/([^/.]+\.)?itch\.io$/i,           // cualquier subdominio de itch.io
  /^https?:\/\/v6p9d9t4\.ssl\.hwcdn\.net$/i      // CDN que usa itch.io para servir builds
];

const corsOptions = {
  origin: (origin, cb) => {
    // Permite herramientas sin Origin (curl, Unity local, etc.)
    if (!origin) return cb(null, true);
    const ok = allowedOrigins.some(o =>
      typeof o === "string" ? o === origin : o.test(origin)
    );
    return ok ? cb(null, true) : cb(new Error(`CORS bloqueado: ${origin}`));
  },
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: false,
  optionsSuccessStatus: 204
};

server.use(cors(corsOptions));
// Responder preflight en TODAS las rutas
server.options("*", cors(corsOptions));

server.use(bodyParser.json());

// Tus rutas
server.use(router);

// --- CORS también en errores (4xx/5xx) ---
server.use((err, req, res, next) => {
  const origin = req.headers.origin;
  const ok = !origin || allowedOrigins.some(o =>
    typeof o === "string" ? o === origin : o.test(origin)
  );

  if (ok) {
    res.setHeader("Access-Control-Allow-Origin", origin || "*");
    res.setHeader("Vary", "Origin");
    res.setHeader("Access-Control-Allow-Methods", corsOptions.methods.join(","));
    res.setHeader("Access-Control-Allow-Headers", corsOptions.allowedHeaders.join(","));
  } else {
    // fallback seguro
    res.setHeader("Access-Control-Allow-Origin", "*");
  }

  const status = err.status || 500;
  res.status(status).json({ error: err.message || "internal_error" });
});

module.exports = server;
