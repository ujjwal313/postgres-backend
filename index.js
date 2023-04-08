const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors");
const route = require("./routes");
require("dotenv").config();
const db = require("./database");

const PORT = process.env.PORT || 3500;

app.use(bodyParser.urlencoded({ extended: false }));

app.use(
  bodyParser.json({ limit: "50mb", extended: true, parameterLimit: 10000000 })
);

let allowedOrigins = "*";
const corsConfig = {
  origin: allowedOrigins,
  allowedHeaders: ["Authorization", "X-Requested-With", "Content-Type"],
  maxAge: 86400, // NOTICE: 1 day
  credentials: true,
};

app.use(cors(corsConfig));

app.use("/v1", route);

app.get("/", async (req, res) => {
  return res.status(200).json({
    success: true,
    message: `Hello Team`,
  });
});

app.use((req, res, next) => {
  const error = new Error("route not found");
  error.status = 401;
  next(error);
});

app.use((error, req, res, next) => {
  return res.status(error.status || 500).json({
    success: false,
    message: error.message,
  });
});

db.sequelize
  .sync({ force: false })
  .then(() => {
    console.log("db is synced");
  })
  .catch((error) => {
    console.log(error);
  });

app.listen(PORT, () => {
  console.log(`server running on ${PORT}`);
});
