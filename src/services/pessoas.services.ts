// Importando a interface necessária.
import { InterfaceCrud } from "./interfaces";

// Definindo o modelo de dados para uma pessoa.
type PessoaModel = {
  id?: string; // ID é opcional, pois pode ser gerado automaticamente.
  nome: string;
  email: string;
  cgc: string; // cnpj ou cpf 
  tipo_pessoa: string;
  tipo_cadastro: string;
  ativo: string;
};

// Classe que implementa a interface de operações CRUD.
export class PessoaService implements InterfaceCrud<PessoaModel> {
  db: any; // Conexão com o banco de dados.

  // Construtor que recebe a conexão com o banco de dados.
  constructor(db: any) {
    this.db = db;
  }

  // Função para validar os dados de criação (pode ser expandida para adicionar validações específicas).
  async createValidator(payload: PessoaModel) {
    return true; // Pode adicionar lógica de validação aqui.
  }

  // Função para criar uma nova pessoa no banco de dados.
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

  // Função para buscar todas as pessoas no banco de dados.
  async getAll(): Promise<PessoaModel[]> {
    const result = await this.db.query("SELECT * FROM pessoas");
    return result.rows as PessoaModel[];
  }

  // Função para buscar uma pessoa pelo ID.
  async find(id: string): Promise<PessoaModel> {
    const result = await this.db.query("SELECT * FROM pessoas WHERE id=$1", [
      id,
    ]);
    return result.rows[0]; // Retorna a primeira linha encontrada (se houver).
  }
  // Função para atualizar os dados de uma pessoa pelo ID.
  async update(id: string, payload: PessoaModel): Promise<PessoaModel> {
    const { nome, email } = payload;
    const values = [nome, email, id];
    const result = await this.db.query(
      "UPDATE pessoas SET nome = $1, email = $2 WHERE id = $3 Returning *;",
      values
    );
    return result.rows[0]; // Retorna a primeira linha atualizada.
  }
  // ...
  // ...

  // Função para excluir uma pessoa pelo ID.
  async delete(id: string): Promise<void> {
    const result = await this.db.query("DELETE FROM pessoas WHERE id = $1", [
      id,
    ]);
    // Não é necessário retornar nada, já que a pessoa foi excluída.
  }

  // ...
}
