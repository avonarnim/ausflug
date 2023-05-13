// Import the functions you need from the SDKs you need
const { getFirestore } = require("firebase-admin/firestore");
const { initializeApp, cert } = require("firebase-admin/app");
const { getAuth } = require("firebase-admin/auth");
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional

// Initialize Firebase
const app = initializeApp({
  credential: cert(require("./road-tripper-376206-45e00a81ae04.json")),
});
const auth = getAuth(app);

auth
  .setCustomUserClaims("daxVClnu5wT3KZY7i2EBoL3rH1I2", { admin: true })
  .then(() => {
    console.log("success");
  });
