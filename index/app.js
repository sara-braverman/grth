const express = require("express");
const sequelize = require('./config/database');
const sync = require('./config/sync')

const app = express();

// Middleware
app.use(express.json());

// Routes
app.use("/users", require("./routes‏/userRoutes"));
app.use("/tasks", require("./routes‏/taskRoutes"));

// Connect to database and start server
sequelize
  .authenticate()
  .then(() => {
    console.log('Connected to database');
    app.listen(3000, () => {
      console.log('Server started on port 3000');
    });
  })
  .catch((error) => {
    console.error('Unable to connect to database:', error);
  });
