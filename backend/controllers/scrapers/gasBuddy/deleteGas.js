const Gas = require("../../../models/gasModel");
const mongoose = require("mongoose");
require("dotenv").config({ path: "../.env" });

const uri = process.env.ATLAS_URI;
mongoose.connect(uri);
const connection = mongoose.connection;
connection.once("open", () => {
  console.log("Connection established w MongoDB");

  Gas.deleteMany(
    // { externalLink: /ticketmaster/ },
    // { highlightedIn: "NationalParks" },
    {},
    function (err, deletionResult) {
      if (err) console.log(err);
      console.log("All gas stations successfully deleted", deletionResult);
      connection.close();
    }
  );
});
