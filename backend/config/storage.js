const { Storage } = require("@google-cloud/storage");
const { GoogleAuth } = require("google-auth-library");
require("dotenv").config();

const storage = new Storage({
  keyFilename: "./config/road-tripper-376206-45e00a81ae04.json",
});

exports.storage = storage;
