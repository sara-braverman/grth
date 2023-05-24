const router = require("express").Router();
const taskController = require('../controllers‏/taskController');

router.post('/', taskController.createTask);
router.get('/', taskController.getAllTasks);
router.get('/:id', taskController.getTaskById);
router.put('/:id', taskController.updateTask);
router.delete('/:id', taskController.deleteTask);
router.get('/task-status-count/', taskController.getTaskStatusCount);

module.exports = router;