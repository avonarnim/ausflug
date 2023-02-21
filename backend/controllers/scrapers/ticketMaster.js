const { timeout, countries } = require("./utils");
const fs = require("fs");

class TicketMasterClient {
  constructor() {
    this.events = [];
    this.currentPage = 0;
    this.numPages = 49;
    this.rateLimiterDelay = 1500;
  }

  run = async () => {
    await this.scrape();
  };

  getItems = () => this.events;

  scrape = async () => {
    if (this.currentPage === this.numPages) {
      return;
    }

    const start = new Date();

    const res = await fetch(
      `https://app.ticketmaster.com/discovery/v2/venues.json?page=${this.currentPage}&apikey=CNskcGRwUJESaCecxA3A1EypdHsAicqc`
    ).then((res) => res.text());

    console.log(res);

    const jsonRes = JSON.parse(res);

    // NOTE: right now, the API only returns top 1000 results... meaning max pages for this query is 50
    // Could convert to a different API call to get more results, but this is fine for now

    // if (this.numPages === 1) {
    //   this.numPages = jsonRes.page.totalPages;
    //   this.numPages = 100;
    // }

    console.log("Page", this.currentPage, "of", this.numPages);
    this.currentPage += 1;

    jsonRes._embedded.venues.map((venue) => {
      this.events.push({
        name: venue.name,
        description:
          venue.type + " with " + venue.upcomingEvents._total + " events.",
        link: venue.url,
        img: venue.images ? venue.images[0].url : "",
        lat: venue.location.latitude,
        lng: venue.location.longitude,
      });
    });

    const end = new Date();
    const delay = this.rateLimiterDelay - (end - start);
    await timeout(delay);

    return this.scrape();
  };
}

const getItems = async function () {
  const client = new TicketMasterClient();

  // Scraping can be flaky. Attempt scraping multiple times
  for (let i = 0; i < 1; i++) {
    console.log("Scraping attempt:", i + 1);

    await client.run();
    console.log(`Found ${client.getItems().length} items`);

    // scraper.removeDuplicates();
    // console.log(
    //   `Duplicates removed, ${scraper.getItems().length} items remained`
    // );

    console.log("==========");
  }
  return client.getItems();
};

const uploadItemsToDb = (items) => {
  // create a new spot object for each venue
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
      duration: 0,
      image: item.img,
      externalLink: item.link,
      openTimes: [],
    });
  });

  console.log(`spots: ${spotDocs.length} ${spotDocs[0]}`);
  Spot.insertMany(spotDocs, function (error, docs) {});
};

module.exports = { TicketMasterClient, getItems, uploadItemsToDb };
