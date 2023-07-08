const rp = require("request-promise");
const cheerio = require("cheerio");
require("dotenv").config({ path: "../.env" });
const Gas = require("../../../models/gasModel");
const mongoose = require("mongoose");

async function scrapeGasStations() {
  let gasStations = [];

  try {
    const baseUrl = "https://www.gasbuddy.com";
    const gasPricesUrl = `${baseUrl}/gasprices`;

    // Scrape state pages
    const gasPricesHtml = await rp(gasPricesUrl);
    const $ = cheerio.load(gasPricesHtml);

    const stateLinks = $(".DataGrid-module__gridEntry___1Ivee a");

    console.log(stateLinks.length);

    for (let i = 0; i < stateLinks.length; i++) {
      // for (let i = 0; i < 5; i++) {
      const stateLink = stateLinks[i];
      const stateUrl = `${baseUrl}${$(stateLink).attr("href")}`;

      console.log("stateUrl", stateUrl);

      // Scrape gas stations in each state
      const stateHtml = await rp(stateUrl);
      const $$ = cheerio.load(stateHtml);

      const gasStationLinks = $$('a[href^="/station/"]');

      for (let j = 0; j < gasStationLinks.length; j++) {
        const gasStationLink = gasStationLinks[j];
        const gasStationUrl = `${baseUrl}${$$(gasStationLink).attr("href")}`;

        // wait a random amount of time between 0 and 10 seconds before scraping each gas station
        const randomWaitTime = Math.floor(Math.random() * 10000);
        await new Promise((resolve) => setTimeout(resolve, randomWaitTime));

        // Scrape gas station details
        const gasStationHtml = await rp(gasStationUrl)
          .then((html) => html)
          .catch((err) => {
            console.log("can't continue");
            return "error";
          });
        if (gasStationHtml === "error") continue;

        const $$$ = cheerio.load(gasStationHtml);

        const name = $$$(".StationInfoBox-module__mainInfo___2ge55 h2")
          .text()
          .trim();
        const address = $$$(
          ".StationInfoBox-module__mainInfo___2ge55 .StationInfoBox-module__ellipsisNoWrap___1-lh5 span:first-child"
        )
          .text()
          .trim();
        const gasPrices = {
          regular: 0,
          midgrade: 0,
          premium: 0,
          diesel: 0,
        };

        console.log("name", name);

        // const fuelTypes = ["Regular", "Midgrade", "Premium", "Diesel"];

        const fuelTypes = [];

        $$$(".GasPriceCollection-module__row___2JDQq")
          .find(".GasPriceCollection-module__fuelTypeDisplay___eE6tM")
          .each(function (index) {
            const fuelType = $(this).text().trim().toLowerCase();
            fuelTypes.push(fuelType);
          });

        $$$(".GasPriceCollection-module__row___2JDQq")
          .find(".FuelTypePriceDisplay-module__price___3iizb")
          .each(function (index) {
            const price = $(this).text().trim();
            const fuelType = fuelTypes[index];

            if (price === "---" || price === "- - -") {
              gasPrices[fuelType] = 0;
            } else {
              gasPrices[fuelType] = parseFloat(price.slice(1));
            }
          });

        // Extract latitude and longitude from the map URL
        const mapUrl = $$$(".Station-module__directionsLink___3vvor").attr(
          "href"
        );
        const [latitude, longitude] = mapUrl
          .match(/@(-?\d+\.\d+),(-?\d+\.\d+)/)
          .slice(1);
        // Construct the Google Places API URL
        const googlePlacesUrl =
          "https://maps.googleapis.com/maps/api/place/findplacefromtext/json?input=" +
          name.replaceAll(" ", "%20").replaceAll("'", "%27") +
          "&inputtype=textquery&locationbias=circle%3A40000%40" +
          latitude +
          "%2C" +
          longitude +
          "&fields=formatted_address%2Cgeometry%2Cplace_id&key=" +
          process.env.GOOGLE_PLACES_API_KEY;

        // Make a request to the Google Places API
        const googlePlacesResponse = await rp(googlePlacesUrl);
        const placeData = JSON.parse(googlePlacesResponse);
        const placeId = placeData.candidates[0].place_id;
        const formattedAddress = placeData.candidates[0].formatted_address;
        const location = placeData.candidates[0].geometry.location;

        gasStations.push({
          name,
          address,
          gasPrices,
          placeId,
          formattedAddress,
          location,
        });
        console.log(name);
      }
    }
  } catch (error) {
    console.error("Error:", error);
  }

  console.log("total: ", gasStations.length);
  return gasStations;
}

scrapeGasStations().then((gasStations) => {
  const uri = process.env.ATLAS_URI;
  mongoose.connect(uri);
  const connection = mongoose.connection;
  connection.once("open", async () => {
    console.log("Connection established w MongoDB");

    for (let i = 0; i < gasStations.length; i++) {
      const station = gasStations[i];

      const new_gas = new Gas({
        name: station.name,
        mapLocation: {
          formatted_address: station.formattedAddress,
          formatted_phone_number: "",
          geometry: {
            location: {
              lat: station.location.lat,
              lng: station.location.lng,
            },
          },
          place_id: station.placeId,
        },
        ratings: [],
        rating: 0,
        number_of_ratings: 0,
        prices: [
          {
            unleaded: station.gasPrices.regular,
            midgrade: station.gasPrices.midgrade,
            premium: station.gasPrices.premium,
            diesel: station.gasPrices.diesel,
            date: new Date().getTime(),
            userId: "gasBuddy",
          },
        ],
        resolved_prices: {
          unleaded: 0,
          midgrade: 0,
          premium: 0,
          diesel: 0,
        },
      });

      new_gas.save(function (err, gas) {
        if (err) console.log("had an error", err);
      });
    }

    console.log("Inserted gas stations into DB");
  });
});
