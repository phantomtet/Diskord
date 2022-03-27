import express from 'express'
import { UserModel } from '../model/user.js'
import jwt from 'jsonwebtoken'
import { userPrivateFields } from './../model/user.js';
const router = express.Router()

router.post('/', async (req, res) => {
    try {
        const user = await UserModel.findOne({ email: req.body.email, password: req.body.password}).select({ password: 0}).populate('relationship.user', userPrivateFields)
        res.send({
            success: user ? true : false,
            data: user,
            message: user ? 'Get user successfully' : 'Invalid email or password',
            token: user && jwt.sign({id: user._id}, process.env.JWT_SECRET_KEY)
        })
    } 
    catch (error) {
        res.send(error)
    }
})

export default router