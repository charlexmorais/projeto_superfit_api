// Importando a interface necessária.
import { InterfaceCrud } from "./interfaces";

// Definindo o modelo de dados para uma pessoa.
type ListaInadimplenciaModel = {
  inadimplente_id: string; 
  aluno_id: string;
  data_inadimplencia: string;
  motivo: string;
  valor:string;
};

export class ListaInadimplenciaService
  implements InterfaceCrud<ListaInadimplenciaModel>
{
  db: any;
  // Construtor que recebe a conexão com o banco de dados.
  constructor(db: any) {
    this.db = db;
  }
  // Função para validar os dados de criação (pode ser expandida para adicionar validações específicas).
  async validandoDados(payload: ListaInadimplenciaModel) {
    return true; // Pode adicionar lógica de validação aqui.
  }
   // Função para criar uma nova pessoa no banco de dados.
   async create(payload: ListaInadimplenciaModel): Promise<ListaInadimplenciaModel> {
    const {inadimplente_id,aluno_id,data_inadimplencia,motivo,valor }=payload;
    const query = `
    INSERT INTO lista_inadimplentes ( inadimplente_id,aluno_id,data_inadimplencia,motivo,valor  ) 
    values ($1, $2, $3, $4,$5) Returning *;
  `;
    const values = [ inadimplente_id,aluno_id,data_inadimplencia,motivo,valor ];
    const result = await this.db.query(query, values);
    return result.rows[0];
  }
   // Função para buscar todas as pessoas no banco de dados.
   async getAll(): Promise<ListaInadimplenciaModel[]> {
    const result = await this.db.query("SELECT * FROM lista_inadimplentes");
    return result.rows as ListaInadimplenciaModel[];
  }
  // Função para buscar uma pessoa pelo ID.
  async find(id: string): Promise<ListaInadimplenciaModel> {
    const result = await this.db.query("SELECT * FROM lista_inadimplentes WHERE id=$1", [
      id,
    ]);
    return result.rows[0]; // Retorna a primeira linha encontrada (se houver).
  }
  async update(id: string, payload: ListaInadimplenciaModel): Promise<ListaInadimplenciaModel> {
    const { inadimplente_id,aluno_id,data_inadimplencia,motivo,valor } = payload;
    const values = [inadimplente_id,aluno_id,data_inadimplencia,motivo,valor ];
    const result = await this.db.query(
        "UPDATE lista_inadimplentes SET inadimplente_id = $1,aluno_id = $2, data_inadimplencia= $3, motivo = $4,valor=$5  WHERE id = $6 RETURNING *;",
        values
    );
    return result.rows[0]; // Retorna a primeira linha atualizada.
  }
   // Função para excluir uma pessoa pelo ID.
   async delete(id: string): Promise<void> {
    const result = await this.db.query(
      "DELETE FROM lista_inadimplentes WHERE id = $1",[id
    ]
    );
    
  }
}