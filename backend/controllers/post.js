"use strict";

const { auth } = require("../config/firebase");
var mongoose = require("mongoose");
const Post = require("../models/postModel");
const User = require("../models/userModel");
const Feed = require("../models/feedModel");
const Trip = require("../models/tripModel");

// retrieve single user's profile with matching id
exports.create_post = async function (req, res) {
  var new_post = new Post(req.body);
  new_post.save(function (err, post) {
    if (err) res.send(err);
    res.json(post);
  });

  // Validate that this works
  // Update trip to be posted
  Trip.findOneAndUpdate({ _id: req.body._id }, { posted: true }).then(
    (trip) => {
      if (!trip) {
        res.send("Trip not found");
      }
    }
  );

  User.findOne({ _id: req.body.authorId }).then((user) => {
    if (user) {
      // update user's feed
      Feed.findOneAndUpdate(user._id, {
        $push: { postIds: req.body._id },
      }).then((feed) => {
        if (!feed) {
          const newFeed = new Feed({
            _id: user._id,
            userId: user._id,
            postIds: [req.body._id],
          });
          newFeed.save();
        }
      });

      // update followers' feeds
      user.followers.forEach((follower) => {
        Feed.findOneAndUpdate(
          { _id: follower },
          { $push: { postIds: req.body._id } }
        ).then((feed) => {
          if (!feed) {
            const newFeed = new Feed({
              _id: follower,
              userId: follower,
              postIds: [req.body._id],
            });
            newFeed.save();
          }
        });
      });
    } else {
      res.send("User not found");
    }
  });
};

// remove post from database
exports.delete_post = function (req, res) {
  Post.deleteOne(
    {
      _id: req.body.postId,
    },
    function (err, post) {
      if (err) res.send(err);
      res.json({ message: "Post successfully deleted" });
    }
  );

  Trip.findOneAndUpdate({ _id: req.body.tripId }, { posted: false }).then(
    (trip) => {
      if (!trip) {
        res.send("Trip not found");
      }
    }
  );

  // remove post from followers' feeds
  User.findOne({ _id: req.body.authorId }).then((user) => {
    if (user) {
      user.followers.forEach((follower) => {
        Feed.findOneAndUpdate(
          { _id: follower },
          { $pull: { postIds: req.body.postId } }
        ).then((feed) => {
          if (!feed) {
            res.send("Feed not found");
          }
        });
      });
    } else {
      res.send("User not found");
    }
  });

  // remove post from user's feed
  Feed.findOneAndUpdate(
    {
      _id: req.body.authorId,
    },
    {
      $pull: { postIds: req.body.postId },
    }
  ).then((feed) => {
    if (!feed) {
      res.send("Feed not found");
    }
  });
};

exports.update_post = async function (req, res) {
  try {
    const update = req.body.update;
    Post.findOneAndUpdate(
      { _id: req.params.postId },
      update,
      function (err, resp) {
        if (err) res.send(err);
        res.send("Successfully updated post " + req.params.postId);
      }
    );
  } catch (err) {
    res.send(err);
  }
};

exports.get_post = async function (req, res) {
  Post.findOne({ _id: req.params.postId }).then((post) => {
    if (post) {
      res.json(post);
    } else {
      res.send("Post not found");
    }
  });
};

exports.get_user_posts = async function (req, res) {
  Post.find({ authorId: req.params.userId }, function (err, posts) {
    if (err) res.send(err);
    res.json(posts);
  }).sort({ createdAt: -1 });
};
