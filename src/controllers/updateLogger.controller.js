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
const { udpateLogsService } = require("../services");

// create logs controller
const createupdateLogs = catchAsync(async (req, res) => {
  const logs = await udpateLogsService.createlogs(req.body, req.user);
  res.status(httpStatus.CREATED).send(logs);
});

// get logs based on query
const getUpdateLogger = catchAsync(async (req, res) => {
  const filter = pick(req.query, ["action", "collectionName"]);
  const options = pick(req.query, ["sortBy", "limit", "page"]);
  const join = [
    {
      path: "userId",
      model: "users",
    },
  ];
  const joinOption = "";
  const result = await udpateLogsService.querylogs(
    filter,
    options,
    join,
    joinOption
  );
  res.send(result);
});

// get logs based on logsId
const getupdateLogs = catchAsync(async (req, res) => {
  const logs = await udpateLogsService.getlogsById(req.params.logsId);
  if (!logs) {
    throw new ApiError(httpStatus.NOT_FOUND, "logs not found");
  }
  res.send(logs);
});

// update logs based on logsId
const updateupdateLogs = catchAsync(async (req, res) => {
  const logs = await udpateLogsService.updatelogsById(
    req.params.logsId,
    req.body,
    req.user
  );
  res.send(logs);
});

// delete logs based on the logsId
const deleteupdateLogs = catchAsync(async (req, res) => {
  await udpateLogsService.deletelogsById(req.params.logsId);
  res.status(200).send({ success: true });
});

// get logs based on logsId
const getUndoLogger = catchAsync(async (req, res) => {
  const filter = pick(req.query, ["userId", "_id"]);
  const result = await udpateLogsService.getUndoLogger(filter, req);
  res.send(result);
});
// exports all the controller to use in logs.route.js
module.exports = {
  createupdateLogs,
  getUpdateLogger,
  getupdateLogs,
  updateupdateLogs,
  deleteupdateLogs,
  getUndoLogger,
};
