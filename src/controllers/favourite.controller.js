/*
   controller Name : Favourite
*/

/** ******************  Import httpStatus ******************************************************** */

const httpStatus = require("http-status");
/** ******************  Import pick,ApiError and catchAsync ******************************************************** */
const pick = require("../utils/pick");
const ApiError = require("../utils/ApiError");
const catchAsync = require("../utils/catchAsync");

/** ******************  Import Services ******************************************************** */
const { favouriteService } = require("../services");

/*
function createFavourite  -  This function is used to create an favourite  
*/
const createFavourite = catchAsync(async (req, res) => {
  const favourite = await favouriteService.createFavourite(req.body); // send to createFavourite request before create

  res.status(httpStatus.CREATED).send(favourite);
});

/*
function getFavourite  -  This function is used to get an favourite  based on specifie corematicaName and role
*/

const getFavourites = catchAsync(async (req, res) => {
  const filter = pick(req.query, ["favouriteId", "userId"]);
  const options = pick(req.query, ["sortBy", "limit", "page"]);
  // const join = [
  //   {
  //     path: "userId",
  //     model: "users",
  //   },
  //   {
  //     path: "favouriteId",
  //     model: "users",
  //   },
  // ];
  const result = await favouriteService.queryFavourites(filter, options, req);
  res.send(result);
});

/*
function getFavourite  -  This function is used to get an favourite  based on id
*/
const getFavourite = catchAsync(async (req, res) => {
  const favourite = await favouriteService.getFavouriteById(
    req.params.favouriteId
  );
  if (!favourite) {
    throw new ApiError(httpStatus.NOT_FOUND, "Favourite not found");
  }
  res.send(favourite);
});

/*
function updateFavourite  -  This function is used to update an favourite  based on id
*/

const updateFavourite = catchAsync(async (req, res) => {
  const favourite = await favouriteService.updateFavouriteById(
    req.params.favouriteId,
    req.body
  );
  res.send(favourite);
});

/*
function deleteFavourite  -  This function is used to delete an favourite  based on id
*/
const deleteFavourite = catchAsync(async (req, res) => {
  await favouriteService.deleteFavouriteById(req.params.favouriteId);
  res.status(200).send({ success: true });
});

/*
exporting all the function using module exports
*/
module.exports = {
  createFavourite,
  getFavourites,
  getFavourite,
  updateFavourite,
  deleteFavourite,
};
