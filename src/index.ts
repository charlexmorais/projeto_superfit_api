
import express from "express";
import { Client } from "pg";
import dotenv from "dotenv";
// import * as bcrypt from 'bcrypt';
import { PessoaService } from "./servicos/pessoas.services";
import { ModalidadeService } from "./servicos/modalidades.services";
import { PlanosService } from "./servicos/planos.services";
import { HorariosService } from "./servicos/horarios.services";
import { ModalidadePlanos} from "./servicos/modalidades_planos";
import { MatriculaService} from "./servicos/matriculas.services";
import {PagamentoService} from "./servicos/pagamento.services"
import { RelatorioAtualService} from "./servicos/relatorioAtual.services";
import { verifyJWT } from "./conexao/autorizacao";
import { SECRET } from "./conexao/autorizacao";
import { UsuarioService } from './servicos/usuario'; 


dotenv.config();

const app = express();
const port = 3000;


app.use(express.json());

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
const pagamentoService= new PagamentoService(db)
const relatorioAtualService=new RelatorioAtualService(db);
const usuarioService =new UsuarioService(db)



export const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');






app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.json({ message: "Tudo ok por aqui!" });
});
app.get("/pessoas/:id",verifyJWT, async (req, res) => {
  const { id } = req.params;
  const user = await pessoaService.find(id);
  res.json(user);
  console.log("pessoa encontrada com sucesso  !");
});


app.get('/pessoas', verifyJWT, async (req, res) => {
  try {
    const pessoas = await pessoaService.getAll();
    res.json(pessoas);
    console.log("Retornou todoas pessoas !");
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar clientes.' });
  }
});

import * as bcrypt from 'bcrypt';

// ... outros imports e definições de rota

app.post('/login', async (req, res, next) => {
  try {
    const { usuario, senha_hash } = req.body;
    const encontrarUsuario = await usuarioService.getByusuariosenha(usuario);

    if (encontrarUsuario) {
      const senhaCorreta = await bcrypt.compare(senha_hash, encontrarUsuario.senha_hash);

      if (senhaCorreta) {
        const token = jwt.sign({ usuario: encontrarUsuario.usuario }, SECRET, {
          expiresIn: 300 // expires in 5 minutes
        });
        return res.json({ auth: true, token: token });
      }
    }

    res.status(401).json({ auth: false, message: 'Credenciais inválidas.' });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao realizar o login.' });
  }
});


app.get("/usuarios", verifyJWT,async (req, res) => {
  const usuarios = await usuarioService.getAll();
  res.json(usuarios);
});
app.get("/usuarios/:id",verifyJWT, async (req, res) => {
  const { id } = req.params;
  const user = await usuarioService.find(id);
  res.json(user);
});
app.post("/usuarios", verifyJWT ,async (req, res) => {
  try {
    const user = usuarioService.create(req.body);
    res.json({ message: " usuario inserido com sucesso" });
  } catch (error) {
    res.status(500).json({
      error,
      message: error.message,
    });
  }
});
app.delete("/usuarios/:id", verifyJWT, async (req, res) => {
  try {
    const { id } = req.params;
    await usuarioService.delete(id);
    res.json({ message: "usuario excluído com sucesso" });
  } catch (error) {
    res.status(500).json({
      error,
      message: error.message,
    });
  }
});



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

app.get("/planos",verifyJWT, async (req, res) => {
  const users = await planosService.getAll();
  res.json(users);
});

app.get("/planos/:id",verifyJWT, async (req, res) => {
  const { id } = req.params;
  const user = await planosService.find(id);
  res.json(user);
});


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


app.get("/modalidadesplanos", verifyJWT, async (req, res) => {
const users = await modalidadePlanos.getAll();
  res.json(users);
});


app.get("/modalidadesplanos/:id1/:id2", verifyJWT, async (req, res) => {
  const { id1, id2 } = req.params;
  try {
    
    const user = await modalidadePlanos.find(id1,id2);
    res.json(user);
  } catch (error) {
    res.status(500).json({
      error,
      message: error.message,
    });
  }
});


  

// app.post("/modalidadesplanos", verifyJWT, async (req, res) => {
//   try {
    
   
// const user = await modalidadePlanos.create(req.body);
//     res.json({ message: "Inserido com sucesso" });
//   } catch (error) {
//     res.
   
// status(500).json({
//       error,
//       message: error.message,
//     });
//   }
// });


// app.put("/modalidadesplanos/:planos_id/:modalidade_id", verifyJWT, async (req, res) => {
//   try {
//     const { planos_id, modalidade_id } = req.params;
//     const updatedResource = await modalidadePlanos.update({ planos_id, modalidade_id }, req.body);

//     res.json(updatedResource);
//   } catch (error) {
//     res.status(500).json({
//       error: error.message
//     });
//   }
// });



// app.delete("/modalidadesplanos/:id", verifyJWT, async (req, res) => {
//   try {
//     const { id } = req.params;
//     await modalidadePlanos.delete(id);
//     res.json({ message: "Excluído com sucesso" });
//   } catch (error) {
//     res.status(500).json({
//       error,
//       message: error.message,
//     });
//   }
// });


app.get("/matricula", verifyJWT,async (req, res,) => {
  const users = await matriculaService.getAll();
  res.json(users);
});

app.get("/matricula/:id",verifyJWT, async (req, res) => {
  const { id } = req.params;
  const user = await matriculaService.find(id);
  res.json(user);
});

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


app.get("/horarios",verifyJWT, async (req, res) => {
  const users = await horariosService.getAll();
  res.json(users);
});

app.get("/horarios/:id",verifyJWT, async (req, res) => {
  const { id } = req.params;
  const user = await horariosService.find(id);
  res.json(user);
});

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
app.get("/pagamentos",verifyJWT, async (req, res) => {
  const users = await pagamentoService.getAll();
  res.json(users);
});
app.get("/pagamentos/:id",verifyJWT, async (req, res) => {
  const { id } = req.params;
  const user = await pagamentoService.find(id);
  res.json(user);
});

app.post("/pagamentos", verifyJWT,async (req, res) => {
  try {
    const user = pagamentoService.create(req.body);
    res.json({ message: " pagamento incluido com sucesso" });
  } catch (error) {
    res.status(500).json({
      error,
      message: error.message,
    });
  }
});

app.put("/pagamentos/:id", verifyJWT, async (req, res) => {
  try {
    const user = await pagamentoService.update(req.params.id, req.body);
    res.json(user);
  } catch (error) {
    res.status(500).json({
      error,
      message: error.message,
    });
  }
});  

app.delete("/pagamentos/:id",verifyJWT, async (req, res) => {
  try {
    const { id } = req.params;
    await pagamentoService.delete(id);
    res.json({ message: "  pagamento excluído com sucesso" });
  } catch (error) {
    res.status(500).json({
      error,
      message: error.message,
    });
  }
});



app.get("/relatorioatual", async (req, res) => {
  try {
  
    const relatorio = await relatorioAtualService.get();
    res.json(relatorio);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


app.listen(port, () => {
  console.log("server run", port);
  
});
