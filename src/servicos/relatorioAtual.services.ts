import { Report } from "./interfaces";

export class RelatorioAtualService implements Report<any[]> {
  db: any;

  constructor(db: any) {
    this.db = db;
  }

  async get(): Promise<any[]> {
    const result = await this.db.query(`
      SELECT
        pl.nome AS nome_plano,
        pl.preco AS valor_plano, -- Alterando para o nome correto da coluna
        CURRENT_DATE AS data_pesquisa,
        COUNT(DISTINCT ma.aluno_id) AS total_alunos,
        COALESCE(SUM(pa.valor), 0) AS valor_total_recebido,
        COALESCE(SUM(CASE WHEN pa.matricula_id IS NULL THEN ma.valor_mensalidade ELSE 0 END), 0) AS valor_total_inadimplente,
        COALESCE(STRING_AGG(CASE WHEN pa.matricula_id IS NOT NULL THEN pe.nome END, ', '), 'Nenhum aluno') AS alunos_adimplentes,
        COALESCE(STRING_AGG(CASE WHEN pa.matricula_id IS NULL THEN pe.nome END, ', '), 'Nenhum aluno') AS alunos_inadimplentes
      FROM
        matricula ma
      LEFT JOIN
        pagamentos pa ON ma.id = pa.matricula_id AND pa.data_pagamento BETWEEN '2023-01-01' AND '2023-12-31'
      JOIN
        planos pl ON ma.plano_id = pl.id
      JOIN
        pessoas pe ON ma.aluno_id = pe.id
      WHERE
        ma.data_inicio BETWEEN '2023-01-01' AND '2023-12-31'
      GROUP BY
        pl.nome, pl.preco; 
    `);
    return result.rows;
  }
}
