
import express from "express";

const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');


const app = express();
export const SECRET = 'luiztools';



app.use(bodyParser.json());

export function verifyJWT(req, res, next) {
  const token = req.headers['x-api-key'];
  if (!token) return res.status(401).json({ auth: false, message: 'No token provided.' });

  jwt.verify(token, SECRET, function (err, decoded) {
    if (err) return res.status(500).json({ auth: false, message: 'Failed to authenticate token.' });

    req.userId = decoded.id;
    next();
  });
}
