import express from 'express'
import { UserModel } from '../model/user.js'
import jwt from 'jsonwebtoken'
import { userPrivateFields } from './../model/user.js';
const router = express.Router()

router.post('/', async (req, res) => {
    if (!req.body.email || !req.body.password) return res.status(400).send({message: 'Invalid email or password'})
    try {
        const user = await UserModel.findOne({ email: req.body.email, password: req.body.password}).select({ password: 0}).populate('relationship.user', userPrivateFields)
        if (user) res.send({
            success: user ? true : false,
            data: user,
            message: 'Get user successfully',
            token: user && jwt.sign({id: user._id}, process.env.JWT_SECRET_KEY)
        })
        else {
            res.status(400).send({message: 'Invalid email or password'})
        }
    } 
    catch (error) {
        res.send(error)
    }
})

export default router