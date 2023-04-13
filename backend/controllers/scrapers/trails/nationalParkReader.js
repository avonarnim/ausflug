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
  .on("end", async () => {
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

      console.log(trail);
    }

    // const resultsWithPlaces = await findGooglePlaces(result);
    // await uploadSpotsToDB(resultsWithPlaces);
  });

async function findGooglePlaces(trails) {
  for (let i = 0; i < trails.length; i++) {
    const trail = trails[i];
    url =
      "https://maps.googleapis.com/maps/api/place/autocomplete/json?input=" +
      trail.name.replaceAll(" ", "%20") +
      "&location=" +
      trail._geoloc.lat +
      "%2C" +
      trail._geoloc.lng +
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
        trail["place_id"] = place_id;
      }
    }
  }
}

async function uploadSpotsToDB(trails) {
  const uri = process.env.ATLAS_URI;
  mongoose.connect(uri);
  const connection = mongoose.connection;
  connection.once("open", async () => {
    console.log("Connection established w MongoDB");

    for (let i = 0; i < trails.length; i++) {
      const trail = trails[i];

      const new_spot = new Spot({
        title: trail.name,
        description:
          int(int(trail.length) / 5280) +
          " mi. long " +
          trail.route_type +
          " trail in " +
          trail.area_name +
          ". " +
          trail.elevation_gain +
          " ft. elevation gain. Difficulty: " +
          trail.difficulty_rating +
          ". Activities: " +
          trail.activities +
          ". Features: " +
          trail.features,
        specialty: trail.popularity,
        quality: trail.avg_rating,
        numberOfRatings: trail.num_reviews,
        avgTimeSpent: 0,
        location: {
          lat: trail._geoloc.lat,
          lng: trail._geoloc.lng,
        },
        cost: 0,
        mapLocation: {
          formatted_address: "",
          formatted_phone_number: "",
          geometry: {
            location: {
              lat: trail._geoloc.lat,
              lng: trail._geoloc.lng,
            },
          },
          place_id: place_id,
          types: [],
          rating: 0,
          user_ratings_total: 0,
          price_level: 0,
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

      new_spot.save(function (err, spot) {
        if (err) console.log("had an error", err);
      });
    }
  });
}
