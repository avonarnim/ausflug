// Controllers for the gas model/table
// Functions include CRUD operations

"use strict";

const { auth } = require("../config/firebase");
var mongoose = require("mongoose");
const Gas = require("../models/gasModel");
const User = require("../models/userModel");

// retrieve all gas stations in an area
exports.get_gas_stations_in_area = async function (req, res) {
  Gas.find(
    {
      "mapLocation.geometry.location": {
        $geoWithin: {
          $box: [
            [req.params.latitude1, req.params.longitude1],
            [req.params.latitude2, req.params.longitude2],
          ],
        },
      },
    },
    function (err, stations) {
      if (err) res.send(err);
      for (let i = 0; i < stations.length; i++) {
        if (
          stations[i].resolved_prices.unleaded == 0 &&
          stations[i].prices.length > 0
        ) {
          stations[i].resolved_prices =
            stations[i].prices[stations[i].prices.length - 1];
        }
      }
      res.json(stations);
    }
  ).sort({ unleaded_prices: -1 });
};

// retrieve all gas stations in an area, and calculate the average price of gas
exports.avg_price_along_route = async function (req, res) {
  const stations = await Gas.find({
    "mapLocation.geometry.location": {
      $geoWithin: {
        $box: [
          [req.params.latitude1, req.params.longitude1],
          [req.params.latitude2, req.params.longitude2],
        ],
      },
    },
  });
  let avg_prices = stations.reduce(
    (acc, station) => {
      acc.unleaded += station.prices[station.prices.length - 1].unleaded ?? 0;
      acc.unleaded_count +=
        station.prices[station.prices.length - 1].unleaded > 0 ? 1 : 0;
      acc.midgrade += station.prices[station.prices.length - 1].midgrade ?? 0;
      acc.midgrade_count +=
        station.prices[station.prices.length - 1].midgrade > 0 ? 1 : 0;
      acc.premium += station.prices[station.prices.length - 1].premium ?? 0;
      acc.premium_count +=
        station.prices[station.prices.length - 1].premium > 0 ? 1 : 0;
      acc.diesel += station.prices[station.prices.length - 1].diesel ?? 0;
      acc.diesel_count +=
        station.prices[station.prices.length - 1].diesel > 0 ? 1 : 0;
      return acc;
    },
    {
      unleaded: 0,
      midgrade: 0,
      premium: 0,
      diesel: 0,
      unleaded_count: 0,
      midgrade_count: 0,
      premium_count: 0,
      diesel_count: 0,
    }
  );

  avg_prices.unleaded_count =
    avg_prices.unleaded_count === 0 ? 1 : avg_prices.unleaded_count;
  avg_prices.midgrade_count =
    avg_prices.midgrade_count === 0 ? 1 : avg_prices.midgrade_count;
  avg_prices.premium_count =
    avg_prices.premium_count === 0 ? 1 : avg_prices.premium_count;
  avg_prices.diesel_count =
    avg_prices.diesel_count === 0 ? 1 : avg_prices.diesel_count;

  avg_prices.unleaded /= avg_prices.unleaded_count;
  avg_prices.midgrade /= avg_prices.midgrade_count;
  avg_prices.premium /= avg_prices.premium_count;
  avg_prices.diesel /= avg_prices.diesel_count;

  res.json({
    unleaded: Math.round(avg_prices.unleaded * 100) / 100,
    midgrade: Math.round(avg_prices.midgrade * 100) / 100,
    premium: Math.round(avg_prices.premium * 100) / 100,
    diesel: Math.round(avg_prices.diesel * 100) / 100,
  });
};

exports.add_gas_prices = async function (req, res) {
  const { _id, unleaded, midgrade, premium, diesel, rating, userId } = req.body;
  const gas = await Gas.findById(_id);
  const date = new Date();
  gas.prices.push({
    unleaded,
    midgrade,
    premium,
    diesel,
    date,
    userId,
  });
  gas.ratings.push({ userId, rating });
  gas.rating =
    (gas.rating * gas.number_of_ratings + rating) / (gas.number_of_ratings + 1);
  gas.number_of_ratings += 1;
  gas.save();

  try {
    await User.findOneAndUpdate({ _id: userId }, { $inc: { points: 1 } });
  } catch (err) {
    res.send(err);
  }

  res.json(gas);
};

exports.add_gas_station = async function (req, res) {
  delete req.body._id;

  var new_station = new Gas(req.body);

  new_station.save(function (err, station) {
    if (err) res.send(err);
    res.json(station);
  });
};

exports.get_gas_station = async function (req, res) {
  const gas = await Gas.findById(req.params.id);
  // set resolved_price to average of the last 3 prices
  gas.resolved_prices = gas.prices
    .slice(Math.max(gas.prices.length - 3, 0))
    .reduce(
      (acc, priceObj) => {
        acc.unleaded += priceObj.unleaded;
        acc.midgrade += priceObj.midgrade;
        acc.premium += priceObj.premium;
        acc.diesel += priceObj.diesel;
        return acc;
      },
      { unleaded: 0, midgrade: 0, premium: 0, diesel: 0 }
    );
  gas.resolved_prices.unleaded /= Math.min(gas.prices.length, 3);
  gas.resolved_prices.midgrade /= Math.min(gas.prices.length, 3);
  gas.resolved_prices.premium /= Math.min(gas.prices.length, 3);
  gas.resolved_prices.diesel /= Math.min(gas.prices.length, 3);
  gas.save();
  res.json(gas);
};
