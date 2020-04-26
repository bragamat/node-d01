const express = require("express");
const cors = require("cors");

const { uuid, isUuid } = require("uuidv4");

const app = express();

app.use(express.json());
app.use(cors());

let repositories = [];

function checkIdParams(request, response, next) {
  const { id } = request.params;
  if (!isUuid(id)) return response.status(400).send("Bad Resquest");

  const repo = repositories.find(rp => rp.id === id);

  if (!repo) return response.status(404).send("Not Found");

  return next();
}

app.get("/repositories", (request, response) => {
  return response.json(repositories);
});

app.post("/repositories", (request, response) => {
  const { url, title, techs } = request.body;
  const id = uuid();
  repositories.push({ id, url, title, techs, likes: 0 });
  const repo = repositories.find(rp => rp.id === id);
  return response.json(repo);
});

app.put("/repositories/:id", checkIdParams, (request, response) => {
  const { id } = request.params;
  const { likes, ...data } = request.body;
  let repo = repositories.find(rp => rp.id === id);

  repo = { ...repo, ...data };
  repositories.filter(rep => rep.id === id);

  return response.json(repo);
});

app.delete("/repositories/:id", checkIdParams, (request, response) => {
  const { id } = request.params;
  repositories = repositories.filter(repo => repo.id !== id);
  return response.status(204).send("No Content");
});

app.post("/repositories/:id/like", checkIdParams, (request, response) => {
  const { id } = request.params;
  repo = repositories.find(rp => rp.id === id);
  repo.likes += 1;
  repositories.filter(rp => rp.id === id).push(repo);

  return response.json(repo);
});

module.exports = app;
