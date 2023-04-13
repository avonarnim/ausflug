const fs = require("fs");
const Spot = require("../../models/spotModel");
const mongoose = require("mongoose");
require("dotenv").config();

const csvData = fs.readFileSync("./museumDummy.csv", "utf8", (err, data) => {
  // const res = fs.readFileSync("./museums.csv", "utf8", (err, data) => {
  if (err) {
    console.error(err);
    return;
  }
  return data;
});

const rawColumns = csvData.split("\n")[0].split(",");
const formattedColumns = rawColumns.map((column) => {
  return column
    .replaceAll(" ", "_")
    .replaceAll("(", "")
    .replaceAll(")", "")
    .toLowerCase();
});
const rows = csvData.split("\n").slice(1);
let museums = [];
for (let i = 0; i < rows.length; i++) {
  const row = rows[i].split(",");
  const museum = {};
  for (let j = 0; j < formattedColumns.length; j++) {
    museum[formattedColumns[j]] = row[j];
  }
  museums.push(museum);
  console.log("MUSEUM", museum);
}

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
