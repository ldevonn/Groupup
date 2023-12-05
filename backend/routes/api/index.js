const router = require("express").Router();
const sessionRouter = require("./session.js");
const usersRouter = require("./users.js");
const groupsRouter = require("./groups.js");
const venuesRouter = require("./venues.js");
const eventsRouter = require("./events.js");
const groupMembersRouter = require("./memberships.js");
const groupImages = require("./group-images.js");
const eventImages = require("./event-images.js");
const { restoreUser } = require("../../utils/auth.js");

router.use(restoreUser);
router.use("/session", sessionRouter);
router.use("/users", usersRouter);
router.use("/groups", groupsRouter);
router.use("/venues", venuesRouter);
router.use("/events", eventsRouter);
router.use("/groups", groupMembersRouter);
router.use("/group-images", groupImages);
router.use("/event-images", eventImages);

router.post("/test", (req, res) => {
  res.json({ requestBody: req.body });
});

module.exports = router;
