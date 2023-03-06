const mongoose = require("mongoose");
const scheduleSchema = new mongoose.Schema({
  userId: {
    type: String,
    requried: [true, "A schedule must have a userId "],
  },
  user: {
    type: String,
  },
  appointment: [],
});

const Schedule = mongoose.model("Schedule", scheduleSchema);
module.exports = Schedule;
