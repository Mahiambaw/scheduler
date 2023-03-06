const Schedules = require("../model/scheduleModel");
const apiFeatures = require("../util/apiFeatures");
const catchAsync = require("../util/catchAsync");
const AppError = require("../util/appError");

/*
Get all the appointments 
Get all appointments using  userid or multiple user id 
*/
exports.getAllAppointments = catchAsync(async (req, res, next) => {
  const api = new apiFeatures(Schedules.find(), req.query).filter();

  const appointment = await api.query;

  res.status(200).json({
    status: "sucess",
    result: appointment.length,
    data: appointment,
  });
});

/*
  * check if the user exists in the
  * if the user exists  , checkif the user has an ppointment data 
  *  if the apppointment for that slot does not exist, create one 
  * if the user does not exist , create a new appointment for the user 

*/
exports.creatAppointments = catchAsync(async (req, res, next) => {
  let user = await Schedules.findOne({
    userId: req.body.userId,
  });

  if (
    req.body.startDate == null ||
    req.body.endDate == null ||
    req.body.year == null
  ) {
    const err = new AppError("Dare should have a value", 404);

    return next(err);
  }

  let startDateBody = new Date(req.body.startDate);

  let endDateBody = new Date(req.body.endDate);
  let durationBody =
    (endDateBody.getTime() - startDateBody.getTime()) / (60 * 1000);
  if (startDateBody < Date.now()) {
    const err = new AppError("Dare should have a value", 404);

    return next(err);
  }

  if (user && req.body.year !== null) {
    let foundIndex = user.appointment.findIndex(
      (el) => el.year === req.body.year
    );

    if (foundIndex !== -1) {
      user.appointment[foundIndex].slot.forEach((el, i) => {
        /* 
            * for mongoose to update array insde an array
                ** first the  correct patheof the array 
                ** second state that it is will be modified
                *** lastly apply the markmodifed with the correct path
           
        */

        let startOutput = user.appointment[foundIndex].slot[i].startDate;
        let endOutput = user.appointment[foundIndex].slot[i].endDate;
        let durationOutput = user.appointment[foundIndex].slot[i].duration;
        let titleOutput = user.appointment[foundIndex].slot[i].title;

        if (el.startDate.getTime() !== startDateBody.getTime()) {
          startOutput = "Modified";
          endOutput = "Modified";
          durationOutput = "Modified";
          titleOutput = "Modified";

          user.appointment[foundIndex].slot.push({
            startDate: startDateBody,
            endDate: endDateBody,
            duration: durationBody,
            title: req.body.title,
          });
          user.markModified(`appointment.${foundIndex}.slot.${i + 1}`);
        } else {
          return res.status(400).json({
            code: 400,
            message: "time is already booked ",
          });
        }
      });
    } else {
      const obj = {
        year: req.body.year,
        slot: [
          {
            startDate: startDateBody,
            endDate: endDateBody,
            duration: durationBody,
            title: req.body.title,
          },
        ],
      };

      user.appointment.push(obj);
    }

    var data = await user.save();

    res.status(200).json({
      status: "sucess",
      userId: data.userId,
      user: data.user,
      appointment: data.appointment,
    });
  } else {
    if (
      startDateBody < Date.now() ||
      req.body.startDate == null ||
      req.body.endDate == null ||
      req.body.year == null
    ) {
      const err = new AppError("Dare should have a value", 404);

      return next(err);
    }
    var newAppointment = {
      userId: req.body.userId,
      user: req.body.user,

      appointment: [
        {
          year: req.body.year,

          slot: [
            {
              startDate: startDateBody,
              endDate: endDateBody,
              duration: durationBody,
              title: req.body.title,
            },
          ],
        },
      ],
    };
    user = new Schedules(newAppointment);
    data = await user.save();

    res.status(200).json({
      status: "sucess",

      userId: data.id,
      user: data.user,
      appointment: data.appointment,
    });
  }
});

/*
 * get one user id by using the mongoose _id
 */
exports.getAppointment = catchAsync(async (req, res, next) => {
  const appointment = await Schedules.find({ userId: req.params.id });
  res.status(200).json({
    status: "sucess",
    data: appointment,
  });
});
