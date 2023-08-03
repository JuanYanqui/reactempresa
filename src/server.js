const express = require("express");
const cors = require("cors");

const corsOptions = {
  origin: "http://localhost:8000",
};

const app = express();
app.use(cors(corsOptions));
