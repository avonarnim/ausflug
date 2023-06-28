"use strict";

var mongoose = require("mongoose");
const Feedback = require("../models/feedbackModel");

exports.create_feedback = async function (req, res) {
  var newFeedback = new Feedback(req.body);
  newFeedback = await newFeedback.save();

  res.json(newFeedback);
};

exports.view_feedback = function (req, res) {
  Feedback.find({}, function (err, feedback) {
    if (err) res.send(err);
    res.json(feedback);
  });
};
