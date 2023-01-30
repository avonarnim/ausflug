"use strict";
const router = require("express").Router();
const spot = require("./controllers/spotController");
const trip = require("./controllers/tripController");
const user = require("./controllers/userController");

// trip-user Routes
router.route("/trips/:tripId").get((req, res) => {
  trip.get_trip(req, res);
});
router.route("/trips").post((req, res) => {
  trip.create_trip(req, res);
});
router.route("/trips/:username/:tripId").post((req, res) => {
  trip.update_trip(req, res);
});
router.route("/trips/:username/:tripId").delete((req, res) => {
  trip.delete_trip(req, res);
});
router.route("/trips/:username/:tripId").put((req, res) => {
  user.save_trip_to_user(req, res);
});

// trip Routes
router.route("/trips/:tripId").get((req, res) => {
  trip.view_trip(req, res);
});

// spot Routes
router.route("/spots").get((req, res) => {
  spot.search_spots(req, res);
});
router.route("/spots").post((req, res) => {
  spot.insert_spot(req, res);
});
router.route("/spots/:spotId").post((req, res) => {
  spot.update_spot(req, res);
});
router.route("/spots").delete((req, res) => {
  spot.delete_spot(req, res);
});
router.route("/spots/:spotId").get((req, res) => {
  spot.view_spot(req, res);
});
router.route("/spots").put((req, res) => {
  spot.rate_spot(req, res);
});

// user Routes
router.route("/users").post((req, res) => {
  user.create_profile(req, res);
});
router.route("/users").get((req, res) => {
  user.list_users(req, res);
});
router.route("/users/:userId").get((req, res) => {
  user.get_profile(req, res);
});
router.route("/users/:userId").delete((req, res) => {
  user.delete_profile(req, res);
});
router.route("/users/:userId/:followingId").put((req, res) => {
  user.add_user_to_following(req, res);
});

module.exports = router;
