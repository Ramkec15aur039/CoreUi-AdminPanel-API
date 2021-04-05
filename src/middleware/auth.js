/** ***************** package Import ******************************************************** */

const passport = require("passport");
const httpStatus = require("http-status");

/** ***************** ApiError from utils folder ******************************************************** */

const ApiError = require("../utils/ApiError");

/** ***************** Import roleRights from config/roles  ************************************************** */

const { roleRights } = require("../config/roles");

/*
function verifyCallback - This function is used to verify the user is aunthenticated or not and verify 
                          the role of an user for accessing 

*/

const verifyCallback = (req, resolve, reject, requiredRights) => async (
  err,
  user,
  info
) => {
  if (err || info || !user) {
    return reject(new ApiError(httpStatus.UNAUTHORIZED, "Please authenticate"));
  }

  req.user = user;

  if (requiredRights.length) {
    const userRights = roleRights.get(user.role);

    const hasRequiredRights = requiredRights.every((requiredRight) => {
      return userRights.includes(requiredRight);
    });

    if (!hasRequiredRights && req.params.userId !== user.id) {
      return reject(new ApiError(httpStatus.FORBIDDEN, "Forbidden"));
    }
  }

  resolve();
};

/*
function auth - This function receive an required rights from the auth.route.js from the route\v1

*/

const auth = (...requiredRights) => async (req, res, next) => {
  return new Promise((resolve, reject) => {
    passport.authenticate(
      "jwt",
      { session: false },
      verifyCallback(req, resolve, reject, requiredRights)
    )(req, res, next);
  })
    .then(() => next())
    .catch((err) => next(err));
};

// exporting the auth function
module.exports = auth;
