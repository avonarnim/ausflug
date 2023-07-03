// Controllers for the gas model/table
// Functions include CRUD operations

"use strict";

const { auth } = require("../config/firebase");
var mongoose = require("mongoose");
const Gas = require("../models/gasModel");

// retrieve all gas stations in an area
exports.get_gas_stations_in_area = async function (req, res) {
  console.log("in here 2");
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
    function (err, spot) {
      if (err) res.send(err);
      res.json(spot);
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
  const avg_prices =
    stations.reduce(
      (acc, station) => {
        acc.unleaded += station.prices[station.prices.length - 1].unleaded;
        acc.midgrade += station.prices[station.prices.length - 1].midgrade;
        acc.premium += station.prices[station.prices.length - 1].premium;
        acc.diesel += station.prices[station.prices.length - 1].diesel;
        return acc;
      },
      { unleaded: 0, midgrade: 0, premium: 0, diesel: 0 }
    ) / stations.length;

  res.json(avg_prices);
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
  res.json(gas);
};

exports.add_gas_station = async function (req, res) {
  const { name, rating, mapLocation, userId } = req.body;

  var new_station = new Gas({
    ...req.body,
    rating: 0,
    number_of_ratings: 0,
    ratings: [],
  });
  new_station.save(function (err, post) {
    if (err) res.send(err);
    res.json(post);
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
