const fs = require("fs");
console.log("hello");

const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config({ path: "./config.env" });

const Scheudle = require("../../model/scheduleModel");

const DB = process.env.DATABASE.replace(
  "<PASSWORD>",
  process.env.DATABASE_PASSWORD
);

mongoose.connect(DB).then(() => console.log("connected to the databse"));

let data;
try {
  data = fs
    .readFileSync(`${__dirname}/freebusy.txt`, "utf-8")
    .trim()

    .split("\n");
} catch (error) {
  console.log(error.message);
}

//1. read the document into an object
const mapData = data.map((e) => e.split(";")).filter((e, i) => e.length >= 1);

let forData = [];
mapData.forEach((e, i) => {
  if (e.length === 4 && e[0].length > 0) {
    if (isNaN(e[0]) === false) {
      const dataObj = {
        userId: e[0],
        firstDate: e[1],
        secondDate: e[2],
      };
      forData.push(dataObj);
    }
  }

  if (e.length === 2 && e[1].length > 1) {
    const name = e[1].split("\r").join("");

    if (isNaN(e[1]) === true) {
      const dataObj = {
        userId: e[0],
        userName: name,
      };

      forData.push(dataObj);
    }
  }
});

const outputData = Object.values(
  mapData.reduce((res, obj, i) => {
    if (obj.length === 4 && obj[0].length > 0) {
      if (isNaN(obj[0]) === false) {
        const firstDatetArray = new Date(obj[1]).toISOString().split("T");

        const startDate = new Date(obj[1]);
        const endDate = new Date(obj[2]);
        const duration =
          (endDate.getTime() - startDate.getTime()) / (60 * 1000);

        const id = obj[0];
        res[id] = res[id] || {
          userId: obj[0],
          appointment: [],
        };

        if (res[id].appointment.length == 0) {
          const obj = {
            year: firstDatetArray[0],
            slot: [{ startDate, endDate, duration }],
          };

          res[id].appointment.push(obj);
        }

        if (res[id].appointment.length > 0) {
          const indexFound = res[id].appointment.findIndex(
            (e) => e.year === firstDatetArray[0]
          );
          if (indexFound != -1) {
            res[id].appointment[indexFound].slot.push({
              startDate,
              endDate,
              duration,
            });
          } else {
            const obj = {
              year: firstDatetArray[0],
              slot: [{ startDate, endDate, duration }],
            };

            res[id].appointment.push(obj);
          }
        }
      }
    }
    if (obj.length === 2 && obj[1].length > 1) {
      const name = obj[1].split("\r").join("");
      const nameId = obj[0];
      if (isNaN(obj[1]) === true && res[nameId]) {
        res[nameId]["user"] = name;
        //console.log(res[nameId].appointment[1]);
      }
    }

    return res;
  }, {})
);

const importData = async () => {
  try {
    await Scheudle.create(outputData);
    console.log("data updated sucessfully");
  } catch (error) {
    console.log(error.message);
  }
  process.exit();
};
const deleteData = async () => {
  try {
    await Scheudle.deleteMany();
    console.log("data deleted sucessfully");
  } catch (error) {
    console.log(error.message);
  }
  process.exit();
};
if (process.argv[2] === "--import") {
  importData();
} else if (process.argv[2] === "--delete") {
  deleteData();
}
