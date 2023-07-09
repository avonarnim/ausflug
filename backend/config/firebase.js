// Import the functions you need from the SDKs you need
const { getFirestore } = require("firebase-admin/firestore");
const { initializeApp, cert } = require("firebase-admin/app");
const { getAuth } = require("firebase-admin/auth");
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional

// NOTE: may need to change to "./config/road-tripper..." (test out)
// var serviceAccount = require("./road-tripper-376206-45e00a81ae04.json");
const serviceAccount = {
  type: "service_account",
  project_id: "road-tripper-376206",
  private_key_id: "45e00a81ae04f4950706078f36b362ea99b3b233",
  private_key:
    "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQC15wzBNmFCnvbi\nSGXjOjZUc9FhVBo/AONu3zSMXTvE3ZTnVFQqKfpgZ9N1JOGS8K137KDrY2HmQzo8\nRIIyLX0aIH68jkQMaQcAUV2Zcpo4m2NOO3R1nj2+sI3B9JcNsYgVlFaSFOCjKcLo\nkV1NIE1GhBfZqB1PIc+dbL9C7NXVyzjDbpuB53tZPjP/CfjTNRgA67Bm2udmuGZ5\nPxeVzHMN0+4TPBVSuAjqx31FdpRQlapa0zbg6n9TyugPnGMbSQcskwpDUdCOpp0R\n1ufKB/1pnylNbNk1jwE/mV31kNUoVNThdQw9EInQuQA0dg/vAnHAHu8NTHesG9Et\nGlFgp+DtAgMBAAECggEAL+nMp8X5p3E0yZTVVZ17OxKIt9DN2wOSZJ1he4mBWVEe\nTDKfur106Fjgz43n5usDXj/TgT0bx+m0WLSY8LufpLaje2ojzXsKr5A/DdCsg7WW\nWkB55BNK40QhCtIwyZgWJsz8Yp0iMIgrAVRs1YhpImZf2+KW2cWnqKlA1dGJX7cm\nq7wV773t5Fmg+v3SrdBisuupLlZZc15Z7mL7htWQzjHxsJfr0wSRBK3fYZ96HnTt\n6uHGIMFqV7zdhi3WpXAJwHU3zimFr7dCs2V0Yqb8crgvuXuwS655tp9e8wsOYGVA\nNoOUENttfkE9sRCRciLhaIm+4ge+Fj5iDwxvB7i35wKBgQDaDWPytMzkxxuHUX+x\nJ41QCkHYWxqVlEo8FMvpu5YnK/N0FBF5jzZ3lhTp1h1dOaYcCKYxTv+jIvlO6Jx/\nhnuVEJlCUAZbPXrR89qPIbne9TuBbklLo7Zq6+EIPz1c5SCBWXKsSYpbTVsXNsnB\nT1VffHGM7csKMknWoWZNRz3X1wKBgQDVjx/Vdrq/lgVDFnMGNakurYZY4zS+jvrS\ndngtlKxzd3n9QUqAUIg0GXYfBzr3Vk2Mnk1OYGowB2Vb3CfKjyoZh97gNridkbJL\nOOoWLHh05vC5sdASXYmGBSpJQ4sGBYhbocHIQ+jLfdyK+P9xaVeViCbZJKocjpyy\nsjlKYgok2wKBgQCvhWvY6LSty6BbMr1Iyv+zWC5cjClAEpgW+N6TjM53Rae43paa\ndS9w37yB5jrI2ijeFBBDTMX2eaaZYCDpfkVoXm4ftO8I7to4usRJxuopkNmPfEk/\nu86RDsKbstwgNMgPlwL5sFDQ4dnbO9z34HZmYHO+74Mq+AP74vvIZPphDQKBgBo5\nqT8dhXFhiuPiLd3lWRFSXd0siZ2dEVAnHDr8tvC3C1P+YJfBS/iZ59eHm8Yj4wIR\nroyhamjbf6b4Miq9yf24obYHAkTXT33NT3HJpEE22vjyzQp0Uh8TI0477SagJ06Z\nXqKpND1JB3xJd5UFyquiPKMNzZYULUoEeOSZhYVhAoGAf+NhvijAh4CwOORmrc93\nr2U9/HMGwx0zmxDqM4+CsQL/6H3oEPRGXGXMmpZR+hVDu9T0KsmPJ5WqdYl8BoAW\npJKX8/9GyHSr0bcE3M65WeVGfJDSVLDsinWeJ+g8MQEpH8rt3HPknDkcP9vMxiDz\n+x29hAiy57uIgTtJ4PsoDCk=\n-----END PRIVATE KEY-----\n",
  client_email:
    "firebase-adminsdk-ocikk@road-tripper-376206.iam.gserviceaccount.com",
  client_id: "107934542551005898922",
  auth_uri: "https://accounts.google.com/o/oauth2/auth",
  token_uri: "https://oauth2.googleapis.com/token",
  auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
  client_x509_cert_url:
    "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-ocikk%40road-tripper-376206.iam.gserviceaccount.com",
};

// Initialize Firebase
const app = initializeApp({ credential: cert(serviceAccount) });
// const app = initializeApp({
//   credential: cert(require("./road-tripper-376206-45e00a81ae04.json")),
// });
const auth = getAuth(app);
const db = getFirestore(app);

exports.app = app;
exports.auth = auth;
exports.db = db;
