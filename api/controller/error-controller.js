const AppError = require("./../utils/AppError");

const sendErrorDev = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack,
  });
};

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status = err.status || "error";
  console.log(process.env.NODE_ENV, "🧨");

  sendErrorDev(err, res);
};
