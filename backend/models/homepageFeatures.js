"use strict";
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const HomepageFeaturesSchema = new Schema({
  features: [
    {
      queryType: "HighlightedForSubject" || "Box" || "Source",
      param1: String,
      param2: String,
      param3: String,
      param4: String,
    },
  ],
  updatedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("HomepageFeatures", HomepageFeaturesSchema);
