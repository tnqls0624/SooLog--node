require('dotenv').config();
const jwt = require('jsonwebtoken');
const jwtSecret = process.env.SECRET_KEY;

async function decodeToken(token) {
  return new Promise((resolve, reject) => {
    jwt.verify(token, jwtSecret, (error, decoded) => {
      resolve(decoded);
    });
  });
}

module.exports = decodeToken;
