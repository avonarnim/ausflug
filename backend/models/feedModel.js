"use strict";
var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var FeedSchema = new Schema({
  _id: String,
  userId: String,
  postIds: [String],
  updatedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Feed", FeedSchema);
