const Spot = require("../../models/spotModel");
const mongoose = require("mongoose");
require("dotenv").config();

const uri = process.env.ATLAS_URI;
mongoose.connect(uri);
const connection = mongoose.connection;
connection.once("open", async () => {
  console.log("Connection established w MongoDB");
  //   const res = await Spot.updateMany(
  //     { image: { $exists: true } },
  //     {
  //       $rename: {
  //         image: "images",
  //       },
  //     }
  //   );
  const res = await Spot.updateMany(
    // {}, // Specify your filter criteria here to select the documents to update
    // [
    //   {
    //     $set: {
    //       images: {
    //         $cond: {
    //           if: { $isArray: "$images" },
    //           then: "$images",
    //           else: ["$images"],
    //         },
    //       },
    //     },
    //   },
    // ]
    { "images.0": "" }, // Filter criteria: Select documents where first element of "images" is an empty string
    { $set: { images: [] } } // Set "images" field to an empty array
  );

  console.log(res);
});
