import { InterfaceCrud } from "./interfaces";

type PagamentoModel = {
  matricula_id: string; // ou string, dependendo do tipo de identificador
  data_pagamento: string; // utilizando o tipo Date para representar a data
  valor: string; // utilizando o tipo number para representar o valor
};


export class PagamentoService implements InterfaceCrud<PagamentoModel> {
  db: any;

  constructor(db: any) {
    this.db = db;
  }

  async create(payload: PagamentoModel): Promise<PagamentoModel> {
    const { matricula_id, data_pagamento, valor } = payload;

    const query = `
      INSERT INTO pagamentos (matricula_id, data_pagamento, valor) 
      VALUES ($1, $2, $3) RETURNING *;
    `;
    const values = [matricula_id, data_pagamento, valor];

    try {
      const result = await this.db.query(query, values);
      return result.rows[0];
    } catch (error) {
      throw new Error(`Erro ao criar pagamento: ${error.message}`);
    }
  }
  
  async getAll(): Promise<PagamentoModel[]> {
    const result = await this.db.query("SELECT * FROM pagamentos");
    return result.rows as PagamentoModel[];
  }

  async find(id: string): Promise<PagamentoModel> {
    const result = await this.db.query("SELECT * FROM pagamentos WHERE id=$1", [id]);
    return result.rows[0]; 
  }

  async update(id: string, payload: PagamentoModel): Promise<PagamentoModel> {
    try {
      const { matricula_id, data_pagamento, valor } = payload;

      const query = `
        UPDATE pagamentos 
        SET 
          matricula_id = $1,  
          data_pagamento = $2, 
          valor = $3 
        WHERE id = $4 RETURNING *;
      `;
      const values = [matricula_id, data_pagamento, valor, id];

      const result = await this.db.query(query, values);

      if (result.rowCount > 0) {
        return result.rows[0];
      } else {
        throw new Error(`Nenhum registro atualizado para o ID ${id}`);
      }
    } catch (error) {
      console.error("Erro ao atualizar entrada:", error);
      throw error;
    }
  }

  async delete(id: string): Promise<void> {
    try {
      const result = await this.db.query("DELETE FROM pagamentos WHERE id = $1", [id]);
      if (result.rowCount === 0) {
        throw new Error(`Nenhum registro encontrado para o ID ${id}`);
      }
    } catch (error) {
      console.error("Erro ao excluir entrada:", error);
      throw error;
    }
  }
}
