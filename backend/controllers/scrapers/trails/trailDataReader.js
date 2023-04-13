const data = require("./trailData.json");
const Spot = require("../../models/spotModel");
const mongoose = require("mongoose");
require("dotenv").config();

const trailheadPoints = data.features.map((feature) => {
  return {
    coordinates: feature.geometry.coordinates,
    name: feature.properties.name,
    amenity: feature.properties.amenity,
    surface: feature.properties.surface || null,
    parking: feature.properties.parking || null,
    fee: feature.properties.fee || null,
    operator: feature.properties.operator || null,
    access: feature.properties.access || null,
    natural: feature.properties.natural || null,
    mountain_pass: feature.properties.mountain_pass || null,
    drinking_water: feature.properties.drinking_water || null,
    picnic_table: feature.properties.picnic_table || null,
    shelter: feature.properties.shelter || null,
    toilets: feature.properties.toilets || null,
    tree_lined: feature.properties.tree_lined || null,
    website: feature.properties.website || null,
    description: feature.properties.description || null,
    bicycle: feature.properties.bicycle || null,
  };
});

console.log(trailheadPoints);

const uri = process.env.ATLAS_URI;
mongoose.connect(uri);
const connection = mongoose.connection;
connection.once("open", async () => {
  console.log("Connection established w MongoDB");

  for (let i = 0; i < trailheadPoints.length; i++) {
    const trailhead = trailheadPoints[i];
    url =
      "https://maps.googleapis.com/maps/api/place/autocomplete/json?input=" +
      trailhead.name.replaceAll(" ", "%20") +
      "&location=" +
      trailhead.coordinates[0] +
      "%2C" +
      trailhead.coordinates[1] +
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
          description: trailhead.description || "Trailhead",
          specialty: 0,
          quality: 0,
          numberOfRatings: 0,
          avgTimeSpent: 0,
          location: {
            lat: trailhead.coordinates[0],
            lng: trailhead.coordinates[1],
          },
          cost: trailhead.fee || 0,
          mapLocation: {
            formatted_address: "",
            formatted_phone_number: "",
            geometry: {
              location: {
                lat: trailhead.coordinates[0],
                lng: trailhead.coordinates[1],
              },
            },
            place_id: place_id,
            types: [],
            rating: 0,
            user_ratings_total: 0,
            price_level: trailhead.fee || 0,
          },
          status: "Approved",
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
    }
  }
});
