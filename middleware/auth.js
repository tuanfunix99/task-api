
//Dependenncies
const jwt = require('jsonwebtoken');
const Users = require('../models/Users');

exports.auth = async (req, res, next) => {
    try{
        const token = req.header('Authorization');
        const decode = jwt.verify(token, 'this is my account');
        const user = await Users.findOne({_id: decode._id, 'tokens.token': token});
        if(!user){
            throw new Error();
        }
        req.token = token;
        req.user = user;
        next();
    }
    catch(error){
        res.status(401).json({message: error.message});
    }
}