"use strict";
var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var SpotSchema = new Schema({
  name: String,
  description: String,
  stopID: Number,
  category: String,
  rating: Number,
  avgTimeSpent: Number,
  location: {
    longitude: Number,
    latitude: Number,
  },
});

module.exports = mongoose.model("Spots", SpotSchema);
