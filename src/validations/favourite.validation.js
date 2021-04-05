/*
   validation Name : favourite
*/

/** ***************** package  Import ******************************************************** */

const Joi = require("@hapi/joi");

/** ***************** validation Import ******************************************************** */

/*
function createfavourite - This function is used to validate favourite inputs

*/
const createfavourite = {
  body: Joi.object().keys({
    _id: Joi.string(),
    userId: Joi.string(),
    favouriteId: Joi.string(),
    isActive: Joi.boolean(),
  }),
};

/*
function getfavourite - This function is used to validate favourite inputs

*/
const getfavourites = {
  query: Joi.object().keys({
    userId: Joi.string(),
    favouriteId: Joi.string(),
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};

const getfavourite = {
  params: Joi.object().keys({
    favouriteId: Joi.string(),
  }),
};

/*
function updatefavourite - This function is used to validate favourite id and inputs  for updating

*/

const updatefavourite = {
  params: Joi.object().keys({
    favouriteId: Joi.required(),
  }),
  body: Joi.object()
    .keys({
      _id: Joi.string(),
      userId: Joi.string(),
      favouriteId: Joi.string(),
      lastName: Joi.string(),
      isActive: Joi.boolean(),
    })
    .min(1),
};

/*
function deletefavourite - This function is used to validate the id to delete favourite

*/
const deletefavourite = {
  params: Joi.object().keys({
    favouriteId: Joi.string(),
  }),
};

// exporting all the functions

module.exports = {
  createfavourite,
  getfavourites,
  getfavourite,
  updatefavourite,
  deletefavourite,
};
