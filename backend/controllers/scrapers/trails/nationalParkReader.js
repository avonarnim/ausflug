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

  fs.createReadStream("./nationalPark.csv")
    .pipe(csvParser())
    .on("data", (data) => {
      result.push(data);
    })
    .on("end", async () => {
      let curTrails = [];

      for (let i = 0; i < result.length; i++) {
        console.log(i);
        // after every 100 spots, upload to db
        if (i % 100 === 0) {
          const curTrailsWithPlaces = await findGooglePlaces(curTrails);
          console.log(
            `results with places ${i - 100}-${i}`,
            curTrailsWithPlaces
          );
          await uploadSpotsToDB(curTrailsWithPlaces);
          curTrails = [];
        }

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

        curTrails.push(trail);
      }

      const curTrailsWithPlaces = await findGooglePlaces(curTrails);
      console.log("results with places", curTrailsWithPlaces);
      await uploadSpotsToDB(curTrailsWithPlaces);
    });
});

async function findGooglePlaces(trails) {
  const validatedTrails = [];

  for (let i = 0; i < trails.length; i++) {
    const trail = trails[i];
    url =
      "https://maps.googleapis.com/maps/api/place/findplacefromtext/json?input=" +
      trail.name.replaceAll(" ", "%20") +
      "&inputtype=textquery&locationbias=circle%3A2000%" +
      trail._geoloc.lat +
      "%2C" +
      trail._geoloc.lng +
      "&fields=formatted_address%2Cgeometry%2Cplace_id&key=" +
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
        trail["place_id"] = place_id;
        // trail["photo_reference"] = data.candidates[0].photos[0].photo_reference;
        trail["_geoloc"] = data.candidates[0].geometry.location;
        trail["formatted_address"] = data.candidates[0].formatted_address;
        console.log(place_id);
      }
    }

    validatedTrails.push(trail);
  }
  return validatedTrails;
}

async function uploadSpotsToDB(trails) {
  for (let i = 0; i < trails.length; i++) {
    const trail = trails[i];

    // note: |0 is a shorthand for Math.floor()
    const new_spot = new Spot({
      title: trail.name,
      description:
        ((parseInt(trail.length) / 5280) | 0) +
        " mi. long " +
        trail.route_type +
        " trail in " +
        trail.area_name +
        ". " +
        trail.elevation_gain +
        " ft. elevation gain. Difficulty: " +
        trail.difficulty_rating +
        ".",
      category: "Nature",
      specialty: trail.avg_rating,
      quality: trail.avg_rating,
      popularity: trail.popularity,
      numberOfRatings: trail.num_reviews,
      avgTimeSpent: 0,
      location: {
        lat: trail._geoloc.lat,
        lng: trail._geoloc.lng,
      },
      cost: 0,
      mapLocation: {
        formatted_address: trail.formatted_address,
        formatted_phone_number: "",
        geometry: {
          location: {
            lat: trail._geoloc.lat,
            lng: trail._geoloc.lng,
          },
        },
        place_id: trail.place_id,
        types: [],
        rating: 0,
        user_ratings_total: 0,
        price_level: 0,
      },
      status: "Approved",
      sponsored: false,
      highlightedIn: ["NationalParks"],
      featuredBy: [],
      duration: 0,
      images: [""],
      reviews: [],
      // imageGoogleReference: trail.photo_reference,
      externalIds: [],
      externalLink: "",
      openTimes: [],
      activities: trail.activities,
      features: trail.features,
    });

    new_spot.save(function (err, spot) {
      if (err) console.log("had an error", err);
    });
  }

  console.log("Inserted spots into DB");
}

// async function getPhoto(photo_reference) {
//   url =
//     "https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=" +
//     photo_reference +
//     "&key=" +
//     process.env.GOOGLE_PLACES_API_KEY;
//   res = await fetch(url, {
//     method: "GET",
//     headers: {},
//   });

//   if (res.ok) {
//     const data =
//       res.status === 204
//         ? undefined
//         : res.headers.get("content-type")?.includes("application/json")
//         ? await res.json()
//         : await res.text();

//     console.log(data);
//     return data;
//   }
// }
