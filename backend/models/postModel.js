"use strict";
var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var PostSchema = new Schema({
  _id: String, // post id == trip id
  authorId: String,
  authorUsername: String,
  authorImage: String,
  images: [String],
  caption: String,
  comments: [{ userId: String, comment: String, createdAt: Date }],
  likes: [{ userId: String }],
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Post", PostSchema);
