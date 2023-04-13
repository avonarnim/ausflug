const fs = require("fs");
const Spot = require("../../../models/spotModel");
const mongoose = require("mongoose");
const csvParser = require("csv-parser");
require("dotenv").config();

const result = [];

fs.createReadStream("./nationalPark.csv")
  .pipe(csvParser())
  .on("data", (data) => {
    result.push(data);
  })
  .on("end", () => {
    for (let i = 0; i < result.length; i++) {
      const trail = result[i];
      trail._geoloc = JSON.parse(trail._geoloc.replaceAll("'", '"'));
      trail.features = trail.features
        .replaceAll(" ", "")
        .replaceAll("'", "")
        .split("[")[1]
        .split("]")[0]
        .split(",");
      trail.activities = trail.activities
        .replaceAll(" ", "")
        .replaceAll("'", "")
        .split("[")[1]
        .split("]")[0]
        .split(",");
    }
  });

const uri = process.env.ATLAS_URI;
mongoose.connect(uri);
const connection = mongoose.connection;
connection.once("open", async () => {
  console.log("Connection established w MongoDB");

  for (let i = 0; i < museums.length; i++) {
    const museum = museums[i];
    url =
      "https://maps.googleapis.com/maps/api/place/autocomplete/json?input=" +
      museum.museumname.replaceAll(" ", "%20") +
      "&location=" +
      museum.latitude +
      "%2C" +
      museum.longitude +
      "&radius=1000" +
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

        const new_spot = new Spot({
          title: trailhead.name,
          description:
            museum.museumtype +
              " in " +
              museum.cityphysicallocation +
              ", " +
              museum.statephysicallocation || "Museum",
          specialty: 0,
          quality: 0,
          numberOfRatings: 0,
          avgTimeSpent: 0,
          location: {
            lat: museum.latitude,
            lng: museum.longitude,
          },
          cost: 0,
          mapLocation: {
            formatted_address: museum.streetaddressphysicallocation,
            formatted_phone_number: "",
            geometry: {
              location: {
                lat: museum.latitude,
                lng: museum.longitude,
              },
            },
            place_id: place_id,
            types: [],
            rating: 0,
            user_ratings_total: 0,
            price_level: trailhead.fee || 0,
          },
          status: "Pending",
          sponsored: false,
          highlightedIn: [],
          featuredBy: [""],
          duration: 0,
          image: "",
          externalIds: [],
          externalLink: "",
          openTimes: [],
        });

        // new_spot.save(function (err, spot) {
        //   if (err) console.log("had an error", err);
        // });
      }
    }
  }
});
