"use strict";
const router = require("express").Router();
const spot = require("./controllers/spot");
const trip = require("./controllers/trip");
const user = require("./controllers/user");
const event = require("./controllers/event");
const util = require("./controllers/util");
const { VerifyToken, VerifyAdminToken } = require("./middleware/VerifyToken");

// Health Test
router.route("/").get((req, res) => {
  res.send("Success");
});

// trip-user Routes
router.use("/api/trips", VerifyToken);
router.route("/api/trips").post((req, res) => {
  trip.create_trip(req, res);
});
router.use("/api/trips/:username/:tripId", VerifyToken);
router.route("/api/trips/:username/:tripId").post((req, res) => {
  trip.update_trip(req, res);
});
router.use("/api/trips/:username/:tripId", VerifyToken);
router.route("/api/trips/:username/:tripId").delete((req, res) => {
  trip.delete_trip(req, res);
});
router.use("/api/trips/:username/:tripId", VerifyToken);
router.route("/api/trips/:username/:tripId").put((req, res) => {
  user.save_trip_to_user(req, res);
});
router.use("/api/trips/user/:username", VerifyToken);
router.route("/api/trips/user/:username").get((req, res) => {
  trip.view_user_trips(req, res);
});

// trip Routes
router.use("/api/trips/:tripId", VerifyToken);
router.route("/api/trips/:tripId").get((req, res) => {
  trip.view_trip(req, res);
});

// spot Routes
router.route("/api/spots").get((req, res) => {
  console.log("all");
  spot.search_spots(req, res);
});
router.route("/api/spots/center/:latitude/:longitude").get((req, res) => {
  console.log("lat lng");
  spot.search_spots_in_area(req, res);
});
router
  .route("/api/spots/box/:latitude1/:longitude1/:latitude2/:longitude2")
  .get((req, res) => {
    console.log("box");
    spot.search_spots_by_bounding_box(req, res);
  });
// route for the search_spots_highlighted function
router.route("/api/spots/highlighted").get((req, res) => {
  console.log("highlighted");
  spot.search_spots_highlighted(req, res);
});
// route for the search_spots_highlighted_for_subject function
router.route("/api/spots/highlighted/:subject").get((req, res) => {
  console.log("highlighted subject");
  spot.search_spots_highlighted_for_subject(req, res);
});
// route for the search_spots_by_source function
router.route("/api/spots/source/:source").get((req, res) => {
  console.log("searching spots by source");
  spot.search_spots_by_source(req, res);
});
router.route("/api/spots").post((req, res) => {
  spot.insert_spot(req, res);
});
router.use("/api/spots/saved/:userId", VerifyToken);
router.route("/api/spots/saved/:userId").get((req, res) => {
  spot.search_saved_spots_list(req, res);
});
router.use("/api/spots/update/:spotId", VerifyAdminToken);
router.route("/api/spots/update/:spotId").post((req, res) => {
  spot.update_spot(req, res);
});
router.route("/api/spots/single/:spotId").get((req, res) => {
  spot.view_spot(req, res);
});
router.use("/api/spots/:spotId", VerifyAdminToken);
router.route("/api/spots").delete((req, res) => {
  spot.delete_spot(req, res);
});
router.use("/api/spots/review", VerifyToken);
router.route("/api/spots/review").post((req, res) => {
  spot.add_review(req, res);
});

router
  .route(
    "/api/events/boxTime/:latitude1/:longitude1/:latitude2/:longitude2/:startDate/:endDate"
  )
  .get((req, res) => {
    event.search_events_box_time(req, res);
  });
router.route("/api/events/venue/:externalId").get((req, res) => {
  event.search_events_venue(req, res);
});

// user Routes
router.use("/api/users", VerifyToken);
router.route("/api/users").post((req, res) => {
  user.create_profile(req, res);
});
router.use("/api/users", VerifyAdminToken);
router.route("/api/users").get((req, res) => {
  user.list_users(req, res);
});
// TODO: create get profile by username --> prevent duplicates in frontend
router.use("/api/users/:userId", VerifyToken);
router.route("/api/users/:userId").get((req, res) => {
  user.get_profile(req, res);
});
// TODO: deprecate follow/unfollow.. maybe also save_trip_to_user
router.use("/api/users/:userId", VerifyToken);
router.route("/api/users/:userId").post((req, res) => {
  user.update_user(req, res);
});
router.use("/api/users/:userId", VerifyAdminToken);
router.route("/api/users/:userId").delete((req, res) => {
  user.delete_profile(req, res);
});
router.use("/api/users/follow/:userId/:followingId", VerifyToken);
router.route("/api/users/follow/:userId/:followingId").put((req, res) => {
  user.add_user_to_following(req, res);
});
router.route("/api/users/unfollow/:userId/:followingId").put((req, res) => {
  user.remove_user_from_following(req, res);
});
router.use("/api/users/saveSpot/:userId/:spotId", VerifyToken);
router.route("/api/users/saveSpot/:userId/:spotId").put((req, res) => {
  user.save_spot_to_user(req, res);
});
router.use("/api/users/unsaveSpot/:userId/:spotId", VerifyToken);
router.route("/api/users/unsaveSpot/:userId/:spotId").put((req, res) => {
  user.unsave_spot_to_user(req, res);
});

router.route("/api/util/image").post((req, res) => {
  util.upload_image(req, res);
});

// // scraper Routes
// router.route("/api/scrapers/michelin").get((req, res) => {
//   scraper.runMichelinScraper();
// });

module.exports = router;
