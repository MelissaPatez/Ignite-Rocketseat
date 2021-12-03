const express = require("express");
const { v4: uuidv4 } = require("uuid");
const { request, response } = require("express");

const app = express();

app.use(express.json());

//simular banco de dados
const customers = [];


// Criar conta
/*
    cpf -string
    name - strinf
    id - uuid
    statement(extrato) - array []
*/
app.post("/account", (request, response) => {
    const {cpf, name} = request.body; 

    //valida se CPF já existente
    const customerAlreadyExists = customers.some((customer) => customer.cpf === cpf);
    if(customerAlreadyExists){
        return response.status(400).json({error: "Customer already exists!"});
    }

    customers.push({
        cpf,
        name,
        id:uuidv4() ,
        statement: []
    });

    return response.status(201).send();

});



app.listen(3330);