/*
   docs Name : swaggerDef
*/

const { version } = require("../../package.json");

const swaggerDef = {
  openapi: "3.0.0",
  info: {
    title: "pingya",
    description: "18/03/2021",
    version,
    license: {
      name: "MIT",
      url:
        "https://github.com/hagopj13/node-express-mongoose-boilerplate/blob/master/LICENSE",
    },
  },
  servers: [
    {
      url: `http://localhost:4040/v1`, // change url based on (local/production)
      // url: `http://localhost:3002/v1`,
      // url: config.url
    },
    {
      url: `https://pingya.herokuapp.com/v1/`, // change url based on (local/production)
      // url: `http://localhost:3002/v1`,
      // url: config.url
    },

    {
      url: `https://pingya.staging.pacificmedicalgroup.org/api/v1`, // change url based on (local/production)
      // url: `http://localhost:3002/v1`,
      // url: config.url
    },
    {
      url: `http://localhost:3002/v1`, // change url based on (local/production)
      // url: `http://localhost:3002/v1`,
      // url: config.url
    },
  ],
};

module.exports = swaggerDef;
