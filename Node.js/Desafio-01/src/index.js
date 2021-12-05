const { application, request, response } = require("express");
const express = require("express");
const {v4: uuidv4} = require("uuid");


const app = express();


app.use(express.json());

const users = [];

// - Criar um novo *todo*;
// - Listar todos os *todos*;
// - Alterar o `title` e `deadline` de um *todo* existente;
// - Marcar um *todo* como feito;
// - Excluir um *todo*;

//Middlewares
function checkExistsUserAccount(request, response, next) {
    const { username } = request.headers;

    //validando se o name existe
    const user = users.find((user) => user.username === username);

    if(!user){
        return response.status(404).json({error: "User Not Found"});
    }

    request.user = user;

    return next();
};

// Criar User
/*
    name - string
    username: - string
    id - uuid
    todos - array []
*/
app.post("/users",  (request, response) => {
    const { name, username } = request.body;

    const userExists = users.find((user) => user.username === username);

    if(userExists){
        return response.status(400).json({error: "Username already exists"});
    }

    const user = {
        name,
        username,
        id:uuidv4() ,
        todos: [],
    };

    users.push(user);

    return response.status(201).json(user);
});

//criando tarefa
app.post("/todos", checkExistsUserAccount, (request, response) => {
    const { title, deadline } = request.body;
    const { user } = request;

    const todo = {
        title,
        done: false,
        id: uuidv4(),
        deadline: new Date(deadline),
        created_at: new Date(),
    }

    user.todos.push(todo);

    return response.status(201).json(userOperation);
});

//buscar tarefas
app.get("/todos", checkExistsUserAccount, (request, response) => {
    const { user } = request;

    return response.json(user.todos);
});

app.put("/todos/:id", checkExistsUserAccount, (request, response) => {
    const { title, deadline } = request.body;
    const { id } = request.params;
    const { user } = request;

    const checkTodo =  user.todos.find(todo => todo.id === id);

    if(!checkTodo){
        return response.status(404).json({error: "Not Found"});
    }

    checkTodo.title = title;
    checkTodo.deadline = new Date(deadline);

    return response.json(checkTodo);
});

app.patch("/todos/:id/done",checkExistsUserAccount,(request,response) => {
    const { id } = request.params;
    const { user } = request;

    const checkTodo=  user.todos.find(todo => todo.id === id);

    if(!checkTodo){
        return response.status(404).json({error: "Not Found"});
    }

    checkTodo.done = true;

    return response.json(checkTodo);
});

app.delete("/todos/:id", checkExistsUserAccount, (request, response) => {
    const { id } = request.params;
    const { user } = request;

    const todoIndex =  user.todos.findIndex(todo => todo.id === id);

    if(todoIndex === -1){
        return response.status(404).json({error: "Not Found"});
    }

    user.todos.splice(todoIndex, 1);

    return response.status(204).send();
});

app.listen(3333);