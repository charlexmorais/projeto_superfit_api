import { InterfaceCrud } from "./interfaces";

// Define o tipo de dados que representa um objeto Modalidade.
type ModalidadeModel = {
  id?: string; // O campo id é opcional, indicando que pode ser nulo ou indefinido.
  nome: string; // O campo nome é uma string obrigatória.
};

// Classe ModalidadeService que implementa a InterfaceCrud para objetos Modalidade.
export class ModalidadeService implements InterfaceCrud<ModalidadeModel> {
  db: any; // Propriedade para armazenar uma instância de banco de dados ou conexão.

  constructor(db: any) {
    this.db = db; // O construtor recebe uma instância de banco de dados e a armazena na propriedade db.
  }
  // / Função para validar os dados de criação (pode ser expandida para adicionar validações específicas).
  async validandoDados(payload: ModalidadeModel) {
    return true; // Pode adicionar lógica de validação aqui.
  }

  // Método para criar um novo objeto Modalidade no banco de dados.
  async create(payload: ModalidadeModel): Promise<ModalidadeModel> {
    const { nome } = payload; // Extrai o campo nome do payload.

    const query = `INSERT INTO modalidades (nome) values ($1) Returning *;`;
    // Define a consulta SQL para inserir um novo registro na tabela modalidades.

    const values = [nome]; // Prepara os valores para a consulta.

    const result = await this.db.query(query, values);
    // Executa a consulta no banco de dados.

    return result.rows[0];
    // Retorna o primeiro registro da resposta do banco de dados, que é o novo objeto Modalidade criado.
  }

  // Método para obter todos os objetos Modalidade do banco de dados.
  async getAll(): Promise<ModalidadeModel[]> {
    const result = await this.db.query("SELECT * FROM modalidades");
    return result.rows as [];
    // Executa uma consulta para obter todos os registros na tabela modalidades.

    return result.rows as ModalidadeModel[];
    // Retorna os registros obtidos do banco de dados como um array de objetos Modalidade.
  }

  // Método para encontrar um objeto Modalidade com base em seu ID.
  async find(id: string): Promise<ModalidadeModel> {
    const result = await this.db.query("SELECT * FROM modalidades WHERE id=$1", [id]);
    // Executa uma consulta para encontrar um registro específico com base no ID.

    return result.rows as ModalidadeModel;
    // Retorna o registro encontrado como um objeto Modalidade.
  }

 // Método para atualizar um objeto Modalidade com base em seu ID.
async update(id: string, payload: ModalidadeModel): Promise<ModalidadeModel | null> {
  const { nome } = payload; // Extrai o novo nome da modalidade do payload.

  const query = `UPDATE modalidades SET nome = $1 WHERE id = $2 RETURNING *;`;
  // Define a consulta SQL para atualizar o nome da modalidade com base no ID.

  const values = [nome, id]; // Prepara os valores para a consulta.

  const result = await this.db.query(query, values);
  // Executa a consulta no banco de dados para atualizar o nome da modalidade.

  if (result.rows.length === 0) {
    return null; // Se não encontrar a modalidade, retorna null.
  }

  return result.rows[0] as ModalidadeModel;
  // Retorna o primeiro registro da resposta do banco de dados, que é o objeto Modalidade atualizado.
}

  // Função para excluir uma pessoa pelo ID.
async delete(id: string): Promise<void> {
  const result = await this.db.query("DELETE FROM modalidades WHERE id = $1", [id]);
  // Não é necessário retornar nada, já que a pessoa foi excluída.
}

}
