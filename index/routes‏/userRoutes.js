const router = require("express").Router();
const userController = require('../controllers‏/userController');

router.post('/', userController.createUser);
router.get('/', userController.getAllUsers);
router.get('/:id', userController.getUserById);
router.put('/:id', userController.updateUser);
router.delete('/:id', userController.deleteUser);
router.get('/tasks/:userId', userController.getTasksByUserId);
router.get('/in-progress-tasks', userController.getUsersWithInProgressTasks);
router.get('/task-status-count/:userId', userController.getUserStatusTaskCount);

module.exports = router;
