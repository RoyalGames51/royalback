import cors from "cors";
import express from "express";

const app = express();

// 1) CORS OPTIONS flexible
const allowed = [
  /^https?:\/\/localhost(:\d+)?$/i,
  /^https?:\/\/(.*\.)?royalgames\.me$/i,
  /^https?:\/\/(.*\.)?itch\.io$/i,                 // tu página pública en itch
  /^https?:\/\/html-classic\.itch\.zone$/i,        // host del iframe de builds
  /^https?:\/\/v6p9d9t4\.ssl\.hwcdn\.net$/i        // CDN de itch (a veces sirve assets)
];

const corsOptions = {
  origin: (origin, cb) => {
    // Permitir herramientas sin Origin (Unity en local, algunos navegadores)
    if (!origin) return cb(null, true);
    if (allowed.some(rx => rx.test(origin))) return cb(null, true);
    return cb(new Error(`CORS bloqueado para Origin: ${origin}`));
  },
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: false,                 // true solo si usas cookies
  optionsSuccessStatus: 204
};

// 2) Orden: CORS primero, luego JSON, luego rutas
app.use(cors(corsOptions));
app.options("*", cors(corsOptions));   // responde a preflight en TODAS las rutas
app.use(express.json());

// ...tus rutas...
// app.get("/user/:id", ...);
// app.put("/add/chips", ...);
// app.put("/remove/chips", ...);

// 3) CORS también en errores
app.use((err, req, res, next) => {
  const origin = req.headers.origin;
  if (origin && allowed.some(rx => rx.test(origin))) {
    res.setHeader("Access-Control-Allow-Origin", origin);
    res.setHeader("Vary", "Origin");
    res.setHeader("Access-Control-Allow-Credentials", "false");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
    res.setHeader("Access-Control-Allow-Methods", "GET,POST,PUT,PATCH,DELETE,OPTIONS");
  } else {
    // fallback seguro
    res.setHeader("Access-Control-Allow-Origin", "*");
  }
  const status = err.status || 500;
  res.status(status).json({ error: err.message || "internal_error" });
});
