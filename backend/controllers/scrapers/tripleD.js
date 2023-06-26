const rp = require("request-promise");
const cheerio = require("cheerio");
const Spot = require("../../models/spotModel");
require("dotenv").config();

const { timeout } = require("./utils");

const baseUrl =
  "https://www.foodnetwork.com/restaurants/shows/diners-drive-ins-and-dives/a-z/";

const query = "p/";

const itemsPerPage = 15;

class TripleDScraper {
  constructor() {
    this.rateLimiterDelay = 1500;
    this.restaurants = [];
    this.totalPages = 1;
  }

  run = async () => {
    await this.scrape(1);
  };

  getRestaurants = () => this.restaurants;

  removeDuplicates = () => {
    this.restaurants = this.restaurants.filter(
      (r, index, self) =>
        index === self.findIndex((t) => JSON.stringify(t) === JSON.stringify(r))
    );
  };

  setTotalPages = ($) => {
    const numberText = $(".o-SearchStatistics__a-MaxPage")
      .find("strong")
      .text();
    const number = parseInt(numberText.replace(/,/g, ""));

    this.totalPages = Math.ceil(number / itemsPerPage);
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
    console.log("on page", currentPage, "of", this.totalPages, "pages");
    const cards = $(".l-List > .m-MediaBlock");

    cards.slice(0, cards.length - 2).each(async (index, card) => {
      const $card = $(card);

      const name = $card.find(".m-MediaBlock__a-HeadlineText").text().trim();
      const address = $card.find(".m-Info__a-Address").text().trim();
      const description = $card
        .find(".m-MediaBlock__a-Description")
        .text()
        .trim();
      const detailsLink = $card
        .find(".m-MediaBlock__a-Headline > a")
        .attr("href");
      const imageUrl = $card.find(".m-MediaBlock__m-Image > img").attr("src");

      try {
        const response = await fetch(
          "https://maps.googleapis.com/maps/api/place/findplacefromtext/json" +
            `?key=${process.env.GOOGLE_PLACES_API_KEY}` +
            `&input=${encodeURIComponent(name + " " + address)}` +
            "&inputtype=textquery" +
            "&fields=place_id,formatted_address,geometry,rating,business_status"
        );

        if (response.ok) {
          const { candidates } = await response.json();
          if (candidates.length > 0) {
            const place = candidates[0];
            const placeId = place.place_id;
            const location = place.geometry.location;
            const placeRating = place.rating;
            const businessStatus = place.business_status;

            if (
              businessStatus !== "CLOSED_PERMANENTLY" &&
              placeRating &&
              placeRating > 4
            ) {
              const restaurant = {
                name,
                address,
                description,
                placeId,
                location,
                detailsLink,
                imageUrl,
              };

              this.restaurants.push(restaurant);
            }
          }
        }
      } catch (error) {}
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
  const scraper = new TripleDScraper();

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
      description: "Restaurant featured by Drive-ins Diners and Dives.",
      category: "Dining",
      specialty: 0,
      quality: 0,
      popularity: 0,
      numberOfRatings: 0,
      avgTimeSpent: 2,
      location: {
        lat: restaurant.location.lat,
        lng: restaurant.location.lng,
      },
      cost: 0,
      mapLocation: {
        formatted_address: restaurant.address,
        formatted_phone_number: "",
        geometry: {
          location: {
            lat: restaurant.location.lat,
            lng: restaurant.location.lng,
          },
        },
        place_id: restaurant.placeId,
        types: [],
        rating: 0,
        user_ratings_total: 0,
        price_level: 0,
      },
      sponsored: false,
      highlightedIn: [],
      featuredBy: ["DriveInsDinersAndDives"],
      duration: 0,
      status: "Approved",
      externalLink: restaurant.detailsLink,
      externalIds: [],
      images: [restaurant.imageUrl],
      reviews: [],
      openTimes: [],
      activities: [],
      features: [],
    });

    new_spot.save(function (err, spot) {
      if (err) console.log("had an error", err);
    });
  }
};

const deleteRestaurantsFromDb = async () => {
  await Spot.deleteMany({ externalLink: /foodnetwork/ });
};

module.exports = {
  TripleDScraper,
  getItems,
  uploadRestaurantsToDb,
  deleteRestaurantsFromDb,
};
