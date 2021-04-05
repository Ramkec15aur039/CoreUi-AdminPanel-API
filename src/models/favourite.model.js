/** ***************** package Import ******************************************************** */

const mongoose = require("mongoose");

/** ***************** toJson and paginate from plugins folder ******************************************************** */

const { toJSON, paginate } = require("./plugins");

/** ***************** roles from config/roles  ******************************************************** */

/*  
  favouriteSchema  - It is the schema for our favourite module
*/

const favouriteSchema = mongoose.Schema(
  {
    _id: {
      type: String,
    },
    userId: {
      type: String,
      required: true,
    },
    favouriteId: {
      type: String,
      required: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
    createdBy: {
      type: String,
      trim: true,
    },

    updatedBy: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
    _id: false,
  }
);

// add plugin that converts mongoose to json
favouriteSchema.plugin(toJSON);
favouriteSchema.plugin(paginate);

// favouriteSchema.index( {userName : 1} , {unqiue : true} )
/**
 * Check if email is taken
 * @param {string} email - The favourite's email
 * @param {ObjectId} [excludeFavouriteId] - The id of the favourite to be excluded
 * @returns {Promise<boolean>}
 */

favouriteSchema.pre("save", async function (next) {
  next();
});

/**
 * @typedef Favourite
 */
const Favourite = mongoose.model("favourites", favouriteSchema);

module.exports = Favourite;
