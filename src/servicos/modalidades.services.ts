import { InterfaceCrud } from "./interfaces";

type ModalidadeModel = {
  id?: string;
  nome: string;
};

export class ModalidadeService implements InterfaceCrud<ModalidadeModel> {
  db: any;

  constructor(db: any) {
    this.db = db; // O construtor recebe uma instância de banco de dados e a armazena na propriedade db.
  }
  // / Função para validar os dados de criação (pode ser expandida para adicionar validações específicas).
  async validandoDados(payload: ModalidadeModel) {
    return true; // Pode adicionar lógica de validação aqui.
  }

  async create(payload: ModalidadeModel): Promise<ModalidadeModel> {
    const { nome } = payload;
    const query = `INSERT INTO modalidades (nome) values ($1) Returning *;`;

    const values = [nome];

    const result = await this.db.query(query, values);

    return result.rows[0];
  }

  async getAll(): Promise<ModalidadeModel[]> {
    const result = await this.db.query("SELECT * FROM modalidades");
    return result.rows as [];

    // return result.rows as ModalidadeModel[];
  }

  async find(id: string): Promise<ModalidadeModel> {
    const result = await this.db.query(
      "SELECT * FROM modalidades WHERE id=$1",
      [id]
    );

    return result.rows as ModalidadeModel;
  }

  async update(
    id: string,
    payload: ModalidadeModel
  ): Promise<ModalidadeModel | null> {
    const { nome } = payload;

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

  async delete(id: string): Promise<void> {
    const result = await this.db.query(
      "DELETE FROM modalidades WHERE id = $1",
      [id]
    );
  }
}
