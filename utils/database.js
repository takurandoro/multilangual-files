const { Sequelize } = require('sequelize');
const { env } = require('node:process');
const dotenv = require('dotenv');

dotenv.config();

const sequelize = new Sequelize({
  dialect: 'mysql',
  database: env.DATABASE,
  username: env.MYSQL_USER,
  password: env.MYSQL_PASSWORD,
  host: env.HOST,
  port: env.PORT,
  logging: false,
});

sequelize.sync({
  alter: true,
});

module.exports = sequelize;
