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
   

    const values = [nome, id]; 

    const result = await this.db.query(query, values);
    

    if (result.rows.length === 0) {
      return null; 
    }

    return result.rows[0] as ModalidadeModel;
   
  }

  async delete(id: string): Promise<void> {
    const result = await this.db.query(
      "DELETE FROM modalidades WHERE id = $1",
      [id]
    );
  }
}
