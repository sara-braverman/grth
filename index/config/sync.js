const sequelize = require('./database');
const User = require('../models/user');
const Task = require('../models/task');

sequelize.sync().then(() => {
  console.log('Database synchronized');
}).catch(error => {
  console.log('Error synchronizing database:', error);
});

