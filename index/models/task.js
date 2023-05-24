const { Sequelize, DataTypes } =  require('sequelize');
const sequelize = require('../config/database');
const User = require('../models/user');

const Task = sequelize.define('Task',
    {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        title: {
            type: DataTypes.STRING,
            allowNull: false
        },
        status: {
            type: Sequelize.ENUM('0', '1', '2'),
            allowNull: true,
            defaultValue: '0'
        },
        path: {
            type: DataTypes.STRING,
            allowNull: true,
            defaultValue: ''
        },
    }
);

// Define the association between User and Task
Task.belongsTo(User, { foreignKey: 'userId' });

module.exports = Task;

