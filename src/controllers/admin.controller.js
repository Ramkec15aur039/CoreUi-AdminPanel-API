/*
   controller Name : User
*/

/** ******************  Import httpStatus ******************************************************** */

const httpStatus = require("http-status");
/** ******************  Import pick,ApiError and catchAsync ******************************************************** */
const pick = require("../utils/pick");
const ApiError = require("../utils/ApiError");
const catchAsync = require("../utils/catchAsync");

/** ******************  Import Services ******************************************************** */
const { adminService } = require("../services");

/*
function createUser  -  This function is used to create an user  
*/
const createUser = catchAsync(async (req, res) => {
  const user = await adminService.createUser(req.body, req); // send to createUser request before create

  res.status(httpStatus.CREATED).send(user);
});

/*
function getUser  -  This function is used to get an user  based on specifie corematicaName and role
*/

const getUsers = catchAsync(async (req, res) => {
  // console.log(req.query)
  const filter = pick(req.query, [
    "userName",
    "role",
    "mobileNumber",
    "specialty",
    "pager",
    "fax",
    "officePhone",
    "isLoggedIn",
    "pcp",
  ]);
  const options = pick(req.query, ["sortBy", "limit", "page"]);
  const result = await adminService.queryUsers(filter, options, req);
  res.send(result);
});

/*
function getUser  -  This function is used to get an user  based on id
*/
const getUser = catchAsync(async (req, res) => {
  const user = await adminService.getUserById(req.params.userId);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, "User not found");
  }
  res.send(user);
});

/*
function updateUser  -  This function is used to update an user  based on id
*/

const updateUser = catchAsync(async (req, res) => {
  const user = await adminService.updateUserById(
    req.params.userId,
    req.body,
    req
  );
  res.send(user);
});

/*
function deleteUser  -  This function is used to delete an user  based on id
*/
const deleteUser = catchAsync(async (req, res) => {
  await adminService.deleteUserById(req.params.userId);
  res.status(200).send({ success: true });
});

const filterUsers = catchAsync(async (req, res) => {
  // console.log(req.query)
  const filter = pick(req.body, [
    "userName",
    "role",
    "mobileNumber",
    "email",
    "isAdmin",
    "specialty",
    "pager",
    "fax",
    "officePhone",
    "isLoggedIn",
    "pcp",
  ]);
  const options = pick(req.body, ["sortBy", "limit", "page"]);
  const result = await adminService.filterUsers(filter, options, req);
  res.send(result);
});
/*
exporting all the function using module exports
*/
module.exports = {
  createUser,
  getUsers,
  getUser,
  updateUser,
  deleteUser,
  filterUsers,
};
