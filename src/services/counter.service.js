/*
   Service Name : Counters
*/

/** ***************** Models Import ******************************************************** */
const { Counter } = require("../models");

/*
   function updateCount - This function used to update counters
   $countObject : 
   $currentId
*/
const updateCount = (countObject, keyName) => {
  return Counter.update(
    { key_name: keyName },
    { $inc: { value: 1 } },
    (err) => {
      if (err) console.log(err);
    }
  );
};

const getCount = async (keyName) => {
  const countObject = await Counter.findOne({ key_name: keyName });
  let currentId = 1;
  if (countObject) {
    currentId = countObject.value + 1;
    updateCount(countObject, countObject.key_name);
  } else {
    const insert = new Counter({
      key_name: keyName,
      value: currentId,
    });
    insert.save(function (err) {
      if (err) console.log(err);
    });
  }
  return currentId;
};

module.exports = {
  getCount,
  updateCount,
};
