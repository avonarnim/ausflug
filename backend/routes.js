"use strict";
const router = require("express").Router();
const spot = require("./controllers/spot");
const trip = require("./controllers/trip");
const user = require("./controllers/user");
const event = require("./controllers/event");
const util = require("./controllers/util");
const adminMetrics = require("./controllers/adminMetrics");
const post = require("./controllers/post");
const feed = require("./controllers/feed");
const gas = require("./controllers/gas");
const spotInteraction = require("./controllers/spotInteraction");
const feedback = require("./controllers/feedback");
const { VerifyToken, VerifyAdminToken } = require("./middleware/VerifyToken");
const scraper = require("./controllers/scrapers/gasBuddy/gasScraper");
// Health Test
router.route("/").get((req, res) => {
  res.send("Success");
});

// #region Trips
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
router.use("/api/trips/:tripId", VerifyToken);
router.route("/api/trips/:tripId").get((req, res) => {
  trip.view_trip(req, res);
});
// #endregion

// #region Spots
router.route("/api/spots").get((req, res) => {
  spot.search_spots(req, res);
});
router.route("/api/spots/assemblage").post((req, res) => {
  spot.search_spots_assemblage(req, res);
});
router.route("/api/spots/query").post((req, res) => {
  spot.query_spots(req, res);
});
router.route("/api/spots/similar").post((req, res) => {
  spot.spots_like_this(req, res);
});
router.route("/api/spots/center/:latitude/:longitude").get((req, res) => {
  spot.search_spots_in_area(req, res);
});
router
  .route("/api/spots/box/:latitude1/:longitude1/:latitude2/:longitude2")
  .get((req, res) => {
    spot.search_spots_by_bounding_box(req, res);
  });
// route for the search_spots_highlighted function
router.route("/api/spots/highlighted").get((req, res) => {
  spot.search_spots_highlighted(req, res);
});
// route for the search_spots_highlighted_for_subject function
router.route("/api/spots/highlighted/:subject").get((req, res) => {
  spot.search_spots_highlighted_for_subject(req, res);
});
// route for the search_spots_by_source function
router.route("/api/spots/source/:source").get((req, res) => {
  spot.search_spots_by_source(req, res);
});
router.route("/api/spots").post((req, res) => {
  spot.insert_spot(req, res);
});
router.use("/api/spots/queue", VerifyAdminToken);
router.route("/api/spots/queue").get((req, res) => {
  spot.search_spots_queue(req, res);
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
// #endregion

// #region Gas
router
  .route("/api/gas/stations/box/:latitude1/:longitude1/:latitude2/:longitude2")
  .get((req, res) => {
    gas.get_gas_stations_in_area(req, res);
  });
router
  .route("/api/gas/avgPrice/box/:latitude1/:longitude1/:latitude2/:longitude2")
  .get((req, res) => {
    gas.avg_price_along_route(req, res);
  });
router.route("/api/gas/prices").post((req, res) => {
  gas.add_gas_prices(req, res);
});
router.route("/api/gas/stations").post((req, res) => {
  gas.add_gas_station(req, res);
});
router.route("/api/gas/stations/:id").get((req, res) => {
  gas.get_gas_station(req, res);
});
// #endregion

// #region Votes
router.use("/api/votes/:spotId/:userId", VerifyToken);
router.route("/api/votes/:spotId/:userId").get((req, res) => {
  spotInteraction.get_vote(req, res);
});

router.use("/api/votes/:spotId/:userId", VerifyToken);
router.route("/api/votes/:spotId/:userId").put((req, res) => {
  spotInteraction.set_vote(req, res);
});
// #endregion

// #region Events
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
// #endregion

// #region Users
router.use("/api/users", VerifyToken);
router.route("/api/users").post((req, res) => {
  user.create_profile(req, res);
});
// TODO: create get profile by username --> prevent duplicates in frontend
router.use("/api/users/:userId", VerifyToken);
router.route("/api/users/:userId").get((req, res) => {
  user.get_profile(req, res);
});
router.use("/api/users/username/:username", VerifyToken);
router.route("/api/users/username/:username").get((req, res) => {
  user.get_profile_by_username(req, res);
});
// TODO: deprecate follow/unfollow.. maybe also save_trip_to_user
router.use("/api/users/update/:userId", VerifyToken);
router.route("/api/users/update/:userId").post((req, res) => {
  user.update_user(req, res);
});
router.use("/api/users/statuses/:userId", VerifyToken);
router.route("/api/users/statuses/:userId").get((req, res) => {
  user.get_statuses(req, res);
});
router.use("/api/users/follow/:userId/:followingId", VerifyToken);
router.route("/api/users/follow/:userId/:followingId").put((req, res) => {
  user.add_user_to_following(req, res);
});
router.use("/api/users/unfollow/:userId/:followingId", VerifyToken);
router.route("/api/users/unfollow/:userId/:followingId").put((req, res) => {
  user.remove_user_from_following(req, res);
});
router.use("/api/users/list", VerifyToken);
router.route("/api/users/list").post((req, res) => {
  user.get_follow_list(req, res);
});
router.use("/api/users/saveSpot/:userId/:spotId", VerifyToken);
router.route("/api/users/saveSpot/:userId/:spotId").put((req, res) => {
  user.save_spot_to_user(req, res);
});
router.use("/api/users/unsaveSpot/:userId/:spotId", VerifyToken);
router.route("/api/users/unsaveSpot/:userId/:spotId").put((req, res) => {
  user.unsave_spot_to_user(req, res);
});
router.use("/api/users", VerifyAdminToken);
router.route("/api/users").get((req, res) => {
  user.list_users(req, res);
});
router.use("/api/users/:userId", VerifyAdminToken);
router.route("/api/users/:userId").delete((req, res) => {
  user.delete_profile(req, res);
});
router.use("/api/users/query", VerifyToken);
router.route("/api/users/query").post((req, res) => {
  user.query_users(req, res);
});
// #endregion

// #region Posts
router.use("/api/posts", VerifyToken);
router.route("/api/posts").post((req, res) => {
  post.create_post(req, res);
});
router.use("/api/posts/:postId", VerifyToken);
router.route("/api/posts/:postId").get((req, res) => {
  post.get_post(req, res);
});
router.use("/api/posts/:postId", VerifyToken);
router.route("/api/posts/:postId").put((req, res) => {
  post.update_post(req, res);
});
router.use("/api/posts/:postId", VerifyToken);
router.route("/api/posts/:postId").delete((req, res) => {
  post.delete_post(req, res);
});
router.use("/api/posts/user/:userId", VerifyToken);
router.route("/api/posts/user/:userId").get((req, res) => {
  post.get_user_posts(req, res);
});
// #endregion

// #region Feed
router.use("/api/feed/posts/:userId", VerifyToken);
router.route("/api/feed/posts/:userId").get((req, res) => {
  feed.get_feed_posts(req, res);
});
router.use("/api/feed/ids/:userId", VerifyToken);
router.route("/api/feed/ids/:userId").get((req, res) => {
  feed.get_feed_ids(req, res);
});
// #endregion

// #region Util
router.route("/api/util/image").post((req, res) => {
  util.upload_image(req, res);
});
// #endregion

// #region Admin
router.use("/api/admin/metrics", VerifyAdminToken);
router.route("/api/admin/metrics").get((req, res) => {
  adminMetrics.get_metrics(req, res);
});

router.use("/api/admin/metrics/window/:days", VerifyAdminToken);
router.route("/api/admin/metrics/window/:days").get((req, res) => {
  adminMetrics.get_metrics_past_n_days(req, res);
});
// #endregion

// #region Feedback
router.route("/api/feedback").post((req, res) => {
  feedback.create_feedback(req, res);
});

router.use("/api/feedback", VerifyAdminToken);
router.route("/api/feedback").get((req, res) => {
  feedback.view_feedback(req, res);
});
// #endregion

// #region Scraper
// router.route("/api/scrapers/gas/:startIndex/:stopIndex").get((req, res) => {
//   scraper.runGasScraper(req, res);
// });
// #endregion

module.exports = router;
