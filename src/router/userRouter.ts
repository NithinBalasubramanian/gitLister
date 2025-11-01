import express, { Router } from 'express';
import userController from '../controller/userController';
import Auth from '../middleware/auth';

const userRouter: Router = express.Router();

userRouter.post('/addUser', userController.addUserData);
userRouter.post('/login', userController.login);
userRouter.get('/getProfile' , Auth, userController.getProfile);

export default userRouter;

