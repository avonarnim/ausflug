"use strict";
var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var GasSchema = new Schema({
  _id: String,
  name: String,
  ratings: [{ userId: String, rating: Number }],
  rating: Number,
  number_of_ratings: Number,
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
  },
  prices: [
    {
      unleaded: Number,
      midgrade: Number,
      premium: Number,
      diesel: Number,
      date: Date,
      userId: String,
    },
  ],
  resolved_prices: {
    unleaded: Number,
    midgrade: Number,
    premium: Number,
    diesel: Number,
  },
});

module.exports = mongoose.model("Gas", GasSchema);
