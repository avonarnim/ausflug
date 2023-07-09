"use strict";
var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var UserSchema = new Schema({
  _id: String,
  username: String,
  email: String,
  bio: String,
  name: String,
  email: String,
  image: String,
  passwordHash: String,
  savedTripIDs: [String],
  upcomingTripIDs: [String],
  savedSpots: [String],
  following: [String],
  followers: [String],
  instagram: String,
  facebook: String,
  twitter: String,
  youtube: String,
  status: String,
  points: Number,
  gear: [
    {
      name: String,
      description: String,
      quantity: Number,
      borrowable: Boolean,
    },
  ],
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("User", UserSchema);
