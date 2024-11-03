const express= require("express");
const morgan = require("morgan");
const bodyParser = require('body-parser');


const cors = require("cors")

const router = require("./Routes/index"); 


const server = express();

server.use(morgan("dev"));
server.use(express.json());

server.use(cors({
    origin: ['https://www.royalgames.me', 'http://localhost:3000']
  }));
server.use(bodyParser.json()); 


server.use(router);

module.exports= server;