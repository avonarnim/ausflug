"use strict";

var mongoose = require("mongoose");
const Trip = require("../models/tripModel");
const User = require("../models/userModel");

// want one function for getting set of stop suggestions: should use stop database
// should be passed route which includes points --> can query based on stops being certain distance from given point

// want one function to add a trip w/ data to trip database
// should be passed trip data (start/end/stops/stop data)
// id could be username + timestamp (NEED to be returned tripId for subsequent saving of id to user profile)
exports.create_trip = async function (req, res) {
  var newTrip = new Trip(req.body);
  newTrip = await newTrip.save();

  const user = await User.findOne({ _id: req.body.creatorId });

  user.savedTripIDs.push(newTrip._id);
  const update = { savedTripIDs: user.savedTripIDs };

  await User.findOneAndUpdate({ _id: req.body.creatorId }, update).catch(
    (err) => {
      res.send(err);
    }
  );

  res.json(newTrip);
};

// retrieve single trip with matching id
exports.view_trip = function (req, res) {
  Trip.findById(req.params.tripId, function (err, trip) {
    if (err) res.send(err);
    res.json(trip);
  });
};

exports.view_user_trips = function (req, res) {
  Trip.find({ creatorId: req.params.username }, function (err, trips) {
    if (err) res.send(err);
    res.json(trips);
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
      console.log("updated trip", trip);
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
