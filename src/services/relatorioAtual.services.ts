import { Report } from "./interfaces";

type RelatorioModel = {
  id: string;
  nome: string;
  valor: string;
  data_pagamento: string;
  plano_id: string;
  aluno_id: string;
  matricula_id: string;
};

export class RelatorioAtualService implements Report<RelatorioModel> {
  db: any;

  constructor(db: any) {
    this.db = db;
  }

  async get(): Promise<RelatorioModel> {
    const result = await this.db.query(`
    SELECT
    pl.id AS plano_id,
    pl.nome AS nome_plano,
    CURRENT_DATE AS data_pesquisa, -- Campo com a data atual no momento da pesquisa
    COUNT(DISTINCT ma.aluno_id) AS total_alunos,
    COALESCE(SUM(pa.valor), 0) AS valor_total_recebido,
    COALESCE(SUM(CASE WHEN pa.id IS NULL THEN ma.valor_mensalidade ELSE 0 END), 0) AS valor_total_inadimplente,
    COALESCE(STRING_AGG(CASE WHEN pa.id IS NOT NULL THEN pe.nome END, ', '), 'Nenhum aluno') AS alunos_adimplentes,
    COALESCE(STRING_AGG(CASE WHEN pa.id IS NULL THEN pe.nome END, ', '), 'Nenhum aluno') AS alunos_inadimplentes
FROM
    matricula ma
LEFT JOIN
    pagamentos pa ON ma.aluno_id = pa.aluno_id AND ma.plano_id = pa.plano_id AND pa.data_pagamento BETWEEN '2023-01-01' AND '2023-12-31' -- Intervalo de datas
JOIN
    planos pl ON ma.plano_id = pl.id
JOIN
    pessoas pe ON ma.aluno_id = pe.id
WHERE
    ma.data_inicio BETWEEN '2023-01-01' AND '2023-12-31' -- Intervalo de datas para a matrícula
GROUP BY
    pl.id, pl.nome;



    `);
    return result.rows;
  }
}
