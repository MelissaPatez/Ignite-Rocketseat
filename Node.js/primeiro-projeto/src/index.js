const express = require("express");
const { v4: uuidv4 } = require("uuid");
const { request, response } = require("express");

const app = express();

app.use(express.json());

//simular banco de dados
const customers = [];

//Middleware
function verifyIfExistsAccountCPF(request, response, next){
    const { cpf } = request.headers;

    //validando se o cpf existe
    const customer = customers.find((customer) => customer.cpf === cpf);

    if(!customer){
        return response.status(400).json({error: "Customer Not Found"});
    };
    request.customer = customer;

    return next();
}; 

// calculo saldo
function getBalance(statement) {
    const balance = statement.reduce((acc, operation) => {
        if(operation.type === "credit"){
            return acc + operation.amount;
        }else{
            return acc - operation.amount;
        }
    }, 0);
    return balance;
}

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
        statement: [],
    });

    return response.status(201).send();

});

//fazer deposito
app.post("/deposit", verifyIfExistsAccountCPF, (request, response) => {
    const { description, amount } = request.body;

    const { customer } = request;

    const statementOperation = {
        description,
        amount,
        created_at: new Date(),
        type: "credit"
    }

    customer.statement.push(statementOperation);

    return response.status(201).send();
});

//saque
app.post("/withdraw", verifyIfExistsAccountCPF, (request, response) =>{
    const{ amount } = request.body;
    const { customer } = request;

    const balance = getBalance(customer.statement);

    if (balance < amount){
        return response.status(400).json({error: "Insufficient funds!"});
    }

    const statementOperation = {
        amount,
        created_at: new Date(),
        type: "debit"
    }
    customer.statement.push(statementOperation);

    return response.status(201).send();
});

//buscar extrato       //middleware
app.get("/statement", verifyIfExistsAccountCPF, (request, response) => {
    const { customer } = request;

    return response.json(customer.statement);
});


//buscar o extrato bancário do cliente por data
app.get("/statement/date", verifyIfExistsAccountCPF, (request, response) => {
    const { customer } = request;
    const { date } = request.query;

    const dateFormat = new Date(date + " 00:00");

    //percorrer array e retornar o extrato do dia
    const statement = customer.statement.filter((statement) => statement.created_at.toDateString() === new Date(dateFormat).toDateString())

    return response.json(statement);
});

//atualizar dados
app.put("/account", verifyIfExistsAccountCPF,(request, response) => {
    const { name } = request.body;
    const { customer } = request;

    customer.name = name;

    return response.status(201).send();
});

//buscar dados da conta 
app.get("/account", verifyIfExistsAccountCPF,(request, response) => {
    const { customer } = request;

    return response.json(customer);
})

app.delete("/account", verifyIfExistsAccountCPF, (request, response) => {
    const { customer } = request;
    
    //splice
    customers.splice(customer, 1);

    return response.status(200).json(customers);
});

app.get("/balance", verifyIfExistsAccountCPF, (request, response) => {
    const { customer } = request;

    const balance = getBalance(customer.statement);
    
    return response.json(balance);

});

app.listen(3330);