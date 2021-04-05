const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20");
const config = require("./index");
const User = require("../models/user.model");
const counter = require("../services/counter.service");
const logger = require("./logger");

passport.serializeUser((user, done) => {
  done(null, user.id);
});
passport.deserializeUser((id, done) => {
  User.findById(id).then((user) => {
    done(null, user);
  });
});

passport.use(
  new GoogleStrategy(
    {
      callbackURL: config.callbackURL,
      clientID: config.clientID,
      clientSecret: config.clientSecret,
    },
    (accessToken, refreshToken, profile, done) => {
      try {
        const { email } = profile._json;
        let firstName = profile._json.given_name;
        let lastNsme = profile._json.family_name;
        User.findOne({
          email: profile._json.email,
          isAdmin: true,
          isDeleted: false,
          isActive: true,
        }).then(async (loggedUser) => {
          if (loggedUser) {
            done(null, loggedUser);
          } else {
            const newEmail = email.split("@")[1];
            if (config.allowedMailId.includes(newEmail)) {
              const id = await counter.getCount("users"); // passing users id to get counter value to autoIncrement _id
              const userBody = {};
              userBody._id = id.toString();
              userBody.email = email;
              userBody.firstName = firstName;
              userBody.lastName = lastNsme;
              const newUser = await User.create(userBody);
              if (newUser) {
                const createdUser = {
                  id: newUser._id,
                  newUser,
                  edit: true,
                };
                await done(null, createdUser);
              }
            } else {
              let unauthorizedUser = loggedUser;
              unauthorizedUser = {
                error: "not an valid user",
                id: "error",
                email,
              };
              done(null, unauthorizedUser);
            }
          }
        });
      } catch (e) {
        logger.error(e);
      }
      // console.log("It is fired up",profile)
    }
  )
);

// http://localhost:3001/v1/auth/google
