const michelin = require("./michelinRestaurant");
const atlasObscuraLocations = require("./atlasObscuraLocations");

// Run as:
// node -e 'require("./scraperWrapper.js").runMichelinScraper()'
exports.runMichelinScraper = async () => {
  const items = await michelin.getItems();
  console.log(items, items.length);
  console.log("should now upload to db");
};

exports.runAtlasObscuraScraper = async () => {
  const items = await AtlasObscuraScraper.getItems();
  console.log(items, items.length);
  console.log("should now upload to db");
};

exports.runAtlasObscuraLocationScraper = async () => {
  const items = await atlasObscuraLocations.getItems();
  console.log(items, items.length);
  console.log("should now upload to db");
};
