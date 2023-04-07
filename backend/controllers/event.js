"use strict";
const Spot = require("../models/spotModel");
const Event = require("../models/eventModel");
require("dotenv").config();

exports.search_events_box_time = function (req, res) {
  Spot.find(
    {
      location: {
        $geoWithin: {
          $box: [
            [req.params.latitude1, req.params.longitude1],
            [req.params.latitude2, req.params.longitude2],
          ],
        },
      },
      externalIds: { $exists: true, $ne: [] },
    },
    async function (err, venues) {
      if (err) res.send(err);
      // filter out spots that do not have ticketmaster events externalId
      // get all events from ticketmaster for venue within time range
      // return events

      venues.filter((venue) => {
        return venue.externalIds.some((externalId) => {
          return externalId.source === "TicketMaster";
        });
      });

      let events = [];

      for (let i = 0; i < venues.length; i++) {
        let venue = venues[i];

        let externalId = venue.externalIds.find((externalId) => {
          return externalId.source === "TicketMaster";
        });

        // get events from ticketmaster
        // add events to events array
        const res = await fetch(
          `https://app.ticketmaster.com/discovery/v2/events.json?size=50&venueId=${externalId.id}&startDateTime=${req.params.startDate}&endDateTime=${req.params.endDate}&apikey=${process.env.TICKETMASTER_API_KEY}`
        ).then((res) => res.text());

        const jsonRes = JSON.parse(res);

        if (!jsonRes._embedded) {
          console.log("no events", venue.title);
          continue;
        }

        jsonRes._embedded.events.map((event) => {
          events.push({
            title: event.name,
            description: event.description ?? "",
            externalLink: event.url,
            image: event.images[0].url ?? "",
            spot_id: venue._id,
            place_id: venue.place_id,
            location: venue.location,
            externalIds: [{ source: "ticketmaster", id: event.id }],
            sponsored: false,
            status: event.dates.status.code,
            startDate: event.dates.start.localDate,
            endDate: event.dates.end?.localDate ?? event.dates.start,
          });
        });
      }

      // eventually, want to save events to DB regularly
      res.json(events);
    }
  );
};
