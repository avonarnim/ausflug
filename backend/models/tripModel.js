"use strict";
var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var TripSchema = new Schema({
  name: String,
  description: String,
  creatorId: String,
  origin: String,
  desctination: String,
  // startingLocation: {
  //   latitude: Number,
  //   longitude: Number,
  // },
  // finalLocation: {
  //   latitude: Number,
  //   longitude: Number,
  // },
  desiredTotalDriveTime: Number,
  desiredTotalTravelTime: Number,
  desiredMaxCost: Number,
  desiredMinSpecialty: Number,
  desiredMinQuality: Number,
  desiredNights: Number,
  desiredFoodCategories: [String],
  desiredDetourCategories: [String],
  waypoints: [{ location: { lat: Number, lng: Number }, stopover: Boolean }],
  startDate: { type: Date, default: Date.now },
  endDate: { type: Date, default: Date.now },
  isPublic: Boolean,
  isComplete: Boolean,
  isArchived: Boolean,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  actualDriveTime: Number,
  actualTravelTime: Number,
  completed: Boolean,
});

module.exports = mongoose.model("Trip", TripSchema);
