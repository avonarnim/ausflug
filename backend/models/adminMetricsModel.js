"use strict";
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const AdminMetricsSchema = new Schema({
  completedMiles: Number,
  numUsers: Number,
  numQueuedSpots: Number,
  mostPopularOrigins: [String],
  mostPopularDestinations: [String],
  updatedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("AdminMetrics", AdminMetricsSchema);
