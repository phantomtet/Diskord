import mongoose from 'mongoose'
import express from 'express'
import { UserModel } from '../model/user.js'

const router = express.Router()

router.post('/', async (req, res) => {
    try {
        const createAction = await UserModel.create({ username: req.body.username, password: req.body.password })
        res.send(createAction)
        
    } catch (error) {
        res.send(error)
    }
})

export default router