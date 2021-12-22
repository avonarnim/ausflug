"use strict";
var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var UserSchema = new Schema({
  username: String,
  name: String,
  email: String,
  passwordHash: string,
  savedTripIDs: [Number],
  following: [String],
});

module.exports = mongoose.model("Users", UserSchema);
