const fs = require("fs");
const Spot = require("../../../models/spotModel");
const mongoose = require("mongoose");
const csvParser = require("csv-parser");
require("dotenv").config({ path: "../.env" });

const result = [];

const uri = process.env.ATLAS_URI;
mongoose.connect(uri);
const connection = mongoose.connection;
connection.once("open", async () => {
  console.log("Connection established w MongoDB");

  fs.createReadStream("./museums.csv")
    .pipe(csvParser())
    .on("data", (data) => {
      result.push(data);
    })
    .on("end", async () => {
      let curMuseums = [];

      // TODO: add more places starting at 2000...
      // NOTE: a lot of these places look not fun...
      // for (let i = 0; i < result.length; i++) {
      for (let i = 2000; i < result.length; i++) {
        if (i % 100 === 0) {
          console.log("i", i);
          const museumsWithPlaces = await findGooglePlaces(curMuseums);
          // console.log("results with places", museumsWithPlaces);
          await uploadSpotsToDB(museumsWithPlaces);
          curMuseums = [];
        }
        curMuseums.push(result[i]);
      }

      const curMuseumsWithPlaces = await findGooglePlaces(curMuseums);
      // console.log("results with places", curMuseumsWithPlaces);
      await uploadSpotsToDB(curMuseumsWithPlaces);
    });
});

async function findGooglePlaces(museums) {
  const validatedMuseums = [];

  for (let i = 0; i < museums.length; i++) {
    const museum = museums[i];
    url =
      "https://maps.googleapis.com/maps/api/place/findplacefromtext/json?input=" +
      museum["Museum Name"].replaceAll(" ", "%20") +
      "&inputtype=textquery&locationbias=circle%3A2000%" +
      museum.Latitude +
      "%2C" +
      museum.Longitude +
      "&fields=formatted_address%2Cname%2Crating%2Cgeometry%2Cplace_id%2Cuser_ratings_total&key=" +
      process.env.GOOGLE_PLACES_API_KEY;

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

      if (data.candidates.length > 0) {
        const place_id = data.candidates[0].place_id;
        museum.place_id = place_id;
        museum.location = data.candidates[0].geometry.location;
        museum.formatted_address = data.candidates[0].formatted_address;
        museum.rating = data.candidates[0].rating;
        museum.numberOfRatings = data.candidates[0].user_ratings_total;

        if (museum.numberOfRatings < 25 || museum.rating < 4) {
          console.log("Low rating, not adding:", museum["Museum Name"]);
          continue;
        }
      } else {
        console.log("Not adding:", museum["Museum Name"]);
        continue;
      }
    } else {
      console.log("Not adding:", museum["Museum Name"]);
      continue;
    }

    // console.log("museum", museum);
    validatedMuseums.push(museum);
  }
  return validatedMuseums;
}

async function uploadSpotsToDB(museums) {
  for (let i = 0; i < museums.length; i++) {
    const museum = museums[i];

    console.log(museum);

    // note: |0 is a shorthand for Math.floor()
    const new_spot = new Spot({
      title: museum["Museum Name"]
        .split(" ")
        .map((word) => {
          return word[0].toUpperCase() + word.slice(1).toLowerCase();
        })
        .join(" "),
      description: "",
      category: "Museum",
      specialty: museum.rating,
      quality: museum.rating,
      popularity: 0,
      numberOfRatings: 0,
      avgTimeSpent: 0,
      location: {
        lat: museum.location.lat,
        lng: museum.location.lng,
      },
      cost: 0,
      mapLocation: {
        formatted_address: museum.formatted_address,
        formatted_phone_number: "",
        geometry: {
          location: {
            lat: museum.location.lat,
            lng: museum.location.lng,
          },
        },
        place_id: museum.place_id,
        types: [],
        rating: museum.rating,
        user_ratings_total: 0,
        price_level: 0,
      },
      status: "Pending",
      sponsored: false,
      highlightedIn: [],
      featuredBy: [],
      duration: 0,
      image: "",
      externalIds: [],
      externalLink: "",
      openTimes: [],
      activities: [],
      featurs: [],
    });

    console.log(new_spot);

    new_spot.save(function (err, spot) {
      if (err) console.log("had an error", err);
    });
  }

  console.log("Inserted spots into DB");
}
