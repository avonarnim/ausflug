const Spot = require("../../models/spotModel");
const mongoose = require("mongoose");
require("dotenv").config();

const uri = process.env.ATLAS_URI;
mongoose.connect(uri);
const connection = mongoose.connection;
connection.once("open", () => {
  console.log("Connection established w MongoDB");

  Spot.find(
    // { externalLink: /michelin/, category: { $ne: "Dining" } },
    // { externalLink: /ticketmaster/, category: { $ne: "Venue" } },
    { highlightedIn: "NationalParks", category: { $ne: "Nature" } },

    async function (err, spots) {
      if (err) console.log(err);
      console.log("spots:", spots.length);
      for (let i = 0; i < spots.length; i++) {
        if (i % 500 === 0) console.log(i);

        const spot = spots[i];

        // if (spot.category === "Dining") continue;
        // if (spot.category === "Venue") continue;
        if (spot.category === "Nature") continue;

        await Spot.updateOne(
          { _id: spot._id },
          //   { category: "Dining" },
          { category: "Venue" },
          //   { category: "Nature" },
          function (err, res) {
            if (err) console.log(err);
          }
        ).clone();
      }

      mongoose.disconnect();
    }
  );
});
