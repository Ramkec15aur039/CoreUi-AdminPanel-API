/*
   Service Name : Users
*/

/** ***************** Models Import ******************************************************** */
const httpStatus = require("http-status");
const logger = require("../config/logger");
const { User } = require("../models");

/** ***************** package Import ******************************************************** */

/** ***************** ApiError Import ******************************************************** */
const ApiError = require("../utils/ApiError");

/** ***************** Counter services Import ******************************************************** */
const counter = require("./counter.service");
const logsService = require("./logs.service");
const updateLogsService = require("./updateLogger.service");
const emailService = require("./email.service");
// const jsonFile = require("../../convertedData-15-03-21.json");

/**
 * Create a user
 * @param {Object} userBody
 * @returns {Promise<User>}
 */
const createUser = async (userBodyData, req) => {
  const userBody = userBodyData;
  const userName = userBody.userName;

  // if (await User.isEmailTaken(userBody.email)) {
  //   throw new ApiError(httpStatus.BAD_REQUEST, "Email already taken");
  // }
  console.info("dbjhdbyiiyh", 1);

  let duplicateBody = { ...userBody };
  let requiredData = { isDeleted: false };
  Object.keys(duplicateBody).map((key, index) => {
    if (
      key === "email" ||
      key === "lastName" ||
      key === "firstName" ||
      key === "mobileNumber"
    ) {
      requiredData[key] = duplicateBody[key];
    }
  });
  
  console.log(duplicateBody, 2, requiredData);
  const indenticalCheck = await User.find(requiredData);
  console.log(!indenticalCheck, !indenticalCheck.length, indenticalCheck);
  if (!indenticalCheck || !indenticalCheck.length) {

    const id = await counter.getCount("users"); // passing users id to get counter value to autoIncrement _id

    userBody._id = id.toString();
    userBody.createdBy = userBody._id;
    try {
      console.log(userBody,"identical",indenticalCheck)
      const user = await User.create(userBody).catch((e) => {
        if (e.code === 11000) {
          logger.error(`${JSON.stringify(e.keyValue)} duplicate error`);
          const duplicates = Object.keys(e.keyValue);
          throw new Error(`${duplicates} duplicates details`);
        }
      });

      const logBodyData = {
        action: "create",
        userId: userBody._id,
        collectionName: "users",
        data: userBody,
      };
      logsService.createlogs(logBodyData);
      if (user) {
          // Service.createContacts(
          //   "help.applogiq@gmail.com",
          //   userBemailodyData,
          //   req.user || userBody.email 
          // );
        return user;
      }
    } catch (e) {
      if (e.toString().includes("duplicates"))
        throw new ApiError(httpStatus.CONFLICT, e);
      else throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, e);
    }
    //   } else if (first)
    //     throw new ApiError(httpStatus.CONFLICT, "firstName already taken");
    //   else if (last)
    //     throw new ApiError(httpStatus.CONFLICT, " lastName already taken");
    // } else throw new ApiError(httpStatus.CONFLICT, " email already taken");
  } else {
    return { code: 200, message: "identical contact" };
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

function escapeRegExp(str) {
  return str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
}
const queryUsers = async (filterData, options, req) => {
  const filter = filterData;
  const logBodyData = {
    action: "get",
    // userId: req.user._id,
    collectionName: "users",
    data: filter,
  };
  logsService.createlogs(logBodyData);
  // const sort = "";
  // if (filter.userName)
  //   filter.userName = {
  //     $regex: escapeRegExp(filter.userName),
  //     $options: "i",
  //   };
  if (req.query.search) {
    filter.$or = [
      {
        firstName: {
          $regex: `${escapeRegExp(req.query.search)}`,
          $options: "i",
        },
      },
      {
        lastName: {
          $regex: `${escapeRegExp(req.query.search)}`,
          $options: "i",
        },
      },
    ];
  }

  // if (options.sortBy) {
  //   if (options.sortBy) {
  //     const sortingCriteria = [];
  //     options.sortBy.split(",").forEach((sortOption) => {
  //       const [key, order] = sortOption.split(":");
  //       sortingCriteria.push((order === "desc" ? "-" : "") + key);
  //     });
  //     sort = sortingCriteria.join(" ");
  //   } else {
  //     sort = { createdAt: -1 };
  //   }
  // }
  filter.isDeleted = false;
  console.log(filter);
  try {
    const users = await User.paginate(filter, options, {
      createdBy: 0,
      updatedBy: 0,
      isDeleted: 0
    }); // This third argument is to remove the field from response
    // const users = await User.find(filter)
    // .collation({ locale: "en" })
    // .sort(sort);

    return users;
  } catch (e) {
    logger.error(e);
  }
};

/**
 * Get user by id
 * @param {ObjectId} id
 * @returns {Promise<User>}
 */
const getUserById = async (id) => {
  try {
    const logBodyData = {
      action: "get",
      userId: id,
      collectionName: "users",
      data: { _id: id },
    };
    await logsService.createlogs(logBodyData);
    return User.find({ _id: id, isDeleted: false }, { isDeleted: 0 });
  } catch (e) {
    logger.error(e);
  }
};

/**
 * Get user by email
 * @param {string} email
 * @returns {Promise<User>}
 */
const getUserByEmail = async (email) => {
  return User.findOne({ email, isDeleted: false });
};

/**
 * Update user by id
 * @param {ObjectId} userId
 * @param {Object} updateBody
 * @returns {Promise<User>}
 */
const updateUserById = async (userId, updateBodyData, req) => {
  const updateBody = updateBodyData;
  try {
    const user = await User.findById(userId);
    let cpyUser;
    let cpyUpdateBody;
    if (user) cpyUser = { ...user._doc };
    if (updateBody) cpyUpdateBody = { ...updateBody };
    // emailService.updateContacts(
    //   "help.applogiq@gmail.com",
    //   cpyUpdateBody,
    //   cpyUser,
    //   req.user
    // );
    const logBodyData = {
      action: "update",
      userId: user._id,
      collectionName: "users",
      data: updateBody,
    };
    logsService.createlogs(logBodyData);
    const updateLogBodyData = {
      action: "update",
      userId: user._id,
      collectionName: "users",
      oldData: user,
      data: updateBody,
    };
    updateLogsService.createlogs(updateLogBodyData);

    if (!user) {
      throw new ApiError(httpStatus.NOT_FOUND, "User not found");
    }
    if (
      updateBody.email &&
      (await User.isEmailTaken(updateBody.email, userId))
    ) {
      throw new ApiError(httpStatus.BAD_REQUEST, "Email already taken");
    }
    updateBody.updatedBy = userId;
    Object.assign(user, updateBody);
    return await user
      .save()
      .then((res) => {
        console.log(res);
        return res;
      })
      .catch((e) => {
        if (e.code === 11000) {
          logger.error(`${JSON.stringify(e.keyValue)} duplicate error`);
          const duplicates = Object.keys(e.keyValue);
          throw new Error(`${duplicates} duplicates details`);
        } else {
          throw new Error(e);
        }
      });
  } catch (e) {
    if (e.toString().includes("duplicates"))
      throw new ApiError(httpStatus.CONFLICT, e);
    else throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, e);
  }
};

/**
 * Delete user by id
 * @param {ObjectId} userId
 * @returns {Promise<User>}
 */
const deleteUserById = async (userId) => {
  const user = await User.findById(userId);

  const logBodyData = {
    action: "delete",
    userId,
    collectionName: "users",
    data: userId,
  };
  await logsService.createlogs(logBodyData);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, "User not found");
  }
  // await user.remove();
  user.isDeleted = true;
  await user.save();
  return user;
};
// exporting all the methods
module.exports = {
  createUser,
  queryUsers,
  getUserById,
  getUserByEmail,
  updateUserById,
  deleteUserById,
};
