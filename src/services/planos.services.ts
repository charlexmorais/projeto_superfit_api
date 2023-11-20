import { InterfaceCrud } from "./interfaces";

// Definindo o modelo de dados para um plano.
type PlanosModel = {
  id?: string; // ID é opcional, pois pode ser gerado automaticamente.
  nome: string;
  descricao: string;
  preco: number;
};

// Classe que implementa a interface de operações CRUD.
export class PlanosService implements InterfaceCrud<PlanosModel> {
  db: any; // Conexão com o banco de dados.

  // Construtor que recebe a conexão com o banco de dados.
  constructor(db: any) {
    this.db = db;
  }

  // Função para validar os dados de criação (pode ser expandida para adicionar validações específicas).
  async createValidator(payload: PlanosModel) {
    return true; // Pode adicionar lógica de validação aqui.
  }

  // Método para criar um novo objeto PlanosModel no banco de dados.
  async create(payload: PlanosModel): Promise<PlanosModel> {
    const { nome, descricao, preco } = payload; // Extrai os campos do payload.

    const query = `INSERT INTO planos (nome, descricao, preco) values ($1, $2, $3) Returning *;`;
    // Define a consulta SQL para inserir um novo registro na tabela planos.

    const values = [nome, descricao, preco]; // Prepara os valores para a consulta.

    const result = await this.db.query(query, values);
    // Executa a consulta no banco de dados.

    return result.rows[0];
    // Retorna o primeiro registro da resposta do banco de dados, que é o novo objeto PlanosModel criado.
  }

  // Função para buscar todas as pessoas no banco de dados.
  async getAll(): Promise<PlanosModel[]> {
    const result = await this.db.query("SELECT * FROM planos");
    return result.rows as PlanosModel[];
  }
  // Função para buscar uma pessoa pelo ID.
  async find(id: string): Promise<PlanosModel> {
    const result = await this.db.query("SELECT * FROM planos WHERE id=$1", [
      id,
    ]);
    return result.rows[0]; // Retorna a primeira linha encontrada (se houver).
  }
//   / Função para atualizar os dados de uma pessoa pelo ID.
  async update(id: string, payload: PlanosModel): Promise<PlanosModel> {
    const { nome, descricao, preco } = payload;
    const values=[ nome, descricao, preco,id ];
    const result = await this.db.query(
      "UPDATE planos SET nome = $1, descricao = $2 ,preco =$3 WHERE id = $4 Returning *;",
      values
    );
    return result.rows[0]; // Retorna a primeira linha atualizada.
  }
   // Função para excluir uma pessoa pelo ID.
   async delete(id: string): Promise<void> {
    const result = await this.db.query("DELETE FROM planos WHERE id = $1", [
      id,
    ]);
    // Não é necessário retornar nada, já que a pessoa foi excluída.
  }
}
