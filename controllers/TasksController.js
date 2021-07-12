

//Dependencies
const Tasks = require('../models/Tasks');


//get tasks controller
exports.getTasks = async (req, res, next) => {
    const completed = req.query.completed ? req.query.completed : false;
    try{
        await req.user.populate({
            path: 'tasks',
            match: {
                completed: completed
            },
            options: {
                limit: 2,
                skip: 2,
                sort:{
                    createdAt: 1
                }
        }
        }).execPopulate();
        res.status(200).json(req.user.tasks);
    } catch (error) {
        res.status(404).json({message: error.message, data: undefined});
    }
}

//get one task controller
exports.getOneTask = async (req, res, next) =>{
    const taskId = req.params.taskId;
    try {
        const task = await Tasks.findOne({_id: taskId, owner: req.user._id});
        res.status(200).json(task);
    } catch (error) {
        res.status(404).json({message: error.message, data: undefined});
    }
}


//get count 
exports.countCompleted = async (req, res, next) =>{
    try {
        const amount = await Tasks.countDocuments({ completed: false });
        res.status(200).json({message: null, data: amount});
    } catch (error) {
        res.status(404).json({message: error.message, data: null});
    }
}

//create new task controller
exports.createNewTask = async (req, res, next) => {
    let task = new Tasks({...req.body, owner: req.user._id});
    try {
        await task.save();
        res.status(201).json({message: undefined, data: task});
    } catch (error) {
        res.status(401).json({message: error.message, data: null});
    }
}


//update task
exports.updateTask = async (req, res, next) => {
    const taskId = req.params.taskId;
    const description = req.body.description;
    const completed = req.body.completed;
    try {
        let task = await Tasks.findById(taskId);
        task.description = description;
        task.completed = completed;
        task = await task.save();
        res.status(200).json({message: null, data: task})
    } catch(error) {
        res.status(404).json({message: error.message, data: null});
    }
}


//delete task
exports.deleteTask = async (req, res, next) => {
    const taskId = req.params.taskId;
    try{
        const task = await Tasks.findByIdAndRemove(taskId);
        res.status(200).json({message: null, data: task})
    }catch (error) {
        res.status(404).json({message: error.message, data: null});
    }   
}