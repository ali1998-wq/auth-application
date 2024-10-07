const cors = require("cors");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
const express = require("express");
const rootRouter = require("../../routes/index");
const healthRouter = require("../../routes/health");
const app = express();
dotenv.config();

app.use(cors());
app.use(bodyParser({ extended: true }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(healthRouter);
app.use("/api", rootRouter);

module.exports = app;