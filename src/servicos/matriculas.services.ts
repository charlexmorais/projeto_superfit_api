// Importando a interface necessária.
import { InterfaceCrud } from "./interfaces";

// Definindo o modelo de dados para uma pessoa.
type MatriculaModel = {
  id?: string; // ID é opcional, pois pode ser gerado automaticamente.
  aluno_id:string;
  plano_id:string;
  dia_vencimento: string;
  valor_mensalidade: string;
  data_inicio: string;
  data_fim: string;
}

export class MatriculaService implements InterfaceCrud<MatriculaModel> {
    db: any;
   // Construtor que recebe a conexão com o banco de dados.
  constructor(db: any) {
    this.db = db;
  }
  
   // Função para validar os dados de criação (pode ser expandida para adicionar validações específicas).
  async validandoDados(payload: MatriculaModel) {
    return true; // Pode adicionar lógica de validação aqui.
  }


  // Função para criar uma nova pessoa no banco de dados.
  async create(payload: MatriculaModel): Promise<MatriculaModel> {
    const {aluno_id, plano_id , dia_vencimento,valor_mensalidade,data_inicio,data_fim } = payload;
    const query = `
    INSERT INTO matricula (aluno_id, plano_id ,dia_vencimento,valor_mensalidade,data_inicio,data_fim) 
    values ($1, $2, $3, $4) Returning *;
  `;
    const values = [aluno_id,plano_id,dia_vencimento,valor_mensalidade,data_inicio,data_fim];
    const result = await this.db.query(query, values);
    return result.rows[0];
  }
  // Função para buscar todas as pessoas no banco de dados.
  async getAll(): Promise<MatriculaModel[]> {
    const result = await this.db.query("SELECT * FROM matricula");
    return result.rows as MatriculaModel[];
  }
  
  // Função para buscar uma pessoa pelo ID.
  async find(id: string): Promise<MatriculaModel> {
    const result = await this.db.query("SELECT * FROM matricula WHERE id=$1", [
      id,
    ]);
    return result.rows[0]; // Retorna a primeira linha encontrada (se houver).
  }
  async update(id: string, payload: MatriculaModel): Promise<MatriculaModel> {
    const { aluno_id, plano_id ,dia_vencimento, valor_mensalidade, data_inicio, data_fim } = payload;
    const values = [aluno_id, plano_id ,dia_vencimento, valor_mensalidade, data_inicio, data_fim, id];
    const result = await this.db.query(
        "UPDATE matricula SET aluno_id=$1, plano_id=$2,dia_vencimento = $3, valor_mensalidade = $4, data_inicio = $5, data_fim = $6 WHERE id = $7 RETURNING *;",
        values
    );
    return result.rows[0]; // Retorna a primeira linha atualizada.
  }

   // Função para excluir uma pessoa pelo ID.
  async delete(id: string): Promise<void> {
    const result = await this.db.query(
      "DELETE FROM matricula WHERE id = $1",[id
    ]
    );
    
  }



}