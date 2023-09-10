const {Router} = require('express');

const userRouter = Router();

const userController = require('../controller/userController');

//POST
userRouter.post('/register',userController.register);
userRouter.post('/login',userController.login);

module.exports = userRouter;

