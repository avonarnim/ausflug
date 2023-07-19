const Spot = require("../../models/spotModel");
const mongoose = require("mongoose");
require("dotenv").config();

const uri = process.env.ATLAS_URI;
mongoose.connect(uri);
const connection = mongoose.connection;
connection.once("open", async () => {
  console.log("Connection established w MongoDB");
  const res = await Spot.updateMany(
    // { avgTimeSpent: 0, featuredBy: "TicketMaster" }, // Filter criteria: Select documents where first element of "images" is an empty string
    { featuredBy: "DriveInsDinersAndDives" }, // Filter criteria: Select documents where first element of "images" is an empty string
    { $set: { avgTimeSpent: 1 } } // Update action: set average time spent to 3 (hours)
  );

  console.log(res);
});
