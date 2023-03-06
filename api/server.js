const dotenv = require("dotenv");
const mongoose = require("mongoose");
dotenv.config({ path: "./config.env" });
const app = require("./app");

const DB = process.env.DATABASE.replace(
  "<PASSWORD>",
  process.env.DATABASE_PASSWORD
);
console.log(DB);
mongoose
  .connect(DB)
  .then(() => console.log("DB connected"))
  .catch((error) => console.error(error.message));

const port = 3000;
app.listen(port, () => {
  console.log(`listeing on port ${port}`);
});
