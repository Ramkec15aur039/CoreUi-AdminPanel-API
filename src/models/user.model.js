/** ***************** package Import ******************************************************** */

const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");

/** ***************** toJson and paginate from plugins folder ******************************************************** */

const { toJSON, paginate } = require("./plugins");

/** ***************** roles from config/roles  ******************************************************** */

/*  
  userSchema  - It is the schema for our user module
*/

const userSchema = mongoose.Schema(
  {
    _id: {
      type: String,
    },
    email: {
      type: String,
      // required: true,
      // unique: true,
      spares: true,
      trim: true,
      lowercase: true,
      validate(value) {
        if (value === "") return true;
        if (!validator.isEmail(value)) {
          throw new Error("Invalid email");
        }
      },
    },
    password: {
      type: String,
      // required: true,
      trim: true,
      minlength: 8,
      validate(value) {
        if (!value.match(/\d/) || !value.match(/[a-zA-Z]/)) {
          throw new Error(
            "Password must contain at least one letter and one number"
          );
        }
      },
      private: true, // used by the toJSON plugin
    },
    role: {
      type: String,
      // enum:["user", "admin", "sponsor", "resource", "approver", "lead"],
      default: "user",
    },

    userName: {
      type: String,
      trim: true,
    },

    firstName: {
      type: String,
      trim: true,
    },

    lastName: {
      type: String,
      trim: true,
    },

    mobile: {
      type: String,
      // required: true,
      trim: true,
    },

    street: {
      type: String,
      trim: true,
    },

    city: {
      type: String,
      trim: true,
    },

    state: {
      type: String,
      trim: true,
    },

    location: {
      type: String,
      trim: true,
    },
    title: {
      type: String,
      trim: true,
    },
    specialty: {
      type: String,
      trim: true,
    },

    pager: {
      type: String,
      trim: true,
    },

    officePhone: {
      type: String,
      trim: true,
    },

    fax: {
      type: String,
      trim: true,
    },
    notes: {
      type: String,
      trim: true,
    },
    pcp: {
      type: Boolean,
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
    // isApproved: {
    //   type: String,
    //   default: "waiting",
    // },
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
userSchema.plugin(toJSON);
userSchema.plugin(paginate);

// userSchema.index( {corematicaName : 1} , {unqiue : true} )
userSchema.index(
  { mobile: 1, officePhone: 1, pager: 1, email: 1 },
  {
    unique: true,
    partialFilterExpression: {
      email: { $type: "string" },
      mobile: { $type: "string" },
      officePhone: { $type: "string" },
      pager: { $type: "string" },
      spares: true,
    },
  }
);
/**
 * Check if email is taken
 * @param {string} email - The user's email
 * @param {ObjectId} [excludeUserId] - The id of the user to be excluded
 * @returns {Promise<boolean>}
 */

userSchema.statics.isEmailTaken = async function (email, excludeUserId) {
  const user = await this.findOne({
    email,
    _id: { $ne: excludeUserId },
    spares: true,
  });

  return !!user;
};
// userSchema.statics.corematicaName = async function (
//   corematicaName,
//   excludeUserId
// ) {
//   const user = await this.findOne({
//     corematicaName,
//     _id: { $ne: excludeUserId },
//   });

//   return !!user;
// };

/**
 * Check if password matches the user's password
 * @param {string} password
 * @returns {Promise<boolean>}
 */
userSchema.methods.isPasswordMatch = async function (password) {
  const user = this;
  return bcrypt.compare(password, user.password);
};

userSchema.pre("save", async function (next) {
  const user = this;
  if (user.isModified("password")) {
    user.password = await bcrypt.hash(user.password, 8);
  }

  next();
});

/**
 * @typedef User
 */
const User = mongoose.model("users", userSchema);

module.exports = User;
