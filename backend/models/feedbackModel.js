"use strict";
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const FeedbackSchema = new Schema({
  feedback: String,
  contact: String,
  creationDate: String,
});

module.exports = mongoose.model("Feedback", FeedbackSchema);
