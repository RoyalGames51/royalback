// src/server.js
const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const bodyParser = require("body-parser");
const router = require("./Routes/index");

const app = express();

app.use(morgan("dev"));
app.use(express.json());
app.use(cors({
  origin: [
    'https://www.royalgames.me',
    'http://localhost:5173',
    'https://html-classic.itch.zone',
    'https://royalgames51.itch.io/',
    'https://itch.io/',
    'https://html-classic.itch.zone/'
  ]
}));
app.use(bodyParser.json());

app.use(router);

module.exports = app;
