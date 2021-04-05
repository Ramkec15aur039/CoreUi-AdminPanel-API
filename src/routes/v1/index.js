const express = require("express");
const authRoute = require("./auth.route");
const userRoute = require("./user.route");
const docsRoute = require("./docs.route");
const favouriteRoute = require("./favourite.route");
const logsRoute = require("./logs.route");
const updateLogsRoute = require("./updateLogger.route");
const adminRoute = require("./admin.route");

// const approvedServiceRoute = require("./approvedService.route")
// const sponsorDetailsRoute = require("./sponsorDetails.route")

// const { route } = require("./user.route");

const router = express.Router();

router.use("/auth", authRoute);
router.use("/users", userRoute);
router.use("/admin/users", adminRoute);
router.use("/docs", docsRoute);
router.use("/favourites", favouriteRoute);
router.use("/logs", logsRoute);
router.use("/updateLogs", updateLogsRoute);

module.exports = router;
