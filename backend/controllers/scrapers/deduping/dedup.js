const Spot = require("../../../models/spotModel");
const mongoose = require("mongoose");
require("dotenv").config({ path: "../.env" });

const uri = process.env.ATLAS_URI;
mongoose.connect(uri);
const connection = mongoose.connection;

function onlyUnique(value, index, array) {
  return array.indexOf(value) === index;
}

connection.once("open", async () => {
  console.log("Connection established w MongoDB");

  // find 100 spots with different titles
  // for each spot, find all spots with same name & in the same area
  // if there are more than one, delete all but one, merging the data

  // const uniqueTitles = Spot.distinct("title").limit(5);
  const uniqueTitles = await Spot.aggregate([
    {
      $group: { _id: { title: "$title", location: "$location" } },
    },
  ]);

  for (let i = 0; i < uniqueTitles.length; i++) {
    const title = uniqueTitles[i]._id.title;
    const location = uniqueTitles[i]._id.location;

    const spotsWithSameName = await Spot.find({
      title: title,
      location: {
        $geoWithin: {
          $center: [[location.lat, location.lng], 1.0],
        },
      },
    });
    // all but first element
    const spot = spotsWithSameName[0];
    let docsToDelete = spotsWithSameName.slice(1);

    if (spotsWithSameName.length > 1) {
      console.log(title, docsToDelete.length);
      update = {};

      // compile all data into the current document
      update["description"] = spotsWithSameName
        .map((spot) => spot.description)
        .filter(onlyUnique)
        .join(". ");
      update["category"] = spotsWithSameName
        .map((spot) => spot.category)
        .filter((val) => val != null)[0];
      update["cost"] = spotsWithSameName
        .map((spot) => spot.cost)
        .filter((val) => val != null)[0];
      update["place_id"] = spotsWithSameName
        .map((spot) => spot.place_id)
        .filter((val) => val != null)[0];
      update["location"] = spotsWithSameName
        .map((spot) => spot.location)
        .filter((val) => val != null)[0];
      update["mapLocation"] = spotsWithSameName
        .map((spot) => spot.mapLocation)
        .filter((val) => val != null)[0];
      update["specialty"] =
        spotsWithSameName
          .map((spot) => spot.specialty)
          .reduce((a, b) => a + b, 0) / spotsWithSameName.length;
      update["quality"] =
        spotsWithSameName
          .map((spot) => spot.quality)
          .reduce((a, b) => a + b, 0) / spotsWithSameName.length;
      update["popularity"] =
        spotsWithSameName
          .map((spot) => spot.popularity)
          .reduce((a, b) => a + b, 0) / spotsWithSameName.length || 0;
      update["numberOfRatings"] = spotsWithSameName
        .map((spot) => spot.numberOfRatings)
        .reduce((a, b) => a + b, 0);
      update["sponsored"] = spotsWithSameName
        .map((spot) => spot.sponsored)
        .reduce((a, b) => a || b, false);
      update["status"] = spotsWithSameName
        .map((spot) => spot.status)
        .reduce((a, b) => {
          if (a === "Approved" || b === "Approved") return "Approved";
          else return "pending";
        }, false);
      update["highlightedIn"] = spotsWithSameName
        .map((spot) => spot.highlightedIn)
        .reduce((a, b) => a.concat(b), [])
        .filter(onlyUnique);
      update["featuredBy"] = spotsWithSameName
        .map((spot) => spot.featuredBy)
        .reduce((a, b) => a.concat(b), [])
        .filter(onlyUnique);
      update["externalLink"] = spotsWithSameName.map(
        (spot) => spot.externalLink
      )[0];
      update["externalIds"] = spotsWithSameName
        .map((spot) => spot.externalIds)
        .reduce((a, b) => a.concat(b), [])
        .filter(onlyUnique);
      update["images"] = spotsWithSameName
        .map((spot) => spot.images)
        .reduce((a, b) => a.concat(b), [])
        .filter(onlyUnique);
      update["reviews"] = spotsWithSameName
        .map((spot) => spot.reviews)
        .reduce((a, b) => a.concat(b), [])
        .filter(onlyUnique);
      update["openTimes"] = spotsWithSameName
        .map((spot) => spot.openTimes)
        .reduce((a, b) => a.concat(b), [])
        .filter(onlyUnique);
      update["activities"] = spotsWithSameName
        .map((spot) => spot.activities)
        .reduce((a, b) => a.concat(b), [])
        .filter(onlyUnique);
      update["features"] = spotsWithSameName
        .map((spot) => spot.features)
        .reduce((a, b) => a.concat(b), [])
        .filter(onlyUnique);

      Spot.findOneAndUpdate({ _id: spot._id }, update, function (err, resp) {
        if (err) console.log(err);
        console.log("Successfully updated", resp);
      });

      Spot.deleteMany({ _id: { $in: docsToDelete } }, function (err, resp) {
        if (err) console.log(err);
        console.log("Successfully deleted", resp);
      });
    }
  }
});
