"use strict";

var mongoose = require("mongoose");
const Spot = require("../models/spotModel");
const User = require("../models/userModel");

// retrieve list of spots with matching criteria
// applies to any spots
exports.search_spots = function (req, res) {
  Spot.find(req.body, function (err, spot) {
    if (err) res.send(err);
    res.json(spot);
  });
};

exports.search_spots_assemblage = async function (req, res) {
  const { locations, subjects, sources } = req.body;
  let results = {
    locations: [],
    subjects: [],
    sources: [],
  };

  for (let i = 0; i < locations.length; i++) {
    results.locations.push({
      title: locations[i].title,
      spots: await Spot.find({
        location: {
          $geoWithin: {
            $center: [[locations[i].latitude, locations[i].longitude], 1.0],
          },
        },
      }).limit(10),
    });
  }

  for (let i = 0; i < subjects.length; i++) {
    results.subjects.push({
      title: subjects[i].title,
      spots: await Spot.find({
        highlightedIn: subjects[i].subject,
      }).limit(10),
    });
  }

  for (let i = 0; i < sources.length; i++) {
    results.sources.push({
      title: sources[i].title,
      spots: await Spot.find({
        featuredBy: sources[i].source,
      }).limit(10),
    });
  }

  res.json(results);
};

exports.search_saved_spots_list = function (req, res) {
  User.findOne(
    {
      _id: req.params.userId,
    },
    function (err, user) {
      if (err) res.send(err);
      Spot.find(
        {
          _id: {
            $in: user.savedSpots,
          },
        },
        function (err, spots) {
          if (err) res.send(err);
          else res.json(spots);
        }
      );
    }
  );
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
      status: "Approved",
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

// retrieve list of spots that are featured by a specific source
exports.search_spots_by_n_sources = function (req, res) {
  Spot.find(
    {
      featuredBy: {
        $in: req.params.sources.split(","),
      },
    },
    function (err, spots) {
      if (err) res.send(err);
      console.log(spots.length, "featured by", req.params.source);

      spots.sort(function (a, b) {
        return (
          req.params.sources.indexOf(a.featuredBy) -
          req.params.sources.indexOf(b.featuredBy)
        );
      });

      // create an object with each value of req.params.sources as a key and an array of spots as the value
      var spotsBySource = {};
      req.params.sources.split(",").forEach(function (source) {
        spotsBySource[source] = [];
      });

      // add each spot to the array of the source it is featured by
      spots.forEach(function (spot) {
        spotsBySource[spot.featuredBy].push(spot);
      });

      res.json(spotsBySource);
    }
  );
};

exports.query_spots = function (req, res) {
  console.log;
  Spot.aggregate(
    [
      {
        $search: {
          index: "prod-spots",
          text: {
            query: req.body.query,
            path: { wildcard: "*" },
            fuzzy: {
              maxEdits: 2,
              prefixLength: 3,
            },
          },
        },
      },
      {
        $limit: 200,
      },
      {
        $project: {
          _id: 1,
          title: 1,
          location: 1,
          description: 1,
          images: 1,
        },
      },
    ],
    function (err, spots) {
      console.log(spots);
      if (err) res.send(err);
      res.json(spots);
    }
  );
};

exports.search_spots_queue = function (req, res) {
  Spot.find(
    {
      status: "pending",
    },
    function (err, spots) {
      console.log(spots);
      if (err) res.send(err);
      res.json(spots);
    }
  );
};

exports.spots_like_this = function (req, res) {
  Spot.aggregate(
    [
      {
        $search: {
          index: "prod-spots",
          moreLikeThis: {
            like: [
              {
                title: req.body.title,
                description: req.body.description,
              },
            ],
          },
        },
      },
      {
        $skip: 1,
      },
      {
        $limit: 6,
      },
    ],
    function (err, spots) {
      if (err) res.send(err);
      res.json(spots);
    }
  );
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
    // const update = {
    //   status: req.body.status,
    // };
    const update = req.body.update;
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

    Spot.findOneAndUpdate(
      { _id: req.params.spotId },
      update,
      function (err, resp) {
        if (err) res.send(err);
        res.send("Successfully updated rating");
      }
    );
  } catch (err) {
    res.send(err);
  }
};

exports.add_review = async function (req, res) {
  try {
    const spot = await Spot.findById(req.body.spotId);

    const new_numberOfRatings = spot.numberOfRatings + 1;
    const specialty =
      (spot.specialty * spot.numberOfRatings + req.body.specialty) /
      new_numberOfRatings;
    const quality =
      (spot.quality * spot.numberOfRatings + req.body.quality) /
      new_numberOfRatings;
    const images = spot.images.concat(req.body.image);
    const review = {
      content: req.body.review,
      author: req.body.author,
      specialty: req.body.specialty,
      quality: req.body.quality,
      image: req.body.image,
    };
    const reviews = spot.reviews ? spot.reviews.concat(review) : [review];

    const update = {
      quality: quality,
      specialty: specialty,
      numberOfRatings: new_numberOfRatings,
      images: images,
      reviews: reviews,
    };

    Spot.findOneAndUpdate(
      { _id: req.body.spotId },
      update,
      function (err, resp) {
        if (err) res.send(err);
        res.send("Successfully updated rating");
      }
    );
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
