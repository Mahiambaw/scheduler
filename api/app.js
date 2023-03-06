const express = require("express");
const cors = require("cors");
const appointmentRoute = require("./routes/appointmentRoute");

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/v1/appointments", appointmentRoute);

app.all("*", (req, res, next) => {
  console.log(`${req.originalUrl} not found`);
  next();
});

//app.use("api/v1/user", userRoute);
module.exports = app;
