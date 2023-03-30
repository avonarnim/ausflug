const rp = require("request-promise");
const cheerio = require("cheerio");
const Spot = require("../../models/spotModel");

const { timeout } = require("./utils");

const baseUrl = "https://guide.michelin.com/";

const query = "en/restaurants/page/";

const itemsPerPage = 20;

const selectors = {
  cards: ".card__menu",
  img: ".card__menu-image>a",
  name: ".card__menu-content--title>a",
  link: ".card__menu-content--title>a",
  type: ".card__menu-footer--price",
};

const regEx = {
  img: /(?<=src=").*(?=" alt)/,
  totalItems: /(?<=of ).*(?= Restaurants)/,
};

class MichelinScraper {
  constructor() {
    this.rateLimiterDelay = 1500;
    this.restaurants = [];
    this.totalPages = 1;
  }

  run = async () => {
    // await this.scrape(1);
    await this.scrapeAndUpload(1);
  };

  getRestaurants = () => this.restaurants;

  removeDuplicates = () => {
    this.restaurants = this.restaurants.filter(
      (r, index, self) =>
        index === self.findIndex((t) => JSON.stringify(t) === JSON.stringify(r))
    );
  };

  setTotalPages = ($) => {
    const totalItems = Number(
      $("h1").text().match(regEx.totalItems)[0].replace(/[\.,]/g, "")
    );
    this.totalPages = Math.ceil(totalItems / itemsPerPage);
  };

  scrape = async (currentPage) => {
    const start = new Date();
    const options = {
      uri: baseUrl + query + currentPage,
      transform: (body) => {
        return cheerio.load(body);
      },
    };

    const $ = await rp(options).catch((err) => {
      delete err.response;
      console.log(err);
    });

    if (this.totalPages === 1) {
      this.setTotalPages($);
    }

    const cards = $(selectors.cards);
    cards.each((idx, ref) => {
      const $card = $(ref);
      const $title = $card.find(selectors.name);
      const name = $title.text().trim();
      const link = `${baseUrl}${$title.attr("href")}`;
      // const img = $card.find(selectors.img).html().match(regEx.img)[0];
      const img = $card.find(selectors.img)[0].attribs["ci-bg-url"];
      const priceType = $card.find(selectors.type).text().trim();
      const price = priceType.indexOf("\n");
      const typeIndex = priceType.lastIndexOf("\n");
      const type = priceType.slice(typeIndex + 1).trim();
      const lat = $card.data("lat");
      const lng = $card.data("lng");

      this.restaurants.push({
        name,
        link,
        price,
        type,
        img,
        lat,
        lng,
      });
    });

    const end = new Date();
    const delay = this.rateLimiterDelay - (end - start);
    await timeout(delay);

    if (currentPage < this.totalPages) {
      return this.scrape(currentPage + 1);
    }
    return;
  };

  scrapeAndUpload = async (currentPage) => {
    console.log("processing page " + currentPage);
    const start = new Date();
    const options = {
      uri: baseUrl + query + currentPage,
      transform: (body) => {
        return cheerio.load(body);
      },
    };

    const $ = await rp(options).catch((err) => {
      delete err.response;
      console.log(err);
    });

    if (this.totalPages === 1) {
      this.setTotalPages($);
    }

    const cards = $(selectors.cards);
    var pageRestaurants = [];
    cards.each((idx, ref) => {
      const $card = $(ref);
      // console.log($card);
      const $title = $card.find(selectors.name);
      const name = $title.text().trim();
      const link = `${baseUrl}${$title.attr("href")}`;
      // const img = $card.find(selectors.img).html().match(regEx.img)[0];
      const img = $card.find(selectors.img)[0].attribs["ci-bg-url"];
      const priceType = $card.find(selectors.type).text().trim();
      const price = priceType.indexOf("\n");
      const typeIndex = priceType.lastIndexOf("\n");
      const type = priceType.slice(typeIndex + 1).trim();
      const lat = $card.data("lat");
      const lng = $card.data("lng");

      pageRestaurants.push({
        name,
        link,
        price,
        type,
        img,
        lat,
        lng,
      });
    });

    const end = new Date();
    const delay = this.rateLimiterDelay - (end - start);
    await timeout(delay);

    uploadRestaurantsToDb(pageRestaurants);

    if (currentPage < this.totalPages) {
      return this.scrapeAndUpload(currentPage + 1);
    }
    return;
  };
}

const getItems = async function () {
  const scraper = new MichelinScraper();

  // Scraping can be flaky. Attempt scraping multiple times
  for (let i = 0; i < 1; i++) {
    console.log("Scraping attempt:", i + 1);

    await scraper.run();
    console.log(`Found ${scraper.getRestaurants().length} restaurants`);

    scraper.removeDuplicates();
    console.log(
      `Duplicates removed, ${
        scraper.getRestaurants().length
      } restaurants remained`
    );

    console.log("==========");
  }
  return scraper.getRestaurants();
};

const uploadRestaurantsToDb = (restaurants) => {
  // create a new spot object for each restaurant
  // save each spot object to the db

  for (let i = 0; i < restaurants.length; i++) {
    const restaurant = restaurants[i];
    const new_spot = new Spot({
      title: restaurant.name,
      description: restaurant.type,
      specialty: 0,
      quality: 0,
      numberOfRatings: 0,
      avgTimeSpent: 0,
      location: {
        lat: restaurant.lat,
        lng: restaurant.lng,
      },
      cost: restaurant.price,
      mapLocation: {
        formatted_address: "",
        formatted_phone_number: "",
        geometry: {
          location: {
            lat: restaurant.lat,
            lng: restaurant.lng,
          },
        },
        place_id: "",
        types: [],
        rating: 0,
        user_ratings_total: 0,
        price_level: restaurant.price,
      },
      status: "Approved",
      sponsored: false,
      highlightedIn: [],
      featuredBy: ["MichelinRestaurants"],
      duration: 0,
      image: restaurant.img,
      externalLink: restaurant.link,
      openTimes: [],
    });

    new_spot.save(function (err, spot) {
      if (err) console.log("had an error", err);
    });
  }
};

const deleteRestaurantsFromDb = async () => {
  await Spot.deleteMany({ externalLink: /michelin/i });
};

module.exports = {
  MichelinScraper,
  getItems,
  uploadRestaurantsToDb,
  deleteRestaurantsFromDb,
};
