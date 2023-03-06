const express = require("express");
const appointmentController = require("../controller/appointmentController");

const router = express.Router();
router
  .route("/")
  .get(appointmentController.getAllAppointments)
  .post(appointmentController.creatAppointments);
router.route("/:id").get(appointmentController.getAppointment);

module.exports = router;
