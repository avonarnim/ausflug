"use strict";
module.exports = function (app) {
  var spot = require("../controllers/spotController.js");
  var trip = require("../controllers/tripController.js");
  var user = require("../controllers/userController.js");

  // trip Routes
  app
    .route("/trips")
    .get(trip.list_all_trips)
    .get(trip.search_for_trip)
    .delete(trip.delete_trip);

  app
    .route("/trips/:tripId")
    .post(trip.create_trip)
    .post(trip.save_trip)
    .post(trip.upate_trip)
    .get(trip.view_trip);

  // spot Routes
  app
    .route("/spots")
    .get(spot.search_spots)
    .put(spot.insert_spot)
    .delete(spot.delete_spot);

  app.route("/spots/:spotId").get(spot.rate_spot);

  // user Routes
  app.route("/users").get(user.search_users);

  app
    .route("/users/:userId")
    .get(user.get_profile)
    .get(user.verify_login)
    .get(user.list_following)
    .get(user.list_snapshot);
};
