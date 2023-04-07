"use strict";
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const EventSchema = new Schema({
  title: String,
  image: String,
  description: String,
  spot_id: String,
  location: {
    lat: Number,
    lng: Number,
  },
  externalIds: [{ source: String, id: String }],
  externalLink: String,
  place_id: String,
  sponsored: Boolean,
  status: String,
  startDate: String,
  endDate: String,
});

module.exports = mongoose.model("Event", EventSchema);
