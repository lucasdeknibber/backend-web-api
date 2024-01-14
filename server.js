const express = require('express');
const bodyParser = require('body-parser');
const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');
const _ = require('lodash');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());

let entities = [];

// Create JSON file adapter for entities
const entityAdapter = new FileSync('entityDatabase.json');
const entityDb = low(entityAdapter);

// Create 'entities' collection in the database if it doesn't exist
entityDb.defaults({ entities: [] }).write();

// Create Entity
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
  entityDb.get('entities').push(newEntity).write();

  res.json(newEntity);
});

// Read all Entities with pagination
app.get('/entity', (req, res) => {
  const limit = parseInt(req.query.limit) || 10;
  const offset = parseInt(req.query.offset) || 0;
  const paginatedEntities = entityDb.get('entities').slice(offset, offset + limit).value();
  res.json(paginatedEntities);
});

// Read Entity by ID
app.get('/entity/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const entity = entityDb.get('entities').find({ id }).value();
  if (entity) {
    res.json(entity);
  } else {
    res.status(404).json({ error: 'Entity not found' });
  }
});
// Search Entities by name
app.get('/search', (req, res) => {
  const searchTerm = req.query.q;
  if (!searchTerm) {
    return res.status(400).json({ error: 'Search term is required' });
  }
  const searchResults = entityDb.get('entities').filter(ent => ent.name.includes(searchTerm)).value();
  res.json(searchResults);
});

// Update Entity
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

  const updatedEntity = entityDb.get('entities').find({ id }).assign({ name, otherField }).write();
  res.json(updatedEntity);
});

// Delete Entity
app.delete('/entity/:id', (req, res) => {
  const id = parseInt(req.params.id);
  entityDb.get('entities').remove({ id }).write();
  res.json({ message: 'Entity deleted successfully' });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
// ... (previous code remains unchanged)

// Create JSON file adapter for hobbies
const hobbyAdapter = new FileSync('hobbyDatabase.json');
const hobbyDb = low(hobbyAdapter);

// Create 'hobbies' collection in the database if it doesn't exist
hobbyDb.defaults({ hobbies: [] }).write();

// Create Hobby
app.post('/hobby', (req, res) => {
  const { name } = req.body;

  if (!name) {
    return res.status(400).json({ error: 'Hobby name cannot be empty' });
  }

  const newHobby = { id: Date.now(), name };
  hobbyDb.get('hobbies').push(newHobby).write();

  res.json(newHobby);
});

// Read all Hobbies with pagination
app.get('/hobby', (req, res) => {
  const limit = parseInt(req.query.limit) || 10;
  const offset = parseInt(req.query.offset) || 0;
  const paginatedHobbies = hobbyDb.get('hobbies').slice(offset, offset + limit).value();
  res.json(paginatedHobbies);
});

// Read Hobby by ID
app.get('/hobby/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const hobby = hobbyDb.get('hobbies').find({ id }).value();
  if (hobby) {
    res.json(hobby);
  } else {
    res.status(404).json({ error: 'Hobby not found' });
  }
});

// Update Hobby
app.put('/hobby/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const { name } = req.body;

  if (!name) {
    return res.status(400).json({ error: 'Hobby name cannot be empty' });
  }

  const updatedHobby = hobbyDb.get('hobbies').find({ id }).assign({ name }).write();
  res.json(updatedHobby);
});

// Delete Hobby
app.delete('/hobby/:id', (req, res) => {
  const id = parseInt(req.params.id);
  hobbyDb.get('hobbies').remove({ id }).write();
  res.json({ message: 'Hobby deleted successfully' });
});

// ... (rest of the code remains unchanged)
