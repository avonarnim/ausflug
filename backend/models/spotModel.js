"use strict";
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const SpotSchema = new Schema({
  title: String,
  description: String,
  category: String,
  cost: Number,
  specialty: Number,
  quality: Number,
  numberOfRatings: Number,
  avgTimeSpent: Number,
  location: {
    lat: Number,
    lng: Number,
  },
  mapLocation: {
    formatted_address: String,
    formatted_phone_number: String,
    geometry: {
      location: {
        lat: Number,
        lng: Number,
      },
    },
    place_id: String,
    types: [String],
    rating: Number,
    user_ratings_total: Number,
    price_level: Number,
  },
  sponsored: Boolean,
  highlightedIn: [String],
  featuredBy: [String],
  duration: Number,
  status: String,
  externalLink: String,
  image: String,
  openTimes: [Number],
});

module.exports = mongoose.model("Spot", SpotSchema);
