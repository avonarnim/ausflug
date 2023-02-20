const rp = require("request-promise");
const cheerio = require("cheerio");
const fs = require("fs");

const { timeout, usStates } = require("./utils");

const baseUrl = "https://atlasobscura.com/destinations";

const selectors = {
  buttons: "a.text-lg.text-ao-brown.tracking-wide",
};

class LocationScraper {
  constructor() {
    this.locations = [];
  }

  run = async () => {
    await this.scrape(1);
  };

  getLocations = () => this.locations;

  scrape = async (currentPage) => {
    const start = new Date();
    const options = {
      uri: baseUrl,
      transform: (body) => {
        return cheerio.load(body);
      },
    };

    const $ = await rp(options).catch((err) => {
      delete err.response;
      console.log(err);
    });

    const countries = $(selectors.buttons);
    countries.each((idx, ref) => {
      const elem = $(ref);
      this.locations.push(elem.text());
    });

    const end = new Date();
    const delay = this.rateLimiterDelay - (end - start);
    await timeout(delay);

    if (currentPage < this.totalPages) {
      return this.scrape(currentPage + 1);
    }
    return;
  };
}

const getItems = async function () {
  const scraper = new LocationScraper();

  // Scraping can be flaky. Attempt scraping multiple times
  for (let i = 0; i < 1; i++) {
    console.log("Scraping attempt:", i + 1);

    await scraper.run();
    console.log(`Found ${scraper.getLocations().length} locations`);

    console.log("==========");
  }

  // Write to file, taking each value from scraper.getLocations() and surrounding it with quotes and appending a comma
  fs.writeFile(
    "locations.txt",
    scraper.getLocations().reduce((acc, loc) => acc + `"${loc}",`, ""),
    function (err) {
      if (err) {
        return console.log(err);
      }
      console.log("The file was saved!");
    }
  );

  return scraper.getLocations();
};

module.exports = { LocationScraper, getItems };
