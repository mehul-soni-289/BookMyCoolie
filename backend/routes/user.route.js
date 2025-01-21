import express from 'express'
import { registerUser , loginUser } from '../controllers/user.controller.js'
import { verifyJWT } from '../middleware/auth.middleware.js'


const userRouter = express.Router()


userRouter.post('/register' , registerUser)
userRouter.post('/login'  , loginUser)


export {userRouter}