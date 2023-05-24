const { Sequelize } = require('sequelize');
const Task = require('../models/task');
const path = require('path');
const axios = require('axios');
const Joi = require('joi');
const fs = require('fs');

//add image of robohash to folder
async function addRoboHashImage(title) {
    const firstWord = title.split(' ')[0];
    const imagePath = path.join(__dirname, '../images', `${firstWord}.png`);
    const imageUrl = `https://robohash.org/${firstWord}.png`;
    const response = await axios.get(imageUrl, { responseType: 'stream' });
    response.data.pipe(fs.createWriteStream(imagePath));
    return `../images/${firstWord}.png`;
}

//createTask
const createTask = async (req, res) => {
    try {
        //validate the input
        const schema = Joi.object({
            title: Joi.string().required(),
            status: Joi.string().valid('0', '1', '2'),
            userId: Joi.number().integer().min(0).max(1000),
        });

        const { error } = schema.validate(req.body);
        if (error) {
            return res.status(400).json({ message: error.details[0].message });
        }

        //add image of first word
        const pathImage = await addRoboHashImage(req.body.title);
        let task = await Task.create({
            title: req.body.title,
            status: req.body.status,
            userId: req.body.userId,
            path: pathImage
        });
        res.status(201).json({ task });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Get all users
const getAllTasks = async (req, res) => {
    try {
        const tasks = await Task.findAll();
        res.status(200).json({ tasks });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Get user by id
const getTaskById = async (req, res) => {
    try {
        const task = await Task.findByPk(req.params.id);
        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }
        res.status(200).json({ task });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Update a user
const updateTask = async (req, res) => {
    try {
        // Validate user input
        const schema = Joi.object({
            title: Joi.string(),
            status: Joi.string().valid('0', '1', '2'),
            userId: Joi.number().integer().min(0).max(1000),
        });

        const { error } = schema.validate(req.body);
        if (error) {
            return res.status(400).json({ message: error.details[0].message });
        }

        const task = await Task.findByPk(req.params.id);
        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }
        await task.update(req.body);
        res.status(200).json({ task });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Delete a user
const deleteTask = async (req, res) => {
    try {
        const task = await Task.findByPk(req.params.id);
        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }
        await task.destroy();
        res.status(200).json({ message: 'Task deleted' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

//get the number of total tasks we have in each status
const getTaskStatusCount = async (req, res) => {
    try {
        const statusCounts = await Task.findAll({
            attributes: ['status', [Sequelize.fn('COUNT', Sequelize.col('id')), 'count']],
            group: 'status'
        });
        res.status(200).json(statusCounts);
    } catch (error) {
        console.error('Error getting task status counts:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

module.exports = {
    createTask,
    getTaskById,
    getAllTasks,
    updateTask,
    deleteTask,
    getTaskStatusCount
}
// Add more functions as needed
