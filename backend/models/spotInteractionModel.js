"use strict";
var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var SpotInteractionSchema = new Schema({
  _id: String,
  spotId: String,
  userId: String,
  value: Boolean,
});

module.exports = mongoose.model("SpotInteraction", SpotInteractionSchema);
