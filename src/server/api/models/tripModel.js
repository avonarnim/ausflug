"use strict";
var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var TripSchema = new Schema({
  tripID: Number,
  startingLocation: {
    latitude: Number,
    longitude: Number,
  },
  finalLocation: {
    latitude: Number,
    longitude: Number,
  },
  confirmedStops: [String],
  username: Number,
  desiredTotalDriveTime: Number,
  desiredTotalTravelTime: Number,
  desiredMaxCost: Number,
  desiredMinRating: Number,
  desiredNights: Number,
  desiredFoodCategories: [String],
  desiredDetourCategories: [String],
  confirmedStopIDs: [Number],
  actualDriveTime: Number,
  actualTravelTime: Number,
});

module.exports = mongoose.model("Trips", TripSchema);
