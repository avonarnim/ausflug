"use strict";

var mongoose = require("mongoose");
const Trip = require("../models/tripModel");

// retrieve list of trips for user
exports.list_all_trips = function (req, res) {
  Trip.find(
    {
      username: req.params.userId,
    },
    function (err, spot) {
      if (err) res.send(err);
      res.json(spot);
    }
  );
};

// want one function for getting set of stop suggestions: should use stop database
// should be passed route which includes points --> can query based on stops being certain distance from given point

// want one function to add a trip w/ data to trip database
// should be passed trip data (start/end/stops/stop data)
// id could be username + timestamp (NEED to be returned tripId for subsequent saving of id to user profile)
exports.create_trip = function (req, res) {
  var new_trip = new Trip(req.body);
  new_trip.save(function (err, trip) {
    if (err) res.send(err);
    res.json(trip);
  });
};

// retrieve single trip with matching id
exports.view_trip = function (req, res) {
  Trip.findById(req.params.tripId, function (err, trip) {
    if (err) res.send(err);
    res.json(trip);
  });
};

// update trip's data (confirmed stops, completed, etc)
// may need to change how i do confirmed stops...
exports.update_trip = function (req, res) {
  Trip.findOneAndUpdate(
    { _id: req.params.tripId },
    req.body,
    { new: true, upsert: true },
    function (err, trip) {
      if (err) res.send(err);
      res.json(trip);
    }
  );
};

// remove spot from database
exports.delete_trip = function (req, res) {
  Trip.deleteOne(
    {
      _id: req.params.tripId,
    },
    function (err, trip) {
      if (err) res.send(err);
      res.json({ message: "Trip successfully deleted" });
    }
  );
};
