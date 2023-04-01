const Spot = require("../../models/spotModel");
const mongoose = require("mongoose");
require("dotenv").config();

const uri = process.env.ATLAS_URI;
mongoose.connect(uri);
const connection = mongoose.connection;
connection.once("open", () => {
  console.log("Connection established w MongoDB");

  Spot.find({ place_id: null }, async function (err, spots) {
    if (err) console.log(err);
    console.log("spots:", spots.length);
    for (let i = 0; i < spots.length; i++) {
      if (i % 500 === 0) console.log(i);

      const spot = spots[i];
      url =
        "https://maps.googleapis.com/maps/api/place/autocomplete/json?input=" +
        spot.title.replaceAll(" ", "%20") +
        "&location=" +
        spot.location.lat +
        "%2C" +
        spot.location.lng +
        "&radius=500" +
        "&key=" +
        process.env.GOOGLE_PLACES_API_KEY;
      console.log(url);
      res = await fetch(url, {
        method: "GET",
        headers: {},
      });

      if (res.ok) {
        const data =
          res.status === 204
            ? undefined
            : res.headers.get("content-type")?.includes("application/json")
            ? await res.json()
            : await res.text();

        if (data.predictions.length > 0) {
          const place_id = data.predictions[0].place_id;
          Spot.updateOne(
            { _id: spot._id },
            { place_id: place_id },
            function (err, res) {
              if (err) console.log(err);
            }
          );
        }
      }
    }

    mongoose.disconnect();
  });
});
