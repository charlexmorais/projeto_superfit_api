
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
import { ListaPagamentoService} from "./servicos/listapagamentos";
import { RelatorioAtualService} from "./servicos/relatorioAtual.services";

import jwt from 'jsonwebtoken';


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
const listaPagamentosService=new ListaPagamentoService(db);
const relatorioAtualService=new RelatorioAtualService(db);

// Chave secreta para assinar o token JWT
const segredo = 'ChaveSuperSecreta';

// Função para gerar o token
function gerarToken(payload) {
  return jwt.sign(payload, segredo, { expiresIn: '1h' });
}

// Rota de login para autenticação e geração do token
app.post('/pessoas', async (req, res) => {
  try {
    // Aqui você faria a validação das credenciais do usuário (exemplo simples)
    const { email, cgc, tipo_cadastro } = req.body;

    // Verificar se o usuário já existe no banco de dados
    const usuarioExistente = await pessoaService.alunoExistente(email, cgc, tipo_cadastro);
    if (usuarioExistente) {
      // Se o usuário já existir, retornar um erro de autenticação
      return res.status(401).json({ erro: 'Usuário já cadastrado' });
    }

    // Se as credenciais não existirem, gerar um token com os dados que deseja incluir
    const payload = {
      email,
      cgc,
      tipo_cadastro,
      // Adicione outros dados que deseja incluir no token
    };

    // Gerar o token com o payload e a chave secreta
    const token = gerarToken(payload);

    // Enviar o token como resposta
    res.json({ token });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Outras rotas e lógica do seu aplicativo...
// Outras rotas e lógica do seu aplicativo...

// READ -------------
app.get("/pessoas", async (req, res) => {
  const users = await pessoaService.getAll();
  res.json(users);
});

app.get("/pessoas/:id", async (req, res) => {
  const { id } = req.params;
  const user = await pessoaService.find(id);
  res.json(user);
});

// CREATE
// app.post("/pessoas", async (req, res) => {
//   try {
//     const user = pessoaService.create(req.body);
//     res.json(user);
//   } catch (error) {
//     res.status(500).json({
//       error,
//       message: error.message,
//     });
//   }
// });

// UPDATE
app.put("/pessoas/:id", async (req, res) => {
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
app.delete("/pessoas/:id", async (req, res) => {
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

app.get("/modalidades", async (req, res) => {
  const modalidades = await modalidadeService.getAll();
  res.json(modalidades);
});
app.get("/modalidades/:id", async (req, res) => {
  const { id } = req.params;
  const user = await modalidadeService.find(id);
  res.json(user);
});

app.post("/modalidades", async (req, res) => {
  try {
    const modalidade = await modalidadeService.create(req.body);
    res.json(modalidade);
  } catch (error) {
    res.status(500).json({
      error,
      message: error.message,
    });
  }
});
// update
app.put("/modalidades/:id", async (req, res) => {
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

app.delete("/modalidades/:id",async (req , res) => {
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
app.get("/planos", async (req, res) => {
  const users = await planosService.getAll();
  res.json(users);
});

app.get("/planos/:id", async (req, res) => {
  const { id } = req.params;
  const user = await planosService.find(id);
  res.json(user);
});

// CREATE
app.post("/planos", async (req, res) => {
  try {
    const user = planosService.create(req.body);
    res.json(user);
  } catch (error) {
    res.status(500).json({
      error,
      message: error.message,
    });
  }
});

// UPDATE
app.put("/planos/:id", async (req, res) => {
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
app.delete("/planos/:id", async (req, res) => {
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
// read

app.get("/modalidadesplanos", async (req, res) => {
  const users = await modalidadePlanos.getAll();
  res.json(users);
});

app.get("/modalidadesplanos/:id", async (req, res) => {
  const { id } = req.params;
  const user = await modalidadePlanos.find(id);
  res.json(user);
});
// CREATE
app.post("/modalidadesplanos", async (req, res) => {
  try {
    const user = modalidadePlanos.create(req.body);
    res.json(user);
  } catch (error) {
    res.status(500).json({
      error,
      message: error.message,
    });
  }
});
// UPDATE
app.put("/modalidadesplanos/:id", async (req, res) => {
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
app.delete("/modalidadesplanos/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await modalidadePlanos.delete(id);
    res.json({ message: " excluído com sucesso" });
  } catch (error) {
    res.status(500).json({
      error,
      message: error.message,
    });
  }
});
// read

app.get("/matricula", async (req, res) => {
  const users = await matriculaService.getAll();
  res.json(users);
});

app.get("/matricula/:id", async (req, res) => {
  const { id } = req.params;
  const user = await matriculaService.find(id);
  res.json(user);
});
// CREATE
app.post("/matricula", async (req, res) => {
  try {
    const user = matriculaService.create(req.body);
    res.json(user);
  } catch (error) {
    res.status(500).json({
      error,
      message: error.message,
    });
  }
});
// UPDATE
app.put("/matricula/:id", async (req, res) => {
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
app.delete("/matricula/:id", async (req, res) => {
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

app.get("/horarios", async (req, res) => {
  const users = await horariosService.getAll();
  res.json(users);
});

app.get("/horarios/:id", async (req, res) => {
  const { id } = req.params;
  const user = await horariosService.find(id);
  res.json(user);
});
// CREATE
app.post("/horarios", async (req, res) => {
  try {
    const user = horariosService.create(req.body);
    res.json(user);
  } catch (error) {
    res.status(500).json({
      error,
      message: error.message,
    });
  }
});
// UPDATE
app.put("/horarios/:id", async (req, res) => {
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
app.delete("/horarios/:id", async (req, res) => {
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

// READ -------------
app.get("/listainadimplentes", async (req, res) => {
  const users = await listaInadimplenciaService.getAll();
  res.json(users);
});

app.get("/listainadimplentes/:id", async (req, res) => {
  const { id } = req.params;
  const user = await listaInadimplenciaService.find(id);
  res.json(user);
});
// CREATE
app.post("/listainadimplentes", async (req, res) => {
  try {
    const user = listaInadimplenciaService.create(req.body);
    res.json(user);
  } catch (error) {
    res.status(500).json({
      error,
      message: error.message,
    });
  }
});
// UPDATE
app.put("/listainadimplentes/:id", async (req, res) => {
  try {
    const user = await listaInadimplenciaService.update(req.params.id, req.body);
    res.json(user);
  } catch (error) {
    res.status(500).json({
      error,
      message: error.message,
    });
  }
});  
// DELETE
app.delete("/listainadimplentes/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await listaInadimplenciaService.delete(id);
    res.json({ message: "  excluído com sucesso" });
  } catch (error) {
    res.status(500).json({
      error,
      message: error.message,
    });
  }
});

// READ -------------
app.get("/listapagamentos", async (req, res) => {
  const users = await listaPagamentosService.getAll();
  res.json(users);
});

app.get("/listapagamentos/:id", async (req, res) => {
  const { id } = req.params;
  const user = await listaPagamentosService.find(id);
  res.json(user);
});
// CREATE
app.post("/listapagamentos", async (req, res) => {
  try {
    const user = listaPagamentosService.create(req.body);
    res.json(user);
  } catch (error) {
    res.status(500).json({
      error,
      message: error.message,
    });
  }
});
// UPDATE
app.put("/listapagamentos/:id", async (req, res) => {
  try {
    const user = await listaPagamentosService.update(req.params.id, req.body);
    res.json(user);
  } catch (error) {
    res.status(500).json({
      error,
      message: error.message,
    });
  }
});  
// DELETE
app.delete("/listapagamentos/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await listaPagamentosService.delete(id);
    res.json({ message: "  excluído com sucesso" });
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
