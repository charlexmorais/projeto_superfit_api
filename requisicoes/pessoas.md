PESSOAS CRIAR
Método: POST

Headers: Authorization API Key

Corpo da requisição:

{
"nome": "charle",
"email": "charle@gmail.com",
"cgc": "09200772685",
"tipo_pessoa": "A",
"tipo_cadastro": "F",
"ativo": "S"
};
---------------------------------------------
PESSOAS ATUALIZAR

URL: /pessoas/:id

Método: POST

Headers: Authorization API Key

Corpo da requisição:

    {

    "nome": "aldo",
    "cgc": "59041558000168",
    "tipo_pessoa": "J",
    "email": "josealdo@gmail.com",
    "tipo_cadastro": "P",
    "ativo": "1"
}
----------------------------------------------
PESSOAS DELETAR
URL: /pessoas/:id

Método: DELETE

Headers: Authorization API Key

Resposta:

json
-----------------------------------------------
lISTAR PESSOAS
URL: /pessoas

Método: GET

Headers: Authorization API Key

Resposta:

json
----------------------------------------------
 LISTAR PESSOAS POR  id
URL: /pessoas/:id

Método: GET

Headers: Authorization API Key

Resposta:

json