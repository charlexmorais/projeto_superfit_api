Horarioaulas lista
URL: /horarios

Método: GET

Headers: Authorization API Key

Resposta:

json

Horarioaulas listar id
URL: /horarios/:id

Método: GET

Headers: Authorization API Key

Resposta:

json

Horarioaulas criar
URL: /horarios

Método: POST

Headers: Authorization API Key

Corpo da requisição:

{
  "dia_semana": 0,
  "hora_inicio": "05:00:00",
  "hora_fim": "22:00:00",
  "modalidade_id": 2,
  "instrutor_id": 7
}
Resposta:

json

Horarioaulas atualizar
URL: /horarios/:id

Método: PUT

Headers: Authorization API Key

Corpo da requisição:

{
  "dia_semana": 0,
  "hora_inicio": "05:00:00",
  "hora_fim": "22:00:00",
  "modalidade_id": 2,
  "instrutor_id": 7
}
Resposta:

json

Horarioaulas deletar
URL: /horarios/:id

Método: DELETE

Headers: Authorization API Key

Resposta:

json