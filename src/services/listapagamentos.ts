// Importando a interface necessária.
import { InterfaceCrud } from "./interfaces";

// Definindo o modelo de dados para uma pessoa.
type ListaPagamentoModel = {
  pagamento_id: string; 
  aluno_id: string;
  data_pagamento: string;
  valor: string;
};
export class ListaPagamentoService
  implements InterfaceCrud<ListaPagamentoModel>
{
  db: any;
  // Construtor que recebe a conexão com o banco de dados.
  constructor(db: any) {
    this.db = db;
  }
  // Função para validar os dados de criação (pode ser expandida para adicionar validações específicas).
  async createValidator(payload: ListaPagamentoModel) {
    return true; // Pode adicionar lógica de validação aqui.
  }

  // Função para criar uma nova pessoa no banco de dados.
  async create(payload: ListaPagamentoModel): Promise<ListaPagamentoModel> {
    const {pagamento_id, aluno_id,data_pagamento,valor }=payload;
    const query = `
    INSERT INTO lista_de_pagamentos ( pagamento_id, aluno_id,data_pagamento,valor ) 
    values ($1, $2, $3, $4) Returning *;
  `;
    const values = [ pagamento_id, aluno_id,data_pagamento,valor ];
    const result = await this.db.query(query, values);
    return result.rows[0];
  }
   // Função para buscar todas as pessoas no banco de dados.
   async getAll(): Promise<ListaPagamentoModel[]> {
    const result = await this.db.query("SELECT * FROM lista_de_pagamentos");
    return result.rows as ListaPagamentoModel[];
  }
  // Função para buscar uma pessoa pelo ID.
  async find(id: string): Promise<ListaPagamentoModel> {
    const result = await this.db.query("SELECT * FROM lista_de_pagamentos WHERE id=$1", [
      id,
    ]);
    return result.rows[0]; // Retorna a primeira linha encontrada (se houver).
  }
  async update(id: string, payload: ListaPagamentoModel): Promise<ListaPagamentoModel> {
    const { pagamento_id, aluno_id,data_pagamento,valor } = payload;
    const values = [pagamento_id, aluno_id,data_pagamento,valor];
    const result = await this.db.query(
        "UPDATE lista_de_pagamentos SET dia_vencimento = $1,pagamento_id = $2, aluno_id = $3, data_pagamento = $4,valor=$5  WHERE id = $6 RETURNING *;",
        values
    );
    return result.rows[0]; // Retorna a primeira linha atualizada.
  }
   // Função para excluir uma pessoa pelo ID.
   async delete(id: string): Promise<void> {
    const result = await this.db.query(
      "DELETE FROM lista_de_pagamentos WHERE id = $1",[id
    ]
    );
    
  }

}
