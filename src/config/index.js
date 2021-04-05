const configFile = require("../../configFile.json");

const environmentList = ["local", "develop", "staging", "production"];
const environment = environmentList[0];

const configuration = {
  local: {
    env: "local",
    port: 4040,

    callbackURL: "/v1/auth/passportAuth/redirect",
    clientID: configFile.googleApi.clientId,
    clientSecret: configFile.googleApi.clientSecret,
    session: {
      cookieKey: configFile.googleApi.session.cookieKey,
    },
    url: "http://localhost:3000",
    allowedMailId: ["pacificmedicalgroup.org", "farallonmed.com", "gmail.com"],
    mongoose: {
      url: "mongodb://localhost/local_contactsV11", // url to connect mongodb locally
      options: {
        useCreateIndex: true,
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false,
      },
    },
    jwt: {
      secret: "local!@#",
      accessExpirationMinutes: 30,
      refreshExpirationDays: 30,
      resetPasswordExpirationMinutes: 10,
    },
    email: {
      smtp: {
        service: "gmail",
        host: "smtp.gmail.com",
        port: 587,
        secure: false,
        auth: {
          user: configFile.email.Email,
          pass: configFile.email.password,
        },
        tls: {
          rejectUnauthorized: false,
        },
      },
      from: configFile.email.Email,
    },
  },
  develop: {
    env: "heroku",
    port: process.env.PORT,
    callbackURL: "/v1/auth/passportAuth/redirect",
    clientID: configFile.googleApi.clientId,
    clientSecret: configFile.googleApi.clientSecret,
    session: {
      cookieKey: configFile.googleApi.session.cookieKey,
    },
    url: "https://pingya.netlify.app",
    allowedMailId: ["pacificmedicalgroup.org", "farallonmed.com", "gmail.com"],
    mongoose: {
      url:
        "mongodb+srv://praveen:praveen@1999@cluster0.khpyl.mongodb.net/pingya?retryWrites=true&w=majority",
      options: {
        useCreateIndex: true,
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false,
      },
    },
    jwt: {
      secret: "heroku!@#",
      accessExpirationMinutes: 5,
      refreshExpirationDays: 10,
      resetPasswordExpirationMinutes: 10,
    },
    email: {
      smtp: {
        service: "gmail",
        host: "smtp.gmail.com",
        port: 587,
        secure: false,
        auth: {
          user: configFile.email.Email,
          pass: configFile.email.password,
        },
        tls: {
          rejectUnauthorized: false,
        },
      },
      from: configFile.email.Email,
    },
  },
  staging: {
    env: "manojTest",
    port: 4040,
    callbackURL: "/api/v1/auth/passportAuth/redirect",
    clientID: configFile.googleApi.clientId,
    clientSecret: configFile.googleApi.clientSecret,
    session: {
      cookieKey: configFile.googleApi.session.cookieKey,
    },
    url: "https://administrator.pingya.staging.pacificmedicalgroup.org",
    allowedMailId: ["pacificmedicalgroup.org", "farallonmed.com", "gmail.com"],
    mongoose: {
      url: "mongodb://localhost:1500/staging_contacts",
      options: {
        useCreateIndex: true,
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false,
      },
    },
    jwt: {
      secret: "test!@#",
      accessExpirationMinutes: 30,
      refreshExpirationDays: 30,
      resetPasswordExpirationMinutes: 10,
    },
    email: {
      smtp: {
        service: "gmail",
        host: "smtp.gmail.com",
        port: 587,
        secure: false,
        auth: {
          user: configFile.email.Email,
          pass: configFile.email.password,
        },
        tls: {
          rejectUnauthorized: false,
        },
      },
      from: configFile.email.Email,
    },
  },
  production: {
    env: "production",
    port: 4040,
    callbackURL: "/api/v1/auth/passportAuth/redirect",
    clientID: configFile.googleApi.clientId,
    clientSecret: configFile.googleApi.clientSecret,
    session: {
      cookieKey: configFile.googleApi.session.cookieKey,
    },
    url: "https://pingya.pacificmedicalgroup.org",
    allowedMailId: ["pacificmedicalgroup.org", "farallonmed.com"],
    mongoose: {
      options: {
        useCreateIndex: true,
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false,
      },
    },
    jwt: {
      secret: "production!@#",
      accessExpirationMinutes: 30,
      refreshExpirationDays: 30,
      resetPasswordExpirationMinutes: 10,
    },
    email: {
      smtp: {
        service: "gmail",
        host: "smtp.gmail.com",
        port: 587,
        secure: false,
        auth: {
          user: configFile.email.Email,
          pass: configFile.email.password,
        },
        tls: {
          rejectUnauthorized: false,
        },
      },
      from: configFile.email.Email,
    },
  },
};

module.exports = configuration[environment];
