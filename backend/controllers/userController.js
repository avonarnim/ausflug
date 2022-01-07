"use strict";

var mongoose = require("mongoose");
const User = require("../models/userModel");

// retrieve single user's profile with matching id
exports.get_profile = function (req, res) {
  User.findOne({ username: req.params.username }, function (err, user) {
    if (err) res.send(err);
    res.json(user);
  });
};

exports.create_profile = function (req, res) {
  var new_user = new User(req.body);
  console.log("A", req.body);
  console.log("B", new_user);

  new_user.save(function (err, user) {
    if (err) {
      res.send(err);
    } else {
      res.json("User profile created");
    }
  });
};

exports.delete_profile = function (req, res) {
  User.deleteOne(
    {
      username: req.params.username,
    },
    function (err, user) {
      if (err) res.send(err);
      res.json({ message: "User successfully deleted" });
    }
  );
};

exports.list_users = function (req, res) {
  User.find({}, function (err, user) {
    if (err) res.send(err);
    res.json(user);
  });
};

// add tripId to user list of trips
exports.save_trip_to_user = async function (req, res) {
  try {
    const user = await User.find({ username: req.params.username });

    user.savedTripIDs.push(req.params.tripId);
    const update = { savedTripIDs: user.savedTripIDs };

    User.findOneAndUpdate(
      { username: req.params.username },
      update,
      function (err, resp) {
        if (err) res.send(err);
        res.send("Successfully added trip");
      }
    );
  } catch (err) {
    res.send(err);
  }
};

// add tripId to user list of trips
exports.add_user_to_following = async function (req, res) {
  try {
    const user = await User.findById({ username: req.params.username });

    user.following.push(req.params.username);
    const update = { following: user.following };

    User.findOneAndUpdate(
      { username: req.params.username },
      update,
      function (err, resp) {
        if (err) res.send(err);
        res.send("Successfully added following");
      }
    );
  } catch (err) {
    res.send(err);
  }
};
