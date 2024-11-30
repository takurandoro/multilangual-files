const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const port = 3000;

// Add middleware to parse incoming requests with JSON payloads
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.get('/api', (req, res) => {
  res.status(200).send('Welcome to Files Manager API');
});

app.get('/api/users', (req, res) => {
  res.status(200).send('List of users');
});

let files = []; // This will act as our in-memory file database
let users = []; // This will act as our in-memory user database

// CREATE FILE
app.post('/files', (req, res) => {
  const file = req.body;
  files.push(file);
  res.status(201).send(file);
});

// READ all files
app.get('/api/files', (req, res) => {
  res.status(200).send(files);
});

// READ a single file by filename
app.get('/files/:filename', (req, res) => {
  const { filename } = req.params;
  const file = files.find((f) => f.filename === filename);
  if (file) {
    res.status(200).send(file);
  } else {
    res.status(404).send('File not found');
  }
});

// UPDATE FILE
app.put('/files/:filename', (req, res) => {
  const { filename } = req.params;
  const index = files.findIndex((f) => f.filename === filename);
  if (index > -1) {
    const updatedFile = { ...files[index], ...req.body };
    files[index] = updatedFile;
    res.status(200).send(updatedFile);
  } else {
    res.status(404).send('File not found');
  }
});

// DELETE FILE
app.delete('/files/:filename', (req, res) => {
  const { filename } = req.params;
  const index = files.findIndex((f) => f.filename === filename);
  if (index > -1) {
    files.splice(index, 1);
    res.status(204).send();
  } else {
    res.status(404).send('File not found');
  }
});

// CREATE USER
app.post('/users', (req, res) => {
  const user = req.body;
  if (users.find((u) => u.username === user.username)) {
    return res.status(400).send('User already exists');
  }
  users.push(user);
  res.status(201).send(user);
});

// LOGIN
app.post('/login', (req, res) => {
  const { username, password } = req.body;
  const user = users.find(
    (u) => u.username === username && u.password === password
  );
  if (user) {
    res.status(200).send('Login successful');
  } else {
    res.status(401).send('Invalid credentials');
  }
});

if (require.main === module) {
  app.listen(port, () => {
    console.log(`Server is running on port: ${port}`);
  });
} else {
  module.exports = app;
}
