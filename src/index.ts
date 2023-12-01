
import express from "express";
import { Client } from "pg";
import dotenv from "dotenv";
import { PessoaService } from "./servicos/pessoas.services";
import { ModalidadeService } from "./servicos/modalidades.services";
import { PlanosService } from "./servicos/planos.services";
import { HorariosService } from "./servicos/horarios.services";
import { ModalidadePlanos } from "./servicos/modalidades_planos";
import { MatriculaService} from "./servicos/matriculas.services";
import { ListaInadimplenciaService} from "./servicos/listainadimplentes";
import { RelatorioAtualService} from "./servicos/relatorioAtual.services";
import { verifyJWT } from "./conexao/autorizacao";
import { SECRET } from "./conexao/autorizacao";

dotenv.config();

const app = express();
const port = 3000;


app.use(express.json());
// CRUD 
export const db = new Client({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASS,
  port: 5433,
});


db.connect();

const pessoaService = new PessoaService(db);
const modalidadeService = new ModalidadeService(db);
const planosService=  new PlanosService(db);
const modalidadePlanos=  new ModalidadePlanos(db);
const matriculaService=  new MatriculaService(db);
const horariosService=  new HorariosService(db);
const listaInadimplenciaService=new ListaInadimplenciaService(db);
const relatorioAtualService=new RelatorioAtualService(db);



export const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');






app.use(bodyParser.json());

app.get('/', (req, res, next) => {
  res.json({ message: "Tudo ok por aqui!" });
});
app.get("/pessoas/:id",verifyJWT, async (req, res) => {
  const { id } = req.params;
  const user = await pessoaService.find(id);
  res.json(user);
  console.log("pessoa encontrada com sucesso  !");
});


app.get('/pessoas', verifyJWT, async (req, res, next) => {
  try {
    const pessoas = await pessoaService.getAll();
    res.json(pessoas);
    console.log("Retornou todoas pessoas !");
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar clientes.' });
  }
});

app.post('/login', async (req, res, next) => {
  try {
    const { cgc, email } = req.body;
    const pessoa = await pessoaService.getByEmailOrCGC(cgc || email);

    if (pessoa && pessoa.email === email) {
      const token = jwt.sign({ email: email }, SECRET, {
        expiresIn: 700 // expires in 5min
      });
      return res.json({ auth: true, token: token });
    }

    res.status(401).json({ auth: false, message: 'Credenciais inválidas.' });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao realizar o login.' });
  }
});



// CREATE
app.post("/pessoas", verifyJWT,  async (req, res) => {
  try {
    const user = pessoaService.create(req.body);
    res.json({ message: " pessoa inserida com sucesso" });
  } catch (error) {
    res.status(500).json({
      error,
      message: error.message,
    });
  }
});

// UPDATE
app.put("/pessoas/:id", verifyJWT, async (req, res) => {
  try {
    const user = await pessoaService.update(req.params.id, req.body);
    res.json(user);
  } catch (error) {
    res.status(500).json({
      error,
      message: error.message,
    });
  }
});
// DELETE
app.delete("/pessoas/:id", verifyJWT, async (req, res) => {
  try {
    const { id } = req.params;
    await pessoaService.delete(id);
    res.json({ message: "Pessoa excluída com sucesso" });
  } catch (error) {
    res.status(500).json({
      error,
      message: error.message,
    });
  }
});
// read

app.get("/modalidades", verifyJWT,async (req, res) => {
  const modalidades = await modalidadeService.getAll();
  res.json(modalidades);
});
app.get("/modalidades/:id",verifyJWT, async (req, res) => {
  const { id } = req.params;
  const user = await modalidadeService.find(id);
  res.json(user);
});

app.post("/modalidades",verifyJWT, async (req, res) => {
  try {
    const modalidade = await modalidadeService.create(req.body);
    res.json({ message: " modalidade inserida com sucesso" });
  } catch (error) {
    res.status(500).json({
      error,
      message: error.message,
    });
  }
});
// update
app.put("/modalidades/:id",verifyJWT, async (req, res) => {
  try {
    const user = await modalidadeService.update(req.params.id, req.body);
    res.json(user);
  } catch (error) {
    res.status(500).json({
      error,
      message: error.message,
    });
  }
});

// delete

app.delete("/modalidades/:id",verifyJWT,async (req , res) => {
  try {
    const { id } = req.params;
    await modalidadeService.delete(id);
    res.json({ message: " Modalidade excluída com sucesso" });
  } catch (error) {
    res.status(500).json({
      error,
      message: error.message,
    });
  }

});
// read
app.get("/planos",verifyJWT, async (req, res) => {
  const users = await planosService.getAll();
  res.json(users);
});

app.get("/planos/:id",verifyJWT, async (req, res) => {
  const { id } = req.params;
  const user = await planosService.find(id);
  res.json(user);
});

// CREATE
app.post("/planos", verifyJWT,async (req, res) => {
  try {
    const user = planosService.create(req.body);
    res.json({ message: " plano inserido com sucesso" });
  } catch (error) {
    res.status(500).json({
      error,
      message: error.message,
    });
  }
});

// UPDATE
app.put("/planos/:id",verifyJWT, async (req, res) => {
  try {
    const user = await planosService.update(req.params.id, req.body);
    res.json(user);
  } catch (error) {
    res.status(500).json({
      error,
      message: error.message,
    });
  }
});
// DELETE
app.delete("/planos/:id", verifyJWT,async (req, res) => {
  try {
    const { id } = req.params;
    await planosService.delete(id);
    res.json({ message: "Plano excluído com sucesso" });
  } catch (error) {
    res.status(500).json({
      error,
      message: error.message,
    });
  }
});

// READ
app.get("/modalidadesplanos", verifyJWT, async (req, res) => {
const users = await modalidadePlanos.getAll();
  res.json(users);
});

// READ by IDs
app.get("/modalidadesplanos/:id1/:id2", verifyJWT, async (req, res) => {
  const { id1, id2 } = req.params;
  try {
    // Aqui podes utilizar os IDs capturados para fazer a busca necessária na tua lógica
    // Por exemplo:
    const user = await modalidadePlanos.find(id1, id2);
    res.json(user);
  } catch (error) {
    res.status(500).json({
      error,
      message: error.message,
    });
  }
});


  
// CREATE
app.post("/modalidadesplanos", verifyJWT, async (req, res) => {
  try {
    
   
const user = await modalidadePlanos.create(req.body);
    res.json({ message: "Inserido com sucesso" });
  } catch (error) {
    res.
   
status(500).json({
      error,
      message: error.message,
    });
  }
});


  
// UPDATE
app.put("/modalidadesplanos/:id", verifyJWT, async (req, res) => {

try {
    const user = await modalidadePlanos.update(req.params.id, req.body);
    res.json(user);
  } catch (error) {
    res.status(500).json({
      error,
      
 
message: error.message,
    });
  }
});


// DELETE
app.delete("/modalidadesplanos/:id", verifyJWT, async (req, res) => {
  try {
    const { id } = req.params;
    await modalidadePlanos.delete(id);
    res.json({ message: "Excluído com sucesso" });
  } catch (error) {
    res.status(500).json({
      error,
      message: error.message,
    });
  }
});





app.get("/matricula", verifyJWT,async (req, res) => {
  const users = await matriculaService.getAll();
  res.json(users);
});

app.get("/matricula/:id",verifyJWT, async (req, res) => {
  const { id } = req.params;
  const user = await matriculaService.find(id);
  res.json(user);
});
// CREATE
app.post("/matricula", verifyJWT,async (req, res) => {
  try {
    const user = matriculaService.create(req.body);
    res.json({ message: " matricula concluida  com sucesso" });
  } catch (error) {
    res.status(500).json({
      error,
      message: error.message,
    });
  }
});
// UPDATE
app.put("/matricula/:id",verifyJWT, async (req, res) => {
  try {
    const user = await matriculaService.update(req.params.id, req.body);
    res.json(user);
  } catch (error) {
    res.status(500).json({
      error,
      message: error.message,
    });
  }
});
// DELETE
app.delete("/matricula/:id",verifyJWT, async (req, res) => {
  try {
    const { id } = req.params;
    await matriculaService.delete(id);
    res.json({ message: " matricula excluída com sucesso" });
  } catch (error) {
    res.status(500).json({
      error,
      message: error.message,
    });
  }
});
// read

app.get("/horarios",verifyJWT, async (req, res) => {
  const users = await horariosService.getAll();
  res.json(users);
});

app.get("/horarios/:id",verifyJWT, async (req, res) => {
  const { id } = req.params;
  const user = await horariosService.find(id);
  res.json(user);
});
// CREATE
app.post("/horarios", verifyJWT,async (req, res) => {
  try {
    const user = horariosService.create(req.body);
    res.json({ message: " horario incluido com sucesso" });
  } catch (error) {
    res.status(500).json({
      error,
      message: error.message,
    });
  }
});
// UPDATE
app.put("/horarios/:id", verifyJWT, async (req, res) => {
  try {
    const user = await horariosService.update(req.params.id, req.body);
    res.json(user);
  } catch (error) {
    res.status(500).json({
      error,
      message: error.message,
    });
  }
});  


// DELETE
app.delete("/horarios/:id",verifyJWT, async (req, res) => {
  try {
    const { id } = req.params;
    await horariosService.delete(id);
    res.json({ message: "  horario excluído com sucesso" });
  } catch (error) {
    res.status(500).json({
      error,
      message: error.message,
    });
  }
});

app.get("/relatorioatual", async (req, res) => {
  try {
    const relatorioAtual = new RelatorioAtualService(db); // Certifique-se de passar a conexão do banco de dados aqui
    const relatorio = await relatorioAtual.get();
    res.json(relatorio);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});




app.listen(port, () => {
  console.log("server run", port);
  
});
