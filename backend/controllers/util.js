"use strict";
const formidable = require("formidable");
const fs = require("fs");

// The ID of your GCS bucket
const bucketName = "assets.road-tripper.vercel.app";

const { Storage } = require("@google-cloud/storage");
const storage = new Storage({
  keyFilename: "./env/road-tripper-376206-45e00a81ae04.json",
});

async function uploadFile(contents, destFileName) {
  await storage.bucket(bucketName).file(destFileName).save(contents);
  console.log(`${destFileName} uploaded to ${bucketName}`);
  return;
}

// retrieve single user's profile with matching id
exports.upload_image = async function (req, res) {
  const form = new formidable.IncomingForm();
  form.parse(req, function (err, fields, files) {
    if (err) {
      console.error(err.message);
      res.send(err);
    }
    const file = Object.values(files)[0];
    const rawData = fs.readFileSync(file.filepath);

    uploadFile(rawData, fields.destFileName).catch(console.error);

    res.json({
      uploadUrl: `https://storage.cloud.google.com/${bucketName}/${fields.destFileName}`,
    });
  });
};
