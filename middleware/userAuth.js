const jwt = require("../utils/jwt");

const userAuth = async (req, res, next) => {
  try {
    const token = req.header("Authorization");
    if (!token) {
      res
        .status(403)
        .send({
          status: false,
          message: `Missing authentication token in request`,
        });
      return;
    }

    const decoded = await jwt.verifyToken(token);

    if (!decoded) {
      res
        .status(403)
        .send({
          status: false,
          message: `Invalid authentication token in request`,
        });
      return;
    }

    req.user = decoded;
    next();
  } catch (error) {
    console.error(`Error! ${error.message}`);
    return res.status(500).send({ status: false, message: error.message });
  }
};

module.exports = userAuth;
