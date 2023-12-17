import { InterfaceCrud } from "./interfaces";

type ModalidadesPlanosModel = {
  modalidade_id: string;
  planos_id: string;
};

export class ModalidadePlanos implements InterfaceCrud<ModalidadesPlanosModel> {
  db: any; 

  constructor(db: any) {
    this.db = db;
  }

  async validandoDados(payload: ModalidadesPlanosModel): Promise<boolean> {
    return true; // Pode adicionar lógica de validação aqui
  }

  async create(payload: ModalidadesPlanosModel): Promise<ModalidadesPlanosModel> {
    const { modalidade_id, planos_id } = payload;
    const query = `
      INSERT INTO modalidades_planos (modalidade_id, planos_id) 
      VALUES ($1, $2) RETURNING *;
    `;
    const values = [modalidade_id, planos_id];
    const result = await this.db.query(query, values);
    return result.rows[0];
  }

  async getAll(): Promise<ModalidadesPlanosModel[]> {
    const result = await this.db.query("SELECT * FROM modalidades_planos");
    return result.rows as ModalidadesPlanosModel[];
  }

  async find(id1: string, id2: string): Promise<ModalidadesPlanosModel | null> {
    const query = `
      SELECT * FROM modalidades_planos WHERE modalidade_id = $1 AND planos_id = $2
    `;
    const values = [id1, id2];
    const result = await this.db.query(query, values);

    if (result.rows.length > 0) {
      return result.rows[0] as ModalidadesPlanosModel;
    } else {
      return null;
    }
  }

  async update(id: string, payload: ModalidadesPlanosModel): Promise<ModalidadesPlanosModel> {
    const { modalidade_id, planos_id } = payload;
    const values = [modalidade_id, planos_id, id];
    const query = `
      UPDATE modalidades_planos SET modalidade_id = $1, planos_id = $2 WHERE planos_id = $3 RETURNING *;
    `;
    const result = await this.db.query(query, values);
    return result.rows[0];
  }

  async delete(id: string): Promise<void> {
    const result = await this.db.query("DELETE FROM modalidades_planos WHERE modalidade_id = $1", [id]);
    // Podes adicionar lógica para verificar se a exclusão ocorreu com sucesso
  }
}