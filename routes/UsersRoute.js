//Dependencies
const express = require("express");
const userControllers = require("../controllers/UsersController");
const authMiddleWares = require("../middleware/auth");

//Inatantiate router
const router = express.Router();

//get users
router.get("/me", authMiddleWares.auth, userControllers.getUsers);

//get one user
router.get("/:userId", userControllers.getOneUser);

//get avatar
router.get('/:id/avatar', userControllers.getAvatar);

//create new user
router.post("/", userControllers.createNewUser);

//post login
router.post("/login", userControllers.loginController);

//post logout
router.post("/logout", authMiddleWares.auth, userControllers.logoutController);

//update user
router.patch("/me", authMiddleWares.auth, userControllers.updateUser);

//delete user
router.delete("/me", authMiddleWares.auth, userControllers.deleteUser);

//upload avatar
router.post("/me/avatar", authMiddleWares.auth, userControllers.uploadAvatar);

//export the module
module.exports = router;
