const rp = require("request-promise");
const cheerio = require("cheerio");

const { timeout, countries } = require("./utils");

const baseUrl = "https://www.atlasobscura.com/things-to-do/";

const query = "/places?page=";

const itemsPerPage = 20;

const selectors = {
  cards: "A.Card",
  img: ".card__menu-image>a>noscript",
  name: ".card__menu-content--title>a",
  link: ".card__menu-content--title>a",
  type: ".card__menu-footer--price",
};

const regEx = {
  img: /(?<=src=").*(?=" alt)/,
  totalItems: /(?<=of ).*(?= Items)/,
};

class AtlasObscuraScraper {
  constructor() {
    this.rateLimiterDelay = 1500;
    this.items = [];
    this.totalPages = 1;
  }

  run = async () => {
    countries.map(async (country) => {
      await this.scrape(1, country);
    });
  };

  getItems = () => this.items;

  //   removeDuplicates = () => {
  //     this.items = this.items.filter(
  //       (r, index, self) =>
  //         index === self.findIndex((t) => JSON.stringify(t) === JSON.stringify(r))
  //     );
  //   };

  setTotalPages = ($) => {
    const totalItems = Number(
      $("h1").text().match(regEx.totalItems)[0].replace(/[\.,]/g, "")
    );
    console.log("total items", totalItems);
    // this.totalPages = Math.ceil(totalItems / itemsPerPage);
  };

  scrape = async (currentPage) => {
    const start = new Date();
    const options = {
      uri: baseUrl + country + query + "1",
      transform: (body) => {
        return cheerio.load(body);
      },
    };

    const $ = await rp(options).catch((err) => {
      delete err.response;
      console.log(err);
    });

    const cards = $(selectors.cards);
    cards.each((idx, ref) => {
      const $card = $(ref);
      //   const $title = $card.find(selectors.name);
      //   const name = $title.text().trim();
      //   const link = `${baseUrl}${$title.attr("href")}`;
      //   const img = $card.find(selectors.img).html().match(regEx.img)[0];
      //   const priceType = $card.find(selectors.type).text().trim();
      //   const price = priceType.indexOf("\n");
      //   const typeIndex = priceType.lastIndexOf("\n");
      //   const type = priceType.slice(typeIndex + 1).trim();
      const lat = $card.data("lat");
      const lng = $card.data("lng");

      console.log($card);
      console.log(lat);
      console.log(lng);

      //   this.items.push({
      //     name,
      //     link,
      //     price,
      //     type,
      //     img,
      //     lat,
      //     lng,
      //   });
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
  const scraper = new MichelinScraper();

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

  for (let i = 0; i < items.length; i++) {
    const item = items[i];
    const new_spot = new Spot({
      title: item.name,
      description: item.type,
      specialty: 0,
      quality: 0,
      numberOfRatings: 0,
      avgTimeSpent: 0,
      location: {
        lat: restaurant.lng,
        lng: restaurant.lat,
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
      duration: 0,
      image: restaurant.img,
      externalLink: restaurant.link,
      openTimes: [],
    });

    console.log(`spot: ${new_spot}`);
    new_spot.save(function (err, spot) {
      if (err) res.send(err);
      res.json(spot);
    });
  }
};

module.exports = { AtlasObscuraScraper, getItems, uploadItemsToDb };
