const express = require("express");
const cors = require("cors");

const { v4: uuid } = require('uuid');
const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

app.get("/repositories", (request, response) => {

  if(!repositories.length){
    return response.status(404).send({message: 'Lista Vazia!'})
  };

  return response.status(200).send(repositories);
});

app.post("/repositories", (request, response) => {
  const {title, url, techs} = request.body;

  const repository = {
    id: uuid(),
    title,
    url,
    techs,
    likes: 0,
  };

  repositories.push(repository);

  return response.status(201).send(repository);

});

app.put("/repositories/:id", (request, response) => {
  const { id } = request.params;
  const { title, url, techs } = request.body;

  const index = repositories.findIndex(repo => repo.id === id);

  if(index === -1){
    return response.status(400).send({message: 'Repositório não existe.'});
  };

  repositories[index].title = title;
  repositories[index].url = url;
  repositories[index].techs = techs;

  return response.send(repositories[index]);
});

app.delete("/repositories/:id", (request, response) => {
  const { id } = request.params;

  const index = repositories.findIndex(repo => repo.id === id);

  if(index === -1){
    return response.status(400).send();
  }

  repositories.splice(index, 1);

  return response.status(204).send();
});

app.post("/repositories/:id/like", (request, response) => {
  const { id } = request.params;

  const repository = repositories.find(repo => repo.id === id);

  if(!repository){
    return response.status(400).send({message: 'Repositório não encontrado.'});
  }

  repository.likes += 1;

  return response.send(repository);
});

module.exports = app;
