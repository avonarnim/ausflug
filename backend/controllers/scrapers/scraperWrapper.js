const michelin = require("./michelinRestaurant");
const atlasObscura = require("./atlasObscura");
const atlasObscuraLocations = require("./atlasObscuraLocations");

// Run as:
// node -e 'require("./scraperWrapper.js").runMichelinScraper()'
exports.runMichelinScraper = async () => {
  const items = await michelin.getItems();
  console.log(items, items.length);
  console.log("should now upload to db");
};

// Gets atlas obscura items across all locations
exports.runAtlasObscuraScraper = async () => {
  const items = await atlasObscura.getItems();
  console.log(items, items.length);
  console.log("should now upload to db");
};

// Gets atlas obscura locations
exports.runAtlasObscuraLocationScraper = async () => {
  const items = await atlasObscuraLocations.getItems();
  console.log(items, items.length);
  console.log("should now upload to db");
};
