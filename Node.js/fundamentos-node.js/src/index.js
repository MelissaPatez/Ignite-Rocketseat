const { response, request } = require('express');
const express = require('express');

const app = express();

//para receber json - body params post
app.use(express.json());
 
/*
GET - Leitura
POST - Criação
PUT - Atualização
DELETE -  Deleção
PATCH - Atualização parcial 

*/

/*
Tipo de parametros:

Route Params --> indentificar um recurso para poder deletar/editar/buscar
Query Params --> filtro/paginação 
Body Paramd --> Objetos inserção/alteração (JSON)

*/


app.get("/courses", (request, response) =>{
    const query = request.query;
    console.log(query);
    return response.json([
        "Curso 1",
        "Curso 2",
        "Curso 3"
    ]);
});

//pelo insonia/postman

app.post("/courses", (request, response) => {
    const body = request.body;
    console.log(body);
    return response.json(["Curso 1", "Curso 2", "Curso 3"," Curso 4"]);
});

app.put("/courses/:id", (request, response) => {
    const params = request.params;
    const {id} = request.params;
    console.log(params, id);
    return response.json(["Curso 1novo", "Curso 2", "Curso 3"," Curso 4"]);
});

app.patch("/courses/:id", (request, response) => {
    return response.json(["Curso 1novo", "Curso 2novopatch", "Curso 3"," Curso 4"]);
});

app.delete("/courses/:id", (request, response) => {
    return response.json(["Curso 1novo", "Curso 2novopatch", " Curso 4"]);
});

//localhost:3333
app.listen(3333)