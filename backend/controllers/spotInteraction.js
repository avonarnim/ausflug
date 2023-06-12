"use strict";

const { auth } = require("../config/firebase");
var mongoose = require("mongoose");
const SpotInteraction = require("../models/spotInteractionModel");

// retrieve single user's profile with matching id
exports.get_vote = async function (req, res) {
  SpotInteraction.findOne(
    { userId: req.params.userId, spotId: req.params.spotId },
    function (err, spotInteraction) {
      if (err) {
        res.send(err);
      } else {
        res.json(spotInteraction);
      }
    }
  );
};

exports.set_vote = async function (req, res) {
  SpotInteraction.findOneAndUpdate(
    { userId: req.params.userId, spotId: req.params.spotId },
    { value: req.body.value },
    { upsert: true },
    function (err, spotInteraction) {
      if (err) {
        res.send(err);
      } else {
        res.json(spotInteraction);
      }
    }
  );
};
