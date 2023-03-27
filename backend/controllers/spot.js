"use strict";

var mongoose = require("mongoose");
const Spot = require("../models/spotModel");

// retrieve list of spots with matching criteria
// applies to any spots
exports.search_spots = function (req, res) {
  Spot.find(req.body, function (err, spot) {
    if (err) res.send(err);
    res.json(spot);
  });
};

exports.search_spots_in_area = function (req, res) {
  Spot.find(
    {
      location: {
        $geoWithin: {
          $center: [[req.params.latitude, req.params.longitude], 1.0],
        },
      },
    },
    function (err, spot) {
      if (err) res.send(err);
      console.log(
        spot.length,
        "spots found around",
        req.params.latitude,
        req.params.longitude
      );
      res.json(spot);
    }
  ).limit(10);
};

exports.search_spots_by_bounding_box = function (req, res) {
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
    },
    function (err, spot) {
      if (err) res.send(err);
      console.log(
        spot.length,
        "spots found around",
        req.params.latitude1,
        req.params.longitude1,
        req.params.latitude2,
        req.params.longitude2
      );
      res.json(spot);
    }
  );
};

// retrieve all spots that are highlighted
exports.search_spots_highlighted = function (req, res) {
  Spot.find(
    {
      highlightedIn: { $exists: true, $ne: [] },
    },
    function (err, spot) {
      if (err) res.send(err);
      console.log(spot.length, "highlighted");
      res.json(spot);
    }
  ).limit(10);
};

// retrieve list of spots that are highlighted in a specific subject
exports.search_spots_highlighted_for_subject = function (req, res) {
  Spot.find(
    {
      highlightedIn: req.params.subject,
    },
    function (err, spot) {
      if (err) res.send(err);
      console.log(spot.length, "highlighted for", req.params.subject);
      res.json(spot);
    }
  ).limit(10);
};

// retrieve list of spots that are featured by a specific source
exports.search_spots_by_source = function (req, res) {
  Spot.find(
    {
      featuredBy: req.params.source,
    },
    function (err, spot) {
      if (err) res.send(err);
      console.log(spot.length, "featured by", req.params.source);
      res.json(spot);
    }
  ).limit(10);
};

// add spot
exports.insert_spot = function (req, res) {
  delete req.body._id;
  console.log(req.body);
  var new_spot = new Spot(req.body);

  new_spot.save(function (err, spot) {
    if (err) res.send(err);
    res.json(spot);
  });
};

// either hide or approve spot
exports.update_spot = async function (req, res) {
  try {
    const update = {
      status: req.body.status,
    };
    Spot.findOneAndUpdate(
      { _id: req.params.spotId },
      update,
      function (err, resp) {
        if (err) res.send(err);
        res.send("Successfully updated status to " + req.body.status);
      }
    );
  } catch (err) {
    res.send(err);
  }
};

// retrieve single spot with matching id
exports.view_spot = function (req, res) {
  Spot.findById(req.params.spotId, function (err, spot) {
    if (err) res.send(err);
    res.json(spot);
  });
};

// update spot's rating
// need to first retrieve spot, then average-in new rating & update rating count
exports.rate_spot = async function (req, res) {
  try {
    const spot = await Spot.findById(req.body.spotId);

    const new_numberOfRatings = spot.numberOfRatings + 1;
    const specialty =
      (spot.specialty * spot.numberOfRatings + req.body.specialty) /
      new_numberOfRatings;
    const quality =
      (spot.quality * spot.numberOfRatings + req.body.quality) /
      new_numberOfRatings;
    const update = {
      quality: quality,
      specialty: specialty,
      numberOfRatings: new_numberOfRatings,
    };

    Spot.findOneAndUpdate(req.body.spotId, update, function (err, resp) {
      if (err) res.send(err);
      res.send("Successfully updated rating");
    });
  } catch (err) {
    res.send(err);
  }
};

// remove spot from database
exports.delete_spot = function (req, res) {
  Spot.deleteOne(
    {
      _id: req.body.spotId,
    },
    function (err, spot) {
      if (err) res.send(err);
      res.json({ message: "Spot successfully deleted" });
    }
  );
};
