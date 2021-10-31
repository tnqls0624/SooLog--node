require('dotenv').config();
const jwtSecret = process.env.SECRET_KEY;
const jwt = require('jsonwebtoken');

async function refreshToken() {
  return new Promise((resolve, reject) => {
    jwt.sign(
      {},
      jwtSecret,
      {
        expiresIn: '5m',
        issuer: 'soobeen',
      },
      (error, token) => {
        if (error) reject(error);
        resolve(token);
      }
    );
  });
}
module.exports = refreshToken;
