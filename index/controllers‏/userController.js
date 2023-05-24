const { Sequelize } = require('sequelize');
const Joi = require('joi');
const User = require('../models/user');
const Task = require('../models/task');

//createUser
const createUser = async (req, res) => {
    try {
        //validate the input
        const schema = Joi.object({
            name: Joi.string().required(),
        });

        const { error } = schema.validate(req.body);
        if (error) {
            return res.status(400).json({ message: error.details[0].message });
        }

        const user = await User.create({
            name: req.body.name,
        });

        res.status(201).json({ user });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Get all users
const getAllUsers = async (req, res) => {
    try {
        const users = await User.findAll();
        res.status(200).json({ users });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Get user by id
const getUserById = async (req, res) => {
    try {
        const user = await User.findByPk(req.params.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json({ user });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Update a user
const updateUser = async (req, res) => {
    try {
        // Validate user input
        const schema = Joi.object({
            name: Joi.string(),
        });

        const { error } = schema.validate(req.body);
        if (error) {
            return res.status(400).json({ message: error.details[0].message });
        }

        const user = await User.findByPk(req.params.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        await user.update(req.body);
        res.status(200).json({ user });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Delete a user
const deleteUser = async (req, res) => {
    try {
        const user = await User.findByPk(req.params.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        await user.destroy();
        res.status(200).json({ message: 'User deleted' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

//get all tasks that related to a user by user id
const getTasksByUserId = async (req, res) => {
    try {
        const tasks = await Task.findAll({
            where: { userId: req.params.userId },
        });
        res.status(200).json({ tasks });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

//get only users that have tasks in  “in progress” status
const getUsersWithInProgressTasks = async (req, res) => {
    try {
        const users = await User.findAll({
            include: [
                {
                    model: Task,
                    where: { status: '1' }
                }
            ]
        });
        res.status(200).json(users);
    } catch (error) {
        console.error('Error getting users with in-progress tasks:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

//get the number of tasks we have in each status by user id
const getUserStatusTaskCount = async (req, res) => {
    try {
        const { userId } = req.params;
        const statusCounts = await Task.findAll({
            where: { userId },
            attributes: ['status', [Sequelize.fn('COUNT', Sequelize.col('userId')), 'count']],
            group: 'status'
        });
        res.status(200).json(statusCounts);
    } catch (error) {
        console.error('Error getting task status counts by user ID:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

module.exports = {
    createUser,
    getUserById,
    getAllUsers,
    updateUser,
    deleteUser,
    getTasksByUserId,
    getUsersWithInProgressTasks,
    getUserStatusTaskCount
}
// Add more functions as needed
