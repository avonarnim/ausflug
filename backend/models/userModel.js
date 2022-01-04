"use strict";
var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var UserSchema = new Schema({
  username: String,
  name: String,
  email: String,
  passwordHash: String,
  savedTripIDs: [String],
  following: [String],
});

module.exports = mongoose.model("User", UserSchema);
