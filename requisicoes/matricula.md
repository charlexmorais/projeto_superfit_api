MATRICULA LISTAR 
URL: /matricula

Método: GET

Headers: Authorization API Key

Resposta:

json

Matriculas listar id
URL: /matricula/:id

Método: GET

Headers: Authorization API Key

Resposta:

json

MATRICULAS CRIAR 
URL: /matricula

Método: POST

Headers: Authorization API Key

Corpo da requisição:

{
  "aluno_id": ,
  "plano_id": ,
  "dia_vencimento": ,
  "valor_mensalidade": "",
  "data_inicio": "",
  "data_fim": ""
}
Resposta:

json

MATRICULAS ATUALIZAR 
URL: /matricula/:id

Método: PUT

Headers: Authorization API Key

Corpo da requisição:

{
  "aluno_id": ,
  "plano_id": ,
  "dia_vencimento": ,
  "valor_mensalidade": "",
  "data_inicio": "",
  "data_fim": ""
}
Resposta:

json

MATRICULAS DELETAR
URL: /matricula/:id

Método: DELETE

Headers: Authorization API Key

Resposta:

json