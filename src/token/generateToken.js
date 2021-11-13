require('dotenv').config();
const jwtSecret = process.env.SECRET_KEY;
const jwt = require('jsonwebtoken');

async function generateToken(payload) {
  return new Promise((resolve, reject) => {
    jwt.sign(
      payload,
      jwtSecret,
      {
        expiresIn: '2h',
        issuer: 'soobeen',
      },
      (error, token) => {
        if (error) reject(error);
        resolve(token);
      }
    );
  });
}
module.exports = generateToken;
