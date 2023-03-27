"use strict";
var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var UserSchema = new Schema({
  username: String,
  bio: String,
  name: String,
  email: String,
  image: String,
  passwordHash: String,
  savedTripIDs: [String],
  upcomingTripIDs: [String],
  savedSpots: [String],
  following: [String],
});

module.exports = mongoose.model("User", UserSchema);
