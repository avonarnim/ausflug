"use strict";

const { auth } = require("../config/firebase");
var mongoose = require("mongoose");
const Feed = require("../models/feedModel");
const Post = require("../models/postModel");

// retrieve single user's profile with matching id
exports.get_feed_ids = async function (req, res) {
  Feed.findOne({ userId: req.params.userId }).then((feed) => {
    if (feed) {
      res.json(feed);
    } else {
      res.send("Feed not found");
    }
  });
};

exports.get_feed_posts = async function (req, res) {
  const feed = await Feed.findOne({ userId: req.params.userId });

  Post.findMany({ _id: feed.postIds }, function (err, posts) {
    if (err) res.send(err);
    res.json(posts);
  }).sort({ createdAt: -1 });
};
