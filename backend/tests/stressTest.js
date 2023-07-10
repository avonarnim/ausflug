const axios = require("axios");
const { performance } = require("perf_hooks");

const baseUrl = "https://backend-juu6vpc43a-wn.a.run.app";

const NUM_CONCURRENT_REQUESTS = 100; // Number of concurrent requests to send
const TOTAL_REQUESTS = 1000; // Total number of requests to send
const ENDPOINTS = [
  { endpoint: "/api/spots", method: "GET" },
  {
    endpoint: "/api/spots/assemblage",
    method: "POST",
    payload: {
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
    },
  },
  {
    endpoint: "/api/spots/query",
    method: "POST",
    payload: {
      query: "Hiking",
    },
  },
  {
    endpoint: "/api/spots/similar",
    method: "POST",
    payload: {
      title: "Shmoné",
      description: "Israeli",
    },
  },
  {
    endpoint: "/api/spots/center/34.09611110000001/-118.1058333",
    method: "GET",
  },
  { endpoint: "/api/spots/single/64445765d14fa23408c26ea3", method: "GET" },
]; // Array of endpoints to hit

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

// Function to send requests in parallel
async function sendParallelRequests() {
  const promises = [];
  for (let i = 0; i < NUM_CONCURRENT_REQUESTS; i++) {
    const randomEndpoint =
      ENDPOINTS[Math.floor(Math.random() * ENDPOINTS.length)];
    if (randomEndpoint.method === "POST") {
      promises.push(
        sendPostRequest(randomEndpoint.endpoint, randomEndpoint.payload)
      );
    } else {
      promises.push(sendGetRequest(randomEndpoint));
    }
  }
  await Promise.all(promises);
}

// Function to simulate stress testing
async function simulateStressTest() {
  console.log(
    `Starting stress test with ${NUM_CONCURRENT_REQUESTS} concurrent requests for a total of ${TOTAL_REQUESTS} requests...`
  );

  const startTimestamp = performance.now();
  const start = new Date();

  let completedRequests = 0;
  while (completedRequests < TOTAL_REQUESTS) {
    await sendParallelRequests();
    completedRequests += NUM_CONCURRENT_REQUESTS;
    console.log(`Completed ${completedRequests} requests...`);
  }

  const end = new Date();
  const endTimestamp = performance.now();
  const duration = endTimestamp - startTimestamp;
  const averageResponseTime = duration / TOTAL_REQUESTS;

  console.log("--- Stress Test Summary ---");
  console.log("Start Time:", start);
  console.log("End Time:", end);
  console.log("Total Requests:", TOTAL_REQUESTS);
  console.log("Concurrency Level:", NUM_CONCURRENT_REQUESTS);
  console.log("Duration (ms):", duration.toFixed(2));
  console.log("Average Response Time (ms):", averageResponseTime.toFixed(2));
}

// Run the stress test
simulateStressTest().catch((error) => {
  console.error("An error occurred during the stress test:", error);
});
