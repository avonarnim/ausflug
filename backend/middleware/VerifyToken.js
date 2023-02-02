const { auth } = require("../config/firebase");

exports.VerifyToken = async (req, res, next) => {
  const token = req.headers.authorization.split(" ")[1];

  try {
    auth.verifyIdToken(token).then((decodeValue) => {
      console.log(decodeValue.uid);
      requser = decodeValue;
      return next();
    });
  } catch (e) {
    return res.json({ message: "Internal Error" });
  }
};
