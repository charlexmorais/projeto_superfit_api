
import { InterfaceCrud } from "./interfaces";


type ModalidadesPlanosModel = {
  modalidade_id: string;
  planos_id: string;
};


export class ModalidadePlanos implements InterfaceCrud<ModalidadesPlanosModel> {
  db: any; 
  // Construtor que recebe a conexão com o banco de dados.
  constructor(db: any) {
    this.db = db;
  }

  // Função para validar os dados de criação (pode ser expandida para adicionar validações específicas).
  async validandoDados(payload: ModalidadesPlanosModel) {
    return true; // Pode adicionar lógica de validação aqui.
  }


  async create(
    payload: ModalidadesPlanosModel
  ): Promise<ModalidadesPlanosModel> {
    const { modalidade_id, planos_id } = payload;
    const query = `
    INSERT INTO modalidades_planos ( modalidade_id,planos_id) 
    values ($1, $2 ) Returning *;
  `;
    const values = [modalidade_id, planos_id];
    const result = await this.db.query(query, values);
    return result.rows[0];
  }


  async getAll(): Promise<ModalidadesPlanosModel[]> {
    const result = await this.db.query("SELECT * FROM modalidades_planos");
    return result.rows as ModalidadesPlanosModel[];
  }

 
  async find(id: string): Promise<ModalidadesPlanosModel> {
    const result = await this.db.query(
      "SELECT * FROM modalidades_planos WHERE id=$1",
      [id]
    );
    return result.rows[0]; 
  }

  
  async update(
    id: string,
    payload: ModalidadesPlanosModel
  ): Promise<ModalidadesPlanosModel> {
    const { modalidade_id, planos_id } = payload;
    const values = [modalidade_id, planos_id, id];
    const result = await this.db.query(
      "UPDATE modalidades_planos SET modalidade_id = $1, planos_id = $2 WHERE planos_id = $3 Returning *;",
      values
    );
    return result.rows[0]; 
  }
  
  


  async delete(id: string): Promise<void> {
    const result = await this.db.query("DELETE FROM modalidades_planos WHERE modalidade_id = $1", [
      id,
    ]);
 
  }
}
