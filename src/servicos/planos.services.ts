import { InterfaceCrud } from "./interfaces";

type PlanosModel = {
  id?: string;
  nome: string;
  descricao: string;
  preco: number;
};

export class PlanosService implements InterfaceCrud<PlanosModel> {
  db: any;

  // Construtor que recebe a conexão com o banco de dados.
  constructor(db: any) {
    this.db = db;
  }

  async create(payload: PlanosModel): Promise<PlanosModel> {
    const { nome, descricao, preco } = payload;

    const query = `INSERT INTO planos (nome, descricao, preco) values ($1, $2, $3) Returning *;`;

    const values = [nome, descricao, preco];

    const result = await this.db.query(query, values);

    return result.rows[0];
  }

  async getAll(): Promise<PlanosModel[]> {
    const result = await this.db.query("SELECT * FROM planos");
    return result.rows as PlanosModel[];
  }

  async find(id: string): Promise<PlanosModel> {
    const result = await this.db.query("SELECT * FROM planos WHERE id=$1", [
      id,
    ]);
    return result.rows[0];
  }

  async update(id: string, payload: PlanosModel): Promise<PlanosModel> {
    const { nome, descricao, preco } = payload;
    const values = [nome, descricao, preco, id];
    const result = await this.db.query(
      "UPDATE planos SET nome = $1, descricao = $2 ,preco =$3 WHERE id = $4 Returning *;",
      values
    );
    return result.rows[0];
  }

  async delete(id: string): Promise<void> {
    const result = await this.db.query("DELETE FROM planos WHERE id = $1", [
      id,
    ]);
  }
}
