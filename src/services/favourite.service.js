/*
   Service Name : Favourites
*/

/** ***************** Models Import ******************************************************** */
const httpStatus = require("http-status");
const logger = require("../config/logger");
const { Favourite } = require("../models");

/** ***************** package Import ******************************************************** */

/** ***************** ApiError Import ******************************************************** */
const ApiError = require("../utils/ApiError");

/** ***************** Counter services Import ******************************************************** */
const counter = require("./counter.service");
const logsService = require("./logs.service");

/**
 * Create a favourite
 * @param {Object} favouriteBody
 * @returns {Promise<Favourite>}
 */
const createFavourite = async (userBodyData) => {
  const userBody = userBodyData;

  const id = await counter.getCount("favourites"); // passing users id to get counter value to autoIncrement _id

  userBody._id = id.toString();
  userBody.createdBy = userBody.userId;
  try {
    const favourite = await Favourite.create(userBody);
    const logBodyData = {
      action: "create",
      userId: userBody._id,
      collectionName: "favouites",
      data: userBody,
    };
    await logsService.createlogs(logBodyData);
    return favourite;
  } catch (e) {
    logger.error(e);
  }
};

function escapeRegExp(str) {
  return str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
}

/**
 * Query for users
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const queryFavourites = async (filterData, options, req) => {
  const filter = filterData;
  const logBodyData = {
    action: "get",
    userId: req.user._id,
    collectionName: "favourites",
    data: filter,
  };
  await logsService.createlogs(logBodyData);
  // const sort = "";
  try {
    // if (req.query.search) {
    //   const query = {};
    //   const userQuery = {};
    //   const favId = [];
    //   const userSearchId = [];
    //   if (filter.userId) query.userId = filter.userId;
    //   query.isDeleted = filter.isDeleted;
    //   await Favourite.find(query).then((e) => {
    //     e.forEach((id) => {
    //       favId.push(id.favouriteId);
    //     });
    //   });
    //   userQuery.$or = [
    //     {
    //       firstName: {
    //         $regex: `${escapeRegExp(req.query.search)}`,
    //         $options: "i",
    //       },
    //     },
    //     {
    //       lastName: {
    //         $regex: `${escapeRegExp(req.query.search)}`,
    //         $options: "i",
    //       },
    //     },
    //   ];
    //   userQuery._id = { $in: favId };
    //   await User.find(userQuery).then((data) => {
    //     data.forEach((userId) => {
    //       userSearchId.push(userId._id);
    //     });
    //   });
    //   // if(userSearchId.length)
    //   filter.favouriteId = { $in: userSearchId };
    // }

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
    let favourites;
    if (req.query.search) {
      favourites = Favourite.aggregate([
        {
          $lookup: {
            from: "users",
            localField: "favouriteId",
            foreignField: "_id",
            as: "favouriteUser",
          },
        },
        {
          $unwind: {
            path: "$favouriteUser",
          },
        },
        {
          $sort: {
            "favouriteUser.lastName": 1,
          },
        },
        {
          $match: {
            $or: [
              {
                "favouriteUser.lastName": {
                  $regex: `${escapeRegExp(req.query.search)}`,
                  $options: "i",
                },
              },
              {
                "favouriteUser.firstName": {
                  $regex: `${escapeRegExp(req.query.search)}`,
                  $options: "i",
                },
              },
            ],

            // "favouriteUser.lastName": {
            //   $regex: `${escapeRegExp(req.query.search)}`,
            //   $options: "i",
            // },
            isDeleted: false,
            userId: `${req.user._id}`,
          },
        },
        {
          $project: {
            "favouriteUser.id": "$favouriteUser._id",
            "favouriteUser.firstName": "$favouriteUser.firstName",
            "favouriteUser.lastName": "$favouriteUser.lastName",
            "favouriteUser.isAdmin": "$favouriteUser.isAdmin",
            "favouriteUser.role": "$favouriteUser.role",
            "favouriteUser.createdAt": "$favouriteUser.createdAt",
            "favouriteUser.updatedAt": "$favouriteUser.updatedAt",
            "favouriteUser.isActive": "$favouriteUser.isActive",
            "favouriteUser.isDeleted": "$favouriteUser.isDeleted",
            favouriteId: "$favouriteId",
            userId: "$userId",
            createdBy: "$createdBy",
            updatedBy: "$updatedBy",
            isActive: "$isActive",
            isDeleted: "$isDeleted",
            // favouriteUser: "$favouriteUser",
          },
        },
      ]);
      // console.log(match);
    }
    // const users = await User.paginate(filter, options, {
    //   createdBy: 0,
    //   updatedBy: 0,
    //   isDeleted: 0,
    // }); // This third argument is to remove the field from response
    // console.log(filter)
    // const favourites = await Favourite.find(filter)
    //   .populate([
    //     {
    //       path: "favouriteId",
    //       model: "users",
    //       options: { sort: "lastName" },
    //     },
    //   ])
    //   .collation({ locale: "en" })
    //   .sort(sort)
    //   .exec();
    else if (filter.userId && !filter.favouriteId) {
      favourites = Favourite.aggregate([
        {
          $lookup: {
            from: "users",
            localField: "favouriteId",
            foreignField: "_id",
            as: "favouriteUser",
          },
        },
        {
          $unwind: {
            path: "$favouriteUser",
          },
        },
        {
          $sort: {
            "favouriteUser.lastName": 1,
          },
        },
        {
          $match: {
            userId: filter.userId,
            isDeleted: false,
          },
        },
        {
          $project: {
            "favouriteUser.id": "$favouriteUser._id",
            "favouriteUser.firstName": "$favouriteUser.firstName",
            "favouriteUser.lastName": "$favouriteUser.lastName",
            "favouriteUser.isAdmin": "$favouriteUser.isAdmin",
            "favouriteUser.role": "$favouriteUser.role",
            "favouriteUser.createdAt": "$favouriteUser.createdAt",
            "favouriteUser.updatedAt": "$favouriteUser.updatedAt",
            "favouriteUser.isActive": "$favouriteUser.isActive",
            "favouriteUser.isDeleted": "$favouriteUser.isDeleted",
            favouriteId: "$favouriteId",
            userId: "$userId",
            createdBy: "$createdBy",
            updatedBy: "$updatedBy",
            isActive: "$isActive",
            isDeleted: "$isDeleted",
            // favouriteUser: "$favouriteUser",
          },
        },
      ]);
    } else if (!filter.userId && filter.favouriteId) {
      favourites = Favourite.aggregate([
        {
          $lookup: {
            from: "users",
            localField: "favouriteId",
            foreignField: "_id",
            as: "favouriteUser",
          },
        },
        {
          $unwind: {
            path: "$favouriteUser",
          },
        },
        {
          $sort: {
            "favouriteUser.lastName": 1,
          },
        },
        {
          $match: {
            favouriteId: filter.favouriteId,
            isDeleted: false,
          },
        },
        {
          $project: {
            "favouriteUser.id": "$favouriteUser._id",
            "favouriteUser.firstName": "$favouriteUser.firstName",
            "favouriteUser.lastName": "$favouriteUser.lastName",
            "favouriteUser.isAdmin": "$favouriteUser.isAdmin",
            "favouriteUser.role": "$favouriteUser.role",
            "favouriteUser.createdAt": "$favouriteUser.createdAt",
            "favouriteUser.updatedAt": "$favouriteUser.updatedAt",
            "favouriteUser.isActive": "$favouriteUser.isActive",
            "favouriteUser.isDeleted": "$favouriteUser.isDeleted",
            favouriteId: "$favouriteId",
            userId: "$userId",
            createdBy: "$createdBy",
            updatedBy: "$updatedBy",
            isActive: "$isActive",
            isDeleted: "$isDeleted",
            // favouriteUser: "$favouriteUser",
          },
        },
      ]);
    } else if (filter.userId && filter.favouriteId) {
      favourites = Favourite.aggregate([
        {
          $lookup: {
            from: "users",
            localField: "favouriteId",
            foreignField: "_id",
            as: "favouriteUser",
          },
        },
        {
          $unwind: {
            path: "$favouriteUser",
          },
        },
        {
          $sort: {
            "favouriteUser.lastName": 1,
          },
        },
        {
          $match: {
            favouriteId: filter.favouriteId,
            userId: filter.userId,
            isDeleted: false,
          },
        },
        {
          $project: {
            "favouriteUser.id": "$favouriteUser._id",
            "favouriteUser.firstName": "$favouriteUser.firstName",
            "favouriteUser.lastName": "$favouriteUser.lastName",
            "favouriteUser.isAdmin": "$favouriteUser.isAdmin",
            "favouriteUser.role": "$favouriteUser.role",
            "favouriteUser.createdAt": "$favouriteUser.createdAt",
            "favouriteUser.updatedAt": "$favouriteUser.updatedAt",
            "favouriteUser.isActive": "$favouriteUser.isActive",
            "favouriteUser.isDeleted": "$favouriteUser.isDeleted",
            favouriteId: "$favouriteId",
            userId: "$userId",
            createdBy: "$createdBy",
            updatedBy: "$updatedBy",
            isActive: "$isActive",
            isDeleted: "$isDeleted",
            // favouriteUser: "$favouriteUser",
          },
        },
      ]);
    } else {
      favourites = Favourite.aggregate([
        {
          $lookup: {
            from: "users",
            localField: "favouriteId",
            foreignField: "_id",
            as: "favouriteUser",
          },
        },
        {
          $unwind: {
            path: "$favouriteUser",
          },
        },
        {
          $sort: {
            "favouriteUser.lastName": 1,
          },
        },
        {
          $match: {
            isDeleted: false,
            userId: `${req.user._id}`,
          },
        },
        {
          $project: {
            "favouriteUser.id": "$favouriteUser._id",
            "favouriteUser.firstName": "$favouriteUser.firstName",
            "favouriteUser.lastName": "$favouriteUser.lastName",
            "favouriteUser.isAdmin": "$favouriteUser.isAdmin",
            "favouriteUser.role": "$favouriteUser.role",
            "favouriteUser.email": "$favouriteUser.email",
            "favouriteUser.userName": "$favouriteUser.userName",
            "favouriteUser.mobileNumber": "$favouriteUser.mobileNumber",
            "favouriteUser.specialty": "$favouriteUser.specialty",
            "favouriteUser.fax": "$favouriteUser.fax",
            "favouriteUser.title": "$favouriteUser.title",
            "favouriteUser.pager": "$favouriteUser.pager",
            "favouriteUser.officePhone": "$favouriteUser.officePhone",
            "favouriteUser.notes": "$favouriteUser.notes",
            "favouriteUser.pcp": "$favouriteUser.pcp",
            "favouriteUser.createdAt": "$favouriteUser.createdAt",
            "favouriteUser.updatedAt": "$favouriteUser.updatedAt",
            "favouriteUser.isActive": "$favouriteUser.isActive",
            "favouriteUser.isDeleted": "$favouriteUser.isDeleted",
            favouriteId: "$favouriteId",
            userId: "$userId",
            createdBy: "$createdBy",
            updatedBy: "$updatedBy",
            isActive: "$isActive",
            isDeleted: "$isDeleted",
            // favouriteUser: "$favouriteUser",
          },
        },
      ]);
    }
    return favourites;
  } catch (e) {
    logger.error(e);
  }
};

/**
 * Get favourite by id
 * @param {ObjectId} id
 * @returns {Promise<Favourite>}
 */
const getFavouriteById = async (id) => {
  try {
    const logBodyData = {
      action: "get",
      userId: id,
      collectionName: "favourites",
      data: { _id: id },
    };
    await logsService.createlogs(logBodyData);
    return Favourite.find({ _id: id, isDeleted: false }, { isDeleted: 0 });
  } catch (e) {
    logger.error(e);
  }
};

/**
 * Get favourite by email
 * @param {string} email
 * @returns {Promise<Favourite>}
 */

/**
 * Update favourite by id
 * @param {ObjectId} favouriteId
 * @param {Object} updateBody
 * @returns {Promise<Favourite>}
 */
const updateFavouriteById = async (favouriteId, updateBodyData) => {
  const updateBody = updateBodyData;
  console.log(updateBody);
  const favourite = await Favourite.findById(favouriteId);
  const logBodyData = {
    action: "update",
    userId: favourite._id,
    collectionName: "favourites",
    data: updateBody,
  };
  await logsService.createlogs(logBodyData);
  if (!favourite) {
    throw new ApiError(httpStatus.NOT_FOUND, "Favourite not found");
  }

  updateBody.updatedBy = updateBody.userId;
  Object.assign(favourite, updateBody);
  await favourite.save();
  return favourite;
};

/**
 * Delete favourite by id
 * @param {ObjectId} favouriteId
 * @returns {Promise<Favourite>}
 */
const deleteFavouriteById = async (favouriteId) => {
  const favourite = await Favourite.findById(favouriteId);
  const logBodyData = {
    action: "delete",
    favouriteId,
    collectionName: "favourites",
    data: favouriteId,
  };
  await logsService.createlogs(logBodyData);
  if (!favourite) {
    throw new ApiError(httpStatus.NOT_FOUND, "Favourite not found");
  }
  // await favourite.remove();
  favourite.isDeleted = true;
  await favourite.save();
  return favourite;
};

// exporting all the methods
module.exports = {
  createFavourite,
  queryFavourites,
  getFavouriteById,
  updateFavouriteById,
  deleteFavouriteById,
};
