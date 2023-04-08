const jwt = require("jsonwebtoken");
require("dotenv").config();

const createToken = async (name, email, mobile) => {
  try {
    const token = await jwt.sign(
      {
        name,
        email,
        mobile,
        iat: Math.floor(Date.now() / 1000),
        exp: Math.floor(Date.now() / 1000) + 86400,
      },
      process.env.JWTSECRETKEY
    );
    return token;
  } catch (error) {
    console.error(`Error! creating jwt token ${error.message}`);
    throw error;
  }
};

const verifyToken = async (token) => {
  try {
    const decoded = await jwt.verify(token, process.env.JWTSECRETKEY);
    return decoded;
  } catch (error) {
    console.error(`Error! verifying jwt token ${error.message}`);
    throw error;
  }
};

module.exports = {
  createToken,
  verifyToken,
};
