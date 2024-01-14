const express = require('express');
const bodyParser = require('body-parser');
const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());

const databaseAdapter = new FileSync('database.json');
const db = low(databaseAdapter);

db.defaults({ entities: [], hobbies: [] }).write();

app.post('/entity', (req, res) => {
  const { name, otherField } = req.body;

  if (!name || !otherField) {
    return res.status(400).json({ error: 'Fields cannot be empty' });
  }

  if (isNaN(otherField)) {
    return res.status(400).json({ error: 'Other field must be a number' });
  }

  if (/\d/.test(name)) {
    return res.status(400).json({ error: 'First name cannot contain numbers' });
  }

  const newEntity = { id: Date.now(), name, otherField };
  db.get('entities').push(newEntity).write();

  res.json(newEntity);
});

app.get('/entity', (req, res) => {
  const limit = parseInt(req.query.limit) || 10;
  const offset = parseInt(req.query.offset) || 0;
  const paginatedEntities = db.get('entities').value().slice(offset, offset + limit);
  res.json(paginatedEntities);
});

app.get('/entity/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const entity = db.get('entities').find({ id }).value();
  if (entity) {
    res.json(entity);
  } else {
    res.status(404).json({ error: 'Entity not found' });
  }
});

app.get('/search', (req, res) => {
  const searchTerm = req.query.q;
  if (!searchTerm) {
    return res.status(400).json({ error: 'Search term is required' });
  }

  const searchResults = db.get('entities').filter(ent => ent.name.includes(searchTerm)).value();
  res.json(searchResults);
});

app.put('/entity/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const { name, otherField } = req.body;

  if (!name || !otherField) {
    return res.status(400).json({ error: 'Fields cannot be empty' });
  }

  if (isNaN(otherField)) {
    return res.status(400).json({ error: 'Other field must be a number' });
  }

  if (/\d/.test(name)) {
    return res.status(400).json({ error: 'First name cannot contain numbers' });
  }

  const updatedEntity = db.get('entities').find({ id }).assign({ name, otherField }).write();
  res.json(updatedEntity);
});

app.delete('/entity/:id', (req, res) => {
  const id = parseInt(req.params.id);
  db.get('entities').remove({ id }).write();
  res.json({ message: 'Entity deleted successfully' });
});

app.post('/hobby', (req, res) => {
  const { name } = req.body;

  if (!name) {
    return res.status(400).json({ error: 'Hobby name cannot be empty' });
  }

  const newHobby = { id: Date.now(), name };
  db.get('hobbies').push(newHobby).write();

  res.json(newHobby);
});

app.get('/hobby', (req, res) => {
  const limit = parseInt(req.query.limit) || 10;
  const offset = parseInt(req.query.offset) || 0;
  const paginatedHobbies = db.get('hobbies').value().slice(offset, offset + limit);
  res.json(paginatedHobbies);
});

app.get('/hobby/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const hobby = db.get('hobbies').find({ id }).value();
  if (hobby) {
    res.json(hobby);
  } else {
    res.status(404).json({ error: 'Hobby not found' });
  }
});

app.put('/hobby/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const { name } = req.body;

  if (!name) {
    return res.status(400).json({ error: 'Hobby name cannot be empty' });
  }

  const updatedHobby = db.get('hobbies').find({ id }).assign({ name }).write();
  res.json(updatedHobby);
});

app.delete('/hobby/:id', (req, res) => {
  const id = parseInt(req.params.id);
  db.get('hobbies').remove({ id }).write();
  res.json({ message: 'Hobby deleted successfully' });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
