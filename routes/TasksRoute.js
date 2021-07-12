

//Dependencies
const express = require('express');
const taskControllers = require('../controllers/TasksController');
const authMiddleware = require('../middleware/auth');


//Inatantiate router
const router = express.Router();


//get tasks
router.get('/', authMiddleware.auth, taskControllers.getTasks);


//get count
router.get('/count', taskControllers.countCompleted);


//get one task
router.get('/:taskId', authMiddleware.auth, taskControllers.getOneTask);


//create new task
router.post('/', authMiddleware.auth, taskControllers.createNewTask);


//update task
router.put('/:taskId/', authMiddleware.auth, taskControllers.updateTask);


//delete task
router.delete('/:taskId/', authMiddleware.auth, taskControllers.deleteTask);

//export the module
module.exports = router;