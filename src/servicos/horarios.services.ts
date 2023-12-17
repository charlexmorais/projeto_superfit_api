
import { InterfaceCrud } from "./interfaces";

// modelo de dados
type HorariosModel = {
  id?: string;
  dia_semana: string;
  hora_inicio: string;
  hora_fim: string;
  modalidade_id: string;
  instrutor_id: string;
};

export class HorariosService implements InterfaceCrud<HorariosModel> {
  db: any;
  // Construtor que recebe a conexão com o banco de dados.
  constructor(db: any) {
    this.db = db;
  }
  
  async create(payload: HorariosModel): Promise<HorariosModel> {
    const { dia_semana, hora_inicio, hora_fim, modalidade_id, instrutor_id } =
      payload;
    const query = `
    INSERT INTO horarios_aulas ( dia_semana,hora_inicio,hora_fim,modalidade_id,instrutor_id) 
    values ($1, $2, $3,$4,$5) Returning *;
  `;
    const values = [
      dia_semana,
      hora_inicio,
      hora_fim,
      modalidade_id,
      instrutor_id,
    ];
    const result = await this.db.query(query, values);
    return result.rows[0];
  }

  async getAll(): Promise<HorariosModel[]> {
    const result = await this.db.query("SELECT * FROM horarios_aulas");
    return result.rows as HorariosModel[];
  }

  async find(id: string): Promise<HorariosModel> {
    const result = await this.db.query(
      "SELECT * FROM horarios_aulas WHERE id=$1",
      [id]
    );
    return result.rows[0];
  }
  async update(id: string, payload: HorariosModel): Promise<HorariosModel> {
    const { dia_semana, hora_inicio, hora_fim, modalidade_id, instrutor_id } =
      payload;
    const values = [
      dia_semana,
      hora_inicio,
      hora_fim,
      modalidade_id,
      instrutor_id,
      id,
    ]; 
    const result = await this.db.query(
      "UPDATE horarios_aulas SET dia_semana = $1, hora_inicio = $2, hora_fim = $3, modalidade_id = $4, instrutor_id = $5 WHERE id = $6 RETURNING *;",
      values
    );
    return result.rows[0];
  }

  async delete(id: string): Promise<void> {
    const result = await this.db.query(
      "DELETE FROM horarios_aulas WHERE id = $1",
      [id]
    );
  }
}
