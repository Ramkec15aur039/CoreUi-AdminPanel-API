/*
    Roles   
*/

// In this roles for an user is assigned.

const roles = ["user", "admin"];

const userArray = [
  "getUsers",
  "manageUsers",
  "manageFavourites",
  "getFavourites",
];
const adminArray = [
  "getUsers",
  "manageUsers",
  "manageFavourites",
  "getFavourites",
];

const roleRights = new Map();
roleRights.set(roles[0], userArray);
roleRights.set(roles[1], adminArray);

module.exports = {
  roles,
  roleRights,
};
