/** ***************** package Import ******************************************************** */

const mongoose = require("mongoose");

/** ***************** toJson and paginate from plugins folder ******************************************************** */

const { toJSON, paginate } = require("./plugins");

/*  
 logsSchema  - It is the schema for our logs module
*/
const logsSchema = mongoose.Schema(
  {
    action: {
      type: String,
    },
    userId: {
      type: String,
    },
    collectionName: {
      type: String,
    },
    route: {
      type: String,
    },
    data: {
      type: Object,
    },
  },
  {
    timestamps: true,
  }
);

// add plugin that converts mongoose to json
logsSchema.plugin(toJSON);
logsSchema.plugin(paginate);

logsSchema.pre("save", async function (next) {
  next();
});

/**
 * @typedef logs
 */
const Logs = mongoose.model("logs", logsSchema);

module.exports = Logs;
