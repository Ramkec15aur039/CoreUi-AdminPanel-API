/** ***************** package Import ******************************************************** */

const mongoose = require("mongoose");

/** ***************** toJson from plugins folder ******************************************************** */

const { toJSON } = require("./plugins");

/** ***************** tokenTypes from config/tokens  ******************************************************** */

const { tokenTypes } = require("../config/tokens");

/*  
  tokenSchema  - It is the schema for our tokens module
*/
const tokenSchema = mongoose.Schema(
  {
    token: {
      type: String,
      required: true,
      index: true,
    },
    user: {
      type: String,
      ref: "User",
      required: true,
    },
    type: {
      type: String,
      enum: [tokenTypes.REFRESH, tokenTypes.RESET_PASSWORD],
      required: true,
    },
    expires: {
      type: Date,
      required: true,
    },
    blacklisted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// add plugin that converts mongoose to json
tokenSchema.plugin(toJSON);

/**
 * @typedef Token
 */
const Token = mongoose.model("tokens", tokenSchema);

module.exports = Token;
