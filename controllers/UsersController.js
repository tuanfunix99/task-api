

//Dependencies
const Users = require('../models/Users');
const bcrypt = require('bcryptjs');
const sharp = require('sharp');


//get users controller
exports.getUsers = async (req, res, next) => {
    try{
        const user = req.user;
        res.status(200).send(user);
    } catch (error) {
        res.status(404).json({message: error.message, data: undefined});
    }
}



//get one user controller
exports.getOneUser = async (req, res, next) =>{
    const userId = req.params.userId;

    try {
        const user = await Users.findById(userId);
        res.status(200).json(user);
    } catch (error) {
        res.status(404).json({message: error.message, data: undefined});
    }
}


//create new user controller
exports.createNewUser = async (req, res, next) => {
    const name = req.body.name;
    const age = req.body.age;
    const email = req.body.email;
    const password = req.body.password;
    let user = new Users({name, age, email, password});
    try {
        await user.save();
        const token = await user.generateAuthToken();
        res.status(201).json({message: undefined, data: user, token: token});
    } catch (error) {
        res.status(401).json({message: error.message, data: null});
    }
}


//update user
exports.updateUser = async (req, res, next) => {
    const updates = Object.keys(req.body);
    try {
        updates.forEach(update => req.user[update] = req.body[update]);
        await req.user.updateOne();
        res.status(200).json({message: null, data: req.user})
    } catch(error) {
        res.status(404).json({message: error.message, data: null});
    }
}


//delete user
exports.deleteUser = async (req, res, next) => {
    try{
        await req.user.remove();
        res.status(200).json({message: null, data: req.user})
    }catch (error) {
        res.status(404).json({message: error.message, data: null});
    }   
}


//login controller
exports.loginController = async (req, res, next) => {
    try {
        const user = await Users.findByCredentials(req.body.email, req.body.password);
        const token = await user.generateAuthToken();
        res.status(201).json({message: null, data: user, token: token});
    } catch (error) {
        res.status(404).json({message: error.message, data: null});
    }
}


//logout controller
exports.logoutController = async (req, res, next) => {
    try{
        req.user.tokens = req.user.tokens.filter(token => token.token !== req.token);
        delete req.headers['Authorization'];
        await req.user.save();
        res.status(200).json({message:'success'});
    }
    catch(error) {
        res.status(401).json({message: error.message});
    }
}


//upload images
exports.uploadAvatar = async (req, res, next) => {
    try {
        const buffer = await sharp(req.file.buffer).resize(250, 250).png().toBuffer();
        req.user.avatar = buffer;
        await req.user.save();
        res.send({message: 'success'});
    } catch (error) {
        res.status(404).json({message: error.message, data: null});
    }
}


//get avatar
exports.getAvatar = async (req, res, next) => {
    try {
        const userId = req.params.id;
        const user = await Users.findById(userId);
        if(!user || !user.avatar){
            throw new Error();
        }
        res.set('Content-Type', 'image/jpg');
        res.send(user.avatar);
    } catch (error) {
        res.status(404).json({message: 'error', data: null});
    }
}