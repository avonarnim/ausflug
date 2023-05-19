const { auth } = require("../config/firebase");

exports.VerifyToken = async (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];

    auth.verifyIdToken(token).then((decodeValue) => {
      console.log(decodeValue.uid);
      requser = decodeValue;
      return next();
    });
  } catch (e) {
    return res.json({ message: "Invalid Token" });
  }
};

exports.VerifyAdminToken = async (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];

    auth.verifyIdToken(token).then((claims) => {
      if (claims.admin) {
        return next();
      } else {
        return res.json({ message: "Not an Admin" });
      }
    });
  } catch (e) {
    return res.json({ message: "Invalid Token" });
  }
};
