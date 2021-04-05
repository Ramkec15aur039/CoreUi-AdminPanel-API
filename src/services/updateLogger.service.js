/*
   Service Name : logs
*/

/** ***************** Models Import ******************************************************** */

const httpStatus = require("http-status");
const logger = require("../config/logger");

/** ***************** Import logs model from model ******************************************************** */

const { updateLogs, User, Favourite } = require("../models");

/** ***************** ApiError from utils ******************************************************** */

const ApiError = require("../utils/ApiError");
const Collections = require("../config/constants");
/** ***************** counter from services ******************************************************** *
// const counter = require("./counter.service");

/**
 * Create a user
 * @param {Object} userBody
 * @returns {Promise<User>}
 */
const createlogs = async (userBodyData) => {
  const userBody = userBodyData;
  try {
    const logs = await updateLogs.create(userBody);
    return logs;
    // throw new ApiError(httpStatus.CONFLICT, "title is already found");
  } catch (e) {
    logger.error(e);
  }
};

/**
 * Query for users
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const querylogs = async (filterData, options, join, joinOption) => {
  const filter = filterData;
  try {
    delete filter.isDeleted;
    const logss = await updateLogs.paginate(
      filter,
      options,
      {
        createdBy: 0,
        updatedBy: 0,
        isDeleted: 0,
      },
      join,
      joinOption
    ); // This third argument is to remove the field from response
    return logss;
  } catch (e) {
    logger.error(e);
  }
};

/**
 * Get user by id
 * @param {ObjectId} id
 * @returns {Promise<User>}
 */
const getlogsById = async (id) => {
  try {
    return updateLogs.find({ _id: id, isDeleted: false }, { isDeleted: 0 }); // find by id and isDeleted is false
  } catch (e) {
    logger.error(e);
  }
};

/**
 * Get user by email
 * @param {string} email
 * @returns {Promise<User>}
 */

/**
 * Update user by id
 * @param {ObjectId} userId
 * @param {Object} updateBody
 * @returns {Promise<User>}
 */
const updatelogsById = async (logsId, updateBodyData, user) => {
  const updateBody = updateBodyData;
  try {
    const logs = await updateLogs.findById(logsId);
    if (!logs) {
      throw new ApiError(httpStatus.NOT_FOUND, "logs not found");
    }

    const check = await logs.exists({ title: updateBody.title });
    if (!check) {
      updateBody.updatedBy = user._id; // updatedBy is set to user id from token
      await Object.assign(logs, updateBody);
      await logs.save();
      return logs;
    }
    if (updateBody.title === logs.title) {
      updateBody.updatedBy = user._id; // updatedBy is set to user id from token
      await Object.assign(logs, updateBody);
      await logs.save();
      return logs;
    }
    throw new ApiError(httpStatus.NOT_FOUND, "title already exist");
  } catch (e) {
    logger.error(e);
  }
};

/**
 * Delete user by id
 * @param {ObjectId} userId
 * @returns {Promise<User>}
 */
const deletelogsById = async (logsId) => {
  try {
    const logs = await updateLogs.findById(logsId);
    if (!logs) {
      throw new ApiError(httpStatus.NOT_FOUND, "Pilar not found");
    }
    logs.isDeleted = true;
    logs.save();
    return logs;
  } catch (e) {
    logger.error(e);
  }
};

const getUndoLogger = async (filterData, req) => {
  const filter = filterData;
  console.log(req.query);
  try {
    delete filter.isDeleted;
    const logs = await updateLogs.find(filter);
    if (!logs) {
      throw new ApiError(httpStatus.NOT_FOUND, "logs not found");
    }
    const collsName = logs[0].collectionName;
    console.log(Collections[collsName], logs[0].oldData._id, logs[0].data);
    const collectionName = Collections[collsName];
    const requiredId = logs[0].oldData._id;
    const currentData = Object.keys(logs[0].data);
    const updateData = {};
    currentData.forEach((e) => {
      const revertData = logs[0].oldData[e];
      updateData[e] = revertData;
    });
    if (collectionName === "User") {
      const revert = await User.findById(requiredId);
      await Object.assign(revert, updateData);
      await revert.save();
    }
    if (collectionName === "Favourite") {
      const revert = await Favourite.findById(requiredId);
      await Object.assign(revert, updateData);
      await revert.save();
    }

    return logs;
  } catch (e) {
    logger.error(e);
  }
};

// export all the service to use in logs.controller.js

module.exports = {
  createlogs,
  querylogs,
  getlogsById,
  updatelogsById,
  deletelogsById,
  getUndoLogger,
};
