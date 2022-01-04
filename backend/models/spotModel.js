"use strict";
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const SpotSchema = new Schema({
  name: String,
  description: String,
  category: String,
  cost: Number,
  specialty: Number,
  quality: Number,
  numberOfRatings: Number,
  avgTimeSpent: Number,
  location: {
    longitude: Number,
    latitude: Number,
  },
});

module.exports = mongoose.model("Spot", SpotSchema);
