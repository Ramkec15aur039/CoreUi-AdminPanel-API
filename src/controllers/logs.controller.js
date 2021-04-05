/*
   controller Name : logs
*/

/** ******************  Import httpStatus ******************************************************** */

const httpStatus = require("http-status");
/** ******************  Import pick,ApiError and catchAsync ******************************************************** */
const pick = require("../utils/pick");
const ApiError = require("../utils/ApiError");
const catchAsync = require("../utils/catchAsync");

/** ******************  Import Services ******************************************************** */
const { logsService } = require("../services");

// create logs controller
const createLogs = catchAsync(async (req, res) => {
  const logs = await logsService.createlogs(req.body, req.user);
  res.status(httpStatus.CREATED).send(logs);
});

// get logs based on query
const getLogger = catchAsync(async (req, res) => {
  const filter = pick(req.query, ["action", "collectionName"]);
  const options = pick(req.query, ["sortBy", "limit", "page"]);
  const join = [
    {
      path: "userId",
      model: "users",
    },
  ];
  const joinOption = "";
  const result = await logsService.querylogs(filter, options, join, joinOption);
  res.send(result);
});

// get logs based on logsId
const getLogs = catchAsync(async (req, res) => {
  const logs = await logsService.getlogsById(req.params.logsId);
  if (!logs) {
    throw new ApiError(httpStatus.NOT_FOUND, "logs not found");
  }
  res.send(logs);
});

// update logs based on logsId
const updateLogs = catchAsync(async (req, res) => {
  const logs = await logsService.updatelogsById(
    req.params.logsId,
    req.body,
    req.user
  );
  res.send(logs);
});

// delete logs based on the logsId
const deleteLogs = catchAsync(async (req, res) => {
  await logsService.deletelogsById(req.params.logsId);
  res.status(200).send({ success: true });
});

// exports all the controller to use in logs.route.js
module.exports = {
  createLogs,
  getLogger,
  getLogs,
  updateLogs,
  deleteLogs,
};
