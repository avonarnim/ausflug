const rp = require("request-promise");
const cheerio = require("cheerio");
const Spot = require("../../../models/spotModel");

const { timeout } = require("../utils");

const baseUrl = "https://www.alltrails.com/directory/countries/";

const itemsPerPage = 20;

const selectors = {
  ul: ".directory-content",
  lis: ".directory-content>li",
  link: "a",
  // img: ".card__menu-image>a",
  // name: ".card__menu-content--title>a",
  // link: ".card__menu-content--title>a",
  // type: ".card__menu-footer--price",
};

const regEx = {
  img: /(?<=src=").*(?=" alt)/,
  totalItems: /(?<=of ).*(?= Trails)/,
};

class AllTrailsScraper {
  constructor() {
    this.rateLimiterDelay = 1500;
    this.trails = [];
    this.totalPages = 1;
  }

  run = async () => {
    await this.scrape(1);
    // await this.scrapeAndUpload(1);
  };

  getTrails = () => this.trails;

  removeDuplicates = () => {
    this.trails = this.trails.filter(
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
      uri: baseUrl,
      transform: (body) => {
        return cheerio.load(body);
      },
    };

    const $ = await rp(options).catch((err) => {
      delete err.response;
      console.log(err);
    });

    // if (this.totalPages === 1) {
    //   this.setTotalPages($);
    // }

    const links = $(selectors.lis);
    links.each((idx, ref) => {
      const $link = $(ref);
      const $res = $link.find(selectors.link);
      // const name = $title.text().trim();
      // const link = `${baseUrl}${$title.attr("href")}`;
      // const img = $card.find(selectors.img).html().match(regEx.img)[0];
      // const img = $card.find(selectors.img)[0].attribs["ci-bg-url"];
      // const priceType = $card.find(selectors.type).text().trim();
      // const price = priceType.indexOf("\n");
      // const typeIndex = priceType.lastIndexOf("\n");
      // const type = priceType.slice(typeIndex + 1).trim();
      // const lat = $card.data("lat");
      // const lng = $card.data("lng");

      console.log($res);
      // this.trails.push({
      //   name,
      //   link,
      //   price,
      //   type,
      //   img,
      //   lat,
      //   lng,
      // });
    });

    const end = new Date();
    const delay = this.rateLimiterDelay - (end - start);
    await timeout(delay);

    if (currentPage < this.totalPages) {
      return this.scrape(currentPage + 1);
    }
    return;
  };

  //   scrapeAndUpload = async (currentPage) => {
  //     console.log("processing page " + currentPage);
  //     const start = new Date();
  //     const options = {
  //       uri: baseUrl + currentPage,
  //       transform: (body) => {
  //         return cheerio.load(body);
  //       },
  //     };

  //     const $ = await rp(options).catch((err) => {
  //       delete err.response;
  //       console.log(err);
  //     });

  //     if (this.totalPages === 1) {
  //       this.setTotalPages($);
  //     }

  //     const cards = $(selectors.cards);
  //     var pageTrails = [];
  //     cards.each((idx, ref) => {
  //       const $card = $(ref);
  //       // console.log($card);
  //       const $title = $card.find(selectors.name);
  //       const name = $title.text().trim();
  //       const link = `${baseUrl}${$title.attr("href")}`;
  //       // const img = $card.find(selectors.img).html().match(regEx.img)[0];
  //       const img = $card.find(selectors.img)[0].attribs["ci-bg-url"];
  //       const priceType = $card.find(selectors.type).text().trim();
  //       const price = priceType.indexOf("\n");
  //       const typeIndex = priceType.lastIndexOf("\n");
  //       const type = priceType.slice(typeIndex + 1).trim();
  //       const lat = $card.data("lat");
  //       const lng = $card.data("lng");

  //       pageTrails.push({
  //         name,
  //         link,
  //         price,
  //         type,
  //         img,
  //         lat,
  //         lng,
  //       });
  //     });

  //     const end = new Date();
  //     const delay = this.rateLimiterDelay - (end - start);
  //     await timeout(delay);

  //     uploadTrailsToDb(pageTrails);

  //     if (currentPage < this.totalPages) {
  //       return this.scrapeAndUpload(currentPage + 1);
  //     }
  //     return;
  //   };
}

const getItems = async function () {
  const scraper = new AllTrailsScraper();

  // Scraping can be flaky. Attempt scraping multiple times
  for (let i = 0; i < 1; i++) {
    console.log("Scraping attempt:", i + 1);

    await scraper.run();
    console.log(`Found ${scraper.getTrails().length} trails`);

    scraper.removeDuplicates();
    console.log(
      `Duplicates removed, ${scraper.getTrails().length} trails remained`
    );

    console.log("==========");
  }
  return scraper.getTrails();
};

// const uploadTrailsToDb = (trails) => {
//   // create a new spot object for each trail
//   // save each spot object to the db

//   for (let i = 0; i < trails.length; i++) {
//     const trail = trails[i];
//     const new_spot = new Spot({
//       title: trail.name,
//       description: trail.type,
//       specialty: 0,
//       quality: 0,
//       numberOfRatings: 0,
//       avgTimeSpent: 0,
//       location: {
//         lat: trail.lat,
//         lng: trail.lng,
//       },
//       cost: trail.price,
//       mapLocation: {
//         formatted_address: "",
//         formatted_phone_number: "",
//         geometry: {
//           location: {
//             lat: trail.lat,
//             lng: trail.lng,
//           },
//         },
//         place_id: "",
//         types: [],
//         rating: 0,
//         user_ratings_total: 0,
//         price_level: trail.price,
//       },
//       status: "Approved",
//       sponsored: false,
//       highlightedIn: [],
//       featuredBy: ["MichelinTrails"],
//       duration: 0,
//       image: trail.img,
//       externalIds: [],
//       externalLink: trail.link,
//       openTimes: [],
//     });

//     new_spot.save(function (err, spot) {
//       if (err) console.log("had an error", err);
//     });
//   }
// };

module.exports = {
  AllTrailsScraper,
  getItems,
  // uploadTrailsToDb,
};
