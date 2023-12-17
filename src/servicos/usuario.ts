import { InterfaceCrud } from "./interfaces";
import * as bcrypt from "bcrypt";

type UsuarioModel = {
  usuario: string;
  senha_hash: string;
  salt: string;
};

async function criarSenhaHash(senha_hash: string, salt: string): Promise<string> {
  const senhaCriptografada = await bcrypt.hash(senha_hash, salt);
  return senhaCriptografada;
}

async function gerarSaltPersonalizado(): Promise<string> {
  const saltRounds = 10; // número de rounds para o salt
  const salt = await bcrypt.genSalt(saltRounds);
  return salt;
}


export class UsuarioService implements InterfaceCrud<UsuarioModel> {
  db: any; // Conexão com o banco de dados.

  // Construtor que recebe a conexão com o banco de dados.
  constructor(db: any) {
    this.db = db;
  }
  async verificarSenha(usuario: UsuarioModel, senhaDoUsuario: string): Promise<boolean> {
    try {
      // Recuperar a senha hash e o salt do usuário do banco de dados
      
   
  const { senha_hash, salt } = usuario;
  
      // Verificar se a senha fornecida corresponde à senha armazenada no banco de dados
      const result = await bcrypt.compare(senhaDoUsuario, senha_hash);
  
      return result;
    } catch (error) {
      throw new Error('Erro ao verificar a senha.');
    }
  }

  async getByusuariosenha(emailOrCGC: string): Promise<UsuarioModel | null> {
    const query =
      "SELECT * FROM usuarios WHERE usuario = $1 OR senha_hash = $1";
    const result = await this.db.query(query, [emailOrCGC]);
    return result.rows[0] || null;
  }

  async create(payload: UsuarioModel): Promise<UsuarioModel> {
    const { usuario, senha_hash } = payload;

    // Cria um salt personalizado para este usuário
    const salt = await gerarSaltPersonalizado();

    // Cria a hash da senha utilizando a função criarSenhaHash
    const senhaCriptografada = await criarSenhaHash(senha_hash, salt);

    // Insere no banco de dados
    const query = `
      INSERT INTO usuarios (usuario, senha_hash, salt) 
      VALUES ($1, $2, $3) RETURNING *;
    `;

    const values = [usuario, senhaCriptografada, salt];

    const result = await this.db.query(query, values);

    return result.rows[0];
  }

  async getAll(): Promise<UsuarioModel[]> {
    const result = await this.db.query("SELECT * FROM usuarios");
    return result.rows as UsuarioModel[];
  }

  async find(id: string): Promise<UsuarioModel> {
    const result = await this.db.query("SELECT * FROM usuarios WHERE id = $1", [
      id,
    ]);
    return result.rows[0];
  }

  async update(id: string, payload: UsuarioModel): Promise<UsuarioModel> {
    const { usuario, senha_hash, salt } = payload;
    const values = [usuario, senha_hash, salt, id];
    const result = await this.db.query(
      "UPDATE usuarios SET usuario = $2, senha_hash = $3, salt = $4 WHERE id = $5 RETURNING *;",
      values
    );
    return result.rows[0];
  }

  async delete(id: string): Promise<void> {
    await this.db.query("DELETE FROM usuarios WHERE id = $1", [id]);
  }

  async getByUsuario(usuario: string): Promise<UsuarioModel | null> {
    const query = "SELECT * FROM usuarios WHERE usuario = $1";
    const result = await this.db.query(query, [usuario]);
    return result.rows[0] || null;
  }
}
