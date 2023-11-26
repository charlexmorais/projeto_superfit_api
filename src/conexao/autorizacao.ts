
//index.js
const http =require('http');
const express = require('express'); 
const jwt =require('jsonwebtoken')
const app = express(); 
const bodyParser =require('body-parser');
const SECRET ='luiztools';
app.use(bodyParser.json());

//  rota publica
app.get('/', (req, res, next) => {
    res.json({message: "Tudo ok por aqui!"});
})
 
app.get('/clientes', (req, res, next) => { 
    res.json ([{id:1,nome:'luiz'}])
    console.log("Retornou todos clientes!");
    res.json([{id:1,nome:'luiz'}]);
}) 

//authentication
app.post('/login', (req, res, next) => {
    //esse teste abaixo deve ser feito no seu banco de dados
    if(req.body.user === 'luiz' && req.body.password === '123'){
      //auth ok
    const token=  jwt.sign({ userId:1}, SECRET, {
        expiresIn: 300 // expires in 5min
      });
      return res.json({ auth: true, token: token });
    }
    
    res.status(401).end()
})

function verifyJWT(req, res, next){
    const token = req.headers['authorization'];
    if (!token) return res.status(401).json({ auth: false, message: 'No token provided.' });
    
    jwt.verify(token, process.env.SECRET, function(err, decoded) {
      if (err) return res.status(500).json({ auth: false, message: 'Failed to authenticate token.' });
      
      // se tudo estiver ok, salva no request para uso posterior
      req.userId = decoded.id;
      next();
    });
}


 
app.listen(3000, () => console.log("Servidor escutando na porta 3000..."));