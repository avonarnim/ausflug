const rp = require("request-promise");
const cheerio = require("cheerio");
const Spot = require("../../models/spotModel");

const { timeout, countries } = require("./utils");

const baseUrl = "https://www.atlasobscura.com/things-to-do";

const query = "/places?page=";

const itemsPerPage = 20;

const selectors = {
  cards: "A.Card",
  img: "img",
  name: ".Card__heading>span",
  description: ".Card__content",
};

const regEx = {
  img: /(?<=src=").*(?=" alt)/,
  totalItems: /(?<=of ).*(?= Items)/,
};

class AtlasObscuraScraper {
  constructor() {
    this.rateLimiterDelay = 4000;
    this.items = [];
    this.totalPages = 1;
  }

  run = async () => {
    for (let i = 0; i < countries.length; i++) {
      let country = countries[i];
      console.log("country", country);
      country = country.replace(" ", "-");
      const initialNumItems = this.items.length;
      const start = new Date();

      await this.scrape(1, country);

      const end = new Date();
      const delay = this.rateLimiterDelay - (end - start);
      await timeout(delay + Math.floor(Math.random() * 1000));

      if (this.items.length === initialNumItems) {
        console.log("No items found for country:", country, "... retrying");
        this.rateLimiterDelay += 1000;
        console.log("new rate limiter delay", this.rateLimiterDelay);
        await timeout(this.rateLimiterDelay);
        await this.scrape(1, country);
        if (this.items.length === initialNumItems) {
          console.log("Still no result");
        }
        await timeout(this.rateLimiterDelay);
      }
      // });
    }
  };

  getItems = () => this.items;

  setTotalPages = ($) => {
    const totalItems = Number(
      $("h1").text().match(regEx.totalItems)[0].replace(/[\.,]/g, "")
    );
    console.log("total items", totalItems);
    // this.totalPages = Math.ceil(totalItems / itemsPerPage);
  };

  scrape = async (currentPage, country) => {
    const res = await fetch(baseUrl + "/" + country + query + currentPage).then(
      (res) => res.text()
    );
    const $ = cheerio.load(res);

    var tempItems = [];
    const cards = $(selectors.cards);
    cards.each((idx, ref) => {
      const $card = $(ref);
      const name = $card.find(selectors.name).text().trim();
      const link = `${baseUrl}${$card.attr("href")}`;
      const img = $card.find(selectors.img).data("src");
      const description = $card.find(selectors.description).text().trim();
      const lat = $card.data("lat");
      const lng = $card.data("lng");

      tempItems.push({
        name,
        description,
        link,
        lat,
        lng,
        img,
      });
    });

    uploadItemsToDb(tempItems);
    this.items = tempItems;

    // if (currentPage < this.totalPages) {
    //   return this.scrape(currentPage + 1);
    // }
    return;
  };
}

const getItems = async function () {
  const scraper = new AtlasObscuraScraper();

  // Scraping can be flaky. Attempt scraping multiple times
  for (let i = 0; i < 1; i++) {
    console.log("Scraping attempt:", i + 1);

    await scraper.run();
    console.log(`Found ${scraper.getItems().length} items`);

    // scraper.removeDuplicates();
    // console.log(
    //   `Duplicates removed, ${scraper.getItems().length} items remained`
    // );

    console.log("==========");
  }
  return scraper.getItems();
};

const uploadItemsToDb = (items) => {
  // create a new spot object for each restaurant
  // save each spot object to the db

  const spotDocs = items.map((item) => {
    return new Spot({
      title: item.name,
      description: item.description,
      specialty: 0,
      quality: 0,
      numberOfRatings: 0,
      avgTimeSpent: 0,
      location: {
        lat: item.lat,
        lng: item.lng,
      },
      cost: 0,
      mapLocation: {
        formatted_address: "",
        formatted_phone_number: "",
        geometry: {
          location: {
            lat: item.lat,
            lng: item.lng,
          },
        },
        place_id: "",
        types: [],
        rating: 0,
        user_ratings_total: 0,
        price_level: 0,
      },
      status: "Approved",
      sponsored: false,
      highlightedIn: [],
      feateredBy: ["AtlasObscura"],
      duration: 0,
      image: item.img,
      externalLink: item.link,
      openTimes: [],
    });
  });

  // console.log(`spots: ${spotDocs.length} ${spotDocs[0]}`);
  Spot.insertMany(spotDocs, function (error, docs) {});
};

module.exports = { AtlasObscuraScraper, getItems, uploadItemsToDb };
