
import express from "express";

const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');


const app = express();
require('dotenv').config();
export const SECRET = process.env.SECRET;





app.use(bodyParser.json());

export function verifyJWT(req, res, next) {
  
  const token = req.headers['x-api-key'];

  // Verificando  token 
  if (!token) {
    
    return res.status(401).json({ auth: false, message: 'Nenhum token fornecido.' });
  }

  // Verifica o token chave secreta (SECRET)
  jwt.verify(token, SECRET, function (err, decoded) {
  
    if (err) {

      return res.status(500).json({ auth: false, message: 'Falha ao autenticar o token.' });
    }

    // Se o token for válido, decodifica o ID do usuário a partir do token
    req.userId = decoded.id;
    // Chama a próxima função/middleware na cadeia de manipulação de requisições
    next();
  });
}
