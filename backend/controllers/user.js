"use strict";

const { auth } = require("../config/firebase");
var mongoose = require("mongoose");
const User = require("../models/userModel");

// retrieve single user's profile with matching id
exports.get_profile = async function (req, res) {
  User.findOne({ _id: req.params.userId }, function (err, user) {
    if (err) {
      res.send(err);
    } else {
      res.json(user);
    }
  });

  // try {
  //   const userRecord = await auth.getUser(req.params.userId);
  //   res.status(200).json(userRecord.toJSON());
  // } catch (error) {
  //   console.log("Error fetching user data:", error);
  // }
};

exports.create_profile = function (req, res) {
  console.log("creating profile", req.body);
  var new_user = new User(req.body);

  new_user.save(function (err, user) {
    if (err) {
      console.log(err);
      res.send(err);
    } else {
      console.log("created user");
      res.json("User profile created");
    }
  });
};

exports.delete_profile = function (req, res) {
  User.deleteOne(
    {
      username: req.params.userId,
    },
    function (err, user) {
      if (err) {
        res.send(err);
      } else {
        res.json({ message: "User successfully deleted" });
      }
    }
  );
};

exports.list_users = async function (req, res) {
  // User.find({}, function (err, user) {
  //   if (err) {
  //     res.send(err);
  //   } else {
  //     res.json(user);
  //   }
  // });

  const maxResults = 10;
  let users = [];

  try {
    const userRecords = await auth.listUsers(maxResults);
    userRecords.users.forEach((userRecord) => {
      users.push(userRecord.toJSON());
    });
    res.json(users);
  } catch (err) {
    console.log("Error listing users:", err);
  }
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
        if (err) {
          res.send(err);
        } else {
          res.send("Successfully added trip");
        }
      }
    );
  } catch (err) {
    res.send(err);
  }
};

// add tripId to user list of trips
exports.add_user_to_following = async function (req, res) {
  try {
    const user = await User.findById({ username: req.params.userId });

    user.following.push(req.params.followingId);
    const update = { following: user.following };

    User.findOneAndUpdate(
      { username: req.params.userId },
      update,
      function (err, resp) {
        if (err) {
          res.send(err);
        } else {
          res.send("Successfully added following");
        }
      }
    );
  } catch (err) {
    res.send(err);
  }
};

exports.update_user = async function (req, res) {
  try {
    const update = req.body;
    User.findOneAndUpdate(
      { _id: req.params.userId },
      update,
      function (err, resp) {
        if (err) {
          res.send(err);
        } else {
          res.send("Successfully updated user");
        }
      }
    );
  } catch (err) {
    res.send(err);
  }
};

exports.remove_user_from_following = async function (req, res) {
  try {
    const user = await User.findById({ username: req.params.userId });

    user.following.remove(req.params.followingId);

    User.findOneAndUpdate(
      { username: req.params.userId },
      update,
      function (err, resp) {
        if (err) {
          res.send(err);
        } else {
          res.send("Successfully added following");
        }
      }
    );
  } catch (err) {
    res.send(err);
  }
};
