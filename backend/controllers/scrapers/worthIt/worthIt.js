const fs = require("fs");
const Spot = require("../../../models/spotModel");
const mongoose = require("mongoose");
const csvParser = require("csv-parser");
require("dotenv").config({ path: "../.env" });

const result = [];

const cityToLoc = {
  "New York": { lat: 40.7128, lng: -74.006 },
  "Los Angeles": { lat: 34.0522, lng: -118.2437 },
  Chicago: { lat: 41.8781, lng: -87.6298 },
  Houston: { lat: 29.7604, lng: -95.3698 },
  Phoenix: { lat: 33.4484, lng: -112.074 },
  Philadelphia: { lat: 39.9526, lng: -75.1652 },
  "San Antonio": { lat: 29.4241, lng: -98.4936 },
  "San Diego": { lat: 32.7157, lng: -117.1611 },
  Dallas: { lat: 32.7767, lng: -96.797 },
  Detroit: { lat: 42.3314, lng: -83.0458 },
  "San Jose": { lat: 37.3382, lng: -121.8863 },
  Austin: { lat: 30.2672, lng: -97.7431 },
  Jacksonville: { lat: 30.3322, lng: -81.6557 },
  "Fort Worth": { lat: 32.7555, lng: -97.3308 },
  Columbus: { lat: 39.9612, lng: -82.9988 },
  "San Francisco": { lat: 37.7749, lng: -122.4194 },
  Charlotte: { lat: 35.2271, lng: -80.8431 },
  Indianapolis: { lat: 39.7684, lng: -86.1581 },
  "Las Vegas": { lat: 36.1699, lng: -115.1398 },
  "West Hollywood": { lat: 34.09, lng: -118.3617 },
  "Beverly Hills": { lat: 34.0736, lng: -118.4004 },
  Glendale: { lat: 34.1425, lng: -118.2551 },
  "Eagle Rock": { lat: 34.1397, lng: -118.21 },
  Pasadena: { lat: 34.1478, lng: -118.1445 },
  Seattle: { lat: 47.6062, lng: -122.3321 },
  "North Hollywood": { lat: 34.187, lng: -118.3813 },
  Hollywood: { lat: 34.0928, lng: -118.3287 },
  "Woodland Hills": { lat: 34.1684, lng: -118.6059 },
  "Highland Park": { lat: 34.1161, lng: -118.1922 },
  "Santa Monica": { lat: 34.0195, lng: -118.4912 },
  "Long Beach": { lat: 33.7701, lng: -118.1937 },
  "Studio City": { lat: 34.1396, lng: -118.3871 },
  "Culver City": { lat: 34.0211, lng: -118.3965 },
  Pyrmont: { lat: -33.8696, lng: 151.1942 },
  Sydney: { lat: -33.8688, lng: 151.2093 },
  Barangaroo: { lat: -33.861, lng: 151.2019 },
  Melbourne: { lat: -37.8136, lng: 144.9631 },
  Nagambie: { lat: -36.7867, lng: 145.1522 },
  Avenel: { lat: -37.8076, lng: 144.9631 },
  Wahgunyah: { lat: -36.0367, lng: 146.4261 },
  "St. Kilda": { lat: -37.8672, lng: 144.9803 },
  Harlem: { lat: 40.8116, lng: -73.9465 },
  "Kita-Senju Tokyo": { lat: 35.7485, lng: 139.8049 },
  "Sugamo Tokyo": { lat: 35.7332, lng: 139.739 },
  "Roppongi Tokyo": { lat: 35.6628, lng: 139.7317 },
  "Takadanobaba Tokyo": { lat: 35.7127, lng: 139.7036 },
  "Daikanyama Tokyo": { lat: 35.6487, lng: 139.7036 },
  "Yao Osaka": { lat: 34.6157, lng: 135.6 },
  "Shinsaibashi Osaka": { lat: 34.6763, lng: 135.4956 },
  "Shibuya Tokyo": { lat: 35.664, lng: 139.6982 },
  "Akasaka Tokyo": { lat: 35.6719, lng: 139.7356 },
  "St. Paul": { lat: 44.9537, lng: -93.09 },
  Minneapolis: { lat: 44.9778, lng: -93.265 },
  "Palm Springs": { lat: 33.8303, lng: -116.5453 },
  Queens: { lat: 40.7282, lng: -73.7949 },
  "West Village New York": { lat: 40.734, lng: -74.0048 },
  "Times Square New York": { lat: 40.7589, lng: -73.9851 },
  "East Village New York": { lat: 40.7265, lng: -73.9815 },
  "Union Square New York": { lat: 40.7359, lng: -73.9911 },
  Honolulu: { lat: 21.3069, lng: -157.8583 },
  Montreal: { lat: 45.5017, lng: -73.5673 },
  "Flushing Queens": { lat: 40.7644, lng: -73.8317 },
  Japan: { lat: 36.2048, lng: 138.2529 },
  "Ikebukuro Tokyo": { lat: 35.7289, lng: 139.71 },
  "Ueno Tokyo": { lat: 35.7138, lng: 139.7768 },
  "Ginza Tokyo": { lat: 35.6708, lng: 139.7667 },
  "Tsukiji Tokyo": { lat: 35.6654, lng: 139.7707 },
  "Nakagyo-ku Kyoto": { lat: 35.0116, lng: 135.7681 },
  "Higashiyama-ku Kyoto": { lat: 35.0037, lng: 135.7789 },
  "Chichibu Saitama": { lat: 35.9926, lng: 139.084 },
  Nashville: { lat: 36.1627, lng: -86.7816 },
  "Nakameguro Tokyo": { lat: 35.6444, lng: 139.6981 },
  Fresno: { lat: 36.7378, lng: -119.7871 },
  Taipei: { lat: 25.0329, lng: 121.5654 },
  Tainan: { lat: 22.9997, lng: 120.227 },
  "Temple City": { lat: 34.1072, lng: -118.0578 },
  Venice: { lat: 33.985, lng: -118.4695 },
  Gardena: { lat: 33.8883, lng: -118.3089 },
  "New Orleans": { lat: 29.9511, lng: -90.0715 },
  Charleston: { lat: 32.7765, lng: -79.9311 },
  Wilmington: { lat: 34.2257, lng: -77.9447 },
  Durham: { lat: 35.994, lng: -78.8986 },
  Raleigh: { lat: 35.7796, lng: -78.6382 },
  Seoul: { lat: 37.5665, lng: 126.978 },
};

const uri = process.env.ATLAS_URI;
mongoose.connect(uri);
const connection = mongoose.connection;
connection.once("open", async () => {
  console.log("Connection established w MongoDB");

  fs.createReadStream("./worthIt.csv")
    .pipe(csvParser())
    .on("data", (data) => {
      result.push(data);
    })
    .on("end", async () => {
      let curRests = [];

      for (let i = 0; i < result.length; i++) {
        console.log(i);
        // after every 100 spots, upload to db
        if (i % 100 === 0) {
          const curRestsWithPlaces = await findGooglePlaces(curRests);
          console.log(
            `results with places ${i - 100}-${i}`,
            curRestsWithPlaces
          );
          await uploadSpotsToDB(curRestsWithPlaces);
          curRests = [];
        }

        const restaurant = result[i];
        curRests.push(restaurant);
      }

      const curRestsWithPlaces = await findGooglePlaces(curRests);
      console.log("results with places", curRestsWithPlaces);
      await uploadSpotsToDB(curRestsWithPlaces);
    });
});

async function findGooglePlaces(restaurants) {
  const validatedRests = [];

  for (let i = 0; i < restaurants.length; i++) {
    const restaurant = restaurants[i];
    if (restaurant.city_name in cityToLoc) {
      url =
        "https://maps.googleapis.com/maps/api/place/findplacefromtext/json?input=" +
        restaurant.name.replaceAll(" ", "%20") +
        "&inputtype=textquery&locationbias=circle%3A20000%" +
        cityToLoc[restaurant.city_name].lat +
        "%2C" +
        cityToLoc[restaurant.city_name].lng +
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
          restaurant["place_id"] = place_id;
          restaurant["_geoloc"] = data.candidates[0].geometry.location;
          restaurant["formatted_address"] =
            data.candidates[0].formatted_address;
        }
        validatedRests.push(restaurant);
      }
    } else {
      console.log(restaurant.city_name);
    }
  }
  return validatedRests;
}

async function uploadSpotsToDB(restaurants) {
  for (let i = 0; i < restaurants.length; i++) {
    const restaurant = restaurants[i];

    // note: |0 is a shorthand for Math.floor()
    const new_spot = new Spot({
      title: restaurant.name,
      description:
        "Worth it restaurant from the " +
        restaurant.episode +
        " episode in season " +
        restaurant.season,
      category: "Restaurant",
      specialty: 0,
      quality: 0,
      popularity: 0,
      numberOfRatings: 0,
      avgTimeSpent: 0,
      location: {
        lat: restaurant._geoloc.lat,
        lng: restaurant._geoloc.lng,
      },
      cost: 0,
      mapLocation: {
        formatted_address: restaurant.formatted_address,
        formatted_phone_number: "",
        geometry: {
          location: {
            lat: restaurant._geoloc.lat,
            lng: restaurant._geoloc.lng,
          },
        },
        place_id: restaurant.place_id,
        types: [],
        rating: 0,
        user_ratings_total: 0,
        price_level: 0,
      },
      status: "Approved",
      sponsored: false,
      highlightedIn: [],
      featuredBy: ["WorthIt"],
      duration: 0,
      images: [""],
      reviews: [],
      externalIds: [],
      externalLink: "",
      openTimes: [],
      activities: [],
      features: [],
    });

    // new_spot.save(function (err, spot) {
    //   if (err) console.log("had an error", err);
    // });
  }

  console.log("Inserted spots into DB");
}
