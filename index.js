const express = require('express');
const bodyParser = require('body-parser');
const i18n = require('./i18n/config');
const sequelize = require('./utils/database');
const { errors } = require('celebrate');
const indexRoutes = require('./routes/index.routes');

const app = express();
const port = 3000;

// Add middleware to parse incoming requests with JSON payloads
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(errors()); // Middleware to handle Joi validation errors

app.use((req, res, next) => {
  const language = req.query.lang || 'en'; // Default to English
  i18n.setLocale(language);
  next();
});

// Test the connection to the database
sequelize
  .authenticate()
  .then(() => {
    console.log(
      'Connection to mysql database has been established successfully.'
    );
  })
  .catch((err) => {
    console.error('Unable to connect to the database:', err);
  });

app.use('/', indexRoutes); // Add routes to the application

app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});

module.exports = app;
