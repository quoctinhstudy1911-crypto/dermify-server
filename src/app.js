const express = require("express");
const cors = require("cors");

const userRoutes = require("./modules/user/user.routes");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/users", userRoutes);
app.use("/users", userRoutes);

app.get("/", (req, res) => {
  res.send("Dermify API Running...");
});

module.exports = app;