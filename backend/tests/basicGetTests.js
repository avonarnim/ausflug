const axios = require("axios");

const baseUrl = "https://backend-juu6vpc43a-wn.a.run.app";
// const baseUrl = "http://localhost:8080";

// Function to send a GET request
async function sendGetRequest(endpoint) {
  const response = await axios.get(baseUrl, {
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, PATCH, PUT, DELETE, OPTIONS",
      "Access-Control-Allow-Headers": "Origin, Content-Type, X-Auth-Token",
    },
    url: endpoint,
  });
  return response.data;
}

// Function to send a POST request with a JSON payload
async function sendPostRequest(endpoint, payload) {
  const url = `${baseUrl}${endpoint}`;
  const response = await axios.post(url, payload);
  return response.data;
}

// Test function
async function runTests() {
  try {
    // record timestamp
    const startTimestamp = new Date().getTime();

    // GET request to /api/spots
    const spots = await sendGetRequest("/api/spots");
    console.log("GET /api/spots:", spots);

    // POST request to /api/spots/assemblage
    const assemblagePayload = {
      locations: [
        { longitude: -73.935242, latitude: 40.73061, title: "New York" },
        {
          longitude: -118.243683,
          latitude: 34.052235,
          title: "Los Angeles",
        },
        { longitude: -87.6298, latitude: 41.8781, title: "Chicago" },
        {
          longitude: -122.419416,
          latitude: 37.774929,
          title: "San Francisco",
        },
        {
          longitude: -77.03653,
          latitude: 38.907192,
          title: "Washington D.C.",
        },
        { longitude: -122.33207, latitude: 47.60621, title: "Seattle" },
      ],
      sources: [
        { source: "AtlasObscura", title: "Atlas Obscura" },
        { source: "MichelinRestaurants", title: "Michelin Restaurants" },
        { source: "TicketMaster", title: "Venues" },
      ],
      subjects: [
        { subject: "Hiking", title: "Hikes" },
        { subject: "Beaches", title: "Beaches" },
        { subject: "Parks", title: "Parks" },
        { subject: "History", title: "History" },
      ],
      trips: ["644464402150a291d0075173", "64994b152a19f8d82dd9f90c"],
    };
    const assemblageResult = await sendPostRequest(
      "/api/spots/assemblage",
      assemblagePayload
    );
    console.log("POST /api/spots/assemblage:", assemblageResult);

    // POST request to /api/spots/query
    const queryPayload = {
      query: "Hiking",
    };
    const queryResult = await sendPostRequest("/api/spots/query", queryPayload);
    console.log("POST /api/spots/query:", queryResult[0]);

    // POST request to /api/spots/similar
    const similarPayload = {
      title: "Shmoné",
      description: "Israeli",
    };
    const similarResult = await sendPostRequest(
      "/api/spots/similar",
      similarPayload
    );
    console.log("POST /api/spots/similar:", similarResult[0]);

    // GET request to /api/spots/center/:latitude/:longitude
    const latitude = 34.09611110000001;
    const longitude = -118.1058333;
    const centerResult = await sendGetRequest(
      `/api/spots/center/${latitude}/${longitude}`
    );
    console.log(
      `GET /api/spots/center/${latitude}/${longitude}:`,
      centerResult
    );

    // GET request to /api/spots/single/:spotId
    const spotId = "64445765d14fa23408c26ea3";
    const singleSpotResult = await sendGetRequest(
      `/api/spots/single/${spotId}`
    );
    console.log(`GET /api/spots/single/${spotId}:`, singleSpotResult);

    // api/gas/stations/box/:latitude1/:longitude1/:latitude2/:longitude2 (get)
    const latitude1 = 34.09611110000001;
    const longitude1 = -118.1058333;
    const latitude2 = 32.715738;
    const longitude2 = -117.1610838;
    const gasStationsBoxResult = await sendGetRequest(
      `/api/gas/stations/box/${latitude1}/${longitude1}/${latitude2}/${longitude2}`
    );
    console.log(
      `GET /api/gas/stations/box/${latitude1}/${longitude1}/${latitude2}/${longitude2}:`,
      gasStationsBoxResult
    );

    // /api/gas/avgPricebox/:latitude1/:longitude1/:latitude2/:longitude2 (get)
    const avgPriceBoxResult = await sendGetRequest(
      `/api/gas/avgPricebox/${latitude1}/${longitude1}/${latitude2}/${longitude2}`
    );
    console.log(
      `GET /api/gas/avgPricebox/${latitude1}/${longitude1}/${latitude2}/${longitude2}:`,
      avgPriceBoxResult
    );

    // /api/gas/stations/:id (get), /api/users/:userId (get)
    const userId = "daxVClnu5wT3KZY7i2EBoL3rH1I2";
    const userResult = await sendGetRequest(`/api/users/${userId}`);
    console.log(`GET /api/users/${userId}:`, userResult);

    // /api/events/boxTime/:latitude1/:longitude1/:latitude2/:longitude2/:startDate/:endDate (get)
    const startDate = "2023-07-26T01:21:51-07:00";
    const endDate = "2023-07-30T01:21:51-07:00";
    const eventsBoxTimeResult = await sendGetRequest(
      `/api/events/boxTime/${latitude1}/${longitude1}/${latitude2}/${longitude2}/${startDate}/${endDate}`
    );
    console.log(
      `GET /api/events/boxTime/${latitude1}/${longitude1}/${latitude2}/${longitude2}/${startDate}/${endDate}:`,
      eventsBoxTimeResult
    );

    // /api/users/username/:username (get)
    const username = "vonarnim";
    const usernameResult = await sendGetRequest(
      `/api/users/username/${username}`
    );
    console.log(`GET /api/users/username/${username}:`, usernameResult);

    // /api/users/statuses/:userId (get)
    const statusesResult = await sendGetRequest(
      `/api/users/statuses/${userId}`
    );
    console.log(`GET /api/users/statuses/${userId}:`, statusesResult);

    // /api/admin/metrics/window/:days (get)
    const days = 7;
    const metricsWindowResult = await sendGetRequest(
      `/api/admin/metrics/window/${days}`
    );
    console.log(`GET /api/admin/metrics/window/${days}:`, metricsWindowResult);

    // record final timestamp
    const endTimestamp = new Date().getTime();
    console.log("Total time:", endTimestamp - startTimestamp, "ms");
  } catch (error) {
    console.error("An error occurred:", error);
  }
}

// Run the tests
runTests();
