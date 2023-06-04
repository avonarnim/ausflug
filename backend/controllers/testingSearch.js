const Spot = require("../../../models/spotModel");
const mongoose = require("mongoose");
require("dotenv").config({ path: "./scrapers/.env" });

const uri = process.env.ATLAS_URI;
mongoose.connect(uri);
const connection = mongoose.connection;

connection.once("open", async () => {
  console.log("Connection established w MongoDB");

  const spotResults = await Spot.aggregate([
    {
      $search: {
        index: "prod-spots",
        text: {
          query: "surfing joint",
          path: { wildcard: "*" },
          fuzzy: {
            maxEdits: 2,
            prefixLength: 3,
          },
        },
      },
    },
    {
      $project: {
        _id: 0,
        title: 1,
        location: 1,
        description: 1,
      },
    },
  ]);
  console.log(spotResults);
});
