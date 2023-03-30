const michelin = require("./michelinRestaurant");
const atlasObscura = require("./atlasObscura");
const atlasObscuraLocations = require("./atlasObscuraLocations");
const ticketMaster = require("./ticketMaster");
const algolia = require("./algolia");

const mongoose = require("mongoose");
require("dotenv").config();

// Run as:
// node -e 'require("./scraperWrapper.js").runMichelinScraper()'
exports.runMichelinScraper = async () => {
  const uri = process.env.ATLAS_URI;
  mongoose.connect(uri);
  const connection = mongoose.connection;
  connection.once("open", async () => {
    console.log("Connection established w MongoDB");
    const items = await michelin.getItems();
    console.log("should now upload " + items.length + " spots to db");

    // await michelin.uploadRestaurantsToDb(items);
    // console.log("finished uploading");
    mongoose.disconnect();
  });
};

exports.deleteMichelinSpots = async () => {
  const uri = process.env.ATLAS_URI;
  mongoose.connect(uri);
  const connection = mongoose.connection;
  connection.once("open", async () => {
    console.log("Connection established w MongoDB");
    await michelin.deleteRestaurantsFromDb();
    console.log("finished deleting");
    mongoose.disconnect();
  });
};

// Gets atlas obscura items across all locations
exports.runAtlasObscuraScraper = async () => {
  const uri = process.env.ATLAS_URI;
  mongoose.connect(uri);
  const connection = mongoose.connection;
  connection.once("open", async () => {
    console.log("Connection established w MongoDB");
    const items = await atlasObscura.getItems();
    console.log("should now upload " + items.length + " spots to db");
    mongoose.disconnect();
  });

  // await atlasObscura.uploadItemsToDb(items);
};

// Gets atlas obscura locations
exports.runAtlasObscuraLocationScraper = async () => {
  const items = await atlasObscuraLocations.getItems();
  console.log("should now write " + items.length + " locations to local file");
};

exports.runTicketMasterScraper = async () => {
  const uri = process.env.ATLAS_URI;
  mongoose.connect(uri);
  const connection = mongoose.connection;
  connection.once("open", async () => {
    console.log("Connection established w MongoDB");
    const items = await ticketMaster.getItems();
    console.log("should now upload " + items.length + " spots to db");
    await ticketMaster.uploadItemsToDb(items);
    mongoose.disconnect();
  });
};

exports.uploadAllSpotsToAlgoliaSearch = async () => {
  const uri = process.env.ATLAS_URI;
  mongoose.connect(uri);
  const connection = mongoose.connection;
  connection.once("open", async () => {
    console.log("Connection established w MongoDB");
    await algolia.transferFromMDBtoAlgolia();
    mongoose.disconnect();
  });
};
