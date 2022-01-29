import express from 'express'
import { UserModel } from '../model/user.js'

const router = express.Router()

router.post('/', async (req, res) => {
    try {
        const user = await UserModel.findOne({ username: req.body.username, password: req.body.password})
        res.send({
            success: user ? true : false,
            data: user,
            message: user ? 'Get user successfully' : 'Invalid email or password'
        })
    } 
    catch (error) {
        res.send(error)
    }
})

export default router