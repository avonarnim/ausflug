// for the default version
const algoliasearch = require("algoliasearch");
const Spot = require("../../models/spotModel");

const client = algoliasearch("S2P17HUIXR", process.env.ALGOLIA_API_KEY);
const index = client.initIndex("spots");

const transferFromMDBtoAlgolia = () => {
  const fetchDataFromDatabase = () => {
    Spot.find({}, function (err, spots) {
      if (err) console.log(err);
      index.saveObjects(spots, { autoGenerateObjectIDIfNotExist: true });
      console.log("finished uploading");
      return;
    });
  };

  fetchDataFromDatabase();
  return;
};

module.exports = { transferFromMDBtoAlgolia };
