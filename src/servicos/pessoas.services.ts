
import { InterfaceCrud } from "./interfaces";


type PessoaModel = {
  id?: string; 
  nome: string;
  email: string;
  cgc: string; 
  tipo_pessoa: string;
  tipo_cadastro: string;
  ativo: string;
};


export class PessoaService implements InterfaceCrud<PessoaModel> {
  db: any; // Conexão com o banco de dados.

  // Construtor que recebe a conexão com o banco de dados.
  constructor(db: any) {
    this.db = db;
  }

  async getByEmailOrCGC(emailOrCGC: string): Promise<PessoaModel | null> {
    const query = "SELECT * FROM pessoas WHERE email = $1 OR cgc = $1";
    const result = await this.db.query(query, [emailOrCGC]);
    return result.rows[0] || null;
  }
 
  async validandoDados(payload: PessoaModel) {
    return true; 
  }

  async create(payload: PessoaModel): Promise<PessoaModel> {
    const { nome, cgc, tipo_pessoa, email, tipo_cadastro, ativo } = payload;
    const query = `
      INSERT INTO pessoas (nome, cgc, tipo_pessoa, email, tipo_cadastro, ativo) 
      values ($1, $2, $3, $4, $5, $6) Returning *;
    `;
    const values = [nome, cgc, tipo_pessoa, email, tipo_cadastro, ativo];
    const result = await this.db.query(query, values);
    return result.rows[0];
  }

  async getAll(): Promise<PessoaModel[]> {
    const result = await this.db.query("SELECT * FROM pessoas");
    return result.rows as PessoaModel[];
  }

  async find(id: string): Promise<PessoaModel> {
    const result = await this.db.query("SELECT * FROM pessoas WHERE id=$1", [id]);
    return result.rows[0]; 
  }

  async update(id: string, payload: PessoaModel): Promise<PessoaModel> {
    const { nome, email } = payload;
    const values = [nome, email, id];
    const result = await this.db.query(
      "UPDATE pessoas SET nome = $1, email = $2 WHERE id = $3 Returning *;",
      values
    );
    return result.rows[0]; 
  }
 
 async delete(id: string): Promise<void> {
  try {
    // Remover referências da tabela 'matricula'
    await this.db.query('DELETE FROM matricula WHERE aluno_id = $1', [id]);

    // Remover referências da tabela 'horarios_aulas' relacionadas ao instrutor
    await this.db.query('DELETE FROM horarios_aulas WHERE instrutor_id = $1', [id]);

    
    await this.db.query('DELETE FROM pessoas WHERE id = $1', [id]);
  } catch (error) {
    throw new Error(`Erro ao excluir a pessoa: ${error.message}`);
  }
}



  
  
  
}

