const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());

let entities = []; // In-memory database for entities
let hobbies = []; // In-memory database for hobbies

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
  entities.push(newEntity);
  res.json(newEntity);
});

// Read all Entities with pagination
app.get('/entity', (req, res) => {
  const limit = parseInt(req.query.limit) || 10;
  const offset = parseInt(req.query.offset) || 0;
  const paginatedEntities = entities.slice(offset, offset + limit);
  res.json(paginatedEntities);
});

// Read Entity by ID
app.get('/entity/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const entity = entities.find(ent => ent.id === id);
  if (entity) {
    res.json(entity);
  } else {
    res.status(404).json({ error: 'Entity not found' });
  }
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

  const index = entities.findIndex(ent => ent.id === id);
  if (index !== -1) {
    const updatedEntity = { ...entities[index], name, otherField };
    entities[index] = updatedEntity;
    res.json(updatedEntity);
  } else {
    res.status(404).json({ error: 'Entity not found' });
  }
});

// Delete Entity
app.delete('/entity/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const index = entities.findIndex(ent => ent.id === id);
  if (index !== -1) {
    entities.splice(index, 1);
    res.json({ message: 'Entity deleted successfully' });
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

  const searchResults = entities.filter(ent => ent.name.includes(searchTerm));
  res.json(searchResults);
});

// Create Hobby
app.post('/hobby', (req, res) => {
  const { name } = req.body;
  if (!name) {
    return res.status(400).json({ error: 'Hobby name cannot be empty' });
  }

  const newHobby = { id: Date.now(), name };
  hobbies.push(newHobby);
  res.json(newHobby);
});

// Read all Hobbies with pagination
app.get('/hobby', (req, res) => {
  const limit = parseInt(req.query.limit) || 10;
  const offset = parseInt(req.query.offset) || 0;
  const paginatedHobbies = hobbies.slice(offset, offset + limit);
  res.json(paginatedHobbies);
});

// Read Hobby by ID
app.get('/hobby/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const hobby = hobbies.find(h => h.id === id);
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

  const index = hobbies.findIndex(h => h.id === id);
  if (index !== -1) {
    const updatedHobby = { ...hobbies[index], name };
    hobbies[index] = updatedHobby;
    res.json(updatedHobby);
  } else {
    res.status(404).json({ error: 'Hobby not found' });
  }
});

// Delete Hobby
app.delete('/hobby/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const index = hobbies.findIndex(h => h.id === id);
  if (index !== -1) {
    hobbies.splice(index, 1);
    res.json({ message: 'Hobby deleted successfully' });
  } else {
    res.status(404).json({ error: 'Hobby not found' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
