const { Sequelize } = require('sequelize');
const {development} = require('./config.json')

const sequelize = new Sequelize(development.database, development.username , development.password, {
  host: 'localhost',
  dialect: 'mysql',
});

module.exports = sequelize;
