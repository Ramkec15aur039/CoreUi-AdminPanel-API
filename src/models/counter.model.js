/** ***************** package Import ******************************************************** */

const mongoose = require("mongoose");

/*  
 counterSchema  - It is the schema for our counter module to autoincrement id's
*/
const Counter = mongoose.Schema({
  /* key_name is unique for each collections
  collections           key_name              value(count of document in collection)
    users                 users                     ex. 3
  */
  key_name: {
    type: String,
    required: true,
  },
  value: {
    type: Number,
    default: 0,
  },
});
module.exports = mongoose.model("counters", Counter);
