# Scrapers

This is the scrapers section of the backend.
All scrapers work by spinning up a connection to the Mongoose DB, performing iterative scraping, and performing interative inserts.
For coldstart, all spots are given an approved status, but in the future, it might be good to set the status to pending.

## Current scraped sites include:

- Atlas Obscura (has rate limiting)...
  - Pulling countries and writing to local files
  - Pulling countries list from local files and then scraping sites in each country
- Michelin Guide (does not have rate limiting)
  - Scraping restaurants only
- TicketMaster (via its API)
  - Scraping venues only

## Future add-ons may include:

- Alltrails
- Airbnb
- Eventbrite

## Future technical extensions include:

- Setting some scheduled execution to all scraping jobs
- Improved rate-limiting avoidance & elegant rescheduling of jobs that were paused
- Creating internal IDs via structured hashing of contents
- Removing duplicates spots using internal IDs

## To run a scraper, use a command like:

`node -e 'require("./scraperWrapper.js").runTicketMasterScraper()'`
from the `scrapers` directory
