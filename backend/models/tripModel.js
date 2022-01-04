"use strict";
var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var TripSchema = new Schema({
  startingLocation: {
    latitude: Number,
    longitude: Number,
  },
  finalLocation: {
    latitude: Number,
    longitude: Number,
  },
  userId: String,
  desiredTotalDriveTime: Number,
  desiredTotalTravelTime: Number,
  desiredMaxCost: Number,
  desiredMinSpecialty: Number,
  desiredMinQuality: Number,
  desiredNights: Number,
  desiredFoodCategories: [String],
  desiredDetourCategories: [String],
  confirmedStopIDs: [String],
  actualDriveTime: Number,
  actualTravelTime: Number,
  completed: Boolean,
});

module.exports = mongoose.model("Trip", TripSchema);
