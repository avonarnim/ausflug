"use strict";

var mongoose = require("mongoose");
const Trip = require("../models/tripModel");
const User = require("../models/userModel");
const Spot = require("../models/spotModel");
const AdminMetrics = require("../models/adminMetricsModel");

// want to pull the latest admin metrics and refresh them with new data
// new data includes newly completed trips, number of queued spots, and new users
exports.get_metrics = async function (req, res) {
  try {
    const mostRecentMetrics = await AdminMetrics.find()
      .sort({ updatedAt: -1 })
      .limit(1);
    const mostRecentTime = mostRecentMetrics.updatedAt ?? new Date(0);

    console.log(mostRecentTime);
    const recentCompletedTrips = await Trip.find({
      completedAt: { $gt: mostRecentTime },
    });

    const recentDistance = recentCompletedTrips
      ? recentCompletedTrips.reduce((acc, cur) => {
          if (cur.distance) {
            return acc + cur.distance;
          } else {
            return acc;
          }
        }, 0)
      : 0;

    const mostPopularOrigins = await Trip.aggregate([
      {
        $match: {
          // updatedAt: { $gt: mostRecentTime },
        },
      },
      {
        $group: {
          _id: "$originVal",
          count: { $sum: 1 },
        },
      },
      { $sort: { count: -1 } },
      { $limit: 3 },
    ]);

    const mostPopularDestinations = await Trip.aggregate([
      {
        $match: {
          // updatedAt: { $gt: mostRecentTime },
        },
      },
      {
        $group: {
          _id: "$destinationVal",
          count: { $sum: 1 },
        },
      },
      { $sort: { count: -1 } },
      { $limit: 3 },
    ]);

    const users = User.find().length;
    const numQueuedSpots = Spot.find({ status: "pending" }).length;

    const update = {
      numUsers: users,
      completedMiles: (mostRecentMetrics.completedMiles ?? 0) + recentDistance,
      numQueuedSpots: numQueuedSpots,
      mostPopularOrigins: mostPopularOrigins,
      mostPopularDestinations: mostPopularDestinations,
      updatedAt: Date.now(),
    };

    var new_metrics = new AdminMetrics(update);

    new_metrics = await new_metrics
      .save()
      .then(() => {
        res.json(update);
      })
      .catch((err) => err);

    throw new_metrics;
  } catch (err) {
    console.log(err);
    res.send(err);
  }
};

exports.get_metrics_past_n_days = async function (req, res) {
  console.log(`getting past ${req.params.days} days' metrics`, req.body);
  try {
    const windowTime = new Date(
      new Date().getTime() - req.params.days * 24 * 60 * 60 * 1000
    );

    const completedTrips = await Trip.find({
      completedAt: { $gt: windowTime },
    });

    const recentDistance = completedTrips
      ? completedTrips.reduce((acc, cur) => {
          if (cur.distance) {
            return acc + cur.distance;
          } else {
            return acc;
          }
        }, 0)
      : 0;

    const popularOrigins = await Trip.aggregate([
      {
        $match: {
          updatedAt: { $gt: completedTrips },
        },
      },
      {
        $group: {
          _id: "$originVal",
          count: { $sum: 1 },
        },
      },
      { $sort: { count: -1 } },
      { $limit: 3 },
    ]);

    const popularDestinations = await Trip.aggregate([
      {
        $match: {
          updatedAt: { $gt: mostRecentTime },
        },
      },
      {
        $group: {
          _id: "$destinationVal",
          count: { $sum: 1 },
        },
      },
      { $sort: { count: -1 } },
      { $limit: 3 },
    ]);

    const recentCreatedUsers = User.find({
      createdAt: { $gt: windowTime },
    }).length;

    const numQueuedSpots = Spot.find({ status: "pending" }).length;

    const summary = {
      numUsers: recentCreatedUsers,
      completedMiles: recentDistance,
      numQueuedSpots: numQueuedSpots,
      mostPopularOrigins: popularOrigins,
      mostPopularDestinations: popularDestinations,
      updatedAt: Date.now(),
    };

    res.json(update);

    throw new_metrics;
  } catch (err) {
    console.log(err);
    res.send(err);
  }
};
