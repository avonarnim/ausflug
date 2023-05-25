const Spot = require("../../models/spotModel");
const mongoose = require("mongoose");
require("dotenv").config();

const uri = process.env.ATLAS_URI;
mongoose.connect(uri);
const connection = mongoose.connection;
connection.once("open", () => {
  console.log("Connection established w MongoDB");

  Spot.deleteMany(
    // { externalLink: /ticketmaster/ },
    // { highlightedIn: "NationalParks" },
    { featuredBy: "WorthIt" },
    function (err, deletionResult) {
      if (err) console.log(err);
      console.log("All spots successfully deleted", deletionResult);
    }
  );
});
