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

exports.get_profile_by_username = async function (req, res) {
  User.findOne({ username: req.params.username }, function (err, user) {
    if (err) {
      console.log("error", err);
      res.send(err);
    } else {
      console.log("user", user);
      res.json(user);
    }
  });
};

// retrieve single user's profile with matching id
exports.get_profiles = async function (req, res) {
  User.find({}, function (err, users) {
    if (err) {
      res.send(err);
    } else {
      res.json(users);
    }
  });
};

exports.get_statuses_and_gear = async function (req, res) {
  User.findOne({ _id: req.params.userId }, function (err, user) {
    if (err) {
      res.send(err);
    } else {
      User.find(
        { _id: { $in: user.following } },
        { _id: 1, name: 1, status: 1, username: 1, image: 1, gear: 1 },
        function (err, users) {
          if (err) {
            res.send(err);
          } else {
            res.json(users);
          }
        }
      );
    }
  });
};

exports.get_follow_list = async function (req, res) {
  const { profileList } = req.body;
  User.find(
    { _id: { $in: profileList } },
    { _id: 1, name: 1, username: 1, image: 1 },
    function (err, users) {
      if (err) {
        res.send(err);
      } else {
        res.json(users);
      }
    }
  );
};

exports.create_profile = async function (req, res) {
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

exports.delete_profile = async function (req, res) {
  const user = await User.findOne({
    _id: req.params.userId,
  });

  for (let i = 0; i < user.followers.length; i++) {
    const follower = await User.findOne({
      _id: user.followers[i],
    });
    follower.following.remove(req.params.userId);
    const update = { following: follower.following };
    User.findOneAndUpdate(
      { _id: user.followers[i] },
      update,
      function (err, resp) {
        if (err) {
          res.send(err);
        }
      }
    );
  }

  for (let i = 0; i < user.following.length; i++) {
    const following = await User.findOne({
      _id: user.following[i],
    });
    following.followers.remove(req.params.userId);
    const update = { followers: following.followers };

    User.findOneAndUpdate(
      { _id: user.following[i] },
      update,
      function (err, resp) {
        if (err) {
          res.send(err);
        }
      }
    );
  }

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

exports.save_spot_to_user = async function (req, res) {
  try {
    const user = await User.findOne({ _id: req.params.userId });

    user.savedSpots.push(req.params.spotId);
    const update = { savedSpots: user.savedSpots };

    User.findOneAndUpdate(
      { _id: req.params.userId },
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

exports.unsave_spot_to_user = async function (req, res) {
  try {
    const user = await User.findOne({ _id: req.params.userId });

    user.savedSpots.remove(req.params.spotId);
    const update = { savedSpots: user.savedSpots };

    User.findOneAndUpdate(
      { _id: req.params.userId },
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

exports.add_user_to_following = async function (req, res) {
  try {
    const user = await User.findById({ _id: req.params.userId });
    const following = await User.findById({ _id: req.params.followingId });

    user.following.push(req.params.followingId);
    following.followers.push(req.params.userId);
    const update = { following: user.following };
    const update2 = { followers: following.followers };

    let firstResult = true;

    User.findOneAndUpdate(
      { _id: req.params.userId },
      update,
      function (err, resp) {
        if (err) {
          firstResult = false;
        }
      }
    );

    User.findOneAndUpdate(
      { _id: req.params.followingId },
      update2,
      function (err, resp) {
        if (err) {
          firstResult = false;
        }
      }
    );

    res.send(firstResult ? "Successfully added user" : "Failed to add user");
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
          res.send(resp);
        }
      }
    );
  } catch (err) {
    res.send(err);
  }
};

exports.remove_user_from_following = async function (req, res) {
  try {
    const user = await User.findById({ _id: req.params.userId });
    const following = await User.findById({ _id: req.params.followingId });

    user.following.remove(req.params.followingId);
    following.followers.remove(req.params.userId);

    const update = { following: user.following };
    const update2 = { followers: following.followers };

    let firstResult = true;

    User.findOneAndUpdate(
      { _id: req.params.userId },
      update,
      function (err, resp) {
        if (err) {
          firstResult = false;
        }
      }
    );

    User.findOneAndUpdate(
      { _id: req.params.followingId },
      update2,
      function (err, resp) {
        if (err) {
          firstResult = false;
        }
      }
    );

    res.send(
      firstResult ? "Successfully removed user" : "Failed to remove user"
    );
  } catch (err) {
    res.send(err);
  }
};

exports.query_users = function (req, res) {
  User.aggregate(
    [
      {
        $search: {
          index: "users",
          text: {
            query: req.body.query,
            path: { wildcard: "*" },
            fuzzy: {
              maxEdits: 2,
              prefixLength: 3,
            },
          },
        },
      },
      {
        $skip: req.body.page * 50,
      },
      {
        $limit: 50,
      },
      {
        $project: {
          _id: 1,
          username: 1,
          bio: 1,
          name: 1,
          image: 1,
          points: 1,
          gear: 1,
        },
      },
    ],
    function (err, users) {
      console.log(users);
      if (err) res.send(err);
      res.json(users);
    }
  );
};
