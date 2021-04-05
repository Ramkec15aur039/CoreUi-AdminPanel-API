/*
   validation Name : user
*/

/** ***************** package  Import ******************************************************** */

const Joi = require("@hapi/joi");

/** ***************** validation Import ******************************************************** */
const { password } = require("./custom.validation");

/*
function createUser - This function is used to validate user inputs

*/
const createUser = {
  body: Joi.object().keys({
    _id: Joi.string(),
    email: Joi.string().email().allow(""),
    password: Joi.string().custom(password),
    role: Joi.string().allow(""),
    userName: Joi.string().allow(""),
    firstName: Joi.string(),
    lastName: Joi.string(),
    mobile: Joi.string().allow(""),
    street: Joi.string().allow(""),
    city: Joi.string().allow(""),
    state: Joi.string().allow(""),
    location: Joi.string().allow(""),
    specialty: Joi.string().allow(""),
    pager: Joi.string().allow(""),
    fax: Joi.string().allow(""),
    pcp: Joi.boolean(),
    officePhone: Joi.string().allow(""),
    isAdmin: Joi.boolean(),
    isActive: Joi.boolean().allow(""),
    title: Joi.string().allow(""),
    notes: Joi.string().allow(""),
  }),
};

/*
function getUser - This function is used to validate user inputs

*/
const getUsers = {
  query: Joi.object().keys({
    _id: Joi.string(),
    userName: Joi.string(),
    search: Joi.string(),
    role: Joi.string(),
    pcp: Joi.boolean(),
    mobile: Joi.string(),
    specialty: Joi.string(),
    pager: Joi.string(),
    fax: Joi.string(),
    officePhone: Joi.string(),
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
    title: Joi.string().allow(""),
    notes: Joi.string().allow(""),
  }),
};

const getUser = {
  params: Joi.object().keys({
    userId: Joi.string(),
  }),
};

/*
function updateUser - This function is used to validate user id and inputs  for updating

*/

const updateUser = {
  params: Joi.object().keys({
    userId: Joi.required(),
  }),
  body: Joi.object()
    .keys({
      email: Joi.string().allow(""),
      password: Joi.string().custom(password),
      role: Joi.string(),
      userName: Joi.string().allow(""),
      firstName: Joi.string(),
      lastName: Joi.string(),
      mobile: Joi.string().allow(""),
      street: Joi.string().allow(""),
      city: Joi.string().allow(""),
      state: Joi.string().allow(""),
      location: Joi.string().allow(""),
      specialty: Joi.string().allow(""),
      pager: Joi.string().allow(""),
      fax: Joi.string().allow(""),
      pcp: Joi.boolean(),
      officePhone: Joi.string().allow(""),
      isAdmin: Joi.boolean(),
      isActive: Joi.boolean().allow(""),
      updatedAt: Joi.date().allow(""),
      title: Joi.string().allow(""),
      notes: Joi.string().allow(""),
    })
    .min(1),
};

/*
function deleteUser - This function is used to validate the id to delete user

*/
const deleteUser = {
  params: Joi.object().keys({
    userId: Joi.string(),
  }),
};

// exporting all the functions

module.exports = {
  createUser,
  getUsers,
  getUser,
  updateUser,
  deleteUser,
};
