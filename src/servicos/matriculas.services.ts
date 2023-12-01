import { InterfaceCrud } from "./interfaces";

type MatriculaModel = {
  id?: string;
  aluno_id: string;
  plano_id: string;
  dia_vencimento: string;
  valor_mensalidade: string;
  data_inicio: string;
  data_fim: string;
};

export class MatriculaService implements InterfaceCrud<MatriculaModel> {
  db: any;

  constructor(db: any) {
    this.db = db;
  }

  async validandoDados(payload: MatriculaModel): Promise<boolean> {
    return true; // Pode adicionar lógica de validação aqui
  }

  async create(payload: MatriculaModel): Promise<MatriculaModel> {
    const {
      aluno_id,
      plano_id,
      dia_vencimento,
      valor_mensalidade,
      data_inicio,
      data_fim,
    } = payload;
    const query = `
    INSERT INTO matricula (aluno_id, plano_id ,dia_vencimento,valor_mensalidade,data_inicio,data_fim) 
    values ($1, $2, $3, $4,$5,$6) Returning *;
  `;
    const values = [
      aluno_id,
      plano_id,
      dia_vencimento,
      valor_mensalidade,
      data_inicio,
      data_fim,
    ];
    const result = await this.db.query(query, values);
    return result.rows[0];
  }
  
  async getAll(): Promise<MatriculaModel[]> {
    const result = await this.db.query("SELECT * FROM matricula");
    return result.rows as MatriculaModel[];
  }

  async find(id: string): Promise<MatriculaModel> {
    const result = await this.db.query("SELECT * FROM matricula WHERE id=$1", [
      id,
    ]);
    return result.rows[0]; 
  }

  async update(
    alunoId: string,
    payload: MatriculaModel
  ): Promise<MatriculaModel> {
    try {
      const existingData = await this.db.query(
        "SELECT * FROM matricula WHERE aluno_id = $1",
        [alunoId]
      );
      console.log(`Dados existentes com aluno_id ${alunoId}:`, existingData.rows);

      const {
        plano_id,
        dia_vencimento,
        valor_mensalidade,
        data_inicio,
        data_fim,
      } = payload;

      // Convertendo a data para o formato 'AAAA-MM-DD'
      const formattedDataInicio = new Date(data_inicio)
        .toISOString()
        .split("T")[0];
      const formattedDataFim = new Date(data_fim).toISOString().split("T")[0];

      const values = [
        alunoId,
        plano_id,
        dia_vencimento,
        valor_mensalidade,
        formattedDataInicio,
        formattedDataFim,
      ];

      const result = await this.db.query(
        "UPDATE matricula SET plano_id=$2, dia_vencimento=$3, valor_mensalidade=$4, data_inicio=$5, data_fim=$6 WHERE aluno_id=$1 RETURNING *;",
        values
      );

      console.log(
        "Consulta SQL:",
        "UPDATE matricula SET plano_id=$2, dia_vencimento=$3, valor_mensalidade=$4, data_inicio=$5, data_fim=$6 WHERE aluno_id=$1 RETURNING *;"
      );
      console.log("Valores:", values);

      if (result.rowCount > 0) {
        return result.rows[0];
      } else {
        throw new Error(`Nenhum registro atualizado para aluno_id ${alunoId}`);
      }
    } catch (error) {
      console.error("Erro ao atualizar entrada:", error);
      throw error;
    }
  }
 
  async delete(alunoId: string): Promise<void> {
    try {
      const result = await this.db.query("DELETE FROM matricula WHERE aluno_id = $1", [
        alunoId,
      ]);
      if (result.rowCount === 0) {
        throw new Error(`Nenhum registro encontrado para aluno_id ${alunoId}`);
      }
    } catch (error) {
      console.error("Erro ao excluir entrada:", error);
      throw error;
    }
  }
}
