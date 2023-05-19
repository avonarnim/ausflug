"use strict";

var mongoose = require("mongoose");
const Trip = require("../models/tripModel");
const User = require("../models/userModel");
const Spot = require("../models/spotModel");
const AdminMetrics = require("../models/adminMetricsModel");

// want to pull the latest admin metrics and refresh them with new data
// new data includes newly completed trips, number of queued spots, and new users
exports.refresh_metrics = async function (req, res) {
  console.log("refreshing metrics", req.body);
  try {
    const mostRecentMetrics = await AdminMetrics.find()
      .sort({ updatedAt: -1 })
      .limit(1);
    const mostRecentTime = mostRecentMetrics.updatedAt ?? new Date(0);

    console.log(mostRecentTime);
    const recentCompletedTrips = await Trip.find({
      completedAt: { $gt: mostRecentTime },
    });

    console.log("recent compelted trips", recentCompletedTrips);

    const recentDistance = recentCompletedTrips
      ? recentCompletedTrips.reduce((acc, cur) => {
          if (cur.distance) {
            return acc + cur.distance;
          } else {
            return acc;
          }
        }, 0)
      : 0;
    // const recentDuration = recentCompletedTrips.reduce(
    //   (acc, cur) => acc + cur.duration,
    //   0
    // );

    const mostPopularOrigins = await Trip.aggregate([
      {
        $match: {
          updatedAt: { $gt: mostRecentTime },
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
    console.log(mostPopularOrigins);

    const mostPopularDestinations = await Trip.aggregate([
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

    console.log(mostPopularDestinations);

    const recentCreatedUsers = User.find({
      createdAt: { $gt: mostRecentTime },
    }).length;
    const numQueuedSpots = Spot.find({ status: "pending" }).length;

    const update = {
      numNewUsers: recentCreatedUsers,
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

exports.get_metrics = async function (req, res) {
  console.log("retrieving metrics", req.body);
  try {
    const mostRecentMetrics = AdminMetrics.find()
      .sort({ updatedAt: -1 })
      .limit(1);
    res.json(mostRecentMetrics);
  } catch (err) {
    res.send(err);
  }
};
