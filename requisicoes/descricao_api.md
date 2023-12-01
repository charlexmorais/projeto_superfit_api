Descrição da API
Visão Geral
Esta plataforma oferece acesso a uma variedade de recursos para simplificar suas interações com nossos serviços. Utilize nossa API para gerenciar informações, realizar operações essenciais e obter dados relevantes para sua aplicação.

Tecnologias utilizadas

TypeScript
Node.js
Express.js
PostgreSQL
dontenv
JSON Web Tokens (JWT)

Autenticação
Para acessar os recursos da API, é necessário autenticar-se utilizando JWT (JSON Web Token). Inclua um token válido no cabeçalho x-api-key em todas as requisições.

Como Obter um Token JWT
Para obter um token JWT, faça uma requisição de autenticação utilizando suas credenciais de acesso:

Login
URL: /login

Método: POST

Corpo da requisição:

JSON
{
"cgc":"35656310000143",
"email":"carlaperez@gmail.com"
}

PARA ACESSAR AS DEMAIS RECURSOS :
key value
CONTENT-TYPE application/ json
x-api-key inserir o token

Recursos Disponíveis

PESSOAS
Endpoints
GET/http://localhost:3000/pessoas/:id
GET/http://localhost:3000/pessoas
POST/http://localhost:3000/pessoas
PUT/http://localhost:3000/pessoas/:ID
DELETE/http://localhost:3000/pessoas/:id

---

MODALIDADES
GET/http://localhost:3000/modalidades/:id
GET/http://localhost:3000/modalidades
POST/http://localhost:3000/modalidades
PUT/http://localhost:3000/modalidades/:ID
DELETE/http://localhost:3000/modalidades/:id

---

PLANOS
GET/http://localhost:3000/planos/:id
GET/http://localhost:3000/planos
POST/http://localhost:3000/planos
PUT/http://localhost:3000/planos/:ID
DELETE/http://localhost:3000/planos/:id

---

MATRICULA
GET/http://localhost:3000/matricula/:id
GET/http://localhost:3000/matricula
POST/http://localhost:3000/matricula
PUT/http://localhost:3000/matricula/:ID
DELETE/http://localhost:3000/matricula/:id

---

HORARIOS_AULAS
GET/http://localhost:3000/horarios/:id
GET/http://localhost:3000/horarios
POST/http://localhost:3000/horarios
PUT/http://localhost:3000/horarios/:ID
DELETE/http://localhost:3000/horarios/:id

---

RELATORIO
GET/http://localhost:3000/relatorioatual/:id
GET/http://localhost:3000/relatorioatual
POST/http://localhost:3000/relatorioatual
PUT/http://localhost:3000/relatorioatual/:ID
DELETE/http://localhost:3000/relatorioatual/:id

---

MODALIDADE_PLANOS

GET/http://localhost:3000/modalidadeplanos/:id
GET/http://localhost:3000/modalidadeplanos
POST/http://localhost:3000/modalidadeplanos
PUT/http://localhost:3000/modalidadeplanos/:ID
DELETE/http://localhost:3000/modalidadeplanos/:id

